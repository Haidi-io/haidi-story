"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";
import { site } from "@/lib/site";
import { useUiStore } from "@/lib/uiStore";
import { useChapterProgress } from "@/hooks/useChapterProgress";
import { useTier } from "@/hooks/useTier";
import { Chapter } from "./Chapter";
import { Button } from "@/components/ui/Button";
import { CalButton } from "@/components/ui/CalButton";
import { SplitHeading } from "@/components/ui/SplitHeading";

const ease = [0.22, 1, 0.36, 1] as const;

const PROOFS = [
  "Live in hours, not months",
  "Forecasts you can explain",
  "No contracts, no lock-in",
];

export function Ch7Outro() {
  const { outro } = content;
  const openContact = useUiStore((s) => s.openContact);
  const isStatic = useTier() === "static";
  const glow = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(isStatic ? 3 : 0);

  useChapterProgress(7, (p) => {
    if (glow.current) {
      const k = Math.min(Math.max((p - 0.05) / 0.5, 0), 1);
      glow.current.style.opacity = String(0.25 + 0.75 * k);
      glow.current.style.transform = `translate(-30%, -40%) scale(${0.8 + 0.5 * k})`;
    }
    const s = p > 0.5 ? 3 : p > 0.26 ? 2 : p > 0.06 ? 1 : 0;
    setStage(isStatic ? 3 : s);
  });

  return (
    <Chapter id="outro">
      <div className="flex h-full min-h-screen flex-col">
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
          {/* ignition glow behind the headline */}
          <div
            ref={glow}
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-[40rem] w-[40rem] rounded-full"
            style={{
              opacity: isStatic ? 1 : 0.25,
              transform: "translate(-30%, -40%) scale(0.8)",
              background:
                "radial-gradient(closest-side, rgba(95,208,210,0.28), rgba(71,185,187,0.12) 45%, rgba(240,137,137,0.06) 70%, transparent)",
              filter: "blur(10px)",
            }}
          />

          <div className="relative max-w-3xl">
            <AnimatePresence>
              {stage >= 0 && (
                <motion.p
                  key="eyebrow"
                  className="eyebrow mb-6 flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: stage >= 1 || isStatic ? 1 : 0,
                    y: stage >= 1 || isStatic ? 0 : 10,
                  }}
                  transition={{ duration: 0.6, ease }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-teal-bright/70" />
                    <span className="absolute inset-0 rounded-full bg-teal-bright" />
                  </span>
                  {outro.eyebrow}
                </motion.p>
              )}
            </AnimatePresence>

            <SplitHeading
              as="h2"
              type="chars"
              play={stage >= 1}
              charClassName="grad-char"
              className="display text-[3.2rem] leading-[0.95] text-teal-bright sm:text-7xl lg:text-[6.5rem]"
            >
              {outro.title}
            </SplitHeading>

            <motion.p
              className="mt-7 max-w-lg text-lg text-muted"
              initial={false}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 16 }}
              transition={{ duration: 0.7, ease }}
            >
              {outro.body}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={false}
              animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 16 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <Button glow size="lg" onClick={openContact}>
                {outro.cta}
              </Button>
              <CalButton className="px-8 py-4 text-base">
                {outro.secondary}
              </CalButton>
            </motion.div>

            <motion.ul
              className="mt-10 flex flex-wrap gap-2.5"
              initial={false}
              animate={stage >= 3 ? "show" : "hidden"}
              variants={{
                show: { transition: { staggerChildren: 0.09 } },
                hidden: {},
              }}
            >
              {PROOFS.map((t) => (
                <motion.li
                  key={t}
                  variants={{
                    hidden: { opacity: 0, y: 14, scale: 0.96 },
                    show: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.55, ease },
                    },
                  }}
                  className="rounded-full border border-line bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted backdrop-blur"
                >
                  {t}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <footer className="relative mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8">
          <div className="flex flex-col gap-4 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/haidi.png"
                alt="Haidi"
                width={72}
                height={20}
                className="h-4 w-auto opacity-80"
              />
              <span>{outro.footer}</span>
            </div>
            <nav className="flex flex-wrap gap-5">
              <a className="hover:text-ink" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a
                className="hover:text-ink"
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="hover:text-ink"
                href={site.appUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign in
              </a>
              <a className="hover:text-ink" href="/privacy">
                Privacy
              </a>
              <a className="hover:text-ink" href="/terms">
                Terms
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </Chapter>
  );
}
