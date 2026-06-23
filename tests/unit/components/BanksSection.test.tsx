/**
 * Unit tests for the BanksSection logo carousel.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import BanksSection from "@/components/BanksSection";

const messages: AbstractIntlMessages = {
  banks: {
    title: "Banking Sector Impact",
    subtitle: "Financial institutions whose mobile apps I helped build and maintain.",
    opensInNewTab: "Opens the official site in a new tab",
  },
};

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );

const BANK_NAMES = [
  "Banco do Nordeste",
  "CrediSIS",
  "Bradescard",
  "Banco Macro",
  "Banco Digimais",
  "Virtus Pay",
];

describe("BanksSection", () => {
  it("renders the section heading and subtitle", () => {
    renderWithIntl(<BanksSection />);
    expect(screen.getByRole("heading", { name: "Banking Sector Impact" })).toBeInTheDocument();
    expect(screen.getByText(/Financial institutions whose mobile apps/i)).toBeInTheDocument();
  });

  it("exposes the section as a labelled landmark", () => {
    renderWithIntl(<BanksSection />);
    expect(screen.getByRole("region", { name: "Banking Sector Impact" })).toBeInTheDocument();
  });

  it("renders one accessible logo per bank with descriptive alt text", () => {
    renderWithIntl(<BanksSection />);
    for (const name of BANK_NAMES) {
      // The duplicate (loop) copies use empty alt text, so each name resolves once.
      expect(screen.getByAltText(`${name} logo`)).toBeInTheDocument();
    }
  });

  it("links each bank to its official site, opening in a new tab securely", () => {
    renderWithIntl(<BanksSection />);
    const bnb = screen.getByRole("link", { name: /Banco do Nordeste \(Brasil\)/i });
    expect(bnb).toHaveAttribute("href", "https://www.bnb.gov.br/");
    expect(bnb).toHaveAttribute("target", "_blank");
    // Security best practice: every external link drops the opener and referrer.
    const rel = bnb.getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  it("every external link opens in a new tab with noopener noreferrer", () => {
    renderWithIntl(<BanksSection />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      const rel = link.getAttribute("rel") ?? "";
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  it("shows a new-tab tooltip and announces it to assistive tech", () => {
    renderWithIntl(<BanksSection />);
    const bnb = screen.getByRole("link", { name: /Banco do Nordeste \(Brasil\)/i });
    // Visual tooltip via title, plus the note in the accessible name.
    expect(bnb).toHaveAttribute("title", "Opens the official site in a new tab");
    expect(bnb).toHaveAccessibleName(/opens the official site in a new tab/i);
  });

  it("hides the duplicated loop copies from assistive tech", () => {
    const { container } = renderWithIntl(<BanksSection />);
    // The DOM holds two copies (12 anchors) for a seamless marquee, but only the
    // six real ones are exposed as links to assistive technology.
    expect(container.querySelectorAll("a")).toHaveLength(12);
    expect(screen.getAllByRole("link")).toHaveLength(6);
  });

  it("renders a country flag on each card (Mexico, Argentina, Brazil)", () => {
    const { container } = renderWithIntl(<BanksSection />);
    // Bradescard → Mexico, Banco Macro → Argentina, the rest → Brazil.
    expect(container.querySelector('img[src*="/flags/mx.svg"]')).not.toBeNull();
    expect(container.querySelector('img[src*="/flags/ar.svg"]')).not.toBeNull();
    expect(container.querySelector('img[src*="/flags/br.svg"]')).not.toBeNull();
    // One flag per card, across both the real and the duplicated loop copies.
    expect(container.querySelectorAll('img[src*="/images/flags/"]')).toHaveLength(12);
  });

  it("renders the banks left-to-right in the configured order", () => {
    renderWithIntl(<BanksSection />);
    const names = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("aria-label")?.split(" (")[0]);
    expect(names).toEqual([
      "Virtus Pay",
      "Banco Digimais",
      "CrediSIS",
      "Bradescard",
      "Banco Macro",
      "Banco do Nordeste",
    ]);
  });

  it("renders the auto-scrolling track", () => {
    renderWithIntl(<BanksSection />);
    expect(screen.getByTestId("banks-carousel").querySelector(".animate-marquee")).not.toBeNull();
  });
});
