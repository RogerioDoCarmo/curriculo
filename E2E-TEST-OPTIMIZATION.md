# E2E Test Optimization Guide

## Current Issues

- Tests taking 20+ minutes to complete
- Running on multiple browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- Cookie banner blocking interactions
- Potentially redundant test coverage

## Optimizations Implemented

### 1. **Increased Parallel Workers** (Biggest Impact)

- **Before**: 2 workers in CI
- **After**: 4 workers in CI
- **Impact**: ~50% faster execution with 4 parallel workers
- **Location**: `playwright.config.ts` - `workers: 4`

### 2. **Reduced Timeouts**

- **Navigation timeout**: 15s → 10s
- **Action timeout**: 10s → 8s
- **Impact**: Faster failure detection, less waiting
- **Location**: `playwright.config.ts` - `use.navigationTimeout` and `use.actionTimeout`

### 3. **Browser Optimization Flags**

Added Chrome flags to disable unnecessary features:

```typescript
launchOptions: {
  args: [
    "--disable-blink-features=AutomationControlled",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-sandbox",
  ],
}
```

- **Impact**: Faster browser startup and execution

### 4. **Test Timer Added**

- **Command**: `npm run test:e2e` now includes `time` prefix
- **New commands**:
  - `npm run test:e2e:chromium` - Run only Chromium tests (fastest)
  - `npm run test:e2e:headed` - Run with visible browser
  - `npm run test:e2e:debug` - Debug mode
  - `npm run test:e2e:ui` - Interactive UI mode

### 5. **Cookie Banner Fix**

- Added `dismissCookieBanner()` to all component gallery tests
- **Impact**: Prevents timeout failures from blocked interactions

## Additional Optimization Recommendations

### A. **Run Chromium Only for Development** (Recommended)

```bash
npm run test:e2e:chromium
```

- **Time savings**: ~75% (from 20min to ~5min)
- **Rationale**: Most bugs are browser-agnostic; catch browser-specific issues in CI

### B. **Selective Test Execution**

Run specific test files:

```bash
npx playwright test component-gallery.spec.ts
npx playwright test email-subscribe.spec.ts
```

### C. **Use Test Tags** (Future Enhancement)

Add tags to tests:

```typescript
test("should load page @smoke", async ({ page }) => {
  // Fast, critical test
});

test("should handle edge case @slow", async ({ page }) => {
  // Slower, less critical test
});
```

Run only smoke tests:

```bash
npx playwright test --grep @smoke
```

### D. **Reduce Test Redundancy**

Review tests for duplicate coverage:

- Do we need to test the same component in multiple locales?
- Can we combine similar test cases?
- Are all responsive tests necessary for every page?

### E. **Use Shared State** (Advanced)

For tests that don't need isolation:

```typescript
test.describe.configure({ mode: "serial" });
```

- Reuses browser context between tests
- **Caution**: Tests become dependent on each other

### F. **Optimize Cookie Banner Handling**

Instead of dismissing in every test, set localStorage directly:

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("cookie-consent", "accepted");
  });
});
```

### G. **CI-Specific Optimizations**

Already implemented:

- PR builds: Chromium only
- Main/develop builds: Full browser matrix
- This balances speed vs coverage

## Expected Time Improvements

| Optimization       | Time Savings       | Cumulative Time |
| ------------------ | ------------------ | --------------- |
| Baseline           | -                  | 20 minutes      |
| 4 workers (from 2) | -50%               | 10 minutes      |
| Reduced timeouts   | -10%               | 9 minutes       |
| Browser flags      | -5%                | 8.5 minutes     |
| Cookie banner fix  | -10%               | 7.5 minutes     |
| **Chromium only**  | -75% from baseline | **5 minutes**   |

## Monitoring Test Performance

### View Test Duration

After running tests, check the HTML report:

```bash
npx playwright show-report
```

### Identify Slow Tests

Look for tests taking >5 seconds and optimize them.

### Use Playwright Trace Viewer

For failed tests:

```bash
npx playwright show-trace playwright-report/trace.zip
```

## Best Practices Going Forward

1. **Write Fast Tests**
   - Minimize page navigations
   - Use `page.goto()` sparingly
   - Prefer API calls over UI interactions for setup

2. **Use Fixtures for Common Setup**
   - Create reusable fixtures for authenticated users, etc.
   - Reduces duplication and speeds up tests

3. **Avoid Unnecessary Waits**
   - Don't use `page.waitForTimeout()` unless absolutely necessary
   - Use `page.waitForSelector()` or `expect().toBeVisible()` instead

4. **Run Tests Locally Before Pushing**
   - Use `npm run test:e2e:chromium` for quick feedback
   - Full browser matrix runs in CI

5. **Monitor CI Test Times**
   - Set up alerts if tests exceed 10 minutes
   - Regularly review and optimize slow tests

## Quick Reference

```bash
# Fastest: Chromium only with timer
npm run test:e2e:chromium

# Full suite with timer
npm run test:e2e

# Debug a specific test
npx playwright test component-gallery.spec.ts --debug

# Interactive UI mode
npm run test:e2e:ui

# Run specific test by name
npx playwright test -g "should load component gallery"

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Generate and view report
npx playwright show-report
```

## Current Test Files (10 total)

1. `basic-navigation.spec.ts`
2. `career-path-navigation.spec.ts`
3. `component-gallery.spec.ts` ⚠️ Fixed: Added cookie banner dismissal
4. `contact-form.spec.ts`
5. `cookie-consent.spec.ts`
6. `email-subscribe.spec.ts`
7. `exit-intent.spec.ts`
8. `language-switching.spec.ts`
9. `print-pdf.spec.ts`
10. `theme-switching.spec.ts`

## Next Steps

1. ✅ Commit the E2E test fixes (cookie banner dismissal)
2. ✅ Update Playwright config with optimizations
3. ✅ Add timer to test commands
4. 🔄 Run tests and measure improvement
5. 📊 Review test report and identify remaining slow tests
6. 🎯 Consider implementing test tags for smoke vs full suite
