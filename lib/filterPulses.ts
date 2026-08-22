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

export interface FilterPulsePhaseDurations {
  readonly expanding: number;
  readonly holding: number;
  readonly contracting: number;
}

/**
 * Phase timings for "The World", in milliseconds. Each phase is set directly
 * rather than derived as a share of one total, so any of them can be tuned by
 * feel without the others silently absorbing the difference:
 *
 * - expanding:   the circle grows from the button out to full coverage
 * - holding:     the full-page filter sits still, before the circle closes
 * - contracting: the circle shrinks back and the grade releases
 *
 * The reference footage holds for far longer (~45% of a ~6s run), but on a
 * page the visitor is waiting to get back to the content, so the hold is the
 * first thing worth trimming.
 */
export const THE_WORLD_TIMING: FilterPulsePhaseDurations = {
  expanding: 1050,
  holding: 500,
  contracting: 875,
};

/** Total wall-clock duration of "The World", derived from its phases. */
export const THE_WORLD_DURATION_MS =
  THE_WORLD_TIMING.expanding + THE_WORLD_TIMING.holding + THE_WORLD_TIMING.contracting;

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

export interface CinematicSpec {
  /** Number of expanding glow rings. */
  readonly rings: number;
  /**
   * Whether to apply the SVG turbulence ripple to the ring layer.
   *
   * Defaults off: a full-viewport feDisplacementMap is a per-pixel gather, and
   * measured on a production build it was the sole remaining source of dropped
   * frames (57fps / 8 frames over 100ms / worst 174ms with it, versus 66fps /
   * zero / worst 51ms without). A side-by-side capture through its window
   * showed almost no visible difference. Flip to true to get it back.
   */
  readonly distortion: boolean;
  /** Per-phase timing for the pulse. */
  readonly timing: FilterPulsePhaseDurations;
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
      distortion: false,
      timing: THE_WORLD_TIMING,
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
 * Resolves the phase durations for an effect. Reduced motion always collapses
 * to the short, motion-free timing regardless of which effect is active.
 */
export function getPulseDurations(
  id: FilterPulseId = DEFAULT_FILTER_PULSE_ID,
  prefersReducedMotion = false
): FilterPulsePhaseDurations {
  if (prefersReducedMotion) return REDUCED_MOTION_DURATIONS;
  const cinematic = getFilterPulse(id).cinematic;
  return cinematic ? cinematic.timing : SIMPLE_DURATIONS;
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
