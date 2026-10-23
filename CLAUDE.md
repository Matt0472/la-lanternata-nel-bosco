# La Lanternata al chiaro di luna — sito

Guida per Claude Code in questo repository.

Questo file è un **indice**, non un regolamento. Le regole stanno in `docs/standards/`, che leggono
persone e assistenti: una copia sola, un solo posto dove cambiarle.

## Il progetto

One-page della **Lanternata al chiaro di luna**, evento per famiglie del **Bosco della Luna** (parco
nella natura alle porte di Milano, via Cusago 280). Due weekend: **7–8 e 14–15 novembre 2026**, un
turno al giorno (16:00–18:30, 2 ore e mezza). Contenuti in **italiano**; nei testi non si parla di
"serata" (`COPY-10`).

Come si svolge: i bambini **decorano la loro lanterna** e la consegnano; mentre asciuga, lontano dai
loro occhi, giocano. Poco prima del tramonto si va al palco per la **lettura animata** del libro
**«Il richiamo delle lanterne»** di Roberta Mari (Gruppo Albatros Il Filo). Finita la lettura
ritrovano **tutte le lanterne accese**: lo stupore dei bambini è il momento più bello (`COPY-08`).
Ognuno prende la sua e si parte per la **passeggiata al chiaro di luna** lungo il sentiero del bosco,
che finisce con una **caccia al tesoro** di oggetti luminosi nel buio. In loco, in tutte le date, il libro si
compra e l'autrice lo **firma**, in collaborazione con la **Libreria Mariclò** (@libreriamariclo).

**Obiettivo primario: vendere i posti**, tutto porta alla **prenotazione (TicketingHub)**.
**Obiettivo secondario: far conoscere il libro e il suo messaggio** il più possibile, e venderne
qualche copia. Sito **veloce**, **mobile-first**, aggiornabile in autonomia dal cliente.

**Progetto gemello: `../bosco-della-luna-campo-di-zucche`** (stesso cliente, stesso stack, online su
campodizucchemilano.it). È l'implementazione di riferimento: struttura, componenti, CMS, manuale,
consenso cookie e biglietteria nascono da lì. Prima di inventare una soluzione, guarda come l'ha
risolta il gemello (`CODE-05`).

**Standard di qualità (non negoziabile): si lavora sempre al massimo.** Ogni sezione, testo e
componente dev'essere eccellente e curato nei dettagli. Solo cose meravigliose, mai riempitivi o
soluzioni "abbastanza buone".

**Principio fondante: se è contenuto sta nel CMS, se è struttura sta nel codice.** Il cliente cambia
tutto da Pages CMS; la struttura la tocca solo un tecnico (`docs/standards/contenuti-cms.md`).

## Leggi prima di lavorare

| Stai per | Leggi |
|---|---|
| Fare qualunque cosa | [`docs/standards/README.md`](docs/standards/README.md): indice, non negoziabili, debito noto |
| Scrivere un testo, aggiungere un'immagine, toccare `src/data` o `.pages.yml` | [`contenuti-cms.md`](docs/standards/contenuti-cms.md) |
| Scrivere o rivedere copy, parlare del libro | [`copy.md`](docs/standards/copy.md) |
| Scrivere componenti, layout, CSS, script | [`codice.md`](docs/standards/codice.md) |
| Progettare o ritoccare l'aspetto di qualcosa | [`design.md`](docs/standards/design.md), con le **decisioni del cliente da non riproporre** |
| Produrre illustrazioni, immagini AI, foto, favicon | [`media.md`](docs/standards/media.md) |
| Toccare elementi interattivi, contrasti, motion | [`accessibilita.md`](docs/standards/accessibilita.md) |
| Toccare immagini, font, JS, hero | [`performance.md`](docs/standards/performance.md) |
| Toccare un layout | [`responsive.md`](docs/standards/responsive.md) |
| Toccare meta, JSON-LD, robots | [`seo.md`](docs/standards/seo.md) |
| Committare, pubblicare, andare online | [`git.md`](docs/standards/git.md) |

Il canone è l'autorità. Dove il tuo giudizio diverge, **vince il file**. Se una regola sembra sbagliata
per il caso, dillo e fermati: non improvvisare varianti.

Lo **stato del lavoro** (cosa è fatto, cosa manca, cosa manca dal cliente) è in `docs/in-development/HANDOFF.md`.

## Stack

- **Astro** `^7`, sito **statico** (nessun adapter SSR), una pagina più 404 e pagine legali.
- **Tailwind CSS** `^4` via plugin Vite `@tailwindcss/vite` (non l'integrazione Astro).
- **motion** (reveal e animazioni) e **lenis** (smooth scroll), **@fontsource** (Fraunces, Figtree),
  **vanilla-cookieconsent**, **sharp** (dev).
- **Pages CMS** (pagescms.org), config in `.pages.yml`, contenuti in `src/data/*.json`.
- **TicketingHub** (biglietteria in popover, dopo il consenso), **Web3Forms** + hCaptcha (modulo
  contatti), illustrazioni con **Gemini** (`scripts/generate-image.mjs`).
- **GitHub** `Matt0472/la-lanternata-nel-bosco` (pubblico): ogni push su `main` va **in produzione**
  su **https://lanternata.it** (Cloudflare Pages, online e indicizzabile dal 23 ott 2026). Non c'è
  un'anteprima. Search Console, Bing e IndexNow: vedi README, «Come va online».

## Comandi

Richiede **Node ≥ 22**: con Node 20 il build fallisce.

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2
npm run dev        # sviluppo su http://localhost:4321 (genera prima manuale e miniature)
npm run build      # build statica di produzione in dist/
npx astro preview --port 4322                                                    # anteprima della build
npx lighthouse http://127.0.0.1:4322/ --chrome-flags="--headless=new"            # Lighthouse sulla build
```

Produzione indicizzabile: `PUBLIC_SITE_INDEXABLE=true`, **solo il giorno del go-live** (`SEO-10`).

## Delega agli agenti

Gli agenti sono **specialisti di una materia**. Ognuno conosce un'area e serve qualunque fase:
costruire, rivedere, esplorare, correggere, rispondere a una domanda. Si usa quello la cui materia
corrisponde, **senza aspettare che l'utente lo chieda**; i lavori che toccano più materie li delegano a
più specialisti, in parallelo.

| Materia | Specialista |
|---|---|
| Aspetto: composizione, gerarchia, tipografia, motion, stati, UX dei form | `design-specialist` |
| Contenuti: campi CMS, `src/data`, `.pages.yml`, manuale cliente | `cms-specialist` |
| Parole: copy italiano, tono per le famiglie, il libro e il suo messaggio | `copy-specialist` |
| Asset: illustrazioni, immagini AI, foto reali, copertina, logo, favicon, immagine social | `asset-specialist` |
| Forma del codice: Astro, CSS, script, dipendenze | `code-standards-specialist` |
| Accessibilità WCAG 2.2 AA (**bloccante**) | `accessibility-specialist` |
| Performance e Core Web Vitals | `performance-specialist` |
| Responsive e mobile | `responsive-specialist` |
| SEO, GEO, dati strutturati, gate di indicizzazione | `seo-specialist` |

### Revisione

- **Chi ha costruito qualcosa non lo rivede.** Dopo ogni modifica non banale: `code-standards-specialist`
  e `cms-specialist` sui file toccati; `copy-specialist` se sono cambiati dei testi.
- **A sito finito** si fa `/audit` come quality-gate, con i quattro specialisti di qualità
  (accessibilità, performance, responsive, SEO) più design, CMS, copy e codice. **Non a ogni
  componente**: in itinere bastano build, browser vero e la revisione qui sopra. L'esito
  dell'accessibilità è **bloccante**, e prima del lancio si fa `/audit lancio`.
- Si salta la revisione solo per modifiche banali e meccaniche (un refuso, un valore, una riga senza
  effetti).

## Usa queste skill senza che te lo chiedano

Chi lavora qui descrive il lavoro a parole e non sa che le skill esistono. Riconosci l'intento e agisci:
dì in una riga quale usi, poi usala.

| Dicono qualcosa come | Fai |
|---|---|
| "rifai la sezione X" · "aggiungi Y" · "sistema Z" · "cambiamo il libro" | **`/ship`**: raccolta, domande, piano, costruzione, verifica, via libera, pubblicazione |
| "controlla il sito" · "è pronto?" · "va bene così?" · una sezione appena finita | **`/audit`** |
| "dove va questo?" · "posso usare questo colore?" · "come lo chiamo?" | **Rispondi da `docs/standards/`** citando l'ID della regola, mai a memoria |
| "passiamo la mano" · "chiudiamo la sessione" · "salva i progressi" | **`/handoff`** |

- **Usala direttamente quando la richiesta corrisponde chiaramente.** Chiedere "uso una skill?" scarica
  la decisione su chi non sa cosa siano.
- **Proponi, non imporre, quando corrisponde solo in parte.** "Mi sembra un lavoro da `/ship`, lo faccio
  per bene?" è meglio che avviare in silenzio cinque fasi non richieste.
- Se una skill non è disponibile, fai il lavoro tu: contano i gate del canone, le skill sono il modo per
  raggiungerli in modo affidabile.

## Regole operative

Riguardano come si lavora qui, non come deve essere il codice (quello è in `docs/standards/`).

- **Mai commit né push senza un ok esplicito**: prima si mostrano le modifiche (screenshot, anteprima
  locale, diff), poi si aspetta (`GIT-01`). Ogni push su `main` va online su lanternata.it.
- **Il sito è online e indicizzabile dal 23 ott 2026** (`SEO-10`): il flag sta solo nelle variabili di
  Production di Cloudflare. Mai toccare quel flag, il DNS o Cloudflare di tua iniziativa: gli
  interruttori di produzione li aziona l'utente (`GIT-08`).
- **Mai segreti nei file**: la API key sta in `.env` (`GIT-04`).
- **Verifica in un browser vero**, a desktop e telefono, sotto la piega e con `prefers-reduced-motion`
  (`GIT-09`). Screenshot in `.playwright-mcp/` (ignorata da git).
- **Uso efficiente di token e risorse, puntando al miglior risultato**: pianifica prima di agire, riusa
  ciò che è già noto, non rileggere file già letti, output concisi, evita errori che costringono a
  rifare. Massima qualità, minimo spreco.
- **Non creare documentazione non richiesta**, tranne il manuale cliente, che è obbligatorio e va
  tenuto allineato al CMS (`CMS-12`–`CMS-14`).
