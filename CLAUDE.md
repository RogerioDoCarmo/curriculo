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
5. Create annotated tag: `git tag -a <version> -m "<release-notes>"`
6. `git push --tags` — this triggers the GitHub Actions release workflow automatically

Release notes format:

```
v<version> - <Title>

## <Category>
### <Subsection>
- <Change>
- Metric: ✅ 22% faster (3.2s → 2.5s)

## Files Changed
- file.ts (created/updated/deleted)

## Related
- Commit: <hash>
- Previous: <prev-tag>
```

## PR & Release Descriptions

When asked for a PR title/description, provide copyable plain text directly in chat.

**Title format**: `<type>: <short description>` (under 70 chars)  
Types: `fix` `feat` `docs` `test` `chore` `refactor` `perf` `style` `ci`

**Description structure**: Summary → Issues Fixed → Changes Made → Testing → Benefits → Verification Steps → Checklist

## Documentation: Performance Metrics

Use `✅` for improvements, `❌` for regressions, always with a semantic label:

```
Build Time: ✅ 22% faster (3.2s → 2.5s)
Bundle Size: ✅ 1.6% smaller (185KB → 182KB)
Lighthouse:  ✅ +1 point (92 → 93)
```

## Reference Docs

Detailed standards live in `.kiro/docs/`:

- [`coding-standards.md`](.kiro/docs/coding-standards.md) — component templates, image handling, theme patterns
- [`test-patterns.md`](.kiro/docs/test-patterns.md) — test patterns and examples
- [`mutation-testing.md`](.kiro/docs/mutation-testing.md) — Stryker setup, scope, thresholds, killing mutants
- [`nextjs-best-practices.md`](.kiro/docs/nextjs-best-practices.md) — Next.js-specific guidance
- [`code-quality-fixes.md`](.kiro/docs/code-quality-fixes.md) — common ESLint/TS fixes
