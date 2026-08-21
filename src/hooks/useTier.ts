"use client";
import { useScrollStore } from "@/lib/scrollStore";

export function useTier() {
  return useScrollStore((s) => s.tier);
}
export function useReducedMotionPref() {
  return useScrollStore((s) => s.reducedMotion);
}
