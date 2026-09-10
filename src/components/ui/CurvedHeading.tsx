'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Heading set on an arc, following the dome edge (TECH-PLAN §4.7).
 *
 * SVG <textPath> rather than MotionPathPlugin per-character placement — it is
 * simpler, resolution-independent, and stays selectable text for screen readers.
 */
export function CurvedHeading({
  text,
  className,
  fontSize = 38,
}: {
  text: string;
  className?: string;
  fontSize?: number;
}) {
  const pathId = `arc-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // The arc below spans 104 degrees of an r=433 circle, so it is r*theta = 786
  // viewBox units long. The heading is built from studio content, so its length
  // moves with the copy — past ~33 characters the default 38 would run off both
  // ends of the dome. Step the size down to fit instead; short headings are
  // unaffected because the cap keeps whatever was passed in.
  const ARC_LENGTH = 433 * ((104 * Math.PI) / 180);
  const ARC_FILL = 0.92;
  const ADVANCE_EM = 0.63; // uppercase glyph width in the display face, in em
  const fittedSize = Math.min(fontSize, (ARC_LENGTH * ARC_FILL) / (text.length * ADVANCE_EM));

  return (
    <svg
      viewBox="0 0 1000 250"
      className={cn('w-full overflow-visible', className)}
      role="heading"
      aria-level={2}
      aria-label={text}
    >
      <defs>
        {/* A circle concentric with the dome, not a free-hand ellipse.
            The dome is a semicircle whose radius is half its width, so in this
            1000-wide viewBox that radius is 500. Measured off era-residence,
            their heading rides 0.862 of it — every word on the same circle,
            8px of spread across the whole line — which puts this baseline at
            433. The old "A 620,470" was elliptical and tighter than the dome,
            so the line curved away from the shoulder toward its ends. */}
        <path id={pathId} d="M 158.8,233.4 A 433,433 0 0 1 841.2,233.4" fill="none" />
      </defs>
      <text
        fill="currentColor"
        style={{
          fontFamily: 'var(--font-display), Georgia, serif',
          fontSize: fittedSize,
          letterSpacing: '0.01em',
        }}
      >
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
