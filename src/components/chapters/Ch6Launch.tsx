"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useTier } from "@/hooks/useTier";
import { Chapter } from "./Chapter";
import { Counter } from "@/components/ui/Counter";

const ease = [0.22, 1, 0.36, 1] as const;

export function Ch6Launch() {
  const { launch } = content;
  const line = useRef<SVGLineElement>(null);
  const [lit, setLit] = useState(0);
  const [about, setAbout] = useState(false);
  const isStatic = useTier() === "static";

  useChapterProgress(6, (p) => {
    const k = Math.min(Math.max((p - 0.05) / 0.6, 0), 1);
    if (line.current) line.current.style.strokeDashoffset = String(1 - k);
    setLit(Math.floor(k * (launch.steps.length + 0.99)));
    setAbout(p > 0.66);
  });

  const n = launch.steps.length;

  return (
    <Chapter id="launch">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-5">{launch.eyebrow}</p>
          <h2 className="display text-3xl sm:text-4xl lg:text-[2.75rem]">{launch.title}</h2>
          <p className="mt-3 font-mono text-sm text-teal-bright">{launch.duration}</p>

          <div className="relative mt-6 pl-8">
            <svg className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px overflow-visible" aria-hidden>
              <line x1="0" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.12)" />
              <line
                ref={line}
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="#5FD0D2"
                strokeWidth="1.5"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={isStatic ? 0 : 1}
              />
            </svg>
            <ol className="space-y-3.5">
              {launch.steps.map((s, i) => {
                const on = isStatic || i < lit;
                return (
                  <li key={s.title} className="relative">
                    <span
                      className={`absolute -left-8 top-1.5 block h-[15px] w-[15px] rounded-full border transition-all duration-500 ${
                        on ? "border-teal-bright bg-teal-bright shadow-[0_0_18px_rgba(95,208,210,0.8)]" : "border-white/20 bg-canvas"
                      }`}
                    />
                    <motion.div animate={{ opacity: on ? 1 : 0.35, x: on ? 0 : -4 }} transition={{ duration: 0.5, ease }}>
                      <h3 className="text-base font-medium tracking-tight sm:text-lg">
                        <span className="mr-3 font-mono text-xs text-faint">0{i + 1}</span>
                        {s.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted">{s.body}</p>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <AnimatePresence>
            {(about || isStatic) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease }}
                className="panel p-7"
              >
                <p className="eyebrow mb-4">{launch.about.eyebrow}</p>
                <h3 className="display text-2xl sm:text-3xl">{launch.about.title}</h3>
                <div className="mt-7 grid grid-cols-3 gap-4">
                  {launch.about.stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-mono text-2xl text-teal-bright sm:text-3xl">
                        <Counter value={s.value} suffix={s.suffix} locale={s.value !== 2018} play={about || isStatic} />
                      </p>
                      <p className="mt-1.5 text-xs text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="sr-only">{n} onboarding steps</p>
        </div>
      </div>
    </Chapter>
  );
}
