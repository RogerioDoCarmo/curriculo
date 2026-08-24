/**
 * Unit tests for the photosensitivity-consent storage helpers.
 *
 * Assertions use literal values rather than the module's own constants, so a
 * mutation to a key or stored value is actually caught.
 */

import { hasPulseConsent, setPulseConsent, clearPulseConsent } from "@/lib/filterPulseConsent";

const KEY = "filter-pulse-photosensitivity-consent";

describe("filterPulseConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("reports no consent before anything is stored", () => {
    expect(hasPulseConsent()).toBe(false);
  });

  it("records consent under the documented key and value", () => {
    setPulseConsent();
    expect(localStorage.getItem(KEY)).toBe("acknowledged");
    expect(hasPulseConsent()).toBe(true);
  });

  it("does not treat some other stored value as consent", () => {
    localStorage.setItem(KEY, "nope");
    expect(hasPulseConsent()).toBe(false);
  });

  it("clears a stored acknowledgement", () => {
    setPulseConsent();
    clearPulseConsent();
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(hasPulseConsent()).toBe(false);
  });

  it("treats an unreadable store as 'not acknowledged' so the warning still shows", () => {
    // Private mode / blocked cookies make localStorage throw. Failing open
    // here would silently skip the warning, which is the wrong direction.
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(hasPulseConsent()).toBe(false);
  });

  it("does not throw when the store rejects writes", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => setPulseConsent()).not.toThrow();
  });

  it("does not throw when the store rejects removals", () => {
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => clearPulseConsent()).not.toThrow();
  });
});
