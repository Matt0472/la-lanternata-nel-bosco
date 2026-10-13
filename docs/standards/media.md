# Media — `MEDIA-`

Illustrazioni, immagini AI, foto, copertina del libro, logo e favicon. Il procedimento (prompt,
script, parametri) sta nell'agente `asset-specialist`; qui ci sono le regole.

## Fonti e fiducia

- **MEDIA-01** — **Budget zero, sempre**: nessun asset a pagamento. Si usano le foto del cliente, lo
  stock con licenza libera commerciale (Pexels, Pixabay, Unsplash), le illustrazioni disegnate in SVG
  o generate con l'AI.
- **MEDIA-02** — **Le illustrazioni e le immagini AI servono per atmosfera e personaggi, mai come
  finta documentazione del posto o dell'evento**: per un evento per famiglie sarebbe ingannevole. Le
  **foto reali** del Bosco della Luna e della lanternata vanno nella galleria e ovunque serva
  autenticità.
- **MEDIA-03** — La **copertina del libro** viene solo dall'editore (scheda di Gruppo Albatros Il
  Filo) o dall'autrice, e si usa **così com'è**: si ridimensiona e si converte in WebP, non si
  ritaglia, ritocca o usa come base per un'immagine AI (`DES-13`).
- **MEDIA-04** — Ogni asset nuovo si **mostra al cliente e si fa approvare** prima di considerarlo
  definitivo. Si procede un asset alla volta; i candidati scartati si cancellano solo dopo l'ok sul
  sostituto.
- **MEDIA-05** — **Stile di casa**: ogni illustrazione sembra uscita dallo stesso albo — cartoon da
  libro illustrato, contorno blu notte morbido e un po' irregolare, colori pieni della palette
  (notte, carta color luna, ambra delle lanterne, verde bosco), la luce calda come punto focale. Mai
  3D, mai fotorealistico, mai spaventoso. La scena dell'hero ha la sua **variante mobile verticale**
  (16:9 e 9:16).

## Formati e peso

- **MEDIA-06** — I sorgenti stanno in `public/uploads`. Le **miniature della galleria** (WebP 640px)
  le genera la pipeline (`npm run thumbnails`, già dentro `dev` e `build`) e non si committano. Le
  illustrazioni scontornate si consegnano in **WebP con trasparenza**, al doppio della dimensione
  mostrata. Ogni `<img>` ha `width`/`height` o `aspect-ratio`.
- **MEDIA-07** — **Niente video** sul sito (`DES-10`). Se un giorno il cliente ne volesse uno, si
  segue il gemello: self-hosted su Cloudflare R2 con dominio proprio, H.264 CRF ~23 `+faststart`,
  poster, mai nel repo (Cloudflare Pages rifiuta i file sopra i 25 MB) e mai embed YouTube.
- **MEDIA-12** — L'**immagine per i social** (`ogImage`) è un raster **1200×630** (PNG o JPEG) che si
  legge anche in miniatura: titolo dell'evento, date e la luce delle lanterne.

## Identità

- **MEDIA-08** — Il **logo del Bosco della Luna** si usa solo dal file originale del cliente
  (`public/logo-bosco-419.png`), mai ridisegnato o ricolorato. Il **marchio della lanternata**
  (`public/logo-lanternata.svg`) è un disegno nostro in SVG, modificabile a mano.
- **MEDIA-09** — La **favicon** è `public/favicon.svg`, la stessa lanterna del marchio semplificata
  per stare leggibile a 16px.

## Segreti

- **MEDIA-10** — La API key di generazione sta solo in `.env` (`GOOGLE_AI_STUDIO_KEY`) e non compare
  mai in file, log o messaggi (`GIT-04`).
