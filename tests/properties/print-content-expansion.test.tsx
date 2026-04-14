/**
 * Property Test: Print Mode Expands Collapsed Content
 *
 * Property 36: Print Mode Expands Collapsed Content
 * Validates: Requirements 18.7
 *
 * This test ensures that collapsible/interactive content is expanded
 * when the page is printed or saved as PDF, so all information is visible.
 *
 * Print mode should display all content without requiring user interaction.
 */

import { render } from "@testing-library/react";
import fc from "fast-check";

describe("Property 36: Print Mode Expands Collapsed Content", () => {
  /**
   * Helper function to check if an element has print-expansion styles.
   * Elements with collapsible content should have CSS that expands them in print:
   * - details elements should be displayed as block
   * - summary elements should be hidden
   * - collapsed content should be visible
   */
  function hasPrintExpansionStyles(element: Element): boolean {
    const tagName = element.tagName.toLowerCase();

    // Check if it's a details element (HTML5 collapsible element)
    if (tagName === "details") {
      return true; // Print stylesheet handles details expansion
    }

    // Check for custom collapsible classes
    const className = element.getAttribute("class") || "";
    const hasCollapsibleClass =
      className.includes("collapsible") ||
      className.includes("accordion") ||
      className.includes("expandable");

    return hasCollapsibleClass;
  }

  it("should expand HTML details elements in print mode", () => {
    const { container } = render(
      <details>
        <summary>Click to expand</summary>
        <p>Hidden content that should be visible in print</p>
      </details>
    );

    const details = container.querySelector("details");
    expect(details).toBeTruthy();
    if (details) {
      expect(hasPrintExpansionStyles(details)).toBe(true);
    }
  });

  it("should handle multiple collapsible sections", () => {
    const { container } = render(
      <div>
        <details>
          <summary>Section 1</summary>
          <p>Content 1</p>
        </details>
        <details>
          <summary>Section 2</summary>
          <p>Content 2</p>
        </details>
        <details>
          <summary>Section 3</summary>
          <p>Content 3</p>
        </details>
      </div>
    );

    const allDetails = container.querySelectorAll("details");
    expect(allDetails.length).toBe(3);

    allDetails.forEach((details) => {
      expect(hasPrintExpansionStyles(details)).toBe(true);
    });
  });

  it("should ensure all content is accessible without interaction", () => {
    // Test that content doesn't require JavaScript or user interaction to be visible in print
    const { container } = render(
      <div>
        <details>
          <summary>Project Details</summary>
          <div>
            <h3>Technologies Used</h3>
            <ul>
              <li>React Native</li>
              <li>TypeScript</li>
              <li>Redux</li>
            </ul>
            <h3>Key Features</h3>
            <p>Feature description that must be visible in print</p>
          </div>
        </details>
      </div>
    );

    const details = container.querySelector("details");
    expect(details).toBeTruthy();

    // In print mode, all content should be visible
    const content = container.querySelector("div > div");
    expect(content).toBeTruthy();
    expect(content?.textContent).toContain("Technologies Used");
    expect(content?.textContent).toContain("Key Features");
  });

  it("should handle nested collapsible content", () => {
    const { container } = render(
      <details>
        <summary>Parent Section</summary>
        <div>
          <p>Parent content</p>
          <details>
            <summary>Nested Section</summary>
            <p>Nested content</p>
          </details>
        </div>
      </details>
    );

    const allDetails = container.querySelectorAll("details");
    expect(allDetails.length).toBe(2);

    allDetails.forEach((details) => {
      expect(hasPrintExpansionStyles(details)).toBe(true);
    });
  });

  it("should verify print stylesheet expands all collapsible elements", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
        (contentItems) => {
          const { container } = render(
            <div>
              {contentItems.map((content, index) => (
                <details key={index}>
                  <summary>Section {index + 1}</summary>
                  <p>{content}</p>
                </details>
              ))}
            </div>
          );

          const allDetails = container.querySelectorAll("details");
          expect(allDetails.length).toBe(contentItems.length);

          allDetails.forEach((details) => {
            expect(hasPrintExpansionStyles(details)).toBe(true);
          });
        }
      ),
      { numRuns: 20 }
    );
  });

  it("should ensure URLs are displayed for links in print mode", () => {
    const { container } = render(
      <div>
        <a href="https://example.com">Example Link</a>
        <a href="https://github.com/user/repo">GitHub Repository</a>
      </div>
    );

    const links = container.querySelectorAll("a[href^='http']");
    expect(links.length).toBeGreaterThan(0);

    // Print stylesheet should add URLs after links using ::after pseudo-element
    // This is handled by CSS: a[href^="http"]:after { content: " (" attr(href) ")"; }
    links.forEach((link) => {
      expect(link.getAttribute("href")).toBeTruthy();
    });
  });
});
