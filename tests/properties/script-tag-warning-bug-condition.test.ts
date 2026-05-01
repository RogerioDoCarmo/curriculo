/**
 * Bug Condition Exploration Test: Next.js Script Tag Warning
 *
 * **Property 1: Bug Condition - No Console Warnings for Script Tags**
 *
 * **Validates: Requirements 1.1, 1.2, 2.1, 2.2**
 *
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
 * DO NOT attempt to fix the test or the code when it fails.
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation.
 *
 * GOAL: Surface counterexamples that demonstrate the console warning exists.
 *
 * Bug Condition: Raw <script> tags in React component JSX trigger Next.js 16.2.4
 * console warnings in development mode: "Encountered a script tag while rendering
 * React component. Scripts inside React components are never executed when rendering
 * on the client."
 *
 * Expected Behavior: No console warnings about script tags when using next/script
 * component with appropriate strategies.
 */

import * as fs from "fs";
import * as path from "path";

describe("Property 1: Bug Condition - No Console Warnings for Script Tags", () => {
  const LAYOUT_PATH = path.join(process.cwd(), "app/[locale]/layout.tsx");

  it("should document the bug: raw script tags trigger Next.js console warnings", () => {
    const bugConditionChecklist = {
      description:
        "Raw <script> tags in React components trigger Next.js 16.2.4 console warnings in development mode",
      affectedFile: "app/[locale]/layout.tsx",
      affectedLines: [189, 192, 196],
      scriptCount: 3,

      scripts: [
        {
          line: 189,
          type: "Schema.org Person",
          purpose: "SEO structured data for person information",
          pattern:
            '<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />',
        },
        {
          line: 192,
          type: "Schema.org WebSite",
          purpose: "SEO structured data for website information",
          pattern:
            '<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webSiteSchema }} />',
        },
        {
          line: 196,
          type: "Theme FOUC Prevention",
          purpose: "Apply theme class before React hydration to prevent flash of unstyled content",
          pattern: "<script dangerouslySetInnerHTML={{ __html: `(function(){...})();` }} />",
        },
      ],

      expectedWarning:
        "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client.",

      verificationSteps: [
        "1. Start development server: npm run dev",
        "2. Open browser to http://localhost:3000",
        "3. Open browser console (F12)",
        "4. Observe console warnings on first page load",
        "5. Count warnings - should be 3 (one per script tag)",
      ],

      expectedBehavior: {
        afterFix: "Use next/script component with beforeInteractive strategy",
        noWarnings: true,
        preserveFunctionality: [
          "Theme application timing (before React hydration)",
          "FOUC prevention",
          "Schema.org structured data rendering",
          "Error handling for localStorage access",
        ],
      },

      counterexamples: [
        "BEFORE FIX: Console warning appears for theme script (line 196)",
        "BEFORE FIX: Console warning appears for Person schema script (line 189)",
        "BEFORE FIX: Console warning appears for WebSite schema script (line 192)",
        "BEFORE FIX: Total of 3 console warnings on first page load",
        "BEFORE FIX: ESLint disable comment needed (line 195)",
      ],
    };

    console.log("\n=== BUG CONDITION DOCUMENTATION ===");
    console.log(JSON.stringify(bugConditionChecklist, null, 2));
    console.log("====================================\n");

    // Document the bug condition
    expect(bugConditionChecklist.scriptCount).toBe(3);
    expect(bugConditionChecklist.scripts.length).toBe(3);
    expect(bugConditionChecklist.expectedBehavior.noWarnings).toBe(true);
  });

  it("should verify layout.tsx contains raw script tags (UNFIXED code)", () => {
    // Read the layout component source code
    const layoutSource = fs.readFileSync(LAYOUT_PATH, "utf-8");

    console.log("\n=== SOURCE CODE ANALYSIS (UNFIXED) ===");

    // Check for raw script tags with dangerouslySetInnerHTML
    const rawScriptPattern = /<script[^>]*dangerouslySetInnerHTML/g;
    const rawScriptMatches = layoutSource.match(rawScriptPattern);
    const rawScriptCount = rawScriptMatches ? rawScriptMatches.length : 0;

    console.log(`Raw <script> tags found: ${rawScriptCount}`);

    if (rawScriptCount > 0) {
      console.log("✗ Layout uses raw <script> tags (UNFIXED - triggers warnings)");
      console.log("  This is the bug condition - script tags trigger console warnings");
      console.log(`  Found ${rawScriptCount} raw script tag(s)`);
    } else {
      console.log("✓ Layout does not use raw <script> tags");
      console.log("  Bug may already be fixed or code structure changed");
    }

    // Check for ESLint disable comment (indicates awareness of the issue)
    const hasEslintDisable = layoutSource.includes(
      "@next/next/no-before-interactive-script-outside-document"
    );

    if (hasEslintDisable) {
      console.log("⚠ ESLint disable comment present (line 195)");
      console.log("  This confirms the issue was known but not properly fixed");
    }

    console.log("=======================================\n");

    // On UNFIXED code: should have 0 raw script tags (will fail - we have 3)
    // On FIXED code: should have 0 raw script tags (will pass)
    expect(rawScriptCount).toBe(0);
  });

  it("should verify layout.tsx uses next/script component (FIXED code)", () => {
    // Read the layout component source code
    const layoutSource = fs.readFileSync(LAYOUT_PATH, "utf-8");

    console.log("\n=== SOURCE CODE ANALYSIS (FIXED) ===");

    // Check for next/script import
    const hasScriptImport =
      layoutSource.includes('import Script from "next/script"') ||
      layoutSource.includes("import Script from 'next/script'") ||
      layoutSource.includes('import { Script } from "next/script"');

    // Check for Script component usage with beforeInteractive strategy
    const scriptComponentPattern = /<Script[^>]*strategy=["']beforeInteractive["']/g;
    const scriptComponentMatches = layoutSource.match(scriptComponentPattern);
    const scriptComponentCount = scriptComponentMatches ? scriptComponentMatches.length : 0;

    console.log(`next/script import present: ${hasScriptImport ? "Yes ✓" : "No ✗"}`);
    console.log(`<Script> components with beforeInteractive: ${scriptComponentCount}`);

    if (hasScriptImport && scriptComponentCount === 3) {
      console.log("✓ Layout uses next/script component (FIXED - no warnings)");
      console.log("  Bug has been fixed - using proper Next.js Script component");
      console.log(
        `  Found ${scriptComponentCount} Script component(s) with beforeInteractive strategy`
      );
    } else if (hasScriptImport && scriptComponentCount > 0) {
      console.log("⚠ Partial fix detected");
      console.log(`  Expected 3 Script components, found ${scriptComponentCount}`);
    } else {
      console.log("✗ Layout does not use next/script component (UNFIXED)");
      console.log("  Bug has not been fixed yet");
    }

    // Check that ESLint disable comment is removed
    const hasEslintDisable = layoutSource.includes(
      "@next/next/no-before-interactive-script-outside-document"
    );

    if (!hasEslintDisable) {
      console.log("✓ ESLint disable comment removed");
    } else {
      console.log("✗ ESLint disable comment still present (should be removed after fix)");
    }

    console.log("=====================================\n");

    // On UNFIXED code: should have Script import and 3 Script components (will fail)
    // On FIXED code: should have Script import and 3 Script components (will pass)
    expect(hasScriptImport).toBe(true);
    expect(scriptComponentCount).toBe(3);
    expect(hasEslintDisable).toBe(false);
  });

  it("should document the three affected script tags for manual verification", () => {
    const affectedScripts = [
      {
        name: "Theme FOUC Prevention Script",
        currentLine: 196,
        purpose: "Apply dark mode class before React hydration",
        critical: true,
        timing: "Must execute before React hydration to prevent FOUC",
      },
      {
        name: "Person Schema.org Script",
        currentLine: 189,
        purpose: "SEO structured data for person information",
        critical: false,
        timing: "Should load early for SEO crawlers",
      },
      {
        name: "WebSite Schema.org Script",
        currentLine: 192,
        purpose: "SEO structured data for website information",
        critical: false,
        timing: "Should load early for SEO crawlers",
      },
    ];

    console.log("\n=== AFFECTED SCRIPT TAGS ===");
    console.log("The following script tags trigger console warnings:");
    affectedScripts.forEach((script, index) => {
      console.log(`\n${index + 1}. ${script.name}`);
      console.log(`   Line: ${script.currentLine}`);
      console.log(`   Purpose: ${script.purpose}`);
      console.log(`   Critical: ${script.critical ? "Yes" : "No"}`);
      console.log(`   Timing: ${script.timing}`);
    });
    console.log(`\nTotal: ${affectedScripts.length} script tags`);
    console.log("=============================\n");

    // Verify we have the expected number of affected scripts
    expect(affectedScripts.length).toBe(3);
    expect(affectedScripts.filter((s) => s.critical).length).toBe(1);
  });

  it("should verify the expected behavior properties are documented", () => {
    const expectedBehaviorProperties = {
      property1: {
        name: "Bug Condition - No Console Warnings",
        description:
          "For any page load in Next.js 16.2.4 development mode, the application SHALL use next/script component, resulting in zero console warnings about script tags",
        validates: ["Requirements 2.1", "Requirements 2.2"],
      },
      property2: {
        name: "Preservation - Theme Application and FOUC Prevention",
        description:
          "For any page load, the fixed implementation SHALL apply the theme class before React hydration with the same timing and behavior as the original inline script",
        validates: [
          "Requirements 3.1",
          "Requirements 3.2",
          "Requirements 3.3",
          "Requirements 3.4",
          "Requirements 3.5",
        ],
      },
    };

    console.log("\n=== EXPECTED BEHAVIOR PROPERTIES ===");
    console.log(JSON.stringify(expectedBehaviorProperties, null, 2));
    console.log("=====================================\n");

    // Verify properties are well-defined
    expect(expectedBehaviorProperties.property1.validates.length).toBeGreaterThan(0);
    expect(expectedBehaviorProperties.property2.validates.length).toBeGreaterThan(0);
  });
});
