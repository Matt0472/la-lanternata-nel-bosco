# 🏮 La Lanternata al chiaro di luna — Landing page

One-page della Lanternata al chiaro di luna del [Bosco della Luna](https://www.boscodellaluna.it):
7–8 e 14–15 novembre 2026, laboratorio della lanterna, lettura animata di «Il richiamo delle
lanterne» di Roberta Mari (Gruppo Albatros Il Filo), passeggiata nel bosco e caccia al tesoro.

Stack: **Astro 7** (sito statico) + **Tailwind 4** + **Motion** e **Lenis** (animazioni e scroll).
Contenuti gestiti via **Pages CMS**, biglietteria **TicketingHub**, modulo con **Web3Forms** (+ hCaptcha).
Repository **`Matt0472/la-lanternata-nel-bosco`**: ogni push su `main` va in produzione su
**https://lanternata.it** (Cloudflare Pages). Vedi «Come va online».

Le regole del progetto stanno in [`docs/standards/`](docs/standards/README.md); la guida per Claude Code
in [`CLAUDE.md`](CLAUDE.md); lo stato del lavoro in [`docs/in-development/HANDOFF.md`](docs/in-development/HANDOFF.md).

## Sviluppo locale

Serve **Node 22** (è scritto in `.nvmrc`; se il default di sistema è un altro: `nvm use`).

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # build di produzione in dist/
```

`dev` e `build` generano prima due cose, entrambe fuori da git: il manuale del cliente
(`npm run manual`) e le miniature WebP della gallery (`npm run thumbnails`, 640px, in
`public/uploads/thumbnails/`).

Le build in locale sono **`noindex`**: il sito è indicizzabile solo con `PUBLIC_SITE_INDEXABLE=true`,
che è impostato nelle variabili di Production di Cloudflare. Lo leggono il meta robots e `robots.txt`,
generato da `src/pages/robots.txt.ts`.

## Come va online

- **Ogni push su `main` va in produzione.** Cloudflare Pages (progetto `la-lanternata-nel-bosco`,
  account dell'utente) è collegato al repository: a ogni push fa `npm run build` e pubblica `dist/` in
  circa un minuto. L'esito si vede sul commit in GitHub, nel check «Cloudflare Pages». Non c'è un
  ambiente di prova: quello che arriva su `main` lo vedono subito le famiglie, biglietteria compresa.
- **Anche i salvataggi da Pages CMS sono commit su `main`**: prima di lavorare in locale, `git pull`.
- **Nel pannello Cloudflare, non nel repository:**
  - variabili di Production `PUBLIC_SITE_INDEXABLE=true` (l'interruttore dell'indicizzazione) e
    `NODE_VERSION=22`;
  - DNS del dominio (registrato su register.it, nameserver Cloudflare) e HTTPS;
  - **www → dominio principale**: Redirect Rule «www → lanternata.it» (301, con percorso e
    parametri);
  - Bot Preference Sync **spento**: `robots.txt` lo scrive solo il sito;
  - crawler AI **ammessi**: «Block AI bots» disattivato e tutti i crawler su *Allow* in AI Crawl
    Control, così gli assistenti (ChatGPT, Claude, Perplexity…) possono leggere la pagina.
- **Search Console** (proprietà di dominio `lanternata.it`) e **Bing Webmaster Tools**, sitemap
  `https://lanternata.it/sitemap-index.xml`.
- **IndexNow** (Bing, Yandex e altri; Google no). La chiave è pubblicata in
  `public/5db542ba5f289263d0acaf5f1d211286.txt`, che deve contenere solo la chiave. La GitHub Action
  `.github/workflows/indexnow.yml` scatta a ogni push su `main` che tocca il sito, aspetta che il check
  «Cloudflare Pages» sia verde e segnala la home. Per mandarla a mano:

  ```bash
  curl -i "https://api.indexnow.org/indexnow?url=https://lanternata.it/&key=5db542ba5f289263d0acaf5f1d211286"
  ```

Se il dominio cambiasse: `SITE_URL` in `astro.config.mjs`, `PAGE_URL` in
`.github/workflows/indexnow.yml`, i domini del progetto Cloudflare e le proprietà di Search Console e
Bing.

## Asset

- **Scene dell'hero** (SVG, desktop 16:9 e telefono 9:16): `node scripts/generate-hero.mjs`. Bosco
  procedurale con seme fisso: si ritocca cambiando i numeri nello script.
- **Immagine social** (`public/uploads/og-image.jpg`, 1200×630): `node scripts/build-og-image.mjs`,
  con Chrome headless e i font del sito. Va rifatta se cambiano titolo, date o copertina.
- **Illustrazioni** con Gemini (Google AI Studio):

  ```bash
  node scripts/generate-image.mjs --name gufetto --out <cartella> --cutout --scene "A cute baby owl…"
  ```

  Lo script aggiunge da solo lo stile di casa (albo illustrato notturno, luce delle lanterne) e con
  `--cutout` toglie lo sfondo bianco, salvando anche l'originale. Serve la chiave nel file `.env`
  (`GOOGLE_AI_STUDIO_KEY`, fuori da git) e il billing attivo sul progetto Google.
- **Copertina del libro**: dalla scheda dell'editore, solo convertita in WebP. Non si ritocca.
- **Favicon**: si disegna in `public/favicon.svg`; `node scripts/build-favicons.mjs` ne ricava
  `favicon.ico`, `icon-192.png` (l'icona che Google mostra accanto al risultato) e
  `apple-touch-icon.png`.

## Struttura

- `src/data/*.json` — **tutti i contenuti editabili**, un file per sezione, nell'ordine della pagina.
- `src/pages/privacy.md`, `src/pages/cookie.md` — i testi legali, editabili dal pannello.
- `src/components/*.astro` — le sezioni, nell'ordine in cui compaiono in `src/pages/index.astro`.
- `src/layouts/Base.astro` — `<head>`, meta SEO e dati strutturati (Event con prezzi, orario e un
  sotto-evento per weekend, Book per il libro), ricavati tutti dai JSON.
- `src/scripts/` — `animations.js` (reveal on-scroll, parallax, Lenis; rispetta
  `prefers-reduced-motion`) e `consent.ts` (banner cookie).
- `.pages.yml` — configurazione del pannello (Pages CMS).
- `docs/manuale-cliente.html` — sorgente del manuale del cliente, pubblicato su un percorso non
  indovinabile, non collegato e `noindex` (mai in `robots.txt`).
- `public/_headers` — solo regole di cache. **Non deve mai contenere un `noindex`**.

## Servizi esterni

- **TicketingHub** — nel pannello si cambia solo il codice del widget (`widgetId` in `tickets.json`).
  Il pulsante è nostro, lo script di TicketingHub si limita ad agganciarlo e parte solo dopo il
  consenso ai cookie della biglietteria.
- **Web3Forms** — account della Lanternata; l'access key sta in `settings.json` (`web3formsKey`). hCaptcha viene caricato solo
  alla prima interazione col modulo.
