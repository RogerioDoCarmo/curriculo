"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether a CSS media query currently matches.
 *
 * SSR-safe: returns `false` on the server and the first client render, then
 * updates after mount. Render the desktop/default markup for the `false` case
 * so server and client agree and there is no hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
