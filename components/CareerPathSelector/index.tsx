"use client";

import React, { useEffect } from "react";
import type { CareerPath } from "@/types/index";

interface CareerPathSelectorProps {
  onSelect: (path: CareerPath) => void;
  selected: CareerPath;
}

const SESSION_KEY = "careerPath";

export default function CareerPathSelector({ onSelect, selected }: CareerPathSelectorProps) {
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
      aria-label="Career path selector"
      className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        role="tab"
        aria-selected={selected === "professional"}
        aria-controls="career-panel"
        id="tab-professional"
        type="button"
        onClick={() => handleSelect("professional")}
        className={[
          "rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
          selected === "professional"
            ? "bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
        ].join(" ")}
      >
        Professional
      </button>
      <button
        role="tab"
        aria-selected={selected === "academic"}
        aria-controls="career-panel"
        id="tab-academic"
        type="button"
        onClick={() => handleSelect("academic")}
        className={[
          "rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
          selected === "academic"
            ? "bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-300"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
        ].join(" ")}
      >
        Academic
      </button>
    </div>
  );
}
