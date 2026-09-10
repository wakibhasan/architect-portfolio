'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { img } from '@/lib/images';
import { studio } from '@/content/studio';
import { SCRUB, MM } from '@/lib/motion-tokens';

/**
 * Section 2 — a fosterandpartners.com-style full-bleed film band, with the
 * title and its caption anchored in the bottom-left corner (TECH-PLAN §4.2).
 *
 * The band holds still once it reaches the top and lets the section after it
 * climb over — CSS sticky, not a pin, since nothing here needs to be scrubbed
 * against the cover. Everything below it in the page paints opaquely, which is
 * what makes being permanently stuck behind them harmless.
 *
 * The media layer is deliberately either/or rather than a <video> with an
 * image fallback inside it: with no file at studio.statement.video, a <source>
 * would 404 on every load and sit in the console as a permanent red herring.
 * Null renders the still; setting the path swaps in the film and promotes that
 * same still to its poster frame.
 */
export function StatementBand() {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      // Autoplaying film is motion the visitor did not ask for, and unlike a
      // GSAP tween it keeps going forever. Hold the poster frame instead.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        film.current?.pause();
      }

      // Once stuck, this section's bottom never crosses the viewport top, so
      // the old 'bottom top' end was a position it could no longer reach. End
      // on 'top top' instead: the settle finishes exactly as the band pins.
      const mm = gsap.matchMedia();
      mm.add(MM.desktopMotion, () => {
        gsap.fromTo(
          '[data-statement-bg]',
          { scale: 1.16 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'top top',
              scrub: SCRUB,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // Being covered is not the same as being gone: the band stays stuck
      // behind every later section, so without this the film would keep
      // decoding, unseen, for the whole rest of the page.
      const cover = document.querySelector('#work');
      const covered = cover
        ? ScrollTrigger.create({
            trigger: cover,
            start: 'top top',
            onEnter: () => film.current?.pause(),
            onLeaveBack: () => {
              if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                void film.current?.play();
              }
            },
          })
        : null;

      return () => {
        covered?.kill();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="image"
      /* sticky top-0, so the band parks when it fills the viewport and the
         Featured Projects section rides up over it rather than pushing it off.
         h-dvh exactly, not min-h: a sticky box taller than the viewport would
         scroll its own overflow past the top before it ever parked.

         items-end puts the content block on the floor of the section; the copy
         inside stays left-aligned, so it lands in the bottom-left corner at any
         viewport without absolute positioning. */
      className="sticky top-0 flex h-dvh items-end overflow-hidden bg-[color:var(--forest)]"
      aria-label="Studio positioning"
    >
      <div data-statement-bg className="absolute inset-0">
        {studio.statement.video ? (
          <video
            ref={film}
            className="h-full w-full object-cover"
            poster={img(studio.statement.poster).src}
            autoPlay
            muted
            loop
            /* Without playsInline, iOS Safari takes any autoplaying video
               fullscreen instead of leaving it in the layout. */
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={studio.statement.video} type="video/mp4" />
          </video>
        ) : (
          <MediaImage
            image={studio.statement.poster}
            sizes="100vw"
            wrapperClassName="h-full w-full"
            className="object-cover"
          />
        )}

        {/* Scrim rises from the floor because that is the only place type sits
            now — a left-to-right wash would leave the caption on bare film. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/85 via-[color:var(--ink)]/35 to-transparent" />
      </div>

      <div className="relative w-full px-[var(--gutter)] pb-[10vh] text-[color:var(--bone)]">
        <RevealText
          as="h2"
          className="font-sans max-w-[18ch] text-[clamp(1.25rem,5vw,4.75rem)] font-semibold uppercase leading-[0.9] tracking-[-0.035em]"
        >
          {studio.statement.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </RevealText>

        <RevealText
          as="p"
          className="t-body mt-6 max-w-xl text-[color:var(--bone)]/85"
          stagger={0.04}
        >
          {studio.statement.body}
        </RevealText>
      </div>
    </section>
  );
}
