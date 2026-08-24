"use client";

/**
 * FilterPulseWarningDialog — photosensitivity warning shown before the
 * cinematic filter pulse plays for the first time.
 *
 * The effect flashes brightly and inverts the whole page, which can be
 * genuinely unpleasant (or unsafe) for someone with light sensitivity, so it
 * asks before running rather than surprising the visitor.
 *
 * Acknowledgement is remembered (see lib/filterPulseConsent), so this appears
 * once rather than on every click. Declining stores nothing.
 *
 * Mounted once near the app root, driven by useFilterPulse's pending state --
 * not per button, so the two FilterPulseButton instances (desktop nav and
 * mobile sidebar) share a single dialog.
 */

import { useId } from "react";
import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { useDialogElement } from "@/hooks/useDialogElement";
import { useFilterPulse } from "@/hooks/useFilterPulse";

export default function FilterPulseWarningDialog() {
  const t = useTranslations();
  const { awaitingConsent, confirmPulse, cancelPulse } = useFilterPulse();
  const titleId = useId();
  const bodyId = useId();
  const dialogRef = useDialogElement(awaitingConsent, cancelPulse);

  function handleBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) cancelPulse();
  }

  return (
    <dialog
      ref={dialogRef}
      // alertdialog rather than the implicit dialog role: this interrupts to
      // warn and requires a decision before anything happens.
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      data-testid="filter-pulse-warning"
      onClick={handleBackdropClick}
      className="
        hidden m-auto open:flex w-full max-w-md flex-col gap-4 rounded-lg
        bg-white p-6 shadow-xl
        dark:bg-gray-800
        backdrop:bg-black/50 backdrop:backdrop-blur-sm
        print:hidden
      "
    >
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {t("filterPulse.warning.title")}
      </h2>

      <p id={bodyId} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {t("filterPulse.warning.body")}
      </p>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {/* Cancel is autofocused: the safe choice should be the one a visitor
            activates by reflex with Enter. */}
        <button
          type="button"
          autoFocus
          onClick={cancelPulse}
          className="
            inline-flex items-center justify-center rounded-md border border-border
            px-4 py-2 text-sm font-medium text-foreground
            transition-colors duration-200
            hover:bg-accent hover:text-accent-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          "
        >
          {t("filterPulse.warning.cancel")}
        </button>
        <button
          type="button"
          onClick={confirmPulse}
          className="
            inline-flex items-center justify-center rounded-md
            bg-primary-600 px-4 py-2 text-sm font-medium text-white
            transition-colors duration-200
            hover:bg-primary-700
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          "
        >
          {t("filterPulse.warning.continue")}
        </button>
      </div>
    </dialog>
  );
}
