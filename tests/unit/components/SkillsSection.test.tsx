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

  it("renders all skills within categories", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(screen.getByText("React Native")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("renders skill level indicators when level is provided", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(screen.getAllByText("expert").length).toBeGreaterThan(0);
    expect(screen.getAllByText("advanced").length).toBeGreaterThan(0);
    expect(screen.getByText("intermediate")).toBeInTheDocument();
  });

  it("renders a search/filter input", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
  });

  it("filters skills by name when typing in search input", async () => {
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

  it("shows all skills when filter is cleared", async () => {
    const user = userEvent.setup();
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "React");
    await user.clear(input);
    await waitFor(() => {
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
  });

  it("renders section with correct id", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(document.getElementById("skills")).toBeInTheDocument();
  });

  it("renders skills in a responsive grid", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    // Grid container should exist
    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("renders category headings as h2 (Card component uses h2)", () => {
    renderWithIntl(<SkillsSection skills={sampleSkills} locale="en" />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    // Should have at least 4 h2 headings: 1 main "Skills" + 3 category headings
    expect(headings.length).toBeGreaterThanOrEqual(4);
  });

  it("renders empty skills array gracefully", () => {
    renderWithIntl(<SkillsSection skills={[]} locale="en" />);
    // Should not crash, just show empty state or nothing
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
