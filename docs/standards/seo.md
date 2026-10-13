# SEO, GEO e indicizzazione — `SEO-`

## On-page e tecnica

- **SEO-01** — **HTML semantico**: esattamente **un `<h1>` per pagina**, gerarchia dei titoli senza
  salti, landmark corretti (`header`, `nav`, `main`, `footer`).
- **SEO-02** — **`<title>` e meta description** gestiti **da un solo punto** (`Base.astro` via props)
  e alimentati dal CMS (`settings.json`), mai scritti a mano nella pagina (`CMS-01`). Title ≤ ~60
  caratteri, description ≤ ~155.
- **SEO-03** — **URL canonico** su ogni pagina, `lang="it"`, favicon e `theme-color`.
- **SEO-04** — **Open Graph + Twitter Card** con **immagine raster 1200×630** (`MEDIA-12`): i social
  non mostrano gli SVG.
- **SEO-05** — **JSON-LD** valido e ricavato dai JSON dei contenuti (nessun dato duplicato a mano,
  così se il cliente cambia una data o un prezzo lo schema segue):
  - `Event` della lanternata con luogo (`Place` con indirizzo e `geo`), organizzatore (il Bosco della
    Luna, con i profili social e la scheda Google in `sameAs`), offerte per tipologia di prezzo,
    orario del turno, e **un `subEvent` per weekend** con la sua disponibilità;
  - `Book` per «Il richiamo delle lanterne» (autrice, editore, codice EAN, età di lettura, pagine),
    collegato all'evento: la lettura animata è di quel libro;
  - `FAQPage` sulle FAQ.
  Un campo vuoto o non interpretabile **omette la chiave**, non produce uno schema sbagliato.
- **SEO-06** — **`sitemap.xml`** via `@astrojs/sitemap`; le **pagine legali** (privacy, cookie) sono
  `noindex` ed escluse dalla sitemap, come il manuale cliente (`CMS-13`).
- **SEO-07** — **Copy orientato alle ricerche locali** in modo naturale, senza keyword stuffing:
  "lanternata Milano", "evento per bambini a novembre a Milano", "passeggiata con le lanterne",
  "lettura animata", "Bosco della Luna". Le scelte di copy restano del cliente.

## GEO — farsi citare dagli assistenti AI

- **SEO-08** — Contenuto **answer-first**: date, orario, età, prezzi, indirizzo, cosa succede e cosa
  portare detti chiaramente nel testo (FAQ, info pratiche), in frasi che un assistente AI possa
  citare — non solo dentro immagini o animazioni.
- **SEO-09** — In produzione `robots.txt` **ammette esplicitamente gli AI crawler** (GPTBot,
  OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot,
  Perplexity-User, Google-Extended, Applebot-Extended), come sul gemello. Al go-live: Google Search
  Console, Bing Webmaster Tools e IndexNow automatico dopo ogni pubblicazione (GitHub Action del
  gemello).

## Gate di indicizzazione (regola critica)

- **SEO-10** — **Fino al go-live il sito NON è indicizzabile**: `robots.txt` `Disallow: /` +
  `<meta name="robots" content="noindex, nofollow">` su ogni pagina. Lo decide un solo flag di build,
  `PUBLIC_SITE_INDEXABLE` (`CODE-15`). Il `noindex` si toglie **solo il giorno del go-live**, sul
  dominio definitivo, e un'anteprima non è mai indicizzabile.
- **SEO-11** — Il percorso del manuale cliente **non compare mai** in `robots.txt` (`CMS-13`).
- **SEO-12** — `public/_headers` contiene **solo regole di cache**: mai un `X-Robots-Tag`, che
  toglierebbe il sito da Google senza che nulla si rompa a vista.
