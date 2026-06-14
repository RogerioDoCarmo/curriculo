/**
 * Unit tests for MarkdownText component
 *
 * Covers the lightweight markdown parser: headings (h1-h6), bold, links,
 * bullet and numbered lists, and plain paragraphs. Also guards the regex
 * behavior hardened against ReDoS (\S-anchored captures, delimiter-excluding
 * character classes).
 */

import { render, screen } from "@testing-library/react";
import MarkdownText from "@/components/MarkdownText";

describe("MarkdownText Component", () => {
  it("renders plain text as a paragraph", () => {
    render(<MarkdownText text="Just a sentence." />);
    expect(screen.getByText("Just a sentence.")).toBeInTheDocument();
  });

  it("applies the provided className to the wrapper", () => {
    const { container } = render(<MarkdownText text="Hello" className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it.each([
    ["# H1", "H1", "h1"],
    ["## H2", "H2", "h2"],
    ["### H3", "H3", "h3"],
    ["#### H4", "H4", "h4"],
    ["##### H5", "H5", "h5"],
    ["###### H6", "H6", "h6"],
  ])("renders %s as the correct heading level", (input, label, tag) => {
    render(<MarkdownText text={input} />);
    const heading = screen.getByText(label);
    expect(heading.tagName.toLowerCase()).toBe(tag);
  });

  it("preserves spaces within heading content", () => {
    render(<MarkdownText text="## Hello   World" />);
    // textContent (not the whitespace-normalizing text matcher) verifies the
    // internal spacing the \S-anchored capture keeps intact.
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Hello   World");
  });

  it("treats a hash without following whitespace as plain text", () => {
    render(<MarkdownText text="#NoSpace" />);
    const node = screen.getByText("#NoSpace");
    expect(node.tagName.toLowerCase()).toBe("p");
  });

  it("renders bold text with a <strong> element", () => {
    render(<MarkdownText text="This is **bold** text" />);
    const strong = screen.getByText("bold");
    expect(strong.tagName.toLowerCase()).toBe("strong");
  });

  it("renders links with safe target/rel attributes", () => {
    render(<MarkdownText text="See [my site](https://example.com) here" />);
    const link = screen.getByRole("link", { name: "my site" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders bullet list items", () => {
    render(<MarkdownText text={"- First\n- Second"} />);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders numbered list items keeping their number", () => {
    render(<MarkdownText text={"1. Alpha\n2. Beta"} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText("2.")).toBeInTheDocument();
  });

  it("renders mixed heading, bold and link content together", () => {
    render(<MarkdownText text={"## Title\nIntro with **emphasis** and [link](https://a.co)"} />);
    expect(screen.getByText("Title").tagName.toLowerCase()).toBe("h2");
    expect(screen.getByText("emphasis").tagName.toLowerCase()).toBe("strong");
    expect(screen.getByRole("link", { name: "link" })).toHaveAttribute("href", "https://a.co");
  });

  it("handles long whitespace-heavy input without hanging (ReDoS guard)", () => {
    // A pathological line that previously risked super-linear backtracking.
    const input = "###" + " ".repeat(50000) + "x";
    const start = Date.now();
    render(<MarkdownText text={input} />);
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
