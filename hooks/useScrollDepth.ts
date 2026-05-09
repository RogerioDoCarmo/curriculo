/**
 * Hook to track scroll depth milestones (25%, 50%, 75%, 100%).
 * Tracks each milestone only once per page visit.
 */

import { useEffect, useRef } from "react";
import { trackScrollDepth } from "@/lib/analytics";

export function useScrollDepth() {
  const trackedDepths = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track milestones
      [25, 50, 75, 100].forEach((depth) => {
        if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackScrollDepth({ depth_percentage: depth as 25 | 50 | 75 | 100 });
        }
      });
    };

    // Initial check in case user is already scrolled
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
