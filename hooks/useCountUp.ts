"use client";

import { useEffect, useState } from "react";
import { computeCountUpValue } from "@/lib/animation";

interface UseCountUpOptions {
  /** Animation length in milliseconds. Defaults to 1200ms. */
  readonly durationMs?: number;
}

/**
 * Animates a number from 0 up to `target` using `requestAnimationFrame`.
 * Jumps straight to `target` for visitors who prefer reduced motion,
 * matching the pattern used by `BanksSection`'s carousel.
 */
export function useCountUp(target: number, options: UseCountUpOptions = {}): number {
  const { durationMs = 1200 } = options;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      setValue(computeCountUpValue(elapsed, durationMs, 0, target));
      if (elapsed < durationMs) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}
