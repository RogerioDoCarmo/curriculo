# CLAUDE.md — Project Instructions

Personal resume website for Rogério do Carmo. Built with Next.js 16, TypeScript, Tailwind CSS, next-intl (i18n), and deployed on Vercel.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl
- **Testing**: Jest + Testing Library (unit/integration), Playwright (E2E), Lighthouse (performance)
- **Storybook**: Component development
- **CI**: GitHub Actions → Vercel deploy

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run unit/integration tests
npm run test:e2e     # Run Playwright E2E tests
npm run test:mutation # Run Stryker mutation tests (scoped to lib/)
npm run lint         # ESLint (max 300 warnings)
npm run format       # Prettier
```

## Code Conventions

### TypeScript

- Use `readonly` on all props interfaces
- Use `import type { ... }` for type-only imports
- Never use non-null assertion (`!`) — use type guards instead
- Strict null checks are enforced in CI

### Components

- Server components by default; add `"use client"` only when needed
- Theme-dependent components must use a `mounted` state guard to avoid SSR hydration mismatch (see `hooks/useTheme`)
- Use `next/image` with actual pixel dimensions (`sips -g pixelWidth -g pixelHeight`) and `h-auto` Tailwind class

### Styling

- Tailwind classes only — no inline styles (except dynamic values)
- Dark mode via `dark:` variants
- Group classes: layout → sizing → spacing → colors → misc
- Prefer canonical scale classes over arbitrary px values when an exact
  equivalent exists: the v4 spacing unit is `0.25rem` (4px), so `Npx` → `N/4`
  (e.g. `w-[125px]` → `w-31.25`, `w-[200px]` → `w-50`, `min-w-[600px]` → `min-w-150`).
  Only keep `[…px]` when there is no canonical match (e.g. `text-[10px]`).

### Testing

- Every component needs: render test, interaction test, accessibility test
- `@testing-library/jest-dom` matchers are globally available (no import needed)
- Mock `IntersectionObserver` and `window.matchMedia` in `jest.setup.js`
- Mock `next/navigation` for components using router hooks
- Test mocks must include **all** translation keys the component uses (including `sections.*` keys for aria-labels)
- Mock data must match exact TypeScript types — check the interface before writing mocks
- Never use `!` non-null assertions in tests; use `if (value)` guards
- Unused callback args: prefix with `_` or omit entirely

## Post-Merge Workflow

When asked to run the "post-merge workflow" or "update repo after merge":

1. `git checkout develop && git pull`
2. `git checkout main && git pull`
3. Delete local feature branch: `git branch -d <branch-name>` (ask if not provided)
4. Suggest semantic version bump based on changes (major/minor/patch), confirm with user
5. Create annotated tag: `git tag -a <version> --cleanup=verbatim -m "<release-notes>"`
   — **`--cleanup=verbatim` is required.** Without it, git's default `strip`
   cleanup silently deletes every line starting with `#`, which eats every
   `## Category` / `### Subsection` heading in the release-notes format below.
   This bug affected every release from at least v1.10.0 through v1.14.6
   before being caught and fixed.
6. `git push --tags` — this triggers the GitHub Actions release workflow automatically

### Release Artifacts (standard, automated)

Every `v*.*.*` tag triggers `.github/workflows/release.yml`, which **must** attach
to the GitHub Release, for prefix `<repo>-<tag>` (e.g. `curriculo-v1.7.3`):

- **Dist** archives: `<prefix>-dist.tar.gz`, `<prefix>-dist.zip` (the built `out/` static export)
- **Checksums**: one file per archive named `<archive-filename>_checksums.txt`
  (same prefix as the compressed file + `_checksums.txt`), each containing `sha256` + `sha512`.

So a release has 2 archives + 2 checksum files. **The dist build intentionally
gets zero `NEXT_PUBLIC_*` secrets** — release archives are public, downloadable
artifacts, and we never bake runtime credentials (Firebase, Sentry, etc.) into
them, as a security precaution. Firebase/Sentry stay unconfigured in that
artifact by design. The live site is deployed separately via Vercel, which
injects the real production env vars at build time. The workflow appends a
security-note disclaimer to every release body explaining this — never remove
it, and never add `NEXT_PUBLIC_*` secrets back to `release.yml`'s build step.
Never rename the checksum suffix or drop an archive variant — this is the
project standard.

Category emoji convention — pick the emoji matching the category's content
(mirrors the PR title types above):

- ✨ Features
- 🐛 Fixes
- ⚡ Performance
- 🔒 Security
- 📚 Documentation
- 🧪 Testing
- ♻️ Refactor
- 🎨 Style / UI
- 🔄 CI/CD
- 🧹 Chore / Tooling

Release notes format:

```markdown
🚀 v<version> - <Title>

## ✨ <Category>

### <Subsection>

- <Change>
- Metric: ✅ 22% faster (3.2s → 2.5s)

## 📁 Files Changed

- file.ts (created/updated/deleted)

## 🔗 Related

- Commit: <hash>
- Previous: <prev-tag>
- Full Changelog: <prev-tag>...<version>
```

The `Full Changelog` line is a GitHub compare link — render it as
`Full Changelog: [<prev-tag>...<version>](https://github.com/RogerioDoCarmo/curriculo/compare/<prev-tag>...<version>)`
so it's clickable in the rendered release body.

## PR & Release Descriptions

When asked for a PR title/description, provide copyable plain text directly in chat.

**Title format**: `<type>: <short description>` (under 70 chars)  
Types: `fix` `feat` `docs` `test` `chore` `refactor` `perf` `style` `ci`

**Description structure**: Summary → Issues Fixed → Changes Made → Testing → Benefits → Verification Steps → Checklist

## Documentation: Performance Metrics

Use `✅` for improvements, `❌` for regressions, always with a semantic label:

```text
Build Time: ✅ 22% faster (3.2s → 2.5s)
Bundle Size: ✅ 1.6% smaller (185KB → 182KB)
Lighthouse:  ✅ +1 point (92 → 93)
```

## GitHub Pages / Subdomain Publishing Gotchas

Learned publishing the 3DS legacy page (`3ds-pages` branch,
`3ds.rogeriodocarmo.com`, see
[`docs/development/3DS-LEGACY-PAGE-GUIDE.md`](docs/development/3DS-LEGACY-PAGE-GUIDE.md))
on 2026-11-23. Applies to any future subdomain published via GitHub Pages
from this repo.

- **"Branch created" ≠ "content published."** The Git Flow empty-commit
  trick for creating a publish branch only satisfies the branch's
  ancestry — it does not put any generated page on the branch. Don't mark
  a publish step "done" in a doc, or consider the feature finished, until
  you've actually run the publish workflow and verified the **live URL**
  serves the expected content — not just that the git-level setup exists.
  This exact gap sat unnoticed across a full session here.
- **The shared pre-commit hook still fires inside a publish-branch
  worktree**, even after `git rm -rf .` clears that worktree's working
  tree — hooks live in the shared `.git/hooks`, not per-worktree. A hook
  that runs `lint-staged` will fail with "could not find any valid
  configuration" on a branch that's deliberately just static generated
  files (no `package.json`/lint config there). `--no-verify` on that one
  commit is legitimate here — there's no source code to lint — but only
  with explicit user go-ahead each time, same as any other hook skip.
- **GitHub Pages' per-domain TLS cert takes real time to issue** after a
  custom domain is set, separate from the Pages build itself —
  `status: "built"` does **not** mean the cert exists yet.
  `gh api -X PUT repos/<owner>/<repo>/pages -F "https_enforced=true"`
  returns `404 "The certificate does not exist yet"` until it's ready;
  treat that as "not yet," not a failure, and poll/retry (a ~45s backoff
  loop worked). Also use `-F` (typed) not `-f` (string) for this boolean
  field, or the API rejects it as "not of type boolean."
- **If that `404` persists for over 24 hours with the build otherwise
  healthy** (`status: "built"`, no `pending_domain_unverified_at`, no
  `protected_domain_state`), and CAA records don't block Let's Encrypt
  (check via `curl -s "https://dns.google/resolve?name=<domain>&type=CAA"`
  — it follows the CNAME chain to `*.github.io`'s own CAA, which already
  allows `letsencrypt.org`), the Pages record itself can get stuck even
  though the cert was quietly approved server-side. Fix: clear and re-add
  just the Pages API's `cname` field (not the DNS record) —
  `gh api -X PUT repos/<owner>/<repo>/pages -F "cname="` then, a few
  seconds later, `-F "cname=<domain>"` again — which forces GitHub to
  restart domain verification. Confirmed working on `curriculo` 2026-11-24
  after 24+ hours stuck. This can leave `status: "errored"` as a stale
  build record even though the live site is already serving the new cert
  — verify with `curl -sv https://<domain>/` directly rather than trusting
  `status`, and clear a stale error with a fresh manual build:
  `gh api -X POST repos/<owner>/<repo>/pages/builds`.
- **`vercel.json`'s HSTS header has `includeSubDomains; preload`** for
  the main domain. Any modern browser that's previously visited
  `https://rogeriodocarmo.com` will force-upgrade `http://` requests to
  _any_ subdomain — including a brand-new GitHub Pages one — to HTTPS,
  and will hard-fail with no bypass if that subdomain's cert isn't ready
  yet. This is why an old/non-HSTS-aware browser (e.g. the Nintendo 3DS's)
  can reach a new subdomain over plain HTTP successfully while a modern
  browser cannot. Expect this gap whenever adding a new subdomain-based
  side project, and don't read a modern-browser failure as proof the
  subdomain is broken.
- **Enabling GitHub Pages and toggling `https_enforced` are both
  mutating, public-facing changes** — Claude Code's auto-mode classifier
  denies them by default ("Destructive or Unwanted Actions"). Always
  surface the exact command and ask before retrying, same as the
  SonarCloud API-write pattern described elsewhere.

## Reference Docs

Detailed standards live in `.kiro/docs/`:

- [`coding-standards.md`](.kiro/docs/coding-standards.md) — component templates, image handling, theme patterns
- [`test-patterns.md`](.kiro/docs/test-patterns.md) — test patterns and examples
- [`mutation-testing.md`](.kiro/docs/mutation-testing.md) — Stryker setup, scope, thresholds, killing mutants
- [`nextjs-best-practices.md`](.kiro/docs/nextjs-best-practices.md) — Next.js-specific guidance
- [`code-quality-fixes.md`](.kiro/docs/code-quality-fixes.md) — common ESLint/TS fixes

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
