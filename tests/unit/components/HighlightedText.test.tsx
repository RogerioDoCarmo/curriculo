/**
 * Unit tests for HighlightedText component
 * TDD Red phase - tests written before implementation
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import HighlightedText from "@/components/HighlightedText";

describe("HighlightedText Component", () => {
  // 1. Basic highlighting - single occurrence is bolded
  it("should bold a single occurrence of the highlight text", () => {
    render(<HighlightedText text="I love React Native development" highlight="React Native" />);
    const strong = screen.getByText("React Native");
    expect(strong.tagName).toBe("STRONG");
  });

  // 2. Multiple occurrences are all highlighted
  it("should bold all occurrences of the highlight text", () => {
    render(
      <HighlightedText
        text="React Native is great. I use React Native daily."
        highlight="React Native"
      />
    );
    const strongs = screen.getAllByText("React Native");
    expect(strongs).toHaveLength(2);
    strongs.forEach((el) => expect(el.tagName).toBe("STRONG"));
  });

  // 3. Case-insensitive matching
  it("should match highlight text case-insensitively", () => {
    render(<HighlightedText text="I love React Native development" highlight="react native" />);
    const strong = screen.getByText("React Native");
    expect(strong.tagName).toBe("STRONG");
  });

  // 4. Fallback when highlight not found - renders plain text
  it("should render plain text when highlight is not found", () => {
    const { container } = render(
      <HighlightedText text="I love React Native development" highlight="Angular" />
    );
    expect(container).toHaveTextContent("I love React Native development");
    expect(container.querySelectorAll("strong")).toHaveLength(0);
  });

  // 5. Empty highlight string - renders plain text unchanged
  it("should render plain text unchanged when highlight is empty string", () => {
    const { container } = render(
      <HighlightedText text="I love React Native development" highlight="" />
    );
    expect(container).toHaveTextContent("I love React Native development");
    expect(container.querySelectorAll("strong")).toHaveLength(0);
  });

  // 6. Empty text string - renders nothing
  it("should render nothing when text is empty string", () => {
    const { container } = render(<HighlightedText text="" highlight="React Native" />);
    expect(container).toHaveTextContent("");
  });

  // 7. Highlight equals full text - entire text is bolded
  it("should bold the entire text when highlight equals full text", () => {
    render(<HighlightedText text="React Native" highlight="React Native" />);
    const strong = screen.getByText("React Native");
    expect(strong.tagName).toBe("STRONG");
  });

  // 8. Custom className is applied to wrapper
  it("should apply custom className to the wrapper element", () => {
    const { container } = render(
      <HighlightedText
        text="I love React Native development"
        highlight="React Native"
        className="my-custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  // 9. Highlighted parts use <strong> element
  it("should use <strong> element for highlighted parts", () => {
    const { container } = render(
      <HighlightedText text="I love React Native development" highlight="React Native" />
    );
    const strongs = container.querySelectorAll("strong");
    expect(strongs).toHaveLength(1);
    expect(strongs[0].textContent).toBe("React Native");
  });

  // 10. Non-highlighted parts are plain text nodes
  it("should render non-highlighted parts as plain text (not wrapped in strong)", () => {
    const { container } = render(
      <HighlightedText text="I love React Native development" highlight="React Native" />
    );
    const wrapper = container.firstChild as HTMLElement;
    // Check that text nodes exist outside of <strong>
    const textContent = wrapper.textContent;
    expect(textContent).toBe("I love React Native development");
    // The non-highlighted parts should not be inside <strong>
    const strongs = wrapper.querySelectorAll("strong");
    expect(strongs).toHaveLength(1);
    expect(strongs[0].textContent).toBe("React Native");
  });
});
