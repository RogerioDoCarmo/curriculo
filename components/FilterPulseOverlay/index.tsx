"use client";

/**
 * FilterPulseOverlay component — the full-viewport visual layer driven by
 * useFilterPulse. Purely decorative: aria-hidden, pointer-events-none, hidden
 * on print. Mount once, near the app root.
 *
 * Two render paths:
 *  - Simple effects (sepia, negative) apply one static backdrop-filter to a
 *    single clipped layer.
 *  - Cinematic effects (the-world) instead stage a blended, multi-beat colour
 *    grade plus expanding glow rings (see CinematicLayers for why blend modes
 *    rather than backdrop-filter).
 * prefers-reduced-motion short-circuits both to a plain opacity fade.
 */

import type { CSSProperties } from "react";
import { useFilterPulse } from "@/hooks/useFilterPulse";
import { FLASH_INTENSITY, getFilterPulse } from "@/lib/filterPulses";
import CinematicLayers from "./CinematicLayers";
import TimeStopFilter from "./TimeStopFilter";

export default function FilterPulseOverlay() {
  const { phase, origin, maxRadius, activeFilterId, prefersReducedMotion, durations } =
    useFilterPulse();
  const covering = phase === "expanding" || phase === "holding";
  const idle = phase === "idle";
  const activeFilter = getFilterPulse(activeFilterId);

  const baseClassName = "fixed inset-0 z-[100] pointer-events-none print:hidden";

  if (prefersReducedMotion) {
    const style: CSSProperties = {
      backdropFilter: activeFilter.filter,
      WebkitBackdropFilter: activeFilter.filter,
      opacity: covering ? 1 : 0,
    };
    return (
      <div
        aria-hidden="true"
        className={`${baseClassName} filter-pulse-overlay--reduced-motion`}
        style={style}
      />
    );
  }

  const total = durations.expanding + durations.holding + durations.contracting;
  const cinematic = activeFilter.cinematic;

  const sharedStyle = {
    "--pulse-cx": `${origin.x}px`,
    "--pulse-cy": `${origin.y}px`,
    "--pulse-radius": covering ? `${maxRadius}px` : "0px",
    "--pulse-expand-ms": `${durations.expanding}ms`,
    "--pulse-total": `${total}ms`,
    // A CSS transition on a property animates over its full duration the
    // moment that property's *value* changes, regardless of whether the
    // change is visually a no-op (a 0px-radius circle renders nothing no
    // matter where it's centered). While idle, disable the transition
    // outright so useFilterPulse's origin-then-phase two-step commit (see
    // its trigger()) actually repositions instantly instead of quietly
    // animating the position in the background, only to still be mid-flight
    // once the radius transition starts a couple of frames later.
    ...(idle ? { transition: "none" } : {}),
  } as CSSProperties;

  if (cinematic) {
    // Layers stay mounted even while idle (clipped to a zero-radius circle, so
    // nothing paints): the clip-path transition needs a previous value to
    // animate from, and the keyframe animations restart when the active class
    // is re-added. They also stay mounted through the release, so the grade
    // animates back to neutral rather than snapping the moment holding ends.
    return (
      <>
        {cinematic.distortion && <TimeStopFilter />}
        <CinematicLayers
          origin={origin}
          maxRadius={maxRadius}
          spec={cinematic}
          layerStyle={sharedStyle}
          active={!idle}
          gradeClass={`fp-grade fp-grade--${FLASH_INTENSITY}`}
        />
      </>
    );
  }

  const style = {
    ...sharedStyle,
    backdropFilter: activeFilter.filter,
    WebkitBackdropFilter: activeFilter.filter,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      data-testid="filter-pulse-overlay"
      className={`${baseClassName} filter-pulse-overlay`}
      style={style}
    />
  );
}
