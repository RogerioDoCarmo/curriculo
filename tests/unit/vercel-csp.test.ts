/**
 * Regression test for the CSP connect-src directive in vercel.json.
 *
 * This header is only applied by Vercel's edge network on real deployments
 * — it's never exercised by `next dev` or the local E2E static server, so a
 * missing host here is invisible to build/lint/unit/E2E and silently drops
 * every outbound request the browser makes to that host (e.g. Sentry error
 * reports never reach Sentry, with no visible error to the user).
 */

import fs from "fs";
import path from "path";

interface VercelHeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}

interface VercelConfig {
  headers: VercelHeaderRule[];
}

function getCspHeaderValue(): string {
  const raw = fs.readFileSync(path.join(process.cwd(), "vercel.json"), "utf-8");
  const config = JSON.parse(raw) as VercelConfig;
  const catchAllRule = config.headers.find((rule) => rule.source === "/(.*)");
  if (!catchAllRule) {
    throw new Error('vercel.json: no header rule found for source "/(.*)"');
  }
  const cspHeader = catchAllRule.headers.find((h) => h.key === "Content-Security-Policy");
  if (!cspHeader) {
    throw new Error("vercel.json: no Content-Security-Policy header found");
  }
  return cspHeader.value;
}

function getDirective(name: string): string {
  const match = new RegExp(`${name} ([^;]+);`).exec(getCspHeaderValue());
  if (!match) {
    throw new Error(`vercel.json: ${name} directive not found in CSP header`);
  }
  return match[1];
}

function getConnectSrc(): string {
  return getDirective("connect-src");
}

function getFontSrc(): string {
  return getDirective("font-src");
}

describe("vercel.json Content-Security-Policy connect-src", () => {
  it("allows the Sentry ingest host used by instrumentation-client.ts", () => {
    expect(getConnectSrc()).toContain("ingest.de.sentry.io");
  });

  it("still allows the other external services the app depends on", () => {
    const connectSrc = getConnectSrc();
    expect(connectSrc).toContain("formspree.io");
    expect(connectSrc).toContain("firebaseio.com");
    expect(connectSrc).toContain("google-analytics.com");
  });

  it("allows Google's font host for third-party embeds (e.g. Vercel's preview toolbar)", () => {
    expect(getFontSrc()).toContain("fonts.gstatic.com");
  });
});
