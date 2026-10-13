// Builds the static version of the client manual inside public/ (CMS-12).
//
// The source (docs/manuale-cliente.html) is a fragment: <title>, <style> and
// the page body, without the document wrapper. Here it is wrapped in a full
// HTML page and written to public/, which Astro copies as is.
//
// The page is reachable only by whoever knows the address: it is linked from
// nowhere, carries noindex and stays out of the sitemap (@astrojs/sitemap only
// lists Astro pages). It must not be added to robots.txt: that file is public
// and would reveal the path (CMS-13).
//
// Usage: npm run manual

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SOURCE = resolve(root, 'docs/manuale-cliente.html');
const PATH = 'manuale-lnt-4c9e'; // not guessable
const TARGET = resolve(root, 'public', PATH, 'index.html');

const fragment = readFileSync(SOURCE, 'utf8');

// Everything up to </style> is the document head, the rest is the body
const end = fragment.indexOf('</style>');
if (end === -1) {
  throw new Error('The manual has no <style> block: unexpected structure.');
}
const head = fragment.slice(0, end + '</style>'.length).trim();
const body = fragment.slice(end + '</style>'.length).trim();

const page = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${head}
</head>
<body>
${body}
</body>
</html>
`;

mkdirSync(dirname(TARGET), { recursive: true });
writeFileSync(TARGET, page);

console.log(`manual built → /${PATH}/  (${(page.length / 1024).toFixed(0)} KB)`);
