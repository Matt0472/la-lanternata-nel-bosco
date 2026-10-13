# Standard del progetto

Questa cartella è **l'unica autorità** su come si costruisce il sito della Lanternata al chiaro di luna.
È scritta per le persone prima che per gli assistenti AI: entrambi la leggono, entrambi ne sono
vincolati.

Se qualcosa qui contraddice un commento, un agente, il `CLAUDE.md`, l'handoff
(`docs/in-development/HANDOFF.md`), il sito gemello o un'abitudine, **vince questo file.** Se una regola
sembra sbagliata per il caso che hai davanti, dillo e fermati: non improvvisare una variante (vedi
[Cambiare una regola](#cambiare-una-regola)).

Ogni regola ha un **ID** (`CMS-01`, `DES-04`, `A11Y-03`). Quando segnali qualcosa, cita l'ID: chi
legge può verificarlo invece di fidarsi sulla parola.

## Dove sta scritto cosa

| Posto | Contiene | Test |
|---|---|---|
| `docs/standards/` (qui) | Le **regole**: come deve essere il sito e il codice | "Violarla è un difetto" |
| `src/styles/global.css` (`@theme`) | I **valori** dei token di design (colori, font, easing) | "È un numero o un colore" |
| `design-system/lanternata/MASTER.md` | L'**intento** del design system e il suo perché | "Spiega una scelta di design" |
| `../bosco-della-luna-campo-di-zucche` | L'**implementazione di riferimento** dello stesso cliente | "Come l'abbiamo già risolto" |
| `docs/in-development/HANDOFF.md` | Lo **stato** del lavoro in corso: cosa è fatto, cosa manca, trappole recenti | "Scade quando il lavoro finisce" |
| `docs/audits/` | Cosa ha trovato un audit **il giorno in cui è stato fatto** | "È un verbale" |

`docs/in-development/HANDOFF.md` (aggiornato con `/handoff`) e `docs/audits/` non sono documentazione:
non si mantengono una volta chiuso il lavoro e **nessun commento nel codice li cita**. Quando una
lezione dell'handoff diventa una regola stabile, si sposta qui.

## I file

| File | Copre |
|---|---|
| [`contenuti-cms.md`](contenuti-cms.md) | Contenuto vs struttura, Pages CMS, `src/data`, `.pages.yml`, manuale cliente — `CMS-` |
| [`copy.md`](copy.md) | Lingua e tono, il libro e il suo messaggio, parole da evitare — `COPY-` |
| [`codice.md`](codice.md) | Lingua, struttura, token, JS client, dipendenze, terze parti, commenti — `CODE-` |
| [`design.md`](design.md) | Regole del design system e **decisioni del cliente da non riproporre** — `DES-` |
| [`media.md`](media.md) | Illustrazioni, immagini AI, foto reali, copertina del libro, logo, favicon — `MEDIA-` |
| [`accessibilita.md`](accessibilita.md) | WCAG 2.2 AA, **bloccante** — `A11Y-` |
| [`performance.md`](performance.md) | Lighthouse, Core Web Vitals, peso di immagini/font/JS — `PERF-` |
| [`responsive.md`](responsive.md) | Mobile-first, breakpoint, overflow, tap target — `RESP-` |
| [`seo.md`](seo.md) | SEO tecnica e on-page, JSON-LD, GEO, **gate di indicizzazione** — `SEO-` |
| [`git.md`](git.md) | Commit, push, go-live, segreti, verifica — `GIT-` |

## Non negoziabili

Le poche regole che, se violate, fanno danni difficili da vedere nel momento in cui accadono:

- **Ogni contenuto è modificabile dal cliente via Pages CMS**, mai scritto nel componente (`CMS-01`).
- **Mai commit o push senza un ok esplicito** dopo aver mostrato le modifiche (`GIT-01`).
- **Il sito resta `noindex` fino al giorno del go-live** (`SEO-10`).
- **WCAG 2.2 AA è bloccante** per il lancio (`A11Y-01`).
- **Il libro si cita sempre giusto** (titolo, autrice, editore) e la copertina non si altera
  (`COPY-06`, `MEDIA-03`).
- **I dati del cliente non si inventano**: prezzi, orari, numeri, recensioni (`CMS-10`).
- **Le decisioni del cliente non si ripropongono** (`DES-10`).

## Cambiare una regola

Le regole si cambiano, non si aggirano. Una regola sbagliata si corregge qui, con l'ok dell'utente,
**prima** di scrivere codice che la viola; poi il codice si allinea. Una regola nuova nasce da una
decisione (del cliente o tecnica) che vale oltre il caso singolo: si aggiunge al file giusto con il
prossimo ID libero e una riga sul perché.

## Debito noto

Violazioni del canone accettate per ora, con il motivo. Un audit le riporta come **debito noto**, non
come regressioni. Si sistemano quando si tocca quel codice (`GIT-06`), non a vista.

| Dove | Regola | Perché è ancora lì |
|---|---|---|
| `src/data/gallery.json` e `public/uploads/segnaposto-*.jpg` | `MEDIA-02` (le foto raccontano questo evento) | Dieci segnaposto «Foto in arrivo» al posto delle foto, per scelta dell'utente: arrivano quelle vere della lanternata |
| `src/data/testimonials.json` | `COPY-03` (niente promesse su ciò che non c'è) | Recensioni Google del Bosco della Luna scritte per il Campo di Zucche: sono vere e del parco, ma parlano di zucche e Halloween. Vanno sostituite o filtrate quando il cliente decide |
| `src/data/tickets.json` (`widgetId`) | `CMS-11` | Codice del widget TicketingHub del Campo di Zucche, usato per ora su indicazione dell'utente: va sostituito con quello della lanternata prima del go-live |
