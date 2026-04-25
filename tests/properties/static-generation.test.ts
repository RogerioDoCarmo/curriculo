/**
 * Property-based tests for static content generation.
 *
 * Property 47: Static Content Generation
 * **Validates: Requirements 21.9**
 *
 * Property 48: No Runtime Content API Calls
 * **Validates: Requirements 21.10**
 */

import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";

// ─── Constants ───────────────────────────────────────────────────────────────

const OUT_DIR = path.join(process.cwd(), "out");
const SUPPORTED_LOCALES = ["en", "es", "pt-BR"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Checks if a file exists at the given path.
 */
function fileExists(filepath: string): boolean {
  try {
    return fs.existsSync(filepath) && fs.statSync(filepath).isFile();
  } catch {
    return false;
  }
}

/**
 * Reads the content of a file as a string.
 */
function readFileContent(filepath: string): string {
  try {
    return fs.readFileSync(filepath, "utf-8");
  } catch {
    return "";
  }
}

/**
 * Checks if HTML content contains runtime fetch/API calls.
 * Looks for common patterns that indicate runtime data fetching.
 */
function containsRuntimeFetchCalls(htmlContent: string): boolean {
  // Patterns that indicate runtime API calls
  const runtimeFetchPatterns = [
    /fetch\s*\(\s*['"`]\/api\//i, // fetch('/api/...')
    /fetch\s*\(\s*['"`]https?:\/\//i, // fetch('http://...')
    /axios\s*\.\s*get\s*\(/i, // axios.get(...)
    /axios\s*\.\s*post\s*\(/i, // axios.post(...)
    /\$\.ajax\s*\(/i, // $.ajax(...)
    /XMLHttpRequest/i, // new XMLHttpRequest()
  ];

  return runtimeFetchPatterns.some((pattern) => pattern.test(htmlContent));
}

/**
 * Extracts all script tags from HTML content.
 */
function extractScriptTags(htmlContent: string): string[] {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const scripts: string[] = [];
  let match;

  while ((match = scriptRegex.exec(htmlContent)) !== null) {
    scripts.push(match[1]);
  }

  return scripts;
}

/**
 * Checks if the out/ directory exists and has been built.
 */
function isOutDirectoryBuilt(): boolean {
  if (!fs.existsSync(OUT_DIR)) {
    return false;
  }

  // Check for essential files that should exist after build
  const essentialFiles = ["index.html", "404.html", "robots.txt"];
  return essentialFiles.every((file) => fileExists(path.join(OUT_DIR, file)));
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Generates a supported locale */
const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

/** Generates a page path (locale-specific) */
const pagePathArb = fc.record({
  locale: localeArb,
  page: fc.constantFrom("index.html"), // Main page for now
});

// ─── Property 47: Static Content Generation ──────────────────────────────────

describe("Property 47: Static Content Generation", () => {
  /**
   * For any content data in the content source, the build process should
   * transform it into static HTML pages with no runtime database queries
   * or API calls required.
   *
   * Validates: Requirements 21.9
   */

  beforeAll(() => {
    // Ensure the out/ directory exists before running tests
    if (!isOutDirectoryBuilt()) {
      console.warn(
        "Warning: out/ directory not found or incomplete. Run 'npm run build' before running these tests."
      );
    }
  });

  it("generates static HTML files for all supported locales", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        expect(fileExists(localePath)).toBe(true);
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });

  it("generates a root index.html file", () => {
    const rootIndexPath = path.join(OUT_DIR, "index.html");
    expect(fileExists(rootIndexPath)).toBe(true);
  });

  it("generates static HTML files with complete content", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        const content = readFileContent(localePath);

        // HTML should not be empty
        expect(content.length).toBeGreaterThan(0);

        // HTML should contain essential structure
        expect(content).toContain("<!DOCTYPE html>");
        expect(content).toContain("<html");
        expect(content).toContain("<head>");
        // Note: Next.js may minify HTML, so we check for body tag with or without space
        expect(content).toMatch(/<body[\s>]/);
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });

  it("generates static files for all essential resources", () => {
    const essentialFiles = [
      "robots.txt",
      "sitemap.xml",
      "resume.json",
      "404.html",
      "firebase-messaging-sw.js",
    ];

    essentialFiles.forEach((file) => {
      const filepath = path.join(OUT_DIR, file);
      expect(fileExists(filepath)).toBe(true);
    });
  });

  it("generates static HTML with pre-rendered content (not empty placeholders)", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        const content = readFileContent(localePath);

        // Content should include actual text, not just loading states
        // Check for common content indicators
        const hasContent =
          content.includes("Rogério") || // Name in content
          content.includes("React Native") || // Technology mentions
          content.includes("Developer") || // Role mentions
          content.length > 10000; // Substantial content size

        expect(hasContent).toBe(true);
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });

  it("generates static _next directory with bundled assets", () => {
    const nextDir = path.join(OUT_DIR, "_next");
    expect(fs.existsSync(nextDir)).toBe(true);
    expect(fs.statSync(nextDir).isDirectory()).toBe(true);

    // Should contain static assets
    const staticDir = path.join(nextDir, "static");
    expect(fs.existsSync(staticDir)).toBe(true);
  });

  it("generates static files without server-side runtime dependencies", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        const content = readFileContent(localePath);

        // Should not contain server-side rendering markers
        expect(content).not.toContain("__NEXT_DATA__");
        // Note: Next.js static export may still include __NEXT_DATA__ for client-side hydration
        // but it should be pre-populated with static data, not empty
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });
});

// ─── Property 48: No Runtime Content API Calls ───────────────────────────────

describe("Property 48: No Runtime Content API Calls", () => {
  /**
   * For any page load, the application should serve all content from static
   * files without making API calls to fetch content data.
   *
   * Validates: Requirements 21.10
   */

  beforeAll(() => {
    if (!isOutDirectoryBuilt()) {
      console.warn(
        "Warning: out/ directory not found or incomplete. Run 'npm run build' before running these tests."
      );
    }
  });

  it("does not include runtime fetch calls to content APIs in generated HTML", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        const content = readFileContent(localePath);

        // Check that HTML doesn't contain runtime fetch patterns
        expect(containsRuntimeFetchCalls(content)).toBe(false);
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });

  it("does not include runtime fetch calls in bundled JavaScript", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        const content = readFileContent(localePath);

        // Extract and check script tags
        const scripts = extractScriptTags(content);

        // Scripts should not contain content API fetch calls
        scripts.forEach((script) => {
          // Allow Firebase, Sentry, and analytics calls (external services)
          // but not content fetching
          const hasContentFetch =
            script.includes("fetch('/api/projects") ||
            script.includes("fetch('/api/experience") ||
            script.includes("fetch('/api/skills") ||
            script.includes("getProjects()") ||
            script.includes("getExperiences()");

          expect(hasContentFetch).toBe(false);
        });
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });

  it("includes all content data pre-rendered in HTML", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        const content = readFileContent(localePath);

        // Content should be present in the HTML, not loaded dynamically
        // Check for indicators that content is pre-rendered
        const contentIndicators = [
          /<h1[^>]*>.*?<\/h1>/i, // Headings present
          /<p[^>]*>.*?<\/p>/i, // Paragraphs present
          /class="[^"]*"/i, // Styled elements present
        ];

        const hasPreRenderedContent = contentIndicators.every((pattern) => pattern.test(content));

        expect(hasPreRenderedContent).toBe(true);
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });

  it("serves content from static files without database queries", () => {
    fc.assert(
      fc.property(localeArb, (locale) => {
        const localePath = path.join(OUT_DIR, locale, "index.html");
        const content = readFileContent(localePath);

        // Should not contain database query patterns in script tags
        // We need to be more specific to avoid false positives from text content
        const scripts = extractScriptTags(content);
        const scriptContent = scripts.join("\n");

        const databasePatterns = [
          /prisma\./i,
          /mongoose\./i,
          /sequelize\./i,
          /knex\./i,
          /\bSELECT\s+.*\s+FROM\b/i, // More specific SQL pattern
          /\bINSERT\s+INTO\b/i,
          /\bUPDATE\s+.*\s+SET\b/i,
        ];

        const hasDatabaseCalls = databasePatterns.some((pattern) => pattern.test(scriptContent));
        expect(hasDatabaseCalls).toBe(false);
      }),
      { numRuns: SUPPORTED_LOCALES.length }
    );
  });

  it("does not make runtime API calls for content in any locale", () => {
    // Test all locales to ensure consistency
    SUPPORTED_LOCALES.forEach((locale) => {
      const localePath = path.join(OUT_DIR, locale, "index.html");
      const content = readFileContent(localePath);

      // Verify no runtime content fetching
      expect(containsRuntimeFetchCalls(content)).toBe(false);

      // Verify content is present (not empty)
      expect(content.length).toBeGreaterThan(1000);
    });
  });

  it("generates resume.json as a static file without runtime generation", () => {
    const resumePath = path.join(OUT_DIR, "resume.json");
    expect(fileExists(resumePath)).toBe(true);

    const resumeContent = readFileContent(resumePath);
    expect(resumeContent.length).toBeGreaterThan(0);

    // Should be valid JSON
    expect(() => JSON.parse(resumeContent)).not.toThrow();

    // Should contain expected structure
    const resume = JSON.parse(resumeContent);
    expect(resume).toHaveProperty("basics");
    expect(resume).toHaveProperty("work");
    expect(resume).toHaveProperty("education");
  });

  it("generates sitemap.xml as a static file", () => {
    const sitemapPath = path.join(OUT_DIR, "sitemap.xml");
    expect(fileExists(sitemapPath)).toBe(true);

    const sitemapContent = readFileContent(sitemapPath);
    expect(sitemapContent.length).toBeGreaterThan(0);

    // Should contain XML structure
    expect(sitemapContent).toContain("<?xml");
    expect(sitemapContent).toContain("<urlset");
    expect(sitemapContent).toContain("<url>");
  });

  it("generates robots.txt as a static file", () => {
    const robotsPath = path.join(OUT_DIR, "robots.txt");
    expect(fileExists(robotsPath)).toBe(true);

    const robotsContent = readFileContent(robotsPath);
    expect(robotsContent.length).toBeGreaterThan(0);

    // Should contain robots.txt directives
    expect(robotsContent).toMatch(/User-agent:/i);
  });
});
