"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useTier } from "@/hooks/useTier";
import { Chapter } from "./Chapter";

const ease = [0.22, 1, 0.36, 1] as const;

export function Ch5Configure() {
  const [beat, setBeat] = useState<0 | 1>(0);
  const [on, setOn] = useState(false);
  const isStatic = useTier() === "static";
  useChapterProgress(5, (p) => {
    setOn(p > 0.03);
    setBeat(p > 0.52 ? 1 : 0);
  });

  const Beat = ({ children, k }: { children: React.ReactNode; k: string }) => (
    <motion.div
      key={k}
      initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0.6 }}
      animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
      exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)", opacity: 0.6 }}
      transition={{ duration: 0.8, ease }}
      className="absolute inset-0 flex items-center"
    >
      {children}
    </motion.div>
  );

  if (isStatic) {
    return (
      <Chapter id="configure">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Features />
          <div className="mt-16">
            <Connect />
          </div>
        </div>
      </Chapter>
    );
  }

  return (
    <Chapter id="configure">
      <div className="relative mx-auto h-full max-w-7xl px-5 sm:px-8">
        <AnimatePresence mode="sync" initial={false}>
          {on && beat === 0 && (
            <Beat k="features">
              <Features />
            </Beat>
          )}
          {on && beat === 1 && (
            <Beat k="connect">
              <Connect />
            </Beat>
          )}
        </AnimatePresence>
      </div>
    </Chapter>
  );
}

function Features() {
  const { configure } = content;
  return (
    <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="eyebrow mb-5">{configure.eyebrow}</p>
        <h2 className="display text-3xl sm:text-5xl">{configure.title}</h2>
        <p className="mt-5 inline-block rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-teal-bright">
          {configure.badge}
        </p>
      </div>
      <motion.ul
        className="grid gap-3 sm:grid-cols-2 lg:col-span-7"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
      >
        {configure.features.map((f, i) => (
          <motion.li
            key={f.title}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            className={`panel p-5 ${i === configure.features.length - 1 ? "sm:col-span-2" : ""}`}
          >
            <span className="font-mono text-[11px] text-faint">0{i + 1}</span>
            <h3 className="mt-2 text-lg font-medium tracking-tight">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{f.body}</p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function Connect() {
  const { connect } = content.configure;
  return (
    <div className="w-full">
      <p className="eyebrow mb-5">{connect.eyebrow}</p>
      <h2 className="display max-w-3xl text-3xl sm:text-5xl">{connect.title}</h2>
      <motion.div
        className="mt-10 flex flex-wrap gap-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
      >
        {connect.systems.map((s) => (
          <motion.div
            key={s}
            variants={{ hidden: { opacity: 0, scale: 0.9, y: 16 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease } } }}
            className="panel flex items-center gap-4 px-6 py-5"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inset-0 animate-ping rounded-full bg-coral/50" />
              <span className="absolute inset-0 rounded-full bg-coral" />
            </span>
            <span className="text-lg font-medium tracking-tight">{s}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">live sync</span>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-8 max-w-xl text-muted">
        Master data, actuals and plans move both ways, on a schedule you set. No middleware project, no re-keying.
      </p>
    </div>
  );
}
