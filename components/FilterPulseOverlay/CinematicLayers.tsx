"use client";

/**
 * CinematicLayers — the expanding glow rings (and rippled haze) that ride on
 * top of the colour grade for cinematic filter pulses.
 *
 * Purely decorative: aria-hidden and pointer-events-none throughout. Rendered
 * only while a pulse is in flight, and never under prefers-reduced-motion
 * (the overlay falls back to a plain opacity fade there).
 *
 * Each ring is a bordered circle scaled from 0 -> 1 with its transform-origin
 * at the click point. Scaling (rather than redrawing a gradient) keeps the
 * work on the compositor, and it thickens the ring as it grows -- which is
 * what the reference footage does between frames 38 and 39.
 */

import type { CSSProperties } from "react";
import type { CinematicSpec } from "@/lib/filterPulses";
import { TIME_STOP_FILTER_ID } from "./TimeStopFilter";
import type { FilterPulseOrigin } from "@/hooks/useFilterPulse";

interface CinematicLayersProps {
  readonly origin: FilterPulseOrigin;
  readonly maxRadius: number;
  readonly spec: CinematicSpec;
}

export default function CinematicLayers({ origin, maxRadius, spec }: CinematicLayersProps) {
  const diameter = maxRadius * 2;

  const wrapperStyle = spec.distortion
    ? ({ filter: `url(#${TIME_STOP_FILTER_ID})` } as CSSProperties)
    : undefined;

  return (
    <div
      aria-hidden="true"
      data-testid="cinematic-layers"
      className="pointer-events-none absolute inset-0 overflow-hidden print:hidden"
      style={wrapperStyle}
    >
      {Array.from({ length: spec.rings }, (_, i) => (
        <span
          key={i}
          data-testid="pulse-ring"
          className={`fp-ring${i > 0 ? ` fp-ring--${i + 1}` : ""}`}
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
      ))}
    </div>
  );
}
