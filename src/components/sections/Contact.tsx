'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { LogoMark } from '@/components/layout/LogoMark';
import { studio } from '@/content/studio';
import { STAGGER } from '@/lib/motion-tokens';

/**
 * Section 9 — the Era contact/footer treatment (TECH-PLAN §4.9).
 *
 * No form here: the phone number set in enormous display serif IS the section.
 * The real validated form lives on /contact, so the demo proves both.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current?.querySelector('[data-phone]');
      if (!el) return;

      const run = () => {
        const split = SplitText.create(el, { type: 'chars' });
        gsap.set(el, { autoAlpha: 1 });
        gsap.from(split.chars, {
          yPercent: 55,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'Out',
          stagger: STAGGER.tight,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      };

      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(run);
      else run();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="clay"
      className="relative bg-[color:var(--clay)] text-[color:var(--bone)]"
      aria-label="Contact"
    >
      {/* image plate overlapping the top edge */}
      <div className="flex justify-center px-[var(--gutter)]">
        <ParallaxImage
          image="contact-bg"
          sizes="(max-width: 768px) 100vw, 58vw"
          wrapperClassName="-mt-[14vh] aspect-[16/9] w-full max-w-4xl"
          amount={-10}
        />
      </div>

      <div className="flex flex-col items-center px-[var(--gutter)] pb-14 pt-[9vh] text-center">
        <LogoMark size={62} label="" />

        <a
          href={studio.contact.phoneHref}
          data-phone
          className="t-display mt-9 block invisible tabular-nums transition-opacity duration-500 hover:opacity-75"
          style={{ fontSize: 'clamp(2.4rem, 8.5vw, 8rem)' }}
        >
          {studio.contact.phone}
        </a>

        <div className="mt-8 flex flex-col gap-1.5">
          <span className="t-label-sm opacity-60">{studio.contact.officeLabel}</span>
          {studio.contact.address.map((line) => (
            <span key={line} className="t-label">
              {line}
            </span>
          ))}
        </div>

        <Link
          href="/contact"
          className="t-label mt-11 inline-flex items-center gap-3 border-b border-current pb-1 transition-opacity hover:opacity-65"
        >
          Start a project
          <svg width="17" height="9" viewBox="0 0 17 9" fill="none">
            <path d="M0 4.5h15M11.5 1l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Link>
      </div>

      <footer className="flex flex-col gap-5 border-t border-[color:var(--rule)] px-[var(--gutter)] py-7 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-7">
          <span className="t-label-sm opacity-70">{studio.footer.legal}</span>
          <span className="flex gap-5">
            {studio.footer.links.map((l) => (
              <Link key={l.label} href={l.href} className="t-label-sm opacity-70 hover:opacity-100">
                {l.label}
              </Link>
            ))}
          </span>
        </div>
        <span className="t-label-sm opacity-70">{studio.footer.credit}</span>
      </footer>
    </section>
  );
}
