import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { MediaImage } from '@/components/ui/MediaImage';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { RevealText } from '@/components/ui/RevealText';
import { Contact } from '@/components/sections/Contact';
import { projects, projectBySlug } from '@/content/projects';

type RouteParams = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title}, ${project.location}`,
    description: project.intro,
  };
}

export default async function ProjectPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      {/* hero plate */}
      <section data-section-theme="image" className="relative h-dvh w-full overflow-hidden">
        <MediaImage
          image={project.hero}
          sizes="100vw"
          priority
          wrapperClassName="absolute inset-0 h-full w-full"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/72 via-transparent to-[color:var(--ink)]/40" />

        <div className="absolute inset-x-0 bottom-[10vh] px-[var(--gutter)] text-[color:var(--bone)] md:pl-[calc(var(--rail)+var(--gutter))]">
          <span className="t-label-sm mb-6 block opacity-75">
            {project.typology} — {project.year}
          </span>
          <RevealText as="h1" className="t-h1 max-w-4xl">
            {project.title}, {project.location}
          </RevealText>
        </div>
      </section>

      {/* intro + facts */}
      <section
        data-section-theme="bone"
        className="bg-[color:var(--bone)] px-[var(--gutter)] py-[14vh] text-[color:var(--ink)] md:pl-[calc(var(--rail)+var(--gutter))]"
      >
        <div className="grid gap-[8vh] md:grid-cols-12 md:gap-[4vw]">
          <div className="md:col-span-7">
            <RevealText as="p" className="t-h2 max-w-2xl" stagger={0.05}>
              {project.intro}
            </RevealText>

            <div className="mt-14 flex max-w-xl flex-col gap-6">
              {project.body.map((para) => (
                <RevealText key={para.slice(0, 24)} as="p" className="t-body text-[color:var(--muted)]" stagger={0.03}>
                  {para}
                </RevealText>
              ))}
            </div>
          </div>

          <dl className="flex flex-col gap-5 md:col-span-4 md:col-start-9">
            {project.facts.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-6 border-b border-[color:var(--rule)] pb-4"
              >
                <dt className="t-label-sm text-[color:var(--muted)]">{f.label}</dt>
                <dd className="t-label text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* gallery */}
      <section data-section-theme="bone" className="bg-[color:var(--bone)] pb-[14vh]">
        <div className="flex flex-col gap-[3vh] px-[var(--gutter)]">
          {project.gallery.map((key, i) => (
            <ParallaxImage
              key={key}
              image={key}
              sizes={i === 0 ? '100vw' : '(max-width: 768px) 100vw, 72vw'}
              wrapperClassName={
                i === 0
                  ? 'aspect-[16/9] w-full'
                  : i % 2 === 1
                    ? 'ml-auto aspect-[4/5] w-full max-w-2xl'
                    : 'mr-auto aspect-[3/2] w-full max-w-3xl'
              }
              amount={-14}
              clip
              cursor="VIEW"
            />
          ))}
        </div>
      </section>

      {/* next project */}
      <section data-section-theme="dark" className="bg-[color:var(--forest)] py-[12vh] text-[color:var(--bone)]">
        <div className="px-[var(--gutter)] md:pl-[calc(var(--rail)+var(--gutter))]">
          <span className="t-label-sm mb-8 block opacity-60">Next project</span>
          <Link
            href={`/projects/${next.slug}`}
            data-cursor="VIEW"
            className="group flex flex-col gap-8 md:flex-row md:items-center md:gap-[4vw]"
          >
            <MediaImage
              image={next.hero}
              sizes="(max-width: 768px) 100vw, 38vw"
              wrapperClassName="aspect-[4/3] w-full md:w-[38%]"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(.25,1,.5,1)] group-hover:scale-105"
            />
            <div>
              <h2 className="t-h1">{next.title}</h2>
              <span className="t-label mt-4 block opacity-70">
                {next.location}, {next.country}
              </span>
            </div>
          </Link>
        </div>
      </section>

      <Contact />
    </>
  );
}
