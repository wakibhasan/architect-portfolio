'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { mosaicRows, projects } from '@/content/projects';
import { SCRUB, MM, STAGGER } from '@/lib/motion-tokens';

/**
 * Section 3 — the bloom3d.studio "Featured Projects" treatment (TECH-PLAN §4.3).
 *
 * Measured off their own stylesheet rather than eyeballed: a 12-column grid on
 * 0.25rem gutters, items spanning 6 (two-up) or 4 (three-up), a centred
 * heading, and a caption pinned to the bottom of each tile with the title left
 * and the location right. Their breakpoints collapse it to two columns on
 * tablet and a single stacked column on phones.
 */

/** Flat list — every row in the data sums to 12, so nesting is authoring only. */
const CELLS = mosaicRows.flat();

/**
 * Two-up tiles run landscape, three-up run portrait. That alternation is what
 * gives the grid its rhythm; a single aspect for both makes every row the same
 * shape and the whole thing reads as a contact sheet.
 */
const ASPECT: Record<number, string> = {
  6: 'lg:aspect-[3/2]',
  4: 'lg:aspect-[5/6]',
};

const SPAN: Record<number, string> = {
  6: 'lg:col-span-6',
  4: 'lg:col-span-4',
};

export function PortfolioMosaic() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MM.desktopMotion, () => {
        const cells = gsap.utils.toArray<HTMLElement>('[data-mosaic-cell]');

        // Reveal in threes regardless of the row shape. Batching by index
        // rather than by a row wrapper is what lets the grid stay flat.
        cells.forEach((cell, i) => {
          gsap.fromTo(
            cell,
            { clipPath: 'inset(0 0 100% 0)', yPercent: 6 },
            {
              clipPath: 'inset(0 0 0% 0)',
              yPercent: 0,
              duration: 1.15,
              ease: 'diveIn',
              delay: (i % 3) * STAGGER.base,
              scrollTrigger: { trigger: cell, start: 'top 92%', once: true },
            },
          );

          // Slow drift inside the frame, offset per column so neighbours never
          // move in lockstep.
          gsap.fromTo(
            cell.querySelector('[data-mosaic-img]'),
            { yPercent: -6 },
            {
              yPercent: 6 + (i % 3) * 2.5,
              ease: 'none',
              scrollTrigger: { trigger: cell, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
            },
          );
        });

        // Only the image scale is left here. The scrim, caption and underline
        // reveal in CSS instead: a hover affordance should not be able to fail
        // because a listener did not attach, and this way it also works with
        // reduced motion on, before hydration, and on touch.
        const handlers = cells.map((cell) => {
          const img = cell.querySelector('[data-mosaic-img]');
          const on = () => gsap.to(img, { scale: 1.05, duration: 0.7, ease: 'Out' });
          const off = () => gsap.to(img, { scale: 1, duration: 0.7, ease: 'Out' });

          cell.addEventListener('mouseenter', on);
          cell.addEventListener('mouseleave', off);
          return () => {
            cell.removeEventListener('mouseenter', on);
            cell.removeEventListener('mouseleave', off);
          };
        });

        return () => handlers.forEach((fn) => fn());
      });

      // Caption and scrim are CSS-only below md, so nothing to set here.
      mm.add(MM.mobile, () => gsap.set('[data-mosaic-cell]', { clipPath: 'none' }));

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="work"
      /* Light ground, per their .section_portfolio{background-color:#f7f7f7}.
         The theme token has to change with the paint, not just the class: it is
         what tells ThemeController to flip the nav to dark-on-light here. */
      data-section-theme="bone"
      /* z-10 so this rides over the sticky band above it. Both are positioned,
         so DOM order would already decide it — stating it means a later
         z-index on a neighbour cannot quietly reverse the two. */
      className="relative z-10 bg-[color:var(--bone)] py-[14vh] text-[color:var(--ink)]"
      aria-label="Featured projects"
    >
      {/* Centred, per their .portfolio_heading{text-align:center} — the old
          left-aligned header with an eyebrow was our own invention. */}
      <header className="mb-[8vh] px-[var(--gutter)] text-center">
        {/* 4rem at desktop down to 1.75rem on phones, which is .u-h1's own
            ramp; t-h1 alone runs to 7.5rem. The trailing "!" is required —
            .t-h1 is unlayered CSS in globals.css and beats plain utilities. */}
        <RevealText as="h2" className="t-h1 text-[clamp(1.75rem,4.4vw,4rem)]!">
          Featured Projects
        </RevealText>
      </header>

      {/* One flat grid, not a stack of row wrappers: their spans do the work.
          12 columns from lg, two from md, single-column stack below. */}
      <div className="grid grid-cols-1 gap-1 px-1 md:grid-cols-2 lg:grid-cols-12">
        {CELLS.map((cell, i) => (
          <Link
            key={`${cell.key}-${i}`}
            href={`/projects/${projects[i % projects.length].slug}`}
            data-mosaic-cell
            data-cursor="VIEW"
            /* Explicitly bone: the caption sits on a dark scrim over the
               image, so it cannot inherit the section's colour now that the
               section is light — it would be dark text on a dark scrim. */
            className={`group relative block aspect-[4/3] overflow-hidden text-[color:var(--bone)] ${SPAN[cell.span]} ${ASPECT[cell.span]}`}
          >
            <div data-mosaic-img className="absolute inset-0 scale-[1.12]">
              <MediaImage
                image={cell.key}
                /* Matches the grid: half the viewport at md, a third at lg. */
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                wrapperClassName="h-full w-full"
              />
            </div>

            {/* Flat wash over the whole tile, matching their
                .portfolio_project_overlay{background:#000;inset:0}. A bottom
                gradient — which this was — leaves the caption sitting on
                whatever the photo happens to be doing there, so on the pale
                interiors it had almost no contrast to work with. */}
            {/* Visible by default, hover-driven only from md up — otherwise a
                touch device, which never fires hover, would show every caption
                on bare photography. */}
            <span
              data-mosaic-scrim
              className="absolute inset-0 bg-[color:var(--ink)] opacity-50 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-50 md:group-focus-visible:opacity-50"
            />

            <span
              data-mosaic-caption
              className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3 opacity-100 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.25,1,.5,1)] md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100"
              /* Inline, not a utility: the drop-shadow-[...] class this
                 replaces never compiled — the commas inside rgba() stop
                 Tailwind generating the rule, so it failed silently. */
              style={{ textShadow: '0 1px 12px rgba(18,16,14,0.6)' }}
            >
              <span className="relative">
                <span className="block text-[clamp(1.125rem,1.5vw,1.5rem)] font-medium leading-[1.3]">
                  {cell.caption}
                </span>
                {/* Their .project_btn_underline — a 2px rule that grows from
                    the left. scaleX is the cheap version of animating width. */}
                <span
                  data-mosaic-rule
                  className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(.25,1,.5,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
              <span className="shrink-0 text-[clamp(0.875rem,1.05vw,1.0625rem)] leading-[1.4] opacity-90">
                {cell.place}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
