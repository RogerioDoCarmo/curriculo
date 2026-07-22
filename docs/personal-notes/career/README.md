# Career Docs — Markdown → PDF

Single source of truth for resume content. The three `resume-*.md` files are
the canonical, always-up-to-date version of my professional career info —
edit them in plain markdown, then regenerate the PDFs with one command. The
visual result replicates the original Word template (Calibri fonts, purple
accents, gray header band).

This folder is inside `docs/personal-notes/`, which is **gitignored** —
nothing here is committed or published.

## Workflow

```bash
# Regenerate all 3 PDFs into output/
node docs/personal-notes/career/build-pdfs.mjs

# Regenerate only one
node docs/personal-notes/career/build-pdfs.mjs resume-en

# Regenerate all AND copy them into public/resumes/ (the live site downloads)
node docs/personal-notes/career/build-pdfs.mjs --publish
```

The build also writes `output/resume-*.html` — open one in a browser to
inspect/tweak styling quickly without regenerating PDFs.

No extra dependencies: the script resolves `js-yaml` and `playwright` from
the repo's own `node_modules`.

## Files

| File              | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| `resume-en.md`    | English resume (source of truth)                       |
| `resume-es.md`    | Spanish resume                                         |
| `resume-pt-BR.md` | Portuguese resume                                      |
| `styles.css`      | Visual template (colors/fonts extracted from original) |
| `build-pdfs.mjs`  | md → HTML → PDF converter (Playwright/Chromium)        |
| `fonts/`          | Calibri TTFs copied from the local MS Word app bundle  |
| `output/`         | Generated PDFs + intermediate HTML (disposable)        |

> **Fonts note:** the `fonts/` TTFs are Microsoft Calibri, copied from the
> locally licensed Office install (`/Applications/Microsoft Word.app/…/DFonts`).
> Fine for personal use/local builds; don't redistribute them in a public repo.

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
| `**bold**` / `*italic*` / `[t](url)` | Inline emphasis and links                                    |
| `<!-- pagebreak -->`                 | Explicit page break (placed before EXPERIENCE)               |

Available icons: `objective`, `education`, `experience`, `skills`, `activities`
(add new ones in the `ICONS` map in `build-pdfs.mjs`).

**Design tokens** (extracted from the original PDFs): accent `#77448B`,
links `#886288`, header band `#F7F7F7`, body text `#4C4C4C`,
headings `#111`. Body 10pt Calibri; name 28pt Calibri Light.

## Roadmap

- [ ] If this works well, move to a private repo (this folder is not backed up by git!)
- [ ] Simple UI to edit content and trigger builds
