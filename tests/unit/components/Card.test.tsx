/**
 * Unit tests for Card component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "@/components/Card";

describe("Card Component", () => {
  it("renders children correctly", () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders with title when provided", () => {
    render(
      <Card title="Test Title">
        <p>Test content</p>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders without title when not provided", () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );

    const headings = screen.queryAllByRole("heading");
    expect(headings.length).toBe(0);
  });

  it("applies custom className", () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Test content</p>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass("custom-class");
  });

  it("has default styling classes", () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("bg-white");
    expect(card).toHaveClass("p-6");
    expect(card).toHaveClass("shadow-md");
  });

  it("has dark mode classes", () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass("dark:bg-gray-800");
  });

  it("has hover effect classes", () => {
    const { container } = render(
      <Card>
        <p>Test content</p>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass("hover:shadow-lg");
    expect(card).toHaveClass("hover:border-primary-100");
  });

  it("renders title as h2 heading", () => {
    render(
      <Card title="Test Title">
        <p>Test content</p>
      </Card>
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Test Title");
  });

  it("title has correct styling classes", () => {
    render(
      <Card title="Test Title">
        <p>Test content</p>
      </Card>
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("mb-4");
    expect(heading).toHaveClass("text-xl");
    expect(heading).toHaveClass("font-semibold");
  });

  it("renders multiple children", () => {
    render(
      <Card>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <button>Click me</button>
      </Card>
    );

    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("combines custom className with default classes", () => {
    const { container } = render(
      <Card className="my-custom-class">
        <p>Test content</p>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass("my-custom-class");
    expect(card).toHaveClass("rounded-lg"); // default class still present
  });
});
