"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { COLORS } from "./sceneConfig";
import { SceneDriver } from "./SceneDriver";
import { CameraRig } from "./CameraRig";
import { ParticleField } from "./ParticleField";
import { ForecastRibbon } from "./ForecastRibbon";
import { InventoryBars } from "./InventoryBars";
import { GridPlane } from "./GridPlane";
import { SupplyNetwork } from "./SupplyNetwork";
import { LaunchTimeline } from "./LaunchTimeline";
import type { Tier } from "@/lib/scrollStore";

export default function Scene({ tier }: { tier: Tier }) {
  const lite = tier === "lite";
  return (
    <Canvas
      dpr={lite ? [1, 1.25] : [1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: 45, near: 0.1, far: 80, position: [0, 0.5, 14] }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(COLORS.canvas, 1);
        scene.fog = new THREE.Fog(COLORS.canvas, 12, 42);
        gl.toneMapping = THREE.NoToneMapping;
      }}
      frameloop="always"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      eventSource={undefined}
    >
      <SceneDriver />
      <CameraRig parallax={lite ? 0.4 : 1} />
      <Suspense fallback={null}>
        <ParticleField count={lite ? 5000 : 18000} />
        <ForecastRibbon />
        <InventoryBars />
        <GridPlane />
        <SupplyNetwork />
        <LaunchTimeline />
      </Suspense>
    </Canvas>
  );
}
