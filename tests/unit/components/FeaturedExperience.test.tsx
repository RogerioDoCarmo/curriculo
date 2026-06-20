/**
 * Unit tests for the FeaturedExperience section.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import FeaturedExperience from "@/components/FeaturedExperience";
import type { Experience } from "@/types/index";

const messages: AbstractIntlMessages = {
  experience: {
    present: "Present",
    expandDetails: "Expand details",
    collapseDetails: "Collapse details",
    achievements: "Achievements",
    technologies: "Technologies",
    visitWebsite: "Visit website (opens in new tab)",
    featured: "Featured",
    duration: {
      lessThanMonth: "< 1 month",
      year: "yr",
      years: "yrs",
      month: "mo",
      months: "mos",
      separator: "·",
    },
  },
};

const featured: Experience = {
  id: "inct",
  type: "academic",
  organization: "Featured Org",
  role: "Research Member",
  location: "Brazil",
  startDate: "2019-03-01",
  endDate: "2023-03-01",
  // Intro paragraph followed by two bullets (the bullets are the achievements).
  description: "Intro paragraph here.\n- Bullet one\n- Bullet two",
  achievements: ["Bullet one", "Bullet two"],
  technologies: ["GNSS"],
  logo: "/images/logos/logo_inct.png",
  organizationUrl: "https://example.org/inct",
  featured: true,
};

const regular: Experience = {
  id: "reg",
  type: "professional",
  organization: "Plain Co",
  role: "Engineer",
  location: "Remote",
  startDate: "2022-01-01",
  description: "Plain description.",
  achievements: [],
  featured: false,
};

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );

describe("FeaturedExperience", () => {
  it("renders a card for each featured experience with its role and badge", () => {
    renderWithIntl(<FeaturedExperience experiences={[featured, regular]} locale="en" />);
    expect(screen.getByText("Research Member")).toBeInTheDocument();
    // "Featured" appears on the badge (and as the section label).
    expect(screen.getAllByText("Featured").length).toBeGreaterThan(0);
  });

  it("renders nothing when there are no featured experiences", () => {
    renderWithIntl(<FeaturedExperience experiences={[regular]} locale="en" />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.queryByText("Engineer")).not.toBeInTheDocument();
  });

  it("shows the intro paragraph but not the raw bullet markup in the intro", () => {
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);
    expect(screen.getByText("Intro paragraph here.")).toBeInTheDocument();
    // Each bullet appears exactly once (only in the achievements section).
    expect(screen.getAllByText("Bullet one")).toHaveLength(1);
  });

  it("shows the achievements (Conquistas) section by default", () => {
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);
    expect(screen.getByText("Achievements")).toBeInTheDocument();
    expect(screen.getByText("Bullet one")).toBeInTheDocument();
    expect(screen.getByText("Bullet two")).toBeInTheDocument();
  });

  it("hides the achievements section when the toggle is clicked", async () => {
    const user = userEvent.setup();
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);

    const collapse = screen.getByRole("button", { name: /collapse details/i });
    expect(collapse).toHaveAttribute("aria-expanded", "true");

    await user.click(collapse);

    await waitFor(() => {
      expect(screen.queryByText("Bullet one")).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Achievements")).not.toBeInTheDocument();
    // The toggle now offers to expand again.
    expect(screen.getByRole("button", { name: /expand details/i })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("keeps the technology tags visible", () => {
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);
    expect(screen.getByText("GNSS")).toBeInTheDocument();
  });

  it("renders the organization logo linking out to the official site", () => {
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);
    const logo = screen.getByAltText("Featured Org logo");
    expect(logo).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Featured Org — Visit website/i });
    expect(link).toHaveAttribute("href", "https://example.org/inct");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
