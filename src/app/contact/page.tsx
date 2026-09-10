import type { Metadata } from 'next';
import { ContactForm } from '@/components/sections/ContactForm';
import { Contact } from '@/components/sections/Contact';
import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { studio } from '@/content/studio';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Architect Portfolio.',
};

export default function ContactPage() {
  return (
    <>
      {/* data-theme as well as data-section-theme, per ThreeReasons' dome.
          This ground is bone, but the clay closer below claims the page theme
          the moment its midpoint wins — and the form's inputs read --fg, so
          they turned bone on bone and the typing went invisible. Declaring the
          palette here keeps the subtree bone whatever the page is doing. */}
      <section
        data-section-theme="bone"
        data-theme="bone"
        className="relative bg-[color:var(--bone)] px-[var(--gutter)] pb-[12vh] pt-[24vh] text-[color:var(--ink)] md:pl-[calc(var(--rail)+var(--gutter))]"
      >
        <div className="grid gap-[8vh] md:grid-cols-12 md:gap-[4vw]">
          <div className="md:col-span-6">
            <span className="t-label mb-7 block text-[color:var(--muted)]">Start a project</span>
            <RevealText as="h1" className="t-h1 max-w-xl">
              Tell us about the site.
            </RevealText>
            <RevealText as="p" className="t-body mt-8 max-w-md text-[color:var(--muted)]" stagger={0.03}>
              Every project starts with a conversation and a walk around the plot. Send us the
              outline and we will come back within two working days.
            </RevealText>

            <div className="mt-12 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="t-label-sm text-[color:var(--muted)]">Telephone</span>
                <a href={studio.contact.phoneHref} className="t-label hover:opacity-65">
                  {studio.contact.phone}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="t-label-sm text-[color:var(--muted)]">Email</span>
                <a href={`mailto:${studio.contact.email}`} className="t-label hover:opacity-65">
                  {studio.contact.email}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="t-label-sm text-[color:var(--muted)]">
                  {studio.contact.officeLabel}
                </span>
                {studio.contact.address.map((l) => (
                  <span key={l} className="t-label">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <section
        data-section-theme="bone"
        data-theme="bone"
        className="bg-[color:var(--bone)] px-[var(--gutter)] pb-[6vh]"
      >
        <MediaImage
          image="mosaic-17"
          sizes="100vw"
          wrapperClassName="aspect-[21/9] w-full"
          className="object-cover"
        />
      </section>

      <Contact />
    </>
  );
}
