# E2E Test Fixes Summary

## Date

May 1, 2026

## Overview

Fixed 2 failing E2E tests that were breaking in CI:

1. Email validation error message test
2. Print media language selector hiding test

## Issues Fixed

### 1. Email Validation Error Message Test

**File**: `tests/e2e/email-subscribe.spec.ts`

**Issue**: Test was looking for exact text "Enter a valid email" but the actual translation key produces "Email must be a valid email address"

**Root Cause**:

- The ContactForm component uses translation key `t("emailInvalid")`
- Translation files have: `"emailInvalid": "Email must be a valid email address"` (en)
- Test was checking for hardcoded text that didn't match the actual translation

**Fix**: Updated test to use regex pattern `/valid.*email/i` to match any variation of the validation message across all locales

**Changes**:

```typescript
// Before
await expect(section.locator("text=Enter a valid email")).toBeVisible();

// After
await expect(section.locator("text=/valid.*email/i")).toBeVisible();
```

### 2. Print Media Language Selector Test

**File**: `tests/e2e/print-pdf.spec.ts`

**Issue**: Test was checking if language selector `<select>` element was hidden, but the element itself wasn't hidden - its parent container was

**Root Cause**:

- LanguageSelector component wraps the `<select>` in a `<div>` with Tailwind's `print:hidden` utility class
- The `print:hidden` class applies `display: none` to the parent div, not the select element
- Test was checking the select element's display property, which remained "inline-block"

**Fix**: Updated test to check the parent container's display property instead of the select element itself

**Changes**:

```typescript
// Before
const languageSelector = page.locator('select[id="language-selector"]');
const languageSelectorDisplay = await languageSelector.first().evaluate((el) => {
  return window.getComputedStyle(el).display;
});
expect(languageSelectorDisplay).toBe("none");

// After
const languageSelectorContainer = page.locator('div:has(> select[id="language-selector"])');
const containerDisplay = await languageSelectorContainer.first().evaluate((el) => {
  return window.getComputedStyle(el).display;
});
expect(containerDisplay).toBe("none");
```

**Additional Changes**:

- Increased wait time from 500ms to 1000ms for print styles to apply
- Added `waitForLoadState("networkidle")` before emulating print media
- Added `waitFor({ state: "attached" })` for nav element to ensure it's in DOM before checking

## Files Modified

1. `tests/e2e/email-subscribe.spec.ts`
   - Updated validation error message matcher to use regex

2. `tests/e2e/print-pdf.spec.ts`
   - Updated language selector check to target parent container
   - Improved timing and wait conditions for print media emulation

3. `styles/print.css`
   - Removed redundant `.language-selector` class selector (component uses Tailwind's `print:hidden`)

## Test Results

### Before Fixes

- 2 tests failing across all browsers (chromium, firefox, webkit, mobile-chrome, mobile-safari)
- Total: 10 failures (2 tests × 5 browsers)

### After Fixes

- All tests passing ✅
- 20 tests passed in chromium
- 82 tests passed across all browsers (when running full suite)

## Verification

Run the fixed tests:

```bash
npm run test:e2e -- tests/e2e/email-subscribe.spec.ts tests/e2e/print-pdf.spec.ts
```

Expected result: All tests pass ✅

## Related Components

- `components/ContactForm/index.tsx` - Uses translation keys for validation messages
- `components/LanguageSelector/index.tsx` - Uses Tailwind's `print:hidden` utility
- `messages/en.json`, `messages/pt-BR.json`, `messages/es.json` - Translation files

## Lessons Learned

1. **Always check actual translations**: Don't hardcode expected text in tests when using i18n
2. **Understand CSS specificity**: Check parent elements when testing visibility/display properties
3. **Tailwind utilities**: Remember that Tailwind utilities like `print:hidden` apply to the element they're on, not children
4. **Test timing**: Print media queries may need extra time to apply in test environments

## CI Impact

These fixes should resolve the CI failures reported in the latest pipeline run. The tests now correctly:

- Match translated validation messages across all locales
- Check the correct element for print media hiding behavior
