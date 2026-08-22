/**
 * Unit tests for CinematicLayers — the expanding glow rings (and rippled
 * haze) layered on top of the colour grade for cinematic filter pulses.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import CinematicLayers from "@/components/FilterPulseOverlay/CinematicLayers";
import type { CinematicSpec } from "@/lib/filterPulses";

const SPEC: CinematicSpec = { rings: 2, distortion: true, durationMs: 6000 };

function renderLayers(spec: Partial<CinematicSpec> = {}, origin = { x: 120, y: 40 }) {
  return render(
    <CinematicLayers
      origin={origin}
      maxRadius={500}
      spec={{ ...SPEC, ...spec }}
      layerStyle={{}}
      active
      gradeClass="fp-grade fp-grade--full"
    />
  );
}

describe("CinematicLayers", () => {
  it("is decorative: aria-hidden, non-interactive, hidden on print", () => {
    renderLayers();
    const wrapper = screen.getByTestId("cinematic-layers");
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(wrapper).toHaveClass("pointer-events-none");
    expect(wrapper).toHaveClass("print:hidden");
  });

  it("renders one ring element per configured ring", () => {
    renderLayers({ rings: 2 });
    expect(screen.getAllByTestId("pulse-ring")).toHaveLength(2);
  });

  it("scales the ring count with the spec", () => {
    renderLayers({ rings: 3 });
    expect(screen.getAllByTestId("pulse-ring")).toHaveLength(3);
  });

  it("gives rings after the first a delayed-variant class", () => {
    renderLayers({ rings: 2 });
    const rings = screen.getAllByTestId("pulse-ring");
    expect(rings[0]).toHaveClass("fp-ring");
    expect(rings[0].className).not.toContain("fp-ring--2");
    expect(rings[1]).toHaveClass("fp-ring--2");
  });

  it("centres each ring on the trigger origin and sizes it to cover the viewport", () => {
    renderLayers({ rings: 1 }, { x: 120, y: 40 });
    const ring = screen.getAllByTestId("pulse-ring")[0];
    // maxRadius 500 -> a 1000px circle offset back by half so its centre sits
    // exactly on the origin.
    expect(ring.style.left).toBe("120px");
    expect(ring.style.top).toBe("40px");
    expect(ring.style.width).toBe("1000px");
    expect(ring.style.height).toBe("1000px");
    expect(ring.style.marginLeft).toBe("-500px");
    expect(ring.style.marginTop).toBe("-500px");
  });

  it("opts the ring layer into the windowed ripple when distortion is enabled", () => {
    // The filter itself is applied by the .fp-rings--rippled keyframes rather
    // than inline, so it only runs across the second-ring window.
    renderLayers({ distortion: true });
    expect(screen.getByTestId("cinematic-layers")).toHaveClass("fp-rings--rippled");
  });

  it("omits the ripple opt-in when distortion is disabled", () => {
    renderLayers({ distortion: false });
    expect(screen.getByTestId("cinematic-layers")).not.toHaveClass("fp-rings--rippled");
  });

  it("only marks the ring layer active while a pulse is running", () => {
    // Layers stay mounted while idle so the clip-path transition has a
    // previous value to animate from; the class is what starts the motion.
    const { rerender } = renderLayers();
    expect(screen.getByTestId("cinematic-layers")).toHaveClass("fp-rings--active");

    rerender(
      <CinematicLayers
        origin={{ x: 120, y: 40 }}
        maxRadius={500}
        spec={SPEC}
        layerStyle={{}}
        active={false}
        gradeClass="fp-grade fp-grade--full"
      />
    );
    expect(screen.getByTestId("cinematic-layers")).not.toHaveClass("fp-rings--active");
    expect(screen.getByTestId("fp-layer-invert")).not.toHaveClass("fp-grade");
  });

  it("renders the three blended grade layers", () => {
    renderLayers();
    expect(screen.getByTestId("fp-layer-invert")).toBeInTheDocument();
    expect(screen.getByTestId("fp-layer-color")).toBeInTheDocument();
    expect(screen.getByTestId("fp-layer-lum")).toBeInTheDocument();
  });
});
