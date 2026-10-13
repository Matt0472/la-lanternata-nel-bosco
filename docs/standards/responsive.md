# Responsive — `RESP-`

- **RESP-01** — **Mobile-first.** Ogni layout si verifica a **320, 375, 768, 1024, 1440 px**, più
  **1920**, un **telefono basso** (375×667) accanto a uno alto (390×844) e un tablet in verticale
  (768×1024). La maggior parte delle famiglie arriva dal telefono, da un social o da WhatsApp.
- **RESP-02** — **Nessuno scroll orizzontale** e nessun overflow a nessuna larghezza. Le decorazioni
  grandi (alone della luna, albero con le lanterne, lucciole) sono ritagliate dalla loro sezione (`overflow: hidden` o
  `clip`), mai lasciate allargare la pagina.
- **RESP-03** — Gutter laterale **≥ 16px su mobile, ≥ 24px da tablet** (`px-4 sm:px-6`).
- **RESP-04** — **Tap target ≥ 44px** per ogni elemento interattivo.
- **RESP-05** — **Immagini fluide** (`max-width: 100%`, `object-fit` corretto, nessuna larghezza fissa
  oltre il viewport); la scena dell'hero ha la sua versione verticale (`DES-09`).
- **RESP-06** — Sezioni a tutto schermo con **`min-height: 100svh`**, mai `100vh`: `svh` non salta
  quando la barra del browser si chiude e tiene la CTA sopra la piega.
- **RESP-07** — Gli effetti agganciati allo scroll (la pila di card «L'esperienza», `position:
  sticky`) si **disattivano sugli schermi bassi** (`max-height: 620px`): diventano un elenco normale.
- **RESP-08** — Ogni layout a più colonne dichiara il suo **fallback sotto 768px nello stesso
  componente**.
- **RESP-09** — La **barra in alto sta su una riga** a ogni larghezza: su telefono restano il marchio,
  il logo del parco al centro e il pulsante di prenotazione con l'etichetta corta; il menu delle
  sezioni compare da 768px, e tra 768 e 1279px il nome scritto lascia spazio alle voci.
