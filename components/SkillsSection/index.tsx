"use client";

import React, { useState } from "react";
import type { SkillCategory, SkillLevel } from "@/types/index";

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
  const [filter, setFilter] = useState("");

  const query = filter.trim().toLowerCase();

  const filteredSkills = skills
    .map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) => !query || s.name.toLowerCase().includes(query)),
    }))
    .filter((cat) => cat.skills.length > 0);

  return (
    <section id="skills" aria-label="Skills section" className="py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Skills</h2>

      {/* Search/filter */}
      <div className="mb-8">
        <label htmlFor="skills-filter" className="sr-only">
          Filter skills
        </label>
        <input
          id="skills-filter"
          type="search"
          placeholder="Filter skills..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          aria-label="Filter skills by name"
        />
      </div>

      {filteredSkills.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400" role="status">
          No skills match your filter.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((cat) => (
            <div
              key={cat.category}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
                {cat.category}
              </h3>
              <ul className="space-y-2" aria-label={`${cat.category} skills`}>
                {cat.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-800 dark:text-gray-200">{skill.name}</span>
                    {skill.level && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${levelColors[skill.level]}`}
                        aria-label={`Level: ${skill.level}`}
                      >
                        {skill.level}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
