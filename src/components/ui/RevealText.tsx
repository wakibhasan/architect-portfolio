'use client';

import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { STAGGER } from '@/lib/motion-tokens';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * Escape hatch for values Tailwind cannot express as a class. Needed for
   * anything containing a comma inside a CSS function — an arbitrary value like
   * bg-[linear-gradient(...color-mix(a,b,c)...)] does not merely fail, it
   * compiles with the inner function silently stripped.
   */
  style?: CSSProperties;
  /** 'lines' for headlines, 'words' for body/quotes, 'chars' for display numerals. */
  split?: 'lines' | 'words' | 'chars';
  /** Tie the reveal to scroll position instead of firing once on enter. */
  scrub?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
  /**
   * The tween that scrolls a horizontal track, when this text rides inside one.
   * ScrollTrigger then measures the element along that track instead of down
   * the page — without it every panel in a horizontal scroller shares one
   * vertical position, so all of them would reveal at the same moment, most
   * of them off-screen.
   */
  containerAnimation?: gsap.core.Tween | null;
};

/**
 * SplitText line-mask reveal (yPercent 110 → 0 behind an overflow-hidden
 * wrapper) — the single most-used motion across all five reference sites.
 *
 * SplitText's mask:'lines' option generates the clipping wrapper for us, and
 * revert() on cleanup restores the original DOM so React never sees the split.
 */
export function RevealText({
  children,
  as: Tag = 'div',
  className,
  style,
  split = 'lines',
  scrub = false,
  delay = 0,
  stagger,
  start = 'top 82%',
  containerAnimation = null,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      let st: ScrollTrigger | undefined;
      let instance: SplitText | undefined;
      let cancelled = false;

      const run = () => {
        if (cancelled || !ref.current) return;

        instance = SplitText.create(el, {
          type: split,
          mask: split === 'lines' ? 'lines' : undefined,
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char',
        });

        const targets =
          split === 'lines' ? instance.lines : split === 'words' ? instance.words : instance.chars;

        gsap.set(el, { autoAlpha: 1 });
        gsap.set(targets, { yPercent: 110 });

        const tween = gsap.to(targets, {
          yPercent: 0,
          duration: scrub ? 1 : 0.95,
          ease: 'Out',
          stagger: stagger ?? (split === 'lines' ? STAGGER.base : STAGGER.tight),
          delay: scrub ? 0 : delay,
          paused: true,
        });

        // Inside a container animation the start/end keywords switch axis:
        // 'left'/'right' are the element's edges along the track, and the
        // second value is still a position in the viewport.
        st = ScrollTrigger.create({
          trigger: el,
          containerAnimation: containerAnimation ?? undefined,
          start: containerAnimation ? 'left 78%' : start,
          end: containerAnimation ? 'right 22%' : scrub ? 'bottom 55%' : 'bottom top',
          scrub: scrub ? 1 : false,
          animation: tween,
          once: !scrub,
        });
      };

      // Wait for webfonts so the split measures at final metrics — splitting
      // against a fallback face produces wrong line breaks.
      if (document.fonts && document.fonts.status !== 'loaded') {
        document.fonts.ready.then(run);
      } else {
        run();
      }

      return () => {
        cancelled = true;
        st?.kill();
        instance?.revert();
      };
    },
    { scope: ref, dependencies: [split, scrub, containerAnimation] },
  );

  return (
    <Tag ref={ref} data-reveal className={cn(className)} style={style}>
      {children}
    </Tag>
  );
}
