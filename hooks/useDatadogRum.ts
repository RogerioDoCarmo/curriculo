/**
 * Hook to start Datadog RUM once on mount.
 * The init call itself is SSR-, config-, and consent-gated (see lib/datadog),
 * so it is always safe to call unconditionally here.
 */

import { useEffect } from "react";
import { initDatadogRum } from "@/lib/datadog";

export function useDatadogRum() {
  useEffect(() => {
    void initDatadogRum();
  }, []);
}
