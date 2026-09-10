'use client';

import Link from 'next/link';
import { useRef, useId, type ReactNode, type MouseEvent } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/cn';

/**
 * Era's circular outline CTA — rotating textPath ring around a static label,
 * with the same magnetic chase as MagneticButton. Used for the hero CTA and
 * the "book a call" button on the architecture section.
 */
export function CircleButton({
  children,
  href,
  ring = 'ARCHITECT PORTFOLIO · ',
  size = 168,
  className,
}: {
  children: ReactNode;
  href: string;
  ring?: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);
  // useId (not Math.random) so server and client agree — otherwise the
  // textPath reference breaks on hydration.
  const pathId = `ring-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  useGSAP(() => {
    if (!ref.current || window.matchMedia('(hover: none)').matches) return;
    xTo.current = gsap.quickTo(ref.current, 'x', { duration: 0.7, ease: 'Out' });
    yTo.current = gsap.quickTo(ref.current, 'y', { duration: 0.7, ease: 'Out' });
  }, []);

  const move = (e: MouseEvent) => {
    if (!ref.current || !xTo.current || !yTo.current) return;
    const r = ref.current.getBoundingClientRect();
    xTo.current(((e.clientX - (r.left + r.width / 2)) / r.width) * 26);
    yTo.current(((e.clientY - (r.top + r.height / 2)) / r.height) * 26);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={move}
      onMouseLeave={() => {
        xTo.current?.(0);
        yTo.current?.(0);
      }}
      className={cn(
        'group relative inline-flex shrink-0 items-center justify-center rounded-full text-[color:var(--fg)]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full border border-current opacity-45 transition-opacity duration-500 group-hover:opacity-90" />
      <span className="absolute inset-0 scale-90 rounded-full bg-current opacity-0 transition-all duration-500 ease-[cubic-bezier(.25,1,.5,1)] group-hover:scale-100 group-hover:opacity-100" />
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full animate-spin-slow opacity-70 transition-colors duration-500 group-hover:text-[color:var(--on-fg)]"
      >
        <defs>
          <path id={pathId} d="M50,50 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" fill="none" />
        </defs>
        <text fill="currentColor" style={{ fontSize: 6.6, letterSpacing: '0.22em', fontWeight: 500 }}>
          <textPath href={`#${pathId}`}>{ring}</textPath>
        </text>
      </svg>
      <span className="t-label-sm relative z-10 max-w-[62%] text-center leading-[1.5] transition-colors duration-500 group-hover:text-[color:var(--on-fg)] group-hover:mix-blend-normal">
        {children}
      </span>
    </Link>
  );
}
