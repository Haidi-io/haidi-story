"use client";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { damp3 } from "maath/easing";
import { useScrollStore } from "@/lib/scrollStore";
import { cameraLookCurve, cameraPosCurve, MAX_COORD } from "./sceneConfig";
import { runtime } from "./runtime";

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

export function CameraRig({ parallax = 1 }: { parallax?: number }) {
  const pos = useRef(new THREE.Vector3(0, 0.5, 14));
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const ptr = useRef(new THREE.Vector2());

  useFrame(({ camera }, dt) => {
    const step = Math.min(dt, 0.05);
    const t = THREE.MathUtils.clamp(runtime.coord / MAX_COORD, 0, 1);
    cameraPosCurve.getPoint(t, tmpPos);
    cameraLookCurve.getPoint(t, tmpLook);

    const p = useScrollStore.getState().pointer;
    ptr.current.x = THREE.MathUtils.damp(ptr.current.x, p.x, 3, step);
    ptr.current.y = THREE.MathUtils.damp(ptr.current.y, p.y, 3, step);
    tmpPos.x += ptr.current.x * 0.35 * parallax;
    tmpPos.y += ptr.current.y * 0.25 * parallax;

    damp3(pos.current, tmpPos, 0.35, step);
    damp3(look.current, tmpLook, 0.35, step);

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
    camera.rotateZ(runtime.current.roll);
  }, -5);

  return null;
}
