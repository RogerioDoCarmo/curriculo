/**
 * Registry of CSS filter effects that FilterPulseButton/FilterPulseOverlay can
 * play as a one-shot circular-reveal pulse. Add a new effect by adding a
 * FilterPulseId member below plus a matching FILTER_PULSES entry (and its
 * filterPulse.<messageKey> translations in messages/*.json) — no component
 * changes needed. Change which one the navbar button triggers by default by
 * updating DEFAULT_FILTER_PULSE_ID below to a different enum member.
 *
 * Two kinds of effect are supported:
 *  - Simple: a single CSS <filter-function-list> applied for the whole pulse
 *    (sepia, negative).
 *  - Cinematic: additionally opts into a multi-stage colour grade, expanding
 *    glow rings and ripple distortion, staged in CSS @keyframes (the-world).
 */

export enum FilterPulseId {
  Sepia = "sepia",
  Negative = "negative",
  TheWorld = "the-world",
}

// ─── Tunables ────────────────────────────────────────────────────────────────

/**
 * Total duration of the "The World" pulse, in milliseconds. Drives both the JS
 * phase machine and the CSS staging (via the --pulse-* custom properties the
 * overlay sets), so changing this one value rescales the whole sequence.
 */
export const THE_WORLD_DURATION_MS = 6000;

/**
 * How hard the effect flashes.
 *
 * - "full" — anime-faithful: bright, closely-spaced flashes.
 * - "safe" — WCAG 2.3.1-conscious: peak luminance capped and flashes spaced
 *   further apart, staying under the three-flashes-per-second threshold.
 *
 * Selects between the .fp-grade--full / .fp-grade--safe keyframe sets in
 * app/globals.css. Independent of prefers-reduced-motion, which is handled
 * separately and always wins.
 */
export type FlashIntensity = "full" | "safe";
export const FLASH_INTENSITY: FlashIntensity = "full";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FilterPulsePhaseDurations {
  readonly expanding: number;
  readonly holding: number;
  readonly contracting: number;
}

export interface CinematicSpec {
  /** Number of expanding glow rings. */
  readonly rings: number;
  /** Peak backdrop blur, in px, approximating the source's radial blur. */
  readonly blurPx: number;
  /** Whether to apply the SVG turbulence ripple to the ring layer. */
  readonly distortion: boolean;
  /** Total pulse duration in ms. */
  readonly durationMs: number;
}

export interface FilterPulseDefinition {
  readonly id: FilterPulseId;
  /**
   * CSS <filter-function-list>, applied via backdrop-filter. For cinematic
   * effects this is the settled "held" look, also used as the reduced-motion
   * fallback (where the staged keyframes are skipped entirely).
   */
  readonly filter: string;
  /** Message key stem: messages use filterPulse.<messageKey>.label */
  readonly messageKey: string;
  /** Present only on cinematic effects. */
  readonly cinematic?: CinematicSpec;
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const FILTER_PULSES: readonly FilterPulseDefinition[] = [
  {
    id: FilterPulseId.Sepia,
    filter: "sepia(0.85) saturate(1.4) contrast(1.05) brightness(0.95)",
    messageKey: "sepia",
  },
  {
    id: FilterPulseId.Negative,
    filter: "invert(1)",
    messageKey: "negative",
  },
  {
    id: FilterPulseId.TheWorld,
    // The settled "time stopped" grade, measured from the reference frames
    // (mean luminance drops 45% -> 27%, saturation 30% -> 6%, hue ~330deg).
    filter: "saturate(0.25) brightness(0.55) hue-rotate(300deg) contrast(1.1)",
    messageKey: "theWorld",
    cinematic: {
      rings: 2,
      blurPx: 6,
      distortion: true,
      durationMs: THE_WORLD_DURATION_MS,
    },
  },
];

/** Which registered filter the default navbar button triggers. */
export const DEFAULT_FILTER_PULSE_ID: FilterPulseId = FilterPulseId.TheWorld;

// ─── Timing ──────────────────────────────────────────────────────────────────

/** Phase split for simple (non-cinematic) effects. */
export const SIMPLE_DURATIONS: FilterPulsePhaseDurations = {
  expanding: 1200,
  holding: 700,
  contracting: 1200,
};

/** Phase split used whenever prefers-reduced-motion is set, for every effect. */
export const REDUCED_MOTION_DURATIONS: FilterPulsePhaseDurations = {
  expanding: 400,
  holding: 400,
  contracting: 400,
};

/**
 * Splits a cinematic effect's total duration into phases, using the same
 * proportions as the reference footage: the ring/grade sequence runs for the
 * first ~30%, the "stopped time" state is held for ~45%, and the release takes
 * the remaining ~25%.
 */
export function splitCinematicDuration(totalMs: number): FilterPulsePhaseDurations {
  const expanding = Math.round(totalMs * 0.3);
  const holding = Math.round(totalMs * 0.45);
  return { expanding, holding, contracting: totalMs - expanding - holding };
}

/**
 * Resolves the phase durations for an effect. Reduced motion always collapses
 * to the short, motion-free timing regardless of which effect is active.
 */
export function getPulseDurations(
  id: FilterPulseId = DEFAULT_FILTER_PULSE_ID,
  prefersReducedMotion = false
): FilterPulsePhaseDurations {
  if (prefersReducedMotion) return REDUCED_MOTION_DURATIONS;
  const cinematic = getFilterPulse(id).cinematic;
  return cinematic ? splitCinematicDuration(cinematic.durationMs) : SIMPLE_DURATIONS;
}

/** Total wall-clock duration of a pulse, in ms. */
export function getTotalDuration(
  id: FilterPulseId = DEFAULT_FILTER_PULSE_ID,
  prefersReducedMotion = false
): number {
  const d = getPulseDurations(id, prefersReducedMotion);
  return d.expanding + d.holding + d.contracting;
}

// ─── Lookup ──────────────────────────────────────────────────────────────────

/** Resolves a filter definition by id, falling back to the default (then the first entry) when not found. */
export function getFilterPulse(id: FilterPulseId = DEFAULT_FILTER_PULSE_ID): FilterPulseDefinition {
  return FILTER_PULSES.find((f) => f.id === id) ?? FILTER_PULSES[0];
}

/** True when the effect stages rings/grade/distortion rather than a single filter. */
export function isCinematic(id: FilterPulseId = DEFAULT_FILTER_PULSE_ID): boolean {
  return getFilterPulse(id).cinematic !== undefined;
}
