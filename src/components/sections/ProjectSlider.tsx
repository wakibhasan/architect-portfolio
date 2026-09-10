'use client';

import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { gsap, Observer, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { projects } from '@/content/projects';
import { STAGGER } from '@/lib/motion-tokens';
import { cn } from '@/lib/cn';

/**
 * Section 4 — the hba.com treatment (TECH-PLAN §4.4).
 *
 * Two layers: a darkened, over-scaled full-bleed background plus a centred
 * inset panel holding the active project. The title deliberately straddles
 * both layers — that overlap is the detail that makes it look designed.
 *
 * Driven by GSAP Observer rather than Splide (what HBA uses) so wheel, drag and
 * touch all feed one state machine with no extra dependency.
 */
export function ProjectSlider() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const animating = useRef(false);
  const idx = useRef(0);

  const project = projects[index];

  const go = useCallback((dir: number) => {
    if (animating.current) return;
    animating.current = true;
    const next = (idx.current + dir + projects.length) % projects.length;
    idx.current = next;

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
      },
    });

    tl.to('[data-slide-panel]', {
      clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
      duration: 0.55,
      ease: 'In',
    })
      .to('[data-slide-title]', { yPercent: -110, autoAlpha: 0, duration: 0.45, ease: 'In' }, 0)
      .to('[data-slide-meta] > *', { autoAlpha: 0, y: -12, duration: 0.35, stagger: 0.03 }, 0)
      .add(() => setIndex(next))
      .fromTo(
        '[data-slide-panel]',
        { clipPath: dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'diveIn' },
      )
      .fromTo(
        '[data-slide-bg]',
        { autoAlpha: 0, scale: 1.16 },
        { autoAlpha: 1, scale: 1.08, duration: 1.1, ease: 'Out' },
        '<',
      )
      .fromTo(
        '[data-slide-title]',
        { yPercent: 110, autoAlpha: 1 },
        { yPercent: 0, duration: 0.8, ease: 'Out' },
        '<0.1',
      )
      .fromTo(
        '[data-slide-meta] > *',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: STAGGER.tight },
        '<0.15',
      );
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const obs = Observer.create({
        target: el,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        tolerance: 42,
        preventDefault: false,
        onUp: () => go(1),
        onDown: () => go(-1),
        onLeft: () => go(1),
        onRight: () => go(-1),
      });
      obs.disable();

      // only capture gestures while the section owns the viewport
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=140%',
          pin: true,
          pinSpacing: true,
          onEnter: () => obs.enable(),
          onEnterBack: () => obs.enable(),
          onLeave: () => obs.disable(),
          onLeaveBack: () => obs.disable(),
        },
      });

      return () => {
        obs.kill();
        st.scrollTrigger?.kill();
        st.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="image"
      className="relative h-dvh w-full overflow-hidden bg-[color:var(--forest)]"
      aria-label="Featured projects"
    >
      {/* layer 1 — darkened background */}
      <div data-slide-bg className="absolute inset-0 scale-[1.08]">
        <MediaImage
          image={project.hero}
          alt=""
          sizes="100vw"
          wrapperClassName="h-full w-full"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[color:var(--ink)]/68" />
      </div>

      {/* layer 2 — inset panel */}
      <div className="absolute inset-0 grid place-items-center px-[var(--gutter)]">
        <div
          data-slide-panel
          className="relative h-[62vh] w-full max-w-[84vw] overflow-hidden md:h-[70vh]"
        >
          <MediaImage
            image={project.hero}
            sizes="85vw"
            wrapperClassName="h-full w-full"
            className="object-cover"
          />
        </div>
      </div>

      {/* title straddles both layers */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[7vh] px-[var(--gutter)] text-[color:var(--bone)] md:pl-[calc(var(--rail)-1.5rem)]">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="split-line-mask">
              <h3
                data-slide-title
                className="block font-sans text-[clamp(2rem,5.2vw,4.6rem)] font-light leading-[1.02] tracking-[-0.03em]"
              >
                {project.title}, {project.location}
              </h3>
            </span>

            <Link
              href={`/projects/${project.slug}`}
              className="pointer-events-auto mt-6 inline-flex items-center rounded-full border border-current px-6 py-3 transition-colors duration-500 hover:bg-[color:var(--bone)] hover:text-[color:var(--ink)]"
            >
              <span className="t-label-sm">VIEW PROJECT</span>
            </Link>
          </div>

          <div data-slide-meta className="flex flex-wrap items-center gap-x-9 gap-y-2">
            {[project.typology, project.country, project.year, project.status].map((v) => (
              <span key={v} className="t-label-sm opacity-85">
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* pagination */}
      <div className="pointer-events-auto absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => go(i - idx.current)}
            aria-label={`Go to ${p.title}`}
            className={cn(
              'h-8 w-px transition-all duration-500',
              i === index
                ? 'bg-[color:var(--bone)] opacity-100'
                : 'bg-[color:var(--bone)] opacity-35 hover:opacity-70',
            )}
          />
        ))}
      </div>

      <span className="t-label-sm absolute left-[var(--gutter)] top-[16vh] text-[color:var(--bone)] opacity-70 md:left-[calc(var(--rail)+var(--gutter))]">
        {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
      </span>
    </section>
  );
}
