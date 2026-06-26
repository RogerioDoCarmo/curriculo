"use client";

import React, { ReactNode, useEffect, useId, useRef } from "react";

/**
 * Modal component props
 */
interface ModalProps {
  /** Whether the modal is currently open */
  readonly isOpen: boolean;
  /** Function called when the modal should be closed */
  readonly onClose: () => void;
  /** Content to display inside the modal */
  readonly children: ReactNode;
  /** Optional title displayed at the top of the modal */
  readonly title?: string;
  /** Optional prev/next handlers — when both are set, edge nav buttons appear. */
  readonly onPrev?: () => void;
  readonly onNext?: () => void;
  readonly prevLabel?: string;
  readonly nextLabel?: string;
}

/**
 * Modal component with overlay, focus trap, and keyboard navigation.
 *
 * Features:
 * - ESC key closes modal
 * - Backdrop click closes modal
 * - Focus trap keeps focus inside modal
 * - Proper ARIA attributes for accessibility
 * - Supports both light and dark themes
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
 *   <p>Are you sure you want to proceed?</p>
 *   <Button onClick={() => setIsOpen(false)}>Confirm</Button>
 * </Modal>
 * ```
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  onPrev,
  onNext,
  prevLabel = "Previous",
  nextLabel = "Next",
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Focus management: save previously focused element, restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialogRef.current.focus();
      }
    } else {
      // Restore focus to the element that was active before the modal opened
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="modal-backdrop"
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-start justify-between p-6 pb-4">
          {/* Title */}
          {title && (
            <h2
              id={titleId}
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 pr-8"
            >
              {title}
            </h2>
          )}

          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6">{children}</div>

        {/* Optional edge navigation (wraps infinitely via the handlers). */}
        {onPrev && onNext && (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label={prevLabel}
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md ring-1 ring-black/10 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-600 dark:text-white dark:ring-white/25 dark:hover:bg-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label={nextLabel}
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md ring-1 ring-black/10 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-600 dark:text-white dark:ring-white/25 dark:hover:bg-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
