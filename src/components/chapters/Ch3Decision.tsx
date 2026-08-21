"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import { content } from "@/lib/content";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useTier } from "@/hooks/useTier";
import { Chapter } from "./Chapter";
import { SplitHeading } from "@/components/ui/SplitHeading";

const TONE: Record<string, string> = {
  teal: "#47B9BB",
  bright: "#5FD0D2",
  coral: "#F08989",
};

function Sparkline({ series, color }: { series: readonly number[]; color: string }) {
  const w = 160;
  const h = 48;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const pts = series.map((v, i) => [(i / (series.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 6) - 3]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-12 w-full" aria-hidden>
      <defs>
        <linearGradient id={`g-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#g-${color.slice(1)})`} />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Ch3Decision() {
  const { decision } = content;
  const track = useRef<HTMLDivElement>(null);
  const tier = useTier();
  const horizontal = tier === "full";

  useChapterProgress(3, (p) => {
    if (!track.current || !horizontal) return;
    const k = Math.min(Math.max((p - 0.18) / 0.7, 0), 1);
    const e = k * k * (3 - 2 * k);
    const parentW = track.current.parentElement?.clientWidth ?? track.current.clientWidth;
    const max = Math.max(track.current.scrollWidth - parentW, 0);
    track.current.style.transform = `translate3d(${-e * max}px,0,0)`;
  });

  return (
    <Chapter id="decision">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
        <div className="mb-8 max-w-2xl lg:mb-12">
          <p className="eyebrow mb-5">{decision.eyebrow}</p>
          <SplitHeading className="display text-3xl sm:text-5xl" start="top 95%">
            {decision.title}
          </SplitHeading>
          <p className="mt-4 text-muted">{decision.sub}</p>
        </div>
        <div className={horizontal ? "overflow-hidden" : "no-scrollbar overflow-x-auto"}>
          <div
            ref={track}
            className="flex gap-5 will-change-transform"
            style={{ width: horizontal ? "max-content" : undefined, paddingRight: horizontal ? "6vw" : 0 }}
          >
            {decision.scenarios.map((s, i) => (
              <motion.article
                key={s.name}
                whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="panel w-[18rem] shrink-0 p-6 sm:w-[22rem]"
                style={{ transformPerspective: 900 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Scenario 0{i + 1}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: TONE[s.tone] }} />
                </div>
                <h3 className="mt-3 text-xl font-medium tracking-tight">{s.name}</h3>
                <p className="mt-1 font-mono text-sm" style={{ color: TONE[s.tone] }}>
                  {s.kpi}
                </p>
                <div className="mt-4">
                  <Sparkline series={s.series} color={TONE[s.tone]} />
                </div>
                <p className="mt-4 text-sm text-muted">{s.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </Chapter>
  );
}
