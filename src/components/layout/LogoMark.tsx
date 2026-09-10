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
  label = 'ARCHITECT PORTFOLIO · LISBOA · ',
}: {
  className?: string;
  size?: number;
  label?: string;
}) {
  const ringId = `logo-ring-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // The ring text has to close on itself. The path below is r=37 in a 100-unit
  // viewBox, so there are 2*PI*37 = 232.5 units to spend; RING_FILL leaves the
  // gap that reads as the start of the loop. Each glyph costs roughly its own
  // width plus the tracking, both proportional to the font size — so solve for
  // the size that fits rather than hard-coding one, or a longer studio name
  // wraps past the start and overprints itself.
  const RING_LENGTH = 2 * Math.PI * 37;
  const RING_FILL = 0.85;
  const ADVANCE_EM = 0.6 + 0.18; // glyph width + letter-spacing, in em
  const ringFontSize = Math.min(9.4, (RING_LENGTH * RING_FILL) / (label.length * ADVANCE_EM));

  return (
    <span
      className={cn('relative inline-block text-[color:var(--fg)]', className)}
      style={{ width: size, height: size }}
      aria-label="Architect Portfolio"
      role="img"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id={ringId} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" fill="none" />
        </defs>
        <text
          fill="currentColor"
          style={{ fontSize: ringFontSize, letterSpacing: '0.18em', fontWeight: 500 }}
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
