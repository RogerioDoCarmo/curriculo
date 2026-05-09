/**
 * Hook to track time spent on each page.
 * Tracks when user navigates away or closes the page.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackTimeOnPage } from "@/lib/analytics";

export function useTimeOnPage() {
  const pathname = usePathname();
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Reset start time when pathname changes
    startTime.current = Date.now();

    return () => {
      // Track time when component unmounts (navigation away)
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent > 0) {
        trackTimeOnPage({ page_path: pathname, time_seconds: timeSpent });
      }
    };
  }, [pathname]);

  useEffect(() => {
    // Track time when page is about to unload
    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent > 0) {
        trackTimeOnPage({ page_path: pathname, time_seconds: timeSpent });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname]);
}
