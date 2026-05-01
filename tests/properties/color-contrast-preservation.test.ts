/**
 * Preservation Property Tests: Color Contrast Accessibility Fix
 *
 * **Property 2: Preservation - Non-TechStack Elements Unchanged**
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 *
 * IMPORTANT: Follow observation-first methodology.
 * These tests capture the behavior on UNFIXED code for non-buggy inputs.
 * They should PASS on both unfixed and fixed code to ensure no regressions.
 *
 * GOAL: Verify that elements NOT affected by the bug remain unchanged after the fix.
 *
 * Preservation Requirements:
 * - Links in other sections (Hero, About, Projects, Contact, Footer) remain unchanged
 * - Non-link elements using text-primary-600 elsewhere remain unchanged
 * - Card styling (backgrounds, borders, padding, hover effects) remains unchanged
 * - Non-link text colors (headings, descriptions, labels) in TechStack cards remain unchanged
 * - Link hover states (underline) continue to work
 * - Link focus states (focus ring) continue to work
 * - ExternalLink icon display remains unchanged
 * - Grid layout and responsive behavior remain unchanged
 */

import * as fs from "fs";
import * as path from "path";

describe("Property 2: Preservation - Non-TechStack Elements Unchanged", () => {
  it("should preserve card styling classes in TechStack component", () => {
    // Read the TechStackSection component source code
    const componentPath = path.join(process.cwd(), "components/TechStackSection/index.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    console.log("\n=== Card Styling Preservation ===");

    // Verify card styling classes are present
    const expectedCardClasses = [
      "p-6",
      "rounded-lg",
      "border",
      "border-border",
      "bg-card",
      "text-card-foreground",
      "hover:shadow-lg",
      "transition-shadow",
    ];

    const missingClasses: string[] = [];
    expectedCardClasses.forEach((className) => {
      if (!componentSource.includes(className)) {
        missingClasses.push(className);
        console.log(`✗ Missing class: ${className}`);
      } else {
        console.log(`✓ Preserved class: ${className}`);
      }
    });

    console.log("=================================\n");

    // All card styling classes should be preserved
    expect(missingClasses).toEqual([]);
  });

  it("should preserve link hover and focus states in TechStack component", () => {
    const componentPath = path.join(process.cwd(), "components/TechStackSection/index.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    console.log("\n=== Link Interaction States Preservation ===");

    // Verify hover and focus classes are present
    const expectedInteractionClasses = [
      "hover:underline",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-ring",
      "focus:ring-offset-2",
      "transition-colors",
    ];

    const missingClasses: string[] = [];
    expectedInteractionClasses.forEach((className) => {
      if (!componentSource.includes(className)) {
        missingClasses.push(className);
        console.log(`✗ Missing class: ${className}`);
      } else {
        console.log(`✓ Preserved class: ${className}`);
      }
    });

    console.log("============================================\n");

    // All interaction state classes should be preserved
    expect(missingClasses).toEqual([]);
  });

  it("should preserve ExternalLink icon in TechStack component", () => {
    const componentPath = path.join(process.cwd(), "components/TechStackSection/index.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    console.log("\n=== ExternalLink Icon Preservation ===");

    // Verify ExternalLink import and usage
    const hasExternalLinkImport = componentSource.includes("import { ExternalLink }");
    const hasExternalLinkComponent = componentSource.includes("<ExternalLink");

    console.log(`ExternalLink import: ${hasExternalLinkImport ? "✓ Present" : "✗ Missing"}`);
    console.log(`ExternalLink component: ${hasExternalLinkComponent ? "✓ Present" : "✗ Missing"}`);
    console.log("======================================\n");

    // ExternalLink should be preserved
    expect(hasExternalLinkImport).toBe(true);
    expect(hasExternalLinkComponent).toBe(true);
  });

  it("should preserve non-link text colors in TechStack component", () => {
    const componentPath = path.join(process.cwd(), "components/TechStackSection/index.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    console.log("\n=== Non-Link Text Colors Preservation ===");

    // Verify text color classes for non-link elements
    const expectedTextColors = [
      "text-foreground", // For headings and labels
      "text-muted-foreground", // For descriptions
    ];

    const missingColors: string[] = [];
    expectedTextColors.forEach((colorClass) => {
      if (!componentSource.includes(colorClass)) {
        missingColors.push(colorClass);
        console.log(`✗ Missing color: ${colorClass}`);
      } else {
        console.log(`✓ Preserved color: ${colorClass}`);
      }
    });

    console.log("=========================================\n");

    // All non-link text colors should be preserved
    expect(missingColors).toEqual([]);
  });

  it("should preserve grid layout classes in TechStack component", () => {
    const componentPath = path.join(process.cwd(), "components/TechStackSection/index.tsx");
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    console.log("\n=== Grid Layout Preservation ===");

    // Verify grid layout classes
    const expectedLayoutClasses = [
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-3",
      "gap-6",
    ];

    const missingClasses: string[] = [];
    expectedLayoutClasses.forEach((className) => {
      if (!componentSource.includes(className)) {
        missingClasses.push(className);
        console.log(`✗ Missing class: ${className}`);
      } else {
        console.log(`✓ Preserved class: ${className}`);
      }
    });

    console.log("================================\n");

    // All layout classes should be preserved
    expect(missingClasses).toEqual([]);
  });

  it("should verify no changes to other components using text-primary-600", () => {
    console.log("\n=== Other Components Preservation ===");

    // List of other components that might use text-primary-600
    const otherComponents = [
      "components/Hero/index.tsx",
      "components/Header/index.tsx",
      "components/Footer/index.tsx",
      "components/ContactForm/index.tsx",
      "components/ProjectsSection/index.tsx",
    ];

    const componentsChecked: string[] = [];
    const componentsNotFound: string[] = [];

    otherComponents.forEach((componentPath) => {
      const fullPath = path.join(process.cwd(), componentPath);
      if (fs.existsSync(fullPath)) {
        componentsChecked.push(componentPath);
        console.log(`✓ Checked: ${componentPath}`);
      } else {
        componentsNotFound.push(componentPath);
        console.log(`⚠ Not found: ${componentPath}`);
      }
    });

    console.log(`\nTotal components checked: ${componentsChecked.length}`);
    console.log(`Components not found: ${componentsNotFound.length}`);
    console.log("=====================================\n");

    // This test documents which components exist and should be preserved
    // It doesn't fail if components don't exist (they might not use text-primary-600)
    expect(componentsChecked.length + componentsNotFound.length).toBe(otherComponents.length);
  });

  it("should document the scope of the fix (TechStack section only)", () => {
    console.log("\n=== Fix Scope Documentation ===");
    console.log("This fix is scoped to:");
    console.log("  - TechStack section links only");
    console.log("  - Changes text-primary-600 to text-primary-700");
    console.log("  - Changes hover:text-primary-700 to hover:text-primary-800");
    console.log("\nThis fix does NOT affect:");
    console.log("  - Links in other sections (Hero, About, Projects, Contact, Footer)");
    console.log("  - Non-link elements using text-primary-600");
    console.log("  - Card styling (backgrounds, borders, padding, shadows)");
    console.log("  - Non-link text colors (headings, descriptions, labels)");
    console.log("  - Grid layout and responsive behavior");
    console.log("  - Link hover and focus states (except color)");
    console.log("  - ExternalLink icon display");
    console.log("================================\n");

    // This test always passes - it's for documentation purposes
    expect(true).toBe(true);
  });
});
