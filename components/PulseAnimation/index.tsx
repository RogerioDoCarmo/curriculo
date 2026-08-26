"use client";

import { Lottie } from "lottie-react";
import pulseAnimation from "@/public/animations/pulse.json";

interface PulseAnimationProps {
  /** Accessible name for the animation. */
  readonly label: string;
  /** Width/height in pixels. Defaults to 96. */
  readonly size?: number;
  /** Additional CSS classes to apply to the wrapper. */
  readonly className?: string;
}

/**
 * A small, looping Lottie animation — a single pulsing circle, kept
 * deliberately minimal rather than a flashy multi-shape composition.
 * Visitors who prefer reduced motion get a static circle instead (a
 * CSS-only swap via `motion-reduce:`, same approach as `BanksSection`'s
 * carousel).
 */
export default function PulseAnimation({ label, size = 96, className = "" }: PulseAnimationProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie
        src={pulseAnimation}
        autoplay
        loop
        aria-hidden="true"
        className="h-full w-full motion-reduce:hidden"
      />
      <div
        aria-hidden="true"
        className="hidden h-full w-full rounded-full bg-primary-600 motion-reduce:block"
      />
    </div>
  );
}
