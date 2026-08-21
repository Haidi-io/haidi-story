# haidi-story

An immersive, scroll-driven retelling of haidi.io. A persistent WebGL world
(React Three Fiber) sits behind the page; native scroll drives the camera and
scene state through eight narrative chapters while GSAP / Motion handle the DOM.

The original site lives untouched in `../Haidi Website`. This folder is a
separate project with its own deploy pipeline.

## Stack

Next.js 15 (App Router, static export) · React 19 · Tailwind 4 ·
React Three Fiber + drei · GSAP 3 (ScrollTrigger, SplitText) · Motion ·
Lenis · zustand · Cal.com embed.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npx serve out    # preview the export
```

In the browser `window.lenis.scrollTo(px, { immediate: true })` jumps to any
scroll position for QA.

## How the story is wired

- `src/lib/chapters.ts` – chapter order + scroll height (single source of truth).
  `chapterCoord(progress)` maps page progress to `chapter.fraction`.
- `src/lib/scrollStore.ts` – zustand store fed by Lenis; read by the scene each frame.
- `src/components/scene/sceneConfig.ts` – camera knots (one per half-chapter) and
  `sceneState(coord)`: every shader/material value as a pure function of scroll.
- `src/components/scene/SceneDriver.tsx` – damps the scene toward that state.
- `src/components/chapters/*` – one component per chapter; `Chapter.tsx` gives each
  its sticky 100vh stage. `useChapterProgress(i, cb)` drives DOM effects.
- `src/lib/content.ts` – all copy.

Chapters: Signal (hero) → Noise (problem) → Forecast → Decision → Workspace →
Configure & Connect → Launch (onboarding + about) → Outro (CTA + footer).

## Tiers

`MotionPrefsProvider` picks a tier: `full` (desktop), `lite` (<1024px: fewer
particles, vertical cards), `static` (reduced-motion or no WebGL: poster
gradient, no smooth scroll, flowing sections).

## Deploy (Azure Static Web Apps)

`.github/workflows/azure-swa.yml` builds and uploads `out/` plus the `api/`
Azure Function (copied from the original site; POST `/api/contact` logs to
SharePoint and emails hello@haidi.io – see `api/` and the original repo's
`integrations/azure-contact-setup.md`). Create a **new** Static Web App and add
its token as the `AZURE_STATIC_WEB_APPS_API_TOKEN_STORY` secret.
