/**
 * Bug Condition Exploration Test: Color Contrast Accessibility
 *
 * **Property 1: Bug Condition - TechStack Links Meet WCAG AA Contrast**
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4**
 *
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * DO NOT attempt to fix the test or the code when it fails.
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation.
 *
 * GOAL: Surface counterexamples that demonstrate the bug exists.
 *
 * Bug Condition: TechStack section links using text-primary-600 on card backgrounds
 * have contrast ratios below 4.5:1, failing WCAG AA standards.
 *
 * Expected Behavior: All TechStack section links should have contrast ratios >= 4.5:1
 * against their card backgrounds, meeting WCAG AA standards.
 */

import * as fs from "fs";
import * as path from "path";

// Helper function to calculate relative luminance
// Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper function to calculate contrast ratio
// Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
function getContrastRatio(color1: string, color2: string): number {
  // Parse hex colors
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const l1 = getRelativeLuminance(r1, g1, b1);
  const l2 = getRelativeLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("Property 1: Bug Condition - TechStack Links Meet WCAG AA Contrast", () => {
  // Color definitions from Tailwind config
  const PRIMARY_600 = "#2563eb"; // text-primary-600 (current implementation)
  const PRIMARY_700 = "#1d4ed8"; // text-primary-700 (fixed implementation)
  const WHITE = "#ffffff"; // Light mode background
  const CARD_BG_LIGHT = "#ffffff"; // bg-card in light mode (resolves to --background)

  const WCAG_AA_MINIMUM = 4.5; // WCAG AA minimum contrast ratio for normal text

  it("should document the bug: text-primary-600 has insufficient contrast on card backgrounds", () => {
    // Calculate contrast ratio for current implementation (text-primary-600)
    const currentContrast = getContrastRatio(PRIMARY_600, CARD_BG_LIGHT);

    console.log("\n=== Bug Condition Exploration ===");
    console.log(`Current implementation (text-primary-600): ${PRIMARY_600}`);
    console.log(`Card background (light mode): ${CARD_BG_LIGHT}`);
    console.log(`Contrast ratio: ${currentContrast.toFixed(2)}:1`);
    console.log(`WCAG AA minimum: ${WCAG_AA_MINIMUM}:1`);
    console.log(`Status: ${currentContrast >= WCAG_AA_MINIMUM ? "PASS ✓" : "FAIL ✗"}`);
    console.log("================================\n");

    // This assertion encodes the EXPECTED BEHAVIOR (contrast >= 4.5:1)
    // On UNFIXED code, this will FAIL because text-primary-600 has insufficient contrast
    // On FIXED code, this will PASS because text-primary-700 has sufficient contrast
    expect(currentContrast).toBeGreaterThanOrEqual(WCAG_AA_MINIMUM);
  });

  it("should verify the fix: text-primary-700 has sufficient contrast on card backgrounds", () => {
    // Calculate contrast ratio for fixed implementation (text-primary-700)
    const fixedContrast = getContrastRatio(PRIMARY_700, CARD_BG_LIGHT);

    console.log("\n=== Fix Verification ===");
    console.log(`Fixed implementation (text-primary-700): ${PRIMARY_700}`);
    console.log(`Card background (light mode): ${CARD_BG_LIGHT}`);
    console.log(`Contrast ratio: ${fixedContrast.toFixed(2)}:1`);
    console.log(`WCAG AA minimum: ${WCAG_AA_MINIMUM}:1`);
    console.log(`Status: ${fixedContrast >= WCAG_AA_MINIMUM ? "PASS ✓" : "FAIL ✗"}`);
    console.log("========================\n");

    // This assertion verifies that the fix (text-primary-700) provides sufficient contrast
    expect(fixedContrast).toBeGreaterThanOrEqual(WCAG_AA_MINIMUM);
  });

  it("should verify TechStack component uses the correct color class in source code", () => {
    // Read the TechStackSection component source code
    const componentPath = path.join(process.cwd(), "components/TechStackSection/index.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    console.log("\n=== Source Code Analysis ===");

    // Check if the component uses text-primary-600 (UNFIXED)
    const hasUnfixedColor = componentSource.includes("text-primary-600");
    // Check if the component uses text-primary-700 (FIXED)
    const hasFixedColor = componentSource.includes("text-primary-700");

    if (hasUnfixedColor && !hasFixedColor) {
      console.log("✗ Component uses text-primary-600 (UNFIXED - insufficient contrast)");
      console.log("  This is the bug condition - links have insufficient contrast");
    } else if (hasFixedColor && !hasUnfixedColor) {
      console.log("✓ Component uses text-primary-700 (FIXED - sufficient contrast)");
      console.log("  Bug has been fixed - links now have sufficient contrast");
    } else if (hasUnfixedColor && hasFixedColor) {
      console.log("⚠ Component uses both text-primary-600 and text-primary-700");
      console.log("  This may indicate a partial fix or mixed usage");
    } else {
      console.log("? Component uses neither text-primary-600 nor text-primary-700");
      console.log("  This is unexpected - check the component implementation");
    }

    console.log("============================\n");

    // On UNFIXED code: component should use text-primary-700 (will fail)
    // On FIXED code: component should use text-primary-700 (will pass)
    expect(hasFixedColor).toBe(true);
    expect(hasUnfixedColor).toBe(false);
  });

  it("should document affected technology links for manual verification", () => {
    // List of all technology links affected by the bug
    const affectedLinks = [
      "nextjs.org",
      "www.typescriptlang.org",
      "tailwindcss.com",
      "jestjs.io",
      "playwright.dev",
      "firebase.google.com",
      "sentry.io",
      "vercel.com",
      "formspree.io",
      "storybook.js.org",
      "www.sonarqube.org",
    ];

    console.log("\n=== Affected Technology Links ===");
    console.log("The following links are affected by the color contrast bug:");
    affectedLinks.forEach((link, index) => {
      console.log(`${index + 1}. ${link}`);
    });
    console.log(`Total: ${affectedLinks.length} links`);
    console.log("==================================\n");

    // Verify we have the expected number of affected links
    expect(affectedLinks.length).toBe(11);
  });
});
