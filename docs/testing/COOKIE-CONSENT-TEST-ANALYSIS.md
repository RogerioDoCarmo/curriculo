# Cookie Consent Implementation - Test Analysis

**Date**: 2025-01-XX  
**Status**: Phase 1 Complete (Unit Tests)  
**Decision**: Tests Required

## Summary

The cookie consent implementation requires **new tests** to be created. The existing analytics property tests are sufficient for event structure validation, but we need specific tests for:

1. **Unit Tests**: Cookie consent hook and component behavior
2. **Integration Tests**: Analytics provider consent integration
3. **E2E Tests**: Complete user consent flow

## Analysis

### ✅ Existing Tests (No Updates Needed)

#### 1. Analytics Property Tests (`tests/properties/analytics.test.ts`)

**Status**: ✅ **No changes needed**

**Reason**: These tests validate analytics event structure and parameters, which remain unchanged. The tests verify:

- Event names are non-empty and unique
- Event parameters have correct types
- Event structure follows Firebase Analytics conventions

**Why no updates needed**:

- Cookie consent affects _when_ analytics fires, not _what_ it sends
- Event structure and parameters are unchanged
- Property tests validate the contract, not the execution context

#### 2. Component Unit Tests

**Status**: ✅ **No changes needed**

**Reason**: Existing component tests (Header, Footer, Hero, ContactForm, etc.) test component behavior, not analytics implementation details. Adding analytics tracking calls doesn't change:

- Component rendering
- User interactions
- Component state management
- Accessibility features

**Why no updates needed**:

- Analytics calls are side effects, not component behavior
- Tests should verify what users see, not internal tracking
- Following testing best practices: test behavior, not implementation

### 🆕 New Tests Required

## 1. Unit Tests for Cookie Consent Hook

**File**: `tests/unit/hooks/useCookieConsent.test.ts`

**Purpose**: Test consent management logic

**Test Cases**:

```typescript
describe("useCookieConsent", () => {
  describe("Initial state", () => {
    it("should show banner on first visit (no stored consent)");
    it("should not show banner if consent already given");
    it("should load stored consent status from localStorage");
    it("should load stored preferences from localStorage");
  });

  describe("Accept all", () => {
    it("should set consent status to 'accepted'");
    it("should enable all cookie categories");
    it("should save to localStorage");
    it("should hide banner");
    it("should reload page to initialize analytics");
  });

  describe("Reject all", () => {
    it("should set consent status to 'rejected'");
    it("should disable non-essential cookies");
    it("should keep essential cookies enabled");
    it("should save to localStorage");
    it("should hide banner");
    it("should NOT reload page");
  });

  describe("Custom preferences", () => {
    it("should set consent status to 'customized'");
    it("should save custom preferences to localStorage");
    it("should always keep essential cookies enabled");
    it("should hide banner");
    it("should reload page to apply changes");
  });

  describe("Consent helpers", () => {
    it("hasAnalyticsConsent() returns true when analytics enabled");
    it("hasAnalyticsConsent() returns false when analytics disabled");
    it("hasFunctionalConsent() returns true when functional enabled");
    it("hasFunctionalConsent() returns false when functional disabled");
  });

  describe("Banner control", () => {
    it("openBanner() should show banner");
    it("closeBanner() should hide banner if consent given");
    it("closeBanner() should NOT hide banner if consent pending");
  });

  describe("localStorage errors", () => {
    it("should handle localStorage read errors gracefully");
    it("should handle localStorage write errors gracefully");
    it("should use default preferences if localStorage fails");
  });
});
```

**Key Testing Considerations**:

- Mock `localStorage` for consistent test environment
- Mock `window.location.reload()` to prevent actual reloads
- Test all consent status transitions
- Verify localStorage persistence
- Test error handling for localStorage failures

---

## 2. Unit Tests for CookieConsent Component

**File**: `tests/unit/components/CookieConsent.test.tsx`

**Purpose**: Test banner UI and user interactions

**Test Cases**:

```typescript
describe("CookieConsent", () => {
  describe("Rendering", () => {
    it("should render banner when showBanner is true");
    it("should not render when showBanner is false");
    it("should render main view by default");
    it("should render customize view when customize clicked");
  });

  describe("Main view", () => {
    it("should display title and description");
    it("should show essential cookies category");
    it("should show analytics cookies category");
    it("should have Accept All button");
    it("should have Reject Non-Essential button");
    it("should have Customize button");
    it("should have links to Privacy Policy and Cookie Policy");
  });

  describe("User interactions - Main view", () => {
    it("should call acceptAll when Accept All clicked");
    it("should call rejectAll when Reject Non-Essential clicked");
    it("should show customize view when Customize clicked");
  });

  describe("Customize view", () => {
    it("should display customize title and description");
    it("should show essential cookies (always enabled)");
    it("should show analytics cookies toggle");
    it("should show functional cookies toggle");
    it("should have back button");
    it("should have Save Preferences button");
    it("essential cookies checkbox should be disabled");
  });

  describe("User interactions - Customize view", () => {
    it("should toggle analytics preference when checkbox clicked");
    it("should toggle functional preference when checkbox clicked");
    it("should return to main view when back button clicked");
    it("should call saveCustomPreferences when Save clicked");
  });

  describe("Accessibility", () => {
    it("should have role='dialog' and aria-modal='true'");
    it("should have aria-labelledby pointing to title");
    it("should have aria-label on checkboxes");
    it("should have aria-label on back button");
    it("should be keyboard navigable");
  });

  describe("Translations", () => {
    it("should display Portuguese translations");
    it("should display English translations");
    it("should display Spanish translations");
  });

  describe("Theme compatibility", () => {
    it("should render correctly in light mode");
    it("should render correctly in dark mode");
  });
});
```

**Key Testing Considerations**:

- Mock `useCookieConsent` hook
- Mock `useTranslations` from next-intl
- Test all three languages (pt-BR, en, es)
- Verify accessibility attributes
- Test keyboard navigation
- Test theme-specific classes

---

## 3. Unit Tests for Firebase Analytics Consent Check

**File**: `tests/unit/lib/firebase.test.ts`

**Purpose**: Test that analytics respects consent

**Test Cases**:

```typescript
describe("Firebase Analytics Consent", () => {
  describe("getFirebaseAnalytics", () => {
    it("should return null when no consent given");
    it("should return null when consent rejected");
    it("should return Analytics when consent accepted");
    it("should return Analytics when customized with analytics enabled");
    it("should return null when customized with analytics disabled");
    it("should return null in SSR environment");
    it("should return null when MEASUREMENT_ID not configured");
  });

  describe("hasAnalyticsConsent helper", () => {
    it("should return false when localStorage is empty");
    it("should return false when consent is 'pending'");
    it("should return false when consent is 'rejected'");
    it("should return true when consent is 'accepted'");
    it("should return true when customized with analytics=true");
    it("should return false when customized with analytics=false");
    it("should handle localStorage errors gracefully");
    it("should handle malformed JSON in preferences");
  });
});
```

**Key Testing Considerations**:

- Mock `localStorage`
- Mock Firebase imports
- Test all consent status combinations
- Test error handling
- Verify SSR safety (typeof window checks)

---

## 4. Integration Test for AnalyticsProvider

**File**: `tests/integration/AnalyticsProvider.test.tsx`

**Purpose**: Test that analytics hooks respect consent

**Test Cases**:

```typescript
describe("AnalyticsProvider with Consent", () => {
  describe("With analytics consent", () => {
    it("should initialize scroll depth tracking");
    it("should initialize time on page tracking");
    it("should track scroll events");
    it("should track time on page");
  });

  describe("Without analytics consent", () => {
    it("should not track scroll events");
    it("should not track time on page");
    it("should not call Firebase Analytics");
  });

  describe("Consent changes", () => {
    it("should start tracking when consent is granted");
    it("should stop tracking when consent is revoked");
  });
});
```

**Key Testing Considerations**:

- Mock `useCookieConsent` with different consent states
- Mock `useScrollDepth` and `useTimeOnPage`
- Mock Firebase Analytics
- Test consent state changes
- Verify hooks are called/not called based on consent

---

## 5. E2E Tests for Cookie Consent Flow

**File**: `tests/e2e/cookie-consent.spec.ts`

**Purpose**: Test complete user consent flow in browser

**Test Cases**:

```typescript
describe("Cookie Consent Banner", () => {
  describe("First visit", () => {
    test("should show banner on first visit");
    test("should not allow closing banner without choice");
    test("should show essential and analytics categories");
  });

  describe("Accept all flow", () => {
    test("should hide banner after accepting");
    test("should persist consent across page reloads");
    test("should enable Firebase Analytics");
    test("should track analytics events");
  });

  describe("Reject non-essential flow", () => {
    test("should hide banner after rejecting");
    test("should persist rejection across page reloads");
    test("should NOT enable Firebase Analytics");
    test("should NOT track analytics events");
  });

  describe("Customize flow", () => {
    test("should show customize view when clicked");
    test("should allow toggling analytics preference");
    test("should allow toggling functional preference");
    test("should save custom preferences");
    test("should persist custom preferences across reloads");
    test("should respect analytics preference for tracking");
  });

  describe("Change preferences", () => {
    test("should reopen banner from footer link");
    test("should allow changing existing consent");
    test("should update tracking based on new consent");
  });

  describe("Multi-language support", () => {
    test("should display banner in Portuguese");
    test("should display banner in English");
    test("should display banner in Spanish");
  });

  describe("Accessibility", () => {
    test("should be keyboard navigable");
    test("should have proper ARIA labels");
    test("should trap focus in modal");
    test("should close with ESC key (if consent already given)");
  });
});
```

**Key Testing Considerations**:

- Use Playwright for real browser testing
- Test localStorage persistence
- Test actual page reloads
- Verify Firebase Analytics initialization
- Test across all three locales
- Test keyboard navigation
- Test with screen readers (manual)

---

## 6. Property Tests for Cookie Consent

**File**: `tests/properties/cookie-consent.test.ts`

**Purpose**: Property-based tests for consent logic

**Test Cases**:

```typescript
describe("Property: Cookie Consent Invariants", () => {
  it("essential cookies are always enabled regardless of choice");
  it("consent status is always one of: pending, accepted, rejected, customized");
  it("analytics preference is boolean");
  it("functional preference is boolean");
  it("localStorage keys are consistent");
  it("consent status transitions are valid");
  it("page reload only happens for accepted/customized, not rejected");
});
```

**Key Testing Considerations**:

- Use fast-check for property-based testing
- Test invariants that must always hold
- Test state transitions
- Verify data consistency

---

## Test Priority

### High Priority (Must Have)

1. ✅ **Unit: useCookieConsent hook** - Core consent logic
2. ✅ **Unit: CookieConsent component** - User interface
3. ✅ **Unit: Firebase consent check** - Analytics gating
4. ✅ **E2E: Accept/Reject flows** - Critical user paths

### Medium Priority (Should Have)

5. ✅ **Integration: AnalyticsProvider** - Consent integration
6. ✅ **E2E: Customize flow** - Advanced user control
7. ✅ **E2E: Multi-language** - Internationalization

### Low Priority (Nice to Have)

8. ⚪ **Property: Consent invariants** - Additional validation
9. ⚪ **E2E: Accessibility** - Screen reader testing (manual)

---

## Implementation Order

1. **Phase 1**: Unit tests (hooks + component) ✅ **COMPLETE**
   - ✅ `tests/unit/hooks/useCookieConsent.test.ts` (40 tests passing)
   - ✅ `tests/unit/components/CookieConsent.test.tsx` (38 tests passing)
   - ✅ `tests/unit/lib/firebase.test.ts` (33 tests passing)
   - **Coverage**: 94.96% statements, 80.39% branches, 100% functions, 98.46% lines
   - **JSDOM Limitations Documented**:
     - `window.location.reload()` not supported - documented that E2E tests will verify
     - Cannot mock `window` object - SSR tests skipped in unit tests
     - All limitations documented with comments in test files

2. **Phase 2**: Integration tests ⚪ **PENDING**
   - `tests/integration/AnalyticsProvider.test.tsx`

3. **Phase 3**: E2E tests ⚪ **PENDING**
   - `tests/e2e/cookie-consent.spec.ts`

4. **Phase 4**: Property tests (optional) ⚪ **PENDING**
   - `tests/properties/cookie-consent.test.ts`

---

## Test Coverage Goals

- **Unit Tests**: 100% coverage for consent logic
- **Integration Tests**: Cover all consent states
- **E2E Tests**: Cover all user flows
- **Overall**: Maintain 90%+ coverage requirement

---

## Testing Tools

- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Playwright
- **Property-Based**: fast-check
- **Mocking**: jest.mock() for localStorage, Firebase, next-intl

---

## Related Documentation

- [Cookie Consent Implementation](../fixes/COOKIE-CONSENT-IMPLEMENTATION.md)
- [Testing Conventions](../../.kiro/steering/testing-conventions.md)
- [Task 33.10: Privacy Implementation Testing](../../.kiro/specs/personal-resume-website/tasks.md)

---

## Next Steps

1. Create unit tests for `useCookieConsent` hook
2. Create unit tests for `CookieConsent` component
3. Create unit tests for Firebase consent check
4. Create integration tests for `AnalyticsProvider`
5. Create E2E tests for complete consent flow
6. Run tests and verify 90%+ coverage
7. Update Task 33.10 status in tasks.md
