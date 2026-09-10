/**
 * Phase 2b — video pipeline.
 *
 *   node scripts/harvest-video.mjs
 *
 * Downloads every entry in VIDEO_SOURCES to public/video/. Deliberately thin
 * next to harvest-images.mjs: there is no sharp equivalent for video here, so
 * nothing is re-encoded — the file is served exactly as fetched.
 *
 * Idempotent: an already-downloaded file is left alone. Pass --force to
 * re-fetch, which you will need if a signed source URL has expired and you
 * have refreshed it in sources.mjs.
 */

import { mkdir, writeFile, stat, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VIDEO_SOURCES } from './sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'video');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const FORCE = process.argv.includes('--force');
const exists = (p) => access(p).then(() => true, () => false);
const mb = (n) => `${(n / 1048576).toFixed(1)}MB`;

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const { key, url, note } of VIDEO_SOURCES) {
    const dest = join(OUT, `${key}.mp4`);

    if (!FORCE && (await exists(dest))) {
      console.log(`· ${key}.mp4 — already present (${mb((await stat(dest)).size)}), skipping`);
      continue;
    }

    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'video/mp4,*/*' } });
    if (!res.ok) {
      // A 403 here almost always means the signature in sources.mjs has
      // lapsed, not that the pipeline is broken. Say so, rather than leaving
      // a bare status code to interpret.
      throw new Error(
        `${key}: ${res.status} ${res.statusText}. If this is a signed URL, ` +
          `re-copy it from the source page into sources.mjs and re-run with --force.`,
      );
    }

    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    console.log(`✓ ${key}.mp4 — ${mb(buf.byteLength)}${note ? `  (${note})` : ''}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
