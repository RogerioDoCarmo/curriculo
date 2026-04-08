"use client";

/**
 * ThemeToggle component — button to switch between light and dark modes.
 *
 * - Sun icon (☀️) in dark mode (clicking switches to light)
 * - Moon icon (🌙) in light mode (clicking switches to dark)
 * - Smooth transition via Tailwind transition-colors duration-200
 *
 * Requirements: 17.5, 17.6, 17.8
 */

import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
  const icon = isDark ? "☀️" : "🌙";
  const iconLabel = isDark ? "Sun" : "Moon";

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
        ${className}
      `}
    >
      <span role="img" aria-label={iconLabel} className="text-base leading-none">
        {icon}
      </span>
    </button>
  );
}
