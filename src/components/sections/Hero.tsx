'use client';

import { useRef, useState } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { CircleButton } from '@/components/ui/CircleButton';
import { studio } from '@/content/studio';
import { SCRUB, MM } from '@/lib/motion-tokens';
import { cn } from '@/lib/cn';

/**
 * Positions on the PLATE, not on the viewport (Era's initModalTip).
 *
 * y is a percentage of the 190vh plate box, so these read much larger than
 * screen coordinates: the landed frame is only the plate's bottom 52.63% (from
 * 47.37% down), and viewportY maps in as 47.37 + viewportY * 0.5263. x needs no
 * conversion — the plate is inset-x-0, so its width is the viewport's.
 *
 * They have to be in this space because the markers render inside
 * [data-hero-zoom]. Anchored to the viewport instead they hold still while the
 * photograph dives and pushes underneath them, and slide off their subjects.
 */
const HOTSPOTS = [
  { x: 27, y: 71.6, label: 'Shaded arrival court' },
  { x: 58, y: 65.3, label: 'Planted pergola' },
  { x: 76, y: 80.0, label: 'Pool terrace' },
];

/**
 * Section 1 — the Era treatment (TECH-PLAN §4.1).
 *
 * Opens on sky, scrubs down into the property plate as you scroll, with a
 * stacked display-serif title, a script accent word, pulsing hotspots and a
 * circular CTA.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      // ── entrance ─────────────────────────────────────────────────────
      const intro = () => {
        const title = el.querySelector('[data-hero-title]');
        if (!title) return;

        const split = SplitText.create(title, { type: 'lines', mask: 'lines' });
        gsap.set(title, { autoAlpha: 1 });

        gsap
          .timeline({ delay: 0.15 })
          .from(split.lines, { yPercent: 110, duration: 1.25, stagger: 0.08, ease: 'Out' })
          .from('[data-hero-script]', { autoAlpha: 0, y: 26, duration: 1.4, ease: 'Out' }, '-=0.85')
          .from(
            '[data-hero-strap] > span',
            { autoAlpha: 0, y: 18, duration: 1, stagger: 0.12, ease: 'Out' },
            '-=1.0',
          );
      };

      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(intro);
      else intro();

      // ── the dive ─────────────────────────────────────────────────────
      mm.add(MM.desktopMotion, () => {
        // Era lands the plate at the exact frame the next section's arch clears
        // the viewport floor — no gap, no overlap. Ending on the dome's own top
        // edge states that directly and keeps the two locked together if the
        // hero's height or ThreeReasons' overlap margin ever change. It has to
        // be the resolved element, not the selector: useGSAP scopes selector
        // text to this section, where the dome does not exist.
        const dome = document.querySelector('[data-dome]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            endTrigger: dome ?? el,
            end: dome ? 'top bottom' : 'bottom bottom',
            scrub: SCRUB,
            invalidateOnRefresh: true,
          },
        });

        // The plate is taller than the viewport and anchored to its top, so we
        // open on sky and pan down into the property — Era's "dive", rather
        // than a plain scale-out that shows the whole scene from frame one.
        //
        // -47.37 is not a taste value: it is -(190 - 100) / 190, the exact
        // travel that brings the bottom of the 190vh plate flush with the
        // viewport floor. Land short of it and the dive stops on sky with the
        // foreground cropped away; overshoot and the plate lifts off the bottom
        // of the frame. Re-derive it if the plate's height changes.
        // Durations are explicit for a reason. Under a scrub it is the timeline's
        // TOTAL length that the scroll range maps onto, so an omitted duration
        // does not mean "fill the range" — it means GSAP's 0.5 default, and the
        // longest tween silently decides everyone's share. Left implicit, the
        // plate got 0.5 of a 0.8 timeline and so landed at 62.5% of the descent,
        // freezing the frame for the ~700px until the arch reached the floor.
        // The plate must be the full 1, so it lands exactly as the arch arrives.
        tl.fromTo(
          '[data-hero-plate]',
          { yPercent: 0, scale: 1.08 },
          { yPercent: -47.37, scale: 1, ease: 'none', duration: 1 },
          0,
        )
          .fromTo('[data-hero-clouds]', { yPercent: 0, autoAlpha: 0.9 }, { yPercent: -60, autoAlpha: 0, ease: 'none', duration: 0.55 }, 0)
          .to('[data-hero-copy]', { yPercent: -30, autoAlpha: 0, ease: 'none', duration: 0.5 }, 0)
          .fromTo(
            '[data-hero-reveal], [data-hero-hotspots]',
            { autoAlpha: 0 },
            { autoAlpha: 1, ease: 'none', duration: 0.4 },
            0.3,
          );

        // ── the handover ─────────────────────────────────────────────────
        // The plate keeps moving while the arch climbs it, so the two sections
        // read as one continuous camera move rather than a cut. This runs on
        // exactly the span the arch does: from the dome meeting the viewport
        // floor to the hero releasing its sticky.
        //
        // It scales an inner layer rather than the plate itself. The dive above
        // already writes scale to the plate for the whole descent, and a second
        // scrubbed tween on the same property would fight it — whichever
        // rendered last would win, frame by frame.
        if (dome) {
          gsap.fromTo(
            '[data-hero-zoom]',
            { scale: 1 },
            {
              scale: 1.25,
              ease: 'none',
              // Once landed, the visible frame is the plate's bottom 100vh of
              // 190vh, whose centre sits at (190 - 50) / 190 of the plate.
              // Origin anywhere else and the push drifts across that frame
              // instead of pressing into it.
              transformOrigin: '50% 73.7%',
              scrollTrigger: {
                trigger: dome,
                start: 'top bottom',
                endTrigger: el,
                end: 'bottom bottom',
                scrub: SCRUB,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });

      mm.add(MM.mobile, () => {
        gsap.set('[data-hero-reveal], [data-hero-hotspots]', { autoAlpha: 1 });
        gsap.set('[data-hero-plate]', { yPercent: -14, scale: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="image"
      /* This height is the dive's length, and the only knob for it — the scrub
         above ends on the dome, so the two move together. 540vh over a 100dvh
         sticky plate pins for 440vh; ThreeReasons' -100vh margin puts its arch
         at the viewport floor at 540 - 100 - 100 = 340vh, so the descent gets
         340vh and the arch spends the remaining 100vh climbing over a plate
         that is still held. Raise this to hold the hero longer; the landing
         frame stays locked either way. Mobile keeps the short box: nothing
         scrubs there, so extra height is dead scroll. */
      className="relative h-[230vh] bg-[color:var(--forest)] md:h-[540vh]"
      aria-label="Introduction"
    >
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* Plate: taller than the viewport and top-anchored, so the scrub can
            travel down through it. At 190% the image covers height-first, which
            is what keeps the foreground in frame — at 138% it covered
            width-first and object-top cropped the loungers off the bottom. */}
        <div data-hero-plate className="absolute inset-x-0 top-0 h-[138%] md:h-[190%]">
          {/* Its own layer purely so the closing push has a transform to write
              that the dive is not already using — see "the handover" above. */}
          <div data-hero-zoom className="absolute inset-0">
            <MediaImage
              image="hero-day"
              sizes="100vw"
              priority
              wrapperClassName="absolute inset-0 h-full w-full"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ink)]/60 via-[color:var(--ink)]/20 to-[color:var(--ink)]/60" />

            {/* Inside the zoom layer so the markers inherit the dive's
                translate and the handover's scale — the same transforms the
                photograph gets, which is what keeps each dot on its subject
                instead of drifting across it. */}
            <div
              data-hero-hotspots
              className="pointer-events-none absolute inset-0 hidden opacity-0 md:block [&_button]:pointer-events-auto"
            >
              {HOTSPOTS.map((h) => (
                <Hotspot key={h.label} {...h} />
              ))}
            </div>
          </div>
        </div>

        {/* drifting cloud layer */}
        <div data-hero-clouds className="pointer-events-none absolute inset-x-0 top-0 h-[70%]">
          <MediaImage
            image="hero-sky"
            alt=""
            sizes="100vw"
            priority
            wrapperClassName="h-full w-full"
            className="object-cover opacity-35 mix-blend-screen"
          />
        </div>

        {/* title block */}
        <div
          data-hero-copy
          className="absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)] pt-16 text-center text-[color:var(--bone)]"
        >
          <h1 data-hero-title className="t-display relative invisible">
            {studio.nameLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <span
            data-hero-script
            className="pointer-events-none -mt-[0.28em] block text-[clamp(2.4rem,7vw,6rem)] leading-none"
            style={{ fontFamily: 'var(--font-script), cursive' }}
          >
            {studio.script}
          </span>

          <div
            data-hero-strap
            className="mt-10 flex w-full max-w-[min(1180px,86vw)] items-center justify-between gap-8"
          >
            <span className="t-label">{studio.strapline.left}</span>
            <span className="t-label">{studio.strapline.right}</span>
          </div>
        </div>

        {/* revealed once the dive completes */}
        {/* pointer-events-none matters now that the hotspots sit BELOW this
            layer in the stack: inset-0 and visible, it would swallow every
            hover meant for them. The CTA opts back in. */}
        <div data-hero-reveal className="pointer-events-none absolute inset-0 opacity-0">
          <div className="pointer-events-auto absolute inset-x-0 bottom-[8vh] flex justify-center">
            <CircleButton href="/#work" ring="EXPLORE · SELECTED WORK · ">
              View selected work
            </CircleButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Hotspot({ x, y, label }: { x: number; y: number; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="hotspot-ping relative grid h-4 w-4 place-items-center rounded-full text-[color:var(--bone)] ring-1 ring-current"
        aria-label={label}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </button>

      <span
        className={cn(
          't-label-sm pointer-events-none absolute left-1/2 top-7 w-max max-w-[46vw] -translate-x-1/2 rounded-full bg-[color:var(--bone)] px-3.5 py-2 text-[color:var(--ink)] transition-all duration-400',
          open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
        )}
      >
        {label}
      </span>
    </div>
  );
}
