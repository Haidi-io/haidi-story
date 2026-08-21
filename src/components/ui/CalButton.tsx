"use client";
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { site } from "@/lib/site";
import { Button } from "./Button";

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
  glow?: boolean;
  size?: "md" | "lg";
}

/** Opens the Cal.com booking popup (falls back to a new tab if the embed is blocked). */
export function CalButton({ children = "Book a call", className = "", variant = "ghost", glow = false, size = "md" }: Props) {
  useEffect(() => {
    (async () => {
      try {
        const cal = await getCalApi({ namespace: "15min" });
        cal("ui", {
          theme: "dark",
          cssVarsPerTheme: { dark: { "cal-brand": "#47B9BB" }, light: { "cal-brand": "#2E8E90" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch {
        /* offline / blocked: the button falls back to a plain link */
      }
    })();
  }, []);

  return (
    <Button
      variant={variant}
      glow={glow}
      size={size}
      className={className}
      data-cal-namespace="15min"
      data-cal-link={site.calLink}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      onClick={() => {
        if (!(window as unknown as { Cal?: unknown }).Cal) {
          window.open(`https://cal.com/${site.calLink}`, "_blank", "noopener");
        }
      }}
    >
      {children}
    </Button>
  );
}
