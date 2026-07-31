/**
 * Unit tests for useScrollMinimap hook
 * Tests marker/viewport percentage math and scrollToPercent behavior.
 * useAnchorNavigation itself is already covered by its own test suite, so it's
 * mocked here — this suite focuses on the measurement logic this hook adds.
 */

import { renderHook, act } from "@testing-library/react";
import { useScrollMinimap } from "@/hooks/useScrollMinimap";

const mockNavigateTo = jest.fn();
let mockCurrentSection = "";

jest.mock("@/hooks/useAnchorNavigation", () => ({
  useAnchorNavigation: () => ({
    currentSection: mockCurrentSection,
    navigateTo: mockNavigateTo,
  }),
}));

function defineSection(id: string, offsetTop: number, offsetHeight: number) {
  const el = document.createElement("div");
  el.id = id;
  Object.defineProperty(el, "offsetTop", { value: offsetTop, configurable: true });
  Object.defineProperty(el, "offsetHeight", { value: offsetHeight, configurable: true });
  document.body.appendChild(el);
}

function setDocHeight(height: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: height,
    configurable: true,
  });
}

function setViewport(scrollY: number, innerHeight: number) {
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true, writable: true });
  Object.defineProperty(window, "innerHeight", {
    value: innerHeight,
    configurable: true,
    writable: true,
  });
}

const scrollToMock = jest.fn();

describe("useScrollMinimap", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    mockCurrentSection = "";
    scrollToMock.mockClear();
    Object.defineProperty(window, "scrollTo", { value: scrollToMock, writable: true });
    setDocHeight(2000);
    setViewport(0, 800);
  });

  it("computes each marker's top%/height% relative to document height", () => {
    defineSection("home", 0, 400);
    defineSection("projects", 400, 300);

    const { result } = renderHook(() => useScrollMinimap());

    const home = result.current.markers.find((m) => m.id === "home");
    const projects = result.current.markers.find((m) => m.id === "projects");

    expect(home).toEqual({ id: "home", topPercent: 0, heightPercent: 20 });
    expect(projects).toEqual({ id: "projects", topPercent: 20, heightPercent: 15 });
  });

  it("skips sections whose id is not present in the DOM", () => {
    defineSection("home", 0, 400);

    const { result } = renderHook(() => useScrollMinimap());

    expect(result.current.markers.map((m) => m.id)).toEqual(["home"]);
  });

  it("computes viewport top%/height% from scrollY and innerHeight", () => {
    setViewport(400, 800);

    const { result } = renderHook(() => useScrollMinimap());

    expect(result.current.viewportTopPercent).toBe(20);
    expect(result.current.viewportHeightPercent).toBe(40);
  });

  it("recomputes markers and viewport on window resize", () => {
    defineSection("home", 0, 400);
    const { result } = renderHook(() => useScrollMinimap());

    expect(result.current.markers[0]?.heightPercent).toBe(20);

    act(() => {
      document.getElementById("home")?.remove();
      defineSection("home", 0, 1000);
      setDocHeight(2000);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.markers[0]?.heightPercent).toBe(50);
  });

  it("scrolls to the requested percentage of the scrollable height, defaulting to smooth", () => {
    setDocHeight(2000);
    setViewport(0, 800); // scrollable height = 2000 - 800 = 1200

    const { result } = renderHook(() => useScrollMinimap());

    act(() => {
      result.current.scrollToPercent(50);
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 600, behavior: "smooth" });
  });

  it("clamps out-of-range percentages before scrolling", () => {
    setDocHeight(2000);
    setViewport(0, 800);

    const { result } = renderHook(() => useScrollMinimap());

    act(() => {
      result.current.scrollToPercent(150, "auto");
    });
    expect(scrollToMock).toHaveBeenLastCalledWith({ top: 1200, behavior: "auto" });

    act(() => {
      result.current.scrollToPercent(-20, "auto");
    });
    expect(scrollToMock).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" });
  });

  it("passes through currentSection and navigateTo from useAnchorNavigation", () => {
    mockCurrentSection = "experience";
    const { result } = renderHook(() => useScrollMinimap());

    expect(result.current.currentSection).toBe("experience");

    act(() => {
      result.current.navigateTo("skills");
    });
    expect(mockNavigateTo).toHaveBeenCalledWith("skills");
  });

  it("ignores DOM elements whose id is not a canonical nav section", () => {
    defineSection("home", 0, 400);
    defineSection("random-div", 400, 200);

    const { result } = renderHook(() => useScrollMinimap());

    expect(result.current.markers.map((m) => m.id)).toEqual(["home"]);
  });
});
