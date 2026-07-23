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

- **The exact fonts.** The original used Microsoft **Calibri** (Light /
  Regular / Bold). Those exact TTF files were copied from the locally
  installed Microsoft Word app bundle into `fonts/` and embedded via
  `@font-face`, so the typeface is identical rather than a substitute.
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
- **Fonts are not committed to a public repo** — the Calibri TTFs are licensed
  with the local Office install. They're fine in this gitignored folder for
  personal/local builds, but should not be pushed to a public repository.
- **Two intentional fidelity differences** from the Word original: the Skills
  badge is a single wrench (the original had crossed hammer-and-wrench), and
  vertical spacing is normalized by the stylesheet rather than replicating the
  original's manual blank lines. Both are invisible unless compared
  side-by-side.

## Roadmap

- [ ] Move this folder to a **private repo** — it is currently _not_ backed up
      by git, so these files exist only on this machine.
- [ ] Build a **simple UI** to edit the content and trigger builds without the
      command line.
- [ ] Optionally match the Skills badge icon to the original crossed-tools glyph.
