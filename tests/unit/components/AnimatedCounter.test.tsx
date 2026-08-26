import React from "react";
import { render, screen, act } from "@testing-library/react";
import AnimatedCounter from "@/components/AnimatedCounter";

describe("AnimatedCounter", () => {
  it("renders starting at 0 before any animation frame fires", () => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    render(<AnimatedCounter value={5} label="Years of Experience" suffix="+" />);

    expect(screen.getByText("0+")).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it("counts up toward the target value as frames fire", () => {
    const frame: { cb: FrameRequestCallback | null } = { cb: null };
    let now = 0;
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frame.cb = cb;
      return 1;
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    jest.spyOn(performance, "now").mockImplementation(() => now);

    render(<AnimatedCounter value={5} label="Years of Experience" durationMs={1000} />);

    act(() => {
      now = 1000;
      frame.cb?.(now);
    });

    expect(screen.getByText("5")).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it("jumps straight to the target when the visitor prefers reduced motion", () => {
    jest.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<AnimatedCounter value={42} label="Projects" suffix="+" />);

    expect(screen.getByText("42+")).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  it("exposes the final value and label through one accessible label, hiding the ticking number from assistive tech", () => {
    jest.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<AnimatedCounter value={10} label="Projects" suffix="+" />);

    expect(screen.getByLabelText("10+ Projects")).toBeInTheDocument();
    const [number, label] = screen.getAllByText(/10\+|Projects/);
    expect(number).toHaveAttribute("aria-hidden", "true");
    expect(label).toHaveAttribute("aria-hidden", "true");
    jest.restoreAllMocks();
  });
});
