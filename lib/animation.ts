/**
 * Pure animation math shared by rAF-driven hooks/components. Kept
 * dependency-free so it's directly unit- and mutation-testable (in
 * stryker.config.json's `mutate: ["lib/**"]` scope), independent of the
 * DOM or React lifecycle that drives it.
 */

/** Linear interpolation between `start` and `end` at position `t` (0-1). */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/** Clamps `value` into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/** Ease-out cubic: fast start, slow finish — the standard "count-up" feel. */
export function easeOutCubic(t: number): number {
  const clamped = clamp(t, 0, 1);
  return 1 - (1 - clamped) ** 3;
}

/**
 * Value of an ease-out count-up animation at `elapsedMs` into a
 * `durationMs` run, moving from `from` to `to`. Returns `to` once elapsed
 * time reaches (or exceeds) the duration, or immediately for a
 * non-positive duration.
 */
export function computeCountUpValue(
  elapsedMs: number,
  durationMs: number,
  from: number,
  to: number
): number {
  // The `durationMs <= 0` branch avoids a division by zero below; the
  // `elapsedMs >= durationMs` branch is a redundant fast path — `lerp` at
  // `easeOutCubic`'s clamped t=1 already equals `to` exactly, it just
  // skips the extra arithmetic once the animation has finished.
  if (durationMs <= 0 || elapsedMs >= durationMs) return to;
  return lerp(from, to, easeOutCubic(elapsedMs / durationMs));
}
