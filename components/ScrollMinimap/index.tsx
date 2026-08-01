"use client";

/**
 * ScrollMinimap — PDF-reader-style page navigator.
 *
 * A thin vertical track (tablet/desktop only) showing where the known
 * sections sit across the full page height, plus a draggable thumb showing
 * the current viewport. Click a section marker to jump straight to it, click
 * the bare track for a coarse jump, or drag/keyboard the thumb to scroll.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollMinimap } from "@/hooks/useScrollMinimap";

const KEYBOARD_STEP_PERCENT = 5;
const MIN_THUMB_HEIGHT_PERCENT = 4;
const MIN_MARKER_HEIGHT_PERCENT = 1;

// Sober, mostly-gray palette (after github.com/ben-knight-dev's scroll
// minimap: https://www.ben-knight.dev/blog/web/documentscroll/) — two
// neutral tones alternate by position instead of one hue per section, and
// color is reserved for the one thing that actually needs to pop: the
// active section. `markers` is sorted top-to-bottom by useScrollMinimap, so
// alternating by index is a two-coloring of a path graph — it's
// mathematically guaranteed that two DOM-adjacent (touching) sections never
// share a tone, without having to special-case which pairs happen to touch.
const MARKER_TONE_CLASSES = [
  "bg-gray-400/70 dark:bg-gray-500/70",
  "bg-gray-600/70 dark:bg-gray-300/70",
];
const ACTIVE_MARKER_CLASS =
  "bg-primary-600 dark:bg-primary-400 border-2 border-white dark:border-gray-900";

export default function ScrollMinimap() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const isTabletOrLarger = useMediaQuery("(min-width: 768px)");
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);

  const {
    markers,
    viewportTopPercent,
    viewportHeightPercent,
    currentSection,
    navigateTo,
    scrollToPercent,
  } = useScrollMinimap();

  useEffect(() => {
    setMounted(true);
  }, []);

  const percentFromClientY = useCallback((clientY: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = (clientY - rect.top) / rect.height;
    return Math.min(Math.max(ratio, 0), 1) * 100;
  }, []);

  const handleTrackClick = (event: MouseEvent<HTMLDivElement>) => {
    scrollToPercent(percentFromClientY(event.clientY), "smooth");
  };

  const handleTrackMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    setHoverPercent(percentFromClientY(event.clientY));
  };

  const handleTrackMouseLeave = () => setHoverPercent(null);

  // The section nearest at-or-above the hovered point. markers is sorted
  // top-to-bottom by useScrollMinimap, so the last one at-or-above the
  // hover point is simply the last match while iterating in order.
  const hoveredSection =
    hoverPercent === null
      ? null
      : (markers.findLast((marker) => marker.topPercent <= hoverPercent) ?? null);

  const handleThumbPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleThumbPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    event.stopPropagation();
    // "auto" defers to the page's global `scroll-behavior: smooth` (see
    // app/globals.css), which would launch a competing smooth-scroll
    // animation on every move event instead of tracking the cursor
    // 1:1. "instant" bypasses that and jumps immediately.
    scrollToPercent(percentFromClientY(event.clientY), "instant");
  };

  const handleThumbPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleThumbKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        scrollToPercent(viewportTopPercent - KEYBOARD_STEP_PERCENT, "smooth");
        break;
      case "ArrowDown":
        event.preventDefault();
        scrollToPercent(viewportTopPercent + KEYBOARD_STEP_PERCENT, "smooth");
        break;
      case "Home":
        event.preventDefault();
        scrollToPercent(0, "smooth");
        break;
      case "End":
        event.preventDefault();
        scrollToPercent(100, "smooth");
        break;
      default:
        break;
    }
  };

  if (!mounted || !isTabletOrLarger) return null;

  return (
    <nav
      aria-label={t("scrollMinimap.ariaLabel")}
      className="fixed right-[24.5px] top-20 z-40 hidden h-[60vh] w-13.75 md:block print:hidden"
    >
      {/* Sibling of the track, not a child of it — the track has
          overflow-hidden (to clip its square-cornered blocks to its rounded
          corners), which would otherwise clip this tooltip too, since it's
          positioned outside the track's own box via right-full. */}
      {hoveredSection && (
        <div
          aria-hidden="true"
          style={{ top: `${hoverPercent}%` }}
          className="pointer-events-none absolute right-full mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-md dark:bg-gray-100 dark:text-gray-900"
        >
          {t(`nav.${hoveredSection.id}`)}
        </div>
      )}

      <div
        ref={trackRef}
        onMouseMove={handleTrackMouseMove}
        onMouseLeave={handleTrackMouseLeave}
        className="relative h-full w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        {/* Decorative click-to-jump layer: a mouse-only convenience on top
            of the fully keyboard-accessible thumb below (the WAI-ARIA APG
            slider pattern treats click-anywhere-on-track as a supplementary
            affordance, not a replacement for the thumb's own keyboard
            support) — aria-hidden so assistive tech skips it, and painted
            first so the real markers/thumb stack above and stay clickable. */}
        <div
          aria-hidden="true"
          onClick={handleTrackClick}
          className="absolute inset-0 cursor-pointer"
        />

        {markers.map((marker, index) => {
          const isActive = currentSection === marker.id;
          return (
            <button
              key={marker.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigateTo(marker.id);
              }}
              aria-label={t("scrollMinimap.jumpTo", { section: t(`nav.${marker.id}`) })}
              style={{
                top: `calc(${marker.topPercent}% + 1px)`,
                height: `calc(${Math.max(marker.heightPercent, MIN_MARKER_HEIGHT_PERCENT)}% - 2px)`,
              }}
              className={`absolute left-0 w-full transition-colors ${
                isActive ? ACTIVE_MARKER_CLASS : MARKER_TONE_CLASSES[index % 2]
              }`}
            />
          );
        })}

        <div
          role="slider"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label={t("scrollMinimap.thumbLabel")}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(viewportTopPercent)}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onKeyDown={handleThumbKeyDown}
          style={{
            top: `${viewportTopPercent}%`,
            height: `${Math.max(viewportHeightPercent, MIN_THUMB_HEIGHT_PERCENT)}%`,
          }}
          className="absolute left-0 w-full cursor-grab border-2 border-primary-600 bg-primary-900/20 active:cursor-grabbing dark:border-primary-400 dark:bg-white/30"
        />
      </div>
    </nav>
  );
}
