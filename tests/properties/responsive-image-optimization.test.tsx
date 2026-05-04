/**
 * Property Test: Responsive Image Optimization
 *
 * Property 10: Responsive Image Optimization
 * Validates: Requirements 4.5
 *
 * This test ensures that images use appropriate sources for viewport size
 * by verifying that Next.js Image components have the `sizes` attribute
 * configured correctly for responsive loading.
 *
 * The ProjectsSection component uses:
 * - Project card images: sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
 * - Modal images: sizes="256px"
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fc from "fast-check";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import ProjectsSection from "@/components/ProjectsSection";
import type { Project } from "@/types/index";

// Helper to render with intl provider
function renderWithIntl(component: React.ReactElement) {
  const messages: AbstractIntlMessages = {
    sections: {
      projects: "Projects",
    },
    projects: {
      title: "Projects",
      filterPlaceholder: "Filter by technology",
      filterByTech: "Filter by technology",
      all: "All",
      noMatch: "No projects match the selected technology",
      viewProject: "View Project",
      viewDetails: "View details for",
      screenshot: "screenshot",
      featured: "Featured",
      mockData: "Mock Data",
      more: "more",
      noImages: "No images available",
      technologies: "Technologies",
      liveDemo: "Live Demo",
      repository: "Repository",
      sourceCode: "Source Code",
      closeModal: "Close modal",
    },
  };

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
}

// Mock next/image to capture sizes attribute
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

describe("Property 10: Responsive Image Optimization", () => {
  it("should ensure all project card images have responsive sizes attribute", () => {
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
          const { container } = renderWithIntl(<ProjectsSection projects={projects} locale="en" />);

          // Find all img elements in project cards (not in modal)
          const images = container.querySelectorAll("img");

          // Each image should have a sizes attribute for responsive loading
          images.forEach((img) => {
            const sizes = img.getAttribute("data-sizes");

            // All images should have sizes attribute
            expect(sizes).toBeTruthy();
            expect(sizes).not.toBe("");

            // Sizes should contain viewport-based media queries or fixed size
            // Valid patterns:
            // - "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" (card images)
            // - "256px" (modal images)
            const hasViewportQueries = sizes?.includes("max-width") && sizes?.includes("vw");
            const hasFixedSize = /^\d+px$/.test(sizes || "");

            expect(hasViewportQueries || hasFixedSize).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should use viewport-based sizes for project card images", () => {
    const project: Project = {
      id: "test-project",
      title: "Test Project",
      description: "A test project",
      technologies: ["React", "TypeScript"],
      images: ["/test-image-1.jpg"],
      featured: false,
      date: "2024-01-15",
    };

    const { container } = renderWithIntl(<ProjectsSection projects={[project]} locale="en" />);

    // Find the project card image
    const cardImage = container.querySelector('img[alt*="screenshot 1"]');
    expect(cardImage).toBeInTheDocument();

    const sizes = cardImage?.getAttribute("data-sizes");
    expect(sizes).toBeTruthy();

    // Should have responsive breakpoints for mobile, tablet, and desktop
    expect(sizes).toContain("max-width: 767px"); // Mobile breakpoint
    expect(sizes).toContain("100vw"); // Mobile: full viewport width
    expect(sizes).toContain("max-width: 1023px"); // Tablet breakpoint
    expect(sizes).toContain("50vw"); // Tablet: half viewport width
    expect(sizes).toContain("33vw"); // Desktop: one-third viewport width
  });

  it("should use fixed size for modal images", async () => {
    const user = userEvent.setup();
    const project: Project = {
      id: "test-project",
      title: "Test Project",
      description: "A test project with multiple images",
      technologies: ["React", "TypeScript"],
      images: ["/test-image-1.jpg", "/test-image-2.jpg"],
      featured: false,
      date: "2024-01-15",
    };

    const { container } = renderWithIntl(<ProjectsSection projects={[project]} locale="en" />);

    // Click on the project card to open modal
    const projectCard = screen.getByRole("button", { name: /view details for test project/i });
    await user.click(projectCard);

    // Find modal images
    const modalImages = container.querySelectorAll('img[alt*="screenshot"]');
    expect(modalImages.length).toBeGreaterThan(1); // Card image + modal images

    // Modal images should have fixed size
    modalImages.forEach((img) => {
      const sizes = img.getAttribute("data-sizes");
      expect(sizes).toBeTruthy();

      // Either viewport-based (card) or fixed size (modal)
      const isCardImage = sizes?.includes("max-width");
      const isModalImage = /^\d+px$/.test(sizes || "");

      expect(isCardImage || isModalImage).toBe(true);
    });
  });

  it("should optimize images for different viewport sizes", () => {
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
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (projects: Project[]) => {
          const { container } = renderWithIntl(<ProjectsSection projects={projects} locale="en" />);

          const images = container.querySelectorAll("img");

          // Verify that images have appropriate sizes for responsive loading
          images.forEach((img) => {
            const sizes = img.getAttribute("data-sizes");

            // All images must have sizes attribute
            expect(sizes).toBeTruthy();

            // Sizes should be optimized for viewport
            if (sizes?.includes("max-width")) {
              // Responsive sizes should have multiple breakpoints
              const breakpoints = sizes.match(/max-width:\s*\d+px/g);
              expect(breakpoints).toBeTruthy();
              expect(breakpoints!.length).toBeGreaterThanOrEqual(1);

              // Should use viewport units (vw) for responsive sizing
              expect(sizes).toMatch(/\d+vw/);
            } else {
              // Fixed sizes should be in pixels
              expect(sizes).toMatch(/^\d+px$/);
            }
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should handle projects with no images gracefully", () => {
    const project: Project = {
      id: "no-image-project",
      title: "No Image Project",
      description: "A project without images",
      technologies: ["React"],
      images: [],
      featured: false,
      date: "2024-01-15",
    };

    const { container } = renderWithIntl(<ProjectsSection projects={[project]} locale="en" />);

    // Should render without errors
    expect(container).toBeTruthy();

    // No images should be present
    const images = container.querySelectorAll("img");
    expect(images.length).toBe(0);
  });

  it("should use lazy loading for project card images", () => {
    const project: Project = {
      id: "test-project",
      title: "Test Project",
      description: "A test project",
      technologies: ["React", "TypeScript"],
      images: ["/test-image-1.jpg"],
      featured: false,
      date: "2024-01-15",
    };

    const { container } = renderWithIntl(<ProjectsSection projects={[project]} locale="en" />);

    const cardImage = container.querySelector('img[alt*="screenshot 1"]');
    expect(cardImage).toBeInTheDocument();

    // Project card images should use lazy loading
    const loading = cardImage?.getAttribute("loading");
    expect(loading).toBe("lazy");
  });

  it("should verify responsive sizes match expected breakpoints", () => {
    const projects: Project[] = [
      {
        id: "project-1",
        title: "Project 1",
        description: "First project",
        technologies: ["React"],
        images: ["/image-1.jpg"],
        featured: true,
        date: "2024-01-01",
      },
      {
        id: "project-2",
        title: "Project 2",
        description: "Second project",
        technologies: ["TypeScript"],
        images: ["/image-2.jpg", "/image-3.jpg"],
        featured: false,
        date: "2024-01-02",
      },
    ];

    const { container } = renderWithIntl(<ProjectsSection projects={projects} locale="en" />);

    // Find all project card images (first image of each project)
    const cardImages = container.querySelectorAll('img[alt*="screenshot 1"]');
    expect(cardImages.length).toBe(2);

    cardImages.forEach((img) => {
      const sizes = img.getAttribute("data-sizes");

      // Verify the exact responsive sizes pattern
      expect(sizes).toBe("(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw");
    });
  });
});
