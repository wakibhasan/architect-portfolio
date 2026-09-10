'use client';

import Link from 'next/link';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'button' | 'link';
  href?: string;
  onClick?: () => void;
  /** How far the element is allowed to chase the cursor, in px. */
  strength?: number;
  type?: 'button' | 'submit';
};

/**
 * Era's initMagneticEffect — pointer offset fed through gsap.quickTo.
 * quickTo (not gsap.to) matters: it reuses one tween instead of allocating a
 * new one on every mousemove.
 */
export function MagneticButton({
  children,
  className,
  as = 'button',
  href = '#',
  onClick,
  strength = 14,
  type = 'button',
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useGSAP(() => {
    if (!ref.current) return;
    if (window.matchMedia('(hover: none)').matches) return;
    xTo.current = gsap.quickTo(ref.current, 'x', { duration: 0.6, ease: 'Out' });
    yTo.current = gsap.quickTo(ref.current, 'y', { duration: 0.6, ease: 'Out' });
  }, []);

  const move = (e: MouseEvent) => {
    if (!ref.current || !xTo.current || !yTo.current) return;
    const r = ref.current.getBoundingClientRect();
    xTo.current(((e.clientX - (r.left + r.width / 2)) / r.width) * strength * 2);
    yTo.current(((e.clientY - (r.top + r.height / 2)) / r.height) * strength * 2);
  };

  const reset = () => {
    xTo.current?.(0);
    yTo.current?.(0);
  };

  const shared = {
    className: cn(
      't-label inline-flex items-center justify-center transition-colors duration-300',
      className,
    ),
    onMouseMove: move,
    onMouseLeave: reset,
  };

  if (as === 'link') {
    return (
      <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} {...shared}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} ref={ref as React.Ref<HTMLButtonElement>} onClick={onClick} {...shared}>
      {children}
    </button>
  );
}
