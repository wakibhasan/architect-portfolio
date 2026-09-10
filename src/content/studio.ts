/**
 * Fictional studio used for the demo. Swap these values for the client's real
 * identity before the pitch (TECH-PLAN §11.1) — nothing else needs to change.
 */

export const studio = {
  name: 'Architect Portfolio',
  nameLines: ['ARCHITECT', 'PORTFOLIO'] as const,
  script: 'Lisboa',
  discipline: 'Architecture & Interiors',
  founded: 2011,

  strapline: { left: 'BUILT TO', right: 'BE LIVED IN' },

  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'Studio', href: '/#studio' },
    { label: 'Contact', href: '/contact' },
  ],

  cta: { label: 'Start a project', href: '/contact' },

  contact: {
    phone: '+351 213 470 118',
    phoneHref: 'tel:+351213470118',
    email: 'studio@architect-portfolio.com',
    officeLabel: 'Studio',
    address: ['Rua da Boavista 84', '1200-068 Lisboa, Portugal'],
  },

  statement: {
    lines: ['THINK SLOWLY,', 'BUILD ONCE.'],
    body: 'We are a Lisbon studio working across architecture and interiors — from the first sketch to the last handle. One team, one point of contact, one drawing set that actually gets built.',
    /**
     * Path under /public, e.g. '/video/statement.mp4'. Left null the band
     * renders its poster still instead — deliberately, so the section is
     * whole with no asset rather than 404ing on a <source> that is not there
     * yet. Set it and the still becomes the poster frame automatically.
     */
    video: '/video/statement.mp4' as string | null,
    /** Shown before the video decodes, and instead of it under reduced motion. */
    poster: 'statement',
  },

  /** Closing district band — the voltaskai "final gallery" treatment. */
  quarter: {
    eyebrow: 'Cais do Sodré',
    heading: 'A working waterfront turning into somewhere people actually live.',
    body: 'The old cold-stores and ferry sheds along the river are becoming apartments, studios and small workshops. We are drawing four of them. The brief on every one is the same — keep what the street already recognises, and put the new work behind it.',
    ctaLabel: 'Discover',
    ctaText: 'The riverfront',
    ctaHref: '/projects',
  },

  quote: {
    text: 'A house should be quieter than the life inside it. We design the walls so the rooms can hold whatever happens in them for the next forty years.',
    role: 'Founding Partner',
    company: 'Architect Portfolio',
  },

  architecture: {
    statement:
      'Our work balances clean contemporary lines with Mediterranean warmth — stone that ages, timber that moves, and light that changes the room four times a day.',
    creditLines: ['BY ARCHITECT PORTFOLIO', 'STRUCTURE — OCWA ENGINEERING'],
  },

  detail: {
    eyebrow: 'Materials',
    heading: 'A seamless dialogue between surface and light',
    body: 'Every project begins with a material board and ends with a threshold detail. We specify stone by the block, not the sample, and we draw every junction where two materials meet — because that junction is what people actually touch.',
  },

  /**
   * The full site footer — the hba.com arrangement: a blurb column on the left,
   * a grouped link nav on the right, then subscribe / enquire / follow in a row
   * beneath it, and a legal line under everything.
   *
   * Separate from `footer` below, which is the short legal strip the Contact
   * section already renders. Both exist because Contact is still the closer on
   * /contact and the project pages, and it should not grow a second footer.
   *
   * Every href resolves to a route that exists. HBA fill their nav with 29
   * office pages; we have one studio, so the columns carry the site itself
   * rather than inventing pages that would 404.
   */
  siteFooter: {
    blurb:
      'A Lisbon studio of eleven, working across architecture and interiors. One team from the first sketch to the last handle — in Portugal, and wherever the drawings take us.',
    note: 'The studio is on Rua da Boavista. Visits by appointment.',
    groups: [
      {
        title: 'Studio',
        links: [
          { label: 'Selected work', href: '/#work' },
          { label: 'Practice', href: '/#studio' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    subscribe: {
      title: 'Subscribe',
      note: 'Three or four notes a year, when a building finishes.',
    },
    enquire: { title: 'Enquire', label: 'Contact us', href: '/contact' },
    /**
     * Placeholders, like the phone number and address above — the studio is
     * fictional, so none of these profiles exist. Swap them with the rest of
     * the identity before the pitch (TECH-PLAN §11.1).
     */
    socials: [
      { label: 'Instagram', href: 'https://instagram.com/architectportfolio' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/architect-portfolio' },
      { label: 'Pinterest', href: 'https://pinterest.com/architectportfolio' },
    ],
  },

  footer: {
    legal: `© ${new Date().getFullYear()} Architect Portfolio. All rights reserved.`,
    links: [
      { label: 'Privacy', href: '/contact' },
      { label: 'Terms', href: '/contact' },
    ],
    credit: 'Demo build',
  },
} as const;
