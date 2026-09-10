import Link from 'next/link';
import { MediaImage } from '@/components/ui/MediaImage';

export default function NotFound() {
  return (
    <section
      data-section-theme="image"
      className="relative grid min-h-dvh place-items-center overflow-hidden bg-[color:var(--forest)] px-[var(--gutter)] text-center text-[color:var(--bone)]"
    >
      <MediaImage
        image="arch-full"
        alt=""
        sizes="100vw"
        wrapperClassName="absolute inset-0 h-full w-full"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[color:var(--ink)]/55" />

      <div className="relative">
        <span className="t-display block leading-none">404</span>
        <p className="t-body mx-auto mt-8 max-w-sm opacity-80">
          That page has been drawn over. Let us take you back to the work.
        </p>
        <Link
          href="/"
          className="t-label mt-10 inline-flex items-center gap-3 border-b border-current pb-1 transition-opacity hover:opacity-65"
        >
          Return home
          <svg width="17" height="9" viewBox="0 0 17 9" fill="none">
            <path d="M0 4.5h15M11.5 1l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
