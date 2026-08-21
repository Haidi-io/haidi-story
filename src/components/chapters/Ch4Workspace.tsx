"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useTier } from "@/hooks/useTier";
import { Chapter } from "./Chapter";

const ease = [0.22, 1, 0.36, 1] as const;

export function Ch4Workspace() {
  const { workspace } = content;
  const frame = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [pillars, setPillars] = useState(false);
  const tier = useTier();
  const isStatic = tier === "static";

  useChapterProgress(4, (p) => {
    if (frame.current) {
      const k = Math.min(p / 0.32, 1);
      const e = 1 - Math.pow(1 - k, 3);
      frame.current.style.clipPath = `inset(${(1 - e) * 18}% round ${16 + (1 - e) * 24}px)`;
      frame.current.style.transform = `scale(${0.86 + e * 0.14}) translateY(${(1 - e) * 40}px)`;
      frame.current.style.opacity = String(0.3 + e * 0.7);
    }
    if (title.current) {
      const k = Math.min(Math.max((p - 0.02) / 0.2, 0), 1);
      title.current.style.opacity = String(k);
      title.current.style.transform = `translateY(${(1 - k) * 20}px)`;
    }
    const n = workspace.hotspots.length;
    setShown(Math.floor(Math.min(Math.max((p - 0.34) / 0.4, 0), 1) * (n + 0.99)));
    setPillars(p > 0.78);
  });

  return (
    <Chapter id="workspace">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-5 pt-20 sm:px-8">
        <div ref={title} className="mb-6 flex flex-wrap items-end justify-between gap-4" style={{ opacity: isStatic ? 1 : 0 }}>
          <div>
            <p className="eyebrow mb-3">{workspace.eyebrow}</p>
            <h2 className="display text-3xl sm:text-5xl">{workspace.title}</h2>
          </div>
          <p className="max-w-xs text-sm text-muted">
            Demand, review, scenarios and inventory in one planning grid, with every value explainable.
          </p>
        </div>

        <div className="relative">
          <div
            ref={frame}
            className="relative mx-auto w-full overflow-hidden rounded-2xl border border-line shadow-[0_40px_120px_-30px_rgba(71,185,187,0.35)]"
            style={isStatic ? undefined : { clipPath: "inset(18% round 40px)", transform: "scale(0.86)", opacity: 0.3 }}
          >
            <Image
              src="/assets/haidi-platform.png"
              alt="The Haidi planning workspace: planning grid, scenarios and forecast explanations"
              width={1600}
              height={1000}
              className="block h-auto max-h-[56vh] w-full object-cover object-top"
              sizes="(max-width: 1280px) 100vw, 1200px"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />

            {workspace.hotspots.map((h, i) => {
              const visible = isStatic || i < shown;
              return (
                <AnimatePresence key={h.label}>
                  {visible && (
                    <motion.div
                      className="absolute"
                      style={{ left: `${h.x}%`, top: `${h.y}%` }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    >
                      <span className="relative block h-3 w-3 -translate-x-1/2 -translate-y-1/2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-teal-bright/60" />
                        <span className="absolute inset-0 rounded-full bg-teal-bright ring-4 ring-teal/25" />
                      </span>
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4, ease }}
                        className="absolute left-3 top-1 whitespace-nowrap rounded-md border border-line bg-canvas/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink backdrop-blur"
                      >
                        {h.label}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>

          {/* value pillars slide up over the lower edge of the product */}
          <AnimatePresence>
            {(pillars || isStatic) && (
              <motion.ul
                className="relative z-10 -mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{ show: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
              >
                {workspace.pillars.map((p) => (
                  <motion.li
                    key={p.title}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
                    }}
                    className="panel p-4 sm:p-5"
                    style={{ background: "rgba(20,22,29,0.78)" }}
                  >
                    <h3 className="text-sm font-medium tracking-tight sm:text-base">{p.title}</h3>
                    <p className="mt-1.5 hidden text-xs text-muted sm:block">{p.body}</p>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Chapter>
  );
}
