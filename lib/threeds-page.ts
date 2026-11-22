/**
 * Rendering logic for the Old-3DS-friendly legacy page.
 *
 * Pure functions only — no file I/O. Produces one self-contained HTML
 * string with no CSS and no JavaScript, deliberately terse (section
 * heading + one line per entry) for memory-constrained hardware.
 */

import type { Experience, Project, SkillCategory } from "@/types/index";

export const SITE_URL = "https://rogeriodocarmo.com";

export interface ThreeDsPageInput {
  readonly name: string;
  readonly title: string;
  readonly subtitle: string;
  readonly heroImageSrc: string;
  readonly experiences: readonly Experience[];
  readonly projects: readonly Project[];
  readonly skills: readonly SkillCategory[];
}

/** Escapes the five HTML-significant characters. `&` must go first. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatYear(dateIso: string): string {
  return dateIso.slice(0, 4);
}

export function formatExperienceLine(exp: Experience): string {
  const endYear = exp.endDate ? formatYear(exp.endDate) : "Present";
  return `${exp.role} — ${exp.organization} (${formatYear(exp.startDate)}–${endYear})`;
}

export function formatProjectLine(project: Project): string {
  return `${project.title} — ${project.description}`;
}

export function formatSkillLine(category: SkillCategory): string {
  return `${category.category}: ${category.skills.map((skill) => skill.name).join(", ")}`;
}

function renderSection<T>(
  heading: string,
  items: readonly T[],
  formatLine: (item: T) => string
): string {
  const listItems = items.map((item) => `<li>${escapeHtml(formatLine(item))}</li>`).join("");
  return `<h2>${heading}</h2><ul>${listItems}</ul>`;
}

export function renderThreeDsHtml(input: ThreeDsPageInput): string {
  const name = escapeHtml(input.name);
  const title = escapeHtml(input.title);
  const subtitle = escapeHtml(input.subtitle);

  return (
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<title>${name}</title></head><body>` +
    `<h1>${name}</h1>` +
    `<p>${title}</p>` +
    `<p>${subtitle}</p>` +
    `<img src="${input.heroImageSrc}" width="120" height="120" alt="${name}">` +
    renderSection("Experience", input.experiences, formatExperienceLine) +
    renderSection("Projects", input.projects, formatProjectLine) +
    renderSection("Skills", input.skills, formatSkillLine) +
    `<p><a href="${SITE_URL}">Full site</a></p>` +
    `</body></html>`
  );
}
