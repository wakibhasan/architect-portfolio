'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { studio } from '@/content/studio';

/**
 * Section 8 — the voltaskai.endover.ee "final gallery" treatment.
 *
 * A warm gradient panel: eyebrow and a large gradient-filled heading on the
 * left, body copy and a Discover link on the right, then a full-bleed strip of
 * photographs tracking sideways underneath.
 *
 * One deliberate departure from the reference. Theirs sizes every tile
 * differently — `:nth-child(3n+1){height:13.5rem}`, `(3n+2){height:9.875rem}`,
 * `(3n+3){…}` — for a ragged, scrapbook edge. Ours are uniform, so the strip
 * reads as one band.
 */

/** Duplicated at render so the track can loop without a visible seam. */
const STRIP = [
  'mosaic-01', 'mosaic-05', 'mosaic-09', 'mosaic-02', 'mosaic-11',
  'mosaic-07', 'mosaic-14', 'mosaic-03', 'mosaic-16', 'mosaic-06',
] as const;

/**
 * Seconds for one full pass. This is not a free choice: the track travels half
 * its own width, so the tile size sets the distance and a fixed duration would
 * change the speed every time the tiles change. At 4:5 and 32rem tall they are
 * ~410px wide, giving ~4300px of travel; 50s holds the drift at ~86px/s, which
 * is where it has been throughout. Re-derive it if the tile size changes again.
 */
const CYCLE = 50;

export function QuarterGallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // The track holds the strip twice, so travelling exactly -50% lands on a
      // frame identical to the start and the repeat is invisible. Animating to
      // a measured pixel width instead would drift out of sync the moment a
      // font or image changed the layout.
      const loop = gsap.to(el, {
        xPercent: -50,
        duration: CYCLE,
        ease: 'none',
        repeat: -1,
      });

      // Slow to a crawl on hover rather than stopping dead — a hard stop reads
      // as the page freezing, and killing it outright loses the position.
      const slow = () => gsap.to(loop, { timeScale: 0.15, duration: 0.6, ease: 'Out' });
      const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.8, ease: 'Out' });
      const wrap = el.parentElement;
      wrap?.addEventListener('mouseenter', slow);
      wrap?.addEventListener('mouseleave', resume);

      return () => {
        wrap?.removeEventListener('mouseenter', slow);
        wrap?.removeEventListener('mouseleave', resume);
        loop.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="bone"
      /* Both attributes, for the reason spelled out on ThreeReasons' dome.
         data-section-theme tells ThemeController what the page chrome should
         become; data-theme redeclares --fg/--muted/--rule for this subtree.

         This ground is bone whatever the page is doing, but the chrome only
         switches once the section's top passes the viewport midpoint — and the
         heading, eyebrow and body all sit above that line, so they were on
         screen while the page still held ScrollSequence's "image" theme. The
         body read --fg and rendered bone on bone at zero contrast; the eyebrow
         (--muted) and the column rule (--rule) went translucent bone with it. */
      data-theme="bone"
      /* Their .final-gallery-images-section__background is a
         linear-gradient(111.68deg,#f4e5dd,#d5d5d5) — a warm blush falling to
         grey. Same move in our palette. */
      className="relative overflow-hidden bg-[linear-gradient(112deg,var(--bone),var(--bone-dim))] py-[14vh] text-[color:var(--ink)]"
      aria-label="The quarter"
    >
      <div className="px-[var(--gutter)]">
        {/* Measured off the reference: the heading column runs to ~46% of the
            frame, the rule sits at ~62%, and the body does not start until
            ~70%. The trough between them is most of the effect — at a narrow
            gap the two columns read as a table rather than as one held apart
            from the other. */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr] lg:gap-[8vw]">
          {/* left — eyebrow + heading */}
          <div>
            <span className="t-label block text-[color:var(--muted)]">
              {studio.quarter.eyebrow}
            </span>
            {/* Gradient-filled type, their .gradient-accent-3. bg-clip-text
                needs the text itself transparent or the fill is hidden behind
                its own glyphs. */}
            {/* Their heading never reaches full black — it opens at a soft warm
                grey and fades to about a quarter strength by the last word. Ours
                started at solid ink, which read as a normal headline with an odd
                pale tail rather than as one continuous fade. */}
            <RevealText
              as="h2"
              className="t-h2 mt-7 max-w-[19ch] bg-clip-text text-transparent"
              /* Inline because Tailwind cannot carry this: the commas inside
                 color-mix() break its arbitrary-value parser, and it compiles
                 the declaration with the inner functions stripped rather than
                 dropping the class — so the fade silently flattened to solid
                 ink and still looked plausible. */
              style={{
                backgroundImage:
                  'linear-gradient(102deg, color-mix(in srgb, var(--ink) 74%, transparent) 18%, color-mix(in srgb, var(--ink) 26%, transparent) 88%)',
              }}
            >
              {studio.quarter.heading}
            </RevealText>
          </div>

          {/* right — rule, body, CTA */}
          <div className="lg:border-l lg:border-[color:var(--rule)] lg:pl-[6vw]">
            <RevealText
              as="p"
              /* ~40 characters, as theirs runs. max-w-md was half again as wide
                 and turned the column into a second block of body copy rather
                 than a caption beside the heading. */
              className="t-body max-w-sm text-[color:var(--fg)]"
              stagger={0.03}
            >
              {studio.quarter.body}
            </RevealText>

            {/* Label and link are both the accent in the reference — the label
                was muted grey here, which broke them into two unrelated things
                instead of one stacked call to action. */}
            <div className="mt-12">
              <span className="t-label block text-[color:var(--terracotta)]">
                {studio.quarter.ctaLabel}
              </span>
              <Link
                href={studio.quarter.ctaHref}
                className="group mt-2 inline-block font-display text-[clamp(1.35rem,2.2vw,2rem)] leading-tight text-[color:var(--terracotta)]"
              >
                {studio.quarter.ctaText}
                {/* Standing rule, not one that animates away. It was scaling to
                    zero on hover, so pointing at the link erased its underline
                    — the opposite of what the affordance should do. */}
                <span className="mt-1 block h-px w-full bg-current opacity-60 transition-opacity duration-400 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* full-bleed strip */}
      <div className="mt-[10vh] w-full overflow-hidden">
        <div ref={track} className="flex w-max gap-5">
          {/* Rendered twice. aria-hidden on the copy so a screen reader is not
              read the same ten photographs over again. */}
          {[0, 1].map((pass) => (
            <div key={pass} className="flex w-max gap-5 pr-5" aria-hidden={pass === 1}>
              {STRIP.map((key) => (
                <figure
                  key={`${pass}-${key}`}
                  /* Uniform 4:5 portrait box for every tile — the point of
                     departure from the reference, whose tiles each take a
                     different height. Height is the fixed dimension and
                     aspect-[4/5] derives the width, so the ratio is stated once
                     and cannot drift out of step with a hand-typed width. */
                  className="aspect-[4/5] h-[21rem] shrink-0 overflow-hidden rounded-xl md:h-[32rem]"
                >
                  <MediaImage
                    image={key}
                    /* 4/5 of the heights above: 16.8rem and 25.6rem, rounded up. */
                    sizes="(max-width: 768px) 17rem, 26rem"
                    wrapperClassName="h-full w-full"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
