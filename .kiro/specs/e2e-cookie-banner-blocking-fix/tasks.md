# Implementation Plan

## Phase 1: Exploratory Bug Condition Testing

- [x] 1. Write bug condition exploration test - Run unfixed tests to confirm failures
  - **Property 1: Bug Condition** - E2E Tests Fail Due to Cookie Banner Interference
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bugs exist
  - **Scoped PBT Approach**: Run specific failing test cases to ensure reproducibility
  - Run the following test suites on UNFIXED code to observe failures:
    - `tests/e2e/cookie-consent.spec.ts` - Expect strict mode violations and missing UI elements
    - `tests/e2e/email-subscribe.spec.ts` - Verify existing fixes work (should pass)
  - Test implementation details from Bug Condition in design:
    - Pointer event interception: Cookie banner backdrop blocks clicks on UI elements
    - Strict mode violations: Generic selectors match multiple elements
    - Mismatched expectations: Tests expect UI elements that don't match implementation
    - Webkit navigation issues: Navigation to `/` causes interruption errors
  - The test assertions should match the Expected Behavior Properties from design:
    - Tests should successfully interact with UI elements without timeout errors
    - Tests should use specific selectors without strict mode violations
    - Tests should verify elements that actually exist in implementation
    - Tests should use explicit locale paths for navigation
  - Run tests on UNFIXED code using: `npm run test:e2e -- tests/e2e/cookie-consent.spec.ts`
  - **EXPECTED OUTCOME**: Tests FAIL with specific error patterns:
    - "strict mode violation: locator resolved to X elements"
    - "element not found" for customize view components
    - "page navigation interrupted" on Webkit
    - Timeout errors for pointer event interception
  - Document counterexamples found to understand root cause:
    - Which selectors cause strict mode violations
    - Which UI elements are missing or have different selectors
    - Which tests fail on Webkit due to navigation
    - Which tests timeout due to cookie banner blocking
  - Mark task complete when tests are run, failures are documented, and root causes are confirmed
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

## Phase 2: Preservation Property Testing

- [ ] 2. Write preservation property tests - Verify non-affected functionality (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Affected Tests and Production Functionality
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (tests not affected by cookie banner issues)
  - Write test verification plan capturing observed behavior patterns from Preservation Requirements:
    - Cookie banner production functionality (display, consent flows, persistence, analytics)
    - Non-affected test suites (tests that don't interact with cookie banner)
    - Helper function compatibility (`dismissCookieBanner` continues to work)
  - Verification approach (not property-based testing since we're fixing test code):
    - Run non-affected E2E test suites and record pass/fail baseline
    - Manually test cookie banner in browser to verify production functionality
    - Verify `dismissCookieBanner` helper works in `email-subscribe.spec.ts`
  - Run tests on UNFIXED code to establish baseline:
    - Identify which test suites are NOT affected by cookie banner issues
    - Record current pass/fail counts for comparison after fix
    - Manually test cookie banner flows (accept, reject, customize) in browser
  - **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirms baseline behavior to preserve)
  - Document baseline behavior:
    - List of non-affected test suites and their pass/fail counts
    - Cookie banner production functionality verification checklist
    - Helper function usage patterns in existing tests
  - Mark task complete when baseline is documented and preservation requirements are clear
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

## Phase 3: Implementation

- [ ] 3. Fix E2E test failures caused by cookie banner blocking interactions
  - [x] 3.1 Fix strict mode violations in cookie-consent.spec.ts
    - Replace generic text selectors with specific role-based selectors
    - Change `banner.getByText(/cookies/i)` to `banner.getByRole("heading", { name: /cookies/i })`
    - Change `banner.getByText(/essential|essencial/i)` to `banner.getByText(/essential|essencial/i).first()`
    - Add specific accessible names to dialog selectors: `getByRole("dialog", { name: /cookies|privacidade/i })`
    - Update all generic selectors to be specific and match exactly one element
    - _Bug_Condition: isBugCondition(input) where input.selector IS generic AND matches multiple elements_
    - _Expected_Behavior: Tests use specific selectors (role + name OR .first()) that match exactly one element_
    - _Preservation: Cookie banner production functionality unchanged (display, consent, persistence)_
    - _Requirements: 2.1, 3.1, 3.2, 3.3_

  - [ ] 3.2 Update test expectations to match actual UI implementation
    - Inspect actual cookie banner component (`components/CookieConsent/index.tsx`)
    - Verify customize view structure and update selectors accordingly
    - Update checkbox selectors to match actual `aria-label` attributes from translations
    - Verify "back" button selector matches actual implementation
    - If customize view doesn't exist or differs significantly, mark tests as `.skip()` with explanation
    - Document any features that are tested but not implemented
    - _Bug_Condition: isBugCondition(input) where input.expectation DOES NOT MATCH actual UI implementation_
    - _Expected_Behavior: Tests verify elements that actually exist with correct selectors and expected values_
    - _Preservation: Cookie banner UI structure and translations unchanged_
    - _Requirements: 2.2, 3.6, 3.7_

  - [ ] 3.3 Fix Webkit navigation issues
    - Replace all `await page.goto("/")` with explicit locale paths
    - Use `await page.goto("/pt-BR")` for Portuguese tests
    - Use `await page.goto("/en")` for English tests
    - Use `await page.goto("/es")` for Spanish tests
    - Ensure consistent locale usage across all tests in cookie-consent.spec.ts
    - _Bug_Condition: isBugCondition(input) where input.testFile navigates to "/" causing Webkit interruption_
    - _Expected_Behavior: Tests use explicit locale paths preventing navigation interruption errors_
    - _Preservation: Application routing and locale detection unchanged_
    - _Requirements: 2.3, 3.6_

  - [ ] 3.4 Verify email-subscribe.spec.ts fixes are working
    - Confirm `dismissCookieBanner(page)` is called in both test suite `beforeEach` hooks
    - Run email-subscribe.spec.ts tests to verify they pass
    - Specifically verify Webkit-specific failure in "submits email from exit intent modal" is resolved
    - If still failing, investigate and apply additional fixes
    - _Bug_Condition: isBugCondition(input) where cookieBannerVisible AND input.action IN ['click', 'fill', 'focus']_
    - _Expected_Behavior: Tests dismiss cookie banner before interactions, completing without timeout_
    - _Preservation: Email form functionality and exit intent modal behavior unchanged_
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 3.4, 3.5, 3.8_

  - [ ] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - E2E Tests Interact Successfully Without Cookie Banner Interference
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 1:
      - `npm run test:e2e -- tests/e2e/cookie-consent.spec.ts`
      - `npm run test:e2e -- tests/e2e/email-subscribe.spec.ts`
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs are fixed)
    - Verify specific fixes:
      - No strict mode violations (specific selectors work)
      - No "element not found" errors (expectations match implementation)
      - No "page navigation interrupted" on Webkit (explicit locale paths work)
      - No timeout errors (cookie banner dismissed or not blocking)
    - Document test results and any remaining issues
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Affected Tests and Production Functionality
    - **IMPORTANT**: Re-run the SAME verification from task 2 - do NOT write new tests
    - Run preservation verification from step 2:
      - Run non-affected E2E test suites and compare pass/fail counts to baseline
      - Manually test cookie banner in browser (accept, reject, customize flows)
      - Verify `dismissCookieBanner` helper still works correctly
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify preservation requirements:
      - Cookie banner production functionality unchanged (display, consent, persistence, analytics)
      - Non-affected test suites have same pass/fail counts as baseline
      - Helper function compatibility maintained
      - Multi-language support works correctly
      - Accessibility features (keyboard navigation, ARIA labels) work correctly
    - Document any unexpected changes or regressions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

## Phase 4: Integration Testing

- [ ] 4. Run comprehensive E2E testing across all browsers
  - [ ] 4.1 Run full E2E test suite on all browsers
    - Execute: `npm run test:e2e` (runs all browsers: Chromium, Firefox, Webkit)
    - Target: Reduce failures from 109 to near-zero
    - Expected results by browser:
      - Chromium: 20 failures → 0 failures
      - Firefox: 39 failures → 0 failures
      - Webkit: 63 failures → 0 failures
      - Mobile Chrome: 83 failures → 0 failures
      - Mobile Safari: 109 failures → 0 failures
    - Document any remaining failures and investigate root causes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 4.2 Verify cookie banner + email form integration
    - Run both test suites together: `npm run test:e2e -- tests/e2e/cookie-consent.spec.ts tests/e2e/email-subscribe.spec.ts`
    - Verify cookie banner dismissal doesn't interfere with email form tests
    - Verify email form tests don't interfere with cookie banner tests
    - Check for any test isolation issues or race conditions
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 3.4, 3.5, 3.8_

  - [ ] 4.3 Verify cookie banner + exit intent modal integration
    - Test interaction between cookie banner and exit intent modal
    - Verify cookie banner is dismissed before exit intent triggers
    - Verify exit intent modal interactions work correctly after cookie banner dismissal
    - Test on Webkit specifically (where this was failing)
    - _Requirements: 2.8, 3.5_

  - [ ] 4.4 Verify multi-browser consistency
    - Run fixed tests on all browsers: Chromium, Firefox, Webkit
    - Verify tests pass consistently across all browsers
    - Run mobile browser tests: Mobile Chrome, Mobile Safari
    - Document any browser-specific behaviors that require special handling
    - _Requirements: 3.10_

## Phase 5: CI/CD Pipeline Verification

- [ ] 5. Verify fixes work in CI/CD environment
  - [ ] 5.1 Run E2E tests in CI pipeline
    - Push changes to a feature branch
    - Trigger CI workflow (`.github/workflows/ci.yml`)
    - Verify E2E tests pass in CI environment (not just locally)
    - Check test execution time remains reasonable (no significant slowdown)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ] 5.2 Verify no flaky tests introduced
    - Run E2E test suite multiple times (at least 3 runs)
    - Check for any intermittent failures or flaky tests
    - If flaky tests found, investigate and fix (may need additional waits or more robust selectors)
    - Document test stability and any known issues
    - _Requirements: 3.9, 3.10_

  - [ ] 5.3 Update documentation
    - Update E2E-TEST-FAILURES.md with fix summary and results
    - Document any remaining known issues or limitations
    - Add notes about cookie banner dismissal pattern for future test development
    - Update test documentation with best practices for handling cookie banner
    - _Requirements: All requirements validated_

## Phase 6: Final Checkpoint

- [ ] 6. Final checkpoint - Ensure all tests pass and requirements are met
  - Verify all E2E tests pass across all browsers
  - Verify cookie banner production functionality unchanged
  - Verify non-affected test suites still pass
  - Verify CI/CD pipeline passes
  - Review all requirements (1.1-1.8, 2.1-2.8, 3.1-3.10) and confirm they are satisfied
  - Ask the user if any questions arise or if additional verification is needed
  - _Requirements: All requirements (1.1-1.8, 2.1-2.8, 3.1-3.10)_
