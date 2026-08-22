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
      durations: { expanding: 1050, holding: 1575, contracting: 875 },
      activeFilterId: FilterPulseId.Sepia,
    });
    render(<FilterPulseOverlay />);
    const overlay = screen.getByTestId("filter-pulse-overlay");

    expect(overlay.style.getPropertyValue("--pulse-expand-ms")).toBe("1050ms");
    expect(overlay.style.getPropertyValue("--pulse-total")).toBe("3500ms");
  });

  describe("cinematic effects", () => {
    it("grades with blended layers, not an inline backdrop-filter", () => {
      mockFilterPulse({ phase: "expanding", activeFilterId: FilterPulseId.TheWorld });
      render(<FilterPulseOverlay />);

      // Cinematic effects grade via blended sibling layers; a backdrop-filter
      // here would be per-pixel filter passes over the whole viewport every
      // frame (see CinematicLayers for the measurements).
      for (const id of ["fp-layer-invert", "fp-layer-color", "fp-layer-lum"]) {
        const layer = screen.getByTestId(id);
        expect(layer.style.backdropFilter).toBeFalsy();
        expect(layer).toHaveClass("fp-grade");
        expect(layer.className).toMatch(/fp-grade--(full|safe)/);
      }
    });

    it("renders the ring layers while a pulse is in flight", () => {
      mockFilterPulse({ phase: "expanding", activeFilterId: FilterPulseId.TheWorld });
      render(<FilterPulseOverlay />);

      expect(screen.getByTestId("cinematic-layers")).toBeInTheDocument();
      expect(screen.getAllByTestId("pulse-ring")).toHaveLength(2);
    });

    it("keeps the layers mounted while idle but runs no animation", () => {
      // They stay mounted (clipped to a zero-radius circle, so nothing
      // paints) because the clip-path transition needs a previous value to
      // animate from -- swapping in fresh elements made the reveal snap
      // straight to full coverage instead of growing out of the button.
      mockFilterPulse({ phase: "idle", activeFilterId: FilterPulseId.TheWorld, maxRadius: 500 });
      render(<FilterPulseOverlay />);

      expect(screen.getByTestId("cinematic-layers")).toBeInTheDocument();
      expect(screen.getByTestId("cinematic-layers")).not.toHaveClass("fp-rings--active");
      for (const id of ["fp-layer-invert", "fp-layer-color", "fp-layer-lum"]) {
        const layer = screen.getByTestId(id);
        expect(layer).not.toHaveClass("fp-grade");
        expect(layer.style.getPropertyValue("--pulse-radius")).toBe("0px");
      }
    });

    it("shares the clip and timing custom properties across every layer", () => {
      mockFilterPulse({
        phase: "expanding",
        activeFilterId: FilterPulseId.TheWorld,
        origin: { x: 12, y: 34 },
        maxRadius: 500,
        durations: { expanding: 1050, holding: 1575, contracting: 875 },
      });
      render(<FilterPulseOverlay />);

      for (const id of ["fp-layer-invert", "fp-layer-color", "fp-layer-lum"]) {
        const layer = screen.getByTestId(id);
        expect(layer.style.getPropertyValue("--pulse-radius")).toBe("500px");
        expect(layer.style.getPropertyValue("--pulse-cx")).toBe("12px");
        expect(layer.style.getPropertyValue("--pulse-total")).toBe("3500ms");
      }
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
      expect(screen.queryByTestId("fp-layer-invert")).not.toBeInTheDocument();
    });
  });
});
