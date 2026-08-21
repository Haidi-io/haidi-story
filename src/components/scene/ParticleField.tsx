"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { particleFrag, particleVert } from "./shaders/particles";
import { branchOffset, COLORS, ribbonCurve, WORLD } from "./sceneConfig";
import { runtime } from "./runtime";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticleField({ count = 18000 }: { count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const rnd = mulberry32(1337);
    const field = new Float32Array(count * 3);
    const lattice = new Float32Array(count * 3);
    const ribbon = new Float32Array(count * 3);
    const branch = new Float32Array(count * 3);
    const rand = new Float32Array(count * 4);
    const pt = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    // ordered lattice for the calm hero: a floor plane receding from the camera
    const cols = Math.ceil(Math.sqrt(count * 2));
    const rows = Math.ceil(count / cols);
    for (let i = 0; i < count; i++) {
      const cx = i % cols;
      const cz = Math.floor(i / cols);
      lattice[i * 3] = -18 + (cx / (cols - 1)) * 36 + (rnd() - 0.5) * 0.08;
      lattice[i * 3 + 1] = -1.6 + (rnd() - 0.5) * 0.08;
      lattice[i * 3 + 2] = -14 + (cz / Math.max(rows - 1, 1)) * 22 + (rnd() - 0.5) * 0.08;
    }

    for (let i = 0; i < count; i++) {
      // raw field: a soft ellipsoid cloud, denser in the middle
      const r = Math.pow(rnd(), 0.6) * 11;
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(2 * rnd() - 1);
      field[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.4;
      field[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      field[i * 3 + 2] = r * Math.cos(ph) * 0.9 - 1;

      // ribbon: along the forecast curve, inside a confidence band
      const t = rnd();
      ribbonCurve.getPointAt(t, pt);
      ribbonCurve.getTangentAt(t, tangent);
      normal.crossVectors(tangent, up).normalize();
      binormal.crossVectors(tangent, normal).normalize();
      const g = (rnd() + rnd() + rnd()) / 3 - 0.5; // ~gaussian
      const band = 0.45 * (0.6 + t * 0.8); // widens toward the horizon
      const ang = rnd() * Math.PI * 2;
      pt.addScaledVector(normal, Math.cos(ang) * g * band * 0.6);
      pt.addScaledVector(binormal, Math.sin(ang) * g * band);
      ribbon[i * 3] = pt.x;
      ribbon[i * 3 + 1] = pt.y;
      ribbon[i * 3 + 2] = pt.z;

      const b = Math.floor(rnd() * 3);
      const off = branchOffset(t, b);
      branch[i * 3] = off.x;
      branch[i * 3 + 1] = off.y;
      branch[i * 3 + 2] = off.z;

      rand[i * 4] = rnd() * 2 - 1;
      rand[i * 4 + 1] = rnd() * 2 - 1;
      rand[i * 4 + 2] = rnd() * 2 - 1;
      rand[i * 4 + 3] = rnd();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(field, 3));
    geo.setAttribute("aField", new THREE.BufferAttribute(field, 3));
    geo.setAttribute("aLattice", new THREE.BufferAttribute(lattice, 3));
    geo.setAttribute("aRibbon", new THREE.BufferAttribute(ribbon, 3));
    geo.setAttribute("aBranch", new THREE.BufferAttribute(branch, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(10, 0, -3), 40);
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCalm: { value: 1 },
      uChaos: { value: 0 },
      uMorph: { value: 0 },
      uSplit: { value: 0 },
      uCondense: { value: 0 },
      uLift: { value: 0 },
      uVelocity: { value: 0 },
      uAlpha: { value: 1 },
      uPointSize: { value: 2.2 },
      uPixelRatio: { value: 1 },
      uFieldOffset: { value: new THREE.Vector3() },
      uCondenseTarget: { value: WORLD.launchCenter.clone().setY(WORLD.launchBaseY) },
      uTeal: { value: new THREE.Color(COLORS.teal) },
      uBright: { value: new THREE.Color(COLORS.bright) },
      uCoral: { value: new THREE.Color(COLORS.coral) },
    }),
    [],
  );

  useFrame(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const c = runtime.current;
    u.uTime.value = runtime.time;
    u.uCalm.value = c.calm;
    u.uChaos.value = c.chaos;
    u.uMorph.value = c.morph;
    u.uSplit.value = c.split;
    u.uCondense.value = c.condense;
    u.uLift.value = c.lift;
    u.uAlpha.value = c.particleAlpha;
    u.uPixelRatio.value = dpr;
    u.uVelocity.value = THREE.MathUtils.damp(u.uVelocity.value, runtime.velocity, 4, 0.016);
    u.uFieldOffset.value.copy(c.fieldOffset);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
