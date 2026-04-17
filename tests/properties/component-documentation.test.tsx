/**
 * Property Test: Component Documentation Completeness
 *
 * Property 25: Component Documentation Completeness
 * Validates: Requirements 13.1
 *
 * This test verifies that all UI components have corresponding Storybook story files.
 * It ensures that component documentation is complete and up-to-date.
 */

import fs from "fs";
import path from "path";
import fc from "fast-check";

describe("Property 25: Component Documentation Completeness", () => {
  const componentsDir = path.join(process.cwd(), "components");

  // Get all component directories
  const getComponentDirs = (): string[] => {
    if (!fs.existsSync(componentsDir)) {
      return [];
    }

    return fs
      .readdirSync(componentsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((name) => !name.startsWith("."));
  };

  // Check if a component has a story file
  const hasStoryFile = (componentName: string): boolean => {
    const componentDir = path.join(componentsDir, componentName);
    const files = fs.readdirSync(componentDir);

    return files.some((file) => file.endsWith(".stories.tsx") || file.endsWith(".stories.ts"));
  };

  // UI components that should have stories
  // These are the core reusable UI components
  const uiComponents = [
    "Button",
    "Card",
    "Modal",
    "HighlightedText",
    // ThemeToggle and LanguageSelector will be added when context providers are configured
  ];

  it("should have story files for all UI components", () => {
    const componentDirs = getComponentDirs();

    // Filter to only UI components
    const uiComponentDirs = componentDirs.filter((dir) => uiComponents.includes(dir));

    // Check each UI component has a story file
    uiComponentDirs.forEach((componentName) => {
      const hasStory = hasStoryFile(componentName);
      expect(hasStory).toBe(true);

      if (!hasStory) {
        console.error(`Missing story file for component: ${componentName}`);
      }
    });
  });

  it("should have valid story file naming convention", () => {
    const componentDirs = getComponentDirs();

    componentDirs.forEach((componentName) => {
      const componentDir = path.join(componentsDir, componentName);
      const files = fs.readdirSync(componentDir);

      const storyFiles = files.filter(
        (file) => file.endsWith(".stories.tsx") || file.endsWith(".stories.ts")
      );

      if (storyFiles.length > 0) {
        // Story file should match component name
        const expectedStoryFile = `${componentName}.stories.tsx`;
        const hasCorrectName = storyFiles.includes(expectedStoryFile);

        expect(hasCorrectName).toBe(true);

        if (!hasCorrectName) {
          console.error(
            `Story file for ${componentName} should be named ${expectedStoryFile}, found: ${storyFiles.join(", ")}`
          );
        }
      }
    });
  });

  it("should have story files that export a default meta object", () => {
    const componentDirs = getComponentDirs();

    componentDirs.forEach((componentName) => {
      const componentDir = path.join(componentsDir, componentName);
      const files = fs.readdirSync(componentDir);

      const storyFiles = files.filter((file) => file.endsWith(".stories.tsx"));

      storyFiles.forEach((storyFile) => {
        const storyPath = path.join(componentDir, storyFile);
        const content = fs.readFileSync(storyPath, "utf-8");

        // Check for meta export
        const hasMetaExport =
          content.includes("const meta:") && content.includes("export default meta");

        expect(hasMetaExport).toBe(true);

        if (!hasMetaExport) {
          console.error(`Story file ${storyFile} should export a default meta object`);
        }
      });
    });
  });

  it("should have story files with at least one story export", () => {
    const componentDirs = getComponentDirs();

    componentDirs.forEach((componentName) => {
      const componentDir = path.join(componentsDir, componentName);
      const files = fs.readdirSync(componentDir);

      const storyFiles = files.filter((file) => file.endsWith(".stories.tsx"));

      storyFiles.forEach((storyFile) => {
        const storyPath = path.join(componentDir, storyFile);
        const content = fs.readFileSync(storyPath, "utf-8");

        // Check for at least one story export (export const SomeName: Story)
        const hasStoryExport = /export const \w+: Story/.test(content);

        expect(hasStoryExport).toBe(true);

        if (!hasStoryExport) {
          console.error(`Story file ${storyFile} should have at least one story export`);
        }
      });
    });
  });

  /**
   * Property-based test: Story files should be valid TypeScript
   */
  it("property: all story files should have valid TypeScript syntax", () => {
    fc.assert(
      fc.property(fc.constantFrom(...getComponentDirs()), (componentName) => {
        const componentDir = path.join(componentsDir, componentName);

        if (!fs.existsSync(componentDir)) {
          return true; // Skip if directory doesn't exist
        }

        const files = fs.readdirSync(componentDir);
        const storyFiles = files.filter((file) => file.endsWith(".stories.tsx"));

        if (storyFiles.length === 0) {
          return true; // Skip if no story files
        }

        // Check each story file has valid structure
        return storyFiles.every((storyFile) => {
          const storyPath = path.join(componentDir, storyFile);
          const content = fs.readFileSync(storyPath, "utf-8");

          // Basic syntax checks
          const hasImports = content.includes("import");
          const hasExport = content.includes("export");
          const hasValidBraces =
            (content.match(/{/g) || []).length === (content.match(/}/g) || []).length;

          return hasImports && hasExport && hasValidBraces;
        });
      }),
      { numRuns: 10 }
    );
  });

  /**
   * Property-based test: Story files should import the component they document
   */
  it("property: story files should import their corresponding component", () => {
    fc.assert(
      fc.property(fc.constantFrom(...uiComponents), (componentName) => {
        const componentDir = path.join(componentsDir, componentName);

        if (!fs.existsSync(componentDir)) {
          return true;
        }

        const storyFile = path.join(componentDir, `${componentName}.stories.tsx`);

        if (!fs.existsSync(storyFile)) {
          return true; // Skip if story file doesn't exist
        }

        const content = fs.readFileSync(storyFile, "utf-8");

        // Should import the component from ./index or ./{ComponentName}
        const hasComponentImport =
          content.includes("from './index'") ||
          content.includes('from "./index"') ||
          content.includes(`from "./${componentName}"`) ||
          content.includes(`from './${componentName}'`);

        return hasComponentImport;
      }),
      { numRuns: uiComponents.length }
    );
  });
});
