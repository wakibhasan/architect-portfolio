'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Rotating circular lockup, top-left on every screen (TECH-PLAN §5.3).
 * Colour comes from --fg, so it inverts with the section theme for free.
 */
export function LogoMark({
  className,
  size = 84,
  label = 'VERRA ATELIER · LISBOA · ',
}: {
  className?: string;
  size?: number;
  label?: string;
}) {
  const ringId = `logo-ring-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <span
      className={cn('relative inline-block text-[color:var(--fg)]', className)}
      style={{ width: size, height: size }}
      aria-label="Verra Atelier"
      role="img"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id={ringId} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" fill="none" />
        </defs>
        <text
          fill="currentColor"
          style={{ fontSize: 9.4, letterSpacing: '0.24em', fontWeight: 500 }}
        >
          <textPath href={`#${ringId}`} startOffset="0">
            {label}
          </textPath>
        </text>
      </svg>
      {/* Centre glyph — four petals around a still point */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <g fill="currentColor" transform="translate(50 50)">
          {/* four cardinal petals */}
          {[0, 90, 180, 270].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg})`}
              d="M0,-2.4 C3.4,-6.2 3.9,-10.4 0,-14.5 C-3.9,-10.4 -3.4,-6.2 0,-2.4 Z"
            />
          ))}
          {/* four shorter diagonals */}
          {[45, 135, 225, 315].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg})`}
              d="M0,-2 C2.3,-4.6 2.6,-7.4 0,-10 C-2.6,-7.4 -2.3,-4.6 0,-2 Z"
              opacity="0.85"
            />
          ))}
          <circle r="1.7" />
        </g>
      </svg>
    </span>
  );
}
