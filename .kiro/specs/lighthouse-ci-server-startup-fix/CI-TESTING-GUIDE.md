# Lighthouse CI Server Startup Fix - Manual Testing Guide

## Overview

This guide provides comprehensive manual testing procedures for validating the Lighthouse CI server startup fix in the actual GitHub Actions CI environment. Since the fix addresses CI-specific issues that cannot be fully replicated locally, these tests must be performed in the real CI environment.

## Prerequisites

- Access to GitHub repository with push permissions
- Ability to create branches and trigger CI workflows
- Access to GitHub Actions logs and artifacts
- Understanding of the 7 design changes implemented (see Design Changes section)

## Design Changes Summary

The fix implements 7 specific changes to improve server startup reliability:

1. **Server output redirected to server.log** - Captures all stdout/stderr for debugging
2. **Immediate process validation (2s check)** - Detects immediate crashes after startup
3. **Curl timeout loop replaced with explicit failure handling** - Ensures job fails on timeout
4. **Health check with HTTP status code verification (200-299)** - Validates server is serving content
5. **Server.log displayed on failure** - Provides diagnostic information in CI logs
6. **Initial wait increased from 10s to 15s** - Accounts for CI environment variability
7. **Descriptive error messages at each failure point** - Makes failures immediately understandable

## Testing Checklist

### ✅ Test 1: Baseline Test - Known-Good Build

**Objective**: Verify the fixed workflow works correctly with valid build artifacts and normal conditions.

**Steps**:

1. Create a new branch from the fixed code: `git checkout -b test/lighthouse-baseline`
2. Push the branch to trigger CI: `git push origin test/lighthouse-baseline`
3. Navigate to GitHub Actions and locate the CI workflow run
4. Monitor the "Lighthouse Performance Tests" job

**Expected Results**:

- ✅ "Start server in background" step completes successfully
- ✅ "Validate server process" step shows: `✓ Server process is running (PID XXXX)`
- ✅ "Wait for server to be ready" step shows: `✓ Server is ready! (HTTP 200)`
- ✅ "Verify server is running" step shows: `✓ Server verification successful (HTTP 200)`
- ✅ "Run Lighthouse tests" step executes all 4 tests successfully
- ✅ "Stop server" step shows: `✓ Server process (PID XXXX) stopped`
- ✅ Lighthouse results artifact is uploaded
- ✅ Total job time is reasonable (< 5 minutes)

**What to Look For in Logs**:

```
Starting Next.js production server on port 3000...
Server started with PID: 12345
✓ Server process is running (PID 12345)
Waiting 13 seconds for server initialization...
Checking server readiness at http://localhost:3000...
✓ Server is ready! (HTTP 200)
✓ Server verification successful (HTTP 200)
Server is ready for Lighthouse tests
```

**Validation**:

- [ ] All steps completed successfully
- [ ] No error messages in logs
- [ ] Server logs NOT displayed (only on failure)
- [ ] Job completed in reasonable time
- [ ] All 7 design changes are functioning correctly

---

### ❌ Test 2: Failure Injection - Missing Build Artifacts

**Objective**: Verify the workflow detects and reports server startup failures with clear error messages.

**Steps**:

1. Create a new branch: `git checkout -b test/lighthouse-missing-artifacts`
2. Modify `.github/workflows/ci.yml` to simulate missing artifacts:
   ```yaml
   # In the lighthouse job, BEFORE "Start server in background"
   - name: Simulate missing artifacts
     run: rm -rf out/
   ```
3. Commit and push: `git add . && git commit -m "Test: missing artifacts" && git push origin test/lighthouse-missing-artifacts`
4. Monitor the CI workflow run

**Expected Results**:

- ✅ "Start server in background" step completes (server starts but will fail)
- ✅ "Validate server process" step FAILS with clear error message
- ✅ Error message indicates server process crashed
- ✅ Server log is displayed showing the actual error
- ✅ Job fails before reaching Lighthouse tests
- ✅ "Display server logs on failure" step runs and shows diagnostic information

**What to Look For in Logs**:

```
❌ ERROR: Server process (PID 12345) is not running
The server process started but crashed immediately after startup.
Common causes: port 3000 already in use, missing dependencies, configuration errors

=== Server Log (last 50 lines) ===
[Error messages about missing out/ directory]
=== End Server Log ===
```

**Validation**:

- [ ] Job failed at "Validate server process" step
- [ ] Clear error message explaining the failure
- [ ] Server log displayed with actual error details
- [ ] Design changes #1, #2, #5, #7 are working correctly
- [ ] Lighthouse tests did NOT run (fail-fast behavior)

---

### ❌ Test 3: Failure Injection - Port Conflict

**Objective**: Verify the workflow detects port conflicts and provides diagnostic information.

**Steps**:

1. Create a new branch: `git checkout -b test/lighthouse-port-conflict`
2. Modify `.github/workflows/ci.yml` to occupy port 3000:
   ```yaml
   # In the lighthouse job, BEFORE "Start server in background"
   - name: Occupy port 3000
     run: |
       python3 -m http.server 3000 &
       echo $! > blocker.pid
       sleep 2
   ```
3. Commit and push the changes
4. Monitor the CI workflow run

**Expected Results**:

- ✅ "Start server in background" step completes
- ✅ "Validate server process" step FAILS with port conflict error
- ✅ Server log shows "EADDRINUSE" or similar port conflict error
- ✅ Error message suggests checking if port 3000 is in use
- ✅ Job fails before Lighthouse tests

**What to Look For in Logs**:

```
❌ ERROR: Server process (PID 12345) is not running
The server process started but crashed immediately after startup.
Common causes: port 3000 already in use, missing dependencies, configuration errors

=== Server Log (last 50 lines) ===
Error: listen EADDRINUSE: address already in use :::3000
=== End Server Log ===
```

**Validation**:

- [ ] Job failed at "Validate server process" step
- [ ] Error message mentions port conflict as possible cause
- [ ] Server log shows EADDRINUSE error
- [ ] Design changes #1, #2, #5, #7 are working correctly

---

### ⏱️ Test 4: Timing Test - Slow Server Startup

**Objective**: Verify the workflow handles slow server startup within timeout limits.

**Steps**:

1. Create a new branch: `git checkout -b test/lighthouse-slow-startup`
2. Modify `.github/workflows/ci.yml` to add artificial delay:
   ```yaml
   # In the lighthouse job, AFTER "Download build artifacts"
   - name: Simulate slow environment
     run: |
       # Add a delay to simulate slow CI environment
       sleep 5
   ```
3. Commit and push the changes
4. Monitor the CI workflow run and measure timing

**Expected Results**:

- ✅ "Wait for server to be ready" step shows multiple retry attempts
- ✅ Server eventually becomes ready within 60-second timeout
- ✅ Logs show: `Attempt X/30: Server not ready (HTTP 000), retrying in 2s...`
- ✅ Eventually shows: `✓ Server is ready! (HTTP 200)`
- ✅ Lighthouse tests run successfully
- ✅ Total startup time is within acceptable range (< 90 seconds)

**What to Look For in Logs**:

```
Checking server readiness at http://localhost:3000...
Attempt 1/30: Server not ready (HTTP 000), retrying in 2s...
Attempt 2/30: Server not ready (HTTP 000), retrying in 2s...
Attempt 3/30: Server not ready (HTTP 000), retrying in 2s...
Attempt 4/30: Server not ready (HTTP 000), retrying in 2s...
✓ Server is ready! (HTTP 200)
```

**Validation**:

- [ ] Server became ready within 60-second timeout (30 attempts × 2s)
- [ ] Retry logic worked correctly
- [ ] Design changes #3, #4, #6 are working correctly
- [ ] Job completed successfully after retries

---

### 📊 Test 5: Log Verification Test

**Objective**: Verify server logs are captured correctly and displayed on failures.

**Steps**:

1. Create a new branch: `git checkout -b test/lighthouse-log-verification`
2. Modify `.github/workflows/ci.yml` to cause a failure that generates logs:
   ```yaml
   # In the lighthouse job, AFTER "Start server in background"
   - name: Cause server failure
     run: |
       sleep 3
       kill $(cat server.pid)
   ```
3. Commit and push the changes
4. Monitor the CI workflow run

**Expected Results**:

- ✅ Server starts initially
- ✅ Server is killed during validation
- ✅ "Validate server process" or "Wait for server to be ready" step FAILS
- ✅ "Display server logs on failure" step runs
- ✅ Full server log is displayed in the diagnostic section
- ✅ Log shows server startup messages before being killed

**What to Look For in Logs**:

```
=== Diagnostic Information ===
Job failed. Displaying server logs for debugging...

=== Full Server Log ===
[Server startup messages]
[Any error messages before crash]
=== End Server Log ===

Server PID: 12345
Server process status: NOT RUNNING (crashed or stopped)
```

**Validation**:

- [ ] Server log was captured to server.log file
- [ ] Full log displayed in "Display server logs on failure" step
- [ ] Log contains useful diagnostic information
- [ ] Design changes #1, #5, #7 are working correctly

---

### 🔄 Test 6: Multiple CI Runs - Consistency Test

**Objective**: Verify the fix works consistently across multiple CI runs.

**Steps**:

1. Use the baseline test branch from Test 1
2. Trigger 5 consecutive CI runs by pushing empty commits:
   ```bash
   for i in {1..5}; do
     git commit --allow-empty -m "Test run $i"
     git push origin test/lighthouse-baseline
     sleep 30  # Wait between runs
   done
   ```
3. Monitor all 5 workflow runs

**Expected Results**:

- ✅ All 5 runs complete successfully
- ✅ Server startup times are consistent (within ±5 seconds)
- ✅ No intermittent failures
- ✅ All runs show same log patterns
- ✅ Lighthouse test results are consistent

**Validation**:

- [ ] 5/5 runs succeeded
- [ ] Server startup time variance is acceptable
- [ ] No race conditions or timing issues observed
- [ ] Design changes work consistently across runs

---

### ✅ Test 7: End-to-End Verification

**Objective**: Verify all 7 design changes are working correctly in a complete workflow.

**Steps**:

1. Review logs from Test 1 (baseline test)
2. Verify each design change is functioning as specified

**Design Change Verification Checklist**:

**1. Server output redirected to server.log**

- [ ] "Start server in background" step shows: `Server output is being logged to server.log`
- [ ] server.log file is created and contains server output
- [ ] Logs are displayed on failure in diagnostic section

**2. Immediate process validation (2s check)**

- [ ] "Validate server process" step runs after 2-second sleep
- [ ] Step checks if PID exists and process is running
- [ ] Catches immediate crashes before long wait period

**3. Curl timeout loop replaced with explicit failure handling**

- [ ] "Wait for server to be ready" step uses counter-based loop
- [ ] Loop exits with error code 1 if max attempts reached
- [ ] Clear error message displayed on timeout

**4. Health check with HTTP status code verification (200-299)**

- [ ] Readiness check uses: `curl -f -s -o /dev/null -w "%{http_code}"`
- [ ] Checks if HTTP_CODE is between 200-299
- [ ] Rejects non-success status codes (404, 500, etc.)

**5. Server.log displayed on failure**

- [ ] "Display server logs on failure" step has `if: failure()` condition
- [ ] Step displays last 50 lines in validation step
- [ ] Step displays full log in diagnostic section
- [ ] Logs are NOT displayed on successful runs

**6. Initial wait increased from 10s to 15s**

- [ ] "Validate server process" step shows: `Waiting 13 seconds for server initialization...`
- [ ] Total initial wait is 2s (validation) + 13s = 15s
- [ ] Provides more time for CI environment variability

**7. Descriptive error messages at each failure point**

- [ ] PID file missing: Clear error message with troubleshooting steps
- [ ] Process not running: Error message lists common causes
- [ ] Readiness timeout: Error message with troubleshooting steps
- [ ] Verification failure: Error message explains expected vs actual

**Validation**:

- [ ] All 7 design changes are implemented correctly
- [ ] Each change provides the intended benefit
- [ ] Changes work together cohesively

---

## CI Log Analysis Guide

### What to Look For in Successful Runs

**Server Startup Phase**:

```
Starting Next.js production server on port 3000...
Server started with PID: 12345
Server output is being logged to server.log
```

**Process Validation Phase**:

```
Validating server process is running...
✓ Server process is running (PID 12345)
Waiting 13 seconds for server initialization...
```

**Readiness Check Phase**:

```
Checking server readiness at http://localhost:3000...
Attempt 1/30: Server not ready (HTTP 000), retrying in 2s...
Attempt 2/30: Server not ready (HTTP 000), retrying in 2s...
✓ Server is ready! (HTTP 200)
```

**Verification Phase**:

```
Performing final server verification...
✓ Server verification successful (HTTP 200)
Server is ready for Lighthouse tests
```

**Test Execution Phase**:

```
> npm run test:lighthouse
[Lighthouse test output]
✓ All tests passed
```

**Cleanup Phase**:

```
Stopping server...
✓ Server process (PID 12345) stopped
```

### What to Look For in Failed Runs

**Immediate Crash (Design Change #2)**:

```
❌ ERROR: Server process (PID 12345) is not running
The server process started but crashed immediately after startup.
Common causes: port 3000 already in use, missing dependencies, configuration errors

=== Server Log (last 50 lines) ===
[Actual error from server]
=== End Server Log ===
```

**Readiness Timeout (Design Change #3)**:

```
❌ ERROR: Server failed to become ready after 30 attempts (60 seconds)
Last HTTP status code: 000

Troubleshooting steps:
  1. Check if the server is binding to the correct port (3000)
  2. Verify the build artifacts in out/ directory are valid
  3. Check server.log below for startup errors or warnings

=== Server Log (last 50 lines) ===
[Server output]
=== End Server Log ===
```

**Verification Failure (Design Change #4)**:

```
❌ ERROR: Server not responding with valid status code (HTTP 404)
Expected: 200-299, Got: 404
The server was ready but is now returning an error status code.
```

**Diagnostic Information (Design Change #5)**:

```
=== Diagnostic Information ===
Job failed. Displaying server logs for debugging...

=== Full Server Log ===
[Complete server output]
=== End Server Log ===

Server PID: 12345
Server process status: NOT RUNNING (crashed or stopped)
```

---

## Requirements Validation Matrix

| Requirement                                     | Test Coverage          | Validation Method                       |
| ----------------------------------------------- | ---------------------- | --------------------------------------- |
| 1.1 - Server fails to start/become accessible   | Test 2, Test 3         | Verify job fails with clear error       |
| 1.2 - Curl check doesn't detect failure         | Test 2, Test 3         | Verify explicit failure handling works  |
| 1.3 - Verify step doesn't fail job              | Test 2, Test 3         | Verify job fails at correct step        |
| 1.4 - Lighthouse tests fail with unclear error  | Test 1, Test 4         | Verify tests run only when server ready |
| 2.1 - Server starts successfully                | Test 1, Test 4, Test 6 | Verify server becomes accessible        |
| 2.2 - Job fails immediately on startup failure  | Test 2, Test 3         | Verify fail-fast behavior               |
| 2.3 - Readiness check accurately detects server | Test 1, Test 4         | Verify HTTP status code checking        |
| 2.4 - Lighthouse tests execute successfully     | Test 1, Test 6         | Verify tests run against ready server   |
| 3.1 - Artifact download unchanged               | Test 1                 | Verify artifacts downloaded correctly   |
| 3.2 - Dependency installation unchanged         | Test 1                 | Verify npm ci works correctly           |
| 3.3 - Test execution unchanged                  | Test 1                 | Verify Lighthouse tests run identically |
| 3.4 - Artifact upload unchanged                 | Test 1                 | Verify results uploaded correctly       |
| 3.5 - Server cleanup unchanged                  | Test 1, Test 2         | Verify kill command works correctly     |

---

## Success Criteria

The manual CI testing is considered successful when:

- ✅ **Test 1 (Baseline)**: All steps complete successfully, job passes
- ✅ **Test 2 (Missing Artifacts)**: Job fails at validation step with clear error and server logs
- ✅ **Test 3 (Port Conflict)**: Job fails at validation step with port conflict error
- ✅ **Test 4 (Slow Startup)**: Server becomes ready within timeout, job passes
- ✅ **Test 5 (Log Verification)**: Server logs captured and displayed on failure
- ✅ **Test 6 (Consistency)**: 5/5 runs succeed with consistent behavior
- ✅ **Test 7 (E2E Verification)**: All 7 design changes verified working correctly

**Overall Success Metrics**:

- Server startup failures detected within 20 seconds (15s wait + 5s validation)
- Readiness check failures cause immediate job failure with clear error message
- Server logs available in CI output when startup fails
- Successful server startups proceed to Lighthouse tests without changes
- All preservation requirements met (no regressions in other CI steps)
- CI job completes successfully on main branch with no code changes

---

## Troubleshooting Common Issues

### Issue: Server starts but tests still fail

**Possible Causes**:

- Server is binding to wrong port
- Build artifacts are corrupted
- Server is returning error status codes

**Debugging Steps**:

1. Check "Verify server is running" step for HTTP status code
2. Review server.log for startup warnings
3. Verify build artifacts were downloaded correctly
4. Check if server is binding to port 3000

### Issue: Readiness check times out

**Possible Causes**:

- Server taking longer than 60 seconds to start
- Server crashing during startup
- Network issues in CI environment

**Debugging Steps**:

1. Review server.log for errors
2. Check if process validation step passed
3. Verify build artifacts are valid
4. Consider increasing MAX_ATTEMPTS if consistently timing out

### Issue: Server logs not displayed

**Possible Causes**:

- server.log file not created
- "Display server logs on failure" step not running

**Debugging Steps**:

1. Verify "Start server in background" step redirects to server.log
2. Check if `if: failure()` condition is working
3. Verify server.log file exists in workspace

### Issue: Inconsistent failures across runs

**Possible Causes**:

- Race conditions in startup timing
- CI environment resource variability
- Flaky tests

**Debugging Steps**:

1. Run Test 6 (Consistency Test) multiple times
2. Compare server startup times across runs
3. Check for timing-related errors in logs
4. Consider increasing initial wait time if needed

---

## Next Steps After Testing

1. **Document Results**: Record outcomes of all 7 tests in this guide
2. **Report Issues**: If any tests fail, create detailed bug reports with CI logs
3. **Iterate**: If issues found, update the fix and re-run tests
4. **Merge**: Once all tests pass, merge the fix to main branch
5. **Monitor**: Watch CI runs on main branch for any regressions
6. **Cleanup**: Delete test branches after successful validation

---

## Appendix: Quick Reference

### Key Files

- `.github/workflows/ci.yml` - CI workflow with Lighthouse job
- `server.log` - Server output (created during CI run)
- `server.pid` - Server process ID (created during CI run)
- `lighthouse-report.json` - Test results artifact

### Key Commands

- `npm run serve` - Start production server
- `curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3000` - Health check
- `ps -p $PID` - Check if process is running
- `kill $(cat server.pid)` - Stop server

### Expected Timing

- Initial wait: 15 seconds (2s validation + 13s sleep)
- Readiness check: Up to 60 seconds (30 attempts × 2s)
- Total maximum startup time: 75 seconds
- Typical successful startup: 20-30 seconds

### HTTP Status Codes

- 200-299: Success (server ready)
- 000: Connection failed (server not responding)
- 404: Not found (server running but wrong endpoint)
- 500-599: Server error (server running but erroring)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Related Spec**: `.kiro/specs/lighthouse-ci-server-startup-fix/`
