'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useLenis } from '@/components/providers/SmoothScroll';

/**
 * The left rail (TECH-PLAN §5.2) — present in every Era screenshot: a hairline
 * rule, a numeric progress counter that runs 00 → 100, a vertical SCROLL label,
 * and an arrow that flips to TO TOP at the end of the page.
 */
export function ScrollRail() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      const progress = { v: 0 };

      // Page progress must be measured against maxScroll, not document.body —
      // pin spacers make the body's own box an unreliable proxy and the
      // counter reaches 100 several sections early.
      const st = ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        invalidateOnRefresh: true,
        refreshPriority: -10,
        onUpdate: (self) => {
          progress.v = self.progress;
          setCount(Math.round(self.progress * 100));
          setAtEnd(self.progress > 0.965);
          if (fill.current) {
            gsap.set(fill.current, { scaleY: self.progress });
          }
        },
      });

      // fade the whole rail in after the preloader clears
      gsap.fromTo(
        root.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1, delay: 0.4, ease: 'Out' },
      );

      return () => st.kill();
    },
    { scope: root },
  );

  const toTop = () => {
    if (lenis.current) lenis.current.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={root}
      className="pointer-events-none fixed left-0 top-0 z-40 hidden h-dvh w-[var(--rail)] flex-col items-center justify-center gap-6 text-[color:var(--fg)] md:flex"
      aria-hidden="true"
    >
      {/* progress rule */}
      <div className="relative h-40 w-px bg-[color:var(--rule)]">
        <span
          ref={fill}
          className="absolute inset-0 origin-top bg-[color:var(--fg)]"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>

      <span className="t-label-sm tabular-nums">{String(count).padStart(3, '0')}</span>

      <button
        type="button"
        onClick={toTop}
        className="pointer-events-auto flex flex-col items-center gap-4 transition-opacity hover:opacity-60"
        aria-label={atEnd ? 'Back to top' : 'Scroll down'}
      >
        <span
          className="t-label-sm whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {atEnd ? 'TO TOP' : 'SCROLL'}
        </span>
        <svg
          width="9"
          height="30"
          viewBox="0 0 9 30"
          fill="none"
          className="transition-transform duration-500"
          style={{ transform: atEnd ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M4.5 0v28M0.5 24l4 4 4-4" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>
    </div>
  );
}
