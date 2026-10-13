// Builds the social sharing image, public/uploads/og-image.jpg (1200×630,
// MEDIA-12, SEO-04), from the hero scene, the title, the dates and the book
// cover — rendered by headless Chrome so it uses the site's real fonts.
//
// Run it again when the title, the dates or the cover change. Needs Google
// Chrome installed (/usr/bin/google-chrome, or set CHROME=<path>).
//
// Usage: node scripts/build-og-image.mjs

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = (name) => JSON.parse(readFileSync(resolve(root, 'src/data', name), 'utf8'));
const hero = data('hero.json');
const book = data('book.json');
const settings = data('settings.json');

const file = (p) => pathToFileURL(resolve(root, p)).href;
const fraunces = file('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-soft-normal.woff2');
const figtree = file('node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2');
const escape = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// The colours are the palette tokens (src/styles/global.css), repeated here
// because this page lives outside the site and cannot import its CSS.
const html = `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><style>
@font-face { font-family: Fraunces; src: url(${fraunces}) format('woff2'); font-weight: 100 900; }
@font-face { font-family: Figtree; src: url(${figtree}) format('woff2'); font-weight: 300 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #141a33; font-family: Figtree, sans-serif; }
/* mirrored: the moon goes behind the book, away from the title */
.scene { position: absolute; inset: 0; background: url(${file(`public${hero.image}`)}) center 62% / cover; transform: scaleX(-1); }
.veil { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,26,51,.82) 0%, rgba(20,26,51,.55) 52%, rgba(20,26,51,.15) 100%); }
.text { position: absolute; left: 72px; top: 0; bottom: 0; width: 760px; display: flex; flex-direction: column; justify-content: center; }
.eyebrow { color: #fffcf5; font-weight: 700; font-size: 22px; letter-spacing: .04em; opacity: .9; }
h1 { font-family: Fraunces; font-variation-settings: 'SOFT' 100; font-weight: 560; color: #fffcf5; font-size: 100px; line-height: .95; margin-top: 18px; white-space: nowrap; letter-spacing: -.01em; }
.tagline { font-family: Fraunces; font-variation-settings: 'SOFT' 100; font-weight: 560; color: #f7bd63; font-size: 54px; margin-top: 8px; }
.dates { margin-top: 34px; color: #f2a23c; font-weight: 800; font-size: 23px; letter-spacing: .14em; text-transform: uppercase; }
.place { margin-top: 10px; color: #fffcf5; font-size: 22px; opacity: .85; }
.book { position: absolute; right: 86px; top: 64px; width: 300px; }
.book::before { content: ''; position: absolute; inset: -90px -110px; background: radial-gradient(ellipse closest-side, rgba(242,162,60,.55), rgba(242,162,60,.22) 55%, transparent); }
.book img { position: relative; width: 100%; border-radius: 6px; transform: rotate(-3deg); box-shadow: 0 30px 60px rgba(0,0,0,.55); }
</style></head><body>
<div class="scene"></div><div class="veil"></div>
<div class="text">
  <p class="eyebrow">${escape(hero.eyebrow)}</p>
  <h1>${escape(hero.title)}</h1>
  <p class="tagline">${escape(hero.tagline)}</p>
  <p class="dates">${escape(hero.datesLabel.split('·')[0].trim())}</p>
  <p class="place">${escape(settings.venue?.name)} · ${escape(settings.venue?.city)}</p>
</div>
${book.cover ? `<div class="book"><img src="${file(`public${book.cover}`)}" alt=""></div>` : ''}
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const page = join(dir, 'og.html');
writeFileSync(page, html);
const shot = join(dir, 'og.png');
const out = resolve(root, 'public/uploads/og-image.jpg');
execFileSync(
  process.env.CHROME || '/usr/bin/google-chrome',
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=3000',
    `--screenshot=${shot}`,
    pathToFileURL(page).href,
  ],
  { stdio: 'ignore' }
);
// JPEG: a fraction of the PNG's weight, and every social network takes it
await sharp(shot).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
rmSync(dir, { recursive: true, force: true });
console.log(`social image → public/uploads/og-image.jpg`);
