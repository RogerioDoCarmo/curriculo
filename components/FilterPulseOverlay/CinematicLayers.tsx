"use client";

/**
 * CinematicLayers — the blended colour-grade layers and expanding glow rings
 * that make up a cinematic filter pulse.
 *
 * Purely decorative: aria-hidden and pointer-events-none throughout. Rendered
 * only while a pulse is covering, and never under prefers-reduced-motion
 * (the overlay falls back to a plain opacity fade there).
 *
 * ── Why blend modes instead of backdrop-filter ──────────────────────────────
 * The grade was originally an animated 8-function `backdrop-filter`. Measured
 * on a production build, that ran the whole effect at ~18fps with 34 frames
 * over 100ms, against an idle-page baseline of 120fps and zero stalls. The
 * cost scales with the *number of filter functions* (8 fn -> 21.6fps, 2 fn ->
 * 36.7fps, none -> 59fps) and not with animating them -- a static 8-function
 * chain was just as slow, so it is per-pixel filter passes over the full
 * viewport every frame, not the interpolation.
 *
 * Blend modes are compositor work rather than per-pixel filter passes, and
 * every beat of the reference grade maps onto one:
 *   - `difference` against black..white  = a smooth 0..100% invert ramp,
 *     which is the chartreuse/violet complementary beat (frames 50-57).
 *   - `color` takes hue+saturation from the overlay, so a grey overlay
 *     desaturates and a violet one imposes the stopped-time cast.
 *   - a plain `normal` rgba layer gives the white ring flashes and the final
 *     dark wash.
 * Only background-color animates, which is cheap.
 *
 * The ripple is applied for a short window rather than the whole pulse (see
 * .fp-rings--rippled in globals.css): a full-viewport feDisplacementMap is a
 * per-pixel gather and measured at 42fps with 15 stalls vs 66fps and none
 * without it. In the reference it only appears around the second ring
 * (frames 58-64) anyway, so windowing it is the more faithful option too.
 *
 * ── Why these are siblings, not nested ──────────────────────────────────────
 * `mix-blend-mode` blends an element with its parent stacking context's
 * backdrop. Nesting these inside the positioned, z-indexed overlay div would
 * make them blend against that div's own (transparent) background instead of
 * the page, silently producing nothing. They must sit at the same level.
 */

import type { CSSProperties } from "react";
import type { CinematicSpec } from "@/lib/filterPulses";
import type { FilterPulseOrigin } from "@/hooks/useFilterPulse";

interface CinematicLayersProps {
  readonly origin: FilterPulseOrigin;
  readonly maxRadius: number;
  readonly spec: CinematicSpec;
  /** Shared clip + timing custom properties, applied to every layer. */
  readonly layerStyle: CSSProperties;
  /**
   * False while idle. The layers stay mounted either way -- a CSS transition
   * needs a previous value to animate from, and swapping in freshly-mounted
   * elements made the clip-path reveal snap straight to full coverage instead
   * of growing out of the button. Toggling the class instead both preserves
   * the transition and restarts the keyframe animations on each pulse.
   */
  readonly active: boolean;
  readonly gradeClass: string;
}

export default function CinematicLayers({
  origin,
  maxRadius,
  spec,
  layerStyle,
  active,
  gradeClass,
}: CinematicLayersProps) {
  const diameter = maxRadius * 2;
  const base = "fixed inset-0 z-[100] pointer-events-none print:hidden filter-pulse-overlay";
  const grade = active ? ` ${gradeClass}` : "";

  return (
    <>
      {/* Complementary/invert beat. difference vs black is a no-op, vs white
          is a full invert, so animating the colour ramps the invert smoothly. */}
      <div
        aria-hidden="true"
        data-testid="fp-layer-invert"
        className={`${base} fp-invert${grade}`}
        style={layerStyle}
      />
      {/* Hue + saturation: grey desaturates, violet/chartreuse tints. */}
      <div
        aria-hidden="true"
        data-testid="fp-layer-color"
        className={`${base} fp-color${grade}`}
        style={layerStyle}
      />
      {/* Luminance: white flashes and the final dark "stopped time" wash. */}
      <div
        aria-hidden="true"
        data-testid="fp-layer-lum"
        className={`${base} fp-lum${grade}`}
        style={layerStyle}
      />
      {/* Rings sit above the grade and are not blended. */}
      <div
        aria-hidden="true"
        data-testid="cinematic-layers"
        className={`${base} overflow-hidden fp-rings${active ? " fp-rings--active" : ""}${
          spec.distortion ? " fp-rings--rippled" : ""
        }`}
        style={layerStyle}
      >
        {Array.from({ length: spec.rings }, (_, i) => {
          // Extracted rather than inlined: a template literal nested inside
          // another one is hard to read (Sonar S4624).
          const ringVariant = i > 0 ? ` fp-ring--${i + 1}` : "";
          return (
            <span
              key={i}
              data-testid="pulse-ring"
              className={`fp-ring${ringVariant}`}
              style={
                {
                  left: `${origin.x}px`,
                  top: `${origin.y}px`,
                  width: `${diameter}px`,
                  height: `${diameter}px`,
                  marginLeft: `${-maxRadius}px`,
                  marginTop: `${-maxRadius}px`,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
    </>
  );
}
