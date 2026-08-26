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
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return ref;
}
