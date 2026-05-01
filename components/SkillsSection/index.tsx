"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import type { SkillCategory, SkillLevel } from "@/types/index";
import Card from "@/components/Card";
import HighlightedText from "@/components/HighlightedText";

interface SkillsSectionProps {
  readonly skills: SkillCategory[];
  readonly locale: string;
}

const levelColors: Record<SkillLevel, string> = {
  beginner: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  advanced: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  expert: "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300",
};

export default function SkillsSection({ skills, locale: _locale }: SkillsSectionProps) {
  const t = useTranslations();
  const [filter, setFilter] = useState("");

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
            {filteredSkills.map((cat) => (
              <Card key={cat.category} title={cat.category}>
                <ul className="space-y-2" aria-label={`${cat.category} ${t("skills.skillsLabel")}`}>
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
