"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS } from "./sceneConfig";
import { runtime } from "./runtime";

const N = 26;

/** Instanced inventory-position bars that rise beneath the forecast ribbon. */
export function InventoryBars() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const heights = useMemo(() => Array.from({ length: N }, (_, i) => 0.5 + 0.9 * Math.abs(Math.sin(i * 0.7)) + (i % 5) * 0.12), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const c = runtime.current;
    for (let i = 0; i < N; i++) {
      const x = -5.2 + (i / (N - 1)) * 10.4;
      const wave = Math.min(Math.max(c.bars * 1.6 - i / N, 0), 1);
      const h = heights[i] * wave;
      dummy.position.set(x, -2.9 + h / 2, -0.3);
      dummy.scale.set(0.22, Math.max(h, 0.001), 0.22);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      color.set(i % 7 === 3 ? COLORS.coral : COLORS.teal);
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    (m.material as THREE.MeshBasicMaterial).opacity = c.bars * 0.75;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </instancedMesh>
  );
}
