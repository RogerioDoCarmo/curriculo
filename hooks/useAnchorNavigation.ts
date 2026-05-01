"use client";

/**
 * useAnchorNavigation hook — manages URL hash-based navigation and section tracking.
 *
 * - Updates URL hash without page reload via window.history.pushState
 * - Tracks active section based on IntersectionObserver
 * - Handles browser back/forward navigation via popstate events
 * - SSR-safe (checks for window existence)
 */

import { useState, useEffect, useCallback } from "react";

export function useAnchorNavigation(sections: string[]): {
  currentSection: string;
  navigateTo: (sectionId: string) => void;
  isActive: (sectionId: string) => boolean;
} {
  const getInitialSection = (): string => {
    if (typeof window === "undefined") return "";
    const hash = window.location.hash;
    const section = hash.startsWith("#") ? hash.slice(1) : hash;
    return sections.includes(section) ? section : "";
  };

  const [currentSection, setCurrentSection] = useState<string>(getInitialSection);

  const navigateTo = useCallback(
    (sectionId: string) => {
      if (sectionId !== "" && !sections.includes(sectionId)) return;
      setCurrentSection(sectionId);
      if (typeof window !== "undefined") {
        // Update URL hash
        window.history.pushState(null, "", "#" + sectionId);

        // Scroll to the section
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [sections]
  );

  const isActive = useCallback(
    (sectionId: string): boolean => currentSection === sectionId,
    [currentSection]
  );

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopstate = () => {
      const hash = window.location.hash;
      const section = hash.startsWith("#") ? hash.slice(1) : hash;
      if (sections.includes(section) || section === "") {
        setCurrentSection(section);

        // Scroll to the section when navigating via browser back/forward
        if (section) {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    };

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [sections]);

  // IntersectionObserver to track visible sections
  useEffect(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (sections.includes(id)) {
            setCurrentSection(id);
          }
        }
      }
    });

    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return { currentSection, navigateTo, isActive };
}
