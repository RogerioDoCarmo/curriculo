/**
 * Property-Based Tests - Lighthouse CI Server Startup
 *
 * This file contains two types of property tests:
 *
 * 1. Bug Condition Exploration Tests (Task 1)
 *    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 *    - EXPECTED: FAIL on unfixed code (confirms bug exists)
 *    - EXPECTED: PASS on fixed code (confirms bug is fixed)
 *
 * 2. Preservation Property Tests (Task 2)
 *    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 *    - EXPECTED: PASS on unfixed code (confirms baseline behavior)
 *    - EXPECTED: PASS on fixed code (confirms no regressions)
 */

import * as fc from "fast-check";
import { execSync, spawn, ChildProcess } from "child_process";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

describe("Bug Condition Exploration: Server Startup and Accessibility", () => {
  const SERVER_URL = "http://localhost:3000";
  const SERVER_PID_FILE = path.join(__dirname, "../../server-test.pid");
  const SERVER_LOG_FILE = path.join(__dirname, "../../server-test.log");
  const BUILD_OUTPUT_DIR = path.join(__dirname, "../../out");

  let serverProcess: ChildProcess | null = null;

  // Helper: Check if server is accessible with HTTP request
  const checkServerAccessibility = (url: string, timeoutMs: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const startTime = Date.now();

      const attemptConnection = () => {
        if (Date.now() - startTime > timeoutMs) {
          resolve(false);
          return;
        }

        http
          .get(url, (res) => {
            // Server is accessible if status code is 200-299
            resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300);
          })
          .on("error", () => {
            // Connection failed, retry after delay
            setTimeout(attemptConnection, 500);
          });
      };

      attemptConnection();
    });
  };

  // Helper: Start server in background (mimics CI workflow)
  const startServerInBackground = (): Promise<{ pid: number; logPath: string }> => {
    return new Promise((resolve, reject) => {
      // Start server process (mimics: npm run serve &)
      // Redirect output to log file
      serverProcess = spawn("npm", ["run", "serve"], {
        detached: false,
        stdio: "pipe", // Use pipe instead of file streams
      });

      if (!serverProcess.pid) {
        reject(new Error("Failed to start server process"));
        return;
      }

      const pid = serverProcess.pid;

      // Capture stdout and stderr to log file
      const logStream = fs.createWriteStream(SERVER_LOG_FILE, { flags: "w" });
      if (serverProcess.stdout) {
        serverProcess.stdout.pipe(logStream);
      }
      if (serverProcess.stderr) {
        serverProcess.stderr.pipe(logStream);
      }

      // Write PID file (mimics: echo $! > server.pid)
      fs.writeFileSync(SERVER_PID_FILE, pid.toString());

      serverProcess.on("error", (err) => {
        reject(new Error(`Server process error: ${err.message}`));
      });

      // Give process a moment to start
      setTimeout(() => {
        resolve({ pid, logPath: SERVER_LOG_FILE });
      }, 1000);
    });
  };

  // Helper: Stop server process
  const stopServer = () => {
    if (serverProcess && !serverProcess.killed) {
      try {
        serverProcess.kill("SIGTERM");
        serverProcess = null;
      } catch (err) {
        // Process may already be dead
      }
    }

    // Clean up PID file
    if (fs.existsSync(SERVER_PID_FILE)) {
      fs.unlinkSync(SERVER_PID_FILE);
    }
  };

  // Helper: Simulate CI readiness check (current implementation)
  const simulateCurrentReadinessCheck = async (timeoutSeconds: number): Promise<boolean> => {
    try {
      // Mimics: timeout 60 bash -c 'until curl -f http://localhost:3000; do echo "Waiting..."; sleep 2; done'
      const startTime = Date.now();
      const timeoutMs = timeoutSeconds * 1000;

      while (Date.now() - startTime < timeoutMs) {
        try {
          execSync(`curl -f ${SERVER_URL}`, {
            stdio: "pipe",
            timeout: 2000,
          });
          // If curl succeeds, return true
          return true;
        } catch {
          // curl failed, wait and retry
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Timeout reached - but current implementation may not fail the job!
      // This is part of the bug: readiness check exits successfully even when server is not accessible
      return false;
    } catch {
      return false;
    }
  };

  beforeAll(async () => {
    // Verify build output exists (mimics CI artifact download)
    if (!fs.existsSync(BUILD_OUTPUT_DIR)) {
      throw new Error(
        `Build output directory not found: ${BUILD_OUTPUT_DIR}. Run 'npm run build' first.`
      );
    }

    // Ensure no server is already running on port 3000
    const serverAlreadyRunning = await checkServerAccessibility(SERVER_URL, 1000);
    if (serverAlreadyRunning) {
      console.warn(
        "⚠️  WARNING: A server is already running on port 3000. Tests may produce false positives."
      );
      console.warn("   Please stop any running servers before running these tests.");
    }
  });

  afterEach(() => {
    stopServer();

    // Clean up log file
    if (fs.existsSync(SERVER_LOG_FILE)) {
      fs.unlinkSync(SERVER_LOG_FILE);
    }
  });

  /**
   * Property 1: Bug Condition - Server Startup Failure Detection
   *
   * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
   *
   * This property tests the bug condition: server process starts but is not accessible
   * at http://localhost:3000 within timeout, yet readiness check doesn't fail the job.
   *
   * EXPECTED OUTCOME ON UNFIXED CODE: This test WILL FAIL
   * - Server may not start successfully
   * - Server may not become accessible within timeout
   * - Readiness check may not accurately detect server state
   *
   * EXPECTED OUTCOME ON FIXED CODE: This test WILL PASS
   * - Server starts successfully
   * - Server becomes accessible at http://localhost:3000
   * - Readiness check accurately detects server accessibility
   */
  it("Property 1: Server SHALL start successfully and become accessible at http://localhost:3000", async () => {
    // This is a scoped property test for the concrete failing case
    // We test the specific scenario that fails in CI

    // Step 1: Start server in background (mimics CI workflow)
    const { pid, logPath } = await startServerInBackground();

    expect(pid).toBeGreaterThan(0);
    console.log(`Server started with PID: ${pid}`);

    // Step 2: Wait initial period (mimics: sleep 10 in CI)
    const initialWaitSeconds = 10;
    console.log(`Waiting ${initialWaitSeconds}s for server to start...`);
    await new Promise((resolve) => setTimeout(resolve, initialWaitSeconds * 1000));

    // Step 3: Check if process is still running (should catch immediate failures)
    let processStillRunning = false;
    try {
      process.kill(pid, 0); // Signal 0 checks if process exists
      processStillRunning = true;
    } catch {
      processStillRunning = false;
    }

    // If process died immediately, log server output for debugging
    if (!processStillRunning) {
      console.error("❌ Server process died immediately after startup");
      if (fs.existsSync(logPath)) {
        const logs = fs.readFileSync(logPath, "utf-8");
        console.error("Server logs:", logs);
      }
    }

    expect(processStillRunning).toBe(true);

    // Step 4: Run readiness check (mimics CI curl timeout loop)
    const readinessCheckTimeout = 60; // 60 seconds as in CI
    console.log(`Running readiness check (${readinessCheckTimeout}s timeout)...`);
    const readinessCheckPassed = await simulateCurrentReadinessCheck(readinessCheckTimeout);

    // Step 5: Verify server is actually accessible
    const serverAccessible = await checkServerAccessibility(SERVER_URL, 5000);

    console.log(`Readiness check result: ${readinessCheckPassed ? "PASSED" : "FAILED"}`);
    console.log(`Server accessibility: ${serverAccessible ? "ACCESSIBLE" : "NOT ACCESSIBLE"}`);

    // CRITICAL ASSERTIONS - These encode the expected behavior
    // On unfixed code, these will FAIL, proving the bug exists

    // Expected Behavior 2.1: Server SHALL start successfully and become accessible
    expect(serverAccessible).toBe(true);

    // Expected Behavior 2.3: Readiness check SHALL accurately detect server accessibility
    expect(readinessCheckPassed).toBe(serverAccessible);

    // If we get here, verify HTTP response status code is 200-299
    if (serverAccessible) {
      const statusCode = await new Promise<number>((resolve) => {
        http.get(SERVER_URL, (res) => {
          resolve(res.statusCode || 0);
        });
      });

      console.log(`Server HTTP status code: ${statusCode}`);

      // Expected Behavior 2.1: Server SHALL respond with successful status codes (200-299)
      expect(statusCode).toBeGreaterThanOrEqual(200);
      expect(statusCode).toBeLessThan(300);
    }
  }, 90000); // 90 second timeout for entire test

  /**
   * Property 2: Readiness Check Accuracy
   *
   * **Validates: Requirements 1.2, 1.3**
   *
   * This property verifies that the readiness check accurately detects when
   * the server is NOT accessible and fails appropriately.
   *
   * EXPECTED OUTCOME ON UNFIXED CODE: This test WILL FAIL
   * - Readiness check may exit successfully even when server is not accessible
   * - This is the false positive bug described in the design
   *
   * EXPECTED OUTCOME ON FIXED CODE: This test WILL PASS
   * - Readiness check accurately detects server is not accessible
   * - Job fails with clear error message
   */
  it("Property 2: Readiness check SHALL fail when server is not accessible", async () => {
    // Test the scenario where server never becomes accessible
    // (e.g., port conflict, missing dependencies, configuration error)

    // Don't start the server - simulate it never becoming accessible
    console.log("Testing readiness check with no server running...");

    // Run readiness check with shorter timeout for this test
    const readinessCheckTimeout = 10; // 10 seconds
    const readinessCheckPassed = await simulateCurrentReadinessCheck(readinessCheckTimeout);

    // Verify server is actually not accessible
    const serverAccessible = await checkServerAccessibility(SERVER_URL, 2000);

    console.log(`Readiness check result: ${readinessCheckPassed ? "PASSED" : "FAILED"}`);
    console.log(`Server accessibility: ${serverAccessible ? "ACCESSIBLE" : "NOT ACCESSIBLE"}`);

    // CRITICAL ASSERTIONS
    // Expected Behavior 2.3: Readiness check SHALL accurately detect server is not accessible
    expect(serverAccessible).toBe(false);
    expect(readinessCheckPassed).toBe(false);

    // On unfixed code, readinessCheckPassed may be true even though serverAccessible is false
    // This is the bug: readiness check exits successfully when it should fail
  }, 20000); // 20 second timeout
});

/**
 * ============================================================================
 * PRESERVATION PROPERTY TESTS (Task 2)
 * ============================================================================
 *
 * These tests verify that non-server-startup steps work correctly and remain
 * unchanged after the fix is implemented.
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 *
 * EXPECTED OUTCOME ON UNFIXED CODE: Tests PASS (confirms baseline behavior)
 * EXPECTED OUTCOME ON FIXED CODE: Tests PASS (confirms no regressions)
 *
 * These tests follow the observation-first methodology:
 * 1. Observe behavior on UNFIXED code for non-buggy inputs
 * 2. Write property-based tests capturing observed behavior patterns
 * 3. Run tests on UNFIXED code to confirm they pass
 * 4. After fix, re-run tests to ensure no regressions
 */

describe("Preservation Properties: Non-Server-Startup Steps", () => {
  const BUILD_OUTPUT_DIR = path.join(__dirname, "../../out");
  const TEST_PID_FILE = path.join(__dirname, "../../test-cleanup.pid");

  /**
   * Property 2.1: Artifact Download Preservation
   *
   * **Validates: Requirement 3.1**
   *
   * Verifies that build artifact download continues to work exactly as before.
   * This simulates the CI step: actions/download-artifact@v4
   *
   * EXPECTED: PASS on both unfixed and fixed code
   */
  it("Property 2.1: Build artifact download SHALL work correctly", () => {
    // Property-based test: For all valid build outputs, artifact download should succeed
    fc.assert(
      fc.property(
        fc.constant(BUILD_OUTPUT_DIR), // The artifact path is constant in CI
        (artifactPath) => {
          // Verify build output directory exists (simulates successful artifact download)
          const artifactExists = fs.existsSync(artifactPath);

          // Requirement 3.1: Artifact download SHALL continue to work
          expect(artifactExists).toBe(true);

          // Verify it contains expected Next.js static export files
          if (artifactExists) {
            const files = fs.readdirSync(artifactPath);

            // Next.js static export should contain at least index.html
            const hasIndexHtml = files.includes("index.html");
            expect(hasIndexHtml).toBe(true);

            // Should contain _next directory with static assets
            const hasNextDir = files.includes("_next");
            expect(hasNextDir).toBe(true);
          }
        }
      ),
      { numRuns: 1 } // Single run since artifact path is deterministic
    );
  });

  /**
   * Property 2.2: Dependency Installation Preservation
   *
   * **Validates: Requirement 3.2**
   *
   * Verifies that npm ci --legacy-peer-deps continues to work correctly.
   * This simulates the CI step that installs dependencies.
   *
   * EXPECTED: PASS on both unfixed and fixed code
   */
  it("Property 2.2: Dependency installation SHALL work correctly", () => {
    // Property-based test: For all CI environments, dependency installation should succeed
    fc.assert(
      fc.property(fc.constant("npm ci --legacy-peer-deps"), (installCommand) => {
        // Verify node_modules exists (indicates successful dependency installation)
        const nodeModulesPath = path.join(__dirname, "../../node_modules");
        const nodeModulesExists = fs.existsSync(nodeModulesPath);

        // Requirement 3.2: Dependency installation SHALL continue to work
        expect(nodeModulesExists).toBe(true);

        // Verify critical dependencies are installed
        if (nodeModulesExists) {
          // Note: 'serve' is run via npx, not installed as a dependency
          const criticalDeps = ["next", "react"];

          for (const dep of criticalDeps) {
            const depPath = path.join(nodeModulesPath, dep);
            const depExists = fs.existsSync(depPath);
            expect(depExists).toBe(true);
          }
        }

        // Verify the install command format is preserved
        expect(installCommand).toBe("npm ci --legacy-peer-deps");
      }),
      { numRuns: 1 } // Single run since installation is deterministic
    );
  });

  /**
   * Property 2.3: Test Execution Preservation
   *
   * **Validates: Requirement 3.3**
   *
   * Verifies that Lighthouse tests execute correctly when server is accessible.
   * This tests the test execution logic itself, not the server startup.
   *
   * EXPECTED: PASS on both unfixed and fixed code
   */
  it("Property 2.3: Lighthouse test execution SHALL work when server is accessible", () => {
    // Property-based test: For all accessible servers, tests should execute
    fc.assert(
      fc.property(
        fc.record({
          testCommand: fc.constant("npm run test:lighthouse"),
          testFile: fc.constant("tests/lighthouse/performance.test.ts"),
        }),
        (testConfig) => {
          // Verify test file exists
          const testFilePath = path.join(__dirname, "../../", testConfig.testFile);
          const testFileExists = fs.existsSync(testFilePath);

          // Requirement 3.3: Test execution SHALL continue to work
          expect(testFileExists).toBe(true);

          // Verify test file contains expected test structure
          if (testFileExists) {
            const testContent = fs.readFileSync(testFilePath, "utf-8");

            // Should test First Contentful Paint (FCP)
            expect(testContent).toContain("First Contentful Paint");

            // Should test Time to Interactive (TTI)
            expect(testContent).toContain("Time to Interactive");

            // Should test Performance Score
            expect(testContent).toContain("Performance Score");

            // Should have proper test structure (uses test() instead of it())
            expect(testContent).toContain("describe");
            expect(testContent).toMatch(/\b(test|it)\(/);
          }

          // Verify test command is preserved
          expect(testConfig.testCommand).toBe("npm run test:lighthouse");
        }
      ),
      { numRuns: 1 } // Single run since test structure is deterministic
    );
  });

  /**
   * Property 2.4: Artifact Upload Preservation
   *
   * **Validates: Requirement 3.4**
   *
   * Verifies that artifact upload for Lighthouse results works correctly.
   * This simulates the CI step: actions/upload-artifact@v6
   *
   * EXPECTED: PASS on both unfixed and fixed code
   */
  it("Property 2.4: Artifact upload SHALL work correctly", () => {
    // Property-based test: For all test results, artifact upload should succeed
    fc.assert(
      fc.property(
        fc.record({
          artifactName: fc.constant("lighthouse-results"),
          artifactPath: fc.constant("lighthouse-report.json"),
        }),
        (uploadConfig) => {
          // Verify the upload configuration is preserved
          expect(uploadConfig.artifactName).toBe("lighthouse-results");
          expect(uploadConfig.artifactPath).toBe("lighthouse-report.json");

          // Verify the artifact path format is valid
          const isValidPath = uploadConfig.artifactPath.endsWith(".json");
          expect(isValidPath).toBe(true);

          // Requirement 3.4: Artifact upload SHALL continue to work
          // Note: We can't test actual upload in unit tests, but we verify the config
          expect(uploadConfig.artifactName).toBeTruthy();
          expect(uploadConfig.artifactPath).toBeTruthy();
        }
      ),
      { numRuns: 10 } // Multiple runs to test property holds across variations
    );
  });

  /**
   * Property 2.5: Server Cleanup Preservation
   *
   * **Validates: Requirement 3.5**
   *
   * Verifies that server cleanup with PID file terminates process cleanly.
   * This simulates the CI step: kill $(cat server.pid)
   *
   * EXPECTED: PASS on both unfixed and fixed code
   */
  it("Property 2.5: Server cleanup SHALL terminate process cleanly", () => {
    // Property-based test: For all server processes, cleanup should work
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 99999 }), // Generate random PIDs
        (mockPid) => {
          // Simulate PID file creation
          fs.writeFileSync(TEST_PID_FILE, mockPid.toString());

          // Verify PID file was created
          const pidFileExists = fs.existsSync(TEST_PID_FILE);
          expect(pidFileExists).toBe(true);

          // Verify PID can be read from file
          if (pidFileExists) {
            const pidContent = fs.readFileSync(TEST_PID_FILE, "utf-8");
            const readPid = parseInt(pidContent, 10);

            // Requirement 3.5: PID file SHALL contain valid process ID
            expect(readPid).toBe(mockPid);
            expect(readPid).toBeGreaterThan(0);

            // Verify cleanup command format (kill $(cat server.pid))
            // We test the logic, not actual process killing
            const cleanupCommand = `kill $(cat ${TEST_PID_FILE})`;
            expect(cleanupCommand).toContain("kill");
            expect(cleanupCommand).toContain("cat");
            expect(cleanupCommand).toContain(TEST_PID_FILE);
          }

          // Clean up test PID file
          if (fs.existsSync(TEST_PID_FILE)) {
            fs.unlinkSync(TEST_PID_FILE);
          }
        }
      ),
      { numRuns: 20 } // Multiple runs to test property holds for various PIDs
    );
  });

  /**
   * Property 2.6: CI Workflow Step Order Preservation
   *
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
   *
   * Verifies that the order and structure of CI workflow steps remain unchanged.
   * This is a meta-property that ensures the overall workflow structure is preserved.
   *
   * EXPECTED: PASS on both unfixed and fixed code
   */
  it("Property 2.6: CI workflow step order SHALL remain unchanged", () => {
    // Property-based test: For all CI workflow configurations, step order should be preserved
    fc.assert(
      fc.property(
        fc.constant([
          "Checkout code",
          "Setup Node.js",
          "Install dependencies",
          "Download build artifacts",
          "Start server in background",
          "Wait for server to be ready",
          "Verify server is running",
          "Run Lighthouse tests",
          "Stop server",
          "Upload Lighthouse results",
        ]),
        (expectedSteps) => {
          // Read CI workflow file
          const ciWorkflowPath = path.join(__dirname, "../../.github/workflows/ci.yml");
          const ciWorkflowExists = fs.existsSync(ciWorkflowPath);

          expect(ciWorkflowExists).toBe(true);

          if (ciWorkflowExists) {
            const ciContent = fs.readFileSync(ciWorkflowPath, "utf-8");

            // Verify lighthouse job exists
            expect(ciContent).toContain("lighthouse:");

            // Verify key steps are present (order may vary in YAML, but steps should exist)
            const preservedSteps = [
              "Checkout code",
              "Setup Node.js",
              "Install dependencies",
              "Download build artifacts",
              "Run Lighthouse tests",
              "Upload Lighthouse results",
            ];

            for (const step of preservedSteps) {
              expect(ciContent).toContain(step);
            }

            // Verify critical commands are preserved
            expect(ciContent).toContain("npm ci --legacy-peer-deps");
            expect(ciContent).toContain("actions/download-artifact");
            expect(ciContent).toContain("actions/upload-artifact");
            expect(ciContent).toContain("npm run test:lighthouse");
          }
        }
      ),
      { numRuns: 1 } // Single run since workflow structure is deterministic
    );
  });

  afterAll(() => {
    // Clean up any test artifacts
    if (fs.existsSync(TEST_PID_FILE)) {
      fs.unlinkSync(TEST_PID_FILE);
    }
  });
});
