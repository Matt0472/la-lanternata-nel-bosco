# Performance — `PERF-`

- **PERF-01** — **Lighthouse mobile ≥ 95** su Performance, Accessibility, Best Practices e SEO, misurato
  sulla **build di produzione** (`astro preview`), non sul dev server. Tre misure, si tiene la mediana.
- **PERF-02** — **LCP < 2.5 s** su mobile. L'hero non aspetta il JavaScript (`CODE-11`): la scena è un
  SVG leggero con `fetchpriority="high"`, mai lazy; le entrate del testo sono animazioni CSS che
  partono al primo disegno. L'intro delle lucciole è solo CSS e non blocca il rendering.
- **PERF-03** — **CLS ~0**: spazio riservato a immagini, font, al riquadro di hCaptcha e al pulsante
  della biglietteria.
- **PERF-04** — **Immagini** in formato moderno, dimensionate per il riquadro in cui finiscono, con
  `width`/`height`, **lazy sotto la piega**. Il ventaglio della galleria usa le miniature WebP 640px;
  l'originale lo carica solo il lightbox.
- **PERF-05** — **Font self-hosted** (`@fontsource`) con `font-display: swap`; i due file latini usati
  (Fraunces SOFT, Figtree) si **precaricano** dalla `<head>` con `crossorigin`. Niente corsivi né
  altri assi caricati senza un uso.
- **PERF-06** — **CSS/JS minimi**: `inlineStylesheets: 'always'` nel build, nessun runtime di
  framework (`CODE-08`), TBT ~0. Gli effetti continui (lucciole, recensioni) si fermano fuori schermo.
- **PERF-08** — Le **terze parti** non pesano sul primo caricamento: TicketingHub dopo il consenso,
  hCaptcha alla prima interazione col modulo (`CODE-09`).
- **PERF-09** — **Gli effetti costosi non si fanno**: la performance viene prima dello spettacolo
  (`DES-02`). Un effetto nuovo si misura prima e dopo.
