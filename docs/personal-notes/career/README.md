# Career Docs — Markdown → PDF

Single source of truth for resume content. The three `resume-*.md` files are
the canonical, always-up-to-date version of my professional career info —
edit them in plain markdown, then regenerate the PDFs with one command. The
visual result replicates the original Word template (Carlito font, purple
accents, gray header band).

This folder is tracked in git (unlike the rest of `docs/personal-notes/`,
which stays gitignored) so this content is never lost.

## Workflow

```bash
# Regenerate all 3 PDFs into output/
node docs/personal-notes/career/build-pdfs.mjs

# Regenerate only one
node docs/personal-notes/career/build-pdfs.mjs resume-en

# Regenerate all AND copy them into public/resumes/ (the live site downloads)
node docs/personal-notes/career/build-pdfs.mjs --publish

# Or drive the whole thing from a browser instead of the CLI
npm run resume-editor   # → http://127.0.0.1:5055 (local only)
```

The build also writes `output/resume-*.html` — open one in a browser to
inspect/tweak styling quickly without regenerating PDFs.

No extra dependencies: the script resolves `js-yaml` and `playwright` from
the repo's own `node_modules`.

## Files

| File                | Purpose                                                         |
| ------------------- | --------------------------------------------------------------- |
| `resume-en.md`      | English resume (source of truth)                                |
| `resume-es.md`      | Spanish resume                                                  |
| `resume-pt-BR.md`   | Portuguese resume                                               |
| `styles.css`        | Visual template (colors/fonts extracted from original)          |
| `build-pdfs.mjs`    | md → HTML → PDF converter (Playwright/Chromium)                 |
| `editor-server.mjs` | Local-only (`127.0.0.1`) HTTP server backing the browser editor |
| `editor.html`       | Browser UI: edit markdown, preview, trigger builds              |
| `fonts/`            | Carlito TTFs (free, metrically-compatible Calibri substitute)   |
| `output/`           | Generated PDFs + intermediate HTML (tracked for convenience)    |

### Why Carlito, not Calibri?

The original Word template used Calibri, and early versions of this pipeline
used the Calibri `.ttf` files copied from a locally licensed Word install.
Once this folder became git-tracked, that stopped being safe:

- **Calibri is proprietary.** It's licensed by Microsoft (designed by
  Monotype), bundled with Windows/Office. That license covers _using_ the
  font on your own machine/documents — it does not grant the right to
  _redistribute_ the font software itself as standalone files.
- **A git repo with a remote is a redistribution channel.** Anyone who
  clones or forks the repo gets an exact copy of the licensed font files,
  not just the resume content. Font foundries (Monotype included) have sent
  GitHub DMCA takedowns for repos redistributing Calibri/Arial/other
  MS-licensed fonts before — this isn't hypothetical.
- **Git history is permanent.** Once pushed, a committed font file stays in
  history even if later deleted from HEAD — fully purging it means
  rewriting history, which risks breaking clones/PRs.

[Carlito](https://fonts.google.com/specimen/Carlito) is Google/Red Hat's
free, SIL Open Font License font, purpose-built as a metrically-compatible
substitute for Calibri (same glyph widths/line breaks, so the PDF layout is
identical) — safe to commit and redistribute with no licensing risk.
Install via `brew install --cask font-carlito` if you need to regenerate
`fonts/`. One tradeoff: Carlito ships only Regular/Bold/Italic/BoldItalic —
no distinct "Light" weight — so the header name renders at regular weight
instead of Calibri Light.

## Markdown format (constrained subset)

**Frontmatter** (YAML): `lang`, `name` (list of header lines; wrap a line in
`**…**` for bold), `location` (`label` + `url`) and `links` (list of
`label` + `url`) for the header band.

**Body:**

| Syntax                               | Renders as                                                   |
| ------------------------------------ | ------------------------------------------------------------ |
| `## TITLE <!-- icon: education -->`  | Section with purple circle icon                              |
| `<!-- icon: skills, columns: 2 -->`  | …with a two-column bullet list (Skills)                      |
| `### Role \| Company`                | Job/degree title: purple before the `\|`, black after        |
| `#### MAR 2023 – …: **3 YEARS**`     | Gray date line (bold parts render black)                     |
| `- item`                             | Bullet list                                                  |
| `\- text`                            | Paragraph that _starts_ with a literal hyphen (not a bullet) |
| `**bold**` / `_italic_` / `[t](url)` | Inline emphasis and links                                    |
| `<!-- pagebreak -->`                 | Explicit page break (placed before EXPERIENCE)               |

Available icons: `objective`, `education`, `experience`, `skills`, `activities`
(add new ones in the `ICONS` map in `build-pdfs.mjs`).

> **Italic syntax note:** use `_underscore_`, not `*asterisk*`. Prettier's
> markdown formatter (run on every commit via the pre-commit hook) silently
> rewrites `*text*` back to `_text_`, and `build-pdfs.mjs`'s parser only
> recognizes the underscore form — asterisk italics will render as literal
> text with asterisks.

**Design tokens** (extracted from the original PDFs): accent `#77448B`,
links `#886288`, header band `#F7F7F7`, body text `#4C4C4C`,
headings `#111`. Body 10pt Carlito; name 28pt Carlito regular (no Light
weight available — see fonts note above).

## Roadmap

- [ ] Simple UI to edit content and trigger builds
