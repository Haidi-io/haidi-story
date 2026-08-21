"use client";
import { createElement, useEffect, useRef, useState, type ElementType } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useReducedMotionPref } from "@/hooks/useTier";

interface Props {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  /** play immediately (hero) instead of on scroll */
  immediate?: boolean;
  /** when provided, the reveal plays the first time this becomes true (overrides scroll trigger) */
  play?: boolean;
  delay?: number;
  stagger?: number;
  /** ScrollTrigger start */
  start?: string;
  /** split by lines (mask reveal) or by chars (kinetic reveal) */
  type?: "lines" | "chars";
  /** class applied to each char (e.g. a per-glyph gradient; parent background-clip does not survive 3D transforms) */
  charClassName?: string;
}

/** Masked text reveal using GSAP SplitText. Keeps a real heading in the DOM. */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className = "",
  immediate = false,
  play,
  delay = 0,
  stagger,
  start = "top 80%",
  type = "lines",
  charClassName,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionPref();
  // latch: once the reveal has been armed it never reverts/replays when `play` flips back
  const [armed, setArmed] = useState(play === undefined || play);
  useEffect(() => {
    if (play) setArmed(true);
  }, [play]);

  useGSAP(
    () => {
      if (!ref.current || reduced || !armed) return;
      const byChars = type === "chars";
      const split = SplitText.create(ref.current, {
        type: byChars ? "lines,chars" : "lines",
        linesClass: "split-line",
        charsClass: charClassName,
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(byChars ? self.chars : self.lines, {
            yPercent: byChars ? 120 : 110,
            rotateX: byChars ? -60 : 0,
            opacity: 0,
            duration: byChars ? 0.9 : 1.1,
            ease: "power4.out",
            stagger: stagger ?? (byChars ? 0.03 : 0.08),
            delay,
            scrollTrigger:
              immediate || play !== undefined
                ? undefined
                : { trigger: ref.current, start, toggleActions: "play none none none" },
          }),
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, armed, type, charClassName] },
  );

  return createElement(Tag, { ref, className, style: type === "chars" ? { perspective: 600 } : undefined }, children);
}
