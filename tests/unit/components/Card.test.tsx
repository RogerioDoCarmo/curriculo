/**
 * Unit tests for Card component
 * Requirements: 4.4
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "@/components/Card";

describe("Card Component", () => {
  it("renders children content", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(<Card title="My Title">Content</Card>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("does not render title element when title is not provided", () => {
    render(<Card>Content</Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with default styling classes", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass("rounded-lg");
    expect(container.firstChild).toHaveClass("shadow-md");
  });

  it("renders multiple children", () => {
    render(
      <Card>
        <span>Child 1</span>
        <span>Child 2</span>
      </Card>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("renders title as h2 heading", () => {
    render(<Card title="Section Title">Content</Card>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Section Title");
  });

  it("has hover shadow transition class", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass("hover:shadow-lg");
  });

  it("has dark mode background class", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass("dark:bg-gray-800");
  });
});
