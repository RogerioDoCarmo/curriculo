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
  },
};

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );

const BANK_NAMES = ["Banco do Nordeste", "CrediSIS", "Bradescard", "Banco Macro"];

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

  it("links each bank to its official site, opening in a new tab", () => {
    renderWithIntl(<BanksSection />);
    const bnb = screen.getByRole("link", { name: /Banco do Nordeste \(Brasil\)/i });
    expect(bnb).toHaveAttribute("href", "https://www.bnb.gov.br/");
    expect(bnb).toHaveAttribute("target", "_blank");
    expect(bnb).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("hides the duplicated loop copies from assistive tech", () => {
    const { container } = renderWithIntl(<BanksSection />);
    // The DOM holds two copies (8 anchors) for a seamless marquee, but only the
    // four real ones are exposed as links to assistive technology.
    expect(container.querySelectorAll("a")).toHaveLength(8);
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("renders the auto-scrolling track", () => {
    renderWithIntl(<BanksSection />);
    expect(screen.getByTestId("banks-carousel").querySelector(".animate-marquee")).not.toBeNull();
  });
});
