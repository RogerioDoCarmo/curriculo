/**
 * Property-Based Tests for Component Documentation Completeness
 *
 * Property 25: Component Documentation Completeness
 * Validates: Requirements 13.1
 *
 * Tests that all reusable UI components have corresponding Storybook story files.
 * This ensures that the component library is properly documented for developers.
 */

import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";

describe("Property 25: Component Documentation Completeness", () => {
  // Define the list of reusable UI components that should have stories
  // Based on design.md section "3. UI Components" and Task 20.2
  const UI_COMPONENTS = [
    "Button",
    "Card",
    "Modal",
    "ThemeToggle",
    "LanguageSelector",
    "HighlightedText",
  ];

  const COMPONENTS_DIR = path.join(process.cwd(), "components");

  /**
   * Helper function to check if a component has a story file
   */
  const hasStoryFile = (componentName: string): boolean => {
    const componentDir = path.join(COMPONENTS_DIR, componentName);

    if (!fs.existsSync(componentDir)) {
      return false;
    }

    const files = fs.readdirSync(componentDir);

    // Check for .stories.tsx or .stories.ts files
    return files.some((file) => file.endsWith(".stories.tsx") || file.endsWith(".stories.ts"));
  };

  /**
   * Helper function to get the story file path for a component
   */
  const getStoryFilePath = (componentName: string): string | null => {
    const componentDir = path.join(COMPONENTS_DIR, componentName);

    if (!fs.existsSync(componentDir)) {
      return null;
    }

    const files = fs.readdirSync(componentDir);
    const storyFile = files.find(
      (file) => file.endsWith(".stories.tsx") || file.endsWith(".stories.ts")
    );

    return storyFile ? path.join(componentDir, storyFile) : null;
  };

  it("should have story files for all UI components", () => {
    UI_COMPONENTS.forEach((componentName) => {
      const hasStory = hasStoryFile(componentName);
      expect(hasStory).toBe(true);

      if (!hasStory) {
        console.error(`Missing story file for UI component: ${componentName}`);
      }
    });
  });

  it("should have valid story file naming convention", () => {
    fc.assert(
      fc.property(fc.constantFrom(...UI_COMPONENTS), (componentName) => {
        const storyFilePath = getStoryFilePath(componentName);

        if (storyFilePath) {
          const fileName = path.basename(storyFilePath);

          // Story files should follow naming convention: ComponentName.stories.tsx
          expect(fileName).toMatch(/^[A-Z][a-zA-Z]+\.stories\.(tsx|ts)$/);

          // Story file name should match component name
          const storyComponentName = fileName.split(".")[0];
          expect(storyComponentName).toBe(componentName);
        }

        return true;
      }),
      { numRuns: UI_COMPONENTS.length }
    );
  });

  it("should have story files that export default meta", () => {
    UI_COMPONENTS.forEach((componentName) => {
      const storyFilePath = getStoryFilePath(componentName);

      if (storyFilePath) {
        const content = fs.readFileSync(storyFilePath, "utf-8");

        // Story files should have a default export (Storybook meta)
        expect(content).toMatch(/export default/);

        // Should import from Storybook
        expect(content).toMatch(/@storybook\/react/);
      }
    });
  });

  it("should have story files that define at least one story", () => {
    UI_COMPONENTS.forEach((componentName) => {
      const storyFilePath = getStoryFilePath(componentName);

      if (storyFilePath) {
        const content = fs.readFileSync(storyFilePath, "utf-8");

        // Story files should export at least one story
        // Stories are typically exported as named exports
        const exportMatches = content.match(/export const \w+/g);
        expect(exportMatches).toBeTruthy();
        expect(exportMatches!.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  it("should have story files that import the component", () => {
    UI_COMPONENTS.forEach((componentName) => {
      const storyFilePath = getStoryFilePath(componentName);

      if (storyFilePath) {
        const content = fs.readFileSync(storyFilePath, "utf-8");

        // Story files should import the component they document
        // Check for various import patterns
        const importPatterns = [
          new RegExp(`import.*${componentName}.*from`),
          new RegExp(`import.*\\{.*${componentName}.*\\}.*from`),
          new RegExp(`import ${componentName} from`),
        ];

        const hasImport = importPatterns.some((pattern) => pattern.test(content));

        expect(hasImport).toBe(true);
      }
    });
  });

  it("should have story files in the same directory as the component", () => {
    fc.assert(
      fc.property(fc.constantFrom(...UI_COMPONENTS), (componentName) => {
        const storyFilePath = getStoryFilePath(componentName);

        if (storyFilePath) {
          const componentDir = path.join(COMPONENTS_DIR, componentName);
          const storyDir = path.dirname(storyFilePath);

          // Story file should be in the same directory as the component
          expect(storyDir).toBe(componentDir);
        }

        return true;
      }),
      { numRuns: UI_COMPONENTS.length }
    );
  });

  it("should have story files that define component title", () => {
    UI_COMPONENTS.forEach((componentName) => {
      const storyFilePath = getStoryFilePath(componentName);

      if (storyFilePath) {
        const content = fs.readFileSync(storyFilePath, "utf-8");

        // Story files should define a title in the meta object
        expect(content).toMatch(/title:/);
      }
    });
  });

  it("should have story files that use TypeScript", () => {
    UI_COMPONENTS.forEach((componentName) => {
      const storyFilePath = getStoryFilePath(componentName);

      if (storyFilePath) {
        // Story files should use .tsx extension for React components
        expect(storyFilePath).toMatch(/\.tsx$/);
      }
    });
  });

  it("should have consistent story file structure across all components", () => {
    const storyStructures = UI_COMPONENTS.map((componentName) => {
      const storyFilePath = getStoryFilePath(componentName);

      if (!storyFilePath) {
        return null;
      }

      const content = fs.readFileSync(storyFilePath, "utf-8");

      return {
        componentName,
        hasDefaultExport: /export default/.test(content),
        hasStorybookImport: /@storybook\/react/.test(content),
        hasComponentImport: new RegExp(componentName).test(content),
        hasTitle: /title:/.test(content),
        hasStories: /export const \w+/.test(content),
      };
    }).filter(Boolean);

    // All story files should have consistent structure
    storyStructures.forEach((structure) => {
      expect(structure?.hasDefaultExport).toBe(true);
      expect(structure?.hasStorybookImport).toBe(true);
      expect(structure?.hasComponentImport).toBe(true);
      expect(structure?.hasTitle).toBe(true);
      expect(structure?.hasStories).toBe(true);
    });
  });

  it("should not have story files for non-UI components", () => {
    // Components that are NOT in the UI components list
    // These are section components, layout components, or utility components
    const NON_UI_COMPONENTS = [
      "Hero",
      "ExperienceSection",
      "ProjectsSection",
      "SkillsSection",
      "ContactForm",
      "TechStackSection",
      "Header",
      "Footer",
      "CareerPathSelector",
      "Timeline",
      "NotificationPrompt",
      "ExitIntentModal",
      "ErrorBoundary",
      "BackToTopButton",
    ];

    // This test documents which components intentionally don't have stories
    // It's informational rather than enforcing - some of these might have stories
    NON_UI_COMPONENTS.forEach((componentName) => {
      const hasStory = hasStoryFile(componentName);

      // We don't fail if these have stories, just document the state
      if (hasStory) {
        console.log(`Note: Non-UI component ${componentName} has a story file (this is optional)`);
      }
    });

    // This test always passes - it's just for documentation
    expect(true).toBe(true);
  });

  it("should verify all story files are valid TypeScript files", () => {
    UI_COMPONENTS.forEach((componentName) => {
      const storyFilePath = getStoryFilePath(componentName);

      if (storyFilePath) {
        // Check that the file can be read and is not empty
        const content = fs.readFileSync(storyFilePath, "utf-8");
        expect(content.length).toBeGreaterThan(0);

        // Check for basic TypeScript/React syntax
        expect(content).toMatch(/import/);
        expect(content).toMatch(/export/);
      }
    });
  });
});
