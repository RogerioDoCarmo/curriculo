"use client";

/**
 * useScrollMinimap hook — measurements and scroll math behind the ScrollMinimap
 * component: where each known section sits (top%/height%) relative to the
 * full document height, where the current viewport sits, and how to jump to
 * an arbitrary scroll percentage.
 *
 * Recomputes section positions on window resize and via a ResizeObserver on
 * document.body, since content height can change without a window resize
 * (e.g. the CareerPathSelector professional/academic toggle changes
 * ExperienceSection's height).
 */

import { useCallback, useEffect, useState } from "react";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { NAV_SECTIONS, type NavSection } from "@/lib/nav-sections";

interface SectionMarker {
  readonly id: NavSection;
  readonly topPercent: number;
  readonly heightPercent: number;
}

interface UseScrollMinimapResult {
  readonly markers: SectionMarker[];
  readonly viewportTopPercent: number;
  readonly viewportHeightPercent: number;
  readonly currentSection: string;
  readonly navigateTo: (sectionId: string) => void;
  readonly scrollToPercent: (percent: number, behavior?: ScrollBehavior) => void;
}

function getScrollableHeight(): number {
  return Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
}

export function useScrollMinimap(): UseScrollMinimapResult {
  const { currentSection, navigateTo } = useAnchorNavigation([...NAV_SECTIONS]);

  const [markers, setMarkers] = useState<SectionMarker[]>([]);
  const [viewportTopPercent, setViewportTopPercent] = useState(0);
  const [viewportHeightPercent, setViewportHeightPercent] = useState(0);

  const measureMarkers = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight;
    if (docHeight === 0) return;

    const next: SectionMarker[] = [];
    for (const id of NAV_SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      next.push({
        id,
        topPercent: (el.offsetTop / docHeight) * 100,
        heightPercent: (el.offsetHeight / docHeight) * 100,
      });
    }
    // NAV_SECTIONS is nav order, not DOM order — sort so consumers (e.g. the
    // minimap's alternating-tone rendering) can rely on visual top-to-bottom
    // order without re-deriving it themselves.
    next.sort((a, b) => a.topPercent - b.topPercent);
    setMarkers(next);
  }, []);

  const measureViewport = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight;
    if (docHeight === 0) return;

    setViewportTopPercent((window.scrollY / docHeight) * 100);
    setViewportHeightPercent((window.innerHeight / docHeight) * 100);
  }, []);

  useEffect(() => {
    measureMarkers();
    measureViewport();

    const handleResize = () => {
      measureMarkers();
      measureViewport();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", measureViewport, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      measureMarkers();
      measureViewport();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", measureViewport);
      resizeObserver.disconnect();
    };
  }, [measureMarkers, measureViewport]);

  const scrollToPercent = useCallback((percent: number, behavior: ScrollBehavior = "smooth") => {
    const clamped = Math.min(Math.max(percent, 0), 100);
    window.scrollTo({ top: (clamped / 100) * getScrollableHeight(), behavior });
  }, []);

  return {
    markers,
    viewportTopPercent,
    viewportHeightPercent,
    currentSection,
    navigateTo,
    scrollToPercent,
  };
}
