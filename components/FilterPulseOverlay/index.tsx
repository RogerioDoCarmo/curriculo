"use client";

/**
 * FilterPulseOverlay component — the full-viewport visual layer driven by
 * useFilterPulse. Applies the active filter's CSS backdrop-filter to
 * whatever's rendered behind it, clipped to a circle that grows/shrinks
 * between the idle and covering phases. Purely decorative: aria-hidden,
 * pointer-events-none, hidden on print. Mount once, near the app root.
 */

import type { CSSProperties } from "react";
import { useFilterPulse } from "@/hooks/useFilterPulse";
import { getFilterPulse } from "@/lib/filterPulses";

export default function FilterPulseOverlay() {
  const { phase, origin, maxRadius, activeFilterId, prefersReducedMotion } = useFilterPulse();
  const covering = phase === "expanding" || phase === "holding";
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

  const style = {
    backdropFilter: activeFilter.filter,
    WebkitBackdropFilter: activeFilter.filter,
    "--pulse-cx": `${origin.x}px`,
    "--pulse-cy": `${origin.y}px`,
    "--pulse-radius": covering ? `${maxRadius}px` : "0px",
  } as CSSProperties;

  return (
    <div aria-hidden="true" className={`${baseClassName} filter-pulse-overlay`} style={style} />
  );
}
