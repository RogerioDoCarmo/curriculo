# Bugfix Requirements Document

## Introduction

The GitHub CI pipeline is failing in the "lighthouse" job because the Lighthouse performance tests cannot connect to the server at <http://localhost:3000>. The job downloads build artifacts from the "build" job, attempts to start the server with `npm run serve &` in the background, waits 10 seconds with `sleep 10`, then attempts to verify server readiness with a 60-second curl timeout loop. Despite these wait mechanisms, all 4 Lighthouse tests fail with "Server not accessible at <http://localhost:3000>. Please start the server first."

The root cause is that the server is either:

1. Not starting successfully in the CI environment
2. Taking longer than expected to become ready
3. Starting on a different port or failing silently
4. The wait/verification logic is not properly detecting server startup failures

This bug prevents the CI pipeline from validating performance requirements and blocks the deployment workflow.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the lighthouse job runs `npm run serve &` in the CI environment THEN the server fails to start or become accessible within the wait period

1.2 WHEN the curl readiness check runs with `timeout 60 bash -c 'until curl -f http://localhost:3000; do echo "Waiting..."; sleep 2; done'` THEN it does not detect the server startup failure and exits successfully even though the server is not accessible

1.3 WHEN the "Verify server is running" step executes `curl -I http://localhost:3000` THEN it does not fail the job despite the server not being accessible

1.4 WHEN the Lighthouse tests run with the server not accessible THEN all 4 tests fail with "Server not accessible at <http://localhost:3000>. Please start the server first."

### Expected Behavior (Correct)

2.1 WHEN the lighthouse job runs `npm run serve` in the CI environment THEN the server SHALL start successfully and become accessible at <http://localhost:3000> within a reasonable timeout period

2.2 WHEN the server fails to start or does not become accessible within the timeout period THEN the CI job SHALL fail immediately with a clear error message indicating the server startup failure

2.3 WHEN the server readiness check runs THEN it SHALL accurately detect whether the server is accessible and responding to HTTP requests at <http://localhost:3000>

2.4 WHEN the Lighthouse tests run THEN the server SHALL be accessible and all tests SHALL execute successfully against the running server

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the lighthouse job downloads build artifacts from the "build" job THEN the system SHALL CONTINUE TO download the artifacts to the out/ directory successfully

3.2 WHEN the lighthouse job installs dependencies with `npm ci --legacy-peer-deps` THEN the system SHALL CONTINUE TO install all required dependencies successfully

3.3 WHEN the Lighthouse tests run against an accessible server THEN the system SHALL CONTINUE TO validate First Contentful Paint, Time to Interactive, Performance Score, and detailed metrics as defined in the test file

3.4 WHEN the lighthouse job completes (success or failure) THEN the system SHALL CONTINUE TO upload Lighthouse results as artifacts and stop the server process

3.5 WHEN the server is stopped with `kill $(cat server.pid)` THEN the system SHALL CONTINUE TO terminate the server process cleanly
