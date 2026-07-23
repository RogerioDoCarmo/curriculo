# How the Resume Pipeline Works

This document explains the _why_ and _how_ behind the markdown-driven resume
system in this folder. For the copy-paste command reference and the full
markdown syntax table, see [`README.md`](./README.md); this is the narrative
walkthrough.

## The problem it replaces

The resume used to live as **three Microsoft Word documents** (English,
Spanish, Portuguese). Every update meant:

1. Editing three `.docx` files by hand.
2. Manually exporting each one to PDF.
3. Keeping formatting consistent across all three by eye.
4. Copying the resulting PDFs into the site's `public/resumes/` folder.

That is a lot of manual, error-prone steps, and the Word files were a poor
"source of truth" for feeding resume content elsewhere (e.g. answering
recruiter questions, or reusing the text in this project). Binary `.docx`
files also don't diff, so it was impossible to see _what_ changed between
versions.

## The solution in one sentence

**Keep the content as plain markdown, and generate the PDFs on demand** —
so the text is the canonical, diffable, reusable source, and the polished
PDF is a build artifact you can recreate any time with one command.

## The big picture

```text
  resume-en.md ─┐
  resume-es.md ─┤   build-pdfs.mjs                       output/*.pdf
  resume-pt.md ─┘        │                                     │
                         ▼                                     ▼
   ┌──────────────────────────────────────────┐        ┌──────────────┐
   │ 1. parse YAML frontmatter (js-yaml)       │        │  --publish   │
   │ 2. convert markdown body → HTML           │  ───▶  │  copies into │
   │ 3. inline styles.css + Calibri fonts      │        │ public/      │
   │ 4. render HTML → PDF with Playwright       │        │  resumes/    │
   └──────────────────────────────────────────┘        └──────────────┘
```

Everything runs on dependencies the project already has
(`js-yaml` and `playwright` from the repo's `node_modules`) — no new
packages were added.

## How each stage works

### 1. The markdown source

Each `resume-*.md` has two parts:

- **YAML frontmatter** — the structured header data: language, the name lines,
  the location link, and the contact links (email / LinkedIn / site). This is
  data, not prose, so it lives as structured fields rather than markdown.
- **Markdown body** — the actual resume content (objective, education,
  experience, skills, activities) written as normal headings, bold, italics,
  bullet lists, and links.

Sections are tagged with a small HTML-comment "directive" to control rendering,
for example:

```markdown
## EXPERIENCE <!-- icon: experience -->

## SKILLS <!-- icon: skills, columns: 2 -->
```

The `icon:` picks which purple circular badge to draw; `columns: 2` renders
that section's bullets in two columns (used by Skills). A `<!-- pagebreak -->`
comment forces the page break before EXPERIENCE so each language lands on two
pages, matching the original.

### 2. Markdown → HTML

`build-pdfs.mjs` contains a **small, purpose-built markdown parser** — not a
general library. It only understands the subset this resume uses (the syntax
table in `README.md`), which keeps the output completely predictable and
avoids pulling in a dependency. It maps:

- `## Title` → a section with its icon badge
- `### Role | Company` → a job/degree heading (purple before the `|`, black after)
- `#### DATE` → the gray date line
- `- item` → bullets, `**bold**` / `*italic*` / `[text](url)` → inline styling

The result is assembled into a single self-contained HTML document with
`styles.css` inlined.

### 3. Reproducing the original visual design

The goal was that the generated PDF looks like the Word original, not merely
"close." Two things made that possible:

- **The fonts.** The original used Microsoft **Calibri** (Light / Regular /
  Bold). Early versions of this pipeline embedded the exact Calibri TTFs
  copied from a locally installed Word app bundle, but Calibri is
  Microsoft-licensed and can't be redistributed through a public git repo.
  Once this folder became git-tracked, those files were swapped for
  **Carlito** — Google/Red Hat's free, metrically-compatible substitute
  (identical glyph widths and line breaks) — embedded via `@font-face` from
  `fonts/`. Carlito has no distinct "Light" weight, so the header name
  renders at regular weight instead of Calibri Light; otherwise the layout
  is pixel-identical. See `README.md`'s "Why Carlito, not Calibri?" section
  for the full licensing rationale.
- **The exact colors.** The accent purple (`#77448B`), link purple
  (`#886288`), header band gray (`#F7F7F7`), and body text gray (`#4C4C4C`)
  were read straight out of the original PDF's color operators, not guessed.

### 4. HTML → PDF

Playwright (headless Chromium, already installed for this project's E2E tests)
loads the HTML and calls `page.pdf()` with A4 size, backgrounds enabled, and
tuned margins. Chromium's print engine gives faithful, high-quality PDF output
with selectable text and working hyperlinks.

## Everyday workflow

```bash
# 1. Edit the content
#    docs/personal-notes/career/resume-en.md   (and es / pt-BR)

# 2. Rebuild the PDFs into output/
node docs/personal-notes/career/build-pdfs.mjs

# 3. (Optional) build just one language
node docs/personal-notes/career/build-pdfs.mjs resume-en

# 4. When happy, publish to the live site's download folder
node docs/personal-notes/career/build-pdfs.mjs --publish
```

The build also writes `output/resume-*.html`, so you can open a language in a
browser and tweak styling quickly without regenerating the PDF each time.

## Browser-based editor

`npm run resume-editor` starts `editor-server.mjs`, a dependency-free Node
`http` server bound to `127.0.0.1` only (port `5055`, overridable via `PORT`)
that serves `editor.html` — a small split-pane UI (markdown source on the
left, live preview `<iframe>` on the right) with per-language tabs, a Save
button, and Build / Build & Publish buttons.

It's a thin wrapper around the same two building blocks above, not a
separate implementation:

- `GET/PUT /api/resumes/:id` read and write a `resume-*.md` file directly —
  Save just persists the textarea content to disk.
- `POST /api/build` shells out to `build-pdfs.mjs` via `child_process.spawn`
  (optionally with `--publish`), and streams its stdout/stderr back as a log
  shown in the UI.
- `GET /preview/:id.html|.pdf` serves the build's own `output/` files back
  to the browser for the preview pane and the "Open PDF" link.

This exists so the whole edit → rebuild → publish loop can be driven from a
browser tab instead of the terminal, without changing how the pipeline
itself works underneath.

## Publishing and git

`--publish` copies the PDFs into `public/resumes/`, which **is** tracked by
git (unlike this `docs/personal-notes/` folder, which is gitignored). So after
publishing, those three PDFs show up as modified files. Because direct commits
to `main` are blocked by the pre-commit hook, getting them onto the live site
means a **branch + pull request** with just the three PDFs.

To discard a publish before committing:

```bash
git checkout public/resumes/
```

## Design decisions and tradeoffs

- **Custom mini-parser over a markdown library** — keeps the dependency
  footprint at zero and the rendering 100% predictable, at the cost of only
  supporting the documented subset. If a new construct is needed, extend the
  parser.
- **Fonts are committed, but Carlito, not Calibri** — Calibri is licensed
  with the local Office install and can't be redistributed through a public
  repo, so the committed `fonts/` TTFs are Carlito, a free/OFL substitute
  with matching metrics. This folder is git-tracked (unlike the rest of
  `docs/personal-notes/`, which stays gitignored) specifically because the
  font problem was solved this way, rather than by keeping the folder
  private/untracked.
- **Two intentional fidelity differences** from the Word original: the Skills
  badge is a single wrench (the original had crossed hammer-and-wrench), and
  vertical spacing is normalized by the stylesheet rather than replicating the
  original's manual blank lines. Both are invisible unless compared
  side-by-side.

## Roadmap

- [x] ~~Move this folder to a private repo~~ — resolved differently: switching
      from Calibri to Carlito removed the licensing blocker, so the folder was
      carved out of the gitignored `docs/personal-notes/` and is now
      git-tracked directly in this repo instead.
- [x] Build a **simple UI** to edit the content and trigger builds without the
      command line — see `editor-server.mjs` / `editor.html`,
      `npm run resume-editor`.
- [ ] Optionally match the Skills badge icon to the original crossed-tools glyph.
