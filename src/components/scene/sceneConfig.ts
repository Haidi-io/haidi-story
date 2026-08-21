import * as THREE from "three";

/* ---------- world layout ---------- */
export const WORLD = {
  ribbonCenter: new THREE.Vector3(0, 0, 0),
  networkCenter: new THREE.Vector3(14, 0, -6),
  launchCenter: new THREE.Vector3(20, 1, -4),
  launchBaseY: -3,
  launchTopY: 5,
};

export const COLORS = {
  canvas: "#14161D",
  teal: "#47B9BB",
  bright: "#5FD0D2",
  deep: "#2E8E90",
  coral: "#F08989",
  navy: "#1D203E",
};

/* ---------- forecast ribbon curve (shared by particles + tube) ---------- */
export const ribbonCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-6, -0.6, 0),
    new THREE.Vector3(-4.2, -0.2, 0.2),
    new THREE.Vector3(-2.5, -0.7, -0.1),
    new THREE.Vector3(-0.8, 0.3, 0.1),
    new THREE.Vector3(1, 0.1, 0),
    new THREE.Vector3(2.8, 0.8, -0.2),
    new THREE.Vector3(4.5, 0.6, 0.1),
    new THREE.Vector3(6, 1.4, 0),
  ],
  false,
  "catmullrom",
  0.5,
);
/** t on the ribbon where scenarios fork */
export const FORK_T = 0.58;

export function branchOffset(t: number, branch: number): THREE.Vector3 {
  if (branch === 0 || t <= FORK_T) return new THREE.Vector3();
  const k = (t - FORK_T) / (1 - FORK_T);
  const dir = branch === 1 ? 1 : -1;
  return new THREE.Vector3(0, dir * k * k * 2.2, dir * k * 0.6);
}

/* ---------- camera path keyed by chapter coordinate (0..7 in 0.5 steps) ---------- */
const K = (px: number, py: number, pz: number, lx: number, ly: number, lz: number) => ({
  pos: new THREE.Vector3(px, py, pz),
  look: new THREE.Vector3(lx, ly, lz),
});
export const CAMERA_KNOTS = [
  K(0, 5.5, 13, 0, -3.5, -5), // 0   hero – looking down across the lattice
  K(0.6, 3.8, 11.5, 0, -2.2, -4), // 0.5
  K(1.2, 0, 10, 0, 0, -2), // 1   noise – push in
  K(-1, 0.6, 8, 0, 0, -2), // 1.5
  K(0, 0.9, 9.5, 0, 2.0, 0), // 2   ribbon front (framed low)
  K(4, 1.9, 7.5, 0.5, 1.9, 0), // 2.5 orbit
  K(6, 1.8, 8.5, 2, 1.2, 0), // 3   fork
  K(3, 0.8, 11.5, 1.5, -0.6, 0), // 3.5 pull back, bars
  K(0, 0, 13, 0, -1, 0), // 4   recede for product
  K(0, -0.6, 13, 0, -1.2, 0), // 4.5
  K(12, 2.5, 5, 14, 0, -6), // 5   network
  K(17.5, 1.5, 1.5, 14.5, 0, -6), // 5.5 flyover
  K(20, -2.5, 6.5, 20, -1, -4), // 6   launch base
  K(20, 2, 6.5, 20, 2, -4), // 6.5 climbing
  K(20, 5.5, 10, 20, 5.5, -4), // 7   outro – level with the top marker
  K(20.5, 6.5, 11, 20, 7, -4), // 7.5 tilting up with the stream
  K(21, 7.5, 12, 20, 8.5, -4), // 8   following the launch
];
export const MAX_COORD = (CAMERA_KNOTS.length - 1) / 2;
export const cameraPosCurve = new THREE.CatmullRomCurve3(
  CAMERA_KNOTS.map((k) => k.pos),
  false,
  "catmullrom",
  0.5,
);
export const cameraLookCurve = new THREE.CatmullRomCurve3(
  CAMERA_KNOTS.map((k) => k.look),
  false,
  "catmullrom",
  0.5,
);

/* ---------- scene state as a pure function of chapter coordinate ---------- */
export interface SceneState {
  calm: number;
  chaos: number;
  morph: number;
  split: number;
  condense: number;
  particleAlpha: number;
  ribbon: number;
  bars: number;
  grid: number;
  network: number;
  flow: number;
  networkAlpha: number;
  launch: number;
  ignite: number;
  lift: number;
  roll: number;
  fieldOffset: THREE.Vector3;
}

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const ramp = (c: number, a: number, b: number) => clamp01((c - a) / (b - a));
const smooth = (v: number) => v * v * (3 - 2 * v);

const tmpOffset = new THREE.Vector3();

export function sceneState(c: number, out: SceneState): SceneState {
  out.calm = 1 - smooth(ramp(c, 0.85, 1.35));
  const chaosUp = smooth(ramp(c, 0.95, 1.45));
  const chaosDown = smooth(ramp(c, 1.75, 2.3));
  out.chaos = chaosUp * (1 - chaosDown);

  const morphIn = smooth(ramp(c, 1.85, 2.45));
  const morphOut = smooth(ramp(c, 4.55, 5.1));
  out.morph = morphIn * (1 - morphOut);

  out.split = smooth(ramp(c, 3.0, 3.45)) * (1 - smooth(ramp(c, 4.5, 5.0)));
  out.ribbon = smooth(ramp(c, 2.05, 2.5)) * (1 - smooth(ramp(c, 3.75, 4.05)));
  out.bars = smooth(ramp(c, 3.35, 3.85)) * (1 - smooth(ramp(c, 3.8, 4.05)));

  // particles recede during product chapter, return as sparse field, condense at launch
  out.particleAlpha =
    1 - 0.82 * smooth(ramp(c, 3.75, 4.1)) + 0.55 * smooth(ramp(c, 4.8, 5.3)) - 0.15 * smooth(ramp(c, 6.9, 7.2));
  out.grid = smooth(ramp(c, 3.9, 4.25)) * (1 - smooth(ramp(c, 4.85, 5.3)));

  out.network = smooth(ramp(c, 4.95, 5.55));
  out.flow = smooth(ramp(c, 5.5, 5.9));
  out.networkAlpha = smooth(ramp(c, 4.9, 5.2)) * (1 - smooth(ramp(c, 5.95, 6.35)));

  out.condense = smooth(ramp(c, 5.9, 6.25)) * (1 - smooth(ramp(c, 6.35, 6.8)));
  out.launch = smooth(ramp(c, 6.15, 6.95));
  out.ignite = smooth(ramp(c, 7.05, 7.55));
  out.lift = smooth(ramp(c, 7.15, 7.95));

  out.roll = 0.09 * out.chaos * Math.sin(c * 5);

  // the particle cloud follows the camera to the network / launch areas
  const toNet = smooth(ramp(c, 4.5, 5.2));
  const toLaunch = smooth(ramp(c, 5.7, 6.3));
  tmpOffset.copy(WORLD.ribbonCenter).lerp(WORLD.networkCenter, toNet);
  out.fieldOffset.copy(tmpOffset).lerp(WORLD.launchCenter, toLaunch);
  return out;
}

export function createSceneState(): SceneState {
  return {
    calm: 1,
    chaos: 0,
    morph: 0,
    split: 0,
    condense: 0,
    particleAlpha: 1,
    ribbon: 0,
    bars: 0,
    grid: 0,
    network: 0,
    flow: 0,
    networkAlpha: 0,
    launch: 0,
    ignite: 0,
    lift: 0,
    roll: 0,
    fieldOffset: new THREE.Vector3(),
  };
}
