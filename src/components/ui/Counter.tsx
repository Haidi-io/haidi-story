"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotionPref } from "@/hooks/useTier";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  locale?: boolean;
  /** when provided, the count runs the first time this becomes true */
  play?: boolean;
}

export function Counter({ value, prefix = "", suffix = "", className = "", locale = true, play = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    const fmt = (n: number) => (locale ? Math.round(n).toLocaleString("en-US") : String(Math.round(n)));
    if (reduced) {
      el.textContent = fmt(value);
      done.current = true;
      return;
    }
    if (!play) return;
    done.current = true;
    const obj = { n: 0 };
    const tween = gsap.to(obj, {
      n: value,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = fmt(obj.n);
      },
    });
    return () => {
      if (tween.progress() < 1) {
        tween.kill();
        done.current = false;
      }
    };
  }, [value, reduced, play, locale]);

  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>{reduced ? value.toLocaleString("en-US") : 0}</span>
      {suffix}
    </span>
  );
}
