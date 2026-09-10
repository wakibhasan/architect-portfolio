import manifest from '@/content/generated/images.json';

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
};

export type ImageKey = keyof typeof manifest;

const IMAGES = manifest as Record<string, ImageAsset>;

/**
 * Look up a harvested asset by key. Dimensions and blurDataURL come from
 * scripts/harvest-images.mjs, so they are never hand-typed and never drift.
 */
export function img(key: ImageKey | string): ImageAsset {
  const asset = IMAGES[key as string];
  if (!asset) {
    throw new Error(
      `Unknown image key "${key}". Add it to scripts/sources.mjs and re-run \`npm run images\`.`,
    );
  }
  return asset;
}

export function imgList(...keys: (ImageKey | string)[]): ImageAsset[] {
  return keys.map((k) => img(k));
}

export const allImageKeys = Object.keys(IMAGES) as ImageKey[];
