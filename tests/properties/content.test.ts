/**
 * Property-based tests for content management system.
 *
 * Property 45: Content-Driven Project Addition
 * **Validates: Requirements 21.5**
 *
 * Property 46: Content Field Support
 * **Validates: Requirements 21.6**
 */

import * as fc from "fast-check";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// We import the function under test — it doesn't exist yet (RED phase)
import { getProjects } from "@/lib/content";

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Generates a valid ISO date string like "2024-01-15" */
const isoDateArb = fc
  .date({ min: new Date("2000-01-01"), max: new Date("2030-12-31") })
  .map((d) => d.toISOString().split("T")[0]);

/** Generates a non-empty slug-safe string for IDs */
const slugArb = fc
  .stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-".split("")), {
    minLength: 3,
    maxLength: 30,
  })
  .filter((s) => /^[a-z]/.test(s) && !s.endsWith("-"));

/** Generates a non-empty title string */
const titleArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0);

/** Generates a non-empty description string */
const descriptionArb = fc
  .string({ minLength: 1, maxLength: 500 })
  .filter((s) => s.trim().length > 0);

/** Generates an array of technology strings */
const technologiesArb = fc.array(
  fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
  { minLength: 0, maxLength: 10 }
);

/** Generates an array of image path strings */
const imagesArb = fc.array(
  fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
  { minLength: 0, maxLength: 5 }
);

/** Generates an optional URL string */
const optionalUrlArb = fc.option(fc.webUrl({ validSchemes: ["https", "http"] }), {
  nil: undefined,
});

/** Generates a valid project frontmatter object */
const projectFrontmatterArb = fc.record({
  id: slugArb,
  title: titleArb,
  description: descriptionArb,
  technologies: technologiesArb,
  images: imagesArb,
  featured: fc.boolean(),
  date: isoDateArb,
  liveUrl: optionalUrlArb,
  repoUrl: optionalUrlArb,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Serialises a project frontmatter object into a markdown file string.
 */
function buildMarkdownFile(frontmatter: {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  featured: boolean;
  date: string;
  liveUrl?: string;
  repoUrl?: string;
}): string {
  const techLines = frontmatter.technologies.map((t) => `  - ${JSON.stringify(t)}`).join("\n");
  const imageLines = frontmatter.images.map((i) => `  - ${JSON.stringify(i)}`).join("\n");
  const liveUrlLine = frontmatter.liveUrl ? `liveUrl: "${frontmatter.liveUrl}"` : "";
  const repoUrlLine = frontmatter.repoUrl ? `repoUrl: "${frontmatter.repoUrl}"` : "";

  return [
    "---",
    `id: ${frontmatter.id}`,
    `title: ${JSON.stringify(frontmatter.title)}`,
    `description: ${JSON.stringify(frontmatter.description)}`,
    `featured: ${frontmatter.featured}`,
    `date: ${frontmatter.date}`,
    frontmatter.technologies.length > 0 ? `technologies:\n${techLines}` : "technologies: []",
    frontmatter.images.length > 0 ? `images:\n${imageLines}` : "images: []",
    liveUrlLine,
    repoUrlLine,
    "---",
    "",
    "Project body content.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

// ─── Property 45: Content-Driven Project Addition ────────────────────────────

describe("Property 45: Content-Driven Project Addition", () => {
  /**
   * For any new project markdown file added to /content/projects/,
   * getProjects() returns it without requiring code changes.
   *
   * Validates: Requirements 21.5
   */
  it("returns any valid project markdown file added to content/projects/", async () => {
    await fc.assert(
      fc.asyncProperty(projectFrontmatterArb, async (frontmatter) => {
        // Create a temporary content/projects directory
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-test-"));
        const projectsDir = path.join(tmpDir, "content", "projects");
        fs.mkdirSync(projectsDir, { recursive: true });

        const filename = `${frontmatter.id}.md`;
        const filepath = path.join(projectsDir, filename);
        fs.writeFileSync(filepath, buildMarkdownFile(frontmatter));

        try {
          // getProjects should accept a custom content directory for testability
          const projects = await getProjects(path.join(tmpDir, "content"));

          // The project we added must appear in the results
          const found = projects.find((p) => p.id === frontmatter.id);
          expect(found).toBeDefined();
          expect(found!.title).toBe(frontmatter.title);
        } finally {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        }
      }),
      { numRuns: 20 }
    );
  });
});

// ─── Property 46: Content Field Support ──────────────────────────────────────

describe("Property 46: Content Field Support", () => {
  /**
   * For any project with any combination of standard fields, all fields
   * are parsed correctly by the content management system.
   *
   * Validates: Requirements 21.6
   */
  it("parses all standard project fields correctly", async () => {
    await fc.assert(
      fc.asyncProperty(projectFrontmatterArb, async (frontmatter) => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-test-"));
        const projectsDir = path.join(tmpDir, "content", "projects");
        fs.mkdirSync(projectsDir, { recursive: true });

        const filepath = path.join(projectsDir, `${frontmatter.id}.md`);
        fs.writeFileSync(filepath, buildMarkdownFile(frontmatter));

        try {
          const projects = await getProjects(path.join(tmpDir, "content"));
          const project = projects.find((p) => p.id === frontmatter.id);

          expect(project).toBeDefined();

          // All standard fields must be present and correctly typed
          expect(typeof project!.id).toBe("string");
          expect(typeof project!.title).toBe("string");
          expect(typeof project!.description).toBe("string");
          expect(Array.isArray(project!.technologies)).toBe(true);
          expect(Array.isArray(project!.images)).toBe(true);
          expect(typeof project!.featured).toBe("boolean");
          expect(typeof project!.date).toBe("string");

          // Values must match what was written
          expect(project!.title).toBe(frontmatter.title);
          expect(project!.description).toBe(frontmatter.description);
          expect(project!.featured).toBe(frontmatter.featured);
          expect(project!.technologies).toEqual(frontmatter.technologies);
          expect(project!.images).toEqual(frontmatter.images);

          // Optional URL fields
          if (frontmatter.liveUrl !== undefined) {
            expect(project!.liveUrl).toBe(frontmatter.liveUrl);
          }
          if (frontmatter.repoUrl !== undefined) {
            expect(project!.repoUrl).toBe(frontmatter.repoUrl);
          }
        } finally {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        }
      }),
      { numRuns: 20 }
    );
  });

  it("returns projects sorted by date descending (newest first)", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .array(
            fc.record({
              id: slugArb,
              title: titleArb,
              description: descriptionArb,
              technologies: technologiesArb,
              images: imagesArb,
              featured: fc.boolean(),
              date: isoDateArb,
            }),
            { minLength: 2, maxLength: 5 }
          )
          .filter((projects) => {
            // Ensure unique IDs
            const ids = projects.map((p) => p.id);
            return new Set(ids).size === ids.length;
          }),
        async (projectList) => {
          const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-test-"));
          const projectsDir = path.join(tmpDir, "content", "projects");
          fs.mkdirSync(projectsDir, { recursive: true });

          for (const proj of projectList) {
            const filepath = path.join(projectsDir, `${proj.id}.md`);
            fs.writeFileSync(filepath, buildMarkdownFile(proj));
          }

          try {
            const projects = await getProjects(path.join(tmpDir, "content"));

            // Verify sorted descending by date
            for (let i = 0; i < projects.length - 1; i++) {
              expect(projects[i].date >= projects[i + 1].date).toBe(true);
            }
          } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
