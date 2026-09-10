'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { studio } from '@/content/studio';
import { SCRUB, MM } from '@/lib/motion-tokens';

/**
 * Section 8 — the Era team-quote treatment (TECH-PLAN §4.8).
 *
 * Full-bleed golden-hour plate with a slow Ken Burns. The quote is right
 * aligned with a ragged left edge and reveals line by line on SCRUB, so the
 * reader controls the pace — the screenshot is caught mid-reveal, which is
 * what gave that away.
 */
export function TeamQuote() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM.desktopMotion, () => {
        gsap.fromTo(
          '[data-quote-bg]',
          { scale: 1.14 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: SCRUB,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="image"
      className="relative flex min-h-dvh items-center overflow-hidden bg-[color:var(--forest)]"
      aria-label="From the studio"
    >
      <div data-quote-bg className="absolute inset-0">
        <MediaImage
          image="quote-bg"
          sizes="100vw"
          wrapperClassName="h-full w-full"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[color:var(--ink)]/62 via-[color:var(--ink)]/22 to-transparent" />
      </div>

      <div className="relative ml-auto w-full max-w-3xl px-[var(--gutter)] py-[16vh] text-right text-[color:var(--bone)]">
        <span
          className="block font-display text-[3.5rem] leading-[0.4] opacity-90"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <RevealText as="blockquote" className="t-quote mt-8" scrub>
          {studio.quote.text}
        </RevealText>

        <footer className="mt-10 flex flex-col items-end gap-1">
          <span className="t-label">{studio.quote.role}</span>
          <span className="t-label-sm opacity-70">{studio.quote.company}</span>
        </footer>
      </div>
    </section>
  );
}
