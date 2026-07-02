/**
 * Unit tests for SkillsSection component
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import SkillsSection from "@/components/SkillsSection";
import type { SkillCategory } from "@/types/index";

// Mock messages for next-intl
const messages: AbstractIntlMessages = {
  sections: {
    skills: "Skills",
  },
  skills: {
    filterLabel: "Filter skills",
    filterPlaceholder: "Search skills...",
    filterAriaLabel: "Filter skills by name",
    noMatch: "No skills match your filter",
    skillsLabel: "skills",
    levelLabel: "Level",
    levels: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
    },
    expandDetails: "Expand skills",
    collapseDetails: "Collapse skills",
  },
};

const sampleSkills: SkillCategory[] = [
  {
    category: "Mobile Development",
    skills: [
      { name: "React Native", level: "expert", yearsOfExperience: 5 },
      { name: "TypeScript", level: "expert", yearsOfExperience: 4 },
    ],
  },
  {
    category: "Frontend Web",
    skills: [
      { name: "Next.js", level: "advanced", yearsOfExperience: 2 },
      { name: "Tailwind CSS", level: "advanced" },
    ],
  },
  {
    category: "Backend",
    skills: [{ name: "Node.js", level: "intermediate" }],
  },
];

// Helper to render with next-intl provider
const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe("SkillsSection Component", () => {
  it("renders all skill categories", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(screen.getByText("Mobile Development")).toBeInTheDocument();
    expect(screen.getByText("Frontend Web")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("renders all skills within categories after expanding a card", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);

    // Skills are collapsed by default — clicking the title toggles the card.
    await user.click(screen.getByRole("button", { name: "Mobile Development" }));
    expect(screen.getByText("React Native")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();

    // Other categories are still collapsed
    expect(screen.queryByText("Next.js")).not.toBeInTheDocument();
    expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
  });

  it("renders skill level indicators when the card is expanded", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);

    // Expand the first card (Mobile Development)
    await user.click(screen.getByRole("button", { name: "Mobile Development" }));
    expect(screen.getAllByText("Expert").length).toBeGreaterThan(0);

    // Cards toggle independently — open Backend to reveal "Intermediate".
    await user.click(screen.getByRole("button", { name: "Backend" }));
    expect(screen.getByText("Intermediate")).toBeInTheDocument();
  });

  it("renders a search/filter input", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
  });

  it("auto-expands cards and filters skills by name when typing in search input", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "React");
    await waitFor(() => {
      // HighlightedText wraps matching text in <strong>, splitting the text across elements
      // Use getByText with a function matcher to find text content across elements
      const reactNativeElement = screen.getByText((_content, element) => {
        return element?.textContent === "React Native" || false;
      });
      expect(reactNativeElement).toBeInTheDocument();
      expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
    });
  });

  it("shows empty state when filter matches nothing", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "zzznomatch");
    await waitFor(() => {
      expect(screen.getByText(/no skills match/i)).toBeInTheDocument();
    });
  });

  it("shows all category titles when filter is cleared", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "React");
    await user.clear(input);
    await waitFor(() => {
      // After clearing the filter cards return to collapsed state;
      // category titles are always visible
      expect(screen.getByText("Backend")).toBeInTheDocument();
      expect(screen.getByText("Frontend Web")).toBeInTheDocument();
    });
  });

  it("renders section with correct id", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(document.getElementById("skills")).toBeInTheDocument();
  });

  it("renders skills in a responsive grid", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("aligns grid items to the start so expanding one card doesn't stretch its row-siblings", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const grid = document.querySelector(".grid");
    expect(grid).toHaveClass("items-start");
  });

  it("stretches an expanded card (self-stretch) so open cards share a row's height", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);

    // Collapsed cards keep their natural height (no self-stretch).
    const firstCard = screen.getByText("Mobile Development").closest("div.rounded-lg");
    expect(firstCard).not.toHaveClass("self-stretch");

    // Expanding the card opts it back into stretch so it matches its row.
    await user.click(screen.getByRole("button", { name: "Mobile Development" }));
    expect(firstCard).toHaveClass("self-stretch");
  });

  it("renders category headings as h3", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    // Should have 3 category h3 headings
    expect(headings.length).toBeGreaterThanOrEqual(3);
    expect(headings.map((h) => h.textContent)).toEqual(
      expect.arrayContaining(["Mobile Development", "Frontend Web", "Backend"])
    );
  });

  it("renders empty skills array gracefully", () => {
    renderWithIntl(<SkillsSection skills={[]} locale="en" />);
    // Should not crash, section heading still present
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("shows a toggle button per category card, labelled by its category", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(sampleSkills.length);
    expect(screen.getByRole("button", { name: "Mobile Development" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Frontend Web" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Backend" })).toBeInTheDocument();
  });

  it("toggles the card by clicking the title, reflecting state in aria-expanded", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const title = screen.getByRole("button", { name: "Mobile Development" });
    expect(title).toHaveAttribute("aria-expanded", "false");

    await user.click(title);
    expect(title).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("React Native")).toBeInTheDocument();

    await user.click(title);
    expect(title).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("React Native")).not.toBeInTheDocument();
  });

  it("keeps previously opened cards open when expanding another (independent toggles)", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);

    // Open the first card (Mobile Development)
    await user.click(screen.getByRole("button", { name: "Mobile Development" }));
    expect(screen.getByText("React Native")).toBeInTheDocument();

    // Open the second card (Frontend Web) — the first stays open
    await user.click(screen.getByRole("button", { name: "Frontend Web" }));
    expect(screen.getByText("React Native")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();

    // Collapsing the second card leaves the first one open
    await user.click(screen.getByRole("button", { name: "Frontend Web" }));
    expect(screen.getByText("React Native")).toBeInTheDocument();
    expect(screen.queryByText("Next.js")).not.toBeInTheDocument();
  });
});
