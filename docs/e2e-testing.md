# End-to-End Testing Guide

This document provides comprehensive information about the E2E testing infrastructure for the Personal Resume Website project.

## Overview

The project uses **Playwright** for end-to-end testing across multiple browsers and devices. E2E tests verify complete user workflows and ensure the application works correctly in real browser environments.

## Test Infrastructure

### Configuration

- **File**: `playwright.config.ts`
- **Test Directory**: `tests/e2e/`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Devices**: Pixel 5 (Android), iPhone 12 (iOS)
- **Web Server**: Uses `serve` to serve the static build from `out/` directory

**Note**: Since this is a static site with `output: export`, we use `npx serve` instead of `next start` to serve the built files during E2E testing.

### Running Tests

```bash
# Run all E2E tests (builds and serves automatically)
npm run test:e2e

# Manually serve the static site (useful for debugging)
npm run build
npm run serve

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests on mobile devices
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari

# Run specific test file
npx playwright test tests/e2e/language-switching.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Generate HTML report
npx playwright show-report
```

## Test Suites

### 1. Language Switching (`language-switching.spec.ts`)

**Requirements**: 11.1, 11.6

Tests language switching functionality:

- ✅ Switch between all supported languages (pt-BR, en, es)
- ✅ Content updates correctly when language changes
- ✅ Language preference persists in localStorage
- ✅ Language preference restored after page reload
- ✅ Language maintained during section navigation
- ✅ Direct URL access with locale parameter

**Key Test Cases**:

- `should switch between all supported languages`
- `should persist language preference after reload`
- `should update all page content when language changes`
- `should maintain language when navigating between sections`
- `should handle direct URL access with locale`

### 2. Theme Switching (`theme-switching.spec.ts`)

**Requirements**: 17.1, 17.7

Tests dark/light theme functionality:

- ✅ Toggle between light and dark themes
- ✅ Theme changes apply immediately without reload
- ✅ Theme preference persists in localStorage
- ✅ Theme preference restored after page reload
- ✅ Dark mode styles applied to all components
- ✅ System preference detection

**Key Test Cases**:

- `should toggle between light and dark themes`
- `should persist theme preference after reload`
- `should apply dark mode styles to all components`
- `should change theme without page reload`
- `should handle system preference detection`

### 3. Career Path Navigation (`career-path-navigation.spec.ts`)

**Requirements**: 1.3, 1.4, 1.7

Tests career path selection:

- ✅ Switch between Professional and Academic paths
- ✅ Content updates when path changes
- ✅ Path switching without page reload
- ✅ Path selection persists in sessionStorage
- ✅ Active state on selected tab
- ✅ Keyboard navigation support

**Key Test Cases**:

- `should switch between professional and academic paths`
- `should update content when switching paths`
- `should switch paths without page reload`
- `should persist path selection in sessionStorage`
- `should handle keyboard navigation between tabs`

### 4. Contact Form Flow (`contact-form.spec.ts`)

**Requirements**: 3.2, 3.3, 3.4, 3.5

Tests contact form functionality:

- ✅ Display all required fields
- ✅ Validate required fields
- ✅ Validate email format
- ✅ Submit form with valid data
- ✅ Show loading state during submission
- ✅ Handle submission errors gracefully
- ✅ Clear form after successful submission
- ✅ Keyboard navigation support

**Key Test Cases**:

- `should display contact form with all required fields`
- `should validate required fields`
- `should validate email format`
- `should submit form with valid data`
- `should handle submission errors gracefully`
- `should be accessible via keyboard navigation`

**Note**: Tests mock Formspree API to avoid sending real emails during testing.

### 5. Exit Intent Detection (`exit-intent.spec.ts`)

**Requirements**: 19.2, 19.3, 19.7

Tests exit intent modal:

- ✅ Modal appears on exit intent (cursor to top)
- ✅ Modal doesn't trigger before minimum time (5 seconds)
- ✅ Modal doesn't appear on mobile viewports
- ✅ Modal only shows once per session
- ✅ Modal can be dismissed (close button, backdrop, ESC)
- ✅ Proper ARIA attributes for accessibility
- ✅ Focus trap within modal

**Key Test Cases**:

- `should trigger exit intent modal on desktop`
- `should not trigger before minimum time threshold`
- `should not trigger on mobile viewport`
- `should only show modal once per session`
- `should maintain focus trap within modal`

### 6. Print and PDF Output (`print-pdf.spec.ts`)

**Requirements**: 18.2

Tests print/PDF functionality:

- ✅ Non-essential elements hidden in print media
- ✅ Print-friendly typography applied
- ✅ Collapsed content expanded for print
- ✅ PDF generation works correctly
- ✅ Proper page breaks maintained
- ✅ Single-column layout for print
- ✅ Interactive elements hidden
- ✅ Proper margins for print

**Key Test Cases**:

- `should hide non-essential elements in print media`
- `should apply print-friendly typography`
- `should generate PDF with correct content`
- `should maintain proper page breaks in print`
- `should work with different paper sizes`

## Best Practices

### 1. Test Structure

```typescript
test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    // Setup: navigate to page, clear storage, etc.
  });

  test("should do something specific", async ({ page }) => {
    // Arrange: set up test conditions
    // Act: perform user actions
    // Assert: verify expected outcomes
  });
});
```

### 2. Waiting for Elements

```typescript
// ✅ Good: Use built-in waiting
await expect(element).toBeVisible();

// ✅ Good: Wait for specific timeout when needed
await page.waitForTimeout(500);

// ❌ Avoid: Arbitrary long waits
await page.waitForTimeout(5000);
```

### 3. Locators

```typescript
// ✅ Good: Use semantic locators
page.getByRole("button", { name: /submit/i });
page.getByLabel(/email/i);

// ✅ Good: Use test IDs for complex elements
page.locator('[data-testid="project-card"]');

// ❌ Avoid: Brittle CSS selectors
page.locator(".btn-primary.large");
```

### 4. Assertions

```typescript
// ✅ Good: Use Playwright assertions
await expect(element).toBeVisible();
await expect(element).toHaveText("Expected text");

// ✅ Good: Use Jest assertions for non-DOM checks
expect(value).toBe("expected");
```

### 5. Mocking External Services

```typescript
// Mock API calls to avoid external dependencies
await page.route("**/api.example.com/**", (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true }),
  });
});
```

## CI/CD Integration

### GitHub Actions

E2E tests run automatically in CI:

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true
```

### Configuration for CI

- **Retries**: 2 retries on failure in CI
- **Workers**: 1 worker in CI (sequential execution)
- **Reporter**: GitHub Actions reporter + HTML report
- **Artifacts**: Screenshots and videos on failure

## Debugging

### Visual Debugging

```bash
# Run with headed browser
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Run specific test in debug mode
npx playwright test tests/e2e/language-switching.spec.ts --debug
```

### Trace Viewer

```bash
# Generate trace on failure
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Screenshots and Videos

- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Location**: `test-results/` directory

## Coverage

E2E tests cover:

- ✅ Multi-language support (3 languages)
- ✅ Theme switching (light/dark)
- ✅ Career path navigation
- ✅ Contact form submission
- ✅ Exit intent detection
- ✅ Print/PDF output
- ✅ Keyboard navigation
- ✅ Mobile responsiveness
- ✅ Cross-browser compatibility

## Performance

### Test Execution Time

- **Average per test**: 5-15 seconds
- **Full suite**: ~5-10 minutes (all browsers)
- **Single browser**: ~2-3 minutes

### Optimization Tips

1. **Parallel execution**: Tests run in parallel by default
2. **Selective testing**: Run specific browsers during development
3. **Headed mode**: Only use for debugging
4. **Timeouts**: Keep reasonable (30s default)

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Element not found"
**Solution**: Increase wait time or use `waitForSelector`

**Issue**: Tests timeout
**Solution**: Check if server is running, increase timeout

**Issue**: Flaky tests
**Solution**: Add proper waits, avoid race conditions

**Issue**: Different results in CI vs local
**Solution**: Check viewport size, ensure consistent environment

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Next Steps

After E2E tests are passing:

1. ✅ Verify all tests pass locally
2. ✅ Run tests in all browsers
3. ✅ Check test coverage
4. ✅ Review test reports
5. ✅ Integrate with CI/CD pipeline
6. ✅ Monitor test stability over time
