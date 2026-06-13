"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import type { CareerPath, Experience, TimelineItem } from "@/types/index";
import Timeline from "@/components/Timeline";
import MarkdownText from "@/components/MarkdownText";
import { getTechColorClasses } from "@/lib/tag-colors";

interface ExperienceSectionProps {
  readonly careerPath: CareerPath;
  readonly experiences: Experience[];
  readonly locale: string;
  /** Unix timestamp (ms) from the server — keeps duration strings stable across SSR/hydration. */
  readonly now?: number;
}

/**
 * Format a date string (YYYY-MM-DD or YYYY-MM) to a human-readable month/year.
 * Uses the provided locale for proper date formatting.
 */
function formatDate(dateStr: string, locale: string): string {
  try {
    const date = new Date(dateStr + (dateStr.length === 7 ? "-01" : ""));
    return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate duration between two dates in years/months.
 * Uses translations for proper localization of duration text.
 *
 * @param now - Unix timestamp (ms) to use as "today" for open-ended positions.
 *   Pass a server-captured value so SSR and client hydration produce the same string.
 */
function calcDuration(
  startDate: string,
  endDate: string | undefined,
  t: (key: string) => string,
  now?: number
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(now ?? Date.now());
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  if (months < 1) return t("duration.lessThanMonth");

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years > 0) {
    const yearLabel = years === 1 ? t("duration.year") : t("duration.years");
    parts.push(`${years} ${yearLabel}`);
  }

  if (remainingMonths > 0) {
    const monthLabel = remainingMonths === 1 ? t("duration.month") : t("duration.months");
    parts.push(`${remainingMonths} ${monthLabel}`);
  }

  return parts.join(" ");
}

/** Convert an Experience to a TimelineItem. */
function experienceToTimelineItem(
  exp: Experience,
  locale: string,
  t: (key: string) => string,
  now?: number
): TimelineItem {
  const startFormatted = formatDate(exp.startDate, locale);
  const endFormatted = exp.endDate ? formatDate(exp.endDate, locale) : t("present");
  const duration = calcDuration(exp.startDate, exp.endDate, t, now);
  const separator = t("duration.separator");
  const dateLabel = `${startFormatted} – ${endFormatted} ${separator} ${duration}`;

  return {
    id: exp.id,
    date: dateLabel,
    title: exp.role,
    subtitle: `${exp.organization} · ${exp.location}`,
    description: exp.description,
    type: exp.type === "professional" ? "work" : "education",
    highlighted: !exp.endDate, // current position
  };
}

export default function ExperienceSection({
  careerPath,
  experiences,
  locale,
  now,
}: ExperienceSectionProps) {
  const t = useTranslations("experience");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = experiences.filter((e) => e.type === careerPath);

  const timelineItems = filtered.map((exp) => experienceToTimelineItem(exp, locale, t, now));

  return (
    <section
      id="experience"
      aria-label={`${careerPath === "professional" ? t("professionalExperience") : t("academicBackground")} ${t("section")}`}
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {careerPath === "professional" ? t("professionalExperience") : t("academicBackground")}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t("noExperiences")}</p>
        ) : (
          <div className="space-y-6">
            {filtered.map((exp) => {
              const isExpanded = expandedId === exp.id;
              return (
                <article
                  key={exp.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {exp.role}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.organization} · {exp.location}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                        {formatDate(exp.startDate, locale)} –{" "}
                        {exp.endDate ? formatDate(exp.endDate, locale) : t("present")}{" "}
                        {t("duration.separator")} {calcDuration(exp.startDate, exp.endDate, t, now)}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`exp-details-${exp.id}`}
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      aria-label={isExpanded ? t("collapseDetails") : t("expandDetails")}
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
                    </button>
                  </div>

                  {/* Collapsed cards preview only the first three lines; expanding reveals the full text. */}
                  <div className={`mt-3 ${isExpanded ? "" : "line-clamp-3"}`}>
                    <MarkdownText text={exp.description} />
                  </div>

                  {isExpanded && exp.achievements.length > 0 && (
                    <div id={`exp-details-${exp.id}`} className="mt-4 space-y-3">
                      <div>
                        <h3 className="mt-4 mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                          {t("details")}
                        </h3>
                        <div className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <MarkdownText key={i} text={achievement} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technologies stay visible regardless of the card's collapsed state */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mt-8">
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t("technologies")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getTechColorClasses(tech)}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Timeline view */}
        {timelineItems.length > 0 && (
          <div className="mt-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t("timeline")}
              </h3>
              <Timeline
                items={timelineItems}
                expandLabel={t("expandDetails")}
                collapseLabel={t("collapseDetails")}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
