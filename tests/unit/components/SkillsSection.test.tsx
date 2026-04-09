/**
 * Unit tests for SkillsSection component
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SkillsSection from "@/components/SkillsSection";
import type { SkillCategory } from "@/types/index";

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

describe("SkillsSection Component", () => {
  it("renders all skill categories", () => {
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(screen.getByText("Mobile Development")).toBeInTheDocument();
    expect(screen.getByText("Frontend Web")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("renders all skills within categories", () => {
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(screen.getByText("React Native")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("renders skill level indicators when level is provided", () => {
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(screen.getAllByText("expert").length).toBeGreaterThan(0);
    expect(screen.getAllByText("advanced").length).toBeGreaterThan(0);
    expect(screen.getByText("intermediate")).toBeInTheDocument();
  });

  it("renders a search/filter input", () => {
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
  });

  it("filters skills by name when typing in search input", async () => {
    const user = userEvent.setup();
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "React");
    await waitFor(() => {
      expect(screen.getByText("React Native")).toBeInTheDocument();
      expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
    });
  });

  it("shows empty state when filter matches nothing", async () => {
    const user = userEvent.setup();
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "zzznomatch");
    await waitFor(() => {
      expect(screen.getByText(/no skills match/i)).toBeInTheDocument();
    });
  });

  it("shows all skills when filter is cleared", async () => {
    const user = userEvent.setup();
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "React");
    await user.clear(input);
    await waitFor(() => {
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
  });

  it("renders section with correct id", () => {
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    expect(document.getElementById("skills")).toBeInTheDocument();
  });

  it("renders skills in a responsive grid", () => {
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    // Grid container should exist
    const grid = document.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });

  it("renders category headings as h3", () => {
    render(<SkillsSection skills={sampleSkills} locale="en" />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.length).toBeGreaterThanOrEqual(3);
  });

  it("renders empty skills array gracefully", () => {
    render(<SkillsSection skills={[]} locale="en" />);
    // Should not crash, just show empty state or nothing
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});
