"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useScrollStore } from "@/lib/scrollStore";

export function ScrollHint() {
  const [show, setShow] = useState(true);
  useEffect(() => useScrollStore.subscribe((s) => setShow(s.progress < 0.01)), []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="pointer-events-none absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-faint sm:right-10 lg:flex"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll to begin</span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute left-0 top-0 block h-4 w-px bg-teal-bright"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
