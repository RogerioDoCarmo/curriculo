# CI/CD Pipeline Setup

## Overview

This document describes the GitHub Actions CI/CD pipeline setup for the personal resume website project.

## CI Workflow

**File**: `.github/workflows/ci.yml`

### Triggers

- Push to any branch
- Pull requests to `develop` or `main` branches

### Jobs

#### 1. Lint (`lint`)

- Runs ESLint to check code quality
- Ensures code follows project style guidelines
- **Fails if**: Linting errors are found

#### 2. Type Check (`type-check`)

- Runs TypeScript compiler in check mode (`tsc --noEmit`)
- Validates type safety across the codebase
- **Fails if**: Type errors are found

#### 3. Test (`test`)

- Runs all Jest tests (unit, integration, property-based)
- Uploads test results as artifacts
- **Fails if**: Any test fails

#### 4. Coverage (`coverage`)

- Runs tests with coverage reporting
- Checks that line coverage meets **80% threshold** (goal: 90%)
- Uploads coverage reports as artifacts
- Comments coverage stats on pull requests
- **Fails if**: Coverage is below 80%

**Coverage Metrics Tracked:**

- Lines
- Statements
- Functions
- Branches

#### 5. Build (`build`)

- Builds the Next.js static site (`npm run build`)
- Uploads build output as artifacts
- **Fails if**: Build errors occur

#### 6. E2E Tests (`e2e`)

- Installs Playwright browsers
- Runs E2E tests across 5 browser configurations:
  - Chromium (desktop)
  - Firefox (desktop)
  - WebKit (desktop)
  - Mobile Chrome
  - Mobile Safari
- Uploads test reports and videos on failure
- **Fails if**: Any E2E test fails

#### 7. Status Check (`status-check`)

- Waits for all other jobs to complete
- Provides single status check for branch protection
- **Fails if**: Any required job fails

### Branch Protection

To enforce CI checks before merging:

1. Go to: **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `develop` or `main`
3. Enable: ✅ **Require status checks to pass before merging**
4. Select required check: **All Checks Passed**
5. Enable: ✅ **Require branches to be up to date before merging**

## Coverage Configuration

### Current Threshold: 80%

The CI pipeline currently enforces an **80% minimum coverage** threshold to allow development to proceed while maintaining quality standards.

**Current Coverage Status:**

- Lines: ~72%
- Statements: ~72%
- Functions: ~77%
- Branches: ~66%

### Goal: 90%

The project aims to reach **90% coverage** across all metrics. Once achieved, the CI threshold will be updated to enforce 90%.

**To update threshold:**

1. Edit `.github/workflows/ci.yml`
2. Change `if awk "BEGIN {exit !($COVERAGE < 80)}"` to `< 90`
3. Update success message to "90% threshold"
4. Update PR comment threshold from `>= 80` to `>= 90`

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Text**: Console output during test run
- **LCOV**: `coverage/lcov.info` (for IDE integration)
- **JSON Summary**: `coverage/coverage-summary.json` (for CI checks)
- **HTML**: `coverage/lcov-report/` (for detailed browsing)

## Artifacts

The CI workflow uploads the following artifacts:

| Artifact            | Job      | Description                    |
| ------------------- | -------- | ------------------------------ |
| `test-results`      | test     | Jest test results and coverage |
| `coverage-report`   | coverage | Detailed coverage reports      |
| `build-output`      | build    | Static site build output       |
| `playwright-report` | e2e      | E2E test results and traces    |
| `test-videos`       | e2e      | Videos of failed E2E tests     |

Artifacts are retained for 30 days by default.

## Local Testing

Before pushing, run these commands locally to catch issues:

```bash
# Run all checks
npm run lint          # ESLint
npx tsc --noEmit      # Type check
npm test              # All tests
npm run test:coverage # Coverage check
npm run build         # Build
npm run test:e2e      # E2E tests
```

## Troubleshooting

### Coverage Check Fails

**Error**: `Coverage (XX%) is below 80% threshold`

**Solution**: Write more tests to increase coverage:

```bash
npm run test:coverage  # See which files need coverage
```

Focus on files with low coverage in the `lib/` and `hooks/` directories.

### E2E Tests Fail

**Error**: E2E tests fail in CI but pass locally

**Possible causes**:

- Timing issues (CI is slower)
- Missing environment variables
- Browser-specific issues

**Solution**:

1. Check uploaded test videos in artifacts
2. Increase timeouts if needed
3. Ensure static site is properly served

### Build Fails

**Error**: Build fails in CI but works locally

**Possible causes**:

- Missing dependencies
- Environment variable issues
- TypeScript errors

**Solution**:

1. Run `npm ci` (clean install) locally
2. Check `npm run build` output
3. Verify all environment variables are set

## Next Steps

After CI setup is complete:

1. **Task 21.3**: Set up SonarQube Cloud integration
2. **Task 21.4**: Create deployment workflow
3. **Task 21.5**: Configure Vercel project
4. **Task 21.6**: Set up domain configuration
5. **Task 21.7**: Write property test for multi-domain consistency

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
