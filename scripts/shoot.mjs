/**
 * Dev-only visual check. Anchors each capture to a real section offset rather
 * than a guessed scroll position, so pinned sections don't throw it off.
 *
 *   node scripts/shoot.mjs [baseUrl] [outDir]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] || 'http://localhost:3210';
const OUT = process.argv[3] || '.cache/shots';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(5000);

const sections = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-section-theme]')).map((el, i) => {
    const r = el.getBoundingClientRect();
    return {
      i,
      theme: el.dataset.sectionTheme,
      top: Math.round(r.top + window.scrollY),
      height: Math.round(r.height),
    };
  }),
);

const NAMES = [
  'hero', 'reasons', 'statement', 'mosaic', 'slider',
  'architecture', 'arch-plate', 'detail-track', 'quote', 'contact',
];

for (const s of sections) {
  const name = `${String(s.i).padStart(2, '0')}-${NAMES[s.i] ?? 'section'}`;
  // land a little inside the section so pinned content is engaged
  const offsets = s.height > 1400 ? [0.12, 0.5] : [0.15];
  for (const [n, frac] of offsets.entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), s.top + s.height * frac);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${OUT}/${name}${n ? `-${n + 1}` : ''}.png` });
  }
  process.stdout.write(`  ${name}\n`);
}

for (const [name, path] of [
  ['90-project', '/projects/casa-solene'],
  ['91-contact-form', '/contact'],
]) {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  process.stdout.write(`  ${name}\n`);
}

const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
await mob.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
await mob.waitForTimeout(5000);
await mob.screenshot({ path: `${OUT}/95-mobile-hero.png` });
await mob.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.22));
await mob.waitForTimeout(1600);
await mob.screenshot({ path: `${OUT}/96-mobile-mosaic.png` });
process.stdout.write('  mobile\n');

await browser.close();
console.log(`\nconsole errors: ${errors.length}`);
for (const e of [...new Set(errors)].slice(0, 15)) console.log('  ' + e);
