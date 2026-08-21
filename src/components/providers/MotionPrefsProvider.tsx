"use client";
import { useEffect } from "react";
import { useScrollStore, type Tier } from "@/lib/scrollStore";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Decides the experience tier once on mount and on media changes. */
export function MotionPrefsProvider({ children }: { children: React.ReactNode }) {
  const setPrefs = useScrollStore((s) => s.setPrefs);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 1023px)");
    const webgl = hasWebGL();

    const apply = () => {
      let tier: Tier = "full";
      if (rm.matches || !webgl) tier = "static";
      else if (narrow.matches) tier = "lite";
      setPrefs({ reducedMotion: rm.matches, tier });
      document.documentElement.dataset.tier = tier;
    };
    apply();
    rm.addEventListener("change", apply);
    narrow.addEventListener("change", apply);
    return () => {
      rm.removeEventListener("change", apply);
      narrow.removeEventListener("change", apply);
    };
  }, [setPrefs]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      useScrollStore
        .getState()
        .setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <>{children}</>;
}
