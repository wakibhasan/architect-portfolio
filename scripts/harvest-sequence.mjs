/**
 * Phase 2c — scroll-sequence pipeline.
 *
 *   node scripts/harvest-sequence.mjs        (npm run sequence)
 *
 * Downloads every frame of every entry in SEQUENCE_SOURCES to
 * public/sequence/<key>/. Nothing is re-encoded — these are drawn straight to a
 * canvas at native size, so re-compressing them would only cost quality.
 *
 * No manifest is emitted, unlike harvest-images.mjs. A sequence is addressed by
 * a URL pattern and a frame count, not by 121 individual keys, and those live
 * with the entry in sources.mjs.
 *
 * Idempotent: frames already on disk are skipped, so an interrupted run just
 * resumes. Pass --force to re-fetch everything.
 */

import { mkdir, writeFile, stat, access, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEQUENCE_SOURCES } from './sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'sequence');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const FORCE = process.argv.includes('--force');
/** Enough to saturate the link without firing all 121 at the origin at once. */
const CONCURRENCY = 8;

const exists = (p) => access(p).then(() => true, () => false);
const mb = (n) => `${(n / 1048576).toFixed(1)}MB`;
const pad = (i, digits) => String(i).padStart(digits, '0');

async function fetchFrame(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function harvest(entry) {
  const { key, baseUrl, filetype, frames, digits, indexStart = 0, note } = entry;
  const dir = join(OUT, key);
  await mkdir(dir, { recursive: true });

  const jobs = [];
  for (let i = indexStart; i < indexStart + frames; i++) {
    const n = pad(i, digits);
    jobs.push({ url: `${baseUrl}${n}.${filetype}`, dest: join(dir, `frame${n}.${filetype}`) });
  }

  let done = 0;
  let skipped = 0;

  // Fixed-size worker pool: each worker pulls the next job off a shared index
  // until they run out.
  let next = 0;
  const worker = async () => {
    for (;;) {
      const i = next++;
      if (i >= jobs.length) return;
      const { url, dest } = jobs[i];
      if (!FORCE && (await exists(dest))) {
        skipped++;
        continue;
      }
      await fetchFrame(url, dest);
      done++;
      if (done % 20 === 0) process.stdout.write(`  … ${done} fetched\n`);
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Totalled from disk rather than accumulated as the workers go. Writing
  // `total += await sizeOf(f)` reads `total` before its await settles, so with
  // CONCURRENCY of them in flight the increments overwrite one another and the
  // reported figure comes out far below the truth.
  const names = await readdir(dir);
  const sizes = await Promise.all(names.map((n) => stat(join(dir, n)).then((st) => st.size)));
  const bytes = sizes.reduce((a, b) => a + b, 0);

  console.log(
    `✓ ${key}: ${names.length} frames on disk (${done} fetched, ${skipped} already there) — ${mb(bytes)}` +
      (note ? `\n  ${note}` : ''),
  );

  if (names.length !== frames) {
    console.warn(`  ! expected ${frames} frames, found ${names.length}. Re-run to fill the gaps.`);
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const entry of SEQUENCE_SOURCES) await harvest(entry);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
