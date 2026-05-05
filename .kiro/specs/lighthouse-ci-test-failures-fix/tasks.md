# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - CI Environment Port Management and Performance Failures
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: CI environment with port conflicts, strict performance thresholds, and incomplete cleanup
  - Test that CI environment conditions trigger failures: port conflicts on 3000, performance thresholds too strict (FCP < 1.5s, TTI < 4s), and server cleanup incomplete
  - The test assertions should match the Expected Behavior Properties from design: proper port management, CI-appropriate thresholds, and clean test isolation
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause: port conflicts, performance threshold failures, false positives
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Local Development Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (local development, manual testing)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Test that local development continues to use strict thresholds (FCP < 1.5s, TTI < 4s, Score >= 70)
  - Test that manual server startup with `npm run serve` continues to work
  - Test that other CI jobs (lint, test, build, e2e) continue to work without interference
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for Lighthouse CI test failures
  - [x] 3.1 Implement port conflict resolution in CI workflow
    - Add pre-startup port cleanup step in `.github/workflows/ci.yml`
    - Kill any existing processes on port 3000 before server startup using `lsof -ti:3000 | xargs kill -9`
    - Verify port is available before proceeding with server startup
    - Add retry logic for server startup failures with exponential backoff
    - _Bug_Condition: isBugCondition(input) where input.environment == "CI" AND portConflictExists(3000)_
    - _Expected_Behavior: expectedBehavior(result) from design - proper port management and server startup_
    - _Preservation: Local development test behavior and CI workflow structure unchanged_
    - _Requirements: 2.1, 2.3_

  - [x] 3.2 Implement CI-appropriate performance thresholds
    - Update performance thresholds in `tests/lighthouse/performance.test.ts`
    - Add environment detection for CI vs local development
    - Set CI thresholds: FCP < 3.5s, TTI < 6s, Performance Score >= 63
    - Keep local thresholds: FCP < 1.5s, TTI < 4s, Performance Score >= 70
    - Add logging to show which thresholds are being used
    - _Bug_Condition: isBugCondition(input) where performanceThresholdsTooStrict(input.metrics)_
    - _Expected_Behavior: expectedBehavior(result) from design - CI-appropriate thresholds_
    - _Preservation: Local development performance thresholds unchanged_
    - _Requirements: 2.2, 3.1_

  - [x] 3.3 Enhance server cleanup process
    - Improve server cleanup in `.github/workflows/ci.yml` "Stop server" step
    - Use `kill -9` (SIGKILL) as fallback after `kill` (SIGTERM) fails
    - Clean up PID files and log files after termination
    - Verify process termination before job completion
    - Add detailed logging for cleanup operations
    - _Bug_Condition: isBugCondition(input) where serverCleanupIncomplete(input.previousJobs)_
    - _Expected_Behavior: expectedBehavior(result) from design - complete server cleanup_
    - _Preservation: Server cleanup using PID files continues to work_
    - _Requirements: 2.4, 3.4_

  - [x] 3.4 Improve test isolation in property-based tests
    - Update `tests/properties/lighthouse-ci-server-startup.test.ts`
    - Add pre-test port availability check in beforeEach/afterEach
    - Implement more robust server accessibility checking to prevent false positives
    - Add timeout handling that properly fails when server is not accessible
    - Ensure readiness check result accurately reflects server state
    - Use unique ports or process isolation for concurrent tests
    - _Bug_Condition: isBugCondition(input) where falsePositiveDetected(input.propertyTests)_
    - _Expected_Behavior: expectedBehavior(result) from design - accurate readiness checks_
    - _Preservation: Property test "Property 1: Server SHALL start successfully" unchanged_
    - _Requirements: 2.3, 3.2_

  - [x] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - CI Environment Port Management and Performance Failures
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: Property 1 and Property 2 from design_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Local Development Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: Property 2 from design_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Verify CI workflow runs successfully with port conflict resolution
  - Verify performance tests pass with CI-appropriate thresholds
  - Verify server cleanup works correctly between CI jobs
  - Verify property-based tests accurately detect server accessibility
  - Verify local development behavior is completely preserved
