---
name: coding-standards
description: "Use before writing or reviewing anything on the Lanternata site, and whenever someone asks how this project does something — \"dove va questo testo?\", \"posso usare questo colore?\", \"come si cita il libro?\", \"come chiamo il componente?\", \"si può indicizzare?\", \"posso usare questa foto?\", \"where should this live\". Loads the project standards: content vs structure and Pages CMS, copy and the book, code, design system and client decisions, media, accessibility, performance, responsive, SEO and indexing, git and go-live. Answer from these rather than from memory, and cite the rule ID."
user-invocable: true
---

# Coding standards

The standards live in `docs/standards/`. This skill is an index — it holds no rules of its own, so
there is only ever one copy to keep current.

**Read the file that matches what you are doing. Do not work from memory or from surrounding code.**

| Doing | Read |
|---|---|
| Anything | `docs/standards/README.md` — index, where things live, non-negotiables, known debt, how to change a rule |
| Adding copy, images, links or data; touching `src/data` or `.pages.yml`; the client manual | `docs/standards/contenuti-cms.md` — `CMS-` |
| Writing or reviewing Italian copy; anything about the book | `docs/standards/copy.md` — `COPY-` |
| Writing components, layouts, CSS or scripts; adding a dependency; config | `docs/standards/codice.md` — `CODE-` |
| Designing or restyling; colours, type, motion; anything the client may have already rejected | `docs/standards/design.md` — `DES-` (tokens in `src/styles/global.css`, intent in `design-system/lanternata/MASTER.md`) |
| Illustrations, AI images, photos, the book cover, logo, favicon, social image | `docs/standards/media.md` — `MEDIA-` |
| Any interactive element, contrast, motion, forms | `docs/standards/accessibilita.md` — `A11Y-` |
| Images, fonts, JS/CSS weight, the hero | `docs/standards/performance.md` — `PERF-` |
| Layout at any width | `docs/standards/responsive.md` — `RESP-` |
| Metadata, structured data, robots, indexing | `docs/standards/seo.md` — `SEO-` |
| Committing, verifying, go-live | `docs/standards/git.md` — `GIT-` |

When the standards do not cover a case, look at how the sister site solved it
(`../bosco-della-luna-campo-di-zucche`, `CODE-05`) and say that is what you are following.

## How to use them

- The canon is the **authority**. Where your judgement differs, the file wins.
- Every rule has an ID (`CMS-01`, `DES-10`, `SEO-10`). Cite it when you raise something or answer a
  question.
- If a rule seems wrong for the task in front of you, **say so and stop.** Do not improvise a
  variation. `docs/standards/README.md` explains how a rule gets changed.
- Entries in the "Debito noto" table are accepted for now: they are fixed when that code is touched
  (`GIT-06`), not on sight.
