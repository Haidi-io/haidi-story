"use client";
import { useFrame } from "@react-three/fiber";
import { damp, damp3 } from "maath/easing";
import { useScrollStore } from "@/lib/scrollStore";
import { sceneState } from "./sceneConfig";
import { runtime } from "./runtime";

const SCALAR_KEYS = [
  "calm",
  "chaos",
  "morph",
  "split",
  "condense",
  "particleAlpha",
  "ribbon",
  "bars",
  "grid",
  "network",
  "flow",
  "networkAlpha",
  "launch",
  "ignite",
  "lift",
  "roll",
] as const;

/** Runs first each frame (priority -10): reads scroll, damps all scene values. */
export function SceneDriver() {
  useFrame((_, dt) => {
    const s = useScrollStore.getState();
    runtime.coord = s.coord;
    runtime.velocity = s.velocity;
    runtime.time += Math.min(dt, 0.05);
    sceneState(s.coord, runtime.target);
    const step = Math.min(dt, 0.05);
    for (const k of SCALAR_KEYS) {
      damp(runtime.current, k, runtime.target[k], 0.22, step);
    }
    damp3(runtime.current.fieldOffset, runtime.target.fieldOffset, 0.5, step);
  }, -10);
  return null;
}
