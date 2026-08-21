"use client";
import dynamic from "next/dynamic";
import { useTier } from "@/hooks/useTier";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

/** Fixed, full-viewport WebGL backdrop. Static tier renders a gradient poster. */
export function SceneCanvas() {
  const tier = useTier();
  if (tier === "static") {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 30%, rgba(71,185,187,0.22), transparent 70%), radial-gradient(40% 40% at 75% 70%, rgba(240,137,137,0.12), transparent 70%), #14161D",
        }}
      />
    );
  }
  return <Scene tier={tier} />;
}
