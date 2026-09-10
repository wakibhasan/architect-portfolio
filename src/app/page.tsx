import { Hero } from '@/components/sections/Hero';
import { ThreeReasons } from '@/components/sections/ThreeReasons';
import { StatementBand } from '@/components/sections/StatementBand';
import { PortfolioMosaic } from '@/components/sections/PortfolioMosaic';
import { Architecture } from '@/components/sections/Architecture';
import { ImageScrollSlider } from '@/components/sections/ImageScrollSlider';
import { ScrollSequence } from '@/components/sections/ScrollSequence';
import { QuarterGallery } from '@/components/sections/QuarterGallery';
import { SiteFooter } from '@/components/layout/SiteFooter';

/**
 * Page composition — TECH-PLAN §3, revised to follow era-residence.com's own
 * running order: the "why choose us" dome comes straight after the hero and
 * rises over the still-pinned hero plate, exactly as theirs does.
 *
 * 1 Hero              era-residence
 * 2 Three reasons     era-residence   ← arch overlaps the hero
 * 3 Statement band    modusprojects   ← sticky; 4 rides up over it
 * 4 Portfolio mosaic  bloom3d
 * 5 Architecture      era-residence
 * 6 Detail track      voltaskai
 * 7 Scroll sequence   modusprojects   ← canvas frame scrub
 * 8 Quarter gallery   voltaskai
 *   Site footer       hba             ← closes the page
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ThreeReasons />
      <StatementBand />
      <PortfolioMosaic />
      <Architecture />
      <ImageScrollSlider />
      <ScrollSequence />
      <QuarterGallery />
      <SiteFooter />
    </>
  );
}
