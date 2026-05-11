# E2E Cookie Banner Blocking Fix - Technical Design

## Overview

This design addresses systematic E2E test failures caused by the cookie consent banner intercepting pointer events and blocking interactions with UI elements. The bug affects 109 out of 480 E2E tests across multiple browsers, preventing proper validation of application functionality and blocking the CI/CD pipeline.

The fix involves three main strategies: (1) systematically dismissing the cookie banner in test setup using the existing helper function, (2) fixing strict mode violations with specific selectors, and (3) updating test expectations to match the actual UI implementation. The approach ensures tests can interact with UI elements without interference while preserving the cookie banner's production functionality.

## Glossary

- **Bug_Condition (C)**: The condition that triggers test failures - when E2E tests attempt to interact with UI elements while the cookie consent banner is visible with its backdrop overlay (z-index: 50) intercepting pointer events
- **Property (P)**: The desired behavior - E2E tests should successfully interact with all UI elements without timeout errors or strict mode violations
- **Preservation**: Existing cookie banner functionality, user consent flows, and non-affected test suites that must remain unchanged
- **dismissCookieBanner**: Helper function in `tests/e2e/helpers/dismissCookieBanner.ts` that dismisses the cookie banner by clicking accept/reject buttons
- **Strict Mode Violation**: Playwright error when a selector matches multiple elements and the test doesn't specify which one to use
- **Pointer Event Interception**: When a modal overlay with higher z-index prevents clicks from reaching elements beneath it
- **Cookie Consent Banner**: The modal dialog component in `components/CookieConsent/index.tsx` that appears on first visit with a backdrop overlay

## Bug Details

### Bug Condition

The bug manifests when E2E tests attempt to interact with UI elements (buttons, inputs, links) while the cookie consent banner is visible. The banner's backdrop overlay (`fixed inset-0 z-50 bg-black/50`) intercepts pointer events, preventing clicks from reaching target elements beneath it. Additionally, generic selectors match multiple elements within the banner structure, causing Playwright strict mode violations.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type E2ETestInteraction
  OUTPUT: boolean

  RETURN (input.targetElement EXISTS on page)
         AND (cookieBannerVisible() == true)
         AND (cookieBannerBackdropInterceptsPointerEvents() == true)
         AND (input.action IN ['click', 'fill', 'focus'])

  OR

  RETURN (input.selector IS generic text/role selector)
         AND (input.selector MATCHES multiple elements in cookie banner)
         AND (strictMode == true)

  OR

  RETURN (input.testFile == 'cookie-consent.spec.ts')
         AND (input.expectation DOES NOT MATCH actual UI implementation)
END FUNCTION
```

### Examples

**Pointer Event Interception:**

- Test attempts to click submit button on email form → Times out because cookie banner backdrop intercepts the click event
- Test attempts to click "Contact me" button in exit intent modal (Webkit) → Times out because cookie banner is still visible
- Test attempts to fill email input field → Cannot focus the input because banner overlay blocks interaction

**Strict Mode Violations:**

- Test uses `banner.getByText(/cookies/i)` → Matches multiple text nodes within the banner (title, description, links)
- Test uses `banner.getByText(/essential|essencial/i)` → Matches both the category heading and the description text
- Test uses generic `getByRole("dialog")` without specific name → Matches both cookie banner and other dialogs

**Mismatched Expectations:**

- Test expects customize view to show heading with text "Customize Preferences" → Actual heading uses translation key `customizeTitle`
- Test expects checkboxes with specific accessible names → Actual checkboxes use `aria-label` from translation keys
- Test expects "Cookie Settings" link in footer → Actual link text may differ based on locale

**Webkit Navigation Issues:**

- Test navigates to `/` expecting redirect to `/pt-BR/` → Webkit throws "page navigation interrupted" error during redirect
- Test expects page to load after navigation → Webkit fails to complete navigation due to redirect timing

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Cookie consent banner must continue to display on first visit with proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
- User consent choices (accept all, reject all, customize) must continue to persist in localStorage
- Analytics tracking must continue to respect user consent preferences
- Multi-language support must continue to work across all locales (pt-BR, en, es)
- Keyboard navigation and focus management must continue to function correctly
- Non-affected test suites must continue to pass without modifications

**Scope:**
All production functionality of the cookie consent banner should be completely unaffected by this fix. This includes:

- Banner display logic and timing
- Consent persistence mechanisms
- Analytics initialization based on consent
- Accessibility features (keyboard navigation, ARIA labels, focus trap)
- Multi-language translations
- Visual styling and responsive behavior

The fix only affects test setup, selectors, and expectations - not the production code behavior.

## Hypothesized Root Cause

Based on the bug description and code analysis, the root causes are:

1. **Missing Cookie Banner Dismissal in Test Setup**: Most affected test files do not call `dismissCookieBanner()` in their `beforeEach` hooks, allowing the banner to remain visible and intercept pointer events during test execution. The helper function exists but is not consistently applied across all test suites.

2. **Generic Selectors Causing Strict Mode Violations**: Tests use overly broad selectors like `getByText(/cookies/i)` that match multiple elements within the cookie banner's DOM structure (heading, description, links). Playwright's strict mode requires selectors to match exactly one element.

3. **Test Expectations Not Matching Actual Implementation**: Cookie consent tests expect UI elements (customize view heading, checkbox labels, button text) that either don't exist or use different text/attributes than expected. The tests were written based on requirements but not validated against the actual component implementation.

4. **Webkit Navigation Timing Issues**: Tests navigate to `/` expecting automatic redirect to `/pt-BR/`, but Webkit browsers encounter timing issues during the redirect, causing "page navigation interrupted" errors. Using explicit locale paths avoids this issue.

5. **Insufficient Selector Specificity**: Tests use `getByRole("dialog")` without specifying the accessible name, which can match multiple dialogs (cookie banner, exit intent modal, other modals) depending on page state.

## Correctness Properties

Property 1: Bug Condition - E2E Tests Interact Successfully Without Cookie Banner Interference

_For any_ E2E test interaction where the test attempts to click, fill, or focus a UI element and the cookie consent banner is visible, the fixed test setup SHALL dismiss the cookie banner before the interaction, ensuring the interaction completes successfully without timeout errors or pointer event interception.

**Validates: Requirements 2.5, 2.6, 2.7, 2.8**

Property 2: Bug Condition - Strict Mode Violations Resolved

_For any_ E2E test selector that previously matched multiple elements within the cookie banner, the fixed test SHALL use specific selectors (role with accessible name, `.first()`, or unique identifiers) that match exactly one element, eliminating strict mode violations.

**Validates: Requirements 2.1**

Property 3: Bug Condition - Test Expectations Match Implementation

_For any_ E2E test assertion about cookie banner UI elements, the fixed test SHALL verify elements that actually exist in the implementation with correct selectors and expected values, or skip tests for non-existent features with clear documentation.

**Validates: Requirements 2.2**

Property 4: Bug Condition - Webkit Navigation Issues Resolved

_For any_ E2E test that navigates to a page, the fixed test SHALL use explicit locale paths (e.g., `/pt-BR`, `/en`) instead of relying on redirects from `/`, preventing Webkit navigation interruption errors.

**Validates: Requirements 2.3**

Property 5: Preservation - Cookie Banner Production Functionality

_For any_ user interaction with the cookie consent banner in production, the fixed code SHALL produce exactly the same behavior as the original code, preserving all consent flows, persistence mechanisms, analytics integration, and accessibility features.

**Validates: Requirements 3.1, 3.2, 3.3, 3.6, 3.7**

Property 6: Preservation - Non-Affected Test Suites

_For any_ E2E test in test suites not affected by cookie banner issues, the fixed code SHALL produce exactly the same test results as the original code, with no changes to test setup or assertions.

**Validates: Requirements 3.9, 3.10**

Property 7: Preservation - Helper Function Compatibility

_For any_ E2E test that uses the `dismissCookieBanner` helper function, the fixed code SHALL continue to provide the same helper functionality for accepting or rejecting the banner.

**Validates: Requirements 3.8**

## Fix Implementation

### Changes Required

The fix involves modifications to test files only - no production code changes are needed.

**File 1**: `tests/e2e/cookie-consent.spec.ts`

**Changes**:

1. **Fix Strict Mode Violations**: Replace generic text selectors with specific role-based selectors
   - Replace `banner.getByText(/cookies/i)` with `banner.getByRole("heading", { name: /cookies/i })`
   - Replace `banner.getByText(/essential|essencial/i)` with `banner.getByText(/essential|essencial/i).first()`
   - Add specific accessible names to dialog selectors: `getByRole("dialog", { name: /cookies|privacidade/i })`

2. **Update Customize View Expectations**: Verify actual UI structure and update selectors
   - Inspect actual heading text from `t("customizeTitle")` translation
   - Update checkbox selectors to match actual `aria-label` attributes
   - Verify "back" button selector matches actual implementation

3. **Fix Webkit Navigation**: Use explicit locale paths in all navigation
   - Replace `await page.goto("/")` with `await page.goto("/pt-BR")` or `await page.goto("/en")`
   - Ensure consistent locale usage across all tests in the suite

4. **Update or Skip Non-Existent Features**: Verify which features exist and skip tests accordingly
   - If customize view doesn't match expectations, update selectors or mark tests as `.skip()` with explanation
   - Document any features that are tested but not implemented

**File 2**: `tests/e2e/email-subscribe.spec.ts`

**Status**: Already fixed - `dismissCookieBanner(page)` is called in `beforeEach` hooks for both test suites

**Verification Needed**: Confirm the Webkit-specific failure in "submits email from exit intent modal" is resolved by the existing dismissal

**File 3**: `tests/e2e/helpers/dismissCookieBanner.ts`

**Potential Enhancement** (optional): Add better error handling and logging

- Current implementation already has try-catch with console.log
- Consider adding explicit wait for page stability after dismissal
- Consider adding option to wait for reload completion when accepting (since accept triggers page reload)

**File 4**: Other affected test files (if any)

**Pattern to Apply**: Add cookie banner dismissal to `beforeEach` hooks

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto("/en"); // Use explicit locale
  await dismissCookieBanner(page); // Dismiss banner before tests
  // ... rest of setup
});
```

### Specific Implementation Details

**Strict Mode Fix Example:**

```typescript
// BEFORE (strict mode violation)
await expect(banner.getByText(/cookies/i)).toBeVisible();

// AFTER (specific selector)
await expect(banner.getByRole("heading", { name: /cookies/i })).toBeVisible();
```

**Customize View Fix Example:**

```typescript
// BEFORE (may not match actual implementation)
await expect(banner.getByText(/personalizar|customize preferences/i)).toBeVisible();

// AFTER (verify actual translation key and update)
await expect(
  banner.getByRole("heading", { name: /personalizar preferências|customize preferences/i })
).toBeVisible();
```

**Webkit Navigation Fix Example:**

```typescript
// BEFORE (causes navigation interruption)
await page.goto("/");

// AFTER (explicit locale path)
await page.goto("/pt-BR");
```

**Checkbox Selector Fix Example:**

```typescript
// BEFORE (may not match actual aria-label)
const analyticsCheckbox = banner.getByRole("checkbox", { name: /analíticos|analytics/i });

// AFTER (verify actual aria-label from component)
const analyticsCheckbox = banner.getByRole("checkbox", { name: t("analytics") });
// OR use more flexible matching
const analyticsCheckbox = banner.locator('input[type="checkbox"][aria-label*="analytic"]');
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed tests, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**:

1. Run the affected E2E test suites on the UNFIXED code to observe failures
2. Capture specific error messages and failure patterns
3. Verify that failures match the hypothesized root causes
4. Document any unexpected failure patterns that suggest additional root causes

**Test Cases**:

1. **Email Form Pointer Interception Test**: Run `tests/e2e/email-subscribe.spec.ts` without `dismissCookieBanner()` in setup (will fail on unfixed code)
   - Expected: Timeout errors when clicking submit button
   - Confirms: Cookie banner intercepts pointer events

2. **Strict Mode Violation Test**: Run cookie consent tests with generic selectors (will fail on unfixed code)
   - Expected: "strict mode violation: locator resolved to X elements" errors
   - Confirms: Generic selectors match multiple elements

3. **Webkit Navigation Test**: Run tests that navigate to `/` on Webkit browser (will fail on unfixed code)
   - Expected: "page navigation interrupted" errors
   - Confirms: Webkit has issues with redirect timing

4. **Customize View Test**: Run tests expecting customize view elements (may fail on unfixed code)
   - Expected: "element not found" errors for checkboxes or headings
   - Confirms: Test expectations don't match actual implementation

**Expected Counterexamples**:

- Timeout errors with message "element is not visible" or "element intercepts pointer events"
- Strict mode violations with message "locator resolved to 2 elements"
- Navigation errors with message "page navigation interrupted"
- Element not found errors for customize view components

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed tests produce the expected behavior (successful interactions without errors).

**Pseudocode:**

```
FOR ALL test IN affectedTests DO
  IF test.requiresUIInteraction AND cookieBannerVisible() THEN
    ASSERT dismissCookieBanner() called in beforeEach
    ASSERT test.interactions complete without timeout
  END IF

  IF test.usesGenericSelector THEN
    ASSERT test.selector is specific (role + name OR .first())
    ASSERT test runs without strict mode violations
  END IF

  IF test.navigatesToRoot THEN
    ASSERT test.navigation uses explicit locale path
    ASSERT test runs without navigation errors on Webkit
  END IF

  IF test.expectsCustomizeView THEN
    ASSERT test.selectors match actual implementation
    OR test is marked .skip() with explanation
  END IF
END FOR
```

**Test Execution Plan**:

1. Apply fixes to `tests/e2e/cookie-consent.spec.ts`
2. Run the full cookie consent test suite on all browsers (Chromium, Firefox, Webkit)
3. Verify all tests pass or are explicitly skipped with documentation
4. Run `tests/e2e/email-subscribe.spec.ts` to confirm existing fixes still work
5. Run full E2E test suite to verify no regressions in other tests

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**

```
FOR ALL test IN nonAffectedTests DO
  ASSERT test.setup unchanged
  ASSERT test.assertions unchanged
  ASSERT test.results == originalResults
END FOR

FOR ALL userInteraction IN productionCookieBanner DO
  ASSERT cookieBanner.display() == original.display()
  ASSERT cookieBanner.acceptAll() == original.acceptAll()
  ASSERT cookieBanner.rejectAll() == original.rejectAll()
  ASSERT cookieBanner.customize() == original.customize()
  ASSERT cookieBanner.persistence() == original.persistence()
END FOR
```

**Testing Approach**: Property-based testing is NOT applicable here because we're fixing test code, not production code. Instead, we use regression testing to ensure:

- Non-affected test suites continue to pass
- Production cookie banner functionality remains unchanged
- Manual testing confirms user flows work correctly

**Test Plan**:

1. **Non-Affected Test Suite Verification**:
   - Run all E2E test suites that don't involve cookie banner or email forms
   - Verify pass/fail counts match baseline (before fix)
   - Investigate any new failures to ensure they're not caused by the fix

2. **Production Cookie Banner Manual Testing**:
   - Test accept all flow: Banner appears → Click accept → Banner disappears → Preferences persist → Analytics enabled
   - Test reject all flow: Banner appears → Click reject → Banner disappears → Preferences persist → Analytics disabled
   - Test customize flow: Banner appears → Click customize → Toggle preferences → Save → Banner disappears → Custom preferences persist
   - Test multi-language: Verify banner displays correctly in pt-BR, en, es
   - Test keyboard navigation: Tab through buttons → Press Enter → Verify actions work
   - Test reopen from footer: Accept cookies → Click "Cookie Settings" link → Banner reopens

3. **Helper Function Compatibility**:
   - Verify `dismissCookieBanner()` still works with both "accept" and "reject" actions
   - Verify `setCookieConsent()` still works for direct localStorage manipulation
   - Test helper in different test contexts (before navigation, after navigation, with different locales)

**Test Cases**:

1. **Non-Cookie-Banner Tests**: Run test suites for other features (navigation, forms, content display) and verify they pass
2. **Production Accept Flow**: Manually test accepting cookies in browser and verify analytics initializes
3. **Production Reject Flow**: Manually test rejecting cookies and verify analytics does not initialize
4. **Production Customize Flow**: Manually test customizing preferences and verify correct persistence
5. **Multi-Language Display**: Manually test banner in all three locales and verify correct translations
6. **Keyboard Navigation**: Manually test keyboard navigation and verify focus management works
7. **Helper Function**: Run tests that use `dismissCookieBanner()` and verify they still pass

### Unit Tests

Since this fix only modifies E2E test code (not production code), traditional unit tests are not applicable. However, we should verify:

- Cookie banner component unit tests (`tests/unit/components/CookieConsent.test.tsx`) continue to pass
- Cookie consent hook unit tests continue to pass
- No new TypeScript compilation errors introduced by test changes

### Property-Based Tests

Property-based testing is not applicable for this fix because:

- We're fixing test code, not production code
- The bugs are in test setup and selectors, not in algorithmic logic
- The fix is deterministic (add dismissal, fix selectors, update expectations)

If we were fixing the cookie banner component itself, property-based tests would be valuable for testing consent persistence across random user interactions.

### Integration Tests

The E2E tests themselves serve as integration tests. After applying fixes:

1. **Full E2E Suite Execution**: Run all 480 E2E tests across all browsers
   - Target: Reduce failures from 109 to near-zero (only legitimate bugs should fail)
   - Verify: Chromium (20→0), Firefox (39→0), Webkit (63→0), Mobile Chrome (83→0), Mobile Safari (109→0)

2. **Cookie Banner + Email Form Integration**: Run both test suites together
   - Verify: Cookie banner dismissal doesn't interfere with email form tests
   - Verify: Email form tests don't interfere with cookie banner tests

3. **Cookie Banner + Exit Intent Modal Integration**: Test interaction between two modals
   - Verify: Cookie banner dismissed before exit intent triggers
   - Verify: Exit intent modal interactions work correctly after cookie banner dismissal

4. **Multi-Browser Consistency**: Run fixed tests on all browsers
   - Verify: Tests pass consistently across Chromium, Firefox, Webkit
   - Verify: Mobile browsers (Mobile Chrome, Mobile Safari) also pass
   - Document: Any browser-specific behaviors that require special handling

5. **CI/CD Pipeline Integration**: Run full test suite in CI environment
   - Verify: Tests pass in CI environment (not just locally)
   - Verify: Test execution time remains reasonable
   - Verify: No flaky tests introduced by the fix
