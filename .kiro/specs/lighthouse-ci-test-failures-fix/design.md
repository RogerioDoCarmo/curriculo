# Lighthouse CI Test Failures Fix Design

## Overview

The Lighthouse CI tests are failing due to two critical issues: (1) property-based tests detecting false positives where the server appears accessible when it shouldn't be, indicating port conflicts or improper server cleanup between CI jobs, and (2) performance tests failing because CI environment performance is slower than the configured thresholds. The fix approach involves implementing proper port conflict resolution, CI-appropriate performance thresholds, robust server cleanup mechanisms, and improved test isolation to ensure reliable CI execution.

## Glossary

- **Bug_Condition (C)**: The condition that triggers CI test failures - when port conflicts occur, performance thresholds are too strict for CI, or server cleanup is incomplete
- **Property (P)**: The desired behavior when tests run in CI - proper port management, appropriate thresholds, and clean test isolation
- **Preservation**: Existing local development test behavior and CI workflow structure that must remain unchanged by the fix
- **handleKeyPress**: The function in `tests/properties/lighthouse-ci-server-startup.test.ts` that simulates server startup and readiness checks
- **serverAccessible**: The boolean state that determines whether the server responds to HTTP requests at localhost:3000
- **readinessCheckPassed**: The boolean result of the CI readiness check that should accurately reflect server accessibility
- **Port Conflict**: When multiple processes attempt to bind to port 3000 simultaneously in CI environment
- **False Positive**: When property-based tests report server as accessible when no server should be running

## Bug Details

### Bug Condition

The bug manifests when Lighthouse CI tests run in the GitHub Actions environment. The system experiences port conflicts from previous CI jobs, performance thresholds that are too strict for the CI environment, and incomplete server cleanup that leads to false positive test results.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type CITestExecution
  OUTPUT: boolean

  RETURN (input.environment == "CI" OR input.environment == "GITHUB_ACTIONS")
         AND (portConflictExists(3000) OR performanceThresholdsTooStrict(input.metrics) OR serverCleanupIncomplete(input.previousJobs))
         AND (falsePositiveDetected(input.propertyTests) OR performanceTestsFailing(input.lighthouseResults))
END FUNCTION
```

### Examples

- **Port Conflict Example**: CI job starts and logs "WARNING: A server is already running on port 3000" because previous job didn't clean up properly
- **False Positive Example**: Property test "Property 2: Readiness check SHALL fail when server is not accessible" reports `serverAccessible=true` and `readinessCheckPassed=true` when no server should be running
- **Performance Threshold Example**: Lighthouse test fails with FCP of 2.97s (expected < 1.5s) and TTI of 4.71s (expected < 4s) in CI environment
- **Cleanup Failure Example**: Multiple CI jobs run sequentially and each fails due to port conflicts from incomplete cleanup of previous jobs

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Local development Lighthouse tests must continue to use stricter performance thresholds (FCP < 1.5s, TTI < 4s, Score >= 70)
- Property-based test "Property 1: Server SHALL start successfully and become accessible" must continue to verify proper server startup
- CI workflow artifact upload and server logging must continue to work exactly as before
- Server cleanup using PID files and process termination must continue to work in the "Stop server" step
- Other CI jobs (lint, test, build, e2e) must continue to work without interference from lighthouse job fixes

**Scope:**
All inputs that do NOT involve CI environment Lighthouse test execution should be completely unaffected by this fix. This includes:

- Local development test execution with `npm run test:lighthouse`
- Manual server startup and testing with `npm run serve`
- Other CI workflow jobs that don't use port 3000

## Hypothesized Root Cause

Based on the bug description and CI logs, the most likely issues are:

1. **Port Conflict Resolution**: The CI environment doesn't properly check for and resolve port conflicts before starting the test server
   - Previous CI jobs may leave processes running on port 3000
   - Concurrent CI jobs may attempt to use the same port
   - The current startup process doesn't kill existing processes before binding

2. **Inappropriate Performance Thresholds**: The performance thresholds are optimized for local development machines, not CI environments
   - CI environments have shared resources and variable performance
   - Current thresholds: FCP < 1.5s, TTI < 4s are too strict for CI
   - Need separate CI-specific thresholds: FCP < 3.5s, TTI < 6s

3. **Incomplete Server Cleanup**: The server cleanup process doesn't ensure complete process termination
   - PID files may be stale or incorrect
   - Processes may not respond to SIGTERM signals
   - Background processes may persist after job completion

4. **Test Isolation Issues**: Property-based tests don't properly isolate test environments
   - Tests may detect servers from other processes or jobs
   - Readiness checks may succeed against unrelated servers
   - Test setup doesn't ensure clean starting state

## Correctness Properties

Property 1: Bug Condition - CI Environment Port Management

_For any_ CI test execution where port conflicts exist or performance thresholds are inappropriate for the environment, the fixed CI workflow SHALL resolve port conflicts before server startup, use CI-appropriate performance thresholds, and ensure complete server cleanup between jobs.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Local Development Behavior

_For any_ test execution that is NOT in the CI environment (local development, manual testing), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality for local development workflows.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `.github/workflows/ci.yml`

**Job**: `lighthouse`

**Specific Changes**:

1. **Port Conflict Resolution**: Add pre-startup port cleanup step
   - Kill any existing processes on port 3000 before server startup
   - Use `lsof -ti:3000 | xargs kill -9` or similar robust cleanup
   - Verify port is available before proceeding

2. **CI Environment Detection**: Add environment-aware configuration
   - Set `CI=true` and `GITHUB_ACTIONS=true` environment variables
   - Pass environment context to test execution
   - Enable CI-specific behavior in test files

3. **Enhanced Server Startup**: Improve server startup reliability
   - Add retry logic for server startup failures
   - Implement more robust readiness checking with exponential backoff
   - Add detailed logging for startup failures

4. **Improved Cleanup Process**: Ensure complete server termination
   - Use `kill -9` (SIGKILL) as fallback after `kill` (SIGTERM) fails
   - Clean up PID files and log files after termination
   - Verify process termination before job completion

**File**: `tests/lighthouse/performance.test.ts`

**Function**: Performance threshold logic

**Specific Changes**:

1. **CI-Appropriate Thresholds**: Update performance thresholds for CI
   - FCP threshold: 1.5s (local) → 3.5s (CI)
   - TTI threshold: 4s (local) → 6s (CI)
   - Performance Score: 70 (local) → 63 (CI)

2. **Environment Detection**: Enhance CI environment detection
   - Check both `process.env.CI` and `process.env.GITHUB_ACTIONS`
   - Add logging to show which thresholds are being used
   - Ensure consistent environment detection across all tests

**File**: `tests/properties/lighthouse-ci-server-startup.test.ts`

**Function**: `simulateCurrentReadinessCheck` and server startup helpers

**Specific Changes**:

1. **Test Isolation**: Improve test environment isolation
   - Add pre-test port availability check
   - Implement proper test cleanup in beforeEach/afterEach
   - Use unique ports or process isolation for concurrent tests

2. **Readiness Check Accuracy**: Fix false positive detection
   - Implement more robust server accessibility checking
   - Add timeout handling that properly fails when server is not accessible
   - Ensure readiness check result accurately reflects server state

3. **Server Process Management**: Improve server lifecycle management
   - Use more reliable process spawning and monitoring
   - Implement proper signal handling for clean shutdown
   - Add process state validation throughout test execution

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate CI environment conditions including port conflicts, performance threshold failures, and cleanup issues. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:

1. **Port Conflict Test**: Simulate starting server when port 3000 is already in use (will fail on unfixed code)
2. **Performance Threshold Test**: Run Lighthouse tests in simulated CI environment with current thresholds (will fail on unfixed code)
3. **Cleanup Failure Test**: Simulate incomplete server cleanup and subsequent job startup (will fail on unfixed code)
4. **False Positive Test**: Run property tests when external server is running on port 3000 (may fail on unfixed code)

**Expected Counterexamples**:

- Server startup fails with "port already in use" errors
- Performance tests fail with metrics exceeding local development thresholds
- Property tests report false positives when detecting server accessibility
- Possible causes: inadequate port management, inappropriate thresholds, incomplete cleanup

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**

```
FOR ALL input WHERE isBugCondition(input) DO
  result := lighthouseCIWorkflow_fixed(input)
  ASSERT expectedBehavior(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**

```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT lighthouseCIWorkflow_original(input) = lighthouseCIWorkflow_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for local development and non-CI scenarios, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Local Development Preservation**: Verify local `npm run test:lighthouse` continues to work with strict thresholds
2. **Manual Server Preservation**: Verify `npm run serve` and manual testing continues to work
3. **CI Workflow Preservation**: Verify other CI jobs continue to work without interference
4. **Artifact Upload Preservation**: Verify lighthouse results upload continues to work

### Unit Tests

- Test port conflict detection and resolution logic
- Test environment-specific threshold selection
- Test server cleanup process with various process states
- Test readiness check accuracy with different server states

### Property-Based Tests

- Generate random CI environment configurations and verify port management works correctly
- Generate random performance metrics and verify appropriate thresholds are applied
- Test that all local development scenarios continue to work across many configurations
- Test server cleanup across various process lifecycle states

### Integration Tests

- Test full CI workflow with port conflicts and verify resolution
- Test performance threshold behavior across local and CI environments
- Test that server cleanup works correctly in CI job sequences
- Test that property-based tests accurately detect server accessibility states
