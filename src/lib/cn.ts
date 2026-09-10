/** Minimal class joiner — no need for clsx/tailwind-merge at this scale. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
