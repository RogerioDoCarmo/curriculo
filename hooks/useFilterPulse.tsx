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
import { hasPulseConsent, setPulseConsent } from "@/lib/filterPulseConsent";
import {
  DEFAULT_FILTER_PULSE_ID,
  getPulseDurations,
  type FilterPulseId,
  type FilterPulsePhaseDurations,
} from "@/lib/filterPulses";

export type FilterPulsePhase = "idle" | "expanding" | "holding" | "contracting";

export interface FilterPulseOrigin {
  readonly x: number;
  readonly y: number;
}

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
  /** Phase timings of the in-flight (or most recent) pulse, for the overlay's CSS vars. */
  readonly durations: FilterPulsePhaseDurations;
  /**
   * Starts a pulse immediately, skipping the photosensitivity warning. Use
   * requestPulse from UI instead; this stays exposed for the confirmation
   * dialog and for tests.
   */
  readonly trigger: (origin: FilterPulseOrigin, filterId?: FilterPulseId) => void;
  /**
   * Asks for a pulse. Shows the photosensitivity warning first unless the
   * visitor has already acknowledged it, in which case it starts straight away.
   */
  readonly requestPulse: (origin: FilterPulseOrigin, filterId?: FilterPulseId) => void;
  /** True while the warning dialog should be open. */
  readonly awaitingConsent: boolean;
  /** Acknowledge the warning and play the pulse that was requested. */
  readonly confirmPulse: () => void;
  /** Dismiss the warning without playing anything. */
  readonly cancelPulse: () => void;
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
  const [durations, setDurations] = useState<FilterPulsePhaseDurations>(() =>
    getPulseDurations(DEFAULT_FILTER_PULSE_ID, false)
  );
  const [pending, setPending] = useState<{
    origin: FilterPulseOrigin;
    filterId?: FilterPulseId;
  } | null>(null);

  // Refs let `trigger` (stable identity) read latest values without becoming
  // a moving dependency, and let unmount cleanup clear whatever timers are
  // currently pending.
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const reducedMotionRef = useRef(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafIdsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      // Cancel the rAF pair too, not just the setTimeout chain: the
      // "holding"/"contracting"/"idle" timeouts are only created once the
      // second rAF fires, so if unmount happens before then, an uncancelled
      // rAF would still fire later and call setPhase on an unmounted
      // component, plus schedule setTimeouts cleanup here already ran and
      // can never clear.
      rafIdsRef.current.forEach(cancelAnimationFrame);
      rafIdsRef.current = [];
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  const trigger = useCallback((triggerOrigin: FilterPulseOrigin, filterId?: FilterPulseId) => {
    if (phaseRef.current !== "idle") return;

    // Only one pulse can be in flight at a time (guarded above), so any
    // previously-scheduled timers/frames have already fired — safe to reset.
    rafIdsRef.current.forEach(cancelAnimationFrame);
    rafIdsRef.current = [];
    timeoutsRef.current = [];

    // The mobile sidebar is a native <dialog> in the browser's top layer, so
    // it would sit over the fixed overlay. BackToTopButton already uses this
    // same signal, and Header listens for it.
    window.dispatchEvent(new CustomEvent("app:close-sidebar"));

    const resolvedId = filterId ?? DEFAULT_FILTER_PULSE_ID;
    const durations = getPulseDurations(resolvedId, reducedMotionRef.current);
    const radius = computeMaxRadius(triggerOrigin, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Commit the new origin while phase is still "idle" (radius stays 0px,
    // so this paint is visually a no-op) before starting the "expanding"
    // transition on a second paint. Setting origin/radius/phase together in
    // one commit would transition the clip-path's position AND radius in a
    // single step -- fine on Chromium/WebKit, which don't visibly animate a
    // circle's position, but Firefox does interpolate it, which reads as the
    // circle sweeping in from the origin's *previous* value (initial (0, 0)
    // on the very first trigger) instead of growing in place from the
    // button. The double rAF guarantees this position-only paint has
    // actually been committed before the radius change starts, so the
    // radius transition has nothing but radius to interpolate.
    setOrigin(triggerOrigin);
    setMaxRadius(radius);
    setActiveFilterId(resolvedId);
    setDurations(durations);

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
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
      });
      rafIdsRef.current.push(raf2);
    });
    rafIdsRef.current.push(raf1);
  }, []);

  const requestPulse = useCallback(
    (triggerOrigin: FilterPulseOrigin, filterId?: FilterPulseId) => {
      if (phaseRef.current !== "idle") return;
      if (hasPulseConsent()) {
        trigger(triggerOrigin, filterId);
        return;
      }
      setPending({ origin: triggerOrigin, filterId });
    },
    [trigger]
  );

  const confirmPulse = useCallback(() => {
    setPending((current) => {
      if (current) {
        setPulseConsent();
        // Deferred so the dialog has closed (and released the top layer)
        // before the overlay starts painting underneath it.
        requestAnimationFrame(() => trigger(current.origin, current.filterId));
      }
      return null;
    });
  }, [trigger]);

  const cancelPulse = useCallback(() => setPending(null), []);

  const value = useMemo(
    () => ({
      phase,
      origin,
      maxRadius,
      activeFilterId,
      prefersReducedMotion,
      durations,
      trigger,
      requestPulse,
      awaitingConsent: pending !== null,
      confirmPulse,
      cancelPulse,
    }),
    [
      phase,
      origin,
      maxRadius,
      activeFilterId,
      prefersReducedMotion,
      durations,
      trigger,
      requestPulse,
      pending,
      confirmPulse,
      cancelPulse,
    ]
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
