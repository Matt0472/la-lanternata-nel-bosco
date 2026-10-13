// Generates the hero night scenes as SVG: public/uploads/hero-bg.svg (16:9) and
// public/uploads/hero-bg-mobile.svg (9:16).
//
// The forest is procedural — three depths of tree silhouettes, lighter and
// bluer with distance — so the scene stays light (one path per depth) and can
// be re-tuned by changing numbers here instead of redrawing by hand. The
// randomness is seeded: the same script always draws the same forest.
//
// Usage: node scripts/generate-hero.mjs

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Colours of the drawing (an illustration, not interface: CODE-06). They are
// the palette's night, darkened or lifted by depth.
const SKY = ['#090d22', '#141b42', '#252c5e', '#43406f'];
const FAR = '#2b3466';
const MID = '#1b2350';
const NEAR = '#0d1229';
const PATH = '#1f2754';
const MOON = '#f7efd8';
const CRATER = '#e8dcbc';
const LIGHT = '#ffd98e';

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const r1 = (n) => Math.round(n);

// A three-tier fir, drawn as one closed polygon with a little jitter on the
// corners so the outline feels hand cut rather than ruled.
function fir(rnd, x, base, h) {
  const top = base - h;
  const tiers = [
    { b: 0.38, w: 0.16 },
    { b: 0.68, w: 0.25 },
    { b: 0.98, w: 0.34 },
  ];
  const j = () => (rnd() - 0.5) * h * 0.03;
  const trunk = Math.max(2, h * 0.035);
  const right = [];
  tiers.forEach((t, i) => {
    right.push([x + t.w * h + j(), top + t.b * h + j()]);
    if (i < tiers.length - 1) right.push([x + t.w * h * 0.42, top + t.b * h - h * 0.04]);
  });
  // the lowest tier reaches the ground: a strip of bare trunks along the
  // baseline read as a dashed line at hero size
  right.push([x + trunk, top + 0.98 * h], [x + trunk, base]);
  const left = right.map(([px, py]) => [2 * x - px, py]).reverse();
  const pts = [[x, top], ...right, ...left];
  return 'M' + pts.map(([px, py]) => `${r1(px)} ${r1(py)}`).join('L') + 'Z';
}

// A round broad-leaved tree: a few overlapping discs on a short trunk. Every
// shape is drawn clockwise: with the default nonzero fill, a shape wound the
// other way would punch a hole where it overlaps its neighbours.
function roundTree(rnd, x, base, h) {
  const r = h * 0.3;
  const cy = base - h + r;
  const disc = (cx, cyy, rr) => `M${r1(cx - rr)} ${r1(cyy)}a${r1(rr)} ${r1(rr)} 0 1 1 ${r1(2 * rr)} 0a${r1(rr)} ${r1(rr)} 0 1 1 ${r1(-2 * rr)} 0Z`;
  const t = Math.max(2, h * 0.05);
  return (
    disc(x, cy, r) +
    disc(x - r * 0.7, cy + r * 0.45, r * (0.7 + rnd() * 0.15)) +
    disc(x + r * 0.7, cy + r * 0.4, r * (0.7 + rnd() * 0.15)) +
    `M${r1(x - t)} ${r1(cy + r)}H${r1(x + t)}V${r1(base)}H${r1(x - t)}Z`
  );
}

// One depth of forest: trees along a wavy baseline plus the ground below it.
function forestLayer({ rnd, width, height, base, wave, minH, maxH, gap, roundShare = 0.25, clearing, edgeBoost = 0 }) {
  const y = (x) => base + wave.a * Math.sin(x / wave.l + wave.p) + wave.a * 0.4 * Math.sin(x / (wave.l * 0.37));
  let d = '';
  for (let x = -gap[1]; x < width + gap[1]; x += gap[0] + rnd() * (gap[1] - gap[0])) {
    const edge = Math.abs(x - width / 2) / (width / 2);
    if (clearing && Math.abs(x - clearing.x) < clearing.w && rnd() > clearing.keep) continue; // keep = share of trees left standing in the clearing
    const h = (minH + rnd() * (maxH - minH)) * (1 + edgeBoost * edge * edge);
    d += rnd() < roundShare ? roundTree(rnd, x, y(x) + 4, h * 0.75) : fir(rnd, x, y(x) + 4, h);
  }
  // ground: follow the baseline, then close along the bottom edge
  const pts = [];
  for (let x = 0; x <= width; x += width / 48) pts.push(`${r1(x)} ${r1(y(x))}`);
  d += `M0 ${height}L${pts.join('L')}L${width} ${height}Z`;
  return d;
}

function stars(rnd, width, skyBottom, moon, count) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = rnd() * width;
    const y = rnd() * skyBottom;
    if (Math.hypot(x - moon.x, y - moon.y) < moon.r * 2.6) continue;
    const r = 0.8 + rnd() * 1.8;
    const o = (0.35 + rnd() * 0.6).toFixed(2);
    out += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r.toFixed(1)}" opacity="${o}"/>`;
  }
  return `<g fill="${MOON}">${out}</g>`;
}

// Lanterns carried along a path: a warm glow and a bright core, smaller and
// dimmer with distance (t = 0 far, t = 1 near).
function lanterns(points) {
  return points
    .map(([x, y, t]) => {
      const core = 2.5 + t * 6;
      const glow = 12 + t * 40;
      return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(glow)}" fill="url(#glow)" opacity="${(0.55 + t * 0.45).toFixed(2)}"/><circle cx="${r1(x)}" cy="${r1(y - core * 0.2)}" r="${core.toFixed(1)}" fill="${LIGHT}"/>`;
    })
    .join('');
}

function scene(cfg) {
  const rnd = seeded(cfg.seed);
  const { width: W, height: H, moon } = cfg;
  const far = forestLayer({ rnd, width: W, height: H, ...cfg.far });
  const mid = forestLayer({ rnd, width: W, height: H, ...cfg.mid });
  const near = forestLayer({ rnd, width: W, height: H, ...cfg.near });
  const craters = [
    [-0.3, -0.25, 0.18],
    [0.28, 0.2, 0.14],
    [0.12, -0.45, 0.09],
    [-0.38, 0.32, 0.08],
  ]
    .map(([dx, dy, rr]) => `<circle cx="${r1(moon.x + dx * moon.r)}" cy="${r1(moon.y + dy * moon.r)}" r="${r1(rr * moon.r)}"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${SKY[0]}"/><stop offset="0.45" stop-color="${SKY[1]}"/><stop offset="0.72" stop-color="${SKY[2]}"/><stop offset="0.9" stop-color="${SKY[3]}"/>
</linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="${MOON}" stop-opacity="0.34"/><stop offset="0.35" stop-color="${MOON}" stop-opacity="0.12"/><stop offset="1" stop-color="${MOON}" stop-opacity="0"/></radialGradient>
<radialGradient id="dusk"><stop offset="0" stop-color="#e3976b" stop-opacity="0.26"/><stop offset="1" stop-color="#e3976b" stop-opacity="0"/></radialGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${LIGHT}" stop-opacity="0.75"/><stop offset="0.3" stop-color="#f2a23c" stop-opacity="0.32"/><stop offset="1" stop-color="#f2a23c" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<ellipse cx="${cfg.dusk.x}" cy="${cfg.dusk.y}" rx="${cfg.dusk.rx}" ry="${cfg.dusk.ry}" fill="url(#dusk)"/>
${stars(rnd, W, cfg.skyBottom, moon, cfg.stars)}
<circle cx="${moon.x}" cy="${moon.y}" r="${moon.r * 5.5}" fill="url(#halo)"/>
<circle cx="${moon.x}" cy="${moon.y}" r="${moon.r}" fill="${MOON}"/>
<g fill="${CRATER}" opacity="0.7">${craters}</g>
<path fill="${FAR}" d="${far}"/>
${lanterns(cfg.farLights)}
<path fill="${MID}" d="${mid}"/>
<path fill="${NEAR}" d="${near}"/>
<path fill="${PATH}" d="${cfg.path}"/>
${lanterns(cfg.pathLights)}
</svg>
`;
}

// Points along a quadratic curve, for lanterns that follow the path
const along = (p0, p1, p2, n, t0 = 0, t1 = 1) =>
  Array.from({ length: n }, (_, i) => {
    const t = t0 + ((t1 - t0) * i) / (n - 1);
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
    return [x, y, i / (n - 1)];
  });

const desktop = scene({
  seed: 7,
  width: 1920,
  height: 1080,
  skyBottom: 640,
  stars: 80,
  moon: { x: 430, y: 230, r: 74 },
  dusk: { x: 1500, y: 700, rx: 1000, ry: 250 },
  far: { base: 690, wave: { a: 22, l: 260, p: 0.6 }, minH: 40, maxH: 95, gap: [15, 27], roundShare: 0.15 },
  mid: { base: 820, wave: { a: 26, l: 330, p: 2.1 }, minH: 90, maxH: 190, gap: [24, 46], roundShare: 0.3 },
  near: {
    base: 1040,
    wave: { a: 18, l: 420, p: 1.2 },
    minH: 150,
    maxH: 260,
    gap: [46, 90],
    roundShare: 0.25,
    clearing: { x: 1000, w: 560, keep: 0 },
    edgeBoost: 1.6,
  },
  // a pale path winding from the lower right into the middle of the forest
  path: 'M1490 1080C1450 1010 1330 980 1300 930C1270 885 1335 860 1300 828L1272 828C1292 862 1225 890 1245 935C1268 985 1360 1020 1380 1080Z',
  pathLights: along([1290, 840], [1250, 930], [1440, 1050], 7),
  farLights: [
    [1180, 760, 0.05],
    [1225, 772, 0.08],
  ],
});

const mobile = scene({
  seed: 11,
  width: 1080,
  height: 1920,
  skyBottom: 1150,
  stars: 70,
  moon: { x: 300, y: 380, r: 92 },
  dusk: { x: 760, y: 1240, rx: 700, ry: 240 },
  far: { base: 1230, wave: { a: 26, l: 200, p: 0.3 }, minH: 50, maxH: 110, gap: [15, 27], roundShare: 0.15 },
  mid: { base: 1420, wave: { a: 30, l: 260, p: 1.7 }, minH: 120, maxH: 240, gap: [26, 50], roundShare: 0.3 },
  near: {
    base: 1790,
    wave: { a: 22, l: 300, p: 0.9 },
    minH: 220,
    maxH: 360,
    gap: [50, 96],
    roundShare: 0.25,
    clearing: { x: 580, w: 300, keep: 0.1 },
    edgeBoost: 1.4,
  },
  path: 'M700 1920C660 1820 560 1760 560 1660C560 1560 640 1520 600 1440L568 1440C590 1520 515 1560 515 1660C515 1760 590 1830 600 1920Z',
  pathLights: along([590, 1455], [520, 1640], [660, 1860], 7),
  farLights: [
    [760, 1300, 0.05],
    [810, 1312, 0.08],
  ],
});

for (const [name, svg] of [
  ['hero-bg.svg', desktop],
  ['hero-bg-mobile.svg', mobile],
]) {
  writeFileSync(resolve(root, 'public/uploads', name), svg);
  console.log(`${name}: ${(svg.length / 1024).toFixed(1)} KB`);
}
