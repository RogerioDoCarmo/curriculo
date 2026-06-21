/**
 * Content parsing utilities for the personal resume website.
 *
 * All functions read markdown files from the /content directory at build time
 * using Node.js file system APIs. They are NOT intended for browser use.
 */

import * as fs from "fs";
import * as path from "path";
import yaml from "js-yaml";
import type { Project, Experience, SkillCategory } from "@/types/index";

/** Default content root directory (relative to project root). */
const DEFAULT_CONTENT_DIR = path.join(process.cwd(), "content");

/** Result of splitting a markdown file into YAML frontmatter and body. */
interface ParsedFrontmatter {
  readonly data: Record<string, unknown>;
  readonly content: string;
}

/**
 * Parses YAML frontmatter delimited by `---` at the start of a markdown file,
 * returning the parsed `data` object and the remaining `content` body.
 *
 * Replaces the (unmaintained) `gray-matter` dependency with a direct js-yaml v4
 * call. Files without a leading `---` delimiter (or with an unterminated block)
 * yield `data: {}` and the original string as `content`, matching gray-matter's
 * behaviour. YAML is parsed with js-yaml's safe-by-default `load`.
 *
 * @param raw - Raw file contents.
 * @returns The parsed frontmatter `data` and the `content` after the closing delimiter.
 */
function parseFrontmatter(raw: string): ParsedFrontmatter {
  // Strip a leading UTF-8 BOM if present.
  const input = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;

  // Frontmatter must open with a `---` delimiter on its own line.
  if (!input.startsWith("---") || !/^[\r\n]/.test(input.slice(3))) {
    return { data: {}, content: input };
  }

  const afterOpen = input.slice(3);
  // Closing `---` on its own line (optionally trailing spaces/tabs).
  const close = /\n---[ \t]*(\r?\n|$)/.exec(afterOpen);
  if (!close) {
    return { data: {}, content: input };
  }

  const yamlBlock = afterOpen.slice(0, close.index);
  const content = afterOpen.slice(close.index + close[0].length);
  const parsed = yaml.load(yamlBlock);
  const data =
    typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};

  return { data, content };
}

// ─── Validation helpers ───────────────────────────────────────────────────────

/**
 * Asserts that a required field is present and non-empty.
 * Throws a descriptive error if the field is missing.
 */
function requireField(
  value: unknown,
  fieldName: string,
  filePath: string
): asserts value is NonNullable<typeof value> {
  if (value === undefined || value === null || value === "") {
    throw new Error(
      `Content validation error in "${filePath}": required field "${fieldName}" is missing or empty.`
    );
  }
}

// ─── Projects ────────────────────────────────────────────────────────────────

/**
 * Reads all `.md` files from `<contentDir>/projects/`, parses their frontmatter,
 * validates required fields, and returns the list sorted by date (newest first).
 *
 * @param contentDir - Root content directory. Defaults to `<cwd>/content`.
 *   Accepts a custom path to support testing with temporary directories.
 * @returns Sorted array of {@link Project} objects.
 * @throws If a file has missing required fields.
 */
export async function getProjects(contentDir: string = DEFAULT_CONTENT_DIR): Promise<Project[]> {
  const projectsDir = path.join(contentDir, "projects");

  if (!fs.existsSync(projectsDir)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[content] Projects directory not found: ${projectsDir}`);
    }
    return [];
  }

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".md"));
  const projects: Project[] = [];

  for (const file of files) {
    const filePath = path.join(projectsDir, file);
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = parseFrontmatter(raw);

      // Validate required fields
      requireField(data.id, "id", filePath);
      requireField(data.title, "title", filePath);
      requireField(data.description, "description", filePath);
      requireField(data.date, "date", filePath);

      const project: Project = {
        id: String(data.id),
        title: String(data.title),
        description: String(data.description),
        longDescription: content.trim() || undefined,
        technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : [],
        images: Array.isArray(data.images) ? data.images.map(String) : [],
        liveUrl: data.liveUrl ? String(data.liveUrl) : undefined,
        repoUrl: data.repoUrl ? String(data.repoUrl) : undefined,
        featured: Boolean(data.featured),
        date: String(data.date),
      };

      projects.push(project);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("Content validation error")) {
        throw err;
      }
      // Log and skip malformed files
      if (process.env.NODE_ENV === "development") {
        console.warn(`[content] Skipping malformed file "${filePath}": ${String(err)}`);
      }
    }
  }

  // Sort by date descending (newest first)
  return projects.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// ─── Experiences ─────────────────────────────────────────────────────────────

/**
 * Reads all `.md` files from `<contentDir>/experience/<locale>/`, parses their frontmatter,
 * and optionally filters by type. Falls back to default locale if specific locale not found.
 *
 * @param type - Optional filter: `'professional'` or `'academic'`.
 * @param locale - Locale code (e.g., 'pt-BR', 'en', 'es'). Defaults to 'pt-BR'.
 * @param contentDir - Root content directory. Defaults to `<cwd>/content`.
 * @returns Array of {@link Experience} objects.
 * @throws If a file has missing required fields.
 */
export async function getExperiences(
  type?: "professional" | "academic",
  locale: string = "pt-BR",
  contentDir: string = DEFAULT_CONTENT_DIR
): Promise<Experience[]> {
  // Try locale-specific directory first, fall back to root experience directory
  const localeExperienceDir = path.join(contentDir, "experience", locale);
  const defaultExperienceDir = path.join(contentDir, "experience");

  const experienceDir = fs.existsSync(localeExperienceDir)
    ? localeExperienceDir
    : defaultExperienceDir;

  if (!fs.existsSync(experienceDir)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[content] Experience directory not found: ${experienceDir}`);
    }
    return [];
  }

  const files = fs.readdirSync(experienceDir).filter((f) => f.endsWith(".md"));
  const experiences: Experience[] = [];

  for (const file of files) {
    const filePath = path.join(experienceDir, file);
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = parseFrontmatter(raw);

      // Validate required fields
      requireField(data.id, "id", filePath);
      requireField(data.type, "type", filePath);
      requireField(data.organization, "organization", filePath);
      requireField(data.role, "role", filePath);
      requireField(data.location, "location", filePath);
      requireField(data.startDate, "startDate", filePath);

      if (data.type !== "professional" && data.type !== "academic") {
        throw new Error(
          `Content validation error in "${filePath}": field "type" must be "professional" or "academic", got "${data.type}".`
        );
      }

      // Parse achievements from markdown body (lines starting with "- ")
      const achievements = content
        .split("\n")
        .filter((line: string) => line.trim().startsWith("- "))
        .map((line: string) => line.trim().slice(2).trim())
        .filter(Boolean);

      const experience: Experience = {
        id: String(data.id),
        type: data.type as "professional" | "academic",
        organization: String(data.organization),
        role: String(data.role),
        location: String(data.location),
        startDate: String(data.startDate),
        endDate: data.endDate ? String(data.endDate) : undefined,
        description: content.trim(),
        achievements,
        technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : undefined,
        logo: data.logo ? String(data.logo) : undefined,
        images: Array.isArray(data.images) ? data.images.map(String) : undefined,
        imageCaptions: Array.isArray(data.imageCaptions)
          ? data.imageCaptions.map(String)
          : undefined,
        organizationUrl: data.organizationUrl ? String(data.organizationUrl) : undefined,
        featured: Boolean(data.featured),
      };

      experiences.push(experience);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith("Content validation error")) {
        throw err;
      }
      if (process.env.NODE_ENV === "development") {
        console.warn(`[content] Skipping malformed file "${filePath}": ${String(err)}`);
      }
    }
  }

  // Sort by startDate descending (most recent first)
  const sorted = experiences.sort((a, b) =>
    a.startDate < b.startDate ? 1 : a.startDate > b.startDate ? -1 : 0
  );

  if (type) {
    return sorted.filter((e) => e.type === type);
  }

  return sorted;
}

// ─── Skills ──────────────────────────────────────────────────────────────────

/**
 * Reads `<contentDir>/skills.md`, parses the `categories` frontmatter array,
 * and returns the skill categories.
 *
 * @param contentDir - Root content directory. Defaults to `<cwd>/content`.
 * @returns Array of {@link SkillCategory} objects.
 * @throws If the skills file is missing or malformed.
 */
export async function getSkills(
  contentDir: string = DEFAULT_CONTENT_DIR
): Promise<SkillCategory[]> {
  const skillsFile = path.join(contentDir, "skills.md");

  if (!fs.existsSync(skillsFile)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[content] Skills file not found: ${skillsFile}`);
    }
    return [];
  }

  const raw = fs.readFileSync(skillsFile, "utf-8");
  const { data } = parseFrontmatter(raw);

  if (!Array.isArray(data.categories)) {
    throw new Error(`Content validation error in "${skillsFile}": "categories" must be an array.`);
  }

  return data.categories as SkillCategory[];
}
