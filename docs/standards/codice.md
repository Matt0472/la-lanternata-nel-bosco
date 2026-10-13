# Codice — `CODE-`

## Lingua

- **CODE-01** — **Il codice è interamente in inglese**: variabili, funzioni, componenti, file, cartelle,
  classi CSS, chiavi dei JSON e **tutti i commenti**. In italiano c'è solo ciò che vede l'utente, e
  quello sta nei dati (`CMS-01`) o è microcopy d'interfaccia (`CMS-02`). Il sito gemello ha codice e
  commenti in italiano: quando se ne porta un pezzo, si traduce.

## Stack e struttura

- **CODE-02** — **Astro statico**: nessun adapter SSR, `astro build` produce HTML statico per
  Cloudflare Pages. **Tailwind CSS v4 via `@tailwindcss/vite`** (non l'integrazione Astro, nessun
  `tailwind.config`): prima di scrivere una utility, verificare la sintassi v4.
- **CODE-03** — Struttura (one-page, come il gemello):

  ```
  src/components/  una sezione per file, nell'ordine di src/pages/index.astro,
                   più i pezzi condivisi (Icon, Divider, SectionHeading, BackToTop)
  src/layouts/     Base (head, meta, JSON-LD) e LegalPage (privacy, cookie)
  src/pages/       index, 404, privacy.md, cookie.md, robots.txt.ts
  src/data/        contenuti JSON (Pages CMS), uno per sezione
  src/scripts/     script client condivisi (animazioni, consenso)
  src/styles/      stili globali e token (@theme)
  scripts/         script di build e di servizio (manuale, miniature, immagini AI)
  docs/            canone, manuale cliente (sorgente), handoff, audit
  public/uploads/  media del cliente
  ```

- **CODE-04** — Un pezzo si estrae in un componente condiviso **quando si riusa**, non prima: niente
  astrazioni per un uso solo. Un piccolo helper duplicato in due componenti va bene fino al terzo uso.
- **CODE-05** — **Imita il codice che c'è.** Prima di scrivere, trova il componente più simile — in
  questo repo o nel sito gemello `../bosco-della-luna-campo-di-zucche` — e replicane struttura, nomi e
  stile. Il codice nuovo deve essere indistinguibile da quello esistente.

## Stile

- **CODE-06** — **Solo token.** Colori, font ed easing vengono da `@theme` in `src/styles/global.css`;
  i componenti usano le utility di Tailwind generate dai token (`bg-night`, `text-lantern-deep`) o le
  variabili (`var(--color-night)`), **mai un hex o un valore magico**. Eccezioni ammesse e commentate:
  i colori dentro le illustrazioni SVG inline (sono disegni, non interfaccia) e i colori di marchi
  terzi (il logo Google del badge recensioni).
- **CODE-07** — Animazioni solo su **`transform` e `opacity`**. Unica eccezione ammessa: `height`
  nell'apertura delle FAQ (Web Animations API, breve e solo al clic). Non combinare la proprietà `rotate` con un `transform: translate` sullo stesso
  elemento: l'ordine si inverte e l'elemento orbita invece di girare sul posto. Ogni animazione non
  essenziale si spegne con `prefers-reduced-motion` (`A11Y-07`).
- **CODE-19** — Le animazioni **guidate dallo scroll** in CSS (`animation-timeline`) si scrivono solo
  con le **proprietà estese**, mai con la scorciatoia `animation`: il minifier la fonde con la timeline
  in una dichiarazione che Chrome scarta, e l'animazione sparisce solo nella build. Dopo averle toccate
  si controlla `dist/`.

## JavaScript client

- **CODE-08** — JS minimo e **vanilla**: uno `<script>` nel componente che ne ha bisogno, nessun
  runtime di framework UI (React, Vue…). Nessuno script da CDN: le librerie sono dipendenze npm.
  Le uniche eccezioni sono gli script delle terze parti, caricati a richiesta (`CODE-09`).
- **CODE-09** — **Terze parti solo dopo il consenso o l'interazione**: lo script di TicketingHub parte
  solo con il consenso alla categoria "biglietteria" (vanilla-cookieconsent, `src/scripts/consent.ts`,
  blocco preventivo in `Tickets.astro`); hCaptcha di Web3Forms solo alla prima interazione con il
  modulo contatti. I loro ID sono campi del CMS (`CMS-11`).
- **CODE-10** — **Scroll**: Lenis è globale (`src/scripts/animations.js`) ed esposto su
  `window.lenis`. Lo scroll programmatico passa da `window.lenis.scrollTo(...)` quando Lenis c'è (un
  `window.scrollTo` smooth viene annullato), con il ripiego nativo quando non c'è (reduced motion).
  Un listener di `scroll` fa al massimo un `requestAnimationFrame` per frame; dove basta,
  `IntersectionObserver`.
- **CODE-11** — Il **contenuto sopra la piega non aspetta il JavaScript**: le entrate dell'hero sono
  animazioni CSS (`data-animate-now`), quelle sotto la piega passano da Motion (`data-animate`). Senza
  JS o con reduced motion, tutto è visibile.

## Dipendenze

- **CODE-12** — Una dipendenza entra solo se serve davvero; prima di importare, controlla
  `package.json`. In uso: **astro**, **@astrojs/sitemap**, **tailwindcss** + **@tailwindcss/vite**,
  **motion**, **lenis**, **vanilla-cookieconsent**, **@fontsource-variable/fraunces** e
  **@fontsource-variable/figtree**, **sharp** (dev). Qualunque altra si propone prima di aggiungerla.
- **CODE-13** — Node **≥ 22** (versione in `.nvmrc`): con Node 20 il build fallisce. Un lavoro non è
  finito finché `npm run build` non passa.

## Configurazione in un punto solo

- **CODE-14** — **Dominio**: solo la costante `SITE_URL` in `astro.config.mjs` (override con env
  `SITE_URL` per le anteprime). Canonical, Open Graph, JSON-LD, sitemap e `robots.txt` la leggono da
  `Astro.site`. Non è un campo del CMS: cambiare dominio è una modifica delicata (`GIT-07`).
- **CODE-15** — **Indicizzabilità**: un solo flag di build, `PUBLIC_SITE_INDEXABLE` (`SEO-10`). Lo
  leggono `Base.astro` (meta robots) e `robots.txt.ts`, nessun altro.
- **CODE-16** — I **segreti** stanno solo in `.env` (gitignored); il codice li legge, non li contiene
  (`GIT-04`). L'access key di Web3Forms e il codice del widget TicketingHub non sono segreti: sono
  pubblici per costruzione e stanno nel CMS.

## Commenti e pulizia

- **CODE-17** — Commenti con la **densità del codice intorno**, e che dicono il **perché**, non il
  cosa. Mai date, riferimenti alla conversazione o al cliente ("come chiesto il 13 ott"): quelli vanno
  in `docs/in-development/HANDOFF.md` o nel canone. Le misure che giustificano una scelta (KB, ms) si
  scrivono senza data.
- **CODE-18** — Niente codice commentato, `console.log` di debug, file di prova o import inutilizzati.
