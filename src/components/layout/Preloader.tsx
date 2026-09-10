'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useLenis } from '@/components/providers/SmoothScroll';
import { LogoMark } from './LogoMark';

const KEY = 'verra:hasVisited';

/**
 * Counter + clip-path curtain (TECH-PLAN §5.6).
 *
 * Session-gated exactly as bloom3d.studio does it — a three-second preloader on
 * every navigation is infuriating, so repeat visits in the same session get a
 * short fade instead of the full sequence.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const returning = sessionStorage.getItem(KEY) === 'true';

      lenis.current?.stop();
      document.documentElement.classList.add('lenis-stopped');

      const finish = () => {
        sessionStorage.setItem(KEY, 'true');
        document.documentElement.classList.remove('lenis-stopped');
        lenis.current?.start();
        ScrollTrigger.refresh();
        gsap.set(el, { display: 'none' });
      };

      if (returning || reduced) {
        gsap.to(el, { autoAlpha: 0, duration: 0.45, ease: 'Out', onComplete: finish });
        return;
      }

      const progress = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.to(progress, {
        v: 100,
        duration: 1.9,
        ease: 'loaderEase',
        onUpdate: () => setCount(Math.round(progress.v)),
      })
        .fromTo(
          '[data-pre-inner]',
          { yPercent: 105 },
          { yPercent: 0, duration: 1.1, ease: 'Out' },
          0,
        )
        .to('[data-pre-inner]', { yPercent: -105, duration: 0.7, ease: 'In' }, '>-0.15')
        .to(
          el,
          { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'InOut' },
          '<0.15',
        );

      return () => {
        tl.kill();
        document.documentElement.classList.remove('lenis-stopped');
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-end justify-between bg-[color:var(--forest)] px-[var(--gutter)] pb-[var(--gutter)] text-[color:var(--bone)]"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 grid place-items-center opacity-[0.045]">
        <LogoMark size={520} label="" />
      </div>

      <span className="split-line-mask">
        <span data-pre-inner className="t-label block">
          VERRA ATELIER — LISBOA
        </span>
      </span>

      <span className="split-line-mask">
        <span
          data-pre-inner
          ref={numRef}
          className="t-display block tabular-nums leading-[0.8]"
          style={{ fontSize: 'clamp(4rem, 14vw, 13rem)' }}
        >
          {String(count).padStart(3, '0')}
        </span>
      </span>
    </div>
  );
}
