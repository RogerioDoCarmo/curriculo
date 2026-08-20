"use client";

/**
 * useFilterPulse hook and FilterPulseProvider — drives a one-shot circular
 * "filter pulse" animation: a circle grows from a trigger origin, applying a
 * registered CSS filter (see lib/filterPulses.ts) to the page, then shrinks
 * back and undoes it. No persisted state — always starts idle.
 */

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  createContext,
  useContext,
} from "react";
import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DEFAULT_FILTER_PULSE_ID, type FilterPulseId } from "@/lib/filterPulses";

export type FilterPulsePhase = "idle" | "expanding" | "holding" | "contracting";

export interface FilterPulseOrigin {
  readonly x: number;
  readonly y: number;
}

const DURATIONS = {
  full: { expanding: 600, holding: 400, contracting: 600 },
  reduced: { expanding: 250, holding: 300, contracting: 250 },
} as const;

/**
 * Distance from `origin` to the farthest corner of `viewport` — the radius a
 * circle centered at `origin` needs to fully cover the viewport.
 */
export function computeMaxRadius(
  origin: FilterPulseOrigin,
  viewport: { width: number; height: number }
): number {
  const dx = Math.max(origin.x, viewport.width - origin.x);
  const dy = Math.max(origin.y, viewport.height - origin.y);
  return Math.hypot(dx, dy);
}

interface FilterPulseContextValue {
  readonly phase: FilterPulsePhase;
  readonly origin: FilterPulseOrigin;
  readonly maxRadius: number;
  readonly activeFilterId: FilterPulseId;
  readonly prefersReducedMotion: boolean;
  readonly trigger: (origin: FilterPulseOrigin, filterId?: FilterPulseId) => void;
}

const FilterPulseContext = createContext<FilterPulseContextValue | null>(null);

interface FilterPulseProviderProps {
  readonly children: ReactNode;
}

export function FilterPulseProvider({ children }: FilterPulseProviderProps) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [phase, setPhase] = useState<FilterPulsePhase>("idle");
  const [origin, setOrigin] = useState<FilterPulseOrigin>({ x: 0, y: 0 });
  const [maxRadius, setMaxRadius] = useState(0);
  const [activeFilterId, setActiveFilterId] = useState<FilterPulseId>(DEFAULT_FILTER_PULSE_ID);

  // Refs let `trigger` (stable identity) read latest values without becoming
  // a moving dependency, and let unmount cleanup clear whatever timers are
  // currently pending.
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const reducedMotionRef = useRef(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  const trigger = useCallback((triggerOrigin: FilterPulseOrigin, filterId?: FilterPulseId) => {
    if (phaseRef.current !== "idle") return;

    // Only one pulse can be in flight at a time (guarded above), so any
    // previously-scheduled timers have already fired — safe to reset.
    timeoutsRef.current = [];

    const durations = reducedMotionRef.current ? DURATIONS.reduced : DURATIONS.full;
    const radius = computeMaxRadius(triggerOrigin, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setOrigin(triggerOrigin);
    setMaxRadius(radius);
    setActiveFilterId(filterId ?? DEFAULT_FILTER_PULSE_ID);
    setPhase("expanding");

    timeoutsRef.current.push(
      setTimeout(() => {
        setPhase("holding");
        timeoutsRef.current.push(
          setTimeout(() => {
            setPhase("contracting");
            timeoutsRef.current.push(
              setTimeout(() => {
                setPhase("idle");
              }, durations.contracting)
            );
          }, durations.holding)
        );
      }, durations.expanding)
    );
  }, []);

  const value = useMemo(
    () => ({ phase, origin, maxRadius, activeFilterId, prefersReducedMotion, trigger }),
    [phase, origin, maxRadius, activeFilterId, prefersReducedMotion, trigger]
  );

  return <FilterPulseContext.Provider value={value}>{children}</FilterPulseContext.Provider>;
}

export function useFilterPulse(): FilterPulseContextValue {
  const ctx = useContext(FilterPulseContext);
  if (!ctx) {
    throw new Error("useFilterPulse must be used within a FilterPulseProvider");
  }
  return ctx;
}
