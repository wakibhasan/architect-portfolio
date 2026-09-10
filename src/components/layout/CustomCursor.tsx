'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Scales over imagery and picks up a label from data-cursor="VIEW" / "DRAG".
 * Pointer-device only — never rendered on touch.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useGSAP(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    const el = dot.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'Out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'Out' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      if (target) {
        setActive(true);
        setLabel(target.dataset.cursor || '');
      } else {
        setActive(false);
        setLabel('');
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      aria-hidden="true"
    >
      <div
        className="flex items-center justify-center rounded-full bg-white text-[10px] font-medium uppercase tracking-[0.18em] text-black transition-all duration-400 ease-[cubic-bezier(.25,1,.5,1)]"
        style={{
          width: active ? 84 : 10,
          height: active ? 84 : 10,
        }}
      >
        <span
          className="transition-opacity duration-300"
          style={{ opacity: active && label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
