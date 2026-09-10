'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
// Still needed by MobileMenu below, which animates its own clip-path reveal;
// the header itself no longer runs any scroll-driven motion.
import { gsap, useGSAP } from '@/lib/gsap';
import { studio } from '@/content/studio';
import { LogoMark } from './LogoMark';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cn } from '@/lib/cn';

/**
 * Era's bare text links, laid over the top of the hero (TECH-PLAN §5.5).
 *
 * Absolute, not fixed: the header belongs to the top of the page and scrolls
 * away with it. That removes the reason for the two behaviours this used to
 * carry — the hide-on-scroll-down / reveal-on-scroll-up, and the translucent
 * pill it grew once past the hero — both of which only existed to keep a
 * floating bar legible over whatever it happened to be sitting on.
 */
export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* absolute rather than in flow: the header still sits over the hero
          photograph instead of pushing it down, but it scrolls off with the
          document. With no positioned ancestor this resolves against the
          initial containing block, i.e. the top of the page. */}
      <header className="absolute inset-x-0 top-0 z-50 flex items-start justify-between px-[var(--gutter)] pt-5">
        <Link href="/" className="pointer-events-auto -ml-1 block" aria-label="Verra Atelier, home">
          <LogoMark size={76} />
        </Link>

        {/* desktop links */}
        <nav className="pointer-events-auto hidden items-center gap-1 px-2 py-2 md:flex">
          {studio.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="t-label group relative overflow-hidden px-4 py-2 text-[color:var(--fg)]"
            >
              <span className="block transition-transform duration-500 ease-[cubic-bezier(.25,1,.5,1)] group-hover:-translate-y-full">
                {item.label}
              </span>
              <span className="absolute inset-0 flex translate-y-full items-center justify-center transition-transform duration-500 ease-[cubic-bezier(.25,1,.5,1)] group-hover:translate-y-0">
                {item.label}
              </span>
            </Link>
          ))}
          {/* Fixed terracotta, not var(--accent): on image themes --accent
              resolves to bone, which would put bone text on a bone pill. */}
          <MagneticButton
            as="link"
            href={studio.cta.href}
            className="ml-1 rounded-full bg-[color:var(--terracotta)] px-5 py-2.5 text-[color:var(--bone)] hover:bg-[color:var(--terracotta-bright)]"
          >
            {studio.cta.label}
          </MagneticButton>
        </nav>

        {/* mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px] text-[color:var(--fg)] md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span
            className={cn(
              'block h-px w-6 bg-current transition-transform duration-400',
              open && 'translate-y-[3px] rotate-45',
            )}
          />
          <span
            className={cn(
              'block h-px w-6 bg-current transition-transform duration-400',
              open && '-translate-y-[3px] -rotate-45',
            )}
          />
        </button>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const links = el.querySelectorAll('[data-menu-link]');

      if (open) {
        gsap.set(el, { display: 'flex' });
        gsap
          .timeline()
          .fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'InOut' })
          .fromTo(links, { yPercent: 120 }, { yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'Out' }, '-=0.35');
      } else {
        gsap.to(el, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.5,
          ease: 'InOut',
          onComplete: () => gsap.set(el, { display: 'none' }),
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-40 hidden flex-col justify-center bg-[color:var(--forest)] px-[var(--gutter)] text-[color:var(--bone)]"
      style={{ clipPath: 'inset(0 0 100% 0)' }}
    >
      <nav className="flex flex-col gap-2">
        {studio.nav.map((item) => (
          <span key={item.href} className="split-line-mask">
            <Link
              href={item.href}
              data-menu-link
              onClick={onClose}
              className="t-h1 block py-1 text-[color:var(--bone)]"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>
      <div className="mt-16 flex flex-col gap-1">
        <span className="t-label-sm opacity-60">{studio.contact.officeLabel}</span>
        <a href={studio.contact.phoneHref} className="t-label">
          {studio.contact.phone}
        </a>
        <a href={`mailto:${studio.contact.email}`} className="t-label">
          {studio.contact.email}
        </a>
      </div>
    </div>
  );
}
