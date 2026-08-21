"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS, WORLD } from "./sceneConfig";
import { runtime } from "./runtime";

const HUBS = 3;
const PER_HUB = 19; // 3 hubs × 19 = 57 + 3 = 60 nodes

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hierarchical node graph: 3 system hubs (SAP) with clustered child nodes. */
export function SupplyNetwork() {
  const nodes = useRef<THREE.InstancedMesh>(null);
  const edges = useRef<THREE.LineSegments>(null);
  const flow = useRef<THREE.LineSegments>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const flowOffset = useMemo(() => ({ value: 0 }), []);
  // LineDashedMaterial has no dashOffset; inject one so the dashes travel along the edge.
  const onFlowCompile = useMemo(
    () => (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uDashOffset = flowOffset;
      shader.fragmentShader = shader.fragmentShader
        .replace("uniform float dashSize;", "uniform float dashSize;\nuniform float uDashOffset;")
        .replace("mod( vLineDistance,", "mod( vLineDistance + uDashOffset,");
    },
    [flowOffset],
  );

  const data = useMemo(() => {
    const rnd = mulberry32(42);
    const C = WORLD.networkCenter;
    const positions: THREE.Vector3[] = [];
    const hubIdx: number[] = [];
    const edgeList: Array<[number, number]> = [];
    for (let h = 0; h < HUBS; h++) {
      const ang = (h / HUBS) * Math.PI * 2 + 0.6;
      const hub = new THREE.Vector3(C.x + Math.cos(ang) * 3.2, C.y + (h - 1) * 0.8, C.z + Math.sin(ang) * 3.2);
      hubIdx.push(positions.length);
      positions.push(hub);
      for (let i = 0; i < PER_HUB; i++) {
        const r = 1.2 + rnd() * 2.4;
        const th = rnd() * Math.PI * 2;
        const ph = Math.acos(2 * rnd() - 1);
        const p = new THREE.Vector3(
          hub.x + r * Math.sin(ph) * Math.cos(th),
          hub.y + r * Math.cos(ph) * 0.7,
          hub.z + r * Math.sin(ph) * Math.sin(th),
        );
        const idx = positions.length;
        positions.push(p);
        edgeList.push([hubIdx[h], idx]);
        // a few lateral links
        if (i > 2 && rnd() < 0.3) edgeList.push([idx - 1 - Math.floor(rnd() * 2), idx]);
      }
    }
    // hub-to-hub (the integration flow edges)
    const flowList: Array<[number, number]> = [
      [hubIdx[0], hubIdx[1]],
      [hubIdx[1], hubIdx[2]],
      [hubIdx[2], hubIdx[0]],
    ];

    const toArray = (list: Array<[number, number]>) => {
      const arr = new Float32Array(list.length * 6);
      list.forEach(([a, b], i) => {
        positions[a].toArray(arr, i * 6);
        positions[b].toArray(arr, i * 6 + 3);
      });
      return arr;
    };
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(toArray(edgeList), 3));
    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute("position", new THREE.BufferAttribute(toArray(flowList), 3));
    return { positions, hubIdx, edgeGeo, flowGeo, edgeCount: edgeList.length };
  }, []);

  useFrame(() => {
    const c = runtime.current;
    const n = data.positions.length;
    if (nodes.current) {
      for (let i = 0; i < n; i++) {
        const isHub = data.hubIdx.includes(i);
        const wave = Math.min(Math.max(c.network * 1.4 - i / n, 0), 1);
        const s = (isHub ? 0.24 + 0.05 * Math.sin(runtime.time * 3 + i) : 0.085) * wave;
        dummy.position.copy(data.positions[i]);
        dummy.scale.setScalar(Math.max(s, 0.0001));
        dummy.updateMatrix();
        nodes.current.setMatrixAt(i, dummy.matrix);
        color.set(isHub ? COLORS.coral : COLORS.bright);
        nodes.current.setColorAt(i, color);
      }
      nodes.current.instanceMatrix.needsUpdate = true;
      if (nodes.current.instanceColor) nodes.current.instanceColor.needsUpdate = true;
      (nodes.current.material as THREE.MeshBasicMaterial).opacity = c.networkAlpha;
    }
    if (edges.current) {
      edges.current.geometry.setDrawRange(0, Math.floor(c.network * data.edgeCount) * 2);
      (edges.current.material as THREE.LineBasicMaterial).opacity = 0.6 * c.networkAlpha;
    }
    if (flow.current) {
      const m = flow.current.material as THREE.LineDashedMaterial;
      m.opacity = c.flow * c.networkAlpha;
      flowOffset.value = -runtime.time * 1.5;
    }
  });

  return (
    <group>
      <instancedMesh ref={nodes} args={[undefined, undefined, data.positions.length]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </instancedMesh>
      <lineSegments ref={edges} geometry={data.edgeGeo}>
        <lineBasicMaterial color={COLORS.teal} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <lineSegments
        ref={flow}
        geometry={data.flowGeo}
        onUpdate={(self) => self.computeLineDistances()}
      >
        <lineDashedMaterial
          color={COLORS.coral}
          dashSize={0.35}
          gapSize={0.25}
          transparent
          opacity={0}
          depthWrite={false}
          onBeforeCompile={onFlowCompile}
        />
      </lineSegments>
    </group>
  );
}
