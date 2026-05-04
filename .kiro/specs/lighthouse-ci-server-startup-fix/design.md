# Lighthouse CI Server Startup Fix Design

## Overview

The Lighthouse CI job fails because the Next.js production server (`npm run serve`) is not accessible at `http://localhost:3000` when tests run. The current approach uses background process execution (`npm run serve &`), a fixed 10-second sleep, and a curl timeout loop that doesn't properly detect startup failures. This design addresses the root causes through improved server startup detection, robust error handling, and comprehensive logging to ensure the server is truly ready before tests execute.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when the server process starts but is not accessible at `http://localhost:3000` within the timeout period
- **Property (P)**: The desired behavior - server must be accessible and responding to HTTP requests before Lighthouse tests execute
- **Preservation**: Existing CI job behaviors (artifact download, dependency installation, test execution, cleanup) that must remain unchanged
- **`npm run serve`**: The command that starts the Next.js production server using `npx serve@latest out -l 3000`
- **Server Readiness**: The state where the server is listening on port 3000 AND responding to HTTP requests with successful status codes
- **Background Process**: A shell process started with `&` that runs asynchronously without blocking the CI workflow
- **PID File**: A file (`server.pid`) storing the process ID for later cleanup

## Bug Details

### Bug Condition

The bug manifests when the Lighthouse CI job starts the server with `npm run serve &` but the server is either not starting successfully, taking longer than expected to become ready, or the readiness check is not accurately detecting server availability. The current implementation uses a fixed 10-second sleep followed by a curl timeout loop that exits successfully even when the server is not accessible.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type ServerStartupAttempt
  OUTPUT: boolean

  RETURN input.command == "npm run serve &"
         AND (serverProcessStarted(input) == false
              OR serverNotAccessible("http://localhost:3000", timeout=70)
              OR readinessCheckFalsePositive(input))
         AND lighthouseTestsExecute(input) == true
END FUNCTION
```

### Examples

- **Example 1**: Server process starts but binds to wrong port → curl readiness check times out after 60s but doesn't fail the job → Lighthouse tests run and fail with "Server not accessible"
- **Example 2**: Server process fails to start due to missing dependencies → sleep 10 completes → curl loop exits successfully without detecting failure → Lighthouse tests fail
- **Example 3**: Server starts slowly (>10s) → curl loop begins checking → server becomes ready at 15s → curl succeeds but tests may have timing issues
- **Edge Case**: Port 3000 already in use → server fails to bind → no error logged → readiness check doesn't detect the failure → tests fail with unclear error

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Artifact download from the "build" job must continue to work exactly as before
- Dependency installation with `npm ci --legacy-peer-deps` must continue to work
- Lighthouse test execution against an accessible server must continue to validate FCP, TTI, Performance Score, and detailed metrics
- Artifact upload for Lighthouse results must continue to work
- Server cleanup with PID file must continue to work

**Scope:**
All CI job steps that do NOT involve server startup and readiness checking should be completely unaffected by this fix. This includes:

- Checkout, Node.js setup, dependency installation
- Build artifact download
- Lighthouse test execution (when server is ready)
- Result artifact upload
- Server cleanup and job teardown

## Hypothesized Root Cause

Based on the bug description and CI workflow analysis, the most likely issues are:

1. **Inadequate Readiness Detection**: The curl timeout loop uses `-f` flag but doesn't properly fail the CI step when the server never becomes accessible. The loop may exit with success even when curl never succeeds.

2. **Silent Server Startup Failures**: The server is started in the background with `&` but there's no mechanism to detect if the process fails immediately (e.g., port already in use, missing dependencies, configuration errors).

3. **Insufficient Logging**: The current implementation doesn't capture server stdout/stderr, making it impossible to diagnose why the server isn't starting in CI environments.

4. **Race Conditions**: The fixed 10-second sleep may be insufficient in CI environments with variable resource availability, but the subsequent curl loop doesn't compensate properly.

5. **False Positive Readiness Check**: The "Verify server is running" step uses `curl -I` but doesn't properly fail the job when it returns non-zero exit codes, allowing the workflow to continue to Lighthouse tests.

## Correctness Properties

Property 1: Bug Condition - Server Startup and Accessibility

_For any_ CI job execution where `npm run serve` is started in the background, the fixed workflow SHALL ensure the server process starts successfully, becomes accessible at `http://localhost:3000`, and responds to HTTP requests with successful status codes (200-299) before Lighthouse tests execute.

**Validates: Requirements 2.1, 2.3, 2.4**

Property 2: Preservation - Non-Server-Startup Steps

_For any_ CI job step that does NOT involve server startup or readiness checking (artifact download, dependency installation, test execution, cleanup), the fixed workflow SHALL produce exactly the same behavior as the original workflow, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `.github/workflows/ci.yml`

**Job**: `lighthouse`

**Specific Changes**:

1. **Improve Server Startup Logging**: Redirect server stdout/stderr to a log file for debugging
   - Change: `npm run serve > server.log 2>&1 &`
   - Rationale: Captures all server output for post-mortem analysis when startup fails

2. **Add Immediate Process Validation**: Check if the background process is still running after a brief delay
   - Add step after server start: Wait 2 seconds, then verify PID exists and process is running
   - Rationale: Catches immediate failures (port conflicts, missing files) before waiting full timeout

3. **Enhance Readiness Check with Explicit Failure**: Replace the curl timeout loop with a script that explicitly fails on timeout
   - Current: `timeout 60 bash -c 'until curl -f http://localhost:3000; do echo "Waiting..."; sleep 2; done'`
   - New: Bash script with counter that exits 1 if max attempts reached
   - Rationale: Ensures the CI step fails when server doesn't become ready

4. **Add Health Check Endpoint Verification**: Use curl with explicit status code checking and verbose error output
   - Change: `curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3000`
   - Add: Fail if response is not 200-299
   - Rationale: Verifies server is not just listening but actually serving content

5. **Add Server Log Output on Failure**: Display server.log contents when readiness check fails
   - Add: `if: failure()` step that cats server.log
   - Rationale: Provides diagnostic information in CI logs without cluttering successful runs

6. **Increase Initial Wait Time**: Change sleep from 10s to 15s to account for CI environment variability
   - Change: `sleep 10` → `sleep 15`
   - Rationale: Reduces false negatives from slow CI environments while keeping total timeout reasonable

7. **Add Explicit Error Messages**: Include descriptive error messages at each failure point
   - Add: Echo statements before exit 1 commands
   - Rationale: Makes CI failures immediately understandable without deep log analysis

### Implementation Strategy

The fix will be implemented in phases:

**Phase 1: Enhanced Logging and Process Validation**

- Redirect server output to log file
- Add immediate process validation after startup
- Add server log display on failure

**Phase 2: Robust Readiness Checking**

- Replace curl timeout loop with explicit failure handling
- Add health check endpoint verification with status code checking
- Increase initial wait time to 15s

**Phase 3: Error Messaging and Documentation**

- Add descriptive error messages at each failure point
- Document expected behavior in workflow comments

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Manually simulate failure conditions in the CI workflow to observe how the current implementation handles them. Run these tests on the UNFIXED workflow to observe failures and understand the root cause.

**Test Cases**:

1. **Port Conflict Test**: Start a process on port 3000 before running the lighthouse job (will fail on unfixed code - readiness check should fail but may not)
2. **Missing Build Artifacts Test**: Delete or corrupt the out/ directory before starting server (will fail on unfixed code - server won't start but may not be detected)
3. **Slow Server Startup Test**: Add artificial delay to server startup (may fail on unfixed code if >70s total)
4. **Server Crash After Startup Test**: Start server then kill it during readiness check (will fail on unfixed code - may not be detected)

**Expected Counterexamples**:

- Readiness check exits successfully even when server is not accessible
- Possible causes: curl timeout loop doesn't fail the step, verification step doesn't fail on non-zero exit, insufficient logging prevents diagnosis

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed workflow produces the expected behavior.

**Pseudocode:**

```
FOR ALL input WHERE isBugCondition(input) DO
  result := lighthouseJob_fixed(input)
  ASSERT serverAccessible(result) OR jobFailedWithClearError(result)
END FOR
```

**Testing Approach**: Run the fixed workflow against various failure scenarios and verify that:

- Server startup failures are detected immediately
- Readiness check failures cause the job to fail with clear error messages
- Server logs are available for debugging
- Successful startups proceed to Lighthouse tests without issues

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed workflow produces the same result as the original workflow.

**Pseudocode:**

```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT lighthouseJob_original(input) = lighthouseJob_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:

- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED workflow first for successful server startups and test execution, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Successful Server Startup Preservation**: Verify that when server starts successfully, all downstream steps (test execution, artifact upload, cleanup) work identically
2. **Artifact Download Preservation**: Verify that build artifact download continues to work exactly as before
3. **Dependency Installation Preservation**: Verify that npm ci continues to work exactly as before
4. **Test Execution Preservation**: Verify that Lighthouse tests execute identically when server is accessible
5. **Cleanup Preservation**: Verify that server shutdown and artifact upload work identically

### Unit Tests

- Test server startup script with various failure modes (port conflict, missing files, permission errors)
- Test readiness check script with various server states (not started, starting, ready, crashed)
- Test health check endpoint verification with various HTTP response codes
- Test server log capture and display functionality

### Property-Based Tests

- Generate random CI environment conditions (resource availability, timing variations) and verify server startup succeeds or fails clearly
- Generate random server startup delays and verify readiness check handles them correctly
- Test that all non-server-startup steps produce identical results across many scenarios

### Integration Tests

- Test full CI workflow with successful server startup and Lighthouse test execution
- Test full CI workflow with server startup failure and verify job fails with clear error
- Test full CI workflow with slow server startup and verify readiness check waits appropriately
- Test that server logs are captured and displayed on failure
- Test that cleanup occurs correctly in both success and failure scenarios

### Manual Testing in CI

Since this is a CI-specific issue, manual testing in the actual CI environment is critical:

1. **Baseline Test**: Run fixed workflow on a branch with known-good build artifacts
2. **Failure Injection Test**: Manually introduce failures (delete out/, occupy port 3000) and verify error handling
3. **Timing Test**: Monitor server startup times across multiple CI runs to validate timeout values
4. **Log Verification Test**: Verify server logs are captured and displayed correctly on failures

### Success Criteria

The fix is considered successful when:

- ✅ Server startup failures are detected within 20 seconds (15s wait + 5s validation)
- ✅ Readiness check failures cause immediate job failure with clear error message
- ✅ Server logs are available in CI output when startup fails
- ✅ Successful server startups proceed to Lighthouse tests without changes
- ✅ All preservation requirements are met (no regressions in other CI steps)
- ✅ CI job completes successfully on main branch with no code changes
