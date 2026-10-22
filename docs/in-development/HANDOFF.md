# HANDOFF — La Lanternata al chiaro di luna

Aggiornato: **22 ott 2026**: orario 16:00–18:30, niente "serata" nei testi (`COPY-10`), tolti i mercatini, libro in vendita sul posto con firma copie dell'autrice in tutte le date, con la Libreria Mariclò (info, libro, FAQ), nuova biografia dell'autrice, lanterne accese raccontate con stupore (`COPY-08`), sezione `#come-si-svolge`.
Prima, **20 ott 2026**: date spostate a **7–8 e 14–15 novembre** (su richiesta dell'utente), stesso turno 15:30–18:30. Riscritti il sottotitolo dell'hero e i testi della lettura; le lanterne non sono più «una sorpresa» (`COPY-08`): i bambini ritrovano la loro, asciutta.
Prima: anteprima online in HTTPS (13 ott), età e prezzi, Instagram dell'autrice, footer sui tablet, riga sottile sui bordi tolta.

## Obiettivo

**Il sito.** One-page della **Lanternata al chiaro di luna**, evento per famiglie del Bosco della Luna
(via Cusago 280, Milano): **7–8 e 14–15 novembre 2026**, un turno al giorno **16:00–18:30**.
Laboratorio della lanterna, lettura animata di «Il richiamo delle lanterne» (Roberta Mari, Gruppo
Albatros Il Filo), lanterne che si ritrovano accese, passeggiata al chiaro di luna, caccia al tesoro,
libro in vendita e firma copie dell'autrice con la Libreria Mariclò.

**Obiettivi di business:** 1) vendere i posti (TicketingHub); 2) far conoscere il libro e il suo
messaggio, venderne qualche copia.

**Vincoli.** Stesso lavoro del sito gemello `../bosco-della-luna-campo-di-zucche`, con stile suo e
**più snello** (niente video, `DES-10`). Regole in `docs/standards/`, indice in `CLAUDE.md`.

## Stato attuale

- **Repo:** `Matt0472/la-lanternata-nel-bosco` (pubblico), branch `main`.
  **Anteprima** su GitHub Pages: **https://lanternata-anteprima.mapped-dev.it** (`noindex`, HTTPS
  obbligatorio attivo dal 13 ott 2026), pubblicata a ogni push da `.github/workflows/pages.yml`. DNS su
  register.it: CNAME `lanternata-anteprima` → `matt0472.github.io.`. Pages CMS e hosting di
  produzione **non ancora creati**.
- **Push:** da questa rete l'SSH verso GitHub va in timeout (porte 22 e 443). Si pubblica via HTTPS
  con le credenziali di `gh` (che ora ha lo scope `workflow`):
  `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push https://github.com/Matt0472/la-lanternata-nel-bosco.git main`.
- **Canone e team** sul modello di softairmilano: `CLAUDE.md`, `docs/standards/*` (10 file, con
  `copy.md` per il libro e il tono), `design-system/lanternata/MASTER.md`, 9 agenti in
  `.claude/agents/` (gli 8 di softairmilano + `copy-specialist`), skill `ship`, `audit`, `handoff`,
  `coding-standards`. **Gli agenti si caricano dalla prossima sessione**: in quella di creazione le
  revisioni sono state fatte da agenti generici che leggevano la scheda dello specialista.
- **Sito completo in locale**, build verde (Node 22). Sezioni (`src/pages/index.astro`): Hero ·
  L'esperienza (pila di card) · La serata (date dei due weekend con badge + timeline) · Il libro ·
  I più piccoli · Foto · Info pratiche · Biglietti · Recensioni · FAQ · Contatti. Più 404, privacy,
  cookie, `robots.txt` generato, manuale cliente (`docs/manuale-cliente.html`, 24 capitoli).
- **Revisioni del 13 ott** (codice, copy, CMS a tre vie, accessibilità nel browser, design): applicate.
  Restano solo gli avvisi elencati in *Prossimi passi*.
- **Verificato il 13 ott** sulla build: nessun overflow a 320, 375, 390, 768, 1440; CTA dell'hero sopra
  la piega anche a 320×568. **axe-core: 0 violazioni** (1440, e 390 con reduced motion). **Lighthouse
  mobile, mediana di 3: Performance 98 · Accessibility 100 · Best Practices 100 · LCP 2,25 s · CLS 0 ·
  TBT 0**; SEO 69 solo per il `noindex` voluto (`SEO-10`).
- **Dati strutturati**: `Event` con offerte per prezzo, orario, un `subEvent` per weekend (disponibilità
  dagli interruttori), `workPerformed` → `Book`; `FAQPage` (con «Quanto costa?»).

## In attesa del cliente

- **Mascotte** `public/uploads/gufetto-piccoli.webp` (gufetto con la lanterna, Gemini
  `gemini-3-pro-image`, scontornato): candidata (`MEDIA-04`). Un gufetto e non un riccio perché i
  personaggi del libro non si ridisegnano (`DES-14`).
- **Decorazione dei biglietti** `public/decoration-lantern-tree.svg` (albero con lanterne, SVG
  nostro): sostituisce il lupo del gemello, che ha croci e cimitero (`COPY-02`). Da approvare.
- **Scene dell'hero** (SVG generati) e **immagine social** `public/uploads/og-image.jpg`: da approvare.
- **Copy**: scritto da noi da brief e scheda dell'editore, già rivisto dal copy-specialist; da rileggere.

## Dati dal cliente

- **Dominio** (oggi segnaposto `lanternatamilano.it` in `astro.config.mjs`, `CODE-14`).
- **Widget TicketingHub della lanternata**: oggi c'è quello del Campo di Zucche (`tickets.json`).
- **Foto vere** per la gallery (oggi 10 segnaposto «Foto in arrivo», `public/uploads/segnaposto-*.jpg`) e **recensioni** da tenere o cambiare
  (quelle del parco parlano di Halloween).
- **La lanterna si porta a casa**: confermato dall'utente il 13 ott 2026 (anche i bimbi sotto i 3 anni la preparano con i genitori e la portano a casa). La FAQ dedicata era stata tolta: si può rimettere. Resta da sapere se la luce va via con la lanterna.
- **Età e prezzi** (decisione dell'utente, 13 ott 2026): consigliata 3–12 anni, tutti i bambini benvenuti. Gratis fino a 3 anni non compiuti; 15 € dai 3 compiuti ai 12 non compiuti; 5 € dai 12 compiuti, come gli adulti.
- **Pioggia**: l'evento si fa lo stesso? Come si avvisano le famiglie? Il voucher del 15 novembre per
  quale data? La FAQ riprende la regola del gemello.
- **Animali** (capre, galline, asinelli) visitabili tra le 16:00 e le 18:30? È nel riquadro dei più
  piccoli, ripreso dal gemello.
- **Firma copie**: a che ora? (Confermati dall'utente: il libro si compra sul posto, firma copie in tutte e quattro le date, Libreria Mariclò.)
- **Bimbi sotto i 3 anni**: serve una prenotazione gratuita nel widget? **12 anni** = adulto a 5 €,
  e ha la lanterna?
- **Web3Forms**: si riusa l'access key del gemello (stessa casella e stesso limite mensile).
- Se l'**autrice** sarà presente alla lettura (sarebbe un ottimo contenuto).

## Separatori (deciso il 13 ott 2026)

Dopo prove nella pagina vera con un interruttore temporaneo (onde, abeti, pagina strappata, fregio,
filo di luci, sentiero, fogli sovrapposti, arco) l'utente ha scelto l'**arco alterno** (`DES-12`):
`src/components/Divider.astro`, prop `flip` sui passaggi pari. Le alternative scartate sono in
`DES-10`; il codice delle prove è stato tolto.

## Cosa ha funzionato

- **Scena dell'hero procedurale**: `node scripts/generate-hero.mjs` (seme fisso, tre piani di alberi,
  luna, sentiero con lanterne). ~30 KB desktop, ~20 KB mobile. Su schermi verticali (anche tablet)
  si usa la scena 9:16 (`max-aspect-ratio: 1/1`).
- **Browser vero senza Playwright MCP**: `playwright-core` dalla cache npx +
  `executablePath: '/usr/bin/google-chrome'` (i browser in cache non corrispondono alle versioni).
  Prima degli screenshot: percorrere la pagina con `window.lenis.scrollTo(y, { immediate: true })` e
  togliere `#cc-main`. Il banner cookie non compare ai bot: per provarlo serve cambiare user agent e
  `navigator.webdriver`. axe-core è nella cache npx (`~/.npm/_npx/8003d8991b0d346b`).
- **Immagine social** renderizzata da Chrome headless con i font veri: `node scripts/build-og-image.mjs`.

## Cosa NON ha funzionato / trappole

- GitHub Pages attivato su un repo ancora vuoto autorizza a pubblicare `master`: il primo deploy da
  `main` fallisce senza log. Si corregge la regola dell'ambiente `github-pages` (branch `main`).
- Il certificato HTTPS non parte se il dominio personalizzato è stato impostato prima del DNS: si toglie
  e si rimette il dominio (API `pages`, `cname`), poi si attiva `https_enforced`.
- Una sezione con `overflow: hidden` taglia il pixel con cui l'arco sborda sopra: sui telefoni compare
  una riga sottile. Sezioni con l'arco: solo `overflow-x: clip` (`RESP-02`).

- SVG: sottopercorsi con verso opposto nello stesso `<path>` si **bucano** (regola nonzero).
- `rotate-[...]` di Tailwind è la proprietà `rotate`: sommata a un `transform: rotate()` raddoppia
  (`CODE-07`). L'inclinazione a riposo va nel `transform`.
- `acceptCategory` di vanilla-cookieconsent esegue i callback **in modo sincrono**: chi carica la
  biglietteria dal riquadro deve farlo prima di accettare, o perde il focus.
- L'anello di focus ambra chiaro su carta è 1,9:1: su carta si usa `lantern-deep` (`global.css`).
- La copertina del libro è 529×794: non si ingrandisce mai.

## File chiave

- `src/layouts/Base.astro` — head, gate di indicizzazione, tutto il JSON-LD.
- `src/pages/robots.txt.ts` — robots dal flag `PUBLIC_SITE_INDEXABLE`.
- `src/components/Program.astro` — weekend con badge di disponibilità e timeline della serata.
- `src/components/Book.astro` — sezione del libro.
- `src/components/Tickets.astro` + `src/scripts/consent.ts` — biglietteria dopo il consenso.
- `src/scripts/easing.ts` — l'easing di casa per gli script.
- `.pages.yml` — pannello, voci numerate nell'ordine della pagina.

## Ambiente & comandi

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2
npm run build && npx astro preview --port 4322 --host 127.0.0.1
node scripts/generate-hero.mjs        # scene dell'hero
node scripts/build-og-image.mjs       # immagine social (serve Chrome)
node scripts/generate-image.mjs ...   # illustrazioni Gemini (chiave in .env: GOOGLE_AI_STUDIO_KEY)
```

## Prossimi passi

1. Raccogliere le decisioni dell'utente (sotto) e i dati del cliente (sopra).
2. Avvisi di accessibilità rimasti (non bloccanti): galleria con un solo punto di tabulazione e
   ordine visivo (roving tabindex); pausa da tastiera per le recensioni che scorrono (oggi pausa su
   hover, tocco e fuori schermo, `A11Y-07`).
3. Go-live con runbook (`GIT-07`): dominio, hosting di produzione, Pages CMS, Search Console, IndexNow.

## Da chiudere prima del go-live

- Widget TicketingHub della lanternata al posto di quello del Campo di Zucche (`tickets.json`).
- Dominio definitivo in `astro.config.mjs` (`SITE_URL`, `CODE-14`).
- Foto vere nella gallery e recensioni decise (debito noto in `docs/standards/README.md`).
- Nel manuale, i commenti `DA COMPLETARE` su repository e account (3 punti).
- `PUBLIC_SITE_INDEXABLE=true` solo nella build di produzione, il giorno del go-live (`SEO-10`).
- GitHub Action IndexNow come sul gemello, con la chiave pubblicata in `public/`.
- Dopo il 15 novembre: decidere cosa mostra la pagina (evento concluso / prossima edizione).

## Decisioni aperte

- **Accorpare «L'esperienza» e «La serata»** (consiglio del design-specialist): una sola sezione con
  la pila di card che segue le tappe della serata dal giorno alla notte, le date dei weekend spostate
  nei biglietti. Pagina più corta, il libro arriva prima. Cambia `DES-03`, menu e `.pages.yml`.
- **Pulsante del riquadro consenso**: oggi «Attiva la biglietteria» (come il gemello). Si potrebbe
  scrivere «Prenota il tuo posto» con la frase sul consenso sotto: da valutare anche lato privacy.
- **Barra in alto scura** (notte) invece che chiara come sul gemello: il design-specialist la conferma. Le due pillole (parco e prenota) hanno la stessa misura (`DES-15`).
- **Emoji 🏮** (lanterna di carta rossa) in due card: diversa dalla lanterna di vetro del marchio e
  del libro; scelta del cliente.
