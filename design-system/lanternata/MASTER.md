# Design System — La Lanternata al chiaro di luna (MASTER)

Intento del design. I valori dei token sono implementati in `src/styles/global.css` (`@theme` Tailwind
v4) e **vincono su questo file** (`DES-01`). Le regole stanno in `docs/standards/design.md`.

## Sintesi

Una **fiaba notturna illustrata**: la pagina si legge come un albo per bambini sfogliato al chiaro di
luna. La notte è blu profonda e calma, la carta ha il colore caldo della luna, e **la luce delle
lanterne è l'unica cosa che brilla**: ambra calda sui pulsanti, sulle fiamme, sugli occhielli. È la
sorella del Campo di Zucche (stessa struttura, stesso ritmo), con separatori, palette e personaggi
suoi. Mai cupa, mai spaventosa: il buio è il posto dove la luce si vede meglio.

## Palette

| Ruolo | Token | Hex | Uso |
|---|---|---|---|
| Notte | `--color-night` | `#141a33` | sezioni di notte, testo principale su carta |
| Notte morbida | `--color-night-soft` | `#4a5276` | testo secondario su carta |
| Crepuscolo | `--color-dusk` | `#232c52` | superfici sopra la notte (riquadri, velo) |
| Carta | `--color-paper` | `#f6f1e6` | fondo pagina, sezioni chiare |
| Carta calda | `--color-paper-warm` | `#ece3cf` | sezioni chiare alternate |
| Crema | `--color-cream` | `#fffcf5` | card su carta, testo su notte |
| Lanterna | `--color-lantern` | `#f2a23c` | **unico accento**: pulsanti, occhielli e accenti su notte |
| Lanterna chiara | `--color-lantern-light` | `#f7bd63` | hover dei pulsanti |
| Lanterna scura | `--color-lantern-deep` | `#9a4d10` | l'accento **come testo su carta** |
| Bosco | `--color-forest` | `#3f5b47` | note informative |
| Bosco scuro | `--color-forest-deep` | `#2b4233` | testo delle note informative |

### Contrasti misurati (WCAG 2.x)

| Coppia | Rapporto |
|---|---|
| `night` su `paper` / `paper-warm` / `cream` | 15.2 / 13.4 / 16.7 |
| `night-soft` su `paper` / `paper-warm` / `cream` | 6.8 / 6.0 / 7.4 |
| `lantern-deep` su `paper` / `paper-warm` / `cream` | 5.4 / 4.8 / 6.0 |
| `lantern` su `night` / `dusk` | 8.2 / 6.4 |
| `night` su `lantern` / `lantern-light` (testo dei pulsanti) | 8.2 / 10.1 |
| `cream` su `night`, al 100 / 80 / 70 / 60 / 50% | 16.7 / 11.0 / 8.7 / 6.7 / 5.1 |
| `forest-deep` su `forest` al 10% sopra `cream` | 9.2 |
| `night-soft` al 70% su `paper` | **3.4 — non basta per il testo normale** |

Il crema sopra l'ambra (1.9:1) **non si usa mai**: il testo dei pulsanti ambra è `night` (`DES-04`).

## Tipografia

- **Display**: `Fraunces Variable`, file con assi `wght` + `SOFT`, usato con `SOFT 100`: un serif
  morbido, con le terminazioni arrotondate di un albo illustrato. Pesi 500–650 per i titoli, mai
  sintetici. Niente corsivo (non caricato).
- **Testo**: `Figtree Variable`, lo stesso del Campo di Zucche: lega i due siti del parco.
- Body ≥ 16px, interlinea 1.6; titoli interlinea ~1.05–1.15, `text-wrap: balance`.
- Occhielli: maiuscoletto spaziato (`tracking-[0.2em]`, 14px, grassetto).
- Cifre tabellari per prezzi, orari e date.

## Spaziatura, raggi, ombre

- Ritmo della scala Tailwind; sezioni `pb-20 sm:pb-28`, arco in testa `mb-16 sm:mb-20`.
- Separatori: l'arco alterno, una curva ampia come il bordo della luna, verso l'alto e verso il basso a
  turno (`DES-12`): le sezioni dispari dopo l'hero escono bombate come lenti.
- Container `max-w-6xl` con gutter `px-4 sm:px-6`.
- Raggi grandi e morbidi: card `rounded-3xl`, pila «L'esperienza» `2rem`, pulsanti a pillola.
- Ombre tinte di notte (`shadow-night/15`), mai nere piatte; sulla notte l'elevazione la danno il
  crepuscolo e i filetti crema al 10%.

## Movimento

- Easing `--ease-soft` `cubic-bezier(0.22, 1, 0.36, 1)`; entrate 0,8 s dal basso, stagger 0,12 s.
- La luce pulsa piano (lucciole, fiamme, alone): cicli lunghi, ampiezze piccole.
- Intro dell'hero: un velo di notte che si apre mentre le lucciole si alzano e si disperdono, solo CSS,
  a ogni atterraggio (`DES-10`).
- `prefers-reduced-motion` → statico pieno.

## Illustrazione

- Scena dell'hero in SVG: cielo blu che schiarisce verso l'orizzonte, luna piena con alone, tre piani
  di bosco in controluce e un sentiero punteggiato di lanterne accese. Desktop 16:9, telefono 9:16 con
  la luna nel terzo alto.
- Mascotte: un gufetto con la lanterna, cartoon nello stile di casa (`MEDIA-05`), scontornato.
- Marchio: una lanterna di vetro con la fiamma accesa (`public/logo-lanternata.svg`), la stessa della
  favicon.

## Pattern di pagina

Le sezioni e il loro ordine sono in `docs/standards/design.md` (`DES-03`). I pattern vengono dal
gemello: pila di card sticky («L'esperienza»), timeline verticale con medaglioni («La serata»), banda
di notte con elemento protagonista («Il libro», come la Zombie School), riquadri su carta calda
(«I più piccoli»), ventaglio di foto con lightbox, tre colonne di info, biglietteria su notte con
l'albero delle lanterne, recensioni a colonne che scorrono, FAQ ad accordion, contatti con modulo.
