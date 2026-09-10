import type { ImageKey } from '@/lib/images';

export type Reason = {
  index: string;
  heading: string;
  body: string;
  images: ImageKey[];
};

/** The "three reasons" panels inside the sage dome (TECH-PLAN §4.7). */
export const reasons: Reason[] = [
  {
    index: '01',
    heading: 'ONE TEAM, START TO FINISH',
    body: 'The person who draws your plan is the person on site when it is built. No handover to a delivery team, no second interpretation of the design, no gap between what was promised and what gets made.',
    images: ['reason-01a', 'reason-01b'],
  },
  {
    index: '02',
    heading: 'MATERIALS THAT AGE WELL',
    body: 'We specify stone by the block and timber by the tree, and we detail every junction where two materials meet. Nothing in our drawings is chosen because it photographs well on handover day.',
    images: ['reason-02a', 'reason-02b'],
  },
  {
    index: '03',
    heading: 'DRAWINGS THAT GET BUILT',
    body: 'A complete set, coordinated with structure and services before tender. Contractors price it accurately because there is nothing left to guess — which is the cheapest thing an architect can do for a client.',
    images: ['reason-03a', 'reason-03b'],
  },
];

/** Horizontal material track — the Voltask treatment (TECH-PLAN §4.6). */
export const details: { key: ImageKey; caption: string }[] = [
  { key: 'detail-01', caption: 'Limestone, honed — Casa Solene' },
  { key: 'detail-03', caption: 'Oak joinery, oiled — Atelier Nord' },
  { key: 'detail-07', caption: 'Single-slab basin — Linea Residences' },
  { key: 'detail-04', caption: 'Shadow gap at ceiling — Marsa Terraces' },
  { key: 'detail-02', caption: 'Veined marble, book-matched — Marsa Terraces' },
  { key: 'detail-05', caption: 'Brushed bronze threshold — Selva House' },
  { key: 'detail-08', caption: 'Linen wall, seam detail — Casa Solene' },
  { key: 'detail-06', caption: 'Stair edge and handrail — Atelier Nord' },
];
