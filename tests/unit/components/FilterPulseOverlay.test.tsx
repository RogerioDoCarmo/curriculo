/**
 * Unit tests for FilterPulseOverlay component.
 * Verifies the decorative/aria-hidden nature of the overlay and that its
 * inline style reflects the current phase, origin, and active filter —
 * including the reduced-motion branch.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import FilterPulseOverlay from "@/components/FilterPulseOverlay";
import * as useFilterPulseModule from "@/hooks/useFilterPulse";
import { FilterPulseId, getFilterPulse } from "@/lib/filterPulses";

function mockFilterPulse(
  overrides: Partial<ReturnType<typeof useFilterPulseModule.useFilterPulse>>
) {
  jest.spyOn(useFilterPulseModule, "useFilterPulse").mockReturnValue({
    phase: "idle",
    origin: { x: 0, y: 0 },
    maxRadius: 0,
    activeFilterId: FilterPulseId.Sepia,
    prefersReducedMotion: false,
    durations: { expanding: 1200, holding: 700, contracting: 1200 },
    trigger: jest.fn(),
    ...overrides,
  });
}

describe("FilterPulseOverlay Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("is decorative: aria-hidden, no accessible role, non-interactive", () => {
    mockFilterPulse({});
    const { container } = render(<FilterPulseOverlay />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay).toHaveClass("pointer-events-none");
    expect(overlay).toHaveClass("print:hidden");
  });

  it("clips to nothing while idle", () => {
    mockFilterPulse({ phase: "idle", maxRadius: 300 });
    const { container } = render(<FilterPulseOverlay />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay.style.getPropertyValue("--pulse-radius")).toBe("0px");
  });

  it("clips to the full computed radius while expanding/holding", () => {
    mockFilterPulse({ phase: "expanding", origin: { x: 12, y: 34 }, maxRadius: 567 });
    const { container } = render(<FilterPulseOverlay />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay.style.getPropertyValue("--pulse-radius")).toBe("567px");
    expect(overlay.style.getPropertyValue("--pulse-cx")).toBe("12px");
    expect(overlay.style.getPropertyValue("--pulse-cy")).toBe("34px");
  });

  it("applies the active filter's CSS via backdrop-filter", () => {
    mockFilterPulse({ activeFilterId: FilterPulseId.Sepia });
    const { container } = render(<FilterPulseOverlay />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay.style.backdropFilter).toBe(getFilterPulse(FilterPulseId.Sepia).filter);
  });

  it("applies the negative filter's CSS via backdrop-filter", () => {
    mockFilterPulse({ activeFilterId: FilterPulseId.Negative });
    const { container } = render(<FilterPulseOverlay />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay.style.backdropFilter).toBe(getFilterPulse(FilterPulseId.Negative).filter);
  });

  it("switches to the reduced-motion class and skips spatial custom properties", () => {
    mockFilterPulse({ phase: "expanding", prefersReducedMotion: true, maxRadius: 400 });
    const { container } = render(<FilterPulseOverlay />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay).toHaveClass("filter-pulse-overlay--reduced-motion");
    expect(overlay).not.toHaveClass("filter-pulse-overlay");
    expect(overlay.style.getPropertyValue("--pulse-radius")).toBe("");
    expect(overlay.style.opacity).toBe("1");
  });

  it("fades to 0 opacity when idle under reduced motion", () => {
    mockFilterPulse({ phase: "idle", prefersReducedMotion: true });
    const { container } = render(<FilterPulseOverlay />);
    const overlay = container.firstElementChild as HTMLElement;

    expect(overlay.style.opacity).toBe("0");
  });

  it("exposes the phase timings to CSS so the registry's duration reaches the stylesheet", () => {
    mockFilterPulse({
      phase: "expanding",
      durations: { expanding: 1800, holding: 2700, contracting: 1500 },
    });
    render(<FilterPulseOverlay />);
    const overlay = screen.getByTestId("filter-pulse-overlay");

    expect(overlay.style.getPropertyValue("--pulse-expand-ms")).toBe("1800ms");
    expect(overlay.style.getPropertyValue("--pulse-total")).toBe("6000ms");
  });

  describe("cinematic effects", () => {
    it("hands the grade over to the keyframe track instead of an inline backdrop-filter", () => {
      mockFilterPulse({ phase: "expanding", activeFilterId: FilterPulseId.TheWorld });
      render(<FilterPulseOverlay />);
      const overlay = screen.getByTestId("filter-pulse-overlay");

      // The @keyframes track owns backdrop-filter for cinematic effects;
      // setting it inline as well would be a competing declaration.
      // (jsdom reports an unset property as undefined rather than "".)
      expect(overlay.style.backdropFilter).toBeFalsy();
      expect(overlay).toHaveClass("fp-grade");
      expect(overlay.className).toMatch(/fp-grade--(full|safe)/);
    });

    it("renders the ring layers and the ripple filter while a pulse is in flight", () => {
      mockFilterPulse({ phase: "expanding", activeFilterId: FilterPulseId.TheWorld });
      render(<FilterPulseOverlay />);

      expect(screen.getByTestId("cinematic-layers")).toBeInTheDocument();
      expect(screen.getAllByTestId("pulse-ring")).toHaveLength(2);
      expect(screen.getByTestId("time-stop-filter")).toBeInTheDocument();
    });

    it("does not run the grade or render rings while idle", () => {
      mockFilterPulse({ phase: "idle", activeFilterId: FilterPulseId.TheWorld });
      render(<FilterPulseOverlay />);
      const overlay = screen.getByTestId("filter-pulse-overlay");

      expect(overlay).not.toHaveClass("fp-grade");
      expect(screen.queryByTestId("cinematic-layers")).not.toBeInTheDocument();
    });

    it("exposes the configured blur radius to CSS", () => {
      mockFilterPulse({ phase: "expanding", activeFilterId: FilterPulseId.TheWorld });
      render(<FilterPulseOverlay />);
      const overlay = screen.getByTestId("filter-pulse-overlay");

      expect(overlay.style.getPropertyValue("--pulse-blur")).toBe("6px");
    });

    it("falls back to the settled grade, with no rings, under reduced motion", () => {
      mockFilterPulse({
        phase: "expanding",
        activeFilterId: FilterPulseId.TheWorld,
        prefersReducedMotion: true,
      });
      const { container } = render(<FilterPulseOverlay />);
      const overlay = container.firstElementChild as HTMLElement;

      expect(overlay).toHaveClass("filter-pulse-overlay--reduced-motion");
      expect(overlay.style.backdropFilter).toBe(getFilterPulse(FilterPulseId.TheWorld).filter);
      expect(screen.queryByTestId("cinematic-layers")).not.toBeInTheDocument();
    });
  });
});
