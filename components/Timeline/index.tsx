"use client";

import { useState, type ReactNode } from "react";
import type { TimelineItem, TimelineItemType } from "@/types/index";
import MarkdownText from "@/components/MarkdownText";

/**
 * A button that expands/collapses a region. Rendered in two branches so
 * aria-expanded is a literal "true"/"false" (static a11y linters reject
 * aria-expanded={expr}). Defined at module scope so the JSX isn't a floating
 * const inside the <ol>, which confuses list-structure linters.
 */
function ToggleButton({
  expanded,
  controlsId,
  onClick,
  className,
  ariaLabel,
  children,
}: {
  readonly expanded: boolean;
  readonly controlsId: string;
  readonly onClick: () => void;
  readonly className: string;
  readonly ariaLabel?: string;
  readonly children: ReactNode;
}) {
  const props = {
    type: "button" as const,
    "aria-controls": controlsId,
    onClick,
    className,
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
  };
  return expanded ? (
    <button {...props} aria-expanded="true">
      {children}
    </button>
  ) : (
    <button {...props} aria-expanded="false">
      {children}
    </button>
  );
}

interface TimelineProps {
  readonly items: TimelineItem[];
  /** Accessible label for the expand button (e.g. "Expand details") */
  readonly expandLabel?: string;
  /** Accessible label for the collapse button (e.g. "Collapse details") */
  readonly collapseLabel?: string;
}

const typeColors: Record<TimelineItemType, string> = {
  education: "bg-blue-400 dark:bg-blue-500",
  work: "bg-blue-400 dark:bg-blue-500",
  achievement: "bg-blue-400 dark:bg-blue-500",
  milestone: "bg-blue-400 dark:bg-blue-500",
};

const typeLabels: Record<TimelineItemType, string> = {
  education: "Education",
  work: "Work",
  achievement: "Achievement",
  milestone: "Milestone",
};

/**
 * Splits a markdown description into a summary (before the first ### heading)
 * and a details section (from the first ### heading onwards).
 */
function splitDescription(description: string): { summary: string; details: string } {
  const lines = description.split("\n");
  const firstH3 = lines.findIndex((l) => l.trim().startsWith("### "));

  if (firstH3 < 0) {
    return { summary: description, details: "" };
  }

  return {
    summary: lines.slice(0, firstH3).join("\n").trim(),
    details: lines.slice(firstH3).join("\n").trim(),
  };
}

export default function Timeline({
  items,
  expandLabel = "Expand details",
  collapseLabel = "Collapse details",
}: TimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

      {items.map((item) => {
        const { summary, details } = splitDescription(item.description);
        const hasDetails = details.length > 0;
        const isExpanded = expandedId === item.id;
        const detailsId = `timeline-details-${item.id}`;
        const toggle = () => setExpandedId(isExpanded ? null : item.id);
        const markerClass = [
          "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900",
          typeColors[item.type],
          item.highlighted ? "ring-primary-300 dark:ring-primary-700" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <li key={item.id} className="relative pl-12">
            {/* Circular marker — also toggles the card when it has details */}
            {hasDetails ? (
              <ToggleButton
                expanded={isExpanded}
                controlsId={detailsId}
                onClick={toggle}
                ariaLabel={isExpanded ? collapseLabel : expandLabel}
                className={`${markerClass} cursor-pointer focus:outline-none focus-visible:ring-primary-600`}
              >
                <span className="sr-only">{typeLabels[item.type]}</span>
              </ToggleButton>
            ) : (
              <span aria-label={typeLabels[item.type]} className={markerClass}>
                <span className="sr-only">{typeLabels[item.type]}</span>
              </span>
            )}

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
              {/* Header row: title + optional chevron */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {hasDetails ? (
                      <ToggleButton
                        expanded={isExpanded}
                        controlsId={detailsId}
                        onClick={toggle}
                        className="rounded-md text-left transition-colors hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:hover:text-primary-300"
                      >
                        {item.title}
                      </ToggleButton>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.subtitle && (
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {hasDetails && (
                  <ToggleButton
                    expanded={isExpanded}
                    controlsId={detailsId}
                    onClick={toggle}
                    ariaLabel={isExpanded ? collapseLabel : expandLabel}
                    className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </ToggleButton>
                )}
              </div>

              {/* Always-visible summary (intro paragraph before ### heading) */}
              {summary && (
                <div className="mt-2">
                  <MarkdownText text={summary} />
                </div>
              )}

              {/* Collapsible details (### Conquistas and below) */}
              {hasDetails && isExpanded && (
                <div id={`timeline-details-${item.id}`} className="mt-2">
                  <MarkdownText text={details} />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
