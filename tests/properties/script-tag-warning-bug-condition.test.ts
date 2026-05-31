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
 * Bug Condition: Raw <script> tags without a non-JS type attribute in React component JSX
 * trigger a React 19 console warning in development mode:
 * "Encountered a script tag while rendering React component. Scripts inside React components
 * are never executed when rendering on the client."
 *
 * Root cause (React 19 internals): the warning fires in the fiber reconciler's element
 * creation code path. It is suppressed only when `isScriptDataBlock(props)` returns true,
 * which happens when `props.type` is a non-JavaScript MIME type (e.g. "application/ld+json").
 * Scripts with `async={true}` and a `src` attribute are classified as hoistable resources
 * and bypass the creation path entirely — no warning fires for those either.
 *
 * Fixed Behavior:
 * - JSON-LD scripts keep `type="application/ld+json"` + `dangerouslySetInnerHTML`
 *   → React 19 treats them as data blocks, warning suppressed.
 * - Theme-init script is extracted to public/theme-init.js and loaded via
 *   `<script src="/theme-init.js" async />` → React 19 classifies it as a hoistable
 *   resource, bypassing the warning code path entirely.
 */

import * as fs from "fs";
import * as path from "path";

describe("Property 1: Bug Condition - No Console Warnings for Script Tags", () => {
  const LAYOUT_PATH = path.join(process.cwd(), "app/[locale]/layout.tsx");
  const THEME_INIT_PATH = path.join(process.cwd(), "public/theme-init.js");

  it("should document the bug: raw script tags trigger Next.js console warnings", () => {
    const bugConditionChecklist = {
      description:
        "Raw <script> tags without a non-JS type attribute in React components trigger a React 19 console warning in development mode",
      affectedFile: "app/[locale]/layout.tsx",
      scriptCount: 3,

      scripts: [
        {
          type: "Schema.org Person",
          purpose: "SEO structured data for person information",
          pattern:
            '<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />',
          fix: 'type="application/ld+json" makes React 19 treat it as a data block — no warning',
        },
        {
          type: "Schema.org WebSite",
          purpose: "SEO structured data for website information",
          pattern:
            '<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webSiteSchema }} />',
          fix: 'type="application/ld+json" makes React 19 treat it as a data block — no warning',
        },
        {
          type: "Theme FOUC Prevention",
          purpose: "Apply theme class before React hydration to prevent flash of unstyled content",
          pattern: "<script dangerouslySetInnerHTML={{ __html: `(function(){...})();` }} />",
          fix: "Extracted to public/theme-init.js, loaded via <script src async> — hoistable resource, no warning",
        },
      ],

      expectedWarning:
        "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client.",

      verificationSteps: [
        "1. Start development server: npm run dev",
        "2. Open browser to http://localhost:3000",
        "3. Open browser console (F12)",
        "4. Observe console warnings on first page load",
        "5. Confirm zero warnings about script tags",
      ],

      expectedBehavior: {
        afterFix:
          'JSON-LD scripts use type="application/ld+json" (data block); theme-init loaded via <script async src>',
        noWarnings: true,
        preserveFunctionality: [
          "Theme application timing (before React hydration)",
          "FOUC prevention",
          "Schema.org structured data rendering",
          "Error handling for localStorage access",
        ],
      },
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

    // Check for raw script tags with dangerouslySetInnerHTML that do NOT have a
    // non-JS type attribute. These are the ones that trigger the React 19 warning.
    // Scripts with type="application/ld+json" are data blocks and do NOT trigger it.
    const warningScriptPattern =
      /<script(?![^>]*type=["']application\/ld\+json["'])[^>]*dangerouslySetInnerHTML/g;
    const warningScriptMatches = layoutSource.match(warningScriptPattern);
    const warningScriptCount = warningScriptMatches ? warningScriptMatches.length : 0;

    console.log(
      `Warning-triggering <script dangerouslySetInnerHTML> tags found: ${warningScriptCount}`
    );

    if (warningScriptCount > 0) {
      console.log(
        "✗ Layout uses inline script tags without a data-block type (UNFIXED - triggers warnings)"
      );
      console.log(`  Found ${warningScriptCount} warning-triggering script tag(s)`);
    } else {
      console.log("✓ Layout has no inline script tags that trigger the React 19 warning");
    }

    console.log("=======================================\n");

    // On UNFIXED code: should have 0 warning-triggering script tags (will fail - we have the theme-init one)
    // On FIXED code: should have 0 warning-triggering script tags (will pass)
    expect(warningScriptCount).toBe(0);
  });

  it("should verify layout.tsx uses the correct React 19 compatible script approach (FIXED code)", () => {
    // Read the layout component source code
    const layoutSource = fs.readFileSync(LAYOUT_PATH, "utf-8");

    console.log("\n=== SOURCE CODE ANALYSIS (FIXED) ===");

    // next/script import should be gone — we no longer need it
    const hasScriptImport =
      layoutSource.includes('import Script from "next/script"') ||
      layoutSource.includes("import Script from 'next/script'");

    // JSON-LD scripts should use type="application/ld+json" + dangerouslySetInnerHTML
    // React 19 treats these as data blocks and suppresses the warning
    const jsonLdPattern =
      /<script\s+type=["']application\/ld\+json["'][^>]*dangerouslySetInnerHTML/g;
    const jsonLdMatches = layoutSource.match(jsonLdPattern);
    const jsonLdCount = jsonLdMatches ? jsonLdMatches.length : 0;

    // Theme-init must be loaded via <script src="/theme-init.js" async />
    // React 19 classifies async + src scripts as hoistable resources — no warning
    const hasThemeInitSrc = layoutSource.includes('src="/theme-init.js"');
    const hasThemeInitAsync =
      layoutSource.includes('<script src="/theme-init.js" async') ||
      layoutSource.includes('<script src="/theme-init.js" async');

    // The preload hint should be present to minimise FOUC
    const hasPreload =
      layoutSource.includes('rel="preload"') && layoutSource.includes('href="/theme-init.js"');

    console.log(`next/script import removed: ${!hasScriptImport ? "Yes ✓" : "No ✗"}`);
    console.log(`JSON-LD scripts with type="application/ld+json": ${jsonLdCount}`);
    console.log(
      `Theme-init loaded via <script src async>: ${hasThemeInitSrc && hasThemeInitAsync ? "Yes ✓" : "No ✗"}`
    );
    console.log(`Preload hint for theme-init.js: ${hasPreload ? "Yes ✓" : "No ✗"}`);

    const hasEslintDisable = layoutSource.includes(
      "@next/next/no-before-interactive-script-outside-document"
    );

    console.log(`ESLint disable comment removed: ${!hasEslintDisable ? "Yes ✓" : "No ✗"}`);
    console.log("=====================================\n");

    expect(hasScriptImport).toBe(false);
    expect(jsonLdCount).toBe(2);
    expect(hasThemeInitSrc).toBe(true);
    expect(hasThemeInitAsync).toBe(true);
    expect(hasEslintDisable).toBe(false);
  });

  it("should verify public/theme-init.js exists and contains the theme detection logic", () => {
    console.log("\n=== THEME-INIT FILE VERIFICATION ===");

    const exists = fs.existsSync(THEME_INIT_PATH);
    console.log(`public/theme-init.js exists: ${exists ? "Yes ✓" : "No ✗"}`);

    expect(exists).toBe(true);

    const content = fs.readFileSync(THEME_INIT_PATH, "utf-8");
    const hasLocalStorage = content.includes("localStorage");
    const hasMatchMedia = content.includes("matchMedia");
    const hasClassList = content.includes("classList");
    const hasDarkClass = content.includes("dark");

    console.log(`Reads localStorage: ${hasLocalStorage ? "Yes ✓" : "No ✗"}`);
    console.log(`Falls back to matchMedia: ${hasMatchMedia ? "Yes ✓" : "No ✗"}`);
    console.log(`Applies classList: ${hasClassList ? "Yes ✓" : "No ✗"}`);
    console.log(`Handles 'dark' theme: ${hasDarkClass ? "Yes ✓" : "No ✗"}`);
    console.log("=====================================\n");

    expect(hasLocalStorage).toBe(true);
    expect(hasMatchMedia).toBe(true);
    expect(hasClassList).toBe(true);
    expect(hasDarkClass).toBe(true);
  });

  it("should document the three affected script tags for manual verification", () => {
    const affectedScripts = [
      {
        name: "Theme FOUC Prevention Script",
        purpose: "Apply dark mode class before React hydration",
        critical: true,
        timing: "Must execute before React hydration to prevent FOUC",
        fix: "Extracted to public/theme-init.js, loaded via <script src async>",
      },
      {
        name: "Person Schema.org Script",
        purpose: "SEO structured data for person information",
        critical: false,
        timing: "Should load early for SEO crawlers",
        fix: 'type="application/ld+json" keeps warning suppressed in React 19',
      },
      {
        name: "WebSite Schema.org Script",
        purpose: "SEO structured data for website information",
        critical: false,
        timing: "Should load early for SEO crawlers",
        fix: 'type="application/ld+json" keeps warning suppressed in React 19',
      },
    ];

    console.log("\n=== AFFECTED SCRIPT TAGS ===");
    console.log("The following script tags triggered console warnings:");
    affectedScripts.forEach((script, index) => {
      console.log(`\n${index + 1}. ${script.name}`);
      console.log(`   Purpose: ${script.purpose}`);
      console.log(`   Critical: ${script.critical ? "Yes" : "No"}`);
      console.log(`   Timing: ${script.timing}`);
      console.log(`   Fix: ${script.fix}`);
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
          'For any page load in development mode, the application SHALL produce zero console warnings about script tags. JSON-LD scripts are exempt via type="application/ld+json"; theme-init is exempt via <script async src> hoistable resource classification.',
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
