'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { LogoMark } from './LogoMark';
import { projects } from '@/content/projects';
import { studio } from '@/content/studio';
import { cn } from '@/lib/cn';

/**
 * Site footer — the hba.com arrangement (TECH-PLAN §4.4 reference set).
 *
 * Their grid: a narrow blurb column on the left, a wide grouped link nav on the
 * right, and below that a row of subscribe / enquire / follow. A legal line
 * runs under the whole thing, offset to sit under the right-hand column.
 *
 * Theirs fills the nav with 29 worldwide offices grouped by region. We have one
 * studio, so the same columns carry the site and its work instead — the shape
 * is the point, and inventing office pages would only produce dead links.
 */
export function SiteFooter() {
  const f = studio.siteFooter;

  return (
    <footer
      data-section-theme="dark"
      className="relative z-10 bg-[color:var(--ink)] pb-10 pt-[12vh] text-[color:var(--bone)]"
    >
      <div className="px-[var(--gutter)]">
        {/* logo row */}
        <div className="mb-[8vh]">
          <Link href="/" aria-label={`${studio.name}, home`} className="inline-block">
            <LogoMark size={64} />
          </Link>
        </div>

        <div className="grid gap-y-14 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-x-[8vw]">
          {/* left — blurb */}
          <div>
            <p className="t-body text-[color:var(--bone)]/70">{f.blurb}</p>
            <p className="t-body mt-6 text-[color:var(--bone)]/45">{f.note}</p>
          </div>

          {/* right — grouped nav, then subscribe / enquire / follow */}
          <div>
            <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {f.groups.map((group) => (
                <FooterColumn key={group.title} title={group.title} links={group.links} />
              ))}

              {/* Generated from the project data rather than repeated in
                  content — a hand-copied slug here would rot the first time a
                  project is renamed. */}
              <FooterColumn
                title="Selected work"
                links={projects.slice(0, 5).map((p) => ({
                  label: p.title,
                  href: `/projects/${p.slug}`,
                }))}
              />

              <FooterColumn
                title={studio.contact.officeLabel}
                links={[
                  { label: studio.contact.phone, href: studio.contact.phoneHref },
                  { label: studio.contact.email, href: `mailto:${studio.contact.email}` },
                ]}
                after={
                  <address className="t-body mt-4 not-italic text-[color:var(--bone)]/45">
                    {studio.contact.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                }
              />
            </nav>

            {/* Same track definition and gap as the nav above — gap-10 and
                sm:2 / lg:3. It was gap-12 on [1.4fr_0.7fr_1fr], so Enquire
                started partway across the column above it and the whole row
                looked arbitrarily indented rather than aligned to anything. */}
            <div className="mt-16 grid gap-10 border-t border-[color:var(--bone)]/15 pt-12 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FooterHeading>{f.subscribe.title}</FooterHeading>
                <p className="t-body mb-6 mt-3 max-w-xs text-[color:var(--bone)]/45">
                  {f.subscribe.note}
                </p>
                <SubscribeForm />
              </div>

              <div>
                <FooterHeading>{f.enquire.title}</FooterHeading>
                <Link
                  href={f.enquire.href}
                  className="t-body mt-4 inline-block border-b border-current pb-1 transition-opacity hover:opacity-60"
                >
                  {f.enquire.label}
                </Link>
              </div>

              <div>
                <FooterHeading>Follow us</FooterHeading>
                <ul className="mt-4 flex flex-col gap-2">
                  {f.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={s.href.startsWith('http') ? '_blank' : undefined}
                        rel={s.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className="t-body text-[color:var(--bone)]/70 transition-opacity hover:opacity-100"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* legal line, offset under the right column as theirs is */}
        <div className="mt-[10vh] border-t border-[color:var(--bone)]/15 pt-8 lg:pl-[calc(18rem+8vw)]">
          <p className="t-label-sm flex flex-wrap items-center gap-x-3 gap-y-2 text-[color:var(--bone)]/45">
            <span>{studio.footer.legal}</span>
            {studio.footer.links.map((l) => (
              <span key={l.href} className="flex items-center gap-3">
                <span aria-hidden="true">/</span>
                <Link href={l.href} className="transition-opacity hover:opacity-100">
                  {l.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="t-label text-[color:var(--bone)]/45">{children}</h2>;
}

function FooterColumn({
  title,
  links,
  after,
}: {
  title: string;
  /* readonly because studio.ts is `as const`; a mutable array type here would
     reject every group passed straight out of the content file. */
  links: readonly { readonly label: string; readonly href: string }[];
  after?: React.ReactNode;
}) {
  return (
    <div>
      <FooterHeading>{title}</FooterHeading>
      <ul className="mt-4 flex flex-col gap-2">
        {links.map((l) => (
          <li key={`${l.href}-${l.label}`}>
            <Link
              href={l.href}
              className="t-body text-[color:var(--bone)]/70 transition-opacity hover:opacity-100"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      {after}
    </div>
  );
}

function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'sent'>('idle');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Same shape as ContactForm's check: enough to catch a typo, not a spec.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState('error');
      return;
    }
    // Demo only — wire to a real endpoint or form service for production,
    // exactly as ContactForm still needs.
    setState('sent');
  }

  if (state === 'sent') {
    return (
      <p className="t-body text-[color:var(--bone)]/70" role="status">
        Thank you — you are on the list.
      </p>
    );
  }

  return (
    /* Stacked, not side by side: the field and the button now share a column
       that is a third of the row, where an inline pair left the input too
       narrow to read a full address in. */
    <form onSubmit={onSubmit} noValidate className="flex max-w-sm flex-col items-start gap-5">
      <div className="w-full">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder="Email address"
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? 'footer-email-error' : undefined}
          className={cn(
            't-body w-full border-b bg-transparent pb-2 text-[color:var(--bone)] outline-none transition-colors placeholder:text-[color:var(--bone)]/35',
            state === 'error'
              ? 'border-[color:var(--terracotta-bright)]'
              : 'border-[color:var(--bone)]/25 focus:border-[color:var(--bone)]',
          )}
        />
        {state === 'error' && (
          <span id="footer-email-error" className="t-label-sm mt-2 block text-[color:var(--terracotta-bright)]">
            Enter a valid email address.
          </span>
        )}
      </div>
      <button
        type="submit"
        className="t-label border-b border-current pb-1 transition-opacity hover:opacity-60"
      >
        Sign up
      </button>
    </form>
  );
}
