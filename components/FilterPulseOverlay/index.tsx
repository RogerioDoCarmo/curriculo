"use client";

/**
 * FilterPulseOverlay component — the full-viewport visual layer driven by
 * useFilterPulse. Applies the active filter's CSS backdrop-filter to
 * whatever's rendered behind it, clipped to a circle that grows/shrinks
 * between the idle and covering phases. Purely decorative: aria-hidden,
 * pointer-events-none, hidden on print. Mount once, near the app root.
 *
 * Two render paths:
 *  - Simple effects (sepia, negative) apply one static backdrop-filter.
 *  - Cinematic effects (the-world) instead let a CSS @keyframes track stage a
 *    multi-beat colour grade, and add expanding glow rings on top.
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

  const style = {
    "--pulse-cx": `${origin.x}px`,
    "--pulse-cy": `${origin.y}px`,
    "--pulse-radius": covering ? `${maxRadius}px` : "0px",
    "--pulse-expand-ms": `${durations.expanding}ms`,
    "--pulse-total": `${total}ms`,
    ...(cinematic ? { "--pulse-blur": `${cinematic.blurPx}px` } : {}),
    // A cinematic pulse's backdrop-filter is owned by the @keyframes track, so
    // it must not also be set inline here; a simple pulse applies it directly.
    ...(cinematic
      ? {}
      : { backdropFilter: activeFilter.filter, WebkitBackdropFilter: activeFilter.filter }),
    // A CSS transition on a property animates over its full duration the
    // moment that property's *value* changes, regardless of whether the
    // change is visually a no-op (a 0px-radius circle renders nothing no
    // matter where it's centered) -- it does not apply instantly just
    // because nothing is drawn yet. While idle, disable the transition
    // outright so useFilterPulse's origin-then-phase two-step commit (see
    // its trigger()) actually repositions instantly instead of quietly
    // animating the position in the background, only to still be mid-flight
    // once the radius transition starts a couple of frames later.
    ...(idle ? { transition: "none" } : {}),
  } as CSSProperties;

  const gradeClass = cinematic && !idle ? ` fp-grade fp-grade--${FLASH_INTENSITY}` : "";

  return (
    <>
      {cinematic?.distortion && <TimeStopFilter />}
      <div
        aria-hidden="true"
        data-testid="filter-pulse-overlay"
        className={`${baseClassName} filter-pulse-overlay${gradeClass}`}
        style={style}
      >
        {cinematic && !idle && (
          <CinematicLayers origin={origin} maxRadius={maxRadius} spec={cinematic} />
        )}
      </div>
    </>
  );
}
