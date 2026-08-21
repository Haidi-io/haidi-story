import { create } from "zustand";
import { chapterCoord } from "./chapters";

export type Tier = "full" | "lite" | "static";

interface ScrollState {
  /** 0..1 over the entire page */
  progress: number;
  /** Lenis velocity (signed, px per frame-ish) */
  velocity: number;
  /** continuous chapter coordinate: 2.35 = 35% through chapter 2 */
  coord: number;
  chapter: number;
  chapterProgress: number;
  reducedMotion: boolean;
  tier: Tier;
  /** normalised pointer, -1..1 */
  pointer: { x: number; y: number };
  setScroll: (progress: number, velocity: number) => void;
  setPointer: (x: number, y: number) => void;
  setPrefs: (p: Partial<Pick<ScrollState, "reducedMotion" | "tier">>) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  velocity: 0,
  coord: 0,
  chapter: 0,
  chapterProgress: 0,
  reducedMotion: false,
  tier: "full",
  pointer: { x: 0, y: 0 },
  setScroll: (progress, velocity) => {
    const coord = chapterCoord(progress);
    const chapter = Math.floor(coord);
    set({ progress, velocity, coord, chapter, chapterProgress: coord - chapter });
  },
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setPrefs: (p) => set(p),
}));
