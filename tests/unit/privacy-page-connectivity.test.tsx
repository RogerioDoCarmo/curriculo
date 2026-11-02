/**
 * Renders the real PrivacyPolicyContent (not the hand-mocked stand-in used
 * by tests/unit/privacy-page.test.tsx) with the actual English messages, to
 * cover the Connectivity Check section added for the offline-detector
 * integration.
 */

import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { PrivacyPolicyContent } from "@/app/[locale]/privacy/page";
import en from "@/messages/en.json";

describe("PrivacyPolicyContent — Connectivity Check section", () => {
  it("renders the connectivity check section with its real copy", () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <PrivacyPolicyContent />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Connectivity Check")).toBeInTheDocument();
    expect(
      screen.getByText(
        "To tell a real internet outage apart from your browser's own offline flag, the site periodically sends a network reachability check:"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A no-cors HEAD request to Cloudflare (cp.cloudflare.com) and, if needed, Google (www.gstatic.com) connectivity-check endpoints"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The request carries no cookies, no Referer header, and no personal data — only that a response arrived counts as reachable"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Checked on page load, then about every 30 seconds while the connection appears to be down"
      )
    ).toBeInTheDocument();
  });
});
