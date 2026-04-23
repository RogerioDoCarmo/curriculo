import React from "react";
import type { TimelineItem, TimelineItemType } from "@/types/index";

interface TimelineProps {
  readonly items: TimelineItem[];
}

const typeColors: Record<TimelineItemType, string> = {
  education: "bg-blue-500 dark:bg-blue-400",
  work: "bg-green-500 dark:bg-green-400",
  achievement: "bg-yellow-500 dark:bg-yellow-400",
  milestone: "bg-purple-500 dark:bg-purple-400",
};

const typeLabels: Record<TimelineItemType, string> = {
  education: "Education",
  work: "Work",
  achievement: "Achievement",
  milestone: "Milestone",
};

export default function Timeline({ items }: TimelineProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400" role="status">
        No timeline items to display.
      </p>
    );
  }

  return (
    <ol aria-label="Timeline" className="relative space-y-8">
      {/* Vertical connecting line */}
      <div
        aria-hidden="true"
        className="absolute left-4 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-gray-700"
      />

      {items.map((item) => (
        <li key={item.id} className="relative pl-12">
          {/* Circular marker */}
          <span
            aria-label={typeLabels[item.type]}
            className={[
              "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900",
              typeColors[item.type],
              item.highlighted ? "ring-primary-300 dark:ring-primary-700" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="sr-only">{typeLabels[item.type]}</span>
          </span>

          {/* Date label */}
          <time
            dateTime={item.date}
            className="mb-1 block text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {item.date}
          </time>

          {/* Content card */}
          <div
            className={[
              "rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800",
              item.highlighted
                ? "border-primary-200 dark:border-primary-800"
                : "border-gray-200 dark:border-gray-700",
            ].join(" ")}
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{item.subtitle}</p>
            )}
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
