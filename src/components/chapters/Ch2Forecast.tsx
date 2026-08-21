"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";
import { useChapterProgress, useChapterStep } from "@/hooks/useChapterProgress";
import { Chapter } from "./Chapter";
import { SplitHeading } from "@/components/ui/SplitHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export function Ch2Forecast() {
  const { forecast } = content;
  const step = useChapterStep(2, forecast.steps.length, 0.12, 0.82);
  const [callout, setCallout] = useState(false);
  const [titleIn, setTitleIn] = useState(false);
  useChapterProgress(2, (p) => {
    setCallout(p > 0.8);
    setTitleIn(p > 0.02);
  });

  return (
    <Chapter id="forecast">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        {/* left: anchor copy + "why this value" card */}
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">{forecast.eyebrow}</p>
          <SplitHeading className="display text-3xl sm:text-4xl lg:text-[2.75rem]" start="top 95%">
            {forecast.title}
          </SplitHeading>
          <AnimatePresence>
            {callout && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className="panel mt-8 max-w-sm p-5"
              >
                <p className="eyebrow mb-3 !text-coral">{forecast.callout.label}</p>
                <dl className="space-y-1.5 font-mono text-sm">
                  {forecast.callout.rows.map(([k, v], i) => (
                    <motion.div
                      key={k}
                      className={`flex justify-between ${i === forecast.callout.rows.length - 1 ? "border-t border-line pt-2 text-teal-bright" : "text-muted"}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                    >
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* right: stepping text */}
        <div className="text-scrim rounded-3xl p-4 lg:col-span-6 lg:col-start-7">
          <ol className="space-y-2">
            {forecast.steps.map((s, i) => {
              const active = i === step && titleIn;
              return (
                <li key={s.k} className="relative">
                  <motion.div
                    animate={{ opacity: active ? 1 : 0.35, x: active ? 0 : -6 }}
                    transition={{ duration: 0.5, ease }}
                    className="grid grid-cols-[3rem_1fr] gap-4 py-4"
                  >
                    <span className={`font-mono text-sm ${active ? "text-teal-bright" : "text-faint"}`}>{s.k}</span>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{s.name}</p>
                      <h3 className="mt-1 text-xl font-medium tracking-tight sm:text-2xl">{s.title}</h3>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease }}
                            className="mt-2 max-w-md overflow-hidden text-muted"
                          >
                            {s.body}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                  <motion.span
                    className="absolute bottom-0 left-0 h-px bg-teal"
                    animate={{ width: active ? "100%" : "0%" }}
                    transition={{ duration: 0.8, ease }}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Chapter>
  );
}
