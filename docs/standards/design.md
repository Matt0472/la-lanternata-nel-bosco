# Design — `DES-`

Le **regole** del design system. Il mestiere (come si giudica una sezione, cosa la fa sembrare un
template) sta nell'agente `design-specialist`; i **valori** stanno in `src/styles/global.css`.

## Autorità

- **DES-01** — I valori dei token vivono in `@theme` di `src/styles/global.css`: è la fonte di verità.
  `design-system/lanternata/MASTER.md` spiega l'intento; se i due divergono, vince `global.css` e
  MASTER.md si corregge.
- **DES-02** — Estetica **fiaba notturna illustrata**: un albo per bambini letto al chiaro di luna.
  Notte blu profonda, carta color luna, **la luce calda delle lanterne come unica protagonista**.
  Accogliente e magica, mai cupa né spaventosa (`COPY-02`). È la sorella del Campo di Zucche: stessa
  struttura e stessi componenti, ma palette, personaggi e separatori suoi. **"Wow",
  ma la performance viene prima**: un effetto che pesa più di quanto comunica non si fa.

## Colore e superfici

- **DES-03** — **Alternanza carta / notte.** Le sezioni chiare stanno su `paper` e `paper-warm`, le
  sezioni di notte su `night`; tra due sezioni c'è sempre l'arco (`Divider`, `DES-12`). Sequenza della
  pagina: hero (notte) · esperienza (carta) · la serata (carta calda) · il libro (notte) · i più
  piccoli (carta calda) · foto (carta) · info (carta calda) · biglietti (notte) · recensioni (carta) ·
  FAQ (carta calda) · contatti (carta) · footer (notte). Mai due sezioni di notte di seguito.
- **DES-04** — **Un solo accento: la luce delle lanterne** (`lantern`, hover `lantern-light`). Sul
  fondo notte è il colore dei pulsanti e degli occhielli; **sul fondo carta, come testo, si usa
  `lantern-deep`** (l'ambra chiara su carta non passa il contrasto). Il testo sopra un pulsante ambra
  è sempre `night`, mai crema. `forest` serve solo alle note informative (come il muschio del
  gemello), mai come secondo accento.

## Gerarchia e azione

- **DES-05** — **Una sola CTA primaria: prenotare il posto** (TicketingHub, sezione `#biglietti`),
  pulsante ambra pieno con **un'etichetta sola** (barra, hero, esperienza, 404): la decide il campo
  `ctaLabel` dell'hero; il pulsante che apre la biglietteria ha la sua (`buttonLabel`), che di norma
  coincide. Le sezioni con un invito proprio (i più piccoli verso la prenotazione, il libro verso
  Amazon) lo tengono **subordinato**: pulsante a contorno. Il link al libro è secondario per
  costruzione: il libro si compra anzitutto ai mercatini.
- **DES-06** — Tipografia: **Fraunces** (variabile, asse SOFT al massimo: terminazioni morbide da
  albo illustrato) per i titoli, **Figtree** per il testo (≥ 16px, interlinea ~1.6). **Cifre
  tabellari** per prezzi, orari e date. Niente corsivo (non è caricato: sarebbe sintetico).
- **DES-07** — Icone d'interfaccia **solo SVG** a linea (`Icon.astro`: un'unica famiglia, tratto
  1.8). Le **emoji** sono ammesse solo come **contenuto scelto dal cliente nel CMS** (il pittogramma
  di una card), come sul gemello, e sono sempre `aria-hidden`.

- **DES-15** — Nella **barra in alto** la pillola del Bosco della Luna e il pulsante di prenotazione
  hanno **la stessa misura** (stessa altezza, stessa larghezza), qualunque sia il testo del pulsante
  (decisione dell'utente, 13 ott 2026).

## Movimento

- **DES-08** — Il movimento ha uno scopo e una sola grammatica: `--ease-soft`, entrate dal basso
  (36px, 0,8 s), stagger leggero. La luce **pulsa** (lucciole, fiamme, alone della copertina), non
  lampeggia. **Il contenuto dell'hero entra in CSS, non aspetta il JavaScript** (`CODE-11`). Con
  `prefers-reduced-motion` il sito è **statico pieno**.

## Immagini e illustrazioni

- **DES-09** — Il testo sopra un'illustrazione è sempre leggibile, con un velo a gradiente leggero e
  una fascia più scura solo dietro il blocco di testo: la scena non si spegne. Su mobile la scena
  dell'hero è **verticale dedicata** (`imageMobile`), mai il ritaglio di quella orizzontale.
- **DES-13** — **La copertina del libro si mostra intera e fedele**: mai ritagliata, ridisegnata,
  ricolorata o coperta da testo; la luce intorno (alone, ombra) sta fuori dal suo rettangolo.
- **DES-14** — I **personaggi del libro** (il riccio Belgiorno, la volpe Stellafiore) appartengono
  all'albo e alle sue illustrazioni: **non si ridisegnano**, né a mano né con l'AI. La mascotte del
  sito è un personaggio nostro (un gufetto con la lanterna), nello stile di casa (`MEDIA-05`).

## Componenti

- **DES-11** — Gli **accordion** (FAQ) sono **esclusivi**: aprire una voce chiude le altre.
- **DES-12** — **Separatori: l'arco alterno** (`Divider`, decisione dell'utente, 13 ott 2026). L'hero
  non ha separatore. Dal primo bordo sotto l'hero ogni passaggio è un unico arco ampio e regolare, come
  il bordo di una luna, che **si alterna**: verso l'alto, verso il basso (`flip`), verso l'alto… Così
  una sezione sì e una no esce bombata sopra e sotto, come una lente. Chi aggiunge o toglie una sezione
  rimette in fila l'alternanza. Le lanterne appoggiate sull'arco stanno **solo** sul passaggio verso
  i biglietti (un arco verso l'alto): ripetute ovunque smetterebbero di dire "qui si prenota".

## Decisioni del cliente — non riproporre

- **DES-10** — Queste strade sono già state provate e **bocciate** (qui o sul sito gemello, dove la
  decisione vale anche per questo). Non si ripropongono nemmeno come alternativa, salvo che sia il
  cliente a riaprirle:

  | Bocciato | Al suo posto |
  |---|---|
  | Sezione video | Nessuna sezione video: il sito della lanternata è più snello del gemello |
  | Intro dell'hero mostrata una volta per sessione (`sessionStorage`) | L'intro parte a ogni atterraggio sulla pagina (su iOS la memoria di sessione la faceva sparire per sempre) |
  | "Pista" o spaziatori dopo l'ultima card della pila «L'esperienza» | La pila esce sbucciandosi, con l'ultima card sempre sopra: moto continuo (provato e scartato due volte sul gemello) |
  | Pulsante della biglietteria generato da TicketingHub, ristilizzato a forza | Pulsante nostro, a cui lo script di TicketingHub si aggancia (popover) |
  | Separatori provati il 13 ott 2026: crinali a onde come il gemello, linea di abeti e chioma, pagina strappata, fregio con medaglione, filo di luci, sentiero tratteggiato con lanterne, fogli sovrapposti, arco sempre verso l'alto | L'arco alterno (`DES-12`) |
