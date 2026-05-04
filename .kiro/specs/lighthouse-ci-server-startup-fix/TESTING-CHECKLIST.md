# Lighthouse CI Server Startup Fix - Testing Checklist

## Quick Reference for Manual CI Testing

This checklist provides a quick reference for validating the Lighthouse CI server startup fix. For detailed instructions, see [CI-TESTING-GUIDE.md](./CI-TESTING-GUIDE.md).

---

## Pre-Testing Setup

- [ ] Access to GitHub repository with push permissions
- [ ] Ability to create branches and trigger CI workflows
- [ ] Access to GitHub Actions logs and artifacts
- [ ] Reviewed the 7 design changes in design.md

---

## Test Execution Checklist

### Test 1: ✅ Baseline Test (Known-Good Build)

**Branch**: `test/lighthouse-baseline`

**Quick Steps**:

1. Create branch from fixed code
2. Push to trigger CI
3. Monitor "Lighthouse Performance Tests" job

**Expected**: All steps pass, server starts successfully, Lighthouse tests run

**Validation**:

- [ ] Server starts with PID logged
- [ ] Process validation passes
- [ ] Readiness check shows `✓ Server is ready! (HTTP 200)`
- [ ] Verification passes
- [ ] Lighthouse tests execute successfully
- [ ] Server stops cleanly
- [ ] Job completes in < 5 minutes

---

### Test 2: ❌ Failure Test (Missing Build Artifacts)

**Branch**: `test/lighthouse-missing-artifacts`

**Quick Steps**:

1. Create branch
2. Add `rm -rf out/` before server start in workflow
3. Push to trigger CI

**Expected**: Job fails at validation step with clear error and server logs

**Validation**:

- [ ] Job fails at "Validate server process" step
- [ ] Error message: "Server process is not running"
- [ ] Server log displayed showing actual error
- [ ] Lighthouse tests did NOT run
- [ ] Design changes #1, #2, #5, #7 working

---

### Test 3: ❌ Failure Test (Port Conflict)

**Branch**: `test/lighthouse-port-conflict`

**Quick Steps**:

1. Create branch
2. Add step to occupy port 3000 before server start
3. Push to trigger CI

**Expected**: Job fails with port conflict error

**Validation**:

- [ ] Job fails at "Validate server process" step
- [ ] Error mentions port conflict as possible cause
- [ ] Server log shows EADDRINUSE error
- [ ] Design changes #1, #2, #5, #7 working

---

### Test 4: ⏱️ Timing Test (Slow Server Startup)

**Branch**: `test/lighthouse-slow-startup`

**Quick Steps**:

1. Create branch
2. Add 5-second delay before server start
3. Push to trigger CI

**Expected**: Server becomes ready within timeout, job passes

**Validation**:

- [ ] Multiple retry attempts logged
- [ ] Server eventually ready within 60s
- [ ] Logs show: `Attempt X/30: Server not ready...`
- [ ] Eventually: `✓ Server is ready! (HTTP 200)`
- [ ] Lighthouse tests run successfully
- [ ] Design changes #3, #4, #6 working

---

### Test 5: 📊 Log Verification Test

**Branch**: `test/lighthouse-log-verification`

**Quick Steps**:

1. Create branch
2. Add step to kill server after startup
3. Push to trigger CI

**Expected**: Server logs captured and displayed on failure

**Validation**:

- [ ] Server starts initially
- [ ] Job fails when server is killed
- [ ] "Display server logs on failure" step runs
- [ ] Full server log displayed
- [ ] Diagnostic information shown
- [ ] Design changes #1, #5, #7 working

---

### Test 6: 🔄 Consistency Test (Multiple Runs)

**Branch**: `test/lighthouse-baseline` (reuse)

**Quick Steps**:

1. Trigger 5 consecutive CI runs
2. Monitor all runs

**Expected**: All runs succeed consistently

**Validation**:

- [ ] 5/5 runs succeeded
- [ ] Server startup times consistent (±5 seconds)
- [ ] No intermittent failures
- [ ] Same log patterns across runs
- [ ] Consistent Lighthouse results

---

### Test 7: ✅ End-to-End Verification (All Design Changes)

**Review**: Logs from Test 1

**Design Change Verification**:

1. **Server output redirected to server.log**
   - [ ] Log file created and contains server output
   - [ ] Logs displayed on failure

2. **Immediate process validation (2s check)**
   - [ ] Validation step runs after 2s
   - [ ] Checks PID and process status
   - [ ] Catches immediate crashes

3. **Curl timeout loop replaced with explicit failure handling**
   - [ ] Counter-based loop implemented
   - [ ] Exits with error code 1 on timeout
   - [ ] Clear error message on timeout

4. **Health check with HTTP status code verification (200-299)**
   - [ ] Uses `curl -f -s -o /dev/null -w "%{http_code}"`
   - [ ] Checks for 200-299 status codes
   - [ ] Rejects non-success codes

5. **Server.log displayed on failure**
   - [ ] `if: failure()` condition works
   - [ ] Last 50 lines in validation step
   - [ ] Full log in diagnostic section
   - [ ] NOT displayed on success

6. **Initial wait increased from 10s to 15s**
   - [ ] Shows: `Waiting 13 seconds for server initialization...`
   - [ ] Total wait is 2s + 13s = 15s

7. **Descriptive error messages at each failure point**
   - [ ] PID file missing: Clear error with troubleshooting
   - [ ] Process not running: Lists common causes
   - [ ] Readiness timeout: Troubleshooting steps
   - [ ] Verification failure: Expected vs actual

---

## Requirements Validation

### Current Behavior (Defect) - Should Be Fixed

- [ ] 1.1: Server no longer fails to become accessible
- [ ] 1.2: Curl check now detects failures properly
- [ ] 1.3: Verify step now fails job on errors
- [ ] 1.4: Lighthouse tests only run when server ready

### Expected Behavior (Correct) - Should Work

- [ ] 2.1: Server starts successfully within timeout
- [ ] 2.2: Job fails immediately on startup failure
- [ ] 2.3: Readiness check accurately detects server
- [ ] 2.4: Lighthouse tests execute successfully

### Unchanged Behavior (Preservation) - Should Be Identical

- [ ] 3.1: Artifact download works correctly
- [ ] 3.2: Dependency installation works correctly
- [ ] 3.3: Test execution works identically
- [ ] 3.4: Artifact upload works correctly
- [ ] 3.5: Server cleanup works correctly

---

## Success Criteria Summary

**All tests must meet these criteria**:

- ✅ Server startup failures detected within 20 seconds
- ✅ Readiness check failures cause immediate job failure
- ✅ Server logs available in CI output on failures
- ✅ Successful startups proceed to Lighthouse tests unchanged
- ✅ All preservation requirements met (no regressions)
- ✅ CI job completes successfully on main branch

**Test Results**:

- Test 1 (Baseline): ⬜ Pass / ⬜ Fail
- Test 2 (Missing Artifacts): ⬜ Pass / ⬜ Fail
- Test 3 (Port Conflict): ⬜ Pass / ⬜ Fail
- Test 4 (Slow Startup): ⬜ Pass / ⬜ Fail
- Test 5 (Log Verification): ⬜ Pass / ⬜ Fail
- Test 6 (Consistency): ⬜ Pass / ⬜ Fail
- Test 7 (E2E Verification): ⬜ Pass / ⬜ Fail

**Overall Result**: ⬜ All Tests Passed / ⬜ Issues Found

---

## Quick Troubleshooting

### Server starts but tests fail

→ Check HTTP status code in "Verify server is running" step
→ Review server.log for warnings

### Readiness check times out

→ Review server.log for errors
→ Check if process validation passed
→ Verify build artifacts are valid

### Server logs not displayed

→ Verify server.log file created
→ Check `if: failure()` condition working

### Inconsistent failures

→ Run Test 6 multiple times
→ Compare startup times across runs
→ Check for timing-related errors

---

## Next Steps

After completing all tests:

1. [ ] Document results in this checklist
2. [ ] Report any issues found with CI logs
3. [ ] Iterate on fix if needed and re-test
4. [ ] Merge to main branch when all tests pass
5. [ ] Monitor CI runs on main for regressions
6. [ ] Clean up test branches

---

**Quick Links**:

- [Detailed Testing Guide](./CI-TESTING-GUIDE.md)
- [Design Document](./design.md)
- [Bug Requirements](./bugfix.md)
- [Tasks](./tasks.md)

**Document Version**: 1.0  
**Last Updated**: 2024
