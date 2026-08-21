"use client";
import { CHAPTERS, type ChapterId } from "@/lib/chapters";
import { useTier } from "@/hooks/useTier";

interface Props {
  id: ChapterId;
  children: React.ReactNode;
  className?: string;
}

/**
 * A chapter owns a fixed slice of scroll height. Its content is sticky for the
 * full range so effects can be scrubbed. In the static tier it collapses to a
 * normal flowing section so nothing depends on scroll progress.
 */
export function Chapter({ id, children, className = "" }: Props) {
  const def = CHAPTERS.find((c) => c.id === id)!;
  const tier = useTier();
  const sticky = def.sticky && tier !== "static";
  return (
    <section
      id={id}
      data-chapter={def.index}
      style={{ height: sticky ? `${def.heightVh}vh` : undefined }}
      className={`relative ${sticky ? "" : "min-h-screen py-24"} ${className}`}
    >
      <div className={sticky ? "sticky top-0 h-screen overflow-hidden" : ""}>{children}</div>
    </section>
  );
}
