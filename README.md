# Verra Atelier — architecture & interiors portfolio (demo)

A scroll-animated demo site built to win a portfolio development contract.
Sections are modelled on five reference sites; see [TECH-PLAN.md](TECH-PLAN.md) for
the full analysis and the section-by-section technique map.

**Verra Atelier is a fictional studio.** Swap [`src/content/studio.ts`](src/content/studio.ts)
for the client's real identity and nothing else needs to change.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + CSS-variable theme layer |
| Animation | GSAP 3.15 — ScrollTrigger, SplitText, CustomEase, Observer, Draggable |
| Smooth scroll | Lenis 1.3, bridged to `gsap.ticker` |
| Carousel | Embla (only inside the "three reasons" panels) |
| Fonts | Bodoni Moda (display), Inter (UI), Pinyon Script (accent) — self-hosted via `next/font` |

## Running it

```bash
npm install
npm run images     # harvest + normalise the image set (see below)
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run images` | Download, normalise and manifest every image |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Image pipeline

`public/images/` and `src/content/generated/images.json` are **generated**, not hand-authored.

1. [`scripts/sources.mjs`](scripts/sources.mjs) — curated manifest of source URLs + alt text.
2. [`scripts/harvest-images.mjs`](scripts/harvest-images.mjs) — downloads (cached in `.cache/raw`),
   caps at 2560px, re-encodes, and writes intrinsic dimensions plus a `blurDataURL` per asset.
3. [`src/components/ui/MediaImage.tsx`](src/components/ui/MediaImage.tsx) — the only image
   primitive. Never use a raw `<img>`.

To change the image set, edit `sources.mjs` and re-run `npm run images`.

> ### ⚠ Replace the imagery before this goes in front of a client
>
> The 58 placeholder images are pulled from the five reference sites and are **other firms'
> copyrighted project photography**. They are here because they are already composed for these
> exact crops, which makes layout work fast.
>
> Swap them for licensed stock (Unsplash / Pexels have strong architecture and interior sets)
> before any public deploy or client presentation. Only `sources.mjs` changes — every crop,
> aspect ratio and layout carries over untouched.

## Architecture notes

- **Motion tokens** live in [`src/lib/motion-tokens.ts`](src/lib/motion-tokens.ts). Every
  animation pulls its easing, duration and stagger from there.
- **GSAP is a singleton** — always import from [`src/lib/gsap.ts`](src/lib/gsap.ts), never from
  `gsap` directly, so plugins and the five `CustomEase` curves register exactly once.
- **Theming is section-driven.** Any element with `data-section-theme="bone|dark|sage|clay|image"`
  claims the global theme while it holds the middle of the viewport; nav, logo and scroll rail read
  `--fg` / `--accent` and invert automatically.
- **Pinned sections come first.** Theme and scroll-progress triggers use `refreshPriority: -10` so
  they re-measure *after* pins insert their spacers — without it every theme boundary lands a
  section late.
- **Never transform a container that holds scroll-triggered children.** A transform shifts each
  child's measured position and silently stops its reveal from firing (this bit the dome panel).

## Dev tooling

`scripts/shoot.mjs` and `scripts/perf.mjs` drive a headless browser for visual and performance
checks. They need `npx playwright install chromium` once, and a dev/prod server running.

```bash
node scripts/shoot.mjs http://localhost:3000   # section screenshots → .cache/shots
node scripts/perf.mjs  http://localhost:3000   # first-load weight + Core Web Vitals
```

## Measured performance

Production build, local server:

| | Desktop 1440×900 | Mobile 390×844 |
|---|---|---|
| First-load transfer | 1.36 MB | 1.21 MB |
| FCP | 1448 ms | 772 ms |
| LCP | 1448 ms | 772 ms |
| CLS | 0 | 0 |

Measure against a freshly-started `next start`, and warm the image optimiser with one
throwaway load first — Next builds AVIF variants on demand for the first request of each
asset, and a stale server or a competing dev server will skew the result badly.
