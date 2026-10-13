---
name: audit
description: "Use whenever someone asks for the Lanternata site or part of it to be reviewed, checked or assessed — \"fai l'audit\", \"controlla la sezione del libro\", \"è pronto per il lancio?\", \"va bene così?\", \"check this section\". Also the quality gate when the page or a section is finished. Audits a section, component, the pending changes or the whole site against docs/standards/ with the specialist agents, writes a report with rule IDs to docs/audits/ and never fixes anything. Usage: /audit [target]"
user-invocable: true
---

# Audit

Review the site against `docs/standards/` and report what diverges.

**This skill never fixes anything.** An audit that silently rewrites twenty files is unreviewable, and
the point is to give the person a decision, not a diff. Fixes are a separate, deliberate act.

## 1. Resolve the target

`$ARGUMENTS` may be a section, a component, a path, a description, or empty.

| Target | Resolve to |
|---|---|
| *(empty)* | the uncommitted changes (`git status`), or the last commit if the tree is clean |
| A section (`il libro`, `#biglietti`, `faq`) | its component in `src/components/`, its `src/data` file, its `.pages.yml` block and its manual section |
| A component or path | those files, plus the pages that render them |
| `sito` / `tutto` / `lancio` | the home, the 404 and the legal pages — one report section per area |
| Free text | work out what they mean, **state your interpretation, the files and their count, and confirm** before starting |

State the resolved files, routes and count before you begin.

## 2. Ask the machine first

Collect what is mechanically knowable **once**, before launching anyone, so no specialist spends its
budget rediscovering it and so they all look at the same evidence.

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 22.23.2
npm run build                               # must pass: if it fails, that is the report
npx astro preview --port 4322 --host 127.0.0.1   # in the background; the ONLY server of the audit
npx lighthouse http://127.0.0.1:4322/ --form-factor=mobile --output=json \
  --output-path=.playwright-mcp/audit/lh-home.json --chrome-flags="--headless=new" --quiet
```

- **Lighthouse**: three runs, keep the median scores and the failing audits.
- **Built HTML** (`dist/index.html`, `dist/404.html`, legal pages): number of `<h1>`, `<title>`, meta
  description, canonical, OG image type, `robots` meta, and whether each JSON-LD block parses. Plus
  `dist/robots.txt`. The indexing gate (`SEO-10`) is always checked.
- **Browser pass** (you drive it): at 320, 375, 390×844, 375×667, 768, 1024, 1440 and 1920 — a
  full-page screenshot in `.playwright-mcp/audit/` and the overflow / wide elements / small-target
  measurement from `responsive-specialist`. One more set at 375 with `prefers-reduced-motion: reduce`.
  Chrome headless gives full-page screenshots; the app's preview pane freezes animations and does not
  capture below the fold.

**Known debt is not a finding.** Read the "Debito noto" table in `docs/standards/README.md` and the
"Da chiudere prima del go-live" section of `docs/in-development/HANDOFF.md`. Entries matching the
target go in the report as **known debt**, distinct from anything new.

Carry into the next step:

| List | From |
|---|---|
| Machine findings | build, Lighthouse, built HTML, measurements |
| Evidence | screenshot paths, Lighthouse JSON paths, preview URL |
| Known debt | `docs/standards/README.md`, `docs/in-development/HANDOFF.md` ("Da chiudere prima del go-live") |

## 3. Fan out

Launch in parallel, in one message, each in **review-only** mode:

| Specialist | Covers | When |
|---|---|---|
| `accessibility-specialist` | WCAG 2.2 AA — **blocking** | always |
| `responsive-specialist` | layout across widths | always for layout |
| `performance-specialist` | Lighthouse, weight, CWV | always for the page; for components when images, fonts or JS changed |
| `seo-specialist` | metadata, JSON-LD, indexing gate | layout, metadata, data feeding the JSON-LD |
| `design-specialist` | composition, hierarchy, states, motion, `DES-` rules | whenever UI is in the target |
| `cms-specialist` | hardcoded content, JSON ↔ `.pages.yml` ↔ components, manual | always |
| `copy-specialist` | tone, accuracy, the book, AI clichés, answer-first | whenever texts are in the target |
| `code-standards-specialist` | code form against `CODE-` rules | always |

Tell each one explicitly:

- **REVIEW-ONLY — do not modify any file, do not run `git add`, `commit`, `push` or `stash`.**
- the resolved **file list and routes** — do not sweep the codebase;
- the **preview URL**, the **Lighthouse JSON** and the **screenshot paths** — **do not start a server
  and do not run Lighthouse**;
- **the browser is single**: only `accessibility-specialist` drives it (keyboard and focus need it);
  everyone else works from the screenshots and measurements. If another specialist truly needs the
  browser, run it after `accessibility-specialist` finishes, not alongside;
- the **machine findings and known debt**, and what to do with them: confirm and explain what actually
  goes wrong, but do not spend the budget rediscovering them. Their value is what the machine cannot
  see — whether a contrast holds over the moon, whether a layout is designed or squeezed, whether a
  string is content the client will want to change, whether a sentence sounds like any event anywhere.

For `sito` or `lancio`, keep the fan-out within one message but give each specialist its share of the
evidence, so nobody re-collects it.

## 4. Report

Write the report in Italian to `docs/audits/<YYYY-MM-DD>-<target>.md` and give a short summary in the
terminal. The file is what turns into work.

Group findings **by rule**, not by file — five instances of `CMS-01` are one decision, not five.

```markdown
# Audit: <target>
<data> · <n> file · <route> · canone al commit <short hash, o "non committato">

## Sintesi
| Gravità | Numero |
|---|---|
| Bloccante — AA fallito, build rotto, sito indicizzabile, contenuto perso, libro citato male | n |
| Maggiore — regola violata con effetto visibile al cliente o all'utente | n |
| Minore — convenzione | n |
| Debito noto — già registrato | n |

Lighthouse mobile (mediana di 3): Performance n · Accessibility n · Best Practices n · SEO n · LCP n s · CLS n · TBT n ms

## A11Y-02 — Contrasto misurato
**Bloccante** · 2 occorrenze

- `src/components/X.astro:12` — lantern su paper, 2.1:1
- ...

**Perché conta:** <una o due righe, con le conseguenze concrete>
**Perimetro (GIT-06):** fix sul posto / passo successivo — <quale, e perché>
```

Order by severity, blocking first. For every finding:

- the **rule ID** and its one-line statement;
- every **file and line** (or width, or route) where it occurs;
- **why it matters**, in terms of what goes wrong — not a restatement of the rule;
- whether it is a **fix in place** or a **next step**, per the containment test (`GIT-06`).

Close with:

- **new** findings separated from **known debt** — mixing them makes a report look worse than the change
  that prompted it, and hides what actually regressed;
- what was checked and found **correct** — without it, nobody can tell thorough from cursory;
- anything judged **borderline and deliberately left alone**, and why;
- what could **not** be checked, and what that would need.

Stop the preview server and leave the evidence in `.playwright-mcp/audit/` (never committed, `GIT-05`).

## 5. Offer, don't act

End by offering the obvious next steps — fix the blocking findings, fix a specific finding, or add the
next steps to the handoff — and wait. Do not start any of them.
