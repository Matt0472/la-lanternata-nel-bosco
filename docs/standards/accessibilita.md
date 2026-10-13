# Accessibilità — `A11Y-`

- **A11Y-01** — **WCAG 2.2 livello AA è bloccante**: un fallimento AA blocca il lancio. Lighthouse
  Accessibility è solo un sottoinsieme superficiale; conta la verifica completa.

## Percepibile

- **A11Y-02** — **Contrasto** misurato, non stimato: ≥ **4.5:1** testo normale, ≥ **3:1** testo grande
  e componenti UI/bordi che servono a riconoscere un controllo (1.4.3, 1.4.11). Vale anche per il testo
  sopra l'illustrazione dell'hero, misurato sul punto più chiaro dietro il testo (la luna). Le coppie
  già misurate della palette sono in `design-system/lanternata/MASTER.md`; i toni con opacità (es.
  `text-night-soft/70`) si rimisurano, non si presumono.
- **A11Y-03** — **Testo alternativo**: descrittivo sulle immagini informative (foto, copertina del
  libro), `alt=""` su quelle decorative (mascotte, albero con le lanterne, archi tra le sezioni, lucciole). Gli alt delle immagini del
  cliente sono campi CMS (`CMS-08`).
- **A11Y-04** — L'informazione non passa mai solo dal colore: i badge "sold out" e "ultimi posti" hanno
  il testo, le stelle delle recensioni hanno il punteggio in testo.

## Operabile

- **A11Y-05** — **100% operabile da tastiera**, ordine del focus logico, **focus sempre visibile** e mai
  nascosto dalla barra fissa (2.4.11: `scroll-padding-top` della pagina ne tiene conto).
- **A11Y-06** — **Skip link** "Salta al contenuto" funzionante, che sposta il focus su `<main>`.
- **A11Y-07** — `prefers-reduced-motion` spegne il movimento non essenziale. Il contenuto che si muove
  da solo per più di 5 secondi ha un **controllo per metterlo in pausa** (2.2.2), oppure si ferma da
  solo, oppure si mette in pausa all'hover/tocco e fuori schermo (le recensioni). Lucciole e fiamme che
  pulsano sono decorazione: si spengono con reduced motion.
- **A11Y-08** — **Galleria e lightbox**: le foto del ventaglio sono pulsanti raggiungibili da
  tastiera, frecce con nome accessibile; il lightbox è un `<dialog>` modale che si chiude con **Esc**,
  intrappola il focus e lo restituisce alla foto da cui era partito.
- **A11Y-09** — Dimensione minima dei target: 24×24 px per AA (2.5.8); lo standard del progetto è
  44 px (`RESP-04`).

## Comprensibile e robusto

- **A11Y-10** — **ARIA solo dove serve, e corretta**; prima gli elementi nativi.
- **A11Y-12** — **Modulo contatti**: `<label>` associate, errori collegati con `aria-describedby` e
  `aria-invalid`, focus sul primo errore, messaggi che dicono causa e rimedio; esito dell'invio
  annunciato (`aria-live`).
- **A11Y-13** — `lang="it"` sul documento.
- **A11Y-14** — La **biglietteria di TicketingHub** gira in un iframe di terzi che non possiamo
  correggere: la parte nostra (pulsante, box del consenso, ritorno del focus) deve essere a posto, e
  chi non riesce a prenotare online trova telefono ed email nella sezione contatti.
