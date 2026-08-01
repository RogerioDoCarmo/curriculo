/**
 * Unit tests for HighlightedText component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import HighlightedText from "@/components/HighlightedText";

describe("HighlightedText Component", () => {
  it("renders text without highlighting when highlight is empty", () => {
    render(<HighlightedText text="Hello World" highlight="" />);

    expect(screen.getByText("Hello World")).toBeInTheDocument();
    const strong = screen.queryByRole("strong");
    expect(strong).not.toBeInTheDocument();
  });

  it("renders text without highlighting when text is empty", () => {
    const { container } = render(<HighlightedText text="" highlight="test" />);

    expect(container.textContent).toBe("");
  });

  it.each([
    ["case-insensitively", "React Native", "react", "React"],
    ["with different case", "TypeScript", "SCRIPT", "Script"],
    ["special regex characters", "C++ Programming", "C++", "C++"],
    ["parentheses", "Function (test)", "(test)", "(test)"],
    ["brackets", "Array [1, 2, 3]", "[1, 2, 3]", "[1, 2, 3]"],
    ["surrounded by whitespace", "  React   Native  ", "React", "React"],
  ] as const)("highlights matching text %s", (_label, text, highlight, expectedText) => {
    const { container } = render(<HighlightedText text={text} highlight={highlight} />);
    const strong = container.querySelector("strong");
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent(expectedText);
  });

  it("highlights multiple occurrences", () => {
    const { container } = render(
      <HighlightedText text="React is great, React is awesome" highlight="React" />
    );

    const strongs = container.querySelectorAll("strong");
    expect(strongs).toHaveLength(2);
    expect(strongs[0]).toHaveTextContent("React");
    expect(strongs[1]).toHaveTextContent("React");
  });

  it("applies custom className to wrapper span", () => {
    const { container } = render(
      <HighlightedText text="Test" highlight="" className="custom-class" />
    );

    const span = container.querySelector("span");
    expect(span).toHaveClass("custom-class");
  });

  it("preserves non-matching text", () => {
    const { container } = render(<HighlightedText text="Hello World" highlight="World" />);

    expect(container.textContent).toBe("Hello World");
    const strong = container.querySelector("strong");
    expect(strong).toHaveTextContent("World");
  });

  it("handles partial word matches", () => {
    const { container } = render(<HighlightedText text="JavaScript" highlight="Script" />);

    const strong = container.querySelector("strong");
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent("Script");
    expect(container.textContent).toBe("JavaScript");
  });

  it("does not highlight when no match found", () => {
    const { container } = render(<HighlightedText text="Hello World" highlight="xyz" />);

    const strong = container.querySelector("strong");
    expect(strong).not.toBeInTheDocument();
    expect(container.textContent).toBe("Hello World");
  });

  it("renders correctly with className and highlighting", () => {
    const { container } = render(
      <HighlightedText text="React Native" highlight="React" className="text-blue-500" />
    );

    const span = container.querySelector("span");
    expect(span).toHaveClass("text-blue-500");

    const strong = container.querySelector("strong");
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent("React");
  });
});
