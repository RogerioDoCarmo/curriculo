"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedCounterProps {
  /** Final value to count up to. */
  readonly value: number;
  /** Visible label describing what the number represents. */
  readonly label: string;
  /** Optional suffix rendered right after the number (e.g. "+", "%"). */
  readonly suffix?: string;
  /** Animation length in milliseconds. Defaults to 1200ms. */
  readonly durationMs?: number;
}

/**
 * A count-up statistic (e.g. "5+ Years of Experience"), animated with
 * `requestAnimationFrame` via `useCountUp`. The animated number is hidden
 * from assistive tech — screen readers get the final value immediately
 * through the labelled wrapper instead of hearing every incremented tick.
 */
export default function AnimatedCounter({
  value,
  label,
  suffix = "",
  durationMs,
}: AnimatedCounterProps) {
  const current = useCountUp(value, { durationMs });
  const displayValue = Math.round(current);

  return (
    // role="img" rather than "group": ARIA's `group` is for a set of related
    // widgets, while this is one atomic piece of information whose parts are
    // all aria-hidden -- so it should reach assistive tech as a single named
    // object. It also keeps the aria-label valid (a bare <div> is `generic`,
    // which cannot be named) without the native `group` element that Sonar
    // S6819 would otherwise want, none of which -- <details>, <fieldset>,
    // <optgroup>, <address> -- describes a statistic.
    <div
      role="img"
      className="flex flex-col items-center text-center"
      aria-label={`${value}${suffix} ${label}`}
    >
      <span
        aria-hidden="true"
        className="text-4xl font-bold text-primary-600 dark:text-primary-400 sm:text-5xl"
      >
        {displayValue}
        {suffix}
      </span>
      <span aria-hidden="true" className="mt-2 text-sm text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
