"use client";

/**
 * BackToTopButton component — floating button to scroll back to top of page.
 *
 * - Fixed position in bottom-right corner of viewport
 * - Appears when user scrolls past threshold (default: 300px)
 * - Smooth scroll to top on click
 * - Keyboard accessible (tabIndex, Enter key)
 * - ARIA label for screen readers
 * - Hidden in print media
 *
 * Requirements: 22.1-22.10
 */

import { useState, useEffect } from "react";

interface BackToTopButtonProps {
  className?: string;
  threshold?: number;
}

export default function BackToTopButton({ className = "", threshold = 300 }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    // Run once on mount to set initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      scrollToTop();
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Back to top"
      tabIndex={0}
      className={`
        fixed bottom-8 right-8 z-50
        print:hidden
        inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-primary-600 text-white
        dark:bg-primary-500 dark:text-white
        shadow-md
        hover:bg-primary-700 dark:hover:bg-primary-400
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        transition-colors duration-200
        ${className}
      `.trim()}
    >
      <span aria-hidden="true" className="text-lg leading-none">
        ↑
      </span>
    </button>
  );
}
