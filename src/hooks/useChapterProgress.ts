"use client";
import { useEffect, useReducer, useRef } from "react";
import { useScrollStore } from "@/lib/scrollStore";

/**
 * Subscribe to a chapter's local progress (0..1) without re-rendering.
 * `cb` runs whenever the value changes; also fires once on mount.
 */
export function useChapterProgress(index: number, cb: (p: number, active: boolean) => void) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    const read = (coord: number) => {
      const p = Math.min(Math.max(coord - index, 0), 1);
      cbRef.current(p, coord >= index - 0.5 && coord < index + 1.5);
    };
    read(useScrollStore.getState().coord);
    return useScrollStore.subscribe((s, prev) => {
      if (s.coord !== prev.coord) read(s.coord);
    });
  }, [index]);
}

/** React-state version for coarse UI (re-renders only when crossing step thresholds). */
export function useChapterStep(index: number, steps: number, from = 0, to = 1): number {
  const ref = useRef(0);
  const [, force] = useReducer((x: number) => x + 1, 0);
  useChapterProgress(index, (p) => {
    const local = Math.min(Math.max((p - from) / (to - from), 0), 0.9999);
    const s = Math.floor(local * steps);
    if (s !== ref.current) {
      ref.current = s;
      force();
    }
  });
  return ref.current;
}
