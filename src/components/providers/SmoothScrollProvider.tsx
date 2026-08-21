"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useScrollStore } from "@/lib/scrollStore";

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis; every Lenis scroll event
 * updates ScrollTrigger and the shared scroll store that the WebGL scene reads.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  useEffect(() => {
    const setScroll = useScrollStore.getState().setScroll;

    if (reducedMotion) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScroll(max > 0 ? window.scrollY / max : 0, 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    const onScroll = () => {
      ScrollTrigger.update();
      setScroll(lenis.progress, lenis.velocity);
    };
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger should use Lenis' scroll position
    ScrollTrigger.refresh();

    // seed the store with the current position (restored scroll / remount) before the first scroll event
    const seed = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? window.scrollY / max : 0, 0);
    };
    seed();
    const seedTimer = window.setTimeout(seed, 300);

    return () => {
      window.clearTimeout(seedTimer);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
