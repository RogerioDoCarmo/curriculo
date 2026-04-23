import React, { ReactNode } from "react";

/**
 * Card component props
 */
interface CardProps {
  /** Optional title displayed at the top of the card */
  readonly title?: string;
  /** Content to display inside the card */
  readonly children: ReactNode;
  /** Additional CSS classes to apply */
  readonly className?: string;
}

/**
 * Card component provides a container with consistent styling.
 *
 * Features hover effects, optional title, and supports both light and dark themes.
 * Useful for displaying projects, experience items, or any grouped content.
 *
 * @example
 * ```tsx
 * <Card title="Project Title">
 *   <p>Project description goes here</p>
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * <Card>
 *   <p>Card without a title</p>
 * </Card>
 * ```
 */
export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={[
        "rounded-lg bg-white p-6 shadow-md transition-shadow duration-200",
        "hover:shadow-lg",
        "dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70",
        "border border-transparent hover:border-primary-100 dark:hover:border-primary-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      )}
      {children}
    </div>
  );
}
