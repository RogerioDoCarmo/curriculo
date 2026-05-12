# Implementation Plan: Firebase Crashlytics Integration

## Overview

This implementation plan follows Test-Driven Development (TDD) methodology to integrate Firebase Crashlytics into the personal resume website. The integration adds comprehensive crash reporting alongside the existing Sentry integration, with full respect for user consent preferences. All tests are written BEFORE implementation to ensure correctness and maintainability.

## Tasks

- [ ] 1. Set up testing infrastructure and install dependencies
  - Install Firebase SDK (v12.12.1+) with Crashlytics support
  - Install fast-check library for property-based testing
  - Configure Jest for TypeScript testing with Firebase mocks
  - Set up test utilities for mocking Crashlytics SDK
  - _Requirements: 1.1, 9.5_

- [ ] 2. Implement Firebase Crashlytics initialization (TDD)
  - [ ] 2.1 Write unit tests for getCrashlytics() function
    - Test SSR environment detection (returns null)
    - Test consent checking (returns null without consent)
    - Test successful initialization with consent
    - Test singleton pattern (same instance on multiple calls)
    - Test graceful error handling on initialization failure
    - _Requirements: 1.2, 1.4, 1.5, 2.1, 2.2, 2.4, 8.4, 8.5, 9.1_
  - [ ] 2.2 Implement getCrashlytics() in lib/firebase.ts
    - Add SSR detection check
    - Add consent verification using hasAnalyticsConsent()
    - Implement singleton pattern with module-level variable
    - Add dynamic import for firebase/crashlytics
    - Add error handling with console warnings
    - Return null on any failure
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.4, 8.4_

- [ ] 3. Implement Crashlytics utility functions (TDD)
  - [ ] 3.1 Write unit tests for logBreadcrumb()
    - Test successful breadcrumb logging
    - Test graceful handling when Crashlytics unavailable
    - Test error handling without throwing
    - _Requirements: 5.1, 5.3, 9.2_
  - [ ] 3.2 Write unit tests for setCustomKey()
    - Test setting string values
    - Test setting number values
    - Test setting boolean values
    - Test graceful handling when Crashlytics unavailable
    - _Requirements: 5.2, 5.4, 9.2_
  - [ ] 3.3 Write unit tests for setUserId()
    - Test setting user identifier
    - Test graceful handling when Crashlytics unavailable
    - _Requirements: 5.5, 9.2_
  - [ ] 3.4 Write unit tests for recordError()
    - Test error recording with context
    - Test setting custom keys from context object
    - Test graceful handling when Crashlytics unavailable
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 9.2_
  - [ ] 3.5 Create lib/crashlytics.ts module
    - Implement logBreadcrumb() with dynamic imports
    - Implement setCustomKey() with dynamic imports
    - Implement setUserId() with dynamic imports
    - Implement recordError() with context handling
    - Add JSDoc comments for all functions
    - Follow no-op pattern when Crashlytics unavailable
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 10.2_

- [ ] 4. Implement metadata sanitization (TDD)
  - [ ]\* 4.1 Write property-based tests for metadata sanitization
    - **Property 3: Metadata Sanitization**
    - **Validates: Requirements 11.5**
    - Test that sensitive patterns are redacted
    - Test that safe fields are preserved
    - Use fast-check to generate random metadata objects
    - Run 100+ iterations per property
    - _Requirements: 11.5, 9.3_
  - [ ] 4.2 Implement sanitizeMetadata() function
    - Define sensitive pattern regex list
    - Implement isSensitiveKey() helper
    - Implement sanitization logic with [REDACTED] replacement
    - Add to lib/analytics.ts
    - _Requirements: 11.5_

- [ ] 5. Implement error deduplication logic (TDD)
  - [ ]\* 5.1 Write property-based tests for error deduplication
    - **Property 1: Error Deduplication Timing Window**
    - **Validates: Requirements 4.5, 13.2**
    - Test deduplication within 5-second window
    - Use fast-check to generate random timing sequences
    - **Property 2: Error Deduplication Matching**
    - **Validates: Requirements 13.3**
    - Test matching by message and stack trace
    - Use fast-check to generate random error messages
    - **Property 4: Deduplication Cache Expiration**
    - **Validates: Requirements 13.4**
    - Test cache expiration after 5 seconds
    - Use fast-check to generate random delays
    - Run 100+ iterations per property
    - _Requirements: 4.5, 13.1, 13.2, 13.3, 13.4, 9.3_
  - [ ] 5.2 Implement error deduplication in lib/analytics.ts
    - Create ErrorCacheEntry interface
    - Implement getErrorCacheKey() function
    - Implement isDuplicateError() function
    - Implement cacheError() function with setTimeout cleanup
    - Add module-level errorCache Map
    - Define DEDUP_WINDOW_MS constant (5000ms)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [ ] 6. Implement unified error logging (TDD)
  - [ ] 6.1 Write unit tests for logError() function
    - Test logging to both Sentry and Crashlytics
    - Test automatic context capture (URL, locale, theme)
    - Test graceful Sentry failure handling
    - Test graceful Crashlytics failure handling
    - Test stack trace inclusion
    - Test deduplication integration
    - Test force flag bypassing deduplication
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.4, 11.1, 11.2, 11.3, 11.4, 13.5, 9.2_
  - [ ] 6.2 Implement ErrorContext interface in lib/analytics.ts
    - Define severity levels (fatal, error, warning, info)
    - Define metadata field for custom key-value pairs
    - Define force flag for bypassing deduplication
    - Define component and action fields
    - Add JSDoc comments
    - _Requirements: 3.5, 10.2_
  - [ ] 6.3 Implement logError() function in lib/analytics.ts
    - Add deduplication check with force flag support
    - Implement automatic context capture (URL, locale, theme, viewport)
    - Add metadata sanitization call
    - Implement Sentry logging with error handling
    - Implement Crashlytics logging with error handling
    - Add breadcrumb logging for error message
    - Update deduplication cache
    - Add JSDoc comments
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 11.1, 11.2, 11.3, 11.4, 11.5, 13.1, 13.5, 10.2_

- [ ] 7. Checkpoint - Ensure all core tests pass
  - Run unit tests: `yarn test:unit`
  - Run property-based tests: `yarn test:properties`
  - Verify 90%+ code coverage for lib/firebase.ts, lib/crashlytics.ts, lib/analytics.ts
  - Ask the user if questions arise

- [ ] 8. Implement Error Boundary component (TDD)
  - [ ] 8.1 Write unit tests for ErrorBoundary component
    - Test error catching and state update
    - Test error logging to both services
    - Test fallback UI rendering
    - Test component stack trace inclusion
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 9.2_
  - [ ] 8.2 Create ErrorBoundary component
    - Create components/ErrorBoundary.tsx
    - Implement getDerivedStateFromError()
    - Implement componentDidCatch() with logError() call
    - Add fallback UI with role="alert"
    - Include component stack in metadata
    - Add JSDoc comments
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 10.1_

- [ ] 9. Implement global error handlers (TDD)
  - [ ]\* 9.1 Write integration tests for global error handlers
    - Test uncaught error handling
    - Test unhandled promise rejection handling
    - Test error logging to both services
    - Test event listener cleanup
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 9.3_
  - [ ] 9.2 Create GlobalErrorHandlers component
    - Create components/GlobalErrorHandlers.tsx
    - Implement window error event listener
    - Implement unhandledrejection event listener
    - Add event.preventDefault() calls
    - Add cleanup in useEffect return
    - Log errors with appropriate severity and metadata
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [ ] 10. Integrate error handling into application
  - [ ] 10.1 Update root layout with error boundaries
    - Wrap app/layout.tsx with ErrorBoundary
    - Add GlobalErrorHandlers component
    - Ensure proper component hierarchy
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ] 10.2 Add error boundaries to critical pages
    - Wrap app/[locale]/page.tsx with ErrorBoundary
    - Add custom fallback UI for home page
    - Consider adding boundaries to other critical routes
    - _Requirements: 4.1, 4.2_

- [ ] 11. Configure source maps for production
  - [ ] 11.1 Update next.config.js for source map generation
    - Enable productionBrowserSourceMaps
    - Configure webpack devtool as "hidden-source-map"
    - Set sourceMapFilename pattern
    - Add comments explaining configuration
    - _Requirements: 6.1, 6.2, 6.5_
  - [ ] 11.2 Document source map upload process
    - Create documentation for manual upload using Firebase CLI
    - Document firebase crashlytics:symbols:upload command
    - Add instructions for obtaining FIREBASE_TOKEN
    - Document required environment variables
    - _Requirements: 6.3, 10.3, 10.4, 14.1_

- [ ] 12. Integrate with CI/CD pipeline
  - [ ] 12.1 Update .github/workflows/ci.yml
    - Add Firebase configuration validation step
    - Add step to run unit tests
    - Add step to run integration tests
    - Add step to run property-based tests
    - Add test coverage check
    - Handle missing Firebase config gracefully in tests
    - _Requirements: 7.1, 7.2, 7.4, 7.5_
  - [ ] 12.2 Update .github/workflows/deploy.yml
    - Add source map upload step for production deployments
    - Use FIREBASE_TOKEN secret
    - Only run on main branch
    - Add error handling for upload failures
    - _Requirements: 6.3, 7.1, 7.3_
  - [ ] 12.3 Add required secrets to GitHub repository
    - Add FIREBASE_TOKEN secret
    - Add FIREBASE_APP_ID secret
    - Verify all NEXT*PUBLIC_FIREBASE*\* secrets exist
    - _Requirements: 7.2, 10.4_

- [ ] 13. Add environment configuration
  - [ ] 13.1 Update .env.example with Crashlytics variables
    - Document all required Firebase environment variables
    - Add comments explaining each variable
    - Add CI/CD-only variables section
    - _Requirements: 8.3, 10.4_
  - [ ] 13.2 Implement environment-specific behavior
    - Add debug logging in development mode
    - Add performance monitoring for initialization
    - Add warning for slow initialization (>1000ms)
    - Ensure production mode uses optimized settings
    - _Requirements: 8.1, 8.2, 12.2, 12.3_

- [ ] 14. Checkpoint - Ensure integration tests pass
  - Run full test suite: `yarn test`
  - Verify CI/CD pipeline passes
  - Test locally with development environment
  - Ask the user if questions arise

- [ ] 15. Add usage examples and documentation
  - [ ] 15.1 Create developer guide documentation
    - Document setup instructions
    - Add usage examples for logError()
    - Add usage examples for breadcrumbs
    - Add usage examples for custom keys
    - Add troubleshooting section
    - _Requirements: 10.1, 10.3, 10.5_
  - [ ] 15.2 Add inline code comments
    - Review all new functions for JSDoc comments
    - Add implementation comments for complex logic
    - Document error handling patterns
    - Document performance considerations
    - _Requirements: 10.1, 10.2_
  - [ ] 15.3 Document Firebase console configuration
    - Document how to enable Crashlytics in Firebase Console
    - Document alert configuration steps
    - Document crash-free user percentage tracking
    - Document data retention settings
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]\* 16. Write integration tests for complete error flow
  - Test end-to-end error logging from component to Firebase
  - Test consent management integration
  - Test error boundary integration
  - Test global error handler integration
  - Mock Firebase SDK to avoid actual crash reports
  - _Requirements: 9.3, 9.4_

- [ ]\* 17. Perform manual testing and validation
  - Test Crashlytics initialization in browser
  - Trigger test errors and verify Firebase Console reports
  - Verify source maps are symbolicated correctly
  - Test consent flow (accept/reject/change)
  - Verify no errors logged without consent
  - Test performance impact (bundle size, initialization time)
  - _Requirements: 6.4, 8.1, 8.2, 12.1, 12.4_

- [ ] 18. Final checkpoint - Production readiness verification
  - Verify all tests pass (unit, integration, property-based)
  - Verify test coverage meets 90%+ goal
  - Verify CI/CD pipeline is green
  - Verify documentation is complete
  - Verify source maps are configured correctly
  - Verify environment variables are documented
  - Ask the user if questions arise

## Notes

- **TDD Approach**: All tests are written BEFORE implementation to ensure correctness
- **Tasks marked with `*` are optional** and can be skipped for faster MVP delivery
- **Property-based tests** validate universal correctness properties using fast-check
- **Unit tests** validate specific examples and edge cases using Jest
- **Integration tests** validate interaction between components and services
- **Manual tests** validate Firebase Console configuration and production behavior
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for feedback
- Error handling is graceful throughout - failures never crash the application
- Sentry integration is preserved - both systems work independently
- User consent is respected at all times - no data collected without permission

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "3.2", "3.3", "3.4", "4.1", "5.1"] },
    { "id": 2, "tasks": ["2.2", "3.5", "4.2", "5.2"] },
    { "id": 3, "tasks": ["6.1"] },
    { "id": 4, "tasks": ["6.2", "6.3"] },
    { "id": 5, "tasks": ["8.1", "9.1"] },
    { "id": 6, "tasks": ["8.2", "9.2"] },
    { "id": 7, "tasks": ["10.1", "10.2", "11.1", "11.2", "13.1", "13.2"] },
    { "id": 8, "tasks": ["12.1", "12.2", "12.3"] },
    { "id": 9, "tasks": ["15.1", "15.2", "15.3", "16"] },
    { "id": 10, "tasks": ["17"] }
  ]
}
```
