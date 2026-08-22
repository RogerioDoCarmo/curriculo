/**
 * Unit tests for FilterPulseWarningDialog — the photosensitivity warning
 * shown before the cinematic pulse plays.
 *
 * Show/hide of a native <dialog> is also covered in E2E: jsdom stubs the
 * imperative API rather than implementing the real UA cascade.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterPulseWarningDialog from "@/components/FilterPulseWarningDialog";
import * as useFilterPulseModule from "@/hooks/useFilterPulse";
import { FilterPulseId } from "@/lib/filterPulses";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const t: Record<string, string> = {
      "filterPulse.warning.title": "Heads up: flashing visual effect",
      "filterPulse.warning.body":
        "This effect briefly flashes and inverts the colours of the whole page.",
      "filterPulse.warning.continue": "Play the effect",
      "filterPulse.warning.cancel": "Cancel",
    };
    return t[key] ?? key;
  },
}));

function mockPulse(overrides: Partial<ReturnType<typeof useFilterPulseModule.useFilterPulse>>) {
  const confirmPulse = jest.fn();
  const cancelPulse = jest.fn();
  jest.spyOn(useFilterPulseModule, "useFilterPulse").mockReturnValue({
    phase: "idle",
    origin: { x: 0, y: 0 },
    maxRadius: 0,
    activeFilterId: FilterPulseId.TheWorld,
    prefersReducedMotion: false,
    durations: { expanding: 1050, holding: 500, contracting: 875 },
    trigger: jest.fn(),
    requestPulse: jest.fn(),
    awaitingConsent: false,
    confirmPulse,
    cancelPulse,
    ...overrides,
  });
  return { confirmPulse, cancelPulse };
}

describe("FilterPulseWarningDialog", () => {
  afterEach(() => jest.restoreAllMocks());

  it("stays closed while no pulse is awaiting consent", () => {
    mockPulse({ awaitingConsent: false });
    render(<FilterPulseWarningDialog />);
    expect(screen.getByTestId("filter-pulse-warning")).not.toHaveAttribute("open");
  });

  it("opens when a pulse is awaiting consent", () => {
    mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);
    expect(screen.getByTestId("filter-pulse-warning")).toHaveAttribute("open");
  });

  it("warns about the photosensitivity risk in its body copy", () => {
    mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);
    expect(screen.getByText(/flashes and inverts the colours/i)).toBeInTheDocument();
  });

  it("offers both a continue and a cancel choice", () => {
    mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);
    expect(screen.getByRole("button", { name: /play the effect/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("plays the effect when continue is chosen", async () => {
    const user = userEvent.setup();
    const { confirmPulse, cancelPulse } = mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);

    await user.click(screen.getByRole("button", { name: /play the effect/i }));
    expect(confirmPulse).toHaveBeenCalledTimes(1);
    expect(cancelPulse).not.toHaveBeenCalled();
  });

  it("plays nothing when cancel is chosen", async () => {
    const user = userEvent.setup();
    const { confirmPulse, cancelPulse } = mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);

    await user.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(cancelPulse).toHaveBeenCalledTimes(1);
    expect(confirmPulse).not.toHaveBeenCalled();
  });

  it("dismisses without playing when ESC is pressed", async () => {
    const user = userEvent.setup();
    const { confirmPulse, cancelPulse } = mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);

    await user.keyboard("{Escape}");
    expect(cancelPulse).toHaveBeenCalled();
    expect(confirmPulse).not.toHaveBeenCalled();
  });

  it("is an alertdialog, labelled and described by its own copy", () => {
    mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);
    const dialog = screen.getByTestId("filter-pulse-warning");

    // alertdialog rather than the implicit dialog role: it interrupts to warn
    // and needs a decision before anything happens.
    expect(dialog).toHaveAttribute("role", "alertdialog");

    const labelId = dialog.getAttribute("aria-labelledby");
    const descId = dialog.getAttribute("aria-describedby");
    expect(labelId).toBeTruthy();
    expect(descId).toBeTruthy();
    if (labelId) expect(document.getElementById(labelId)).toHaveTextContent(/heads up/i);
    if (descId) expect(document.getElementById(descId)).toHaveTextContent(/flashes/i);
  });

  it("defaults focus to the safe choice", () => {
    mockPulse({ awaitingConsent: true });
    render(<FilterPulseWarningDialog />);
    // Cancel is autofocused so a reflexive Enter does not start the effect.
    expect(screen.getByRole("button", { name: /^cancel$/i })).toHaveFocus();
  });
});
