/**
 * Registry of CSS filter effects that FilterPulseButton/FilterPulseOverlay can
 * play as a one-shot circular-reveal pulse. Add a new effect by adding a
 * FilterPulseId member below plus a matching FILTER_PULSES entry (and its
 * filterPulse.<messageKey> translations in messages/*.json) — no component
 * changes needed. Change which one the navbar button triggers by default by
 * updating DEFAULT_FILTER_PULSE_ID below to a different enum member.
 */

export enum FilterPulseId {
  Sepia = "sepia",
  Negative = "negative",
}

export interface FilterPulseDefinition {
  readonly id: FilterPulseId;
  /** CSS <filter-function-list>, applied via backdrop-filter. */
  readonly filter: string;
  /** Message key stem: messages use filterPulse.<messageKey>.label / .tooltip */
  readonly messageKey: string;
}

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
];

/** Which registered filter the default navbar button triggers. */
export const DEFAULT_FILTER_PULSE_ID: FilterPulseId = FilterPulseId.Negative;

/** Resolves a filter definition by id, falling back to the default (then the first entry) when not found. */
export function getFilterPulse(id: FilterPulseId = DEFAULT_FILTER_PULSE_ID): FilterPulseDefinition {
  return FILTER_PULSES.find((f) => f.id === id) ?? FILTER_PULSES[0];
}
