# Git, verifica e go-live — `GIT-`

Si lavora su **`main`** del repository **`Matt0472/la-lanternata-nel-bosco`** (pubblico). **Ogni push
su `main` va online** sull'anteprima **https://lanternata-anteprima.mapped-dev.it** (GitHub Pages,
`noindex`). La produzione è **https://lanternata.it** su Cloudflare Pages (go-live in corso), e a
go-live verificato l'anteprima si spegne; da quando il
cliente userà Pages CMS, anche i suoi salvataggi saranno commit su `main`.

## Commit e push

- **GIT-01** — **Mai commit né push senza un ok esplicito nella conversazione.** Finito un lavoro, si
  **mostra** cosa è cambiato (screenshot desktop e mobile, anteprima locale, riepilogo del diff) e ci si
  ferma. Vale anche per i fix piccoli. Un ok su una modifica non vale per la successiva.
- **GIT-02** — Prima di lavorare, `git pull`. Ogni push su `main` fa partire
  `.github/workflows/pages.yml`, che pubblica l'anteprima in circa un minuto: si segue la run
  (`gh run watch`) e si controlla l'anteprima online, riportando cosa si è visto. Il workflow non
  imposta mai `PUBLIC_SITE_INDEXABLE` (`SEO-10`).
- **GIT-03** — Messaggi di commit **in italiano**, nello stile del gemello: una riga che dice cosa
  cambia per chi usa il sito (es. "Biglietteria: il pulsante di acquisto ora è nostro"), con il
  trailer di attribuzione in fondo.
- **GIT-04** — **Il repository è pubblico.** Nessun segreto nei file tracciati: le chiavi stanno in
  `.env` (gitignored).
- **GIT-05** — Non si committano artefatti di lavoro: screenshot e report (`.playwright-mcp/`),
  `dist/`, file generati (manuale pubblico, miniature), script usa e getta dello scratchpad.

## Perimetro

- **GIT-06** — **Regola del boy scout, con contenimento**: ciò che tocchi lo porti allo standard; se
  sistemarlo richiede di toccare file che la modifica non tocca già, non allargare il diff: annotalo
  come passo successivo nell'handoff.

## Verifica

- **GIT-09** — Ogni modifica visibile si **verifica in un browser vero** prima di mostrarla: desktop
  1440 e telefono 390×844 (più 375×667 se il layout è alto), sotto la piega, con
  `prefers-reduced-motion`, cliccando ogni elemento interattivo toccato. Il pannello di anteprima
  dell'app congela le animazioni e non cattura sotto la piega: va bene per un'occhiata, non come
  prova. Per gli screenshot a tutta pagina si usa Chrome headless (o Playwright MCP, se disponibile).

## Modifiche delicate e go-live

- **GIT-07** — Sono **delicate**: il go-live e la scelta del dominio, il flag di indicizzabilità, DNS e
  impostazioni Cloudflare, un campo CMS rinominato o rimosso (`CMS-09`), il cambio del widget
  TicketingHub a vendite aperte, qualunque cosa non si annulli con un revert. Si fanno con un
  **runbook** i cui passi dicono chi li esegue, **[TU]** o **[CLAUDE]**, e si percorrono insieme un
  passo alla volta.
- **GIT-08** — **Gli interruttori di produzione li aziona l'utente**: DNS, dashboard Cloudflare,
  `PUBLIC_SITE_INDEXABLE=true` il giorno del go-live. Claude prepara i comandi esatti e verifica dopo.
