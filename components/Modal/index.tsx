"use client";

import React, { ReactNode, useEffect, useId } from "react";
import { useDialogElement } from "@/hooks/useDialogElement";

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
 * Modal component backed by the native `<dialog>` element.
 *
 * Features:
 * - ESC key closes modal (native `<dialog>` behavior)
 * - Backdrop click closes modal
 * - Native focus containment and focus restore on close
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
  // Body scroll lock.
  //
  // `overflow: hidden` on the body propagates to the viewport, which collapses
  // the scrollable area and clamps the page to the top — reopening at scroll 0
  // once the modal closes. Pinning the body at its current offset keeps the
  // page visually where it was, and the position is restored on close.
  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      // Instant, not smooth: `html { scroll-behavior: smooth }` would otherwise
      // animate the restore and let the reader watch the page fly back.
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [isOpen]);

  // Declared after the scroll lock on purpose: effects run in hook order,
  // and `showModal()` can itself move the page scroll — the lock has to
  // snapshot the reader's position before that happens.
  const dialogRef = useDialogElement(isOpen, onClose);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      onClick={handleBackdropClick}
      className="hidden relative m-auto open:flex w-full max-w-4xl max-h-[90vh] flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {/* Header with close button */}
      <div className="flex items-start justify-between p-6 pb-4">
        {/* Title */}
        {title && (
          <h2 id={titleId} className="text-xl font-semibold text-gray-900 dark:text-gray-100 pr-8">
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

      {/* Scrollable content. With nav, the Prev/Next buttons live in side
            gutters (flex), so they stay clear of the content text AND its
            scrollbar instead of overlapping them. */}
      {onPrev && onNext ? (
        <div className="flex min-h-0 flex-1 items-stretch gap-4 px-4">
          <button
            type="button"
            onClick={onPrev}
            aria-label={prevLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-white text-gray-900 shadow-md ring-1 ring-black/10 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-600 dark:text-white dark:ring-white/25 dark:hover:bg-gray-500"
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

          <div className="min-w-0 flex-1 overflow-y-auto px-4 pb-6">{children}</div>

          <button
            type="button"
            onClick={onNext}
            aria-label={nextLabel}
            className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-white text-gray-900 shadow-md ring-1 ring-black/10 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-600 dark:text-white dark:ring-white/25 dark:hover:bg-gray-500"
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
        </div>
      ) : (
        <div className="overflow-y-auto px-6 pb-6">{children}</div>
      )}
    </dialog>
  );
}
