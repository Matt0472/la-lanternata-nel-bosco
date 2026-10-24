// Builds the raster versions of the favicon (MEDIA-09) from public/favicon.svg:
// - favicon.ico (16, 32 and 48 px): the address many crawlers and old browsers
//   ask for on their own, whatever the page declares;
// - icon-192.png: a size multiple of 48, as Google asks for the icon it shows
//   next to the result;
// - apple-touch-icon.png (180 px, square corners: iOS rounds them itself, and
//   transparent corners would turn black on the home screen).
//
// Run it again whenever favicon.svg changes.
//
// Usage: node scripts/build-favicons.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (name) => resolve(root, 'public', name);
const svg = readFileSync(pub('favicon.svg'), 'utf8');
// the same drawing on a full square tile, for the home screen icon
const squareSvg = svg.replace(/(<rect width="64" height="64") rx="[\d.]+"/, '$1');

const png = (source, size) => sharp(Buffer.from(source), { density: 72 * (size / 64) * 4 }).resize(size, size).png().toBuffer();

// An .ico is a small directory of images; modern ones can hold PNG data as is
const ico = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
};

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, data: await png(svg, size) })));
writeFileSync(pub('favicon.ico'), ico(images));
writeFileSync(pub('icon-192.png'), await png(svg, 192));
writeFileSync(pub('apple-touch-icon.png'), await png(squareSvg, 180));
console.log('favicons → public/favicon.ico, icon-192.png, apple-touch-icon.png');
