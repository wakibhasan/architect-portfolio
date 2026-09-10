'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { details } from '@/content/reasons';
import { studio } from '@/content/studio';
import { SCRUB, MM } from '@/lib/motion-tokens';

/**
 * Section 6 — the voltaskai.endover.ee treatment (TECH-PLAN §4.6).
 *
 * A pinned split: sticky text column on the left, horizontally scrolling image
 * track on the right that bleeds off the viewport edge.
 *
 * The detail that sells it is the scroll-velocity skew — reading
 * ScrollTrigger.getVelocity() and feeding a clamped value into skewY via a
 * quickTo setter, so the images drag elastically against the scroll.
 */
export function ImageScrollSlider() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const track = el.querySelector<HTMLElement>('[data-track]');
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add(MM.desktopMotion, () => {
        const wrap = track.parentElement as HTMLElement;
        const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: SCRUB,
            invalidateOnRefresh: true,
            snap: { snapTo: 1 / (details.length - 1), duration: 0.35, ease: 'InOut' },
          },
        });

        // Velocity-linked skew — the elastic drag that sells the section.
        // getVelocity() lives on the ScrollTrigger *instance*, so we read it
        // from `self` inside onUpdate and decay the value back to zero.
        const cards = gsap.utils.toArray<HTMLElement>('[data-track-card]');
        const clamp = gsap.utils.clamp(-6, 6);
        const proxy = { skew: 0 };
        const applySkew = () => gsap.set(cards, { skewY: proxy.skew });

        const velocity = ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -340);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.7,
                ease: 'Out',
                overwrite: true,
                onUpdate: applySkew,
              });
            }
          },
        });

        return () => {
          velocity.kill();
          gsap.set(cards, { skewY: 0 });
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      mm.add(MM.mobile, () => {
        gsap.set(track, { x: 0, clearProps: 'transform' });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="bone"
      className="relative overflow-hidden bg-[color:var(--bone)] py-[12vh] md:h-dvh md:py-0"
      aria-label="Materials and detail"
    >
      <div className="flex h-full flex-col gap-12 md:flex-row md:items-center md:gap-0">
        {/* sticky text column */}
        <div className="shrink-0 px-[var(--gutter)] md:w-[38%] md:pl-[calc(var(--rail)+var(--gutter))]">
          <span className="t-label mb-7 block text-[color:var(--muted)]">
            {studio.detail.eyebrow}
          </span>
          <RevealText as="h2" className="t-h2 max-w-md text-[color:var(--ink)]">
            {studio.detail.heading}
          </RevealText>
          <RevealText
            as="p"
            className="t-body mt-8 max-w-sm text-[color:var(--muted)]"
            stagger={0.03}
          >
            {studio.detail.body}
          </RevealText>
          <span className="t-label-sm mt-10 hidden items-center gap-3 text-[color:var(--muted)] md:flex">
            SCROLL TO EXPLORE
            <span className="h-px w-12 bg-current opacity-40" />
            {String(details.length).padStart(2, '0')}
          </span>
        </div>

        {/* horizontal track — bleeds off the right edge */}
        <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden md:overflow-hidden no-scrollbar">
          {/* The trailing padding is what decides when the pin lets go, because
              distance() is scrollWidth - wrap.clientWidth and scrollWidth counts
              it. At 30vw the track kept travelling for nearly a third of a
              screen of empty space after the last image had fully arrived, so
              the page felt stuck. One gutter puts the last image's right edge a
              gutter in from the edge and ends the scroll there. */}
          <div
            data-track
            className="flex w-max gap-4 px-[var(--gutter)] md:gap-6 md:pl-0 md:pr-[var(--gutter)]"
          >
            {details.map((d) => (
              <figure
                key={d.key}
                data-track-card
                className="w-[72vw] shrink-0 sm:w-[52vw] md:w-[34vw]"
              >
                <MediaImage
                  image={d.key}
                  sizes="(max-width: 768px) 72vw, 34vw"
                  wrapperClassName="aspect-[4/5] w-full rounded-[2px]"
                  className="object-cover"
                />
                <figcaption className="t-label-sm mt-4 text-[color:var(--muted)]">
                  {d.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
