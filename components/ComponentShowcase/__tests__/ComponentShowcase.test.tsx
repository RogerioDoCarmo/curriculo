/**
 * Unit tests for ComponentShowcase component
 *
 * Tests:
 * - Component renders with title and description
 * - Children are rendered correctly
 * - Proper styling and structure
 * - Accessibility attributes
 */

import { render, screen } from "@testing-library/react";
import ComponentShowcase from "../index";

describe("ComponentShowcase", () => {
  const defaultProps = {
    title: "Test Component",
    description: "This is a test component description",
    children: <div data-testid="test-child">Test Child Content</div>,
  };

  it("should render with title and description", () => {
    render(<ComponentShowcase {...defaultProps} />);

    expect(screen.getByText("Test Component")).toBeInTheDocument();
    expect(screen.getByText("This is a test component description")).toBeInTheDocument();
  });

  it("should render children correctly", () => {
    render(<ComponentShowcase {...defaultProps} />);

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });

  it("should have proper semantic structure", () => {
    const { container } = render(<ComponentShowcase {...defaultProps} />);

    // Should be wrapped in a section element
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();

    // Should have heading with proper hierarchy
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Test Component");
  });

  it("should apply correct styling classes", () => {
    const { container } = render(<ComponentShowcase {...defaultProps} />);

    const section = container.querySelector("section");
    expect(section).toHaveClass(
      "rounded-lg",
      "border",
      "border-border",
      "bg-card",
      "p-6",
      "shadow-sm"
    );
  });

  it("should render multiple children", () => {
    render(
      <ComponentShowcase title="Multi-child Test" description="Testing multiple children">
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ComponentShowcase>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("should handle long titles and descriptions", () => {
    const longTitle = "A".repeat(100);
    const longDescription = "B".repeat(500);

    render(
      <ComponentShowcase title={longTitle} description={longDescription}>
        <div>Content</div>
      </ComponentShowcase>
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it("should render with special characters in title and description", () => {
    render(
      <ComponentShowcase
        title="Component <Title> & 'Special' Characters"
        description='Description with "quotes" and & symbols'
      >
        <div>Content</div>
      </ComponentShowcase>
    );

    expect(screen.getByText(/Component <Title> & 'Special' Characters/)).toBeInTheDocument();
    expect(screen.getByText(/Description with "quotes" and & symbols/)).toBeInTheDocument();
  });

  it("should maintain proper spacing between header and content", () => {
    const { container } = render(<ComponentShowcase {...defaultProps} />);

    const header = container.querySelector(".mb-6");
    expect(header).toBeInTheDocument();
  });

  it("should render preview area with correct styling", () => {
    const { container } = render(<ComponentShowcase {...defaultProps} />);

    const previewArea = container.querySelector(".rounded-md.bg-background.p-6");
    expect(previewArea).toBeInTheDocument();
  });
});
