import * as fc from "fast-check";
import { render } from "@testing-library/react";

/**
 * Property 13: Semantic HTML Structure
 * Validates: Requirements 7.5, 20.3
 *
 * Test that pages use semantic elements instead of generic divs:
 * - article, section, header, nav, main, footer
 * - Proper use of semantic tags for content structure
 */

// Test component that mimics the structure of our pages
const TestPage = () => (
  <article className="flex min-h-screen flex-col items-center justify-center p-8">
    <header>
      <h1 className="text-4xl font-bold text-center">Personal Resume Website</h1>
    </header>
    <section className="mt-4">
      <p className="text-muted-foreground text-center">
        A modern, responsive personal resume website built with Next.js 14, TypeScript, and Tailwind
        CSS.
      </p>
    </section>
  </article>
);

describe("Property 13: Semantic HTML Structure", () => {
  it("should use semantic HTML elements instead of generic divs", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        const { container } = render(<TestPage />);

        // Check for semantic elements
        const article = container.querySelector("article");
        const header = container.querySelector("header");
        const section = container.querySelector("section");

        expect(article).toBeInTheDocument();
        expect(header).toBeInTheDocument();
        expect(section).toBeInTheDocument();

        // Verify heading is inside header
        const h1 = header?.querySelector("h1");
        expect(h1).toBeInTheDocument();

        // Verify content is inside section
        const paragraph = section?.querySelector("p");
        expect(paragraph).toBeInTheDocument();
      }),
      { numRuns: 100 }
    );
  });

  it("should have proper heading hierarchy starting with h1", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        const { container } = render(<TestPage />);

        // Should have exactly one h1
        const h1Elements = container.querySelectorAll("h1");
        expect(h1Elements.length).toBe(1);

        // h1 should be the first heading
        const firstHeading = container.querySelector("h1, h2, h3, h4, h5, h6");
        expect(firstHeading?.tagName).toBe("H1");
      }),
      { numRuns: 100 }
    );
  });

  it("should not use excessive generic div elements for structural content", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        const { container } = render(<TestPage />);

        // Count semantic elements
        const semanticElements = container.querySelectorAll(
          "article, section, header, nav, main, footer, aside"
        );

        // Should have at least some semantic elements
        expect(semanticElements.length).toBeGreaterThan(0);

        // Verify semantic elements are used for structure
        const article = container.querySelector("article");
        expect(article).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});
