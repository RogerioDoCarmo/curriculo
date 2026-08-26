import { lerp, clamp, easeOutCubic, computeCountUpValue } from "@/lib/animation";

describe("lerp", () => {
  it("returns start at t=0", () => {
    expect(lerp(10, 20, 0)).toBe(10);
  });

  it("returns end at t=1", () => {
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("returns the midpoint at t=0.5", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });

  it("extrapolates for t outside [0, 1]", () => {
    expect(lerp(0, 10, 2)).toBe(20);
  });
});

describe("clamp", () => {
  it("returns the value when inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns min when below the range", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("returns max when above the range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("returns the boundary values unchanged", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("easeOutCubic", () => {
  it("returns 0 at t=0", () => {
    expect(easeOutCubic(0)).toBe(0);
  });

  it("returns 1 at t=1", () => {
    expect(easeOutCubic(1)).toBe(1);
  });

  it("returns 0.875 at t=0.5 (1 - 0.5^3)", () => {
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 10);
  });

  it("clamps t above 1 to 1", () => {
    expect(easeOutCubic(2)).toBe(1);
  });

  it("clamps t below 0 to 0", () => {
    expect(easeOutCubic(-1)).toBe(0);
  });
});

describe("computeCountUpValue", () => {
  it("returns `to` once elapsed time reaches the duration", () => {
    expect(computeCountUpValue(1000, 1000, 0, 50)).toBe(50);
  });

  it("returns `to` once elapsed time exceeds the duration", () => {
    expect(computeCountUpValue(1500, 1000, 0, 50)).toBe(50);
  });

  it("returns `to` immediately for a zero duration", () => {
    expect(computeCountUpValue(0, 0, 0, 50)).toBe(50);
  });

  it("returns `to` immediately for a negative duration", () => {
    expect(computeCountUpValue(0, -100, 0, 50)).toBe(50);
  });

  it("returns `to` for a zero duration even when elapsed time is negative (guards the division by zero the fall-through path would otherwise hit)", () => {
    expect(computeCountUpValue(-5, 0, 0, 50)).toBe(50);
  });

  it("returns `from` at elapsed=0 for a positive duration", () => {
    expect(computeCountUpValue(0, 1000, 5, 50)).toBe(5);
  });

  it("returns an eased midpoint value partway through the animation", () => {
    // At the midpoint, easeOutCubic(0.5) = 0.875, so the value is 87.5% of
    // the way from `from` to `to`.
    expect(computeCountUpValue(500, 1000, 0, 100)).toBeCloseTo(87.5, 10);
  });
});
