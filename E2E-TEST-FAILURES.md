# E2E Test Failures - Cookie Consent Banner Blocking Interactions

## Issue Summary

Multiple E2E tests are failing because the cookie consent banner is intercepting pointer events and blocking interactions with form elements and other UI components.

## Affected Test Suites

### 1. Cookie Consent Banner Tests

- **Strict mode violations**: Multiple tests using generic selectors that match both cookie banner and other dialogs
- **Missing customize functionality**: Tests expecting checkboxes and customize views that don't exist
- **Navigation issues (webkit/mobile-safari)**: Page navigation interrupted errors
- **Focus management**: Keyboard navigation and focus trap tests failing

**Affected tests:**

- `should show essential and analytics cookie categories` - Strict mode violation (2 elements match)
- `should show customize view when clicked` - Customize view not found
- `should have essential cookies always enabled` - Checkbox not found
- `should allow toggling analytics preference` - Checkbox not found
- `should allow toggling functional preference` - Checkbox not found
- `should save custom preferences` - Cannot click analytics checkbox
- `should persist custom preferences across reloads` - Cannot click analytics checkbox
- `should respect analytics preference for tracking` - Cannot click analytics checkbox
- `should return to main view when back button clicked` - Customize view not found
- `should reopen banner from footer link` - Cookie settings link timeout
- `should allow changing existing consent` - Cookie settings link timeout
- `should display banner in Portuguese/English/Spanish` - Strict mode violation (multiple elements match)
- `should be keyboard navigable` - Accept button not focused
- `should have proper ARIA labels` - Analytics checkbox not found
- `should trap focus in modal` - Accept button not focused

### 2. EmailSubscribeForm - Main Page Tests

- **Cookie banner blocking clicks**: Submit button clicks timing out because cookie consent dialog intercepts pointer events

**Affected tests:**

- `shows validation error for empty submission` - Cannot click submit button (cookie dialog intercepts)
- `submits valid email and shows success message` - Cannot click submit button (cookie dialog intercepts)
- `shows error message on API failure` - Cannot click submit button (cookie dialog intercepts)

### 3. EmailSubscribeForm - Exit Intent Modal Tests

- **Fixed**: ✅ Dialog selector now uses specific accessible name `'Hey, wait!'`
- **Remaining issue (webkit only)**: One test failing due to cookie banner intercepting clicks

**Affected tests:**

- `submits email from exit intent modal` (webkit only) - Cannot click "Contact me" button

## Root Causes

### 1. Cookie Banner Intercepts Pointer Events

The cookie consent banner has `z-index: 50` and covers the entire viewport with a backdrop, preventing clicks on elements beneath it.

**Error pattern:**

```
<div role="dialog" aria-modal="true" aria-labelledby="cookie-consent-title"
     class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
  ...
</div> intercepts pointer events
```

### 2. Strict Mode Violations

Generic selectors like `getByText(/cookies/i)` or `getByText(/essential|essencial/i)` match multiple elements within the cookie banner, causing Playwright strict mode violations.

### 3. Missing UI Components

Tests expect a "customize" view with checkboxes for cookie preferences, but the current implementation may not have this functionality or uses different selectors.

### 4. Navigation Issues (webkit/mobile-safari)

Webkit browsers show navigation interruption errors when redirecting from `/` to `/pt-BR/`.

## Proposed Solutions

### Solution 1: Dismiss Cookie Banner in Test Setup (Recommended)

Update the `beforeEach` hook in affected test files to dismiss the cookie banner before running tests.

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await dismissCookieBanner(page); // Already exists in helpers
  // ... rest of setup
});
```

### Solution 2: Fix Strict Mode Violations

Use more specific selectors with `.first()` or unique identifiers:

```typescript
// Instead of:
await expect(banner.getByText(/cookies/i)).toBeVisible();

// Use:
await expect(banner.getByRole("heading", { name: /cookies/i })).toBeVisible();
// or
await expect(banner.getByText(/cookies/i).first()).toBeVisible();
```

### Solution 3: Update Cookie Banner Tests

- Verify the actual UI structure of the cookie banner
- Update test expectations to match the actual implementation
- If customize functionality doesn't exist, mark those tests as `.skip()` or implement the feature

### Solution 4: Fix Webkit Navigation Issues

Use explicit locale paths instead of relying on redirects:

```typescript
// Instead of:
await page.goto("/");

// Use:
await page.goto("/pt-BR");
// or
await page.goto("/en");
```

## Test Failure Statistics

- **Total E2E tests**: 480
- **Failed**: 109
- **Passed**: 138
- **Skipped**: 233

### Failures by Browser:

- **Chromium**: 20 failures
- **Firefox**: 39 failures
- **Webkit**: 63 failures
- **Mobile Chrome**: 83 failures
- **Mobile Safari**: 109 failures

## Priority

**High Priority** - These test failures are blocking CI/CD pipeline and preventing proper validation of the application.

## Estimated Effort

- **Cookie banner dismissal in tests**: 2-4 hours
- **Fix strict mode violations**: 1-2 hours
- **Update cookie banner test expectations**: 2-4 hours
- **Fix webkit navigation issues**: 1-2 hours

**Total**: 6-12 hours

## Related Files

- `tests/e2e/cookie-consent.spec.ts` - Cookie consent banner tests
- `tests/e2e/email-subscribe.spec.ts` - Email form tests (partially fixed)
- `tests/e2e/helpers/dismissCookieBanner.ts` - Helper function for dismissing banner
- `components/CookieConsent.tsx` - Cookie consent banner component (likely location)

## Next Steps

1. Investigate the actual cookie consent banner implementation
2. Verify which features exist (customize view, checkboxes, etc.)
3. Update `dismissCookieBanner` helper if needed
4. Apply cookie banner dismissal to all affected test suites
5. Fix strict mode violations with specific selectors
6. Update or skip tests for non-existent features
7. Fix webkit navigation issues
8. Re-run E2E test suite to verify fixes

## Notes

- The exit intent modal tests were successfully fixed by using specific accessible names
- The same pattern should be applied to other dialog-related tests
- Consider adding a global test setup to automatically dismiss the cookie banner for all E2E tests
