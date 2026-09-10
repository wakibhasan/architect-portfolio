'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MediaImage } from './MediaImage';
import { SCRUB, MM } from '@/lib/motion-tokens';
import type { ImageKey } from '@/lib/images';
import { cn } from '@/lib/cn';

type Props = {
  image: ImageKey | string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Vertical travel as a % of the element's own height. Negative = rises. */
  amount?: number;
  /** Reveal the image behind a clip-path wipe as it enters. */
  clip?: boolean;
  /** Slow zoom-out across the scroll range (Ken Burns). */
  zoom?: boolean;
};

/**
 * Scrub-linked parallax + optional clip reveal. The inner element is
 * over-sized so the translate never exposes an edge.
 */
export function ParallaxImage({
  image,
  alt,
  className,
  wrapperClassName,
  sizes = '100vw',
  priority = false,
  amount = -12,
  clip = false,
  zoom = false,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const inner = el.querySelector('[data-parallax-inner]');
      if (!inner) return;

      const mm = gsap.matchMedia();

      mm.add(MM.desktopMotion, () => {
        if (clip) {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0 0 0% 0)',
              ease: 'diveIn',
              duration: 1.3,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            },
          );
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: SCRUB,
            onEnter: () => el.classList.add('will-animate'),
            onLeave: () => el.classList.remove('will-animate'),
            onEnterBack: () => el.classList.add('will-animate'),
            onLeaveBack: () => el.classList.remove('will-animate'),
          },
        });

        tl.fromTo(inner, { yPercent: -amount / 2 }, { yPercent: amount / 2, ease: 'none' }, 0);
        if (zoom) tl.fromTo(inner, { scale: 1.14 }, { scale: 1, ease: 'none' }, 0);
      });

      mm.add(MM.mobile, () => {
        gsap.set(inner, { yPercent: 0, scale: 1 });
        if (clip) gsap.set(el, { clipPath: 'none' });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={cn('relative overflow-hidden', wrapperClassName)}
      style={clip ? { clipPath: 'inset(0 0 100% 0)' } : undefined}
    >
      <div data-parallax-inner className="absolute inset-0 scale-[1.18]">
        <MediaImage
          image={image}
          alt={alt}
          sizes={sizes}
          priority={priority}
          wrapperClassName="h-full w-full"
          className={className}
        />
      </div>
    </div>
  );
}
