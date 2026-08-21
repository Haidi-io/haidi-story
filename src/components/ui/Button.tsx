"use client";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof motion.button>, "children"> & {
  children?: React.ReactNode;
  variant?: "primary" | "ghost";
  /** pulsing halo + sliding arrow, for the hero moment */
  glow?: boolean;
  size?: "md" | "lg";
};

export function Button({ variant = "primary", glow = false, size = "md", className = "", children, ...rest }: Props) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full font-medium tracking-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-bright";
  const sizing = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  const styles =
    variant === "primary"
      ? "bg-teal text-canvas hover:bg-teal-bright"
      : "border border-line text-ink hover:border-teal hover:text-teal-bright";
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={`${base} ${sizing} ${styles} ${className}`}
      {...rest}
    >
      {glow && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(95,208,210,0.55), 0 0 24px 0 rgba(71,185,187,0.35)",
              "0 0 0 14px rgba(95,208,210,0), 0 0 40px 6px rgba(71,185,187,0.45)",
              "0 0 0 0 rgba(95,208,210,0), 0 0 24px 0 rgba(71,185,187,0.35)",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="relative">{children}</span>
      {glow && (
        <span aria-hidden className="relative inline-flex h-4 w-4 items-center overflow-hidden">
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </span>
      )}
    </motion.button>
  );
}
