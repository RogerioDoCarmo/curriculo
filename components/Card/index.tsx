import React, { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

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
