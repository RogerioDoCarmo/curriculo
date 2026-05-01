"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { CareerPath } from "@/types/index";

interface CareerPathSelectorProps {
  readonly onSelect: (path: CareerPath) => void;
  readonly selected: CareerPath;
}

const SESSION_KEY = "careerPath";

export default function CareerPathSelector({ onSelect, selected }: CareerPathSelectorProps) {
  const t = useTranslations("careerPath");

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY) as CareerPath | null;
      if (saved === "professional" || saved === "academic") {
        onSelect(saved);
      }
    } catch {
      // sessionStorage not available (SSR or private mode)
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(path: CareerPath) {
    try {
      sessionStorage.setItem(SESSION_KEY, path);
    } catch {
      // ignore
    }
    onSelect(path);
  }

  return (
    <div
      role="tablist"
      aria-label={t("title")}
      className="w-full max-w-2xl rounded-lg border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="grid grid-cols-2 gap-2">
        <button
          role="tab"
          aria-selected={selected === "professional"}
          aria-controls="career-panel"
          id="tab-professional"
          type="button"
          onClick={() => handleSelect("professional")}
          className={[
            "flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
            selected === "professional"
              ? "bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {t("professional")}
        </button>
        <button
          role="tab"
          aria-selected={selected === "academic"}
          aria-controls="career-panel"
          id="tab-academic"
          type="button"
          onClick={() => handleSelect("academic")}
          className={[
            "flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
            selected === "academic"
              ? "bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
          {t("academic")}
        </button>
      </div>
    </div>
  );
}
