'use client';

import { useState, type FormEvent } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { cn } from '@/lib/cn';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const FIELDS = [
  { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'location', label: 'Where is the site?', type: 'text', autoComplete: 'off' },
] as const;

/**
 * Inline-validated form (TECH-PLAN §4.9) — the homepage keeps Era's
 * phone-number-as-hero treatment, so this is where the demo proves it can
 * build a real form. No backend: submission is simulated.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (name.length < 2) next.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'That email does not look right.';
    if (message.length < 12) next.message = 'A sentence or two is enough to start.';
    return next;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) return;

    setState('sending');
    // Demo only — wire to a real endpoint or form service for production.
    window.setTimeout(() => setState('sent'), 900);
  }

  if (state === 'sent') {
    return (
      <div className="flex min-h-64 flex-col justify-center border-t border-[color:var(--rule)] pt-10">
        <span className="t-h2">Thank you.</span>
        <p className="t-body mt-4 max-w-sm text-[color:var(--muted)]">
          We have your note and will reply within two working days.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="t-label mt-8 self-start border-b border-current pb-1 hover:opacity-65"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      {FIELDS.map((f) => (
        <Field key={f.name} {...f} error={errors[f.name as keyof Errors]} />
      ))}

      <label className="group flex flex-col gap-2">
        <span className="t-label-sm text-[color:var(--muted)]">About the project</span>
        <textarea
          name="message"
          rows={4}
          className={cn(
            'resize-none border-b bg-transparent pb-3 pt-1 text-[color:var(--fg)] outline-none transition-colors placeholder:text-[color:var(--muted)]/50 focus:border-[color:var(--accent)]',
            errors.message ? 'border-[color:var(--accent)]' : 'border-[color:var(--rule)]',
          )}
          placeholder="A new build, a renovation, a feasibility study…"
        />
        {errors.message && (
          <span className="t-label-sm text-[color:var(--accent)]">{errors.message}</span>
        )}
      </label>

      <MagneticButton
        type="submit"
        className="mt-3 self-start rounded-full bg-[color:var(--ink)] px-8 py-4 text-[color:var(--bone)]"
      >
        {state === 'sending' ? 'Sending…' : 'Send enquiry'}
      </MagneticButton>

      <p className="t-label-sm text-[color:var(--muted)]">
        Demo form — submissions are not delivered.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type,
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="t-label-sm text-[color:var(--muted)]">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        className={cn(
          'border-b bg-transparent pb-3 pt-1 text-[color:var(--fg)] outline-none transition-colors focus:border-[color:var(--accent)]',
          error ? 'border-[color:var(--accent)]' : 'border-[color:var(--rule)]',
        )}
      />
      {error && <span className="t-label-sm text-[color:var(--accent)]">{error}</span>}
    </label>
  );
}
