"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a native `<dialog>` element's imperative modal lifecycle from React
 * state, and keeps that state in sync when the dialog closes natively (ESC,
 * or any other means) via the dialog's "close" event.
 */
export function useDialogElement(isOpen: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      // The "close" event is dispatched asynchronously, so it can arrive after
      // a rapid close-then-open sequence (browser back/forward, for instance)
      // has already reopened the dialog. Reporting that stale close would tell
      // the consumer the dialog is shut while it is plainly on screen.
      if (dialog.open) return;
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return ref;
}
