/**
 * Property-based tests for error logging.
 *
 * Property 19: Errors Logged to Monitoring Service
 * **Validates: Requirements 10.5**
 *
 * Tests that runtime errors are captured and logged correctly.
 */

import * as fc from "fast-check";

// ─── Mock Sentry and Firebase before imports ──────────────────────────────────

const mockCaptureException = jest.fn();
const mockWithScope = jest.fn((cb: (scope: unknown) => void) => {
  cb({
    setLevel: jest.fn(),
    setTag: jest.fn(),
    setExtra: jest.fn(),
  });
});
const mockLogEvent = jest.fn();
const mockGetFirebaseAnalytics = jest.fn(() => ({}));

jest.mock("@sentry/nextjs", () => ({
  captureException: mockCaptureException,
  withScope: mockWithScope,
}));

jest.mock("firebase/analytics", () => ({
  logEvent: mockLogEvent,
}));

jest.mock("@/lib/firebase", () => ({
  getFirebaseAnalytics: mockGetFirebaseAnalytics,
}));

// Import after mocks are set up
import { logError, logWarning } from "@/lib/error-logging";

// ─── Property 19: Errors Logged to Monitoring Service ────────────────────────

describe("Property 19: Errors Logged to Monitoring Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("logError — Error objects", () => {
    it("always calls Sentry.withScope for any Error", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (message) => {
            jest.clearAllMocks();
            logError(new Error(message));
            expect(mockWithScope).toHaveBeenCalledTimes(1);
          }
        ),
        { numRuns: 50 }
      );
    });

    it("always calls Sentry.captureException for any Error", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (message) => {
            jest.clearAllMocks();
            logError(new Error(message));
            expect(mockCaptureException).toHaveBeenCalledTimes(1);
            expect(mockCaptureException).toHaveBeenCalledWith(expect.any(Error));
          }
        ),
        { numRuns: 50 }
      );
    });

    it("always logs to Firebase Analytics for any Error", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          async (message) => {
            jest.clearAllMocks();
            logError(new Error(message));
            // Wait for async Firebase Analytics call
            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(mockLogEvent).toHaveBeenCalledTimes(1);
            expect(mockLogEvent).toHaveBeenCalledWith(
              expect.anything(),
              "exception",
              expect.objectContaining({ description: message })
            );
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe("logError — Non-Error values", () => {
    it("handles string errors by wrapping in Error", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
          (message) => {
            jest.clearAllMocks();
            logError(message);
            expect(mockCaptureException).toHaveBeenCalledWith(expect.any(Error));
          }
        ),
        { numRuns: 30 }
      );
    });

    it("handles number errors without throwing", () => {
      fc.assert(
        fc.property(fc.integer(), (num) => {
          jest.clearAllMocks();
          expect(() => logError(num)).not.toThrow();
          expect(mockCaptureException).toHaveBeenCalledTimes(1);
        }),
        { numRuns: 20 }
      );
    });

    it("handles null/undefined without throwing", () => {
      expect(() => logError(null)).not.toThrow();
      expect(() => logError(undefined)).not.toThrow();
    });
  });

  describe("logError — Context", () => {
    it("passes component tag to Sentry scope when provided", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          (component) => {
            jest.clearAllMocks();
            const mockScope = { setLevel: jest.fn(), setTag: jest.fn(), setExtra: jest.fn() };
            mockWithScope.mockImplementationOnce((cb: (scope: typeof mockScope) => void) =>
              cb(mockScope)
            );
            logError(new Error("test"), { component });
            expect(mockScope.setTag).toHaveBeenCalledWith("component", component);
          }
        ),
        { numRuns: 30 }
      );
    });

    it("fatal errors set fatal=true in Firebase Analytics event", async () => {
      jest.clearAllMocks();
      logError(new Error("fatal error"), { level: "fatal" });
      // Wait for async Firebase Analytics call
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.anything(),
        "exception",
        expect.objectContaining({ fatal: true })
      );
    });

    it("non-fatal errors set fatal=false in Firebase Analytics event", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom("error" as const, "warning" as const, "info" as const),
          async (level) => {
            jest.clearAllMocks();
            logError(new Error("non-fatal"), { level });
            // Wait for async Firebase Analytics call
            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(mockLogEvent).toHaveBeenCalledWith(
              expect.anything(),
              "exception",
              expect.objectContaining({ fatal: false })
            );
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe("logWarning", () => {
    it("logWarning always calls Sentry for any message", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          (message) => {
            jest.clearAllMocks();
            logWarning(message);
            expect(mockCaptureException).toHaveBeenCalledTimes(1);
          }
        ),
        { numRuns: 30 }
      );
    });

    it("logWarning always logs to Firebase Analytics", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
          async (message) => {
            jest.clearAllMocks();
            logWarning(message);
            // Wait for async Firebase Analytics call
            await new Promise((resolve) => setTimeout(resolve, 10));
            expect(mockLogEvent).toHaveBeenCalledTimes(1);
          }
        ),
        { numRuns: 30 }
      );
    });

    it("logWarning never throws regardless of input", () => {
      fc.assert(
        fc.property(fc.string({ minLength: 0, maxLength: 200 }), (message) => {
          expect(() => logWarning(message)).not.toThrow();
        }),
        { numRuns: 50 }
      );
    });
  });

  describe("Resilience", () => {
    it("logError never throws even when Sentry fails", () => {
      mockWithScope.mockImplementationOnce(() => {
        throw new Error("Sentry unavailable");
      });
      expect(() => logError(new Error("test error"))).not.toThrow();
    });

    it("logError never throws even when Firebase Analytics fails", () => {
      mockLogEvent.mockImplementationOnce(() => {
        throw new Error("Firebase unavailable");
      });
      expect(() => logError(new Error("test error"))).not.toThrow();
    });

    it("logError never throws even when both services fail", () => {
      mockWithScope.mockImplementationOnce(() => {
        throw new Error("Sentry unavailable");
      });
      mockLogEvent.mockImplementationOnce(() => {
        throw new Error("Firebase unavailable");
      });
      expect(() => logError(new Error("test error"))).not.toThrow();
    });
  });
});
