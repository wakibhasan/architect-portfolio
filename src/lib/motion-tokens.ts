/**
 * Single source of truth for motion. Every animation in the app pulls from
 * here — inconsistent easing is the biggest tell of an amateur build.
 *
 * The four named eases are lifted verbatim from era-residence.com's bundle
 * (see TECH-PLAN.md §1) and registered as GSAP CustomEases in lib/gsap.ts.
 */

export const EASE = {
  out: 'Out', // 0.25,1,0.5,1     — reveals, the default
  in: 'In', // 0.5,0,0.75,0     — exits
  inOut: 'InOut', // 0.75,0,0.25,1    — section + theme transitions
  ease: 'Ease', // 0.25,0.1,0.25,1  — neutral
  dive: 'diveIn', // 0.6,0,0,1        — dramatic image reveals
  loader: 'loaderEase',
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  curtain: 1.6,
} as const;

export const STAGGER = {
  tight: 0.025,
  base: 0.06,
  loose: 0.1,
} as const;

/** Standard scrub value — a touch of lag reads as weight, not lateness. */
export const SCRUB = 1;

/** Breakpoint used by every gsap.matchMedia() call. */
export const MM = {
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
  motion: '(prefers-reduced-motion: no-preference)',
  desktopMotion: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
} as const;
