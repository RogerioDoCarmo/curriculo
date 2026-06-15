# Mutation Testing (Stryker)

Mutation testing measures **test quality**, not just coverage. Stryker introduces
small changes ("mutants") into the source — flipping `>` to `>=`, blanking a
string, negating a boolean — and reruns the Jest suite against each. A mutant
that makes a test fail is _killed_; one that slips through is _survived_. A high
mutation score means the tests actually assert behavior, not just execute lines.

## Running

```bash
npm run test:mutation                        # full scoped run (lib/)
npx stryker run --mutate "lib/<file>.ts"     # single file (faster, for iterating)
```

The HTML report is written to `reports/mutation/index.html` (gitignored). Open it
to browse survived mutants line by line.

## Configuration

- [`stryker.config.json`](../../stryker.config.json) — scope, thresholds, runner.
- [`jest.stryker.config.js`](../../jest.stryker.config.js) — a thin wrapper over
  `jest.config.js` that resolves `testEnvironment` to an absolute path, because
  Stryker's jest-runner does not expand the `<rootDir>` token.

### Scope

`mutate` is intentionally limited to `lib/**/*.ts` pure-logic modules, which have
strong unit coverage and the best signal-to-noise ratio. Files that are mostly
side effects, glue, or generated metadata (`error-logging*`, `lazy-components`,
`seo`, `structured-data`) are excluded. Expand the scope to `hooks/` and
`components/` as their tests mature.

### Thresholds

```jsonc
"thresholds": { "high": 80, "low": 60, "break": 50 }
```

A run exits non-zero when the score drops below `break` (50), so it can act as a
quality gate. Raise `break` as the suite improves; never lower it to make a run
pass — fix the tests instead.

## CI

Mutation testing runs in both flows that already gate on unit tests, as a
**non-blocking** signal — a sub-threshold run surfaces a warning but never fails
the pipeline or a deploy:

- [`ci.yml`](../../.github/workflows/ci.yml) — the `mutation` job runs
  `npm run test:mutation` on **pull requests to `develop`/`main` only** (the full
  run is ~7 minutes, too slow for every branch push). It is `continue-on-error`,
  and `status-check` reports its result (✅/⚠️) without blocking the merge.
- [`deploy.yml`](../../.github/workflows/deploy.yml) — runs alongside the
  production-deploy test gate for visibility. It is `continue-on-error` and not in
  the `deploy` job's `needs`, so it never blocks a release.

Both jobs upload the HTML report as the `mutation-report` artifact. Because the
gate is non-blocking, the `break` threshold acts as a tripwire in the logs rather
than a hard stop — promote it to blocking once the weaker `lib/` files improve.

## Current baseline

Aggregate mutation score: **61.21%** (above the 50 break threshold). Per file:

| File               | Score  | Notes                                            |
| ------------------ | ------ | ------------------------------------------------ |
| `tag-colors.ts`    | 87.02% | Literal table-driven tests; survivors equivalent |
| `content.ts`       | 67.61% |                                                  |
| `notifications.ts` | 66.97% |                                                  |
| `firebase.ts`      | 63.44% |                                                  |
| `feature-flags.ts` | 46.43% | Below `high`/`low` — room to improve             |
| `json-resume.ts`   | 29.55% | Weak; assertions are shallow                     |
| `analytics.ts`     | 0.00%  | No effective mutation coverage yet               |

Next targets for improving the score: `analytics.ts`, `json-resume.ts`, and
`feature-flags.ts`.

## Killing survived mutants

Two patterns recur:

1. **Self-referential assertions.** Asserting a function's output against the
   module's own constant (`expect(fn(x)).toContain(TAG_COLORS[x].bg)`) cannot
   catch a mutation of that same constant — blanking it to `""` still passes
   because `toContain("")` is always true. Assert **literal** expected values.
2. **Untested data entries.** A lookup table only kills mutants for the keys a
   test actually asserts. Drive the test from an exhaustive table so every entry
   is checked.

### Equivalent mutants

Some survivors are _equivalent_ — the mutation produces no observable behavior
change, so no test can kill them. Example from [`lib/tag-colors.ts`](../../lib/tag-colors.ts):

```ts
const TECH_THEME_MAP = { Git: "tools" /* ... */ };
function getTechTheme(tech) {
  return TECH_THEME_MAP[tech] || "tools"; // falls back to "tools"
}
```

Blanking a value that is already `"tools"` (`Git: "tools"` → `Git: ""`) changes
nothing: the `|| "tools"` fallback returns the same result. These are expected
and acceptable — document them rather than contorting tests to chase them.

## Reference

- Stryker docs: <https://stryker-mutator.io/docs/stryker-js/>
- See [`tests/unit/lib/tag-colors.test.ts`](../../tests/unit/lib/tag-colors.test.ts)
  for a worked example (26.72% → 87.02% by switching to literal, table-driven
  assertions).
