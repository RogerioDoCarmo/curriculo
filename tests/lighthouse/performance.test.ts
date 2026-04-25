/* eslint-disable no-console */
/**
 * Lighthouse Performance Tests
 *
 * **Validates: Requirements 6.1, 6.2, 6.5**
 *
 * These tests verify that the website meets performance requirements:
 * - First Contentful Paint (FCP) < 1.5s
 * - Time to Interactive (TTI) < 3s
 * - Lighthouse Performance Score >= 90
 *
 * Tests run against the production build (out/ directory) served locally.
 *
 * CRITICAL: These tests MUST run against the production build, NOT the dev server.
 * - Production build: npm run build && npm run serve (TTI ~2.4s, Score ~98)
 * - Dev server: npm run dev (TTI ~11s, Score ~43) - TESTS WILL FAIL
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("Lighthouse Performance Audits", () => {
  const lighthouseReportPath = path.join(__dirname, "../../lighthouse-report.json");
  const testUrl = process.env.LIGHTHOUSE_URL || "http://localhost:3000";

  // Run Lighthouse audit once before all tests
  beforeAll(() => {
    console.log(`Running Lighthouse audit on ${testUrl}...`);

    try {
      // Run Lighthouse CLI with performance-focused settings
      execSync(
        `npx lighthouse ${testUrl} ` +
          `--output=json ` +
          `--output-path=${lighthouseReportPath} ` +
          `--only-categories=performance ` +
          `--chrome-flags="--headless --no-sandbox --disable-gpu" ` +
          `--quiet`,
        {
          stdio: "inherit",
          timeout: 60000, // 60 second timeout
        }
      );

      console.log("Lighthouse audit completed successfully");
    } catch (error) {
      console.error("Lighthouse audit failed:", error);
      throw error;
    }
  });

  // Clean up report file after tests
  afterAll(() => {
    if (fs.existsSync(lighthouseReportPath)) {
      fs.unlinkSync(lighthouseReportPath);
    }
  });

  test("First Contentful Paint should be less than 1.5 seconds", () => {
    const report = JSON.parse(fs.readFileSync(lighthouseReportPath, "utf-8"));
    const fcpAudit = report.audits["first-contentful-paint"];

    expect(fcpAudit).toBeDefined();

    const fcpValue = fcpAudit.numericValue / 1000; // Convert ms to seconds
    const fcpThreshold = 1.5;

    console.log(`First Contentful Paint: ${fcpValue.toFixed(2)}s`);

    expect(fcpValue).toBeLessThan(fcpThreshold);
  });

  test("Time to Interactive should be less than 3 seconds", () => {
    const report = JSON.parse(fs.readFileSync(lighthouseReportPath, "utf-8"));
    const ttiAudit = report.audits["interactive"];

    expect(ttiAudit).toBeDefined();

    const ttiValue = ttiAudit.numericValue / 1000; // Convert ms to seconds
    const ttiThreshold = 3;

    console.log(`Time to Interactive: ${ttiValue.toFixed(2)}s`);

    expect(ttiValue).toBeLessThan(ttiThreshold);
  });

  test("Performance score should be at least 90", () => {
    const report = JSON.parse(fs.readFileSync(lighthouseReportPath, "utf-8"));
    const performanceScore = report.categories.performance.score * 100;

    console.log(`Performance Score: ${performanceScore}`);

    expect(performanceScore).toBeGreaterThanOrEqual(90);
  });

  test("should provide detailed performance metrics", () => {
    const report = JSON.parse(fs.readFileSync(lighthouseReportPath, "utf-8"));

    // Log additional performance metrics for visibility
    const metrics = {
      "First Contentful Paint": report.audits["first-contentful-paint"].displayValue,
      "Speed Index": report.audits["speed-index"].displayValue,
      "Largest Contentful Paint": report.audits["largest-contentful-paint"].displayValue,
      "Time to Interactive": report.audits["interactive"].displayValue,
      "Total Blocking Time": report.audits["total-blocking-time"].displayValue,
      "Cumulative Layout Shift": report.audits["cumulative-layout-shift"].displayValue,
    };

    console.log("\n=== Performance Metrics ===");
    Object.entries(metrics).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log("===========================\n");

    // This test always passes but provides visibility into all metrics
    expect(metrics).toBeDefined();
  });
});
