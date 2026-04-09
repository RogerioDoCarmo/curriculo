/**
 * Unit tests for ExperienceSection component
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExperienceSection from "@/components/ExperienceSection";
import type { Experience } from "@/types/index";

const professionalExperiences: Experience[] = [
  {
    id: "exp-1",
    type: "professional",
    organization: "Tech Corp",
    role: "Senior Developer",
    location: "Remote",
    startDate: "2022-01-01",
    description: "Led mobile development.",
    achievements: ["Reduced build time by 40%", "Migrated to TypeScript"],
    technologies: ["React Native", "TypeScript"],
  },
  {
    id: "exp-2",
    type: "professional",
    organization: "Startup Inc",
    role: "Junior Developer",
    location: "São Paulo",
    startDate: "2020-06-01",
    endDate: "2021-12-31",
    description: "Built mobile apps.",
    achievements: ["Shipped 3 apps"],
    technologies: ["React Native"],
  },
];

const academicExperiences: Experience[] = [
  {
    id: "exp-3",
    type: "academic",
    organization: "State University",
    role: "MSc Student",
    location: "São Paulo",
    startDate: "2019-03-01",
    endDate: "2021-12-01",
    description: "Research in distributed systems.",
    achievements: ["Published 2 papers"],
  },
];

const allExperiences = [...professionalExperiences, ...academicExperiences];

describe("ExperienceSection Component", () => {
  it("renders professional experiences when careerPath='professional'", () => {
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    expect(screen.getAllByText("Senior Developer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Junior Developer").length).toBeGreaterThan(0);
    expect(screen.queryByText("MSc Student")).not.toBeInTheDocument();
  });

  it("renders academic experiences when careerPath='academic'", () => {
    render(<ExperienceSection careerPath="academic" experiences={allExperiences} locale="en" />);
    expect(screen.getAllByText("MSc Student").length).toBeGreaterThan(0);
    expect(screen.queryByText("Senior Developer")).not.toBeInTheDocument();
  });

  it("shows organization and location for each experience", () => {
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    expect(screen.getAllByText(/Tech Corp/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Remote/).length).toBeGreaterThan(0);
  });

  it("shows description for each experience", () => {
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    expect(screen.getAllByText("Led mobile development.").length).toBeGreaterThan(0);
  });

  it("shows duration for each experience", () => {
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    // Duration should be displayed (e.g., "1 yr 6 mo" or similar)
    const durationTexts = document.querySelectorAll("p");
    const hasDuration = Array.from(durationTexts).some(
      (p) => p.textContent?.includes("yr") || p.textContent?.includes("mo")
    );
    expect(hasDuration).toBe(true);
  });

  it("shows 'Present' for current positions (no endDate)", () => {
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    expect(screen.getAllByText(/Present/).length).toBeGreaterThan(0);
  });

  it("expands details when expand button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    const expandButtons = screen.getAllByRole("button", { name: /expand details/i });
    await user.click(expandButtons[0]);
    await waitFor(() => {
      expect(screen.getByText("Reduced build time by 40%")).toBeInTheDocument();
    });
  });

  it("collapses details when expand button is clicked again", async () => {
    const user = userEvent.setup();
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    const expandButtons = screen.getAllByRole("button", { name: /expand details/i });
    // Expand
    await user.click(expandButtons[0]);
    await waitFor(() => {
      expect(screen.getByText("Reduced build time by 40%")).toBeInTheDocument();
    });
    // Collapse
    const collapseButton = screen.getByRole("button", { name: /collapse details/i });
    await user.click(collapseButton);
    await waitFor(() => {
      expect(screen.queryByText("Reduced build time by 40%")).not.toBeInTheDocument();
    });
  });

  it("shows technologies in expanded view", async () => {
    const user = userEvent.setup();
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    const expandButtons = screen.getAllByRole("button", { name: /expand details/i });
    await user.click(expandButtons[0]);
    await waitFor(() => {
      expect(screen.getByText("React Native")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
  });

  it("shows empty state when no experiences match career path", () => {
    render(
      <ExperienceSection careerPath="academic" experiences={professionalExperiences} locale="en" />
    );
    expect(screen.getByText(/no experiences/i)).toBeInTheDocument();
  });

  it("renders section with correct id", () => {
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    expect(document.getElementById("experience")).toBeInTheDocument();
  });

  it("renders a Timeline component for the experiences", () => {
    render(
      <ExperienceSection careerPath="professional" experiences={allExperiences} locale="en" />
    );
    // Timeline renders an ordered list
    const list = screen.getByRole("list", { name: /timeline/i });
    expect(list).toBeInTheDocument();
  });
});
