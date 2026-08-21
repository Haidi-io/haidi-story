"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";
import { useChapterProgress, useChapterStep } from "@/hooks/useChapterProgress";
import { Chapter } from "./Chapter";
import { Counter } from "@/components/ui/Counter";

const ease = [0.22, 1, 0.36, 1] as const;

export function Ch1Noise() {
  const { noise } = content;
  const step = useChapterStep(1, noise.statements.length, 0.05, 0.7);
  const [showStats, setShowStats] = useState(false);
  const glitch = useRef<HTMLDivElement>(null);

  useChapterProgress(1, (p) => {
    setShowStats(p > 0.68);
    // a faint chromatic jitter on the whole block while chaos peaks
    if (glitch.current) {
      const k = Math.sin(Math.min(p / 0.7, 1) * Math.PI);
      glitch.current.style.textShadow = `${k * 2}px 0 rgba(240,137,137,${k * 0.6}), ${-k * 2}px 0 rgba(95,208,210,${k * 0.6})`;
    }
  });

  return (
    <Chapter id="noise">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6">{noise.eyebrow}</p>
          <div ref={glitch} className="relative min-h-[14rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease }}
              >
                <h2 className="display text-5xl sm:text-6xl lg:text-7xl">{noise.statements[step].big}</h2>
                <p className="mt-5 max-w-lg text-lg text-muted">{noise.statements[step].small}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex gap-2">
            {noise.statements.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${i === step ? "w-10 bg-coral" : "w-4 bg-white/15"}`}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.7, ease }}
                className="panel p-7"
              >
                <p className="eyebrow mb-6">What changes with Haidi</p>
                <div className="grid grid-cols-2 gap-6">
                  {noise.stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-mono text-3xl text-teal-bright sm:text-4xl">
                        <Counter value={s.value} suffix={s.suffix} play={showStats} />
                      </p>
                      <p className="mt-2 text-sm text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Chapter>
  );
}
