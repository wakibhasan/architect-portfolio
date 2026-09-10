/**
 * Phase 2 — image pipeline.
 *
 *   node scripts/harvest-images.mjs
 *
 * Downloads every entry in sources.mjs, normalises it (cap at 2560px, strip
 * metadata, re-encode), writes it to public/images/, and emits a manifest at
 * src/content/generated/images.json carrying intrinsic dimensions plus a
 * blurDataURL for each asset.
 *
 * Idempotent: already-downloaded originals are reused from .cache/raw.
 * Re-run after editing sources.mjs.
 */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { SOURCES, ALPHA_KEYS } from './sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, '.cache', 'raw');
const OUT = join(ROOT, 'public', 'images');
const MANIFEST = join(ROOT, 'src', 'content', 'generated', 'images.json');

const MAX_WIDTH = 2560;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const exists = (p) => access(p).then(() => true, () => false);

async function download(url, dest) {
  if (await exists(dest)) return readFile(dest);
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf;
}

/** Tiny blurred base64 preview used as next/image placeholder. */
async function blurDataURL(input) {
  const buf = await sharp(input).resize(16, null, { fit: 'inside' }).blur(1.2).webp({ quality: 45 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

async function main() {
  await mkdir(RAW, { recursive: true });
  await mkdir(OUT, { recursive: true });
  await mkdir(dirname(MANIFEST), { recursive: true });

  const manifest = {};
  let ok = 0;
  const failed = [];

  for (const [i, item] of SOURCES.entries()) {
    const label = `[${String(i + 1).padStart(2, '0')}/${SOURCES.length}] ${item.key}`;
    try {
      const rawPath = join(RAW, `${item.key}.bin`);
      const buf = await download(item.url, rawPath);

      const keepAlpha = ALPHA_KEYS.has(item.key);
      const ext = keepAlpha ? 'webp' : 'jpg';
      const outName = `${item.key}.${ext}`;

      let pipeline = sharp(buf, { failOn: 'none' }).rotate();
      const meta = await pipeline.metadata();
      if ((meta.width ?? 0) > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, { fit: 'inside', withoutEnlargement: true });
      }
      pipeline = keepAlpha
        ? pipeline.webp({ quality: 90, effort: 5 })
        : pipeline.flatten({ background: '#0f1512' }).jpeg({ quality: 86, mozjpeg: true, progressive: true });

      const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
      await writeFile(join(OUT, outName), data);

      manifest[item.key] = {
        src: `/images/${outName}`,
        width: info.width,
        height: info.height,
        blurDataURL: await blurDataURL(data),
        alt: item.alt ?? '',
      };

      ok++;
      const kb = String(Math.round(data.length / 1024)).padStart(4);
      console.log(`${label}  ${kb} KB  ${info.width}x${info.height}${keepAlpha ? '  (alpha)' : ''}`);
    } catch (err) {
      failed.push({ key: item.key, reason: err.message });
      console.warn(`${label}  FAILED — ${err.message}`);
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`\n${ok}/${SOURCES.length} assets written to public/images`);
  console.log(`manifest -> ${MANIFEST.replace(ROOT, '.')}`);
  if (failed.length) {
    console.log('\nFailed:');
    for (const f of failed) console.log(`  ${f.key} — ${f.reason}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
