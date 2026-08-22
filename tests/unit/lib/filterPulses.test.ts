/**
 * Unit tests for the filter pulse registry.
 *
 * Assertions use literal expected values rather than re-deriving them from the
 * module's own constants, so a mutation to a constant is actually caught (a
 * self-referential assertion would pass against the mutated value too).
 */

import {
  FILTER_PULSES,
  DEFAULT_FILTER_PULSE_ID,
  FilterPulseId,
  FLASH_INTENSITY,
  THE_WORLD_DURATION_MS,
  SIMPLE_DURATIONS,
  REDUCED_MOTION_DURATIONS,
  getFilterPulse,
  getPulseDurations,
  getTotalDuration,
  isCinematic,
  splitCinematicDuration,
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

  it("resolves the-world with its cinematic spec", () => {
    const result = getFilterPulse(FilterPulseId.TheWorld);
    expect(result.id).toBe(FilterPulseId.TheWorld);
    expect(result.messageKey).toBe("theWorld");
    expect(result.cinematic).toEqual({
      rings: 2,
      distortion: false,
      durationMs: 3500,
    });
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

  it("defaults to the-world", () => {
    expect(DEFAULT_FILTER_PULSE_ID).toBe(FilterPulseId.TheWorld);
  });

  it("gives every registered filter a unique id and a message key", () => {
    const ids = FILTER_PULSES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of FILTER_PULSES) {
      expect(f.messageKey.length).toBeGreaterThan(0);
      expect(f.filter.length).toBeGreaterThan(0);
    }
  });
});

describe("isCinematic", () => {
  it("is true only for effects carrying a cinematic spec", () => {
    expect(isCinematic(FilterPulseId.TheWorld)).toBe(true);
    expect(isCinematic(FilterPulseId.Sepia)).toBe(false);
    expect(isCinematic(FilterPulseId.Negative)).toBe(false);
  });

  it("uses the default effect when no id is given", () => {
    expect(isCinematic()).toBe(true);
  });
});

describe("splitCinematicDuration", () => {
  it("splits 6000ms into 1800 / 2700 / 1500", () => {
    expect(splitCinematicDuration(6000)).toEqual({
      expanding: 1800,
      holding: 2700,
      contracting: 1500,
    });
  });

  it("rescales proportionally for a shorter total", () => {
    expect(splitCinematicDuration(3000)).toEqual({
      expanding: 900,
      holding: 1350,
      contracting: 750,
    });
  });

  it("always sums back to exactly the requested total, with no rounding drift", () => {
    for (const total of [1000, 2500, 3333, 4001, 6000, 9999]) {
      const d = splitCinematicDuration(total);
      expect(d.expanding + d.holding + d.contracting).toBe(total);
    }
  });
});

describe("getPulseDurations", () => {
  it("uses the simple timing for non-cinematic effects", () => {
    expect(getPulseDurations(FilterPulseId.Sepia)).toEqual({
      expanding: 1200,
      holding: 700,
      contracting: 1200,
    });
  });

  it("uses the derived cinematic timing for the-world", () => {
    expect(getPulseDurations(FilterPulseId.TheWorld)).toEqual({
      expanding: 1050,
      holding: 1575,
      contracting: 875,
    });
  });

  it("collapses to the reduced-motion timing for every effect", () => {
    const expected = { expanding: 400, holding: 400, contracting: 400 };
    expect(getPulseDurations(FilterPulseId.TheWorld, true)).toEqual(expected);
    expect(getPulseDurations(FilterPulseId.Sepia, true)).toEqual(expected);
  });

  it("defaults to the default effect's timing", () => {
    expect(getPulseDurations()).toEqual(getPulseDurations(FilterPulseId.TheWorld));
  });
});

describe("getTotalDuration", () => {
  it("returns the configured total for the-world", () => {
    expect(getTotalDuration(FilterPulseId.TheWorld)).toBe(3500);
  });

  it("returns the simple total for sepia", () => {
    expect(getTotalDuration(FilterPulseId.Sepia)).toBe(3100);
  });

  it("returns the reduced-motion total when reduced motion is set", () => {
    expect(getTotalDuration(FilterPulseId.TheWorld, true)).toBe(1200);
  });
});

describe("tunables", () => {
  it("exposes the configured default duration for the-world", () => {
    expect(THE_WORLD_DURATION_MS).toBe(3500);
  });

  it("exposes a flash intensity that the stylesheet has a keyframe set for", () => {
    expect(["full", "safe"]).toContain(FLASH_INTENSITY);
  });

  it("keeps the shared duration tables at their documented values", () => {
    expect(SIMPLE_DURATIONS).toEqual({ expanding: 1200, holding: 700, contracting: 1200 });
    expect(REDUCED_MOTION_DURATIONS).toEqual({ expanding: 400, holding: 400, contracting: 400 });
  });
});
