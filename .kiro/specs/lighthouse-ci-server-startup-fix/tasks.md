# Implementation Plan

## Overview

This task list implements the fix for the Lighthouse CI server startup issue using the bug condition methodology. The workflow follows: Explore → Preserve → Implement → Validate.

---

## Tasks

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Server Startup Failure Detection
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test implementation details from Bug Condition in design:
    - Server process starts but is not accessible at http://localhost:3000 within timeout
    - Readiness check exits successfully even when server is not accessible
    - Lighthouse tests fail with "Server not accessible" error
  - The test assertions should match the Expected Behavior Properties from design:
    - Server SHALL start successfully and become accessible at http://localhost:3000
    - Server SHALL respond to HTTP requests with successful status codes (200-299)
    - Readiness check SHALL accurately detect server accessibility
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Server-Startup Steps Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (successful CI runs)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Artifact download from "build" job works correctly
    - Dependency installation with `npm ci --legacy-peer-deps` succeeds
    - Lighthouse test execution against accessible server validates all metrics
    - Artifact upload for Lighthouse results works correctly
    - Server cleanup with PID file terminates process cleanly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for Lighthouse CI server startup and readiness detection
  - [x] 3.1 Implement enhanced logging and process validation
    - Redirect server output to log file: `npm run serve > server.log 2>&1 &`
    - Add immediate process validation (2s wait + PID check)
    - Verify background process is still running after startup
    - _Bug_Condition: isBugCondition(input) where serverProcessStarted == false OR serverNotAccessible(timeout=70) OR readinessCheckFalsePositive_
    - _Expected_Behavior: Server SHALL start successfully and become accessible with accurate readiness detection_
    - _Preservation: Artifact download, dependency installation, test execution, cleanup unchanged_
    - _Requirements: 1.1, 1.2, 2.1, 2.3_

  - [x] 3.2 Implement robust readiness checking
    - Replace curl timeout loop with explicit failure handling
    - Add bash script with counter that exits 1 if max attempts reached
    - Add health check with HTTP status code verification (200-299)
    - Use `curl -f -s -o /dev/null -w "%{http_code}"` for status checking
    - Increase initial wait from 10s to 15s
    - _Bug_Condition: Readiness check exits successfully when server not accessible_
    - _Expected_Behavior: Readiness check SHALL accurately detect server accessibility and fail job on timeout_
    - _Preservation: Test execution and cleanup steps unchanged_
    - _Requirements: 1.2, 1.3, 2.2, 2.3_

  - [x] 3.3 Implement error messaging and diagnostics
    - Add server log display on failure: `if: failure()` step that cats server.log
    - Add descriptive error messages at each failure point
    - Document expected behavior in workflow comments
    - _Bug_Condition: Silent failures with no diagnostic information_
    - _Expected_Behavior: Clear error messages and server logs available for debugging_
    - _Preservation: Artifact upload and cleanup unchanged_
    - _Requirements: 1.4, 2.2_

  - [x] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Server Startup Success
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify server starts successfully and becomes accessible
    - Verify readiness check accurately detects server state
    - Verify Lighthouse tests can connect to server
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - No Regressions
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm artifact download still works
    - Confirm dependency installation still works
    - Confirm test execution still works when server is accessible
    - Confirm artifact upload still works
    - Confirm server cleanup still works
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Manual CI testing
  - Run baseline test with known-good build artifacts
  - Run failure injection test (delete out/, occupy port 3000)
  - Run timing test to validate timeout values across multiple CI runs
  - Run log verification test to ensure server logs are captured on failures
  - Verify all 7 design changes are working correctly:
    1. Server output redirected to server.log
    2. Immediate process validation (2s check)
    3. Curl timeout loop replaced with explicit failure handling
    4. Health check with HTTP status code verification (200-299)
    5. Server.log displayed on failure
    6. Initial wait increased from 10s to 15s
    7. Descriptive error messages at each failure point
  - _Requirements: All requirements (1.1-3.5)_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise
  - Verify CI job completes successfully on main branch
  - Verify no regressions in other CI jobs
  - Document any edge cases or limitations discovered during testing

---

## Success Criteria

The fix is considered successful when:

- ✅ Server startup failures are detected within 20 seconds (15s wait + 5s validation)
- ✅ Readiness check failures cause immediate job failure with clear error message
- ✅ Server logs are available in CI output when startup fails
- ✅ Successful server startups proceed to Lighthouse tests without changes
- ✅ All preservation requirements are met (no regressions in other CI steps)
- ✅ CI job completes successfully on main branch with no code changes

---

## Notes

- This workflow uses the bug condition methodology: C(X) identifies buggy inputs, P(result) defines expected behavior, ¬C(X) identifies behavior to preserve
- Exploration test (task 1) should FAIL on unfixed code - this confirms the bug exists
- Preservation tests (task 2) should PASS on unfixed code - this confirms baseline behavior
- After implementation, exploration test should PASS and preservation tests should still PASS
- Manual CI testing is critical since this is a CI-specific issue
