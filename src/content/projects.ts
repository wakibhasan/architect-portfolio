import type { ImageKey } from '@/lib/images';

export type Project = {
  slug: string;
  title: string;
  location: string;
  country: string;
  typology: string;
  year: string;
  status: string;
  /** Lead image for the featured slider + detail hero. */
  hero: ImageKey;
  gallery: ImageKey[];
  intro: string;
  body: string[];
  facts: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: 'casa-solene',
    title: 'Casa Solene',
    location: 'Comporta',
    country: 'Portugal',
    typology: 'Private residence',
    year: '2025',
    status: 'Completed',
    hero: 'project-solene',
    gallery: ['project-solene-2', 'project-solene-3', 'mosaic-13'],
    intro:
      'A single-storey house folded around three courtyards, half an hour from the Atlantic.',
    body: [
      'The site is flat, sandy and almost featureless — a field of umbrella pines with no obvious front or back. Rather than impose a facade, we broke the programme into four low volumes and let the gaps between them do the work.',
      'Each courtyard has a different job. The first is an arrival room, walled and shaded. The second belongs to the kitchen and takes the morning sun. The third is private to the bedrooms and planted so densely you cannot see across it.',
      'Everything is built from two materials: lime-washed blockwork and untreated pine. Both were chosen because they will look better in fifteen years than they do today.',
    ],
    facts: [
      { label: 'Area', value: '340 m²' },
      { label: 'Structure', value: 'Load-bearing masonry' },
      { label: 'Completion', value: 'Spring 2025' },
      { label: 'Photography', value: 'Studio archive' },
    ],
  },
  {
    slug: 'marsa-terraces',
    title: 'Marsa Terraces',
    location: 'Dubai',
    country: 'UAE',
    typology: 'Hospitality',
    year: '2026',
    status: 'In progress',
    hero: 'project-marsa',
    gallery: ['project-marsa-2', 'mosaic-14', 'detail-05'],
    intro:
      'Forty-two suites stepping down to the water, each one with a terrace deep enough to eat on.',
    body: [
      'The brief asked for sea views from every room. The site — long, narrow and east-facing — made that arithmetic difficult, so the building steps in section rather than plan, and every roof becomes the terrace above.',
      'Interiors run cooler than the exterior: pale plaster, brushed bronze, and a single dark timber used only for doors and thresholds, so that the eye can always find the way out of a room.',
    ],
    facts: [
      { label: 'Keys', value: '42' },
      { label: 'Scope', value: 'Architecture + interiors' },
      { label: 'Stage', value: 'On site' },
      { label: 'Completion', value: '2026' },
    ],
  },
  {
    slug: 'selva-house',
    title: 'Selva House',
    location: 'Tulum',
    country: 'Mexico',
    typology: 'Private residence',
    year: '2024',
    status: 'Completed',
    hero: 'project-tulum',
    gallery: ['project-tulum-2', 'mosaic-03', 'detail-03'],
    intro: 'An open-air house with no glass on the ground floor and no air conditioning anywhere.',
    body: [
      'The client wanted a house that could be left empty for eight months of the year without deteriorating. That single constraint drove every decision: no sealed cavities, no mechanical plant, no finish that cannot be hosed down.',
      'The ground floor is a single covered room with operable timber screens on all four sides. Bedrooms sit above, cross-ventilated, each with a deep overhang calculated for the June sun angle.',
    ],
    facts: [
      { label: 'Area', value: '210 m²' },
      { label: 'Cooling', value: 'Passive only' },
      { label: 'Structure', value: 'Board-formed concrete' },
      { label: 'Completion', value: '2024' },
    ],
  },
  {
    slug: 'linea-residences',
    title: 'Linea Residences',
    location: 'Miami',
    country: 'USA',
    typology: 'Residential',
    year: '2024',
    status: 'Completed',
    hero: 'project-surfside',
    gallery: ['project-surfside-2', 'mosaic-13', 'detail-07'],
    intro: 'Nineteen apartments over a swimming hall carved into the base of the building.',
    body: [
      'The pool hall is the reason the building exists in the plan it does. Placing it below grade freed the entire ground floor for planting, which in turn let us set the residential entrance back from the street by twelve metres.',
      'Apartments are deliberately plain — square rooms, generous ceilings, no feature walls. The character is in the shared spaces, where we spent the budget.',
    ],
    facts: [
      { label: 'Units', value: '19' },
      { label: 'Amenity', value: 'Indoor pool hall' },
      { label: 'Scope', value: 'Interiors' },
      { label: 'Completion', value: '2024' },
    ],
  },
  {
    slug: 'atelier-nord',
    title: 'Atelier Nord',
    location: 'Tallinn',
    country: 'Estonia',
    typology: 'Mixed-use',
    year: '2025',
    status: 'Completed',
    hero: 'project-chedi',
    gallery: ['project-chedi-2', 'mosaic-09', 'detail-04'],
    intro: 'A former printworks turned into eleven studios, a reading room and a public courtyard.',
    body: [
      'Almost nothing was demolished. The existing frame set the grid, the existing openings set the rhythm, and our work was mostly subtraction — cutting a courtyard through the centre of a very deep plan so daylight could reach the middle.',
      'The reading room occupies the old press hall and keeps its floor, its crane rail and most of its scars.',
    ],
    facts: [
      { label: 'Area', value: '1,850 m²' },
      { label: 'Original', value: 'Printworks, 1932' },
      { label: 'Scope', value: 'Adaptive reuse' },
      { label: 'Completion', value: '2025' },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** Portfolio mosaic — row rhythm is data, not markup (TECH-PLAN §4.3). */
export const mosaicRows: { key: ImageKey; span: number; caption: string; place: string }[][] = [
  // bloom3d's Featured Projects rhythm: a 12-column grid alternating a two-up
  // row of span-6 cells with a three-up row of span-4 cells. Every row sums to
  // 12, so the grid stays flat — the nesting is only an authoring convenience.
  [
    { key: 'mosaic-01', span: 6, caption: 'Casa Solene', place: 'Comporta' },
    { key: 'mosaic-12', span: 6, caption: 'Atelier Nord', place: 'Tallinn' },
  ],
  [
    { key: 'mosaic-07', span: 4, caption: 'Selva House', place: 'Tulum' },
    { key: 'mosaic-05', span: 4, caption: 'Casa Solene', place: 'Kitchen' },
    { key: 'mosaic-02', span: 4, caption: 'Marsa Terraces', place: 'Dubai' },
  ],
  [
    { key: 'mosaic-11', span: 6, caption: 'Norra Cabin', place: 'Värmland' },
    { key: 'mosaic-13', span: 6, caption: 'Linea Residences', place: 'Miami' },
  ],
  [
    { key: 'mosaic-09', span: 4, caption: 'Selva House', place: 'Living room' },
    { key: 'mosaic-06', span: 4, caption: 'Norra Cabin', place: 'Exterior' },
    { key: 'mosaic-17', span: 4, caption: 'Marsa Terraces', place: 'Courtyard' },
  ],
  [
    { key: 'mosaic-04', span: 6, caption: 'Casa Solene', place: 'Terrace' },
    { key: 'mosaic-14', span: 6, caption: 'Selva House', place: 'Pool court' },
  ],
  [
    { key: 'mosaic-10', span: 4, caption: 'Linea Residences', place: 'Roof deck' },
    { key: 'mosaic-16', span: 4, caption: 'Marsa Terraces', place: 'Suite' },
    { key: 'mosaic-15', span: 4, caption: 'Atelier Nord', place: 'Kitchen' },
  ],
];
