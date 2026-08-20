/**
 * Unit tests for the filter pulse registry.
 */

import {
  FILTER_PULSES,
  DEFAULT_FILTER_PULSE_ID,
  FilterPulseId,
  getFilterPulse,
} from "@/lib/filterPulses";

describe("filterPulses registry", () => {
  it("resolves the default filter when no id is given", () => {
    const result = getFilterPulse();
    expect(result.id).toBe(DEFAULT_FILTER_PULSE_ID);
  });

  it("resolves the sepia filter by id", () => {
    const result = getFilterPulse(FilterPulseId.Sepia);
    expect(result.id).toBe(FilterPulseId.Sepia);
    expect(result.filter).toContain("sepia(");
    expect(result.messageKey).toBe("sepia");
  });

  it("resolves the negative filter by id", () => {
    const result = getFilterPulse(FilterPulseId.Negative);
    expect(result.id).toBe(FilterPulseId.Negative);
    expect(result.filter).toContain("invert(");
    expect(result.messageKey).toBe("negative");
  });

  it("falls back to the first registered filter for an unknown id", () => {
    // @ts-expect-error — intentionally passing an id outside the FilterPulseId enum
    const result = getFilterPulse("does-not-exist");
    expect(result).toBe(FILTER_PULSES[0]);
  });

  it("has DEFAULT_FILTER_PULSE_ID pointing at a registered filter", () => {
    const ids = FILTER_PULSES.map((f) => f.id);
    expect(ids).toContain(DEFAULT_FILTER_PULSE_ID);
  });

  it("defaults to the negative filter", () => {
    expect(DEFAULT_FILTER_PULSE_ID).toBe(FilterPulseId.Negative);
  });
});
