'use client';

/**
 * GSAP singleton. Import gsap/ScrollTrigger from HERE, never from 'gsap'
 * directly, so plugins and CustomEases are guaranteed to be registered once.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { Draggable } from 'gsap/Draggable';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

let registered = false;

if (typeof window !== 'undefined' && !registered) {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    SplitText,
    CustomEase,
    Observer,
    Draggable,
    ScrollToPlugin,
  );

  // Era's easing curves — see TECH-PLAN.md §1
  CustomEase.create('Ease', '0.25,0.1,0.25,1');
  CustomEase.create('In', '0.5,0,0.75,0');
  CustomEase.create('InOut', '0.75,0,0.25,1');
  CustomEase.create('Out', '0.25,1,0.5,1');
  CustomEase.create('diveIn', '0.6,0,0,1');
  CustomEase.create(
    'loaderEase',
    'M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1',
  );

  gsap.defaults({ ease: 'Out', duration: 0.8 });

  // Pinned sections re-measure on resize; without this, mobile URL-bar
  // show/hide constantly refires ScrollTrigger and causes jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.normalizeScroll(false);

  registered = true;
}

/**
 * Adds will-change on enter and — crucially — removes it on leave.
 * A page with 60 permanently-promoted layers will crawl. TECH-PLAN §9.
 */
export function withWillChange(el: Element | null | undefined) {
  if (!el) return {};
  return {
    onEnter: () => el.classList.add('will-animate'),
    onEnterBack: () => el.classList.add('will-animate'),
    onLeave: () => el.classList.remove('will-animate'),
    onLeaveBack: () => el.classList.remove('will-animate'),
  };
}

export { gsap, ScrollTrigger, SplitText, CustomEase, Observer, Draggable, ScrollToPlugin, useGSAP };
