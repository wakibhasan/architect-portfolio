/**
 * Curated source manifest for the demo build.
 *
 * Every entry is a real, publicly-served asset from one of the five reference
 * sites listed in website-inspiration.txt. See TECH-PLAN.md §6.1 — these are
 * placeholders for layout work and must be swapped for licensed stock before
 * the site is shown to a client or deployed publicly.
 *
 * key      -> stable id used by MediaImage / content files
 * url      -> source URL (already size-variant-collapsed to the original)
 * alt      -> alt text written for OUR fictional studio, not the source project
 */

const WF = 'https://cdn.prod.website-files.com';
const ERA_A = `${WF}/6a068da7ad91b057365bf967`;
const ERA_B = `${WF}/6a0853d5dab31b18f0677081`;
const BLOOM = `${WF}/686bafaa09e3deeafa1ad8a8`;
const MODUS = `${WF}/6978c74eb7a56e10b85274cb`;
const HBA = 'https://hba.com/wp-content/uploads';
const VOLTA = 'https://cdn.endover.ee/voltaskai';

export const SOURCES = [
  // ── Hero ──────────────────────────────────────────────────────────────
  { key: 'hero-day', url: `${ERA_A}/6a25da81dce540a251389928_era-residence_gated-community_day.webp`,
    alt: 'Courtyard and pool of a Verra Atelier residence in daylight' },
  { key: 'hero-night', url: `${ERA_A}/6a25da802c253b9e5e3d44f5_era-residence_gated-community_night.webp`,
    alt: 'The same courtyard after dusk, lit from within' },
  { key: 'hero-sky', url: `${ERA_A}/6a0fa3c6c9c3c584d9d78d85_img_clouds_02.avif`,
    alt: 'Open sky above the site' },

  // ── Statement band (Modus treatment) ──────────────────────────────────
  { key: 'statement', url: `${VOLTA}/2026/01/kaupokalda-com-DJI_20250926180905_0279_D.jpg`,
    alt: 'Aerial view of a residential tower at golden hour' },

  // ── Portfolio mosaic ──────────────────────────────────────────────────
  // NB: Webflow serves the same asset under several alt-text-derived names.
  // `…_f069ebf4a9d9…_Photorealistic 3D…The Ubud project` is byte-identical to
  // mosaic-02, so this slot uses a distinct hash instead.
  { key: 'mosaic-01', url: `${BLOOM}/6a5f38692516f626c070f3f9_f094d44939235e6065e64c1e5940b75f_02%2012.webp`,
    alt: 'Terraced pavilion set into a hillside' },
  { key: 'mosaic-02', url: `${BLOOM}/6937f1d7c55b1e39f54a6bbc_f069ebf4a9d9de326e02dbaeed24f0c5_Dramatic%20circular%20pool%20with%20waterfall%20architecture%203D%20visualization.webp`,
    alt: 'Circular pool ringed by a water curtain' },
  { key: 'mosaic-03', url: `${BLOOM}/6937f1d8f09138bca1b65563_ac4a6059160f5b1b892ff3c92ada11d6_Architectural%20visualization%20of%20a%20modern%20pool%20exterior%20in%20Bali.webp`,
    alt: 'Pool terrace opening to the treeline' },
  { key: 'mosaic-04', url: `${BLOOM}/6937f355238d93f9b25f93a3_57d07fcd8391a10c2dfeced6ebdbd7a0_Close-up%203D%20render%20of%20a%20wooden%20terrace%20workspace.webp`,
    alt: 'Timber terrace with a built-in desk' },
  { key: 'mosaic-05', url: `${BLOOM}/694125de5691555328992c18_a69ebebd31967d1f2521f36a62fcffe6_3D%20interior%20visualization%20of%20Amrita%27s%20kitchen.webp`,
    alt: 'Kitchen in pale stone and oak' },
  { key: 'mosaic-06', url: `${BLOOM}/694125f2036f9b6aa74bf106_c7970e7b79415608eaad673ce684a190_Architectural%203D%20rendering%20of%20Entropy%20project.webp`,
    alt: 'Timber house among pines' },
  { key: 'mosaic-07', url: `${BLOOM}/694125f256a9a99e0f56dd5d_3f35086e252e9eddde3f326a8e15df07_3D%20architectural%20visualization%20of%20Entropy%20forest%20house%20in%20Sweden.webp`,
    alt: 'Forest house in morning mist' },
  { key: 'mosaic-08', url: `${BLOOM}/694126046a36b628b787bd49_3067fe483a5d420cf1444475bba5525d_Morven%20project%20by%20Bloom.webp`,
    alt: 'Long low volume against open landscape' },
  { key: 'mosaic-09', url: `${BLOOM}/69412615bd688902609171cb_908cd15515a5ac0d5bb450f239808980_Modern%20Balinese%20interior%20design%20visualization.webp`,
    alt: 'Living room with a curved rattan ceiling' },
  { key: 'mosaic-10', url: `${BLOOM}/69412615cc32e96ed1acad4f_37d368f3f111947b6bdbee45d7b45936_Top-view%203D%20visualization%20of%20poolside%20lounge%20chairs%20and%20wooden%20table.webp`,
    alt: 'Poolside loungers seen from above' },
  { key: 'mosaic-11', url: `${BLOOM}/69413b6a918d1b41aca0749c_c31b7777ef2ed18fdf7055f6581152d5_Architectural%20exterior%20visualization%20of%20a%20modern%20dark%20wood%20cabin.webp`,
    alt: 'Blackened timber cabin on a ridge' },
  { key: 'mosaic-12', url: `${HBA}/2025/05/Regent-Bali-Canggu-Indonesia-03.jpg`,
    alt: 'Lobby lounge with woven screens' },
  { key: 'mosaic-13', url: `${HBA}/2025/05/Surfside-Miami-02_Rooftop-Pool.jpg`,
    alt: 'Rooftop pool deck facing the sea' },
  { key: 'mosaic-14', url: `${HBA}/2025/06/Conrad-Tulum-HBA-San-Francisco-Pool.jpg`,
    alt: 'Pool courtyard framed by planting' },
  { key: 'mosaic-15', url: `${ERA_B}/6a1575180f248400b7124a46_era-residence-kitchen.webp`,
    alt: 'Kitchen island in honed limestone' },
  { key: 'mosaic-16', url: `${VOLTA}/2026/01/Volta-Skai_interior_living-room_standard_sea-view_family.jpg`,
    alt: 'Living room opening to a sea view' },
  { key: 'mosaic-17', url: `${BLOOM}/69413b6ad050cbc3941d298e_Early_morning_2.webp`,
    alt: 'Early morning light across a courtyard' },

  // ── Featured project slider ───────────────────────────────────────────
  { key: 'project-solene', url: `${HBA}/2025/06/OneOnly-Portonovi-Herceg-Novi-01.jpg`,
    alt: 'Casa Solene — terrace and sea beyond' },
  { key: 'project-solene-2', url: `${HBA}/2025/06/OneOnly-Portonovi-Herceg-Novi-07.jpg`,
    alt: 'Casa Solene — living pavilion' },
  { key: 'project-solene-3', url: `${HBA}/2025/06/OneOnly-Portonovi-Herceg-Novi-14.jpg`,
    alt: 'Casa Solene — stair and courtyard' },
  { key: 'project-marsa', url: `${HBA}/2025/06/Jumeirah-Marsa-Al-Arab-14.jpg`,
    alt: 'Marsa Terraces — arrival court' },
  { key: 'project-marsa-2', url: `${HBA}/2025/06/Jumeirah-Marsa-Al-Arab-24.jpg`,
    alt: 'Marsa Terraces — upper lounge' },
  { key: 'project-tulum', url: `${HBA}/2025/06/Conrad-Tulum-Riviera-Maya-03.jpg`,
    alt: 'Selva House — open-air dining room' },
  { key: 'project-tulum-2', url: `${HBA}/2025/06/Conrad-Tulum-Riviera-Maya-05.jpg`,
    alt: 'Selva House — courtyard at dusk' },
  { key: 'project-surfside', url: `${HBA}/2025/05/Surfside-Miami-04_Indoor-Pool.jpg`,
    alt: 'Linea Residences — indoor pool hall' },
  { key: 'project-surfside-2', url: `${HBA}/2025/05/Surfside-Miami-06_Balcony_Ocean.jpg`,
    alt: 'Linea Residences — balcony over the water' },
  { key: 'project-chedi', url: `${HBA}/2025/07/04-Chedi-Xinchang.jpg`,
    alt: 'Atelier Nord — reading room' },
  { key: 'project-chedi-2', url: `${HBA}/2025/07/Perspective-Park-Hyatt-Suzhou.jpg`,
    alt: 'Atelier Nord — courtyard colonnade' },

  // ── Architecture / craft ──────────────────────────────────────────────
  { key: 'arch-01', url: `${ERA_B}/6a15153b797c328a9f2f5964_era-residence-terrace.webp`,
    alt: 'Roof terrace with a planted pergola' },
  { key: 'arch-02', url: `${ERA_B}/6a150cc2f810e37eec2ea963_era-residence-garden.webp`,
    alt: 'Garden walk between stone volumes' },
  { key: 'arch-full', url: `${ERA_A}/6a1571e51d50c8bcf5f4bb3d_era-residence-garden-2.webp`,
    alt: 'Facade in travertine and climbing planting' },
  { key: 'leaf-01', url: `${ERA_A}/6a4afbe9f3a19844a4b0caed_bougainvillea-flowers_01.avif`,
    alt: '' },
  { key: 'leaf-02', url: `${ERA_A}/6a4afbe988f8dc3c9bb1647a_bougainvillea-flowers_03.avif`,
    alt: '' },
  { key: 'leaf-03', url: `${ERA_A}/6a4afbe9a4873ec6185f295d_bougainvillea-flowers_05.avif`,
    alt: '' },
  { key: 'leaf-04', url: `${ERA_A}/6a4afbe968be0cc0c1f5fef2_bougainvillea-flowers_06.avif`,
    alt: '' },

  // ── Detail / material track (Voltask treatment) ───────────────────────
  { key: 'detail-01', url: `${MODUS}/69a5529395a92b1d403a41ac_AtlasPlan_086_00_BoostVision_Camel.avif`,
    alt: 'Camel-toned stone floor detail' },
  { key: 'detail-02', url: `${MODUS}/69a590498c15d05268ea3ca4_AtlasConcorde_Nyra_006_06_Ambrosia.avif`,
    alt: 'Warm veined stone surface' },
  { key: 'detail-03', url: `${MODUS}/69c6966f34c63231710098dc_Modus%20Projects%20Image%2003.avif`,
    alt: 'Joinery detail in oak' },
  { key: 'detail-04', url: `${MODUS}/69c6966f6079c5f5265d1f7a_Modus%20Projects%20Image%2004.avif`,
    alt: 'Reveal between wall and ceiling plane' },
  { key: 'detail-05', url: `${MODUS}/69c6966f625e14c6ede0a2bc_Modus%20Projects%20Image%2005.avif`,
    alt: 'Threshold detail in brushed metal' },
  { key: 'detail-06', url: `${MODUS}/69c6966f2dafbf9dd9efcd56_Modus%20Projects%20Image%2007.avif`,
    alt: 'Stair edge and handrail junction' },
  { key: 'detail-07', url: `${VOLTA}/2025/12/bathroom_close_2.5K.jpg`,
    alt: 'Bathroom in single-slab stone' },
  { key: 'detail-08', url: `${VOLTA}/2025/12/living_cu_2.5K.jpg`,
    alt: 'Seating detail against a linen wall' },

  // ── Three reasons ─────────────────────────────────────────────────────
  { key: 'reason-01a', url: `${ERA_B}/6a151264dc1dcca76fda17d9_era-residence-pool.webp`,
    alt: 'Pool court in late afternoon' },
  { key: 'reason-01b', url: `${ERA_B}/6a1575f46655e8c4e795ec64_era-residence-landscaping.webp`,
    alt: 'Planted terraces stepping down the slope' },
  { key: 'reason-02a', url: `${ERA_B}/6a15132fe66907986a254201_era-residence-spa-%26-gym.webp`,
    alt: 'Spa hall lit from a clerestory' },
  { key: 'reason-02b', url: `${HBA}/2025/08/The-OWO-by-Raffles_HBA-Residential.jpg`,
    alt: 'Residential lobby with a stone stair' },
  { key: 'reason-03a', url: `${VOLTA}/2025/12/Volta-skai_facade-cu-1.jpg`,
    alt: 'Facade close-up showing the balcony rhythm' },
  { key: 'reason-03b', url: `${ERA_B}/6a1512e5b24991c76981118b_era-residence-gated-community.webp`,
    alt: 'Site plan seen from above' },

  // ── Team quote ────────────────────────────────────────────────────────
  { key: 'quote-bg', url: `${ERA_A}/6a0f8994091fd12c24e79c8a_img_cam_02.webp`,
    alt: 'Reflecting pool at golden hour' },

  // ── Contact ───────────────────────────────────────────────────────────
  { key: 'contact-bg', url: `${ERA_A}/6a0f88f3b81e88aabf6874e7_img_cta_1920.webp`,
    alt: 'Table laid on a shaded terrace' },

  // ── Studio / team portraits ───────────────────────────────────────────
  { key: 'team-01', url: `${VOLTA}/2025/12/Annika-Saar.jpg`, alt: 'Portrait of a studio director' },
  { key: 'team-02', url: `${VOLTA}/2026/05/Diana-Uibo_Endover_square.jpg`, alt: 'Portrait of an associate architect' },
  { key: 'team-03', url: `${VOLTA}/2026/02/rasmus_skai_endover.jpg`, alt: 'Portrait of a project lead' },
];

/** Assets that must keep their alpha channel (foreground cut-outs). */
export const ALPHA_KEYS = new Set(['leaf-01', 'leaf-02', 'leaf-03', 'leaf-04', 'hero-sky']);

/**
 * Video placeholders. Same standing as SOURCES above and subject to the same
 * rule: real, publicly-served assets from a reference site, here for layout
 * work only, to be swapped for licensed footage before this is shown to a
 * client or deployed publicly.
 *
 * Note the signed, expiring URL. That is why these are downloaded rather than
 * referenced from a <source> tag — pointed at directly, the section would play
 * for a while and then silently start failing once the signature lapsed.
 *
 * 720p is deliberate over the 1080p rendition the same page offers: this plays
 * full-bleed behind an 85% scrim where the detail is not readable anyway, and
 * it autoplays, so it competes with the page's own images for bandwidth.
 * 2.5MB against 5.7MB is the better trade here. Swap the rendition in the URL
 * if you want the larger one.
 */
export const VIDEO_SOURCES = [
  {
    key: 'statement',
    url: 'https://player.vimeo.com/progressive_redirect/playback/1143001442/rendition/720p/file.mp4?loc=external&signature=5915143c10582be86e72212036dc91515c52eeb7f8d43a2cc1a10869f16f9e26',
    note: 'fosterandpartners.com lead item — Zayed National Museum',
  },
];

/**
 * Scroll-scrubbed image sequences. Same standing as SOURCES: real assets from a
 * reference site, here for layout work, to be replaced before this is shown to
 * a client or deployed publicly.
 *
 * modusprojects.nl serves this as 121 numbered JPEGs drawn to a <canvas>, not
 * as a video. That is the deliberate choice for a scrubbed shot — seeking an
 * mp4 backwards or to an arbitrary time stalls on the nearest keyframe, so the
 * picture lurches; discrete frames land exactly on the scroll position every
 * time. It costs about 12MB for the set, which is the honest price of it.
 */
export const SEQUENCE_SOURCES = [
  {
    key: 'enter',
    baseUrl: 'https://cdn.overflow.nl/modus-sequence-v2/frame',
    filetype: 'jpg',
    frames: 121,
    digits: 3,
    indexStart: 0,
    note: 'modusprojects.nl hero — zoom into the building and through the facade',
  },
];
