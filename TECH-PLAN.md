# Architect / Interior Design Portfolio — Demo Build Plan

**Goal:** a demo site polished enough to win the development contract.
**Revised:** 2026-09-09 — updated after reviewing the 13 reference screenshots in [`inspiration-screenshot/`](inspiration-screenshot/).

---

## 1. What the inspiration sites are actually built with (verified, not guessed)

I pulled each site's HTML, headers, and JS bundles and fingerprinted them.

| Site | Platform / CMS | Scroll + animation engine |
|---|---|---|
| **era-residence.com** | Webflow, custom JS hosted on **Slater** (loaded as an ES module) | GSAP 3.15 — ScrollTrigger, **SplitText**, **CustomEase** · **Lenis 1.3.21** · **Barba.js** page transitions · Lottie |
| **bloom3d.studio** | Webflow | GSAP 3.15 — ScrollTrigger, **ScrollSmoother**, SplitText, CustomEase, TextPlugin, ScrollToPlugin · accordion-js |
| **hba.com** | WordPress, custom theme | jQuery + **Splide.js 4.1.4** + Plyr (video). Comparatively basic. |
| **modusprojects.nl** | Webflow (Awwwards-listed) | GSAP 3.15 — ScrollTrigger, **Observer**, **Draggable**, SplitText, CustomEase · **Lenis 1.3.17** · plus a **scroll-scrubbed image sequence** (~130 JPG frames on `cdn.overflow.nl/modus-sequence-v2/`) |
| **voltaskai.endover.ee** | WordPress + Vite theme, Livewire + Alpine | **Motion (motion.dev)** · **Lenis** · **Embla Carousel** · a little Three.js |

### The key finding

**Webflow contributes almost nothing to the animation.** I checked `era-residence.com` for Webflow's native
interaction attributes (`data-w-id`) — there are **zero**. Every transition on that site is hand-written GSAP
loaded from an external module. Same story on Modus and Bloom.

> The "posh" feeling is **100% GSAP + ScrollTrigger + Lenis**. That combination is
> framework-agnostic — it works identically in Next.js.
> We do not need Webflow, and we should not use it.

Second finding: **GSAP is now completely free**, including the premium plugins these sites rely on (SplitText,
ScrollSmoother, MorphSVG, Draggable, Observer). Webflow acquired GreenSock and removed the paywall. Confirmed on
gsap.com/pricing. Zero licence cost for a commercial client project.

### Era's animation module — our feature checklist

Their bundle exposes these initialisers:

```
initPreloader          initPageTransitions    initSnapSections     initThemeChange
initPins               initAllParallax        initScrollElementsReveal
initSlider             initCarousel           initImageZoom        initIndexCounter
initMagneticEffect     initLinkHover          initBtnCircleHover   initNavItemHover
initLenis              initLocalLenis         initScrollBar        initPlayPauseVideoScroll
initAccordion          initTabs               initFilter           initLightbox
```

Their easing curves — copy verbatim, this is what "expensive" feels like:

```js
CustomEase.create("Out",   "0.25,1,0.5,1")      // default reveal
CustomEase.create("In",    "0.5,0,0.75,0")
CustomEase.create("InOut", "0.75,0,0.25,1")     // section / theme transitions
CustomEase.create("Ease",  "0.25,0.1,0.25,1")
CustomEase.create("diveIn","0.6,0,0,1")         // dramatic image reveals
```

---

## 2. Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | This is an image-heavy site — `next/image` (AVIF/WebP, responsive `srcset`, blur placeholders, lazy loading) is the single biggest reason to pick it. See §6. |
| Styling | **Tailwind CSS v4** + a CSS-variable theme layer | v4 is CSS-native (`@theme`), so section theming and motion tokens live in one place. |
| Animation core | **GSAP 3.15** + `@gsap/react` (`useGSAP`) | ScrollTrigger, SplitText, CustomEase, Observer, Draggable, ScrollToPlugin, MotionPathPlugin. All free. |
| Smooth scroll | **Lenis 1.3.26** | Driven off `gsap.ticker`, not its own RAF loop. |
| Page transitions | Next.js **View Transitions** + a GSAP curtain overlay | Modern replacement for Era's Barba.js (which only exists because Webflow forces MPA). |
| Carousel | **Embla Carousel 8** — only where a real carousel is needed | The HBA slider and Voltask track are hand-built GSAP; a library can't do those. |
| Fonts | `next/font`, self-hosted | One high-contrast condensed **display serif**, one **grotesk** for UI/body, one **script** accent (see §4.1). |
| Deploy | **Vercel** | Free, instant, custom pitch URL. Also gives us the image CDN for free. |
| CMS *(phase 2)* | Sanity or Payload | Not for the demo. Local typed content files. Pitch the CMS as paid scope. |

### Deliberately excluded

- **Webflow** — a monthly fee for a builder we bypass anyway.
- **ScrollSmoother** — conflicts with Lenis and fights React's DOM.
- **Three.js / WebGL** — Voltask barely uses it; it would cost us the Lighthouse score.
- **Framer Motion / motion.dev** — a second animation runtime next to GSAP is dead weight.
- **jQuery** — only present on those sites because Webflow/WordPress force it.

---

## 3. Page composition

Where each borrowed section actually lands. **Note the Modus correction:** its hero treatment is used
mid-page as a statement band, not as our hero.

Revised to follow era-residence.com's own running order — their scroll counter
goes 00 → 09 across the hero, then straight into "why choose us" at ~16.

| # | Section | Source | Theme |
|---|---|---|---|
| 0 | Preloader (counter + curtain) | Era / Bloom | dark |
| 1 | **Hero** | **era-residence** | image, light text |
| 2 | **Why choose us — "three reasons"** | **era-residence** | sage (arch overlaps the hero) |
| 3 | **Statement band** | **modusprojects (its hero, relocated)** | image, light text |
| 4 | **Portfolio mosaic** | **bloom3d** | dark |
| 5 | **Featured project slider** | **hba** | image, light text |
| 6 | Architecture / craft | era-residence | bone → image |
| 7 | **Image scroll slider** | **voltaskai** | bone / warm light |
| 8 | Team quote | era-residence | image, light text |
| 9 | Contact / footer | era-residence | deep clay |

Sections 1–2 are the pitch — the dome rising out of the hero photograph is the
single most recognisable move on the reference site. If time runs short, ship
0–2 plus 9 and cut the middle.

---

## 4. Section-by-section build map

### 4.1 Hero — `era-residence.com-hero-1.1 / 1.2`

**What the screenshots show:** opens on a full-bleed deep-blue sky with only the top of a palm and a white
rooftop in frame. The title is an enormous high-contrast display serif — `ERA` / `RESIDENCE` stacked — with a
**script-face accent word** ("Estepona") overlapping the baseline of the second line. Beneath it, a strapline
split across the full width (`A PLACE` … `TO RETURN TO`) and a small **BY DAY / BY NIGHT** toggle. Scrolling
dives the camera down into the property render (screenshot 1.2), which carries **circular pulsing hotspot
markers** and a centred circular `VIEW AVAILABLE APARTMENTS` button.

**Build:**
- Full-bleed background that scrubs from sky to property — either a tall image panned with `scrub`, or the
  Modus approach of a **scroll-scrubbed frame sequence** drawn to `<canvas>` (see §4.2 note). Start with the
  simpler scaled-pan; upgrade if we have time.
- Title: `SplitText` by line with `mask: "lines"`, `yPercent: 100 → 0`, `stagger: 0.06`, ease `Out`.
- Script accent word animates in separately, slightly later and slower — it should feel hand-drawn.
- Strapline words fade in from the outer edges inward.
- **Day/night toggle**: cross-fade two background images with `gsap.to(..., {autoAlpha})`. Cheap, and it reads
  as a genuinely custom feature in the pitch.
- **Hotspot markers**: absolutely-positioned dots with a CSS ping animation; click opens a small tooltip card
  (Era's `initModalTip`). Percentage-based coordinates stored in the project content file.
- Centre circular button with rotating `textPath` label + magnetic hover.

### 4.2 Statement band — `www.modusprojects.nl-hero-but-will-be-used-as-other-section`

**What the screenshot shows:** full-bleed warm sunset photograph of a tower. An **oversized bold grotesk
headline in two lines that bleeds off the left edge of the viewport** (`ANDERS DENKEN, / SLIMMER REALISEREN.`) —
the crop is deliberate. Below it, three lines of supporting copy. A **floating translucent pill navbar** rides
at the top with a blurred backdrop and an accent-coloured CTA. Down-arrow scroll cue bottom-left.

**Build:**
- Section is `100vh`, full-bleed image with a subtle scale-down on scrub (`scale: 1.12 → 1`).
- Headline: `clamp()` sized to overflow the viewport, `margin-left` negative so it clips at the left edge.
  `SplitText` by line, mask reveal, `stagger: 0.08`.
- Supporting copy reveals by line just after, `stagger: 0.04`.
- The floating pill nav is a **global** component (see §5), not part of this section — it gains
  `backdrop-filter: blur()` and a translucent background once scrolled past the hero.
- **Note on the frame sequence:** Modus animates their hero image via ~130 sequential JPEGs
  (`cdn.overflow.nl/modus-sequence-v2/frame000.jpg` … `frame12x.jpg`) drawn to a canvas and scrubbed by
  ScrollTrigger. It looks incredible but costs ~10–15 MB. **Recommendation: skip it for the demo** — a video
  or a scaled pan gets 80% of the effect for 5% of the payload. Keep it as a paid-scope talking point.

### 4.3 Portfolio mosaic — `bloom3d.studio-project-list-1.1 / 1.2`

**Correction from my first draft:** this is *not* a text list with hover images. It is a **dense, edge-to-edge
staggered image mosaic**. Rows of 2–3 images with unequal widths and horizontal offsets, tight ~4px gutters,
scrolling vertically and bleeding off both edges. Captions (`The Ubud` … `Bali`) appear as an overlay on the
active/hovered image, project name left and location right along the image's bottom edge.

**Build:**
- CSS Grid with per-row `grid-template-columns` variations, driven from the content file so each row's rhythm
  is data, not markup.
- Rows enter with `clipPath: inset(0 0 100% 0) → inset(0)` on scrub, `stagger` across the row.
- Alternate columns get slightly different `yPercent` parallax rates — this is what makes the mosaic feel
  liquid rather than static.
- **Hover (desktop):** caption fades up, image `scale: 1.04`, siblings drop to `opacity: 0.5` with a short
  `power2.out`. **Mobile:** caption always visible; parallax and hover states stripped via `gsap.matchMedia()`.
- This is our densest section — 15–20 images. Everything below the fold must be lazy-loaded (§6).

### 4.4 Featured project slider — `hba.com-project-scroll-slider-1.1 / 1.2`

**Correction:** it's not a plain horizontal rail. The composition is **two layers**: a full-bleed background
image, darkened and slightly over-scaled, with a **centred inset panel** (roughly 80% width, 75% height) showing
the active project. The project title sits bottom-left in a large **light-weight sans**, deliberately
overlapping the panel's left edge so it spans both layers. A pill `VIEW PROJECT` outline button sits under the
title, and a metadata row runs bottom-right: studio / typology / country / year.

**Build:**
- Pin the section; advance slides on wheel/drag via `Observer`.
- On slide change: background cross-fades to the new image (dimmed, `scale: 1.1`), the inset panel wipes with
  `clipPath`, and the title swaps with a `SplitText` line-mask out/in.
- Title overlaps both layers by sitting in a higher stacking context with no clipping — the overlap is the
  detail that makes it look designed.
- Metadata row items stagger in at `0.025`.
- Do **not** use Splide (what HBA uses). GSAP `Observer` gives us finer control and no extra dependency.

### 4.5 Architecture / craft — `www.era-residence.com-Architecture-1.1 / 1.2`

**1.1** — bone/off-white background, **two portrait images at different vertical offsets** moving at different
parallax rates, with **cut-out transparent-PNG bougainvillea** overlaid at the bottom-left and right corners as
a *foreground* layer. The flowers move faster than the images, which manufactures real depth.

**1.2** — the section flips to a full-bleed exterior shot with a left-aligned ragged-right condensed serif
statement, small-caps credits beneath (`BY … / ARCHITECTS …`), and a circular outline `BOOK A CALL NOW` button.

**Build:**
- Layered parallax: background bone panel (static) → images (`yPercent: -8` / `-14`) → botanical PNGs
  (`yPercent: -24`), all on `scrub: 1`.
- Foreground cut-outs are the highest-value/lowest-effort trick on the whole page. We need 2–3 transparent PNGs
  of foliage (see §6).
- Transition into 1.2 is Era's `clip` system: the full-bleed panel is `position: sticky` and the bone panel
  above it animates `clipPath` upward, peeling away.
- Theme flips bone → dark on that boundary; nav and logo invert (§5).
- Statement text: `SplitText` by line, scrub-linked so it writes on as you scroll.

### 4.6 Image scroll slider — `voltaskai.endover.ee-image-scroll-slider`

**Correction from my first draft:** this is not a vertical parallax stack. It's a **split layout** — a **sticky
left text column** (serif heading + justified body paragraph, ~30% width) beside a **horizontally scrolling
image track** on the right that bleeds off the viewport edge. Warm blush background, generously rounded image
corners, and a custom vertical scrollbar thumb pinned to the far right edge.

**Build:**
- Pin the section. Left column stays fixed; the right track translates `x: -(trackWidth - viewportWidth)` on
  `scrub: 1`, with `snap` to image boundaries.
- Left column copy swaps as the track passes thresholds — each image can carry its own heading/paragraph,
  cross-fading with a short `y` offset. This makes one pinned section do the work of four.
- Add the **scroll-velocity skew**: read `ScrollTrigger.getVelocity()`, clamp through `gsap.utils.clamp()`,
  feed into `skewY` via a `quickTo` setter. That elastic drag is the highest-impact micro-detail here.
- Custom scrollbar thumb = a fixed 1px rail with a `height`/`y` bound to global scroll progress (Era's
  `initScrollBar`).
- **Mobile:** collapse to a stacked layout with a native `overflow-x` swipe track. Do not pin.

### 4.7 Why choose us — `www.era-residence.com-why-choose-us-1.1 / 1.2`

**1.1** — a huge **pale-blue arch/dome panel rises from the bottom over the previous section**, with the heading
set **on a curved path** following the dome's edge (`THREE REASONS TO CHOOSE ERA`). Centred logo mark flanked by
`COSTA` / `DEL SOL`, a thin vertical rule, and a small-caps tagline.

**1.2** — inside the panel, each reason is a full-viewport slide: an enormous condensed display serif headline
(`REAL-LIFE LOCATION`), a **small centred image with its own 1/2 pagination** (prev/next chevrons and a progress
rule), a short centred paragraph, and a bold small-caps kicker.

**Build:**
- The dome is a `border-radius: 50% 50% 0 0 / 100% 100% 0 0` panel animating `yPercent: 100 → 0` on scrub.
  Theme switches to `pale-blue` as it covers the viewport; logo and nav invert to dark.
- Curved heading: inline `<svg>` with `<textPath>` on an arc, or GSAP **MotionPathPlugin** to place each
  character. SVG `textPath` is simpler and resolution-independent — use that.
- Three reason panels, `ScrollTrigger` snap between them.
- Headline: `SplitText` by character, `stagger: 0.025`, ease `Out`.
- Inner image slider: small enough that **Embla** is justified here — with a GSAP-animated progress rule.

### 4.8 Team quote — `www.era-residence.com-team-quote.png`

Full-bleed golden-hour image. A large `"` glyph, then the quote in condensed display serif, **right-aligned with
a ragged left edge**, revealing line by line — the screenshot is caught mid-reveal, so the reveal is
**scrub-linked**, not a one-shot on enter. Attribution in small caps beneath: role on line one, company on line two.

**Build:**
- Background gets a slow `scale: 1.08 → 1` Ken Burns across the whole pin.
- `SplitText` by line with `mask: "lines"`; each line's `yPercent` tied to scroll progress so the reader
  controls the pace.
- Quote glyph fades in first, attribution last.

### 4.9 Contact / footer — `www.era-residence.com-contact.png`

**Correction:** there is **no contact form**. The section is a deep aubergine panel whose hero element is the
**phone number set in enormous display serif** — the numerals are the graphic. Above it, the logo mark; below,
`SALES OFFICE` plus the address in small caps. Footer rail: legal line left, credit right. The left scroll rail
now reads `100` and flips to an up-arrow labelled `TO TOP`.

**Build:**
- Preceding image panel clips away to reveal the aubergine (same `clip` mechanism as §4.5).
- Phone number: `SplitText` by character, `stagger: 0.03`, ease `Out`. It's a `tel:` link with a subtle
  per-character hover lift.
- Scroll rail flips at the final ScrollTrigger boundary; clicking scrolls to top via `ScrollToPlugin`.
- **Add a real form on `/contact`** — the homepage keeps Era's phone-number treatment, but the demo needs to
  prove we can build a validated form somewhere. Best of both.

---

## 5. Global systems — build these first

Every section depends on these.

1. **Lenis + GSAP ticker bridge** — verbatim from Modus:
   ```js
   const lenis = new Lenis()
   lenis.on('scroll', ScrollTrigger.update)
   gsap.ticker.add((t) => lenis.raf(t * 1000))
   gsap.ticker.lagSmoothing(0)
   ```
2. **Left scroll rail** — appears in *every single Era screenshot*: a thin vertical rule, a **numeric progress
   counter** (`00` → `16` → `77` → `100`), a vertical `SCROLL` label, and a down-arrow that becomes `TO TOP` at
   the end. Cheap to build, and it ties the whole page together.
3. **Rotating circular logo lockup** — top-left, `ERA · RESIDENCE` on a circular `textPath`, slow continuous
   rotation, inverts light/dark with the section theme.
4. **Theme system** — each `<section data-theme="dark|bone|blue|aubergine|image">` drives a ScrollTrigger that
   sets the theme on `:root`. Nav, logo, and scroll rail read CSS variables, so they invert automatically. This
   one mechanism produces most of the site's polish.
5. **Nav** — Modus's floating translucent pill (blurred backdrop, accent CTA) over image sections; Era's bare
   text links over flat-colour sections. Hides on scroll-down, reveals on scroll-up.
6. **Preloader** — 0→100 counter + `clip-path` curtain. **Session-gated**: Bloom sets
   `sessionStorage.setItem("hasVisited", "true")` and plays a short version thereafter. Do this.
7. **Page transitions** — curtain in, route change, curtain out.
8. **Custom cursor** — scales over images, shows `VIEW` on project cards, `DRAG` on sliders.

---

## 6. Image strategy — the section that matters most here

This is an image-heavy portfolio: roughly **60–80 images** across the page. Handled badly this becomes a 40 MB
site that stutters, and every animation above is wasted. Handled well it is the strongest thing in the pitch.

### 6.1 Sourcing

All five sites serve their photography from public CDNs with **no hotlink protection** — I verified direct
downloads return `200` with full-size originals:

| Source | Usable images | Notes |
|---|---|---|
| `hba.com/wp-content/uploads/` | ~63 | Real hotel/resort interiors, up to 2048px. The best interior-design set. |
| `cdn.prod.website-files.com` (era) | ~49 | Mediterranean architecture renders, incl. `img_cta_1920.png` |
| `cdn.endover.ee/voltaskai/` | ~67 | Tower exteriors + penthouse interiors, some 8K |
| `cdn.prod.website-files.com` (modus) | ~34 | Material/tile close-ups, AVIF already |
| `cdn.prod.website-files.com` (bloom) | ~25 | 3D architectural visualisation, WebP |

Harvest script writes to `public/images/<source>/`, then a normalisation pass converts everything to AVIF +
WebP at four widths (640 / 1080 / 1920 / 2560) and generates blur placeholders.

**Also needed:** 2–3 **transparent cut-out PNGs** of foliage for the §4.5 foreground layer. Era's are custom;
we can cut our own from any of the harvested garden shots, or pull pre-cut foliage PNGs from a stock source.

> **One caution, then it's your call.** These are real firms' copyrighted project photographs — HBA's are
> published hotel interiors, Era's renders are credited to OCWA Architects. They're ideal for building against
> because they're already composed for these exact crops. The risk is at pitch time: if the prospect recognises
> a competitor's project, the demo undercuts itself. **Suggested split — build with them, then swap the
> hero-visible ones for licensed stock (Unsplash/Pexels have excellent free-for-commercial architecture and
> interior sets) before the site goes public or in front of the client.** The layout work carries over
> unchanged because the crops stay identical.

### 6.2 Pipeline

- **`next/image` everywhere** — never a raw `<img>`. Gives AVIF/WebP negotiation, responsive `srcset`, and
  lazy loading for free.
- `priority` on hero + first mosaic row **only**. Everything else lazy.
- `placeholder="blur"` with generated `blurDataURL` — the blur-up is itself part of the premium feel.
- Explicit `sizes` per section, e.g. mosaic `sizes="(max-width:768px) 100vw, 33vw"`. Without this Next ships
  desktop-width files to phones.
- Target **< 250 KB per image** at 1920px in AVIF. The 8K Voltask sources must be downscaled before commit.
- Images inside pinned/scrubbed sections need `will-change: transform` applied on ScrollTrigger enter and
  **removed on leave** — a page with 60 permanently-promoted layers will crawl.
- Content model: one typed entry per project carrying `src`, `alt`, `width`, `height`, `blurDataURL`, plus
  section-specific fields (mosaic span, hotspot coordinates). Generated by the normalisation script so
  dimensions are never hand-typed.

---

## 7. Project structure

```
src/
  app/
    layout.tsx              # fonts, Lenis provider, Preloader, Nav, ScrollRail, Cursor
    page.tsx                # composes sections 1–9
    projects/[slug]/page.tsx
    contact/page.tsx
  components/
    layout/     Nav  Footer  Preloader  PageTransition  CustomCursor  ScrollRail  LogoMark
    sections/   Hero  StatementBand  PortfolioMosaic  ProjectSlider
                Architecture  ImageScrollSlider  ThreeReasons  TeamQuote  Contact
    ui/         MagneticButton  CircleButton  RevealText  ParallaxImage
                CurvedHeading  Hotspot  MediaImage
  lib/
    gsap.ts                 # registerPlugin + CustomEase definitions (single source of truth)
    lenis.ts
    motion-tokens.ts
    themes.ts               # CSS-variable palettes per section theme
  hooks/
    useSmoothScroll  useScrollVelocity  useSplitText  useMagnetic  useSectionTheme
  content/
    projects.ts  reasons.ts  studio.ts   # typed local content, no CMS
scripts/
  harvest-images.ts         # download from source CDNs
  normalise-images.ts       # AVIF/WebP × 4 widths + blurDataURL + dimensions
public/images/
```

---

## 8. Motion tokens

One file. Inconsistent easing is the single biggest tell of an amateur build.

```ts
export const EASE = {
  out:   'Out',    // 0.25,1,0.5,1     — reveals, the default
  in:    'In',     // 0.5,0,0.75,0     — exits
  inOut: 'InOut',  // 0.75,0,0.25,1    — section + theme transitions
  dive:  'diveIn', // 0.6,0,0,1        — dramatic image reveals
} as const

export const DUR = { fast: 0.4, base: 0.8, slow: 1.2, curtain: 1.6 } as const
export const STAGGER = { tight: 0.025, base: 0.06, loose: 0.1 } as const
```

---

## 9. Performance budget

Any developer can add GSAP. A *fast* animated site is the differentiator.

- **Lighthouse ≥ 90 mobile.** Screenshot it for the pitch deck.
- Total page weight **< 6 MB** on first load despite 60+ images — achievable because only ~8 are above the fold.
- Animate **only** `transform`, `opacity`, and `clip-path`. Never `top`/`left`/`width`.
- `will-change` added on ScrollTrigger enter, removed on leave.
- `gsap.matchMedia()` to strip pinning and heavy parallax below 768px — pinning on mobile is a bug factory.
- Honour `prefers-reduced-motion`: kill scrub animations, keep opacity fades. Also an accessibility talking point.
- JS budget < 250 KB gzipped. GSAP + plugins ≈ 70 KB, Lenis ≈ 5 KB, Embla ≈ 10 KB — comfortable.

---

## 10. Build phases

| # | Phase | Output |
|---|---|---|
| 1 | **Foundation** | Next.js + TS + Tailwind v4, fonts, motion tokens, `lib/gsap.ts`, Lenis provider, theme system |
| 2 | **Image pipeline** | Harvest + normalise scripts, `MediaImage` wrapper, typed content files. **Do this before any section** — every section consumes it |
| 3 | **Global chrome** | Nav (pill + bare variants), scroll rail + counter, rotating logo, preloader, cursor, curtain transition |
| 4 | **Hero** | Era treatment: dive, SplitText title, day/night toggle, hotspots, circular CTA |
| 5 | **Statement band + Portfolio mosaic** | Modus band, Bloom mosaic with row parallax + hover captions |
| 6 | **Featured project slider** | HBA two-layer slider with Observer |
| 7 | **Architecture + Image scroll slider** | Layered parallax w/ foreground cut-outs, clip transition; Voltask pinned split |
| 8 | **Three reasons + Team quote + Contact** | Dome clip panel w/ curved SVG heading, scrub quote, aubergine footer |
| 9 | **Project detail page + /contact form** | Proves depth — a homepage-only demo reads as a template |
| 10 | **Polish + perf** | Reduced-motion, mobile matchMedia passes, Lighthouse, OG images, 404 |
| 11 | **Deploy** | Vercel + pitch URL |

**If time is short:** phases 1 → 2 → 3 → 4 → 5, then jump to 8's contact section and deploy. A short site that is
flawless beats a long one that stutters.

---

## 11. Open decisions

1. **Real firm's branding or an invented studio?** If we have the target company's name and logo, the pitch is
   dramatically more persuasive — they see *their* site, not a template. Needed before phase 3.
2. **Image swap before the pitch?** See the caution in §6.1. My recommendation is build-with, swap-before-show.
3. **Does the client need to edit content?** If yes, CMS in phase 2 of the real project. For the demo, keep
   local typed content and pitch the CMS as paid scope — it demonstrates upsell thinking.
4. **Palette.** The references span four directions: Era's pale-blue + aubergine + bone, Modus's warm sunset
   orange, Voltask's blush, Bloom's near-black. We should pick one and commit. My lean: **bone / warm off-white
   base, deep charcoal-green as the dark theme, one terracotta accent** — reads as architecture rather than
   real-estate marketing, and photographs of both exteriors and interiors sit well on it.

---

## 12. Build status — phases 1–10 complete (2026-09-09)

All ten phases are implemented, type-checked, linted and building clean.
Decisions taken: fictional studio (**Verra Atelier**, Lisboa), no CMS, build-with-then-swap on
imagery, palette chosen below.

### Palette (decision 4)

| Token | Value | Role |
|---|---|---|
| `--bone` | `#EDE8DF` | warm off-white base |
| `--forest` | `#131A16` | charcoal-green dark theme |
| `--sage` | `#C6CFC4` | pale panel (the "three reasons" dome) |
| `--clay` | `#33201A` | deep footer ground |
| `--terracotta` | `#B4532A` | single accent |

Five section themes (`bone` / `dark` / `sage` / `clay` / `image`) drive nav, logo and scroll rail
by CSS variable, so the whole chrome inverts from one mechanism.

### What shipped

- 9 homepage sections in the §3 order, plus 5 static project pages, a validated `/contact` form
  and a 404.
- Global chrome: session-gated preloader, theme-inverting nav (pill + bare), left scroll rail with
  00→100 counter, rotating logo lockup, custom cursor, magnetic and circular buttons.
- 58 harvested images through a generated manifest with blur placeholders.

### Bugs found and fixed during visual verification

Caught by driving a headless browser over the built site rather than by reading the code:

1. **Themes applied one section late.** Theme triggers were created before the pinned sections
   inserted their spacers, so every boundary was measured against a much shorter document. Fixed
   with `refreshPriority: -10` plus explicit refreshes on load and font-ready.
2. **The dome added ~3,700px of phantom scroll height.** Animating a full-height panel by
   `yPercent: 100` inflated `scrollHeight` at load, throwing off every ScrollTrigger end position
   on the page — the scroll counter hit 100 three sections early.
3. **Reason body copy never revealed.** The dome's transform shifted its children's measured
   positions, so the reveals inside it never fired. The container is no longer transformed.
4. **The arch was invisible.** The theme controller had already switched `<body>` to sage, so the
   dome's rounded top was silhouetted against an identical colour. The section now paints an
   explicit bone ground, and the arch is a dedicated capped element rather than a `border-radius`
   on a 3,700px box.
5. **The material track slid over its own sticky text column** — `overflow-visible` on the track
   wrapper. It now clips at the column edge and measures travel from the real wrapper width.
6. **`Math.random()` in render** for SVG `textPath` ids would have produced server/client
   mismatches on hydration. Replaced with `useId()`.
7. **Nav CTA was invisible on photographic sections** — it used `var(--accent)`, which resolves to
   bone under the `image` theme, putting bone text on a bone pill.
8. **Two mosaic tiles were the same photograph.** Webflow serves identical assets under different
   alt-derived filenames; caught by content-hashing the whole harvest.
9. Scroll-rail progress, ring-text overlap, oversized foliage and mobile hotspot clutter.

### Revision — Era running order (same day)

Reordered so "why choose us" follows the hero directly, as on the reference, and rebuilt both
sections to match it more closely:

- **The arch now rises out of the hero photograph.** The dome section carries a `-46vh` margin and
  paints no background above its cap, so the hero's still-pinned plate shows through around the
  shoulders — palms, facade and a live hotspot marker, exactly as in `why-choose-us-1.1.png`.
- **The hero opens on sky.** The plate is now 138% of viewport height, top-anchored, and pans down
  through the image on scrub. Previously it scaled out from the full scene, so the sky moment the
  reference opens on never existed.
- **Arch depth set to `28vw`**, matching Era's measured drop of ~0.28 × width.
- **Fixed: margin collapse flattened the arch to a sliver.** The shoulder header's `-24vw` pull
  collapsed through the panel below and dragged the whole box up over the cap. `flow-root`
  establishes a block formatting context and stops it.
- Verified after the reorder: all 10 section themes resolve correctly, zero runtime errors.

### Measured performance

| | Desktop 1440×900 | Mobile 390×844 |
|---|---|---|
| First-load transfer | 1.36 MB | 1.21 MB |
| FCP | 1448 ms | 772 ms |
| LCP | 1448 ms | 772 ms |
| CLS | 0 | 0 |

Comfortably inside the §9 budget of 6 MB. CLS is effectively zero because every image carries
intrinsic dimensions and a blur placeholder from the manifest. Measure against a freshly-started production server: a stale `next start` left
over from a previous build, or a dev server competing for CPU, produces garbage
(one run reported an 18-second FCP purely from port contention). Warm the image
optimiser with one throwaway load first, since Next generates AVIF variants on
demand for the first request of each asset.

### Still outstanding

- **Swap the placeholder imagery** before any public deploy or client presentation (§6.1).
- Deploy to Vercel (phase 11) — not run, since the pitch URL should be created under your account.
