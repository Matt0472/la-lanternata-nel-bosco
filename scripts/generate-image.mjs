// Generates illustrations with the Gemini image API (Google AI Studio), adding
// the Lanternata house style on its own (MEDIA-05): whoever runs it describes
// only the subject. Same method as the sister site.
//
// Needs the AIza… key in .env (outside git), in a GOOGLE_AI_STUDIO_* or
// GEMINI_API_KEY variable. The Google project must have billing enabled: the
// image models are not part of the free tier.
//
// Usage:
//   node scripts/generate-image.mjs --name mascot --scene "A cute baby owl…" --cutout
//   options: --ratio 1:1 (default) · --out <folder> (default public/uploads)
//            --draft (cheaper model) · --model <id>
//            --cutout: removes the white background and saves a transparent PNG
//                      (the untouched original stays next to it)
//
// The key is never printed, not even in error messages.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dns from 'node:dns';
import sharp from 'sharp';

// fetch to Google times out over IPv6 on this network
dns.setDefaultResultOrder('ipv4first');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// --- House style: appended to every subject ----------------------------------
const STYLE =
  "Children's picture-book cartoon illustration, cosy bedtime-story mood: soft, slightly irregular " +
  'night-blue outlines (#141a33), flat colors with a subtle hand-painted texture, limited palette of ' +
  'night blue (#232c52), moonlit cream (#f6f1e6), warm lantern amber (#f2a23c) and a touch of forest ' +
  'green (#3f5b47). The warm light of the lantern is the brightest thing in the picture. Sweet and ' +
  'friendly, never scary, suitable for toddlers.';
const AVOID =
  'No text, no letters, no logos, no watermark, no frame, no border, no ground, no cast shadow, no scenery. ' +
  'The character is isolated on a pure flat white background (#FFFFFF). Not 3D, not photorealistic.';

// --- Arguments ---------------------------------------------------------------
const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--draft' || a === '--cutout') args[a.slice(2)] = true;
  else if (a.startsWith('--')) args[a.slice(2)] = argv[++i];
}
if (!args.name || !args.scene) {
  console.error('Missing --name or --scene');
  process.exit(1);
}
const ratio = args.ratio || '1:1';
const outDir = resolve(root, args.out || 'public/uploads');
const model = args.model || (args.draft ? 'gemini-2.5-flash-image' : 'gemini-3-pro-image');

// --- Key (never printed) -----------------------------------------------------
const line = readFileSync(resolve(root, '.env'), 'utf8')
  .split('\n')
  .find((l) => /^(GOOGLE_AI_STUDIO\w*|GEMINI_API_KEY)=/.test(l));
if (!line) {
  console.error('API key not found in .env');
  process.exit(1);
}
const key = line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');

// --- Request -----------------------------------------------------------------
const body = {
  contents: [{ parts: [{ text: `${args.scene} ${STYLE} ${AVOID}` }] }],
  generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: ratio } },
};

const t0 = Date.now();
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
);
const seconds = ((Date.now() - t0) / 1000).toFixed(1);
if (!res.ok) {
  console.error(`HTTP ${res.status} — ${(await res.text()).replaceAll(key, '***').slice(0, 400)}`);
  process.exit(1);
}
const data = await res.json();
const img = (data?.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data);
if (!img) {
  console.error('No image in the response');
  process.exit(1);
}
let buf = Buffer.from(img.inlineData.data, 'base64');
mkdirSync(outDir, { recursive: true });

// --- Cutout: remove the white background, from the edges inwards ------------
// Flood fill starting from the borders: only the white connected to the
// outside goes, so the white INSIDE the character (eyes, highlights) stays.
// On the boundary the alpha is the average of the 3×3 neighbours, so the edge
// is not jagged. Everything on a single RGBA buffer.
async function cutout(input) {
  const { data: px, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const light = (p) => px[p * 4] > 232 && px[p * 4 + 1] > 232 && px[p * 4 + 2] > 232;
  const gone = new Uint8Array(w * h);
  const queue = [];
  for (let x = 0; x < w; x++) queue.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) queue.push(y * w, y * w + w - 1);
  while (queue.length) {
    const p = queue.pop();
    if (gone[p] || !light(p)) continue;
    gone[p] = 1;
    const x = p % w;
    if (x > 0) queue.push(p - 1);
    if (x < w - 1) queue.push(p + 1);
    if (p >= w) queue.push(p - w);
    if (p < w * (h - 1)) queue.push(p + w);
  }
  const out = Buffer.from(px);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (gone[p]) {
        out[p * 4 + 3] = 0;
        continue;
      }
      let kept = 0;
      let total = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          total += 1;
          if (!gone[yy * w + xx]) kept += 1;
        }
      }
      out[p * 4 + 3] = Math.round((255 * kept) / total);
    }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).trim().png().toBuffer();
}

let ext = (img.inlineData.mimeType || 'image/png').split('/')[1];
if (args.cutout) {
  // the original stays next to it, to redo the cutout without regenerating
  writeFileSync(resolve(outDir, `${args.name}-original.${ext}`), buf);
  buf = await cutout(buf);
  ext = 'png';
}
const out = resolve(outDir, `${args.name}.${ext}`);
writeFileSync(out, buf);
console.log(`${args.name} — ${model} — ${ratio} — ${seconds}s — ${(buf.length / 1024).toFixed(0)} KB — ${out}`);
