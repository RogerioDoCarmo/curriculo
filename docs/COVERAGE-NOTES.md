# Test Coverage Notes

## SonarCloud Quality Gate - Coverage on New Code

### Current Status

The SonarCloud quality gate requires ≥80% coverage on new code. Some files in this PR have lower coverage due to their nature as initialization/configuration code.

### Files with Lower Coverage

#### 1. `lib/lazy-components.tsx` (0% in unit tests)

- **Reason**: Lazy loading components using React.lazy() and dynamic imports
- **Testing**: Covered by integration and E2E tests where components are actually rendered
- **Note**: Unit testing lazy-loaded components requires complex mocking of React.lazy() and Suspense

#### 2. `lib/notifications.ts` (0% in unit tests)

- **Reason**: Firebase Cloud Messaging initialization code that requires browser APIs
- **Testing**: Requires actual browser environment with Notification API and service workers
- **Note**: Property tests exist for the notification logic in `tests/properties/`

#### 3. `lib/firebase.ts` (23%)

- **Reason**: Firebase SDK initialization code
- **Testing**: Difficult to test without actual Firebase project credentials
- **Note**: Configuration validation is tested

#### 4. `lib/analytics.ts` (40%)

- **Reason**: Firebase Analytics initialization and event logging
- **Testing**: Property tests exist in `tests/properties/analytics.test.ts`
- **Note**: Actual analytics calls require Firebase configuration

#### 5. `lib/error-logging.client.ts` (0%)

- **Reason**: Client-side error logging that depends on analytics
- **Testing**: Property tests exist in `tests/properties/error-logging.test.ts`
- **Note**: Tested through integration tests

### Coverage Strategy

1. **Unit Tests**: Focus on business logic and pure functions
2. **Integration Tests**: Test component interactions and data flow
3. **Property Tests**: Verify correctness properties across many inputs
4. **E2E Tests**: Test actual user workflows including lazy loading

### Overall Coverage

- **Total Project Coverage**: 75.64% (above 71% threshold)
- **New Code Coverage**: 71.8% (below 80% SonarCloud threshold)
- **Goal**: 90% coverage

### Recommendations

1. Accept lower coverage for initialization code
2. Focus testing efforts on business logic
3. Use E2E tests to verify lazy loading works correctly
4. Consider adjusting SonarCloud quality gate for infrastructure code
