"use client";

import React, { ReactNode } from "react";

/**
 * Button component props
 */
interface ButtonProps {
  /** Visual style of the button: primary (main CTA), secondary (alternative action), or ghost (subtle action) */
  variant: "primary" | "secondary" | "ghost";
  /** Size of the button: sm (small), md (medium), or lg (large) */
  size: "sm" | "md" | "lg";
  /** Content to display inside the button */
  children: ReactNode;
  /** Click handler function */
  onClick?: () => void;
  /** Whether the button is disabled and cannot be clicked */
  disabled?: boolean;
  /** Whether the button shows a loading spinner */
  loading?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** HTML button type attribute */
  type?: "button" | "submit" | "reset";
}

const variantClasses: Record<ButtonProps["variant"], string> = {
  primary:
    "primary bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600",
  secondary:
    "secondary border border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900",
  ghost:
    "ghost text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900",
};

const sizeClasses: Record<ButtonProps["size"], string> = {
  sm: "sm px-3 py-1.5 text-sm",
  md: "md px-4 py-2 text-base",
  lg: "lg px-6 py-3 text-lg",
};

/**
 * Button component with multiple variants and sizes.
 *
 * Supports three visual styles (primary, secondary, ghost) and three sizes (sm, md, lg).
 * Includes loading and disabled states with proper accessibility attributes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="secondary" size="lg" loading>
 *   Loading...
 * </Button>
 * ```
 */
export default function Button({
  variant,
  size,
  children,
  onClick,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      className={[
        "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2",
        "print:hidden",
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
