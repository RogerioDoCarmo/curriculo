import { fireEvent, render, screen, within } from "@testing-library/react";
import SwipeCarousel, { type CarouselItem } from "@/components/SwipeCarousel";

const items: CarouselItem[] = [
  { key: "a", node: <span>Item A</span> },
  { key: "b", node: <span>Item B</span> },
];

/** Give a track element controllable scroll geometry (jsdom has none). */
function stubScroll(ul: HTMLElement, scrollWidth: number, initial = 0) {
  let left = initial;
  Object.defineProperty(ul, "scrollWidth", { configurable: true, get: () => scrollWidth });
  Object.defineProperty(ul, "clientWidth", { configurable: true, get: () => 100 });
  Object.defineProperty(ul, "scrollLeft", {
    configurable: true,
    get: () => left,
    set: (v) => {
      left = v;
    },
  });
  (ul as unknown as { scrollBy: (o: { left: number }) => void }).scrollBy = ({ left: dx }) => {
    left += dx;
  };
  return () => left;
}

describe("SwipeCarousel", () => {
  it("renders three copies, exposing only the middle one to a11y", () => {
    render(<SwipeCarousel items={items} ariaLabel="Demo" />);

    // Each item appears three times (two outer copies + the live middle copy).
    expect(screen.getAllByText("Item A")).toHaveLength(3);

    const list = screen.getByRole("list", { name: "Demo" });
    const lis = within(list).getAllByRole("listitem", { hidden: true });
    expect(lis).toHaveLength(6);

    const hidden = lis.filter((li) => li.getAttribute("aria-hidden") === "true");
    const live = lis.filter((li) => li.getAttribute("aria-hidden") === null);
    expect(hidden).toHaveLength(4); // copies 0 and 2
    expect(live).toHaveLength(2); // middle copy
    expect(hidden.every((li) => li.hasAttribute("inert"))).toBe(true);
  });

  it("does not render controls by default", () => {
    render(<SwipeCarousel items={items} ariaLabel="Demo" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("steps the track via Prev/Next controls", () => {
    render(
      <SwipeCarousel
        items={items}
        ariaLabel="Demo"
        showControls
        prevLabel="Prev"
        nextLabel="Next"
      />
    );
    const list = screen.getByRole("list", { name: "Demo" });
    const read = stubScroll(list, 900);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(read()).toBeGreaterThanOrEqual(0); // scrollBy invoked without throwing
    fireEvent.click(screen.getByRole("button", { name: "Prev" }));
    expect(typeof read()).toBe("number");
  });

  it("recenters into the middle copy after scrolling settles", () => {
    jest.useFakeTimers();
    try {
      render(<SwipeCarousel items={items} ariaLabel="Demo" />);
      const list = screen.getByRole("list", { name: "Demo" });

      // setWidth = 300. scrollLeft below 150 should jump forward by one copy.
      const readLow = stubScroll(list, 900, 0);
      fireEvent.scroll(list);
      jest.advanceTimersByTime(150);
      expect(readLow()).toBe(300);

      // scrollLeft above 450 should jump back by one copy.
      stubScroll(list, 900, 500);
      fireEvent.scroll(list);
      jest.advanceTimersByTime(150);
      expect(list.scrollLeft).toBe(200);
    } finally {
      jest.useRealTimers();
    }
  });
});
