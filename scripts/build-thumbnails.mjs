// Builds the WebP thumbnails of the gallery photos in public/uploads/thumbnails/.
//
// The fan carousel shows cards at most 16rem (256 CSS px) wide: serving the
// original JPEGs there wastes megabytes. Thumbnails are 640px wide — twice the
// largest card, so retina displays stay sharp even with the hover zoom — in
// WebP quality 75 (compared on screen at double size with 80 and 70:
// indistinguishable). The lightbox keeps using the original (data-full).
//
// The client's flow does not change: they upload the photo from the panel as
// usual, the thumbnail is born at the next build. Thumbnails are not committed
// (they are in .gitignore): every build regenerates them, on Cloudflare too.
//
// Usage: npm run thumbnails   (runs on its own before dev and build)

import { readFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const WIDTH = 640;
const QUALITY = 75;
const TARGET = resolve(root, 'public/uploads/thumbnails');

const gallery = JSON.parse(readFileSync(resolve(root, 'src/data/gallery.json'), 'utf8'));
const photos = (gallery.images ?? []).map((i) => i.src).filter(Boolean);

mkdirSync(TARGET, { recursive: true });

let built = 0;
let skipped = 0;

for (const src of photos) {
  if (!src.startsWith('/uploads/')) continue; // external images: not ours
  const source = resolve(root, 'public', src.slice(1));
  if (!existsSync(source)) {
    console.warn(`thumbnails: missing source, skipping ${src}`);
    continue;
  }
  const out = resolve(TARGET, basename(src, extname(src)) + '.webp');

  // incremental: rebuilt only when the photo is newer than its thumbnail
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(source).mtimeMs) {
    skipped += 1;
    continue;
  }

  await sharp(source).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
  built += 1;
}

console.log(`gallery thumbnails → /uploads/thumbnails/  (${built} built, ${skipped} up to date)`);
