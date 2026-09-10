'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { RevealText } from '@/components/ui/RevealText';
import { SCRUB } from '@/lib/motion-tokens';

/**
 * Section 7 — the modusprojects.nl hero treatment (their `initImageSequenceScroll`).
 *
 * A camera move scrubbed by scroll: the shot pushes in on the building and
 * carries through the facade. It is 121 numbered JPEGs drawn to a <canvas>,
 * which is how they do it and not an arbitrary choice — seeking an <video>
 * backwards, or to a time that is not near a keyframe, stalls while the decoder
 * hunts for one, so the picture lurches and sticks under a scrub. Discrete
 * frames land exactly on the scroll position every time.
 */
const SEQ = {
  dir: '/sequence/enter',
  frames: 121,
  digits: 3,
  filetype: 'jpg',
} as const;

const frameUrl = (i: number) =>
  `${SEQ.dir}/frame${String(i).padStart(SEQ.digits, '0')}.${SEQ.filetype}`;

export function ScrollSequence() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const box = stage.current;
      const cv = canvas.current;
      if (!el || !box || !cv) return;

      const ctx = cv.getContext('2d');
      if (!ctx) return;

      const loaded = new Map<number, HTMLImageElement>();
      let lastProgress = 0;
      let resizeTimer: number | undefined;
      let disposed = false;

      /** Match the backing store to the CSS box, accounting for retina. */
      const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const w = box.clientWidth;
        const h = box.clientHeight;
        if (cv.width !== w * dpr || cv.height !== h * dpr) {
          cv.width = w * dpr;
          cv.height = h * dpr;
          cv.style.width = `${w}px`;
          cv.style.height = `${h}px`;
        }
      };

      /** Canvas has no object-fit, so cover has to be computed by hand. */
      const drawCover = (img: HTMLImageElement) => {
        resize();
        const scale = Math.max(cv.width / img.width, cv.height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
      };

      const loadFrame = (i: number) =>
        new Promise<void>((resolve) => {
          if (loaded.has(i) || i < 0 || i >= SEQ.frames) return resolve();
          const img = new Image();
          img.onload = () => {
            loaded.set(i, img);
            resolve();
          };
          img.onerror = () => {
            console.warn(`[ScrollSequence] frame ${i} failed to load: ${frameUrl(i)}`);
            resolve();
          };
          img.src = frameUrl(i);
        });

      /**
       * Nearest already-loaded frame, so a scrub that outruns the network shows
       * a slightly stale picture rather than a blank canvas.
       */
      const nearest = (i: number) => {
        for (let r = 1; r <= 12; r++) {
          if (loaded.has(i - r)) return i - r;
          if (loaded.has(i + r)) return i + r;
        }
        let best: number | null = null;
        let bestDiff = Infinity;
        for (const k of loaded.keys()) {
          const d = Math.abs(k - i);
          if (d < bestDiff) {
            best = k;
            bestDiff = d;
          }
        }
        return best;
      };

      const render = (progress: number) => {
        lastProgress = progress;
        const want = Math.round(progress * (SEQ.frames - 1));
        const have = loaded.has(want) ? want : nearest(want);
        if (have !== null) drawCover(loaded.get(have)!);
      };

      /**
       * Binary-midpoint fill, as they do it: load the first and last frames,
       * then keep halving the gaps. Loading 0,1,2,3… in order would leave the
       * back half of the shot blank for the whole download, whereas this makes
       * the sequence coarsely scrubbable almost immediately and simply refines.
       */
      const fill = async () => {
        await loadFrame(0);
        if (disposed) return;
        render(0);
        await loadFrame(SEQ.frames - 1);

        const queue: [number, number][] = [[0, SEQ.frames - 1]];
        while (queue.length && !disposed) {
          const [a, b] = queue.shift()!;
          if (b - a <= 1) continue;
          const m = Math.floor((a + b) / 2);
          await loadFrame(m);
          if (loaded.size % 12 === 0) render(lastProgress);
          queue.push([a, m], [m, b]);
        }
        if (!disposed) render(lastProgress);
      };

      void fill();

      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          resize();
          render(lastProgress);
        }, 200);
      };
      window.addEventListener('resize', onResize);

      // Reduced motion: hold the opening frame. The scrub is a camera move the
      // visitor did not ask for, and it is the whole point of the section, so
      // there is nothing to soften — it simply becomes a still.
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const st = reduced
        ? null
        : gsap.to(
            { p: 0 },
            {
              p: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top top',
                end: 'bottom bottom',
                scrub: SCRUB,
                invalidateOnRefresh: true,
                onUpdate: (self) => render(self.progress),
              },
            },
          );

      return () => {
        disposed = true;
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
        st?.scrollTrigger?.kill();
        st?.kill();
        loaded.clear();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-section-theme="image"
      /* The height IS the length of the shot: 121 frames over 400vh of scroll
         is roughly one frame every 33px, which reads as continuous motion.
         Shorten it and the sequence starts to strobe as whole frames get
         skipped between scroll events. */
      className="relative h-[400vh] bg-[color:var(--ink)]"
      aria-label="Approach and entry"
    >
      <div ref={stage} className="sticky top-0 h-dvh w-full overflow-hidden">
        <canvas ref={canvas} className="block h-full w-full" aria-hidden="true" />

        {/* Static equivalent for anyone who gets no canvas — the first frame,
            which is the wide establishing shot. */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frameUrl(0)}
            alt="Approach to the building"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </noscript>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/70 via-transparent to-[color:var(--ink)]/25" />

        <div className="absolute inset-x-0 bottom-[10vh] px-[var(--gutter)] text-[color:var(--bone)]">
          <RevealText
            as="h2"
            className="font-sans max-w-[16ch] text-[clamp(1.25rem,5vw,4.75rem)] font-semibold uppercase leading-[0.9] tracking-[-0.035em]"
          >
            Come inside.
          </RevealText>
          <span className="t-label-sm mt-6 block opacity-70">Scroll to enter</span>
        </div>
      </div>
    </section>
  );
}
