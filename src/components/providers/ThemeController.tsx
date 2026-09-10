'use client';

import { useGSAP, ScrollTrigger } from '@/lib/gsap';

export type SectionTheme = 'bone' | 'dark' | 'sage' | 'clay' | 'image';

/**
 * Section-driven theming (TECH-PLAN §5.4).
 *
 * Any element carrying data-section-theme="…" claims the global theme while it
 * occupies the middle of the viewport. Nav, logo mark and scroll rail all read
 * --fg / --accent, so the entire chrome inverts from this one mechanism.
 */
export function ThemeController() {
  useGSAP(() => {
    const root = document.documentElement;
    const sections = gsapSafeQuery('[data-section-theme]');
    if (!sections.length) return;

    const apply = (theme: string) => {
      if (root.dataset.theme !== theme) root.dataset.theme = theme;
    };

    // Sections overlap on purpose — ThreeReasons pulls its dome up over the
    // still-pinned hero with a -100vh margin — so two ranges can hold the
    // viewport midpoint at once. Applying a theme straight from onEnter /
    // onEnterBack made the winner depend on which callback happened to fire
    // last, which is to say on scroll direction: scrolling back up re-entered
    // the hero's range and repainted the dome's copy in the hero's bone, white
    // on sage. Decide by what is actually on top instead — the LAST active
    // section in DOM order, since a later section paints over an earlier one.
    const entries: { theme: string; st?: ScrollTrigger }[] = sections.map((el) => ({
      theme: (el as HTMLElement).dataset.sectionTheme ?? 'bone',
    }));

    const resolve = () => {
      for (let i = entries.length - 1; i >= 0; i--) {
        if (entries[i].st?.isActive) {
          apply(entries[i].theme);
          return;
        }
      }
      apply(entries[0]?.theme ?? 'bone');
    };

    sections.forEach((el, i) => {
      entries[i].st = ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        // Negative priority makes these refresh LAST, after the pinned
        // sections have inserted their spacers. Without it every theme
        // boundary is measured against a document thousands of px shorter
        // than the final layout and the whole page themes one section late.
        refreshPriority: -10,
        onToggle: resolve,
        onRefresh: resolve,
      });
    });

    resolve();

    // Pins, fonts and images all settle after first paint; re-measure once
    // each of those has had a chance to change the layout.
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 400);
    const t2 = window.setTimeout(refresh, 1800);
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('load', refresh);
      entries.forEach((e) => e.st?.kill());
    };
  }, []);

  return null;
}

function gsapSafeQuery(selector: string): Element[] {
  if (typeof document === 'undefined') return [];
  return Array.from(document.querySelectorAll(selector));
}
