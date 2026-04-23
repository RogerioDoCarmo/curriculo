"use client";

import React, { useState } from "react";
import type { CareerPath, Experience, TimelineItem } from "@/types/index";
import Timeline from "@/components/Timeline";

interface ExperienceSectionProps {
  readonly careerPath: CareerPath;
  readonly experiences: Experience[];
  readonly locale: string;
}

/** Format a date string (YYYY-MM-DD or YYYY-MM) to a human-readable month/year. */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + (dateStr.length === 7 ? "-01" : ""));
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/** Calculate duration between two dates in years/months. */
function calcDuration(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 1) return "< 1 month";
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (remainingMonths > 0) parts.push(`${remainingMonths} mo`);
  return parts.join(" ");
}

/** Convert an Experience to a TimelineItem. */
function experienceToTimelineItem(exp: Experience): TimelineItem {
  const dateLabel = `${formatDate(exp.startDate)} – ${exp.endDate ? formatDate(exp.endDate) : "Present"} · ${calcDuration(exp.startDate, exp.endDate)}`;
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
  locale: _locale,
}: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = experiences.filter((e) => e.type === careerPath);

  const timelineItems = filtered.map(experienceToTimelineItem);

  return (
    <section
      id="experience"
      aria-label={`${careerPath === "professional" ? "Professional" : "Academic"} experience`}
      className="py-8"
    >
      <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {careerPath === "professional" ? "Professional Experience" : "Academic Background"}
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No experiences to display.</p>
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
                      {formatDate(exp.startDate)} –{" "}
                      {exp.endDate ? formatDate(exp.endDate) : "Present"} ·{" "}
                      {calcDuration(exp.startDate, exp.endDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`exp-details-${exp.id}`}
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
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

                <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{exp.description}</p>

                {isExpanded && (
                  <div id={`exp-details-${exp.id}`} className="mt-4 space-y-3">
                    {exp.achievements.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Achievements
                        </h4>
                        <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Timeline view */}
      {timelineItems.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Timeline</h3>
          <Timeline items={timelineItems} />
        </div>
      )}
    </section>
  );
}
