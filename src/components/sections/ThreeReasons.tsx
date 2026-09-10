'use client';

import { useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MediaImage } from '@/components/ui/MediaImage';
import { RevealText } from '@/components/ui/RevealText';
import { CurvedHeading } from '@/components/ui/CurvedHeading';
import { LogoMark } from '@/components/layout/LogoMark';
import { reasons, type Reason } from '@/content/reasons';
import { SCRUB, MM } from '@/lib/motion-tokens';
import { studio } from '@/content/studio';

/**
 * Section 7 — the Era "three reasons" treatment (TECH-PLAN §4.7).
 *
 * A pale sage dome rises over the previous section, its heading set on the
 * curve of the shoulder. Inside, each reason is a full-viewport panel with a
 * large display headline and its own small paginated image slider.
 */
export function ThreeReasons() {
  const root = useRef<HTMLElement>(null);
  // Handed down to every panel so their RevealTexts can measure along the
  // track rather than down the page. Null on mobile, where there is no track.
  const [hScroll, setHScroll] = useState<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MM.desktopMotion, () => {
        // The dome itself is NEVER transformed. It holds three panels' worth
        // of scroll-triggered reveals, and a transform on the container shifts
        // every child's measured position — which silently stops those reveals
        // from firing. The -100vh margin already produces the overlap, so the
        // arch rises simply by being scrolled into view.
        //
        // Only the header (which contains no triggers) gets parallax, plus the
        // shoulder flattens slightly as the dome settles.
        gsap.fromTo(
          '[data-dome-header]',
          { y: 90 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-dome]',
              start: 'top bottom',
              end: 'top 25%',
              scrub: SCRUB,
              invalidateOnRefresh: true,
            },
          },
        );

        // ── horizontal scroll ──────────────────────────────────────────
        // Pin the viewport and drag the track sideways by exactly its own
        // overflow, so the third panel lands flush against the right edge
        // instead of over- or under-shooting. Same shape as ImageScrollSlider.
        //
        // The distance is a function, not a number: it is read again on every
        // refresh, so a resize re-measures instead of keeping a stale width.
        const viewport = el.querySelector<HTMLElement>('[data-reasons]');
        const track = el.querySelector<HTMLElement>('[data-reasons-track]');
        if (viewport && track) {
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: viewport,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: SCRUB,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          setHScroll(tween);
          return () => setHScroll(null);
        }
      });

      mm.add(MM.mobile, () => gsap.set('[data-dome-header]', { y: 0 }));

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      /* Negative margin pulls the dome up over the hero's still-pinned plate,
         so the arch rises out of the photograph rather than off a flat ground
         — that overlap is the whole effect on era-residence.com. Nothing here
         paints a background above the arch, which is what lets the hero show
         through around the shoulders.

         It is a full 100vh and not a smaller figure because this margin is what
         buys the hero its cover. The hero's plate is sticky for exactly the
         height of one viewport, so an overlap of 100vh is the amount that lets
         the dome climb from the viewport floor to the viewport ceiling while
         the plate underneath is still held — it gets covered rather than
         scrolled away. Anything less and the hero releases mid-climb and starts
         travelling up with the page, which reads as the two sections sliding
         apart instead of one passing over the other. */
      className="relative z-10 -mt-[100vh]"
      aria-label="Why work with us"
    >
      {/* data-theme, not just data-section-theme, and the two do different
          jobs. data-section-theme tells ThemeController what the *page* chrome
          should become while this section owns the viewport. data-theme is the
          palette for this subtree: the rules in globals.css are plain attribute
          selectors, so setting it here redeclares --fg/--muted/--accent locally.

          Without it the dome read the page-level --fg, and this surface is sage
          no matter what the page is doing. While the arch is climbing over the
          hero the page is still legitimately on the "image" theme — its
          midpoint is over the photograph — so --fg was bone and every word in
          the dome rendered white on sage. Owning the palette locally makes that
          unrepresentable rather than a timing question. */}
      <div
        data-dome
        data-section-theme="sage"
        data-theme="sage"
        className="relative text-[color:var(--fg)]"
      >
        {/* The arch is its own capped element rather than a border-radius on
            the full-height panel — percentage vertical radii scale with height,
            so on a 3,700px panel the curve is unpredictable.
            The height has to equal half the width, no less: fitting an ellipse
            to era-residence's own dome returns a = b = 675px on a 1342px frame
            (RMS 0.87px over 1046 sampled columns) — a true semicircle, 50.3% of
            the width. The 28vw this used to be was a flattened oval, which is
            what made the shoulder read as a wide bump rather than a dome. */}
        <div
          className="h-[50vw] w-full bg-[color:var(--sage)]"
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
          aria-hidden="true"
        />

        {/* flow-root establishes a block formatting context. Without it the
            header's -48vw margin collapses through this box and drags the
            whole panel up over the cap, flattening the arch to a sliver. */}
        <div className="flow-root bg-[color:var(--sage)] pb-[10vh]">
          {/* Shoulder content is pulled back up into the arch so the curved
              heading sits just below the apex, as in the reference. */}
          <header
            data-dome-header
            className="relative -mt-[48vw] flex flex-col items-center px-[var(--gutter)]"
          >
            {/* Full content width on purpose — capping it at max-w-6xl made the
                heading's arc much tighter than the dome it is supposed to sit
                on, since that arc is drawn relative to the SVG's own width. */}
            <CurvedHeading
              text={`THREE REASONS TO CHOOSE ${studio.nameLines[0]}`}
              className="w-full"
            />
            {/* flex-1 on both labels, not natural width. Sizing the row to its
                content centres the ROW, which puts the mark off-centre by half
                the difference between the two words — the reason it sat right
                of centre before. Equal flex basis makes the two sides equal
                regardless of what the words are, so the mark lands on the true
                centre line and stays there if the copy ever changes. */}
            <div className="-mt-6 flex w-full max-w-md items-center gap-5 md:-mt-10">
              <span className="t-label-sm flex-1 text-right">ARCHITECT</span>
              <LogoMark size={54} label="" className="shrink-0" />
              <span className="t-label-sm flex-1 text-left">INTERIORS</span>
            </div>
          </header>

          {/* The viewport clips, the track moves. Below md this collapses back
              to the original vertical stack — pinning a three-screen-wide track
              on a phone costs far more scroll than the effect is worth. */}
          <div data-reasons className="relative mt-[10vh] overflow-hidden">
            <div data-reasons-track className="flex flex-col gap-[14vh] md:flex-row md:gap-0">
              {reasons.map((reason) => (
                <ReasonPanel key={reason.index} reason={reason} containerAnimation={hScroll} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReasonPanel({
  reason,
  containerAnimation,
}: {
  reason: Reason;
  containerAnimation: gsap.core.Tween | null;
}) {
  // The carousel keeps its drag/swipe, but nothing reads its index any more —
  // the numerals and progress bar that did are gone, so the selection listener
  // and its state went with them.
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 26 });

  // shrink-0 is load-bearing: without it flexbox squeezes three full-width
  // panels into one viewport and the track never overflows, so there is
  // nothing to scroll horizontally.
  return (
    <article className="flex w-full shrink-0 flex-col items-center px-[var(--gutter)] text-center md:min-h-dvh md:justify-center">
      {/* Half of t-h1's clamp(2.6rem, 7.5vw, 7.5rem). Overridden here rather
          than in the type scale because t-h1 is shared with the contact page,
          project pages, the nav and the mosaic. The trailing "!" is required,
          not habit: .t-h1 is unlayered CSS in globals.css and Tailwind's
          utilities sit in @layer utilities, so an unflagged text-[...] loses
          the cascade to it no matter how specific it looks. */}
      <RevealText
        as="h3"
        className="t-h1 max-w-5xl text-[clamp(1.3rem,3.75vw,3.75rem)]!"
        split="chars"
        stagger={0.022}
        containerAnimation={containerAnimation}
      >
        {reason.heading}
      </RevealText>

      {/* Inner image slider, now controls-free — drag/swipe only.
          6xl is exactly double the xl this used to be: 72rem against 36rem. */}
      <div className="mt-14 w-full max-w-6xl">
        {/* The radius goes on Embla's viewport, not on the slides. This
            element is the window the images move behind, so one rounded frame
            stays rounded at every drag position. Rounding each slide instead
            would put two sets of corners side by side mid-drag, notching the
            join between them. */}
        <div ref={emblaRef} className="overflow-hidden rounded-2xl">
          <div className="flex">
            {reason.images.map((key) => (
              <div key={key} className="min-w-0 flex-[0_0_100%]">
                <MediaImage
                  image={key}
                  sizes="(max-width: 768px) 90vw, 68rem"
                  /* max-h caps what the doubled width would otherwise cost in
                     height. A 16/10 box at 72rem is 720px tall — on its own
                     that is 80% of a 900px viewport, and with the title,
                     pager and body the panel would run past one
                     screen. The panel is pinned from 'top top', so whatever
                     falls below the fold can never be scrolled to; it would
                     simply be gone. The cap keeps the extra width and spends
                     it on a wider crop rather than a taller panel. */
                  wrapperClassName="aspect-[16/10] max-h-[50vh] w-full"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      <RevealText
        as="p"
        className="t-body mt-12 max-w-lg"
        stagger={0.03}
        containerAnimation={containerAnimation}
      >
        {reason.body}
      </RevealText>

    </article>
  );
}
