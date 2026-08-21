"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS } from "./sceneConfig";
import { runtime } from "./runtime";

const vert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const frag = /* glsl */ `
  precision highp float;
  uniform float uAlpha;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vec2 g = abs(fract(vPos.xz * 0.5 - 0.5) - 0.5) / fwidth(vPos.xz * 0.5);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float dist = length(vPos.xz);
    float fade = smoothstep(26.0, 4.0, dist);
    float pulse = 0.5 + 0.5 * sin(dist * 0.6 - uTime * 1.2);
    float a = line * fade * uAlpha * (0.25 + 0.35 * pulse);
    if (a < 0.005) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function GridPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uAlpha: { value: 0 }, uTime: { value: 0 }, uColor: { value: new THREE.Color(COLORS.teal) } }),
    [],
  );
  useFrame(() => {
    if (!mat.current) return;
    mat.current.uniforms.uAlpha.value = runtime.current.grid;
    mat.current.uniforms.uTime.value = runtime.time;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -3.2, -4]}>
      <planeGeometry args={[70, 70, 1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  );
}
