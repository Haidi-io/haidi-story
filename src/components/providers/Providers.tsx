"use client";
import { MotionConfig } from "motion/react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { MotionPrefsProvider } from "./MotionPrefsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <MotionPrefsProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </MotionPrefsProvider>
    </MotionConfig>
  );
}
