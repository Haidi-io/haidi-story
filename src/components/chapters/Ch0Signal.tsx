"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import { content } from "@/lib/content";
import { useUiStore } from "@/lib/uiStore";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { Chapter } from "./Chapter";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Button } from "@/components/ui/Button";
import { ScrollHint } from "@/components/ui/ScrollHint";
import { CalButton } from "@/components/ui/CalButton";

const ease = [0.22, 1, 0.36, 1] as const;

export function Ch0Signal() {
  const openContact = useUiStore((s) => s.openContact);
  const wrap = useRef<HTMLDivElement>(null);
  const { hero } = content;

  // as the user scrolls through the hero, the copy lifts and dissolves
  useChapterProgress(0, (p) => {
    if (!wrap.current) return;
    const k = Math.min(p / 0.9, 1);
    wrap.current.style.opacity = String(1 - k);
    wrap.current.style.transform = `translate3d(0, ${-k * 80}px, 0) scale(${1 - k * 0.04})`;
  });

  return (
    <Chapter id="signal">
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8">
        <div ref={wrap} className="max-w-3xl will-change-transform">
          <SplitHeading as="h1" immediate delay={0.45} className="display text-[2.4rem] sm:text-5xl lg:text-[4.25rem]">
            {hero.h1a} <span className="grad-text">{hero.h1b}</span>
          </SplitHeading>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.25, ease }}
          >
            <CalButton variant="primary" glow>
              {hero.cta}
            </CalButton>
            <Button variant="ghost" onClick={openContact}>
              Contact us
            </Button>
          </motion.div>
          <motion.p
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.5 }}
          >
            {hero.note}
          </motion.p>
        </div>
      </div>
      <ScrollHint />
    </Chapter>
  );
}
