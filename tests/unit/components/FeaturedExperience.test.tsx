/**
 * Unit tests for the FeaturedExperience section.
 */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    images: "Images",
    viewImage: "View image in full screen",
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
  images: [
    {
      src: "/images/inct-project/a.png",
      title: "Raw GNSS data collection",
      description: "Captures raw GNSS data in real time.",
    },
    { src: "/images/inct-project/b.png", title: "RINEX file generation" },
  ],
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

  it("links the role title to the organization site, opening securely in a new tab", () => {
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);
    const roleLink = screen.getByRole("link", { name: "Research Member" });
    expect(roleLink).toHaveAttribute("href", "https://example.org/inct");
    expect(roleLink).toHaveAttribute("target", "_blank");
    expect(roleLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("shows a thumbnail per image and opens a fullscreen lightbox on click", async () => {
    const user = userEvent.setup();
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);

    const thumbs = screen.getAllByRole("button", { name: /view image in full screen/i });
    expect(thumbs).toHaveLength(2);
    // The lightbox is closed until a thumbnail is clicked.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(thumbs[0]);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // The large image is shown with its title (also the alt text) and description.
    expect(screen.getByAltText("Raw GNSS data collection")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Raw GNSS data collection" })).toBeInTheDocument();
    expect(screen.getByText("Captures raw GNSS data in real time.")).toBeInTheDocument();
  });

  it("navigates the lightbox by horizontal swipe, wrapping at the ends", async () => {
    const user = userEvent.setup();
    renderWithIntl(<FeaturedExperience experiences={[featured]} locale="en" />);

    await user.click(screen.getAllByRole("button", { name: /view image in full screen/i })[0]);
    await screen.findByRole("dialog");
    const surface = screen.getByAltText("Raw GNSS data collection").parentElement as HTMLElement;

    // Swipe left → next image.
    fireEvent.touchStart(surface, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(surface, { changedTouches: [{ clientX: 100 }] });
    expect(screen.getByAltText("RINEX file generation")).toBeInTheDocument();

    // Swipe right past the start → wraps back to the last image.
    const surface2 = screen.getByAltText("RINEX file generation").parentElement as HTMLElement;
    fireEvent.touchStart(surface2, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(surface2, { changedTouches: [{ clientX: 220 }] });
    expect(screen.getByAltText("Raw GNSS data collection")).toBeInTheDocument();

    // A short drag under the threshold does not change the image.
    const surface3 = screen.getByAltText("Raw GNSS data collection").parentElement as HTMLElement;
    fireEvent.touchStart(surface3, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(surface3, { changedTouches: [{ clientX: 110 }] });
    expect(screen.getByAltText("Raw GNSS data collection")).toBeInTheDocument();
  });

  it("renders no thumbnails when the experience has no images", () => {
    renderWithIntl(<FeaturedExperience experiences={[{ ...featured, images: [] }]} locale="en" />);
    expect(
      screen.queryByRole("button", { name: /view image in full screen/i })
    ).not.toBeInTheDocument();
  });
});
