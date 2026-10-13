---
name: ship
description: "Use whenever someone starts a piece of work on the Lanternata site — \"rifai la sezione del libro\", \"aggiungi una FAQ\", \"metti il sold out sul primo weekend\", \"sistema l'hero su mobile\", \"cambiamo le foto della galleria\", \"let's build X\". Takes it from intake to online: checks what is already decided, asks what is ambiguous before planning, plans it, builds it to the project standards with the right specialists, verifies it in a real browser, shows it and waits for the ok, then commits and publishes — and walks a delicate change (go-live, domain, indexing, DNS, CMS field changes, the ticket widget) through a runbook. Usage: /ship <description of the work>"
user-invocable: true
---

# Ship

Five stages with real gates between them. Do not skip ahead: each gate exists because the failure it
prevents is expensive and invisible at the time it happens.

The gates are what matter. The specialists in `.claude/agents/` are how each part gets done well; if
one is unavailable, do its part yourself against the same file in `docs/standards/`.

---

## Stage 1 — Intake

**Get the work.** `$ARGUMENTS` is a description: a section, a fix, a content change. Restate it in one
line as the job it does for the business — **fill the places** for the two weekends, or **make the book
and its message known** — because that decides what the section must push.

**Find out what is already decided.** Before asking anything, read:

- `docs/in-development/HANDOFF.md` — current state, what is in progress, what is missing from the client;
- `docs/standards/design.md` → `DES-10` — what has already been **rejected**. Never re-propose it;
- the sibling section on the sister site `../bosco-della-luna-campo-di-zucche`, if there is one.

**Check it is actually ready.** Say precisely what is missing, and ask — do not fill the gap with a
plausible assumption:

- **content**: does the copy exist (client, to be written)? Prices, times, phone and reviews are the
  client's to give, never invented (`CMS-10`); book facts come only from the publisher or the author
  (`COPY-06`);
- **assets**: real photos available, an SVG to draw, or an illustration to generate (`MEDIA-02`)?
- **dependencies**: does it need something not there yet (the domain, the lanternata's own
  TicketingHub widget, the real photos)?

**Check the working tree.** `git status`, and `git pull` once the repo has a remote (`GIT-02`: the
client saves from Pages CMS straight to `main`). If there are uncommitted changes that are not this
work, say so before touching anything.

---

## Stage 2 — Interrogate

Ask about every genuine ambiguity **before** planning. The test for a question worth asking: *would
different answers lead to materially different output?* If yes, ask. If no, decide and say what you
decided.

Not "shall I proceed" — that is not a question. Ask the ones like:

- which is the one action this section pushes, and where does it lead?
- is the copy ours to draft, or does it come from the client or the author?
- real photo, SVG or generated illustration — and does it touch the book's characters (`DES-14`)?
- what does the section show when a CMS field is empty?
- does this replace something the client has already seen and approved?

Ask them **one at a time**. Read the relevant `docs/standards/` files first — half the questions answer
themselves there, and asking one the canon already answers wastes the person's trust.

---

## Stage 3 — Plan

Enter plan mode. The plan names, concretely:

- which **files** change;
- the **content model**: new fields in `src/data/*.json` and `.pages.yml`, their Italian labels, and the
  manual section that documents them (`CMS-03`, `CMS-04`, `CMS-14`);
- which **specialists** do which part (see the table in `CLAUDE.md`);
- which **canon rules** constrain the work, by ID;
- which **assets** are needed and where they come from;
- how it will be **verified**: widths, reduced motion, the flows to click through;
- whether the work **finishes the page or a section** — then stage 4 ends with the `/audit` quality gate;
- whether the change is **delicate** (`GIT-07`), decided now rather than discovered at release.

**Get approval before writing code.** A rejected plan is not approval, and it is not permission to
start a smaller version of it.

---

## Stage 4 — Build

Normal workflow, bound by the canon.

- **Read the standards files that apply** before writing (`coding-standards` skill, or the paths
  directly). Do not infer the rules from nearby code — that is how divergence spreads.
- **Delegate to the specialist whose subject matches**: `design-specialist` for the composition,
  `asset-specialist` for images, `cms-specialist` for the fields, `copy-specialist` for the words,
  `seo-specialist` for metadata and structured data, `accessibility-specialist` for any non-trivial
  widget. Independent parts go in parallel.
- **Content goes in the CMS from the first line** (`CMS-01`), never "hardcoded for now".
- **Every new asset is shown to the client before it is final** (`MEDIA-04`).
- **Apply the Boy Scout rule within its containment test** (`GIT-06`): improve what you touch; what
  would spill into other files becomes a next step in the handoff.
- **Build**: `nvm use 22.23.2 && npm run build` must pass (`CODE-13`).
- **Verify in a real browser** (`GIT-09`): desktop 1440 and a phone (390×844, plus 375×667 when the
  layout is tall), `prefers-reduced-motion`, and a click through every interactive element you touched.
- **Review by a different instance.** The instance that built something never reviews it: run
  `code-standards-specialist` and `cms-specialist` on the changed files, in parallel, plus
  `copy-specialist` when texts changed. Skip only for a trivial, mechanical change.
- **When the work finishes the page or a section**, run `/audit` on it as the quality gate. Not after
  every component. The accessibility verdict is blocking.

---

## Stage 5 — Show, then release

### Show and stop

Show the user what changed (`GIT-01`): screenshots desktop and mobile, the local preview URL, a short
summary of the diff and of any open decision. Then **stop and wait**. An ok on a previous change is not
an ok on this one.

### On an explicit ok

1. Commit in Italian, in the style of the sister site's messages (`GIT-03`), without working artifacts
   (`.playwright-mcp/`, `dist/`, generated files, scratch files — `GIT-05`).
2. Once the repo has a remote: push to `main`, follow the deploy, and check the change on the live
   URL. Report what you checked, not "it's deployed".
3. Clean `.playwright-mcp/`, and offer `/handoff` if the session is ending.

### Delicate changes

Engage this only when the change is delicate (`GIT-07`): go-live and the domain, the indexing flag,
DNS or Cloudflare settings, the GitHub repo and the Pages project, a CMS field renamed or removed, the
TicketingHub widget swapped while sales are open. If none apply, say so explicitly and stop after the
release above.

Write a runbook and **label every step with who performs it — [TU] or [CLAUDE]**. A step whose owner is
ambiguous gets skipped or done twice.

```markdown
### Prima del go-live
1. **[CLAUDE]** Build con PUBLIC_SITE_INDEXABLE=true in locale e verifica di robots.txt e meta robots
2. **[TU]** Controlla <il flusso specifico> sull'anteprima

### Go-live
3. **[TU]** <l'interruttore: DNS / dashboard Cloudflare / variabile d'ambiente del progetto Pages>
4. **[CLAUDE]** Verifica <controllo esatto> e riporta cosa hai visto
```

The rules this part exists to enforce:

- **The user throws the production switches** (`GIT-08`): DNS, Cloudflare, `PUBLIC_SITE_INDEXABLE=true`.
  Hand over the exact values and commands; do not flip them.
- **`noindex` comes off only on go-live day** (`SEO-10`), on the final domain.
- **A renamed CMS field migrates the client's data in the same commit** (`CMS-09`).
- **Walk it interactively**: one step, confirm, the next. Do not hand over one wall of steps and
  disappear. A missing error is not evidence of success — say what you actually checked.
