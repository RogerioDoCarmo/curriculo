# E2E Testing Strategy

## Overview

This document outlines the E2E testing strategy designed to balance comprehensive browser coverage with fast CI/CD pipeline execution.

## Testing Approach

### Pull Request Builds (Fast)

- **Browser**: Chromium only
- **Workers**: 2 parallel workers
- **Retries**: 1
- **Estimated Time**: 3-5 minutes
- **Purpose**: Quick feedback for developers

### Main/Develop Builds (Comprehensive)

- **Browsers**: All 5 browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- **Workers**: 2 parallel workers per browser
- **Retries**: 1
- **Estimated Time**: 8-12 minutes
- **Purpose**: Ensure cross-browser compatibility before deployment

### Scheduled Full Suite (Daily)

- **Schedule**: Daily at 2 AM UTC
- **Browsers**: Matrix strategy - each browser runs independently
- **Purpose**: Catch any browser-specific regressions

## Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
// Optimizations applied:
- workers: 2 (parallel execution in CI)
- retries: 1 (reduced from 2)
- navigationTimeout: 15s (reduced from 30s)
- actionTimeout: 10s (reduced from 30s)
- Conditional browser matrix based on CI event type
```

### CI Workflows

#### 1. **ci.yml** - Main CI Pipeline

- Runs on all pushes and PRs
- E2E tests use Chromium only for PRs
- Full browser matrix for main/develop pushes

#### 2. **e2e-full.yml** - Comprehensive E2E Suite

- Runs on main/develop pushes
- Runs daily via cron schedule
- Can be triggered manually
- Uses matrix strategy for parallel browser testing

## Performance Optimizations

### 1. Reduced Browser Matrix for PRs

**Impact**: 80% time reduction

- Before: 5 browsers × 8 test files = 40 test runs
- After: 1 browser × 8 test files = 8 test runs

### 2. Parallel Workers

**Impact**: 50% time reduction

- Before: Sequential execution (1 worker)
- After: 2 parallel workers

### 3. Faster Timeouts

**Impact**: 10-15% time reduction

- Navigation: 30s → 15s
- Actions: 30s → 10s

### 4. Reduced Retries

**Impact**: Fewer flaky test reruns

- Before: 2 retries
- After: 1 retry

### 5. Selective Browser Installation

**Impact**: Faster setup time

- PRs: Install Chromium only (~30s)
- Main/develop: Install all browsers (~2min)

## Expected Performance

### Before Optimizations

- PR builds: ~20 minutes
- Main/develop builds: ~25 minutes

### After Optimizations

- PR builds: **3-5 minutes** (75% reduction)
- Main/develop builds: **8-12 minutes** (50% reduction)
- Daily full suite: **10-15 minutes** (parallel matrix)

## Test Coverage

### Critical Tests (Run on Every PR)

All 8 E2E test files run on Chromium:

- basic-navigation.spec.ts
- career-path-navigation.spec.ts
- contact-form.spec.ts
- email-subscribe.spec.ts
- exit-intent.spec.ts
- language-switching.spec.ts
- print-pdf.spec.ts
- theme-switching.spec.ts

### Full Browser Coverage

Runs on:

- Pushes to main/develop
- Daily scheduled runs
- Manual workflow dispatch

## Manual Testing

### Run Full Suite Locally

```bash
npm run test:e2e
```

### Run Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/contact-form.spec.ts
```

### Debug Mode

```bash
npx playwright test --debug
```

## Monitoring & Maintenance

### When to Run Full Browser Suite

1. Before major releases
2. After significant UI changes
3. When browser-specific issues are reported
4. Weekly/daily via scheduled workflow

### Adjusting Strategy

If PR builds are still too slow:

1. Reduce parallel workers to 1 (trade speed for resource usage)
2. Split tests into "smoke" and "full" suites
3. Run only smoke tests on PRs

If flaky tests increase:

1. Increase retries back to 2
2. Increase timeouts for specific tests
3. Add explicit waits for dynamic content

## Troubleshooting

### E2E Tests Timing Out

- Check if server started successfully
- Verify baseURL is correct
- Increase timeout for specific tests

### Browser Installation Fails

- Check GitHub Actions runner has enough disk space
- Verify Playwright version compatibility
- Use `--with-deps` flag for system dependencies

### Flaky Tests

- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use `waitForSelector` instead of fixed delays
- Check for race conditions in test code

## Future Improvements

1. **Visual Regression Testing**: Add Playwright's screenshot comparison
2. **Performance Budgets**: Integrate Lighthouse into E2E tests
3. **Test Sharding**: Split tests across multiple CI jobs
4. **Smoke Test Suite**: Create minimal critical path tests (<2 min)
5. **Browser-Specific Tests**: Only run certain tests on specific browsers

## References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions Optimization](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [CI/CD Pipeline Documentation](./CI-CD-PIPELINE.md)
