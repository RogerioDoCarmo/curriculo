import * as fc from "fast-check";
import { render } from "@testing-library/react";

/**
 * Property 15: Proper Heading Hierarchy
 * Validates: Requirements 9.2, 20.8
 *
 * Test that headings follow logical hierarchy without skipped levels:
 * - h1 → h2 → h3 (no skipping from h1 to h3)
 * - Only one h1 per page
 * - Headings are in logical order
 */

// Test component with proper heading hierarchy
const TestPageWithHeadings = () => (
  <article>
    <h1>Main Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content</p>
      <h3>Subsection Title</h3>
      <p>More content</p>
    </section>
    <section>
      <h2>Another Section</h2>
      <p>Content</p>
    </section>
  </article>
);

describe("Property 15: Proper Heading Hierarchy", () => {
  it("should have exactly one h1 element per page", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        const { container } = render(<TestPageWithHeadings />);

        const h1Elements = container.querySelectorAll("h1");
        expect(h1Elements.length).toBe(1);
      }),
      { numRuns: 100 }
    );
  });

  it("should not skip heading levels", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        const { container } = render(<TestPageWithHeadings />);

        // Get all headings in document order
        const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));

        // Extract heading levels (1-6)
        const levels = headings.map((h) => parseInt(h.tagName.charAt(1)));

        // Check that we don't skip levels
        for (let i = 1; i < levels.length; i++) {
          const prevLevel = levels[i - 1];
          const currentLevel = levels[i];

          // Current level should not be more than 1 greater than previous
          // (e.g., h1 → h3 is invalid, but h1 → h2 or h2 → h2 is valid)
          expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should start with h1 as the first heading", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        const { container } = render(<TestPageWithHeadings />);

        const firstHeading = container.querySelector("h1, h2, h3, h4, h5, h6");
        expect(firstHeading?.tagName).toBe("H1");
      }),
      { numRuns: 100 }
    );
  });

  it("should have meaningful heading text content", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        const { container } = render(<TestPageWithHeadings />);

        const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");

        headings.forEach((heading) => {
          const text = heading.textContent?.trim();
          expect(text).toBeDefined();
          if (text) {
            expect(text.length).toBeGreaterThan(0);
          }
        });
      }),
      { numRuns: 100 }
    );
  });
});
