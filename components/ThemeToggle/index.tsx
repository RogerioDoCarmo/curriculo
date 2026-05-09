"use client";

/**
 * ThemeToggle component — button to switch between light and dark modes.
 *
 * Features:
 * - Sun icon (☀️) in dark mode (clicking switches to light)
 * - Moon icon (🌙) in light mode (clicking switches to dark)
 * - Smooth transition via Tailwind transition-colors duration-200
 * - Persists theme preference to localStorage
 * - Detects system preference on first load
 * - Keyboard accessible with focus indicators
 *
 * Requirements: 17.5, 17.6, 17.8
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 *
 * @example
 * ```tsx
 * <ThemeToggle className="shadow-lg" />
 * ```
 */

import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect } from "react";

/**
 * ThemeToggle component props
 */
interface ThemeToggleProps {
  /** Additional CSS classes to apply to the button */
  readonly className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent content after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
  const icon = isDark ? "☀️" : "🌙";
  const iconLabel = isDark ? "Sun" : "Moon";

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        title="Toggle theme"
        className={`
          inline-flex items-center justify-center
          w-9 h-9 rounded-md
          border border-border
          bg-transparent
          text-foreground
          transition-colors duration-200
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          print:hidden
          ${className}
        `}
        aria-disabled="true"
      >
        <span role="img" aria-label="Theme" className="text-base leading-none">
          ☀️
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`
        inline-flex items-center justify-center
        w-9 h-9 rounded-md
        border border-border
        bg-transparent
        text-foreground
        transition-colors duration-200
        hover:bg-accent hover:text-accent-foreground
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        print:hidden
        ${className}
      `}
    >
      <span role="img" aria-label={iconLabel} className="text-base leading-none">
        {icon}
      </span>
    </button>
  );
}
