/**
 * Registry of CSS filter effects that FilterPulseButton/FilterPulseOverlay can
 * play as a one-shot circular-reveal pulse. Add a new effect by adding an
 * entry here (plus its filterPulse.<messageKey> translations in
 * messages/*.json) — no component changes needed. Change which one the
 * navbar button triggers by default by changing DEFAULT_FILTER_PULSE_ID.
 */

export interface FilterPulseDefinition {
  readonly id: string;
  /** CSS <filter-function-list>, applied via backdrop-filter. */
  readonly filter: string;
  /** Message key stem: messages use filterPulse.<messageKey>.label / .tooltip */
  readonly messageKey: string;
}

export const FILTER_PULSES = [
  {
    id: "sepia",
    filter: "sepia(0.85) saturate(1.4) contrast(1.05) brightness(0.95)",
    messageKey: "sepia",
  },
] as const satisfies readonly FilterPulseDefinition[];

export type FilterPulseId = (typeof FILTER_PULSES)[number]["id"];

/** Which registered filter the default navbar button triggers. */
export const DEFAULT_FILTER_PULSE_ID: FilterPulseId = "sepia";

/** Resolves a filter definition by id, falling back to the default (then the first entry) when not found. */
export function getFilterPulse(id: FilterPulseId = DEFAULT_FILTER_PULSE_ID): FilterPulseDefinition {
  return FILTER_PULSES.find((f) => f.id === id) ?? FILTER_PULSES[0];
}
