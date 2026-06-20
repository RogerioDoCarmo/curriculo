"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import type { SkillCategory, SkillLevel } from "@/types/index";
import HighlightedText from "@/components/HighlightedText";

interface SkillsSectionProps {
  readonly skills: SkillCategory[];
  readonly locale: string;
}

const levelColors: Record<SkillLevel, string> = {
  beginner: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  advanced: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  expert: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

export default function SkillsSection({ skills, locale: _locale }: SkillsSectionProps) {
  const t = useTranslations();
  const [filter, setFilter] = useState("");
  // Track each expanded card independently so opening one never collapses another.
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set());

  const toggleExpanded = (category: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });

  const query = filter.trim().toLowerCase();

  const filteredSkills = skills
    .map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) => !query || s.name.toLowerCase().includes(query)),
    }))
    .filter((cat) => cat.skills.length > 0);

  return (
    <section id="skills" aria-label={t("sections.skills")} className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("sections.skills")}
        </h2>

        {/* Search/filter */}
        <div className="mb-8">
          <label htmlFor="skills-filter" className="sr-only">
            {t("skills.filterLabel")}
          </label>
          <input
            id="skills-filter"
            type="search"
            placeholder={t("skills.filterPlaceholder")}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-sm rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            aria-label={t("skills.filterAriaLabel")}
          />
        </div>

        {filteredSkills.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400" role="status">
            {t("skills.noMatch")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((cat) => {
              const isExpanded = expandedIds.has(cat.category);
              const detailsId = `skills-details-${cat.category.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <div
                  key={cat.category}
                  className="rounded-lg border border-transparent bg-white p-6 shadow-md transition-shadow duration-200 hover:border-primary-100 hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:border-primary-900 dark:hover:shadow-gray-900/70"
                >
                  {/* Header row: category title + chevron */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {cat.category}
                    </h3>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      onClick={() => toggleExpanded(cat.category)}
                      className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      aria-label={
                        isExpanded ? t("skills.collapseDetails") : t("skills.expandDetails")
                      }
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

                  {/* Collapsible skills list — also visible when a filter is active */}
                  {(isExpanded || query) && (
                    <ul
                      id={detailsId}
                      className="mt-4 space-y-2"
                      aria-label={`${cat.category} ${t("skills.skillsLabel")}`}
                    >
                      {cat.skills.map((skill) => (
                        <li key={skill.name} className="flex items-center justify-between gap-2">
                          <HighlightedText
                            text={skill.name}
                            highlight={filter}
                            className="text-sm text-gray-800 dark:text-gray-200"
                          />
                          {skill.level && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${levelColors[skill.level]}`}
                              aria-label={`${t("skills.levelLabel")}: ${skill.level}`}
                            >
                              {skill.level}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
