/**
 * Unit tests for the filter pulse registry.
 */

import { FILTER_PULSES, DEFAULT_FILTER_PULSE_ID, getFilterPulse } from "@/lib/filterPulses";

describe("filterPulses registry", () => {
  it("resolves the default filter when no id is given", () => {
    const result = getFilterPulse();
    expect(result.id).toBe(DEFAULT_FILTER_PULSE_ID);
  });

  it("resolves a specific registered filter by id", () => {
    const result = getFilterPulse("sepia");
    expect(result.id).toBe("sepia");
    expect(result.filter).toContain("sepia(");
    expect(result.messageKey).toBe("sepia");
  });

  it("falls back to the first registered filter for an unknown id", () => {
    // @ts-expect-error — intentionally passing an id outside the FilterPulseId union
    const result = getFilterPulse("does-not-exist");
    expect(result).toBe(FILTER_PULSES[0]);
  });

  it("has DEFAULT_FILTER_PULSE_ID pointing at a registered filter", () => {
    const ids = FILTER_PULSES.map((f) => f.id);
    expect(ids).toContain(DEFAULT_FILTER_PULSE_ID);
  });
});
