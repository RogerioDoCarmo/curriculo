/**
 * Unit tests for Datadog RUM initialization + consent gating.
 *
 * Tests that Datadog RUM:
 * - only starts when configured via env vars
 * - respects the same opt-in cookie-consent state as Firebase Analytics
 * - is safe to call repeatedly (singleton init)
 * - handles localStorage / SDK errors gracefully
 *
 * NOTE: lib/datadog reads env vars at module load, so each test imports the
 * module fresh (via jest.resetModules + dynamic import) after configuring env.
 */

const mockInit = jest.fn();

jest.mock("@datadog/browser-rum", () => ({
  datadogRum: {
    init: (...args: unknown[]) => mockInit(...args),
  },
}));

type DatadogModule = typeof import("@/lib/datadog");

async function loadModule(): Promise<DatadogModule> {
  let mod: DatadogModule | undefined;
  await jest.isolateModulesAsync(async () => {
    mod = await import("@/lib/datadog");
  });
  if (!mod) throw new Error("Failed to load lib/datadog");
  return mod;
}

describe("Datadog RUM", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    localStorage.clear();
    mockInit.mockClear();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_DATADOG_APPLICATION_ID: "test-app-id",
      NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: "pub-test-token",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isDatadogConfigured", () => {
    it("returns true when application id and client token are set", async () => {
      const { isDatadogConfigured } = await loadModule();
      expect(isDatadogConfigured()).toBe(true);
    });

    it("returns false when application id is missing", async () => {
      delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_DATADOG_APPLICATION_ID;
      const { isDatadogConfigured } = await loadModule();
      expect(isDatadogConfigured()).toBe(false);
    });

    it("returns false when client token is missing", async () => {
      delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;
      const { isDatadogConfigured } = await loadModule();
      expect(isDatadogConfigured()).toBe(false);
    });
  });

  describe("initDatadogRum consent gating", () => {
    it("does not init when no consent given", async () => {
      const { initDatadogRum } = await loadModule();
      const started = await initDatadogRum();
      expect(started).toBe(false);
      expect(mockInit).not.toHaveBeenCalled();
    });

    it("does not init when consent rejected", async () => {
      localStorage.setItem("cookie-consent", "rejected");
      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(false);
      expect(mockInit).not.toHaveBeenCalled();
    });

    it("inits when consent accepted", async () => {
      localStorage.setItem("cookie-consent", "accepted");
      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(true);
      expect(mockInit).toHaveBeenCalledTimes(1);
    });

    it("inits when customized with analytics enabled", async () => {
      localStorage.setItem("cookie-consent", "customized");
      localStorage.setItem("cookie-preferences", JSON.stringify({ analytics: true }));
      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(true);
      expect(mockInit).toHaveBeenCalledTimes(1);
    });

    it("does not init when customized with analytics disabled", async () => {
      localStorage.setItem("cookie-consent", "customized");
      localStorage.setItem("cookie-preferences", JSON.stringify({ analytics: false }));
      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(false);
      expect(mockInit).not.toHaveBeenCalled();
    });

    it("does not init when consent is pending", async () => {
      localStorage.setItem("cookie-consent", "pending");
      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(false);
      expect(mockInit).not.toHaveBeenCalled();
    });
  });

  describe("configuration gating", () => {
    it("does not init when env vars are missing even with consent", async () => {
      delete (process.env as Record<string, string | undefined>).NEXT_PUBLIC_DATADOG_APPLICATION_ID;
      localStorage.setItem("cookie-consent", "accepted");
      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(false);
      expect(mockInit).not.toHaveBeenCalled();
    });
  });

  describe("init options", () => {
    it("disables session replay and masks user input for privacy", async () => {
      localStorage.setItem("cookie-consent", "accepted");
      const { initDatadogRum } = await loadModule();
      await initDatadogRum();

      expect(mockInit).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionReplaySampleRate: 0,
          defaultPrivacyLevel: "mask-user-input",
          applicationId: "test-app-id",
          clientToken: "pub-test-token",
        })
      );
    });

    it("uses NEXT_PUBLIC_DATADOG_SAMPLE_RATE when valid", async () => {
      process.env.NEXT_PUBLIC_DATADOG_SAMPLE_RATE = "25";
      localStorage.setItem("cookie-consent", "accepted");
      const { initDatadogRum } = await loadModule();
      await initDatadogRum();

      expect(mockInit).toHaveBeenCalledWith(expect.objectContaining({ sessionSampleRate: 25 }));
    });

    it("falls back to 100 when sample rate is out of range", async () => {
      process.env.NEXT_PUBLIC_DATADOG_SAMPLE_RATE = "999";
      localStorage.setItem("cookie-consent", "accepted");
      const { initDatadogRum } = await loadModule();
      await initDatadogRum();

      expect(mockInit).toHaveBeenCalledWith(expect.objectContaining({ sessionSampleRate: 100 }));
    });
  });

  describe("singleton behaviour", () => {
    it("inits only once across repeated calls", async () => {
      localStorage.setItem("cookie-consent", "accepted");
      const { initDatadogRum } = await loadModule();

      expect(await initDatadogRum()).toBe(true);
      expect(await initDatadogRum()).toBe(false);
      expect(mockInit).toHaveBeenCalledTimes(1);
    });
  });

  describe("error handling", () => {
    it("returns false and warns when localStorage throws", async () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error("localStorage error");
      });

      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();

      Storage.prototype.getItem = originalGetItem;
      consoleWarnSpy.mockRestore();
    });

    it("returns false and warns when the SDK init throws", async () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
      mockInit.mockImplementationOnce(() => {
        throw new Error("SDK init error");
      });
      localStorage.setItem("cookie-consent", "accepted");

      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("handles malformed preferences JSON gracefully", async () => {
      localStorage.setItem("cookie-consent", "customized");
      localStorage.setItem("cookie-preferences", "{invalid");
      const { initDatadogRum } = await loadModule();
      expect(await initDatadogRum()).toBe(false);
      expect(mockInit).not.toHaveBeenCalled();
    });
  });
});
