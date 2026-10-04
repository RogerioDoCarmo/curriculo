/**
 * Pure helpers for the projects section (home page) and the projects page.
 *
 * Kept free of `window` and React so they are unit-testable and covered by
 * mutation testing, which is scoped to `lib/`.
 */

import type { Project } from "@/types/index";

/** How many projects the home page section shows; the rest live on the projects page. */
export const HOME_PROJECTS_COUNT = 3;

/**
 * Projects in display order: featured first, then newest first.
 *
 * Plain newest-first would put a project at the top just for being recent. The
 * featured flag is the owner's statement of what to lead with, and the date
 * orders everything else. Projects that tie on both are ordered by id, so the
 * three shown on the home page never depend on the order a directory listing
 * happened to return files in. The input is left untouched.
 */
export function sortProjectsForDisplay<T extends Pick<Project, "id" | "date" | "featured">>(
  projects: readonly T[]
): T[] {
  return projects.toSorted((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
}

/** The projects the home page shows, in display order. */
export function getHomeProjects<T extends Pick<Project, "id" | "date" | "featured">>(
  projects: readonly T[],
  count: number = HOME_PROJECTS_COUNT
): T[] {
  return sortProjectsForDisplay(projects).slice(0, count);
}

/** Every technology used by any project, unique and alphabetical (for the filter chips). */
export function getProjectTechnologies(
  projects: readonly Pick<Project, "technologies">[]
): string[] {
  return Array.from(new Set(projects.flatMap((p) => p.technologies))).sort((a, b) =>
    a.localeCompare(b)
  );
}

/** Projects that use `tech`, or every project when `tech` is empty. */
export function filterProjectsByTechnology<T extends Pick<Project, "technologies">>(
  projects: readonly T[],
  tech: string
): T[] {
  return tech === "" ? [...projects] : projects.filter((p) => p.technologies.includes(tech));
}
