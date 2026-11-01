/**
 * Renders the real CookiePolicyContent with the actual English messages, to
 * cover the Connectivity Check section added for the offline-detector
 * integration.
 */

import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { CookiePolicyContent } from "@/app/[locale]/cookies/page";
import en from "@/messages/en.json";

describe("CookiePolicyContent — Connectivity Check section", () => {
  it("renders the connectivity check section with its real copy", () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <CookiePolicyContent />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Connectivity Check (Cloudflare & Google)")).toBeInTheDocument();
    expect(
      screen.getByText(
        "To tell a real internet outage apart from the browser's own offline flag, a small widget periodically sends a no-cors reachability check. It sets no cookies."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Cloudflare, Inc. and Google LLC")).toBeInTheDocument();
    expect(
      screen.getByText("Reachability check only — not used for tracking or analytics")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A HEAD request to cp.cloudflare.com, then to www.gstatic.com if needed, on page load and then about every 30 seconds while offline"
      )
    ).toBeInTheDocument();
  });
});
