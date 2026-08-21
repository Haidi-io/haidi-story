"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useScrollStore } from "@/lib/scrollStore";
import { useUiStore } from "@/lib/uiStore";
import { CHAPTERS } from "@/lib/chapters";
import { Button } from "./Button";
import { CalButton } from "./CalButton";

const LABELS: Record<string, string> = {
  signal: "Signal",
  noise: "Noise",
  forecast: "Forecast",
  decision: "Decision",
  workspace: "Workspace",
  configure: "Connect",
  launch: "Onboard",
  outro: "Launch",
};

export function Header() {
  const openContact = useUiStore((s) => s.openContact);
  const bar = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(
    () =>
      useScrollStore.subscribe((s) => {
        if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
        setChapter(s.chapter);
        setScrolled(s.progress > 0.01);
      }),
    [],
  );

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-40 transition-[background] duration-500 ${
          scrolled ? "bg-gradient-to-b from-canvas/90 via-canvas/60 to-transparent" : ""
        }`}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        >
          <a href="#signal" className="flex items-center gap-3" aria-label="Haidi home">
            <Image src="/assets/haidi.png" alt="Haidi" width={96} height={28} className="h-6 w-auto" priority />
          </a>
          <nav className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={openContact}>
              Contact us
            </Button>
            <CalButton variant="primary">Prepare to launch</CalButton>
          </nav>
          <CalButton variant="primary" className="md:hidden">
            Launch
          </CalButton>
        </div>
        <div className="h-px w-full bg-white/5">
          <div ref={bar} className="h-px origin-left bg-teal" style={{ transform: "scaleX(0)" }} />
        </div>
      </motion.header>

      {/* chapter rail */}
      <nav
        aria-label="Chapters"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      >
        {CHAPTERS.map((c) => {
          const active = c.index === chapter;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="group flex items-center justify-end gap-3"
              aria-current={active ? "true" : undefined}
            >
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  active ? "translate-x-0 opacity-100 text-teal-bright" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                }`}
              >
                {LABELS[c.id]}
              </span>
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  active ? "w-6 bg-teal-bright" : "w-1.5 bg-white/25 group-hover:bg-white/60"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
