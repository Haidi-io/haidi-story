/** Single source of truth for chapter order, scroll height and camera knots. */
export type ChapterId =
  | "signal"
  | "noise"
  | "forecast"
  | "decision"
  | "workspace"
  | "configure"
  | "launch"
  | "outro";

export interface ChapterDef {
  id: ChapterId;
  index: number;
  heightVh: number;
  /** true = inner content is sticky for the chapter's scroll range */
  sticky: boolean;
}

const defs: Array<Omit<ChapterDef, "index">> = [
  { id: "signal", heightVh: 170, sticky: true },
  { id: "noise", heightVh: 250, sticky: true },
  { id: "forecast", heightVh: 300, sticky: true },
  { id: "decision", heightVh: 300, sticky: true },
  { id: "workspace", heightVh: 250, sticky: true },
  { id: "configure", heightVh: 250, sticky: true },
  { id: "launch", heightVh: 250, sticky: true },
  { id: "outro", heightVh: 180, sticky: true },
];

export const CHAPTERS: ChapterDef[] = defs.map((d, index) => ({ ...d, index }));
export const TOTAL_VH = CHAPTERS.reduce((s, c) => s + c.heightVh, 0);

/** Top offset of each section in vh. */
export const SECTION_TOPS: number[] = CHAPTERS.reduce<number[]>((acc, c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + CHAPTERS[i - 1].heightVh);
  return acc;
}, []);

/**
 * Map global progress (0..1 of scrollable distance = docHeight - viewport) to a
 * continuous chapter coordinate: integer part = chapter index, fraction =
 * progress inside that chapter. A sticky chapter is "active" from its top hitting
 * the viewport top until its bottom hits the viewport bottom (heightVh - 100 of
 * scroll); during the 100vh hand-over to the next section the coordinate sits at
 * the boundary, so it is continuous and monotonic.
 */
export function chapterCoord(progress: number): number {
  const y = progress * (TOTAL_VH - 100);
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    const top = SECTION_TOPS[i];
    if (y >= top || i === 0) {
      const span = Math.max(CHAPTERS[i].heightVh - 100, 1);
      const local = Math.min(Math.max((y - top) / span, 0), 1);
      return i + local;
    }
  }
  return 0;
}
