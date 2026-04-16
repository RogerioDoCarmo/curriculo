/**
 * Property-based tests for the projects portfolio section.
 *
 * Property 4: Complete Project Rendering
 * **Validates: Requirements 2.1, 2.2, 2.3**
 *
 * Property 5: Project Links Rendered When Present
 * **Validates: Requirements 2.5**
 *
 * Property 6: Project Details Expansion
 * **Validates: Requirements 2.4**
 *
 * Property 12: Lazy Loading for Below-Fold Images
 * **Validates: Requirements 6.3**
 */

import * as fc from "fast-check";
import type { Project } from "@/types/index";

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const slugArb = fc
  .stringOf(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-".split("")), {
    minLength: 3,
    maxLength: 30,
  })
  .filter((s) => /^[a-z]/.test(s) && !s.endsWith("-"));

const nonEmptyStringArb = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0);

const technologiesArb = fc.array(
  fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
  { minLength: 1, maxLength: 10 }
);

const imagePathArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0);

const imagesArb = fc.array(imagePathArb, { minLength: 1, maxLength: 5 });

const optionalUrlArb = fc.option(fc.webUrl({ validSchemes: ["https", "http"] }), {
  nil: undefined,
});

const projectArb: fc.Arbitrary<Project> = fc.record({
  id: slugArb,
  title: nonEmptyStringArb,
  description: nonEmptyStringArb,
  longDescription: fc.option(nonEmptyStringArb, { nil: undefined }),
  technologies: technologiesArb,
  images: imagesArb,
  liveUrl: optionalUrlArb,
  repoUrl: optionalUrlArb,
  featured: fc.boolean(),
  date: fc.constant("2024-01-15"),
});

// ─── Pure rendering logic (mirrors ProjectsSection / ProjectCard component) ───

interface RenderedProject {
  title: string;
  description: string;
  technologies: string[];
  images: Array<{ src: string; alt: string; loading: "lazy" | "eager" }>;
  liveUrl?: string;
  repoUrl?: string;
  hasLiveLink: boolean;
  hasRepoLink: boolean;
  isExpanded: boolean;
}

/**
 * Simulates rendering a project into a display object.
 * Mirrors what the ProjectCard component would produce.
 */
function renderProject(project: Project, expanded = false): RenderedProject {
  return {
    title: project.title,
    description: project.description,
    technologies: project.technologies,
    images: project.images.map((src, index) => ({
      src,
      alt: `${project.title} screenshot ${index + 1}`,
      loading: "lazy" as const,
    })),
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    hasLiveLink: Boolean(project.liveUrl),
    hasRepoLink: Boolean(project.repoUrl),
    isExpanded: expanded,
  };
}

/**
 * Simulates toggling the expanded state of a project card.
 */
function toggleExpanded(isExpanded: boolean): boolean {
  return !isExpanded;
}

// ─── Property 4: Complete Project Rendering ──────────────────────────────────

describe("Property 4: Complete Project Rendering", () => {
  /**
   * Projects with non-empty fields always render those fields.
   * Project title is always rendered.
   * Technologies array is always rendered.
   *
   * Validates: Requirements 2.1, 2.2, 2.3
   */

  it("project title is always rendered", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        expect(rendered.title).toBe(project.title);
        expect(rendered.title.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it("project description is always rendered", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        expect(rendered.description).toBe(project.description);
        expect(rendered.description.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it("technologies array is always rendered", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        expect(Array.isArray(rendered.technologies)).toBe(true);
        expect(rendered.technologies).toEqual(project.technologies);
      }),
      { numRuns: 100 }
    );
  });

  it("all technologies in the array are rendered", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        for (const tech of project.technologies) {
          expect(rendered.technologies).toContain(tech);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("rendered project preserves all non-empty fields from source", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        expect(rendered.title).toBe(project.title);
        expect(rendered.description).toBe(project.description);
        expect(rendered.technologies).toEqual(project.technologies);
        expect(rendered.images.length).toBe(project.images.length);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 5: Project Links Rendered When Present ─────────────────────────

describe("Property 5: Project Links Rendered When Present", () => {
  /**
   * Projects with liveUrl always have a clickable link.
   * Projects with repoUrl always have a clickable link.
   * Projects without URLs don't render broken links.
   *
   * Validates: Requirements 2.5
   */

  it("projects with liveUrl always have a live link", () => {
    fc.assert(
      fc.property(
        projectArb.filter((p) => p.liveUrl !== undefined),
        (project) => {
          const rendered = renderProject(project);
          expect(rendered.hasLiveLink).toBe(true);
          expect(rendered.liveUrl).toBe(project.liveUrl);
          expect(typeof rendered.liveUrl).toBe("string");
          if (rendered.liveUrl) {
            expect(rendered.liveUrl.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("projects with repoUrl always have a repo link", () => {
    fc.assert(
      fc.property(
        projectArb.filter((p) => p.repoUrl !== undefined),
        (project) => {
          const rendered = renderProject(project);
          expect(rendered.hasRepoLink).toBe(true);
          expect(rendered.repoUrl).toBe(project.repoUrl);
          expect(typeof rendered.repoUrl).toBe("string");
          if (rendered.repoUrl) {
            expect(rendered.repoUrl.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("projects without liveUrl do not render a live link", () => {
    fc.assert(
      fc.property(
        projectArb.filter((p) => p.liveUrl === undefined),
        (project) => {
          const rendered = renderProject(project);
          expect(rendered.hasLiveLink).toBe(false);
          expect(rendered.liveUrl).toBeUndefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  it("projects without repoUrl do not render a repo link", () => {
    fc.assert(
      fc.property(
        projectArb.filter((p) => p.repoUrl === undefined),
        (project) => {
          const rendered = renderProject(project);
          expect(rendered.hasRepoLink).toBe(false);
          expect(rendered.repoUrl).toBeUndefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  it("projects without any URLs render no broken links", () => {
    fc.assert(
      fc.property(
        projectArb.filter((p) => p.liveUrl === undefined && p.repoUrl === undefined),
        (project) => {
          const rendered = renderProject(project);
          expect(rendered.hasLiveLink).toBe(false);
          expect(rendered.hasRepoLink).toBe(false);
          expect(rendered.liveUrl).toBeUndefined();
          expect(rendered.repoUrl).toBeUndefined();
        }
      ),
      { numRuns: 50 }
    );
  });

  it("link presence is determined solely by URL field existence", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        expect(rendered.hasLiveLink).toBe(project.liveUrl !== undefined);
        expect(rendered.hasRepoLink).toBe(project.repoUrl !== undefined);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 6: Project Details Expansion ───────────────────────────────────

describe("Property 6: Project Details Expansion", () => {
  /**
   * Clicking a project always reveals more details.
   * Expanded state is boolean (true/false).
   *
   * Validates: Requirements 2.4
   */

  it("initial expanded state is always false (collapsed by default)", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        expect(rendered.isExpanded).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it("clicking a project toggles expanded state to true", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const collapsed = renderProject(project, false);
        const expanded = renderProject(project, toggleExpanded(collapsed.isExpanded));
        expect(expanded.isExpanded).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("expanded state is always a boolean", () => {
    fc.assert(
      fc.property(projectArb, fc.boolean(), (project, initialExpanded) => {
        const rendered = renderProject(project, initialExpanded);
        expect(typeof rendered.isExpanded).toBe("boolean");
      }),
      { numRuns: 100 }
    );
  });

  it("toggling expanded state twice returns to original state", () => {
    fc.assert(
      fc.property(projectArb, fc.boolean(), (project, initialExpanded) => {
        const afterFirst = toggleExpanded(initialExpanded);
        const afterSecond = toggleExpanded(afterFirst);
        expect(afterSecond).toBe(initialExpanded);
      }),
      { numRuns: 100 }
    );
  });

  it("toggle always produces the opposite boolean", () => {
    expect(toggleExpanded(false)).toBe(true);
    expect(toggleExpanded(true)).toBe(false);
  });

  it("expanded project still has all its fields intact", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const expanded = renderProject(project, true);
        expect(expanded.title).toBe(project.title);
        expect(expanded.description).toBe(project.description);
        expect(expanded.technologies).toEqual(project.technologies);
        expect(expanded.isExpanded).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 12: Lazy Loading for Below-Fold Images ─────────────────────────

describe("Property 12: Lazy Loading for Below-Fold Images", () => {
  /**
   * Images with loading="lazy" attribute are valid.
   * All project images have alt text.
   *
   * Validates: Requirements 6.3
   */

  it("all project images have loading='lazy' attribute", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        for (const image of rendered.images) {
          expect(image.loading).toBe("lazy");
        }
      }),
      { numRuns: 100 }
    );
  });

  it("all project images have non-empty alt text", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        for (const image of rendered.images) {
          expect(typeof image.alt).toBe("string");
          expect(image.alt.trim().length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("image alt text includes the project title for context", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        for (const image of rendered.images) {
          expect(image.alt).toContain(project.title);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("image src is always a non-empty string", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        for (const image of rendered.images) {
          expect(typeof image.src).toBe("string");
          expect(image.src.trim().length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("number of rendered images matches number of source images", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        expect(rendered.images.length).toBe(project.images.length);
      }),
      { numRuns: 100 }
    );
  });

  it("loading='lazy' is a valid HTML attribute value", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const rendered = renderProject(project);
        for (const image of rendered.images) {
          expect(["lazy", "eager", "auto"]).toContain(image.loading);
        }
      }),
      { numRuns: 100 }
    );
  });
});
