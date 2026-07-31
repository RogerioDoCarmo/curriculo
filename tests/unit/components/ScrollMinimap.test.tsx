/**
 * Unit tests for ScrollMinimap component
 * Component location: components/ScrollMinimap/index.tsx
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import ScrollMinimap from "@/components/ScrollMinimap";

// jsdom's test environment has no window.PointerEvent, and
// fireEvent.pointerDown/pointerMove silently drop clientY/pointerId as a
// result — so pointer interactions are simulated via a MouseEvent shimmed
// with a pointerId, which the component reads the same way.
function firePointerEvent(
  el: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  { clientY, pointerId }: { clientY: number; pointerId: number }
) {
  const event = new MouseEvent(type, { clientY, bubbles: true });
  Object.defineProperty(event, "pointerId", { value: pointerId });
  fireEvent(el, event);
}

const messages = {
  nav: {
    home: "Home",
    projects: "Projects",
    experience: "Experience",
    skills: "Skills",
    contact: "Contact",
  },
  scrollMinimap: {
    ariaLabel: "Page section map",
    jumpTo: "Jump to {section}",
    thumbLabel: "Current scroll position",
  },
};

let mockIsTabletOrLarger = true;
jest.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: () => mockIsTabletOrLarger,
}));

const mockNavigateTo = jest.fn();
const mockScrollToPercent = jest.fn();
let mockCurrentSection = "";

jest.mock("@/hooks/useScrollMinimap", () => ({
  useScrollMinimap: () => ({
    markers: [
      { id: "home", topPercent: 0, heightPercent: 10 },
      { id: "experience", topPercent: 20, heightPercent: 15 },
    ],
    viewportTopPercent: 5,
    viewportHeightPercent: 25,
    currentSection: mockCurrentSection,
    navigateTo: mockNavigateTo,
    scrollToPercent: mockScrollToPercent,
  }),
}));

function renderMinimap() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ScrollMinimap />
    </NextIntlClientProvider>
  );
}

describe("ScrollMinimap Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsTabletOrLarger = true;
    mockCurrentSection = "";
  });

  it("renders the section map nav landmark on tablet/desktop", () => {
    renderMinimap();
    expect(screen.getByRole("navigation", { name: /page section map/i })).toBeInTheDocument();
  });

  it("does not render on mobile", () => {
    mockIsTabletOrLarger = false;
    renderMinimap();
    expect(screen.queryByRole("navigation", { name: /page section map/i })).not.toBeInTheDocument();
  });

  it("renders a labeled marker button for each known section", () => {
    renderMinimap();
    expect(screen.getByRole("button", { name: /jump to home/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /jump to experience/i })).toBeInTheDocument();
  });

  it("highlights the marker matching the current section with the primary accent and a border", () => {
    mockCurrentSection = "experience";
    renderMinimap();
    const experienceMarker = screen.getByRole("button", { name: /jump to experience/i });
    const homeMarker = screen.getByRole("button", { name: /jump to home/i });

    expect(experienceMarker.className).toMatch(/border-2/);
    expect(experienceMarker.className).toMatch(/bg-primary-600/);
    expect(homeMarker.className).not.toMatch(/border-2/);
    expect(homeMarker.className).not.toMatch(/bg-primary-600/);
  });

  it("alternates gray tones by position, so adjacent (touching) sections are never the same shade", () => {
    renderMinimap();
    const homeMarker = screen.getByRole("button", { name: /jump to home/i });
    const experienceMarker = screen.getByRole("button", { name: /jump to experience/i });

    // markers are sorted top-to-bottom by useScrollMinimap, so index 0
    // (home) and index 1 (experience) must land on different tones.
    expect(homeMarker.className).toMatch(/bg-gray-400\/70/);
    expect(experienceMarker.className).toMatch(/bg-gray-600\/70/);
  });

  it("shows a tooltip with the nearest section name on hover, and hides it on mouse leave", () => {
    renderMinimap();
    const track = screen.getByRole("slider").parentElement as HTMLElement;

    jest.spyOn(track, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 200,
      height: 200,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // markers: home at 0%, experience at 20% — hovering at 15% (clientY 30/200)
    // is nearest to "home" (the closest marker at-or-above the hover point).
    fireEvent.mouseMove(track, { clientY: 30 });
    expect(screen.getByText("Home")).toBeInTheDocument();

    // Hovering past 20% (clientY 50/200 = 25%) should now show "Experience".
    fireEvent.mouseMove(track, { clientY: 50 });
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();

    fireEvent.mouseLeave(track);
    expect(screen.queryByText("Experience")).not.toBeInTheDocument();
  });

  it("calls navigateTo when a marker is clicked, without triggering a track click", async () => {
    const user = userEvent.setup();
    renderMinimap();

    await user.click(screen.getByRole("button", { name: /jump to home/i }));

    expect(mockNavigateTo).toHaveBeenCalledWith("home");
    expect(mockScrollToPercent).not.toHaveBeenCalled();
  });

  it("scrolls to the clicked percentage when the bare track is clicked", () => {
    renderMinimap();
    const track = screen.getByRole("slider").parentElement as HTMLElement;

    jest.spyOn(track, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 200,
      height: 200,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(track, { clientY: 100 });

    expect(mockScrollToPercent).toHaveBeenCalledWith(50, "smooth");
  });

  it("scrolls live while dragging the thumb, using instant behavior", () => {
    renderMinimap();
    const thumb = screen.getByRole("slider");
    const track = thumb.parentElement as HTMLElement;

    jest.spyOn(track, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 200,
      height: 200,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    firePointerEvent(thumb, "pointerdown", { pointerId: 1, clientY: 20 });
    firePointerEvent(thumb, "pointermove", { pointerId: 1, clientY: 150 });

    expect(mockScrollToPercent).toHaveBeenCalledWith(75, "instant");
    expect(mockScrollToPercent).not.toHaveBeenCalledWith(expect.anything(), "smooth");
  });

  it("ignores pointer moves before a pointer down (not dragging)", () => {
    renderMinimap();
    const thumb = screen.getByRole("slider");

    firePointerEvent(thumb, "pointermove", { pointerId: 1, clientY: 150 });

    expect(mockScrollToPercent).not.toHaveBeenCalled();
  });

  it("supports keyboard navigation on the thumb: ArrowDown, ArrowUp, Home, End", () => {
    renderMinimap();
    const thumb = screen.getByRole("slider");

    fireEvent.keyDown(thumb, { key: "ArrowDown" });
    expect(mockScrollToPercent).toHaveBeenLastCalledWith(10, "smooth"); // 5 + 5 step

    fireEvent.keyDown(thumb, { key: "ArrowUp" });
    expect(mockScrollToPercent).toHaveBeenLastCalledWith(0, "smooth"); // 5 - 5 step

    fireEvent.keyDown(thumb, { key: "End" });
    expect(mockScrollToPercent).toHaveBeenLastCalledWith(100, "smooth");

    fireEvent.keyDown(thumb, { key: "Home" });
    expect(mockScrollToPercent).toHaveBeenLastCalledWith(0, "smooth");
  });

  it("exposes the thumb as an accessible vertical slider with literal ARIA values", () => {
    renderMinimap();
    const thumb = screen.getByRole("slider");

    expect(thumb).toHaveAttribute("aria-orientation", "vertical");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
    expect(thumb).toHaveAttribute("aria-valuenow", "5");
    expect(thumb).toHaveAttribute("aria-label", "Current scroll position");
    expect(thumb).toHaveAttribute("tabIndex", "0");
  });

  it("is hidden from print via the print:hidden class", () => {
    renderMinimap();
    const nav = screen.getByRole("navigation", { name: /page section map/i });
    expect(nav.className).toMatch(/print:hidden/);
  });
});
