import React from "react";
import { render, screen } from "@testing-library/react";
import PulseAnimation from "@/components/PulseAnimation";

jest.mock("lottie-react", () => ({
  // Real Lottie rendering needs browser APIs jsdom doesn't provide; the
  // wrapper's own contract (accessible role/label, reduced-motion fallback)
  // is what these tests verify, not the animation engine itself.
  Lottie: (props: { readonly className?: string; readonly "aria-hidden"?: boolean }) => (
    <div data-testid="lottie-mock" className={props.className} aria-hidden={props["aria-hidden"]} />
  ),
}));

describe("PulseAnimation", () => {
  it("exposes an accessible image role with the given label", () => {
    render(<PulseAnimation label="Loading" />);
    expect(screen.getByRole("img", { name: "Loading" })).toBeInTheDocument();
  });

  it("sizes the wrapper using the size prop", () => {
    render(<PulseAnimation label="Loading" size={64} />);
    const wrapper = screen.getByRole("img", { name: "Loading" });
    expect(wrapper).toHaveStyle({ width: "64px", height: "64px" });
  });

  it("defaults to a 96px size", () => {
    render(<PulseAnimation label="Loading" />);
    const wrapper = screen.getByRole("img", { name: "Loading" });
    expect(wrapper).toHaveStyle({ width: "96px", height: "96px" });
  });

  it("hides the Lottie animation from assistive tech (the wrapper already carries the label)", () => {
    render(<PulseAnimation label="Loading" />);
    expect(screen.getByTestId("lottie-mock")).toHaveAttribute("aria-hidden", "true");
  });

  it("hides the animated version and shows the static fallback under prefers-reduced-motion", () => {
    render(<PulseAnimation label="Loading" />);
    expect(screen.getByTestId("lottie-mock")).toHaveClass("motion-reduce:hidden");
    const wrapper = screen.getByRole("img", { name: "Loading" });
    const staticFallback = wrapper.querySelector(".motion-reduce\\:block");
    expect(staticFallback).not.toBeNull();
    expect(staticFallback).toHaveClass("hidden");
  });
});
