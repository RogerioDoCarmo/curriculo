# 3DS Legacy Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a tiny, text-only (plus one small hero image) HTML page summarizing the live site, built from the site's own content sources, and publish it to `3ds.rogeriodocarmo.com` via GitHub Pages — the one host proven (by testing on the real console) to load on Rogério's original Nintendo 3DS, unlike the main Vercel deployment.

**Architecture:** A pure rendering function in `lib/threeds-page.ts` (mutation-tested, same glob as the rest of `lib/`) turns the site's existing `Experience`/`Project`/`SkillCategory` data into one self-contained HTML string with no CSS or JS. A CLI script (`scripts/generate-3ds-page.ts`, run via `tsx`) wires that function to real data (via the existing `lib/content.ts` loaders) and a resized copy of the hero photo, writing output to a gitignored build folder. Publishing that folder to GitHub Pages (a dedicated branch, isolated from the rest of this repo's `docs/`) and the one-time DNS/GitHub settings are manual, documented steps — this is a novelty page, not part of the main site's build or CI.

**Tech Stack:** TypeScript, Node.js (`tsx` runner — already a devDependency), `sharp` (already a dependency) for image resizing, Jest for unit tests, Playwright for the E2E check (loaded via `file://`, no dev server needed).

**Spec:** `docs/superpowers/specs/2026-11-22-3ds-legacy-page-design.md`

## Global Constraints

- English only — no i18n on this page.
- No CSS (no framework, no `<style>` beyond nothing), no JavaScript.
- Content scope: experience, projects, skills only — **not** `content/posts/`.
- Deliberately terse: section heading + one line per entry, not full descriptions/achievements dumps.
- Exactly one image allowed: a resized/re-encoded copy of the hero photo (`public/images/profile/rogeriodocarmo.png`), never the 1.1 MB original.
- Output must never land inside the Next.js app or its `out/` static export — it is a fully separate artifact.
- `lib/**/*.ts` is Stryker's mutation-testing glob (`stryker.config.json`) — any pure logic placed in `lib/threeds-page.ts` is mutation-tested automatically; keep it literal-value-assertion-friendly.
- Deploy is manual for now (no GitHub Actions wiring) — this task set only produces the generator + the manual publish guide, not automation.
- Site URL for outbound links: `https://rogeriodocarmo.com` (matches the existing literal in `lib/structured-data.ts`).

## Review Focus

- Empty or missing locale content (`getExperiences`/`getProjects`/`getSkills` silently fall back to `pt-BR` if `en` is missing) — the generator must fail loudly instead of quietly shipping Portuguese text on an "English only" page.
- HTML-special characters in real content (an `&`, `<`, `'`, or `"` in a project/experience title or description) must render escaped, not break the markup or get interpreted as a tag.
- A current (ongoing) experience entry has no `endDate` — must render "Present", not `undefined` or a crash.
- An empty experience/project/skills list (e.g. content temporarily removed) must still render a valid, non-crashing page rather than an empty `<ul></ul>` with no feedback that something's wrong.
- The hero image step must fail the build loudly if the source file is missing or `sharp` errors, rather than silently emitting a page with a broken `<img>` — this is a developer-run build tool, not a resilient production path.

---

## Task 1: Pure rendering logic (`lib/threeds-page.ts`)

**Files:**

- Create: `lib/threeds-page.ts`
- Test: `tests/unit/lib/threeds-page.test.ts`

**Interfaces:**

- Produces (used by Task 2):
  - `export const SITE_URL = "https://rogeriodocarmo.com";`
  - `export interface ThreeDsPageInput { readonly name: string; readonly title: string; readonly subtitle: string; readonly heroImageSrc: string; readonly experiences: readonly Experience[]; readonly projects: readonly Project[]; readonly skills: readonly SkillCategory[]; }` (import `Experience`, `Project`, `SkillCategory` from `@/types/index`)
  - `export function renderThreeDsHtml(input: ThreeDsPageInput): string`
  - `export function escapeHtml(text: string): string`
  - `export function formatExperienceLine(exp: Experience): string`
  - `export function formatProjectLine(project: Project): string`
  - `export function formatSkillLine(category: SkillCategory): string`

- [ ] **Step 1: Write failing tests for the formatting helpers**

```ts
import {
  escapeHtml,
  formatExperienceLine,
  formatProjectLine,
  formatSkillLine,
} from "@/lib/threeds-page";

test("escapeHtml escapes the five HTML-significant characters", () => {
  expect(escapeHtml(`<a>&'"</a>`)).toBe("&lt;a&gt;&amp;&#39;&quot;&lt;/a&gt;");
});

test("formatExperienceLine renders a closed date range", () => {
  const exp = {
    id: "x",
    type: "professional",
    organization: "Acme",
    role: "Engineer",
    location: "Remote",
    startDate: "2020-01-01",
    endDate: "2021-06-01",
    description: "",
    achievements: [],
  } as Experience;
  expect(formatExperienceLine(exp)).toBe("Engineer — Acme (2020–2021)");
});

test("formatExperienceLine renders an open-ended entry as Present", () => {
  const exp = {
    id: "x",
    type: "professional",
    organization: "Acme",
    role: "Engineer",
    location: "Remote",
    startDate: "2022-01-01",
    endDate: undefined,
    description: "",
    achievements: [],
  } as Experience;
  expect(formatExperienceLine(exp)).toBe("Engineer — Acme (2022–Present)");
});

test("formatProjectLine joins title and description", () => {
  const project = {
    id: "p",
    title: "Miroji",
    description: "A mirror app.",
    technologies: [],
    images: [],
    featured: false,
  } as Project;
  expect(formatProjectLine(project)).toBe("Miroji — A mirror app.");
});

test("formatSkillLine joins category and skill names", () => {
  const category = {
    category: "Mobile",
    skills: [{ name: "React Native" }, { name: "Flutter" }],
  } as SkillCategory;
  expect(formatSkillLine(category)).toBe("Mobile: React Native, Flutter");
});
```

- [ ] **Step 2: Run tests, confirm they fail**

Run: `npx jest tests/unit/lib/threeds-page.test.ts`
Expected: FAIL — module `@/lib/threeds-page` has no exported members.

- [ ] **Step 3: Implement the four helpers and `SITE_URL`/`ThreeDsPageInput` in `lib/threeds-page.ts`**

`escapeHtml` replaces `&`, `<`, `>`, `"`, `'` with their entities (in that order, `&` first). `formatExperienceLine` takes the first 4 characters of `startDate`/`endDate` as the year, uses `"Present"` when `endDate` is `undefined`, and joins as `` `${role} — ${organization} (${startYear}–${endYearOrPresent})` ``. `formatProjectLine` is `` `${title} — ${description}` ``. `formatSkillLine` is `` `${category}: ${skills.map(s => s.name).join(", ")}` ``.

- [ ] **Step 4: Run tests, confirm they pass**

Run: `npx jest tests/unit/lib/threeds-page.test.ts`
Expected: PASS

- [ ] **Step 5: Write failing tests for `renderThreeDsHtml`**

```ts
import { renderThreeDsHtml, type ThreeDsPageInput } from "@/lib/threeds-page";

const baseInput: ThreeDsPageInput = {
  name: "Rogério do Carmo",
  title: "Mobile React Native Developer",
  subtitle: "Specialist in building cross-platform mobile applications.",
  heroImageSrc: "hero.jpg",
  experiences: [],
  projects: [],
  skills: [],
};

test("renders with no CSS and no script tags", () => {
  const html = renderThreeDsHtml(baseInput);
  expect(html).not.toContain("<style");
  expect(html).not.toContain("<script");
});

test("renders the escaped name, title, and hero image", () => {
  const html = renderThreeDsHtml({ ...baseInput, name: "A & B" });
  expect(html).toContain("<h1>A &amp; B</h1>");
  expect(html).toContain('<img src="hero.jpg"');
});

test("renders one <li> per experience entry, in order given", () => {
  const exp = {
    id: "x",
    type: "professional",
    organization: "Acme",
    role: "Engineer",
    location: "Remote",
    startDate: "2020-01-01",
    endDate: undefined,
    description: "",
    achievements: [],
  } as Experience;
  const html = renderThreeDsHtml({ ...baseInput, experiences: [exp] });
  expect(html).toContain("<li>Engineer — Acme (2020–Present)</li>");
});

test("renders a link to the live site using SITE_URL", () => {
  const html = renderThreeDsHtml(baseInput);
  expect(html).toContain('<a href="https://rogeriodocarmo.com">');
});

test("renders a valid, non-empty page when all lists are empty", () => {
  const html = renderThreeDsHtml(baseInput);
  expect(html).toContain("<h1>Rogério do Carmo</h1>");
  expect(html).toContain("<ul></ul>");
});
```

- [ ] **Step 6: Run tests, confirm they fail**

Run: `npx jest tests/unit/lib/threeds-page.test.ts`
Expected: FAIL — `renderThreeDsHtml` not defined.

- [ ] **Step 7: Implement `renderThreeDsHtml` in `lib/threeds-page.ts`**

Builds one `<!doctype html>` document: `<head>` with `<meta charset="utf-8">` and an escaped `<title>`; `<body>` with an escaped `<h1>` (name), escaped `<p>` (title), escaped `<p>` (subtitle), an `<img>` tag using `heroImageSrc` verbatim (not escaped — it's a generator-controlled filename, not user content) with a small fixed `width`/`height`, then one `<h2>` + `<ul>` per section (Experience, Projects, Skills) built by mapping each list through its `format*Line` helper, wrapping each in `<li>${escapeHtml(line)}</li>`, and joined with no extra whitespace that would change the string assertions above. Ends with a `<p>` containing `<a href="${SITE_URL}">Full site</a>`.

- [ ] **Step 8: Run tests, confirm they pass**

Run: `npx jest tests/unit/lib/threeds-page.test.ts`
Expected: PASS

- [ ] **Step 9: Run the Stryker mutation suite scoped to this file**

Run: `npx stryker run --mutate "lib/threeds-page.ts"`
Expected: no surviving mutants (or only ones you add a killing assertion for before moving on).

- [ ] **Step 10: Commit**

```bash
git add lib/threeds-page.ts tests/unit/lib/threeds-page.test.ts
git commit -m "feat: add 3DS legacy page rendering logic"
```

---

## Task 2: Generator CLI script

**Files:**

- Create: `scripts/generate-3ds-page.ts`
- Modify: `package.json` (add `build:3ds` script)
- Modify: `.gitignore` (ignore the build output folder)

**Interfaces:**

- Consumes (from Task 1): `renderThreeDsHtml`, `ThreeDsPageInput`, `SITE_URL` from `@/lib/threeds-page`.
- Consumes (existing): `getExperiences(type?, locale, contentDir?)`, `getProjects(locale, contentDir?)`, `getSkills(locale, contentDir?)` from `@/lib/content`.
- Produces (used by Task 3): writes `index.html`, `hero.jpg`, and `CNAME` into the directory named by the `OUTPUT_DIR` environment variable, defaulting to `legacy-3ds-dist` at the repo root.

- [ ] **Step 1: Add the npm script**

In `package.json`'s `scripts` block, add: `"build:3ds": "tsx scripts/generate-3ds-page.ts"`.

- [ ] **Step 2: Ignore the build output**

Add `legacy-3ds-dist/` to `.gitignore`.

- [ ] **Step 3: Implement `scripts/generate-3ds-page.ts`**

Sequence:

1. Resolve `outputDir = process.env.OUTPUT_DIR ?? "legacy-3ds-dist"` (relative to `process.cwd()`); create it (`fs.mkdirSync(outputDir, { recursive: true })`).
2. Load data: `const experiences = await getExperiences(undefined, "en")`, `const projects = await getProjects("en")`, `const skills = await getSkills("en")`.
3. Guard: if any of the three arrays is empty, `throw new Error(...)` naming which one — this is the fallback-locale safety net from Review Focus (an empty array most likely means the `en` locale content is missing and the loader silently fell back).
4. Resize the hero image with `sharp`: input `public/images/profile/rogeriodocarmo.png`, `.resize(120)`, `.jpeg({ quality: 70 })`, write to `${outputDir}/hero.jpg`. Let any `sharp` error propagate (no try/catch) — a loud build failure is correct here.
5. Build `ThreeDsPageInput` using: `name` from `package.json`'s `author` field (`import pkg from "../package.json" with { type: "json" }` or `JSON.parse(fs.readFileSync(...))`), `title`/`subtitle` from `messages/en.json`'s `hero.title`/`hero.subtitle`, `heroImageSrc: "hero.jpg"`, and the three loaded arrays.
6. Write `${outputDir}/index.html` with `renderThreeDsHtml(input)`.
7. Write `${outputDir}/CNAME` with the exact literal content `3ds.rogeriodocarmo.com` (no trailing newline issues — GitHub Pages accepts either; keep it simple with a single `\n`).
8. `console.log` the output directory path and file count on success.

- [ ] **Step 4: Run it against the real content**

Run: `npm run build:3ds`
Expected: `legacy-3ds-dist/index.html`, `legacy-3ds-dist/hero.jpg`, and `legacy-3ds-dist/CNAME` all exist; `hero.jpg` is well under 50 KB; opening `index.html` in a normal browser shows the expected sections.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-3ds-page.ts package.json .gitignore
git commit -m "feat: add 3DS legacy page generator script"
```

---

## Task 3: E2E check of the generated page

**Files:**

- Create: `tests/e2e/threeds-page.spec.ts`

**Interfaces:**

- Consumes: runs `npm run build:3ds` as a subprocess (via Node's `child_process.execSync`) with `OUTPUT_DIR` pointed at a fresh temp directory, then navigates Playwright directly to the resulting `index.html` via a `file://` URL — no dev server, no `baseURL`, independent of the main app's E2E setup.

- [ ] **Step 1: Write the failing E2E test**

```ts
import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

test.describe("3DS legacy page", () => {
  const outputDir = mkdtempSync(path.join(tmpdir(), "3ds-page-"));

  test.beforeAll(() => {
    execSync("npx tsx scripts/generate-3ds-page.ts", {
      cwd: process.cwd(),
      env: { ...process.env, OUTPUT_DIR: outputDir },
      stdio: "pipe",
    });
  });

  test("builds index.html, hero.jpg, and CNAME", () => {
    expect(existsSync(path.join(outputDir, "index.html"))).toBe(true);
    expect(existsSync(path.join(outputDir, "hero.jpg"))).toBe(true);
    expect(existsSync(path.join(outputDir, "CNAME"))).toBe(true);
  });

  test("the generated page has no CSS, no JS, a visible heading, and the hero image", async ({
    page,
  }) => {
    await page.goto(`file://${path.join(outputDir, "index.html")}`);
    await expect(page.locator("h1")).toHaveText("Rogério do Carmo");
    await expect(page.locator("img")).toHaveAttribute("src", "hero.jpg");
    const html = await page.content();
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/<style/i);
  });

  test("links to the live site", async ({ page }) => {
    await page.goto(`file://${path.join(outputDir, "index.html")}`);
    await expect(page.locator('a[href="https://rogeriodocarmo.com"]')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `npx playwright test tests/e2e/threeds-page.spec.ts --project=chromium`
Expected: FAIL (file doesn't exist yet, or the script/test wiring has a typo) — confirms the test actually exercises the build.

- [ ] **Step 3: Fix any wiring issues found, run again until green**

Run: `npx playwright test tests/e2e/threeds-page.spec.ts --project=chromium`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/threeds-page.spec.ts
git commit -m "test: add E2E check for the generated 3DS legacy page"
```

---

## Task 4: Publish guide (one-time setup + manual deploy steps)

This task is documentation only — the actual DNS/GitHub dashboard changes happen when Rogério executes this guide himself, not as part of this coding plan.

**Files:**

- Create: `docs/development/3DS-LEGACY-PAGE-GUIDE.md`

- [ ] **Step 1: Write the guide**

Cover, in order:

1. **One-time: create the publish branch.** `git checkout --orphan 3ds-pages && git rm -rf . && git commit --allow-empty -m "chore: initialize 3ds-pages branch" && git push origin 3ds-pages`, then switch back to `develop`.
2. **One-time: Hostinger DNS.** Add a `CNAME` record: host `3ds`, target `<github-username>.github.io`, at Hostinger's DNS zone editor for `rogeriodocarmo.com`.
3. **One-time: GitHub repo settings → Pages.** Source: branch `3ds-pages`, folder `/ (root)`. Custom domain: `3ds.rogeriodocarmo.com`. Wait for the certificate to provision, then decide "Enforce HTTPS" based on the real-device test from the design doc (record the result here once tested).
4. **Every time the content changes:** `npm run build:3ds`, then copy `legacy-3ds-dist/*` onto the `3ds-pages` branch (e.g. via a throwaway worktree: `git worktree add ../3ds-pages-worktree 3ds-pages`, copy files in, `git add -A && git commit -m "chore: update 3DS legacy page" && git push`, then `git worktree remove ../3ds-pages-worktree`).
5. Link back to the design doc for the "why" (TLS findings) so a future reader isn't confused about why this isn't just a Vercel route.

- [ ] **Step 2: Commit**

```bash
git add docs/development/3DS-LEGACY-PAGE-GUIDE.md
git commit -m "docs: add 3DS legacy page publish guide"
```

---

## Self-review notes

- **Spec coverage:** hosting (Task 4), DNS (Task 4), content generation + terseness + escaping (Task 1), hero image (Task 2), output isolation from the Next.js app (Task 2's `legacy-3ds-dist/`, gitignored, not under `app/`/`public/`), posts excluded (Task 2 only calls experiences/projects/skills loaders), manual deploy (Task 4), real-device verification (flagged in Task 4 step 3 and in the design doc; it's a physical step only Rogério can do, not automatable here).
- **Review Focus coverage:** locale-fallback guard (Task 2 Step 3), HTML escaping (Task 1 Steps 1 & 5 tests), open-ended `endDate` (Task 1 Step 1), empty lists (Task 1 Step 5's last test), loud failure on a missing/broken hero image (Task 2 Step 3, no try/catch).
