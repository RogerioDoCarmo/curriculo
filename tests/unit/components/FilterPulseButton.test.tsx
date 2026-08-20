/**
 * Unit tests for FilterPulseButton component.
 * Tests rendering, interaction, the re-trigger guard, and accessibility.
 */

import React, { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterPulseButton from "@/components/FilterPulseButton";
import { FilterPulseProvider } from "@/hooks/useFilterPulse";
import * as useFilterPulseModule from "@/hooks/useFilterPulse";

const wrapper = ({ children }: { children: ReactNode }) => (
  <FilterPulseProvider>{children}</FilterPulseProvider>
);

describe("FilterPulseButton Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1000 });
    Object.defineProperty(window, "innerHeight", { writable: true, value: 800 });
  });

  it("should render the button", () => {
    render(<FilterPulseButton />, { wrapper });
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should use the default English label when none is given", () => {
    render(<FilterPulseButton />, { wrapper });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Trigger filter pulse effect");
  });

  it("should apply a custom label to aria-label and title", () => {
    render(<FilterPulseButton label="Ativar efeito de pulso sépia" />, { wrapper });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Ativar efeito de pulso sépia");
    expect(button).toHaveAttribute("title", "Ativar efeito de pulso sépia");
  });

  it("should have title matching aria-label", () => {
    render(<FilterPulseButton />, { wrapper });
    const button = screen.getByRole("button");
    expect(button.getAttribute("title")).toBe(button.getAttribute("aria-label"));
  });

  it("should have proper button type", () => {
    render(<FilterPulseButton />, { wrapper });
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("should accept custom className", () => {
    render(<FilterPulseButton className="custom-class" />, { wrapper });
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should trigger the pulse from the button's own position when clicked", async () => {
    const user = userEvent.setup();
    const triggerSpy = jest.fn();
    jest.spyOn(useFilterPulseModule, "useFilterPulse").mockReturnValue({
      phase: "idle",
      origin: { x: 0, y: 0 },
      maxRadius: 0,
      activeFilterId: "sepia",
      prefersReducedMotion: false,
      trigger: triggerSpy,
    });

    render(<FilterPulseButton filterId="sepia" />);
    await user.click(screen.getByRole("button"));

    expect(triggerSpy).toHaveBeenCalledTimes(1);
    expect(triggerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
      "sepia"
    );

    jest.restoreAllMocks();
  });

  it("should call onTriggered after a successful click", async () => {
    const user = userEvent.setup();
    const onTriggered = jest.fn();
    render(<FilterPulseButton onTriggered={onTriggered} />, { wrapper });

    await user.click(screen.getByRole("button"));
    expect(onTriggered).toHaveBeenCalledTimes(1);
  });

  it("should disable the button while a pulse is in progress and ignore clicks", async () => {
    const user = userEvent.setup();
    const triggerSpy = jest.fn();
    jest.spyOn(useFilterPulseModule, "useFilterPulse").mockReturnValue({
      phase: "expanding",
      origin: { x: 0, y: 0 },
      maxRadius: 100,
      activeFilterId: "sepia",
      prefersReducedMotion: false,
      trigger: triggerSpy,
    });

    render(<FilterPulseButton />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    await user.click(button);
    expect(triggerSpy).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
