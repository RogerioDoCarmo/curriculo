/**
 * Unit tests for AiStackSection component.
 *
 * Covers rendering of the logo grid, external-link tracking on click, and
 * accessibility (section landmark name, per-tool link labels, image alts).
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import AiStackSection from "@/components/AiStackSection";
import { trackExternalLinkClick } from "@/lib/analytics";

// Mock analytics so we can assert tracking without side effects.
jest.mock("@/lib/analytics", () => ({
  trackExternalLinkClick: jest.fn(),
}));

// Mock next/image to a plain <img>.
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} {...rest} />
  ),
}));

const messages: AbstractIntlMessages = {
  aiStack: {
    title: "Built with AI",
    subtitle: "The AI tools I used to design, build, and ship this site.",
    tools: {
      kiro: { name: "Kiro IDE", role: "Spec-driven scaffolding" },
      claudeCode: { name: "Claude Code", role: "Feature development & refactoring" },
      githubCopilot: { name: "GitHub Copilot", role: "In-editor code completion" },
      chatgpt: { name: "ChatGPT", role: "Research & problem-solving" },
    },
  },
};

const renderSection = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <AiStackSection />
    </NextIntlClientProvider>
  );

const TOOLS = [
  { name: "Kiro IDE", url: "https://kiro.dev" },
  { name: "Claude Code", url: "https://claude.com/claude-code" },
  { name: "GitHub Copilot", url: "https://github.com/features/copilot" },
  { name: "ChatGPT", url: "https://chatgpt.com" },
] as const;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AiStackSection", () => {
  it("renders the heading and subtitle", () => {
    renderSection();
    expect(screen.getByRole("heading", { name: "Built with AI" })).toBeInTheDocument();
    expect(
      screen.getByText("The AI tools I used to design, build, and ship this site.")
    ).toBeInTheDocument();
  });

  it("renders one tile per AI tool with name, role, and logo", () => {
    renderSection();
    const grid = screen.getByTestId("ai-stack-grid");
    expect(within(grid).getAllByRole("listitem")).toHaveLength(TOOLS.length);

    for (const tool of TOOLS) {
      expect(screen.getByText(tool.name)).toBeInTheDocument();
      expect(screen.getByAltText(`${tool.name} logo`)).toBeInTheDocument();
    }
    expect(screen.getByText("Spec-driven scaffolding")).toBeInTheDocument();
  });

  it("links each tool to its official site in a new tab", () => {
    renderSection();
    for (const tool of TOOLS) {
      const link = screen.getByRole("link", { name: new RegExp(`^${escapeRegExp(tool.name)}`) });
      expect(link).toHaveAttribute("href", tool.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("tracks an external-link click with the tool's url and context", async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(screen.getByRole("link", { name: /^Kiro IDE/ }));

    expect(trackExternalLinkClick).toHaveBeenCalledTimes(1);
    expect(trackExternalLinkClick).toHaveBeenCalledWith({
      url: "https://kiro.dev",
      context: "ai_stack_kiro",
    });
  });

  it("exposes an accessible section name and descriptive link labels", () => {
    renderSection();
    expect(screen.getByRole("region", { name: "Built with AI" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Claude Code — Feature development & refactoring (opens in new tab)",
      })
    ).toBeInTheDocument();
  });
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
