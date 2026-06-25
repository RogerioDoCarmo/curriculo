/**
 * Unit tests for the BanksSection logo carousel.
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import BanksSection from "@/components/BanksSection";

const messages: AbstractIntlMessages = {
  banks: {
    title: "Banking Sector Impact",
    subtitle: "Financial institutions whose mobile apps I helped build and maintain.",
    opensInNewTab: "Opens the official site in a new tab",
    previous: "Previous banks",
    next: "Next banks",
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

  it("renders the scrollable carousel track", () => {
    renderWithIntl(<BanksSection />);
    expect(screen.getByTestId("banks-carousel")).toBeInTheDocument();
  });

  it("offers manual previous/next controls to step through the banks", () => {
    renderWithIntl(<BanksSection />);
    expect(screen.getByRole("button", { name: "Previous banks" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next banks" })).toBeInTheDocument();
  });

  it("steps the track when a control is pressed", async () => {
    const user = userEvent.setup();
    renderWithIntl(<BanksSection />);
    const track = screen.getByTestId("banks-carousel");
    const scrollBy = jest.fn();
    // jsdom doesn't implement scrollBy; stub it to assert the control wiring.
    Object.defineProperty(track, "scrollBy", { value: scrollBy, configurable: true });
    await user.click(screen.getByRole("button", { name: "Next banks" }));
    expect(scrollBy).toHaveBeenCalled();
  });

  it("normalizes the scroll position when a control steps past the half-way point", async () => {
    const user = userEvent.setup();
    renderWithIntl(<BanksSection />);
    const track = screen.getByTestId("banks-carousel");
    let left = 500; // into the duplicate copy
    Object.defineProperty(track, "scrollWidth", { configurable: true, get: () => 900 });
    Object.defineProperty(track, "scrollLeft", {
      configurable: true,
      get: () => left,
      set: (v) => {
        left = v;
      },
    });
    Object.defineProperty(track, "scrollBy", {
      configurable: true,
      value: ({ left: dx }: { left: number }) => {
        left += dx;
      },
    });
    await user.click(screen.getByRole("button", { name: "Next banks" }));
    expect(left).toBeLessThan(450); // mapped back into the first copy before stepping
  });

  it("wraps a manual swipe back into the first copy once it settles", () => {
    jest.useFakeTimers();
    try {
      renderWithIntl(<BanksSection />);
      const track = screen.getByTestId("banks-carousel");
      let left = 500; // past the half-width (450) — i.e. into the duplicate copy
      Object.defineProperty(track, "scrollWidth", { configurable: true, get: () => 900 });
      Object.defineProperty(track, "scrollLeft", {
        configurable: true,
        get: () => left,
        set: (v) => {
          left = v;
        },
      });

      // A touch marks the interaction manual (pauses auto-scroll so the wrap runs).
      fireEvent.touchStart(track.parentElement as HTMLElement);
      fireEvent.scroll(track);
      jest.advanceTimersByTime(150);

      expect(left).toBe(50); // 500 - half(450)
    } finally {
      jest.useRealTimers();
    }
  });

  it("auto-advances and wraps the track at the half-way point", () => {
    // Hold the captured frame callback on an object so TS keeps the union type
    // (a plain `let` would be narrowed to its initial `null` at the call site).
    const frame: { cb: FrameRequestCallback | null } = { cb: null };
    const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frame.cb = cb;
      return 1;
    });
    const caf = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    try {
      renderWithIntl(<BanksSection />);
      const track = screen.getByTestId("banks-carousel");
      let left = 449; // one frame short of the half-width (450)
      Object.defineProperty(track, "scrollWidth", { configurable: true, get: () => 900 });
      Object.defineProperty(track, "clientWidth", { configurable: true, get: () => 100 });
      Object.defineProperty(track, "scrollLeft", {
        configurable: true,
        get: () => left,
        set: (v) => {
          left = v;
        },
      });

      // Drive several animation frames; the track advances and wraps past 450.
      for (let i = 0; i < 6; i++) frame.cb?.(0);
      expect(left).toBeLessThan(449);
    } finally {
      raf.mockRestore();
      caf.mockRestore();
    }
  });
});
