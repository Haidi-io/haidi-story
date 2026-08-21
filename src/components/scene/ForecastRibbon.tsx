"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { branchOffset, COLORS, FORK_T, ribbonCurve } from "./sceneConfig";
import { runtime } from "./runtime";

function branchCurve(branch: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = FORK_T + (i / 40) * (1 - FORK_T);
    pts.push(ribbonCurve.getPointAt(t).add(branchOffset(t, branch)));
  }
  return new THREE.CatmullRomCurve3(pts);
}

/** Forecast line, translucent confidence band, and two scenario branches. */
export function ForecastRibbon() {
  const line = useRef<THREE.MeshBasicMaterial>(null);
  const band = useRef<THREE.MeshBasicMaterial>(null);
  const b1 = useRef<THREE.MeshBasicMaterial>(null);
  const b2 = useRef<THREE.MeshBasicMaterial>(null);
  const marks = useRef<THREE.InstancedMesh>(null);

  const { lineGeo, bandGeo, br1, br2, markPositions } = useMemo(() => {
    const lineGeo = new THREE.TubeGeometry(ribbonCurve, 160, 0.035, 8, false);
    const bandGeo = new THREE.TubeGeometry(ribbonCurve, 120, 0.32, 12, false);
    const br1 = new THREE.TubeGeometry(branchCurve(1), 60, 0.03, 8, false);
    const br2 = new THREE.TubeGeometry(branchCurve(2), 60, 0.03, 8, false);
    const markPositions = [0.18, 0.41, 0.72].map((t) => ribbonCurve.getPointAt(t));
    return { lineGeo, bandGeo, br1, br2, markPositions };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const c = runtime.current;
    if (line.current) line.current.opacity = c.ribbon * 0.95;
    if (band.current) band.current.opacity = c.ribbon * 0.07;
    if (b1.current) b1.current.opacity = c.split * c.ribbon * 0.9;
    if (b2.current) b2.current.opacity = c.split * c.ribbon * 0.9;
    if (marks.current) {
      const s = c.ribbon * (0.9 + 0.15 * Math.sin(runtime.time * 2));
      markPositions.forEach((p, i) => {
        dummy.position.copy(p);
        dummy.scale.setScalar(s * 0.09);
        dummy.updateMatrix();
        marks.current!.setMatrixAt(i, dummy.matrix);
      });
      marks.current.instanceMatrix.needsUpdate = true;
      (marks.current.material as THREE.MeshBasicMaterial).opacity = c.ribbon;
    }
  });

  return (
    <group>
      <mesh geometry={lineGeo}>
        <meshBasicMaterial ref={line} color={COLORS.bright} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh geometry={bandGeo}>
        <meshBasicMaterial
          ref={band}
          color={COLORS.teal}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh geometry={br1}>
        <meshBasicMaterial ref={b1} color={COLORS.bright} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh geometry={br2}>
        <meshBasicMaterial ref={b2} color={COLORS.coral} transparent opacity={0} depthWrite={false} />
      </mesh>
      <instancedMesh ref={marks} args={[undefined, undefined, 3]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={COLORS.coral} transparent opacity={0} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}
