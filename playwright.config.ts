import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Testing Configuration
 *
 * This configuration sets up end-to-end testing with multiple browsers
 * and device emulations to ensure cross-browser compatibility.
 *
 * Test projects:
 * - Desktop: Chromium, Firefox, WebKit
 * - Mobile: Chrome (Android), Safari (iOS)
 */

export default defineConfig({
  // Test directory
  testDir: "./tests/e2e",

  // Maximum time one test can run for
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, // Reduced from 2 to 1
  workers: process.env.CI ? 2 : undefined, // Increased from 1 to 2 for parallel execution

  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
    ...(process.env.CI ? [["github", {}] as const] : []),
  ],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",

    // Collect trace on first retry
    trace: "on-first-retry",

    // Screenshot on failure only
    screenshot: "only-on-failure",

    // Video on failure only
    video: "retain-on-failure",

    // Faster navigation timeout
    navigationTimeout: 15 * 1000, // 15s instead of default 30s

    // Faster action timeout
    actionTimeout: 10 * 1000, // 10s instead of default 30s
  },

  // Test projects for different browsers and devices
  // In CI: Run only Chromium for PRs, full matrix for main/develop
  // Locally: Run all browsers
  projects:
    process.env.CI && process.env.GITHUB_EVENT_NAME === "pull_request"
      ? [
          // PR builds: Chromium only for speed
          {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
          },
        ]
      : [
          // Main/develop builds and local: Full browser matrix
          {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
          },
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
          },
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
          },
          {
            name: "mobile-chrome",
            use: { ...devices["Pixel 5"] },
          },
          {
            name: "mobile-safari",
            use: { ...devices["iPhone 12"] },
          },
        ],

  // Web server configuration for local development
  webServer: {
    command: "npm run build && npx serve@latest out -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
