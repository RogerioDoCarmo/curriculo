"use client";

/**
 * Wraps the app with the offline-detector-web widget (snackbar, banner,
 * indicator) so a real internet outage is distinguished from the browser's
 * own online flag. Locale and theme are read from this site's own
 * next-intl / useTheme state rather than left on the library's defaults.
 *
 * The indicator is moved off its default `top-end` position because that
 * corner is already owned by ScrollMinimap (components/ScrollMinimap),
 * which is `fixed right-[24.5px] top-20` from the `md` breakpoint up — the
 * two badges overlapped there. `bottom-end` sits near BackToTopButton
 * (`fixed bottom-8 right-8`), confirmed clear of it.
 */

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { OfflineDetector } from "@rogeriodocarmo/offline-detector-web";
import { useTheme } from "@/hooks/useTheme";

interface OfflineDetectorProviderProps {
  readonly children: ReactNode;
}

export default function OfflineDetectorProvider({ children }: OfflineDetectorProviderProps) {
  const locale = useLocale();
  const { theme } = useTheme();

  return (
    <OfflineDetector locale={locale} colorScheme={theme} indicator={{ position: "bottom-end" }}>
      {children}
    </OfflineDetector>
  );
}
