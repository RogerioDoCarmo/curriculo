"use client";

/**
 * SwipeCarousel
 *
 * A horizontally swipeable, snap-per-item carousel that loops infinitely in
 * both directions. Built on native touch scrolling + CSS scroll-snap (so it
 * feels right on mobile Safari/Chrome) rather than a JS transform.
 *
 * Infinite loop: the items are rendered three times and the visitor is kept in
 * the middle copy. After each scroll settles, `recenter` jumps by one copy
 * width if they've drifted into an outer copy — invisible because the copies
 * are identical, and it lands on an equivalent snap point. This allows wrapping
 * past either end without hitting a hard scroll boundary.
 *
 * Accessibility: only the middle copy is exposed to assistive tech and the tab
 * order; the outer copies are `inert` + `aria-hidden`. Optional Prev/Next
 * buttons step one item at a time for non-touch users.
 */

import { useCallback, useEffect, useRef } from "react";

export interface CarouselItem {
  /** Stable key, unique within the item list. */
  readonly key: string;
  readonly node: React.ReactNode;
}

interface SwipeCarouselProps {
  readonly items: readonly CarouselItem[];
  /** Accessible name for the scrollable list. */
  readonly ariaLabel: string;
  /** Classes applied to each item wrapper (e.g. width + snap alignment helpers). */
  readonly itemClassName?: string;
  /** Gap utility between items (default gap-4). */
  readonly gapClassName?: string;
  /** Render circular Prev/Next controls beside the track. */
  readonly showControls?: boolean;
  readonly prevLabel?: string;
  readonly nextLabel?: string;
}

function ChevronButton({
  direction,
  label,
  onClick,
}: {
  readonly direction: "prev" | "next";
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 sm:flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  );
}

export default function SwipeCarousel({
  items,
  ariaLabel,
  itemClassName = "",
  gapClassName = "gap-4",
  showControls = false,
  prevLabel = "Previous",
  nextLabel = "Next",
}: SwipeCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Snap scrollLeft back into the middle copy once the visitor has drifted into
  // an outer copy. The copies are identical, so the ±setWidth jump is invisible.
  const recenter = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const setWidth = el.scrollWidth / 3;
    if (setWidth <= 0) return;
    if (el.scrollLeft < setWidth * 0.5) {
      el.scrollLeft += setWidth;
    } else if (el.scrollLeft >= setWidth * 1.5) {
      el.scrollLeft -= setWidth;
    }
  }, []);

  // Start in the middle copy so there is a full copy of room on each side.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth / 3;
  }, [items.length]);

  // Recenter after scrolling settles (debounced — works without scrollend).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(recenter, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [recenter]);

  const step = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const tile = item ? item.getBoundingClientRect().width + gap : 0;
    el.scrollBy({ left: tile * direction, behavior: "smooth" });
  }, []);

  // Three copies drive the infinite loop; only the middle one is interactive.
  const copies = [0, 1, 2];

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {showControls && (
        <ChevronButton direction="prev" label={prevLabel} onClick={() => step(-1)} />
      )}

      <ul
        ref={trackRef}
        aria-label={ariaLabel}
        className={`no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain ${gapClassName}`}
      >
        {copies.map((copy) =>
          items.map((item) => (
            <li
              key={`${copy}-${item.key}`}
              aria-hidden={copy === 1 ? undefined : "true"}
              inert={copy === 1 ? undefined : true}
              className={`shrink-0 snap-center ${itemClassName}`}
            >
              {item.node}
            </li>
          ))
        )}
      </ul>

      {showControls && <ChevronButton direction="next" label={nextLabel} onClick={() => step(1)} />}
    </div>
  );
}
