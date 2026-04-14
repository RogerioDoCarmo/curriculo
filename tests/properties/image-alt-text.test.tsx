/**
 * Property Test: All Images Have Alt Text
 *
 * Property 14: All Images Have Alt Text
 * Validates: Requirements 9.1
 *
 * This test ensures that all img elements have either:
 * - A descriptive alt attribute, OR
 * - role="presentation" for decorative images
 *
 * This is critical for screen reader accessibility.
 */

import { render } from "@testing-library/react";
import fc from "fast-check";
import ProjectsSection from "@/components/ProjectsSection";
import type { Project } from "@/types/index";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    sizes,
    loading,
    className,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    loading?: "eager" | "lazy";
    className?: string;
  }) => {
    /* eslint-disable @next/next/no-img-element */
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        data-fill={fill}
        data-sizes={sizes}
      />
    );
    /* eslint-enable @next/next/no-img-element */
  },
}));

describe("Property 14: All Images Have Alt Text", () => {
  it("should ensure all images have alt text or role=presentation", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            title: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 }),
            technologies: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
            images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 3 }),
            featured: fc.boolean(),
            date: fc.date().map((d) => d.toISOString().split("T")[0]),
            liveUrl: fc.option(fc.webUrl(), { nil: undefined }),
            repoUrl: fc.option(fc.webUrl(), { nil: undefined }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (projects: Project[]) => {
          const { container } = render(<ProjectsSection projects={projects} locale="en" />);

          // Find all img elements
          const images = container.querySelectorAll("img");

          // Each image must have either alt text or role="presentation"
          images.forEach((img) => {
            const alt = img.getAttribute("alt");
            const role = img.getAttribute("role");

            const hasAlt = alt !== null && alt.trim().length > 0;
            const isPresentation = role === "presentation";

            expect(hasAlt || isPresentation).toBe(true);

            // If it has alt text, it should be descriptive (not just whitespace)
            if (hasAlt) {
              expect(alt.trim().length).toBeGreaterThan(0);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should have descriptive alt text for project images", () => {
    const project: Project = {
      id: "test-project",
      title: "Test Project",
      description: "A test project",
      technologies: ["React", "TypeScript"],
      images: ["/test-image-1.jpg", "/test-image-2.jpg"],
      featured: false,
      date: "2024-01-15",
    };

    const { container } = render(<ProjectsSection projects={[project]} locale="en" />);

    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThan(0);

    images.forEach((img, index) => {
      const alt = img.getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt).toContain(project.title);
      expect(alt).toContain(`screenshot ${index + 1}`);
    });
  });

  it("should handle projects without images gracefully", () => {
    const project: Project = {
      id: "no-image-project",
      title: "No Image Project",
      description: "A project without images",
      technologies: ["React"],
      images: [],
      featured: false,
      date: "2024-01-15",
    };

    const { container } = render(<ProjectsSection projects={[project]} locale="en" />);

    // Should render without errors
    expect(container).toBeTruthy();

    // No images should be present
    const images = container.querySelectorAll("img");
    expect(images.length).toBe(0);
  });
});
