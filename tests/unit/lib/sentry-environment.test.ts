/**
 * Unit tests for Sentry environment detection.
 *
 * VERCEL_ENV distinguishes a real Vercel deployment from a local machine
 * build — unlike NODE_ENV, which is "production" for both a real deploy
 * and a local `next build && next start`.
 */

import { getSentryEnvironment, isSentryEnabled } from "@/lib/sentry-environment";

describe("getSentryEnvironment", () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV;

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    } else {
      process.env.NEXT_PUBLIC_VERCEL_ENV = ORIGINAL_ENV;
    }
  });

  it("returns 'production' when NEXT_PUBLIC_VERCEL_ENV is 'production'", () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    expect(getSentryEnvironment()).toBe("production");
  });

  it("returns 'preview' when NEXT_PUBLIC_VERCEL_ENV is 'preview'", () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    expect(getSentryEnvironment()).toBe("preview");
  });

  it("returns 'local' when NEXT_PUBLIC_VERCEL_ENV is unset", () => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    expect(getSentryEnvironment()).toBe("local");
  });

  it("returns 'local' when NEXT_PUBLIC_VERCEL_ENV is an empty string", () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "";
    expect(getSentryEnvironment()).toBe("local");
  });

  it("returns 'local' for any other value (e.g. Vercel's own 'development')", () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = "development";
    expect(getSentryEnvironment()).toBe("local");
  });
});

describe("isSentryEnabled", () => {
  it("returns true for 'production'", () => {
    expect(isSentryEnabled("production")).toBe(true);
  });

  it("returns true for 'preview'", () => {
    expect(isSentryEnabled("preview")).toBe(true);
  });

  it("returns false for 'local'", () => {
    expect(isSentryEnabled("local")).toBe(false);
  });
});
