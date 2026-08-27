"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "copied" | "failed";

/**
 * Copies text to the clipboard and exposes a short-lived status flag for
 * feedback ("Link copied!"), reverting to "idle" after `resetMs`.
 *
 * `navigator.clipboard` is undefined in insecure contexts (and in jsdom), so
 * its absence is treated the same as a rejected write: status "failed", never
 * a thrown error.
 */
export function useCopyToClipboard(resetMs = 2000): {
  status: CopyStatus;
  copied: boolean;
  failed: boolean;
  copy: (text: string) => Promise<boolean>;
} {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);

      let succeeded = false;
      try {
        const clipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
        if (clipboard) {
          await clipboard.writeText(text);
          succeeded = true;
        }
      } catch {
        succeeded = false;
      }

      setStatus(succeeded ? "copied" : "failed");
      timerRef.current = setTimeout(() => setStatus("idle"), resetMs);
      return succeeded;
    },
    [resetMs]
  );

  return { status, copied: status === "copied", failed: status === "failed", copy };
}
