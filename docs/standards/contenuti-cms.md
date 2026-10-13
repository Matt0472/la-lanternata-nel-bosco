# Contenuti e Pages CMS — `CMS-`

Principio fondante del progetto: **se è contenuto sta nel CMS, se è struttura sta nel codice.** Il
cliente aggiorna il sito in autonomia da Pages CMS; la struttura (layout, componenti, logica, stile,
configurazione) la tocca solo un tecnico.

## Contenuto vs struttura

- **CMS-01** — Ogni **contenuto** è modificabile dal cliente via Pages CMS, **mai scritto nel
  componente**: testi, titoli, immagini, prezzi, orari, date, FAQ, recensioni, contatti, meta/SEO,
  etichette delle CTA, testi alternativi, link esterni, i dati del libro, ID di terze parti. Il test:
  *"il cliente vorrà cambiarlo?"* Se sì, va nei dati.
- **CMS-02** — Fa eccezione solo il **microcopy d'interfaccia** che fa parte del funzionamento del
  componente e che il cliente non ha motivo di cambiare: `aria-label` dei controlli ("Torna in cima
  alla pagina", "Foto successive"), testo dello skip link, stati di invio del modulo, i testi del
  banner cookie. Nel dubbio è contenuto.

## Dove vivono i dati

- **CMS-03** — I contenuti sono **file JSON in `src/data/`**, uno per sezione della pagina, nello
  stesso ordine in cui le sezioni compaiono; i componenti Astro li leggono. Le pagine legali sono
  Markdown in `src/pages/*.md`, editabili dal pannello come rich-text.
- **CMS-04** — Ogni chiave dei JSON è esposta in **`.pages.yml`**, e ogni campo di `.pages.yml` è
  letto da un componente. Una chiave nel JSON che manca nel `.pages.yml` è invisibile al cliente; un
  campo che nessun componente legge è un campo morto che lo confonde.
- **CMS-05** — **Chiave (`name`) in inglese, `label` e valore in italiano.** Es.
  `{ name: "title", label: "Titolo" }` con valore italiano. Le voci del pannello sono numerate
  nell'ordine della pagina ("1 · Hero", "2 · L'esperienza"…), come sul sito gemello.
- **CMS-06** — I media caricati dal cliente stanno in **`public/uploads`** (in output `/uploads`).
- **CMS-07** — `settings.commit.identity: user`: ogni salvataggio riporta nome ed email di chi modifica.

## Campi

- **CMS-08** — Ogni campo immagine informativa ha accanto il suo **campo testo alternativo**, e la sua
  **variante mobile** (`imageMobile`) quando il layout la richiede (`MEDIA-05`). Le illustrazioni
  puramente decorative (la mascotte, l'albero con le lanterne) non hanno alt (`A11Y-03`).
- **CMS-09** — Rinominare o togliere un campo **migra i JSON esistenti nella stessa modifica**: il
  contenuto già inserito dal cliente non si perde mai. È una modifica delicata (`GIT-07`).
- **CMS-10** — I **dati del cliente non si inventano**: telefono, indirizzo, orari, prezzi, recensioni,
  numeri, dettagli del libro. Se mancano, il campo resta vuoto, il componente gestisce il vuoto con
  garbo (nessun "undefined", nessun titolo vuoto, nessuna immagine rotta) e il dato mancante finisce
  nell'elenco "Dati dal cliente" dell'handoff.
- **CMS-11** — Gli **ID di terze parti** sono campi del CMS: il codice del widget TicketingHub sta in
  `tickets.json` (`widgetId`), l'access key di Web3Forms in `settings.json` (`web3formsKey`). Sono
  l'unica cosa di quelle integrazioni che il cliente cambia (`CODE-09`).
- **CMS-15** — Gli **interruttori di stato** che il cliente usa a stagione aperta sono booleani con
  etichetta che dice l'effetto (`soldOut` → "SOLD OUT: mostra il badge posti finiti"), come per i
  weekend della lanternata. Un badge esclude l'altro, e il codice decide la precedenza (sold out vince).

## Manuale cliente

- **CMS-12** — Il progetto ha un **manuale d'uso per il cliente**, fatto come sul sito gemello:
  - sorgente: frammento HTML in `docs/manuale-cliente.html` (solo `<title>` + `<style>` + corpo);
  - generazione: `scripts/build-manual.mjs` lo avvolge in una pagina completa `noindex, nofollow` +
    `no-referrer` e la scrive in `public/manuale-lnt-4c9e/index.html`; gira con `npm run manual`,
    incluso in `dev` e `build`;
  - indice scrollspy: `<nav class="toc">` con `aria-current` che segue la sezione letta; sezioni
    `<section id="...">` con `<h2><span class="num">NN</span> Titolo</h2>`.
- **CMS-13** — Il manuale è **riservato**: non è linkato da nessuna pagina, non è in sitemap e **non
  compare in `robots.txt`** (che è pubblico). Lo raggiunge solo chi conosce l'URL.
- **CMS-14** — Il manuale è **sincronizzato col sito**: ogni sezione e ogni campo modificabile è
  spiegato (come si accede, cosa si cambia, cosa **non** si tocca). Si aggiorna **nella stessa
  modifica** che cambia il `.pages.yml`.
