'use client';

import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { CircleButton } from '@/components/ui/CircleButton';
import { studio } from '@/content/studio';

/**
 * Section 5 — the Era architecture treatment (TECH-PLAN §4.5).
 *
 * A single full-bleed statement plate: the exterior shot behind a gradient,
 * with the positioning line, its credits and a circular call button sitting on
 * the floor of the frame.
 *
 * The bone panel that used to run above this — two offset portrait plates with
 * bougainvillea cut-outs parallaxing in front of them — has been removed, and
 * with it the clip-path peel that transitioned between the two. That peel was
 * the only reason this section carried any scroll-driven motion, so the whole
 * useGSAP block went with it.
 */
export function Architecture() {
  // The plate is full-bleed, so its breathing room comes from its neighbours —
  // and they did not agree. PortfolioMosaic's py-[14vh] leaves 14vh of bone
  // above it, while ImageScrollSlider is md:py-0 and butted straight up
  // underneath. Matching that 14vh here squares the two.
  //
  // md only: on phones the slider keeps py-[12vh], so the gap below is already
  // 12vh against 14vh above — adding another 14vh would push that boundary to
  // 26vh and break the symmetry rather than create it.
  return (
    <section
      id="studio"
      className="relative bg-[color:var(--bone)] md:pb-[14vh]"
      aria-label="Architecture and craft"
    >
      <div data-section-theme="image" className="relative h-dvh w-full overflow-hidden">
        <MediaImage
          image="arch-full"
          sizes="100vw"
          wrapperClassName="absolute inset-0 h-full w-full"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/70 via-[color:var(--ink)]/15 to-[color:var(--ink)]/30" />

        <div className="absolute inset-0 flex flex-col justify-end px-[var(--gutter)] pb-[12vh] text-[color:var(--bone)] md:pl-[calc(var(--rail)+var(--gutter))]">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <RevealText as="p" className="t-quote" scrub>
                {studio.architecture.statement}
              </RevealText>
              <div className="mt-8 flex flex-col gap-1">
                {studio.architecture.creditLines.map((line) => (
                  <span key={line} className="t-label-sm opacity-75">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            <CircleButton href="/contact" ring="BOOK A CALL · BOOK A CALL · " size={176}>
              Book a call now
            </CircleButton>
          </div>
        </div>
      </div>
    </section>
  );
}
