/**
 * Measures first-load weight and Core Web Vitals against a production build.
 *   node scripts/perf.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3211';
const browser = await chromium.launch();

for (const [label, viewport, mobile] of [
  ['desktop 1440x900', { width: 1440, height: 900 }, false],
  ['mobile  390x844', { width: 390, height: 844 }, true],
]) {
  const page = await browser.newPage({ viewport, isMobile: mobile });

  let bytes = 0;
  const byType = {};
  page.on('response', async (res) => {
    try {
      const buf = await res.body();
      const type = (res.headers()['content-type'] || 'other').split(';')[0].split('/')[0];
      bytes += buf.length;
      byType[type] = (byType[type] ?? 0) + buf.length;
    } catch {
      /* redirects / no body */
    }
  });

  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(4000); // let the preloader clear

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const fcp = performance.getEntriesByName('first-contentful-paint')[0];
          resolve({
            lcp: Math.round(lcp),
            cls: Number(cls.toFixed(4)),
            fcp: Math.round(fcp?.startTime ?? 0),
            domInteractive: Math.round(nav?.domInteractive ?? 0),
          });
        }, 1200);
      }),
  );

  console.log(`\n── ${label} ─────────────────────────────`);
  console.log(`  first-load transfer : ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  for (const [k, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`      ${k.padEnd(12)} ${(v / 1024).toFixed(0).padStart(6)} KB`);
  }
  console.log(`  FCP  ${vitals.fcp} ms`);
  console.log(`  LCP  ${vitals.lcp} ms`);
  console.log(`  CLS  ${vitals.cls}`);
  await page.close();
}

await browser.close();
