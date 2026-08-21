"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS, WORLD } from "./sceneConfig";
import { runtime } from "./runtime";

const STEPS = 5;

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(95,208,210,0.9)");
  g.addColorStop(0.5, "rgba(71,185,187,0.25)");
  g.addColorStop(1, "rgba(71,185,187,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Vertical onboarding timeline: a thin rail + 5 emissive markers; the top one ignites at launch. */
export function LaunchTimeline() {
  const marks = useRef<THREE.InstancedMesh>(null);
  const halos = useRef<THREE.InstancedMesh>(null);
  const rail = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.Sprite>(null);
  const ring = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const white = useMemo(() => new THREE.Color("#EAFBFB"), []);
  const coral = useMemo(() => new THREE.Color(COLORS.coral), []);
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const C = WORLD.launchCenter;
  const ys = useMemo(
    () => Array.from({ length: STEPS }, (_, i) => WORLD.launchBaseY + (i / (STEPS - 1)) * (WORLD.launchTopY - WORLD.launchBaseY)),
    [],
  );
  const topX = C.x + Math.sin((STEPS - 1) * 1.7) * 0.8;

  useFrame(() => {
    const c = runtime.current;
    const vis = Math.min(c.launch * 4, 1);
    if (rail.current) rail.current.opacity = vis * 0.35;
    for (let i = 0; i < STEPS; i++) {
      const lit = Math.min(Math.max(c.launch * (STEPS + 0.5) - i, 0), 1);
      const top = i === STEPS - 1;
      const ign = top ? c.ignite : 0;
      const x = C.x + Math.sin(i * 1.7) * 0.8;
      dummy.position.set(x, ys[i], C.z);
      dummy.scale.setScalar(0.08 + 0.08 * lit + 0.25 * ign);
      dummy.updateMatrix();
      marks.current?.setMatrixAt(i, dummy.matrix);
      color.set(COLORS.bright).lerp(coral, top ? lit * (1 - ign) : 0).lerp(white, ign);
      marks.current?.setColorAt(i, color);

      dummy.scale.setScalar((0.25 + 0.12 * Math.sin(runtime.time * 2 + i)) * lit * (1 + 3 * ign));
      dummy.updateMatrix();
      halos.current?.setMatrixAt(i, dummy.matrix);
    }
    if (marks.current) {
      marks.current.instanceMatrix.needsUpdate = true;
      if (marks.current.instanceColor) marks.current.instanceColor.needsUpdate = true;
      (marks.current.material as THREE.MeshBasicMaterial).opacity = vis;
    }
    if (halos.current) {
      halos.current.instanceMatrix.needsUpdate = true;
      (halos.current.material as THREE.MeshBasicMaterial).opacity = vis * (0.18 + 0.25 * c.ignite);
    }
    if (glow.current) {
      const s = 4 + 6 * c.ignite;
      glow.current.scale.set(s, s, 1);
      (glow.current.material as THREE.SpriteMaterial).opacity = 0.35 * c.ignite * (0.85 + 0.15 * Math.sin(runtime.time * 3));
    }
    if (ring.current) {
      const t = (runtime.time * 0.6) % 1;
      const s = 0.3 + 4 * t;
      ring.current.scale.set(s, s, s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.5 * c.ignite;
    }
  });

  return (
    <group>
      <mesh position={[C.x, (WORLD.launchBaseY + WORLD.launchTopY) / 2, C.z]}>
        <cylinderGeometry args={[0.01, 0.01, WORLD.launchTopY - WORLD.launchBaseY + 1, 6]} />
        <meshBasicMaterial ref={rail} color={COLORS.teal} transparent opacity={0} depthWrite={false} />
      </mesh>
      <instancedMesh ref={marks} args={[undefined, undefined, STEPS]}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={halos} args={[undefined, undefined, STEPS]}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial color={COLORS.teal} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      {/* ignition glow + expanding ring at the top marker */}
      <sprite ref={glow} position={[topX, ys[STEPS - 1], C.z]}>
        <spriteMaterial map={glowTex} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh ref={ring} position={[topX, ys[STEPS - 1], C.z]}>
        <ringGeometry args={[0.92, 1, 48]} />
        <meshBasicMaterial
          color={COLORS.bright}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
