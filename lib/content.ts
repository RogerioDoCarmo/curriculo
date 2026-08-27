/**
 * Content parsing utilities for the personal resume website.
 *
 * All functions read markdown files from the /content directory at build time
 * using Node.js file system APIs. They are NOT intended for browser use.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { load as loadYaml } from "js-yaml";
import type { Project, Experience, ExperienceImage, SkillCategory } from "@/types/index";

/** Default content root directory (relative to project root). */
const DEFAULT_CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Intrinsic pixel dimensions for experience gallery images, keyed by src. Kept
 * here (not duplicated in each locale's frontmatter) so the lightbox can size
 * to the real aspect ratio instead of letterboxing inside a fixed height.
 */
const EXPERIENCE_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/inct-project/inct-app-collect.png": { width: 566, height: 1200 },
  "/images/inct-project/inct-app-post-processing.png": { width: 1000, height: 685 },
  "/images/inct-project/inct-app-post-analyzer.png": { width: 1416, height: 848 },
};

/** Result of splitting a markdown file into YAML frontmatter and body. */
interface ParsedFrontmatter {
  readonly data: Record<string, unknown>;
  readonly content: string;
}

/**
 * Parses YAML frontmatter delimited by `---` at the start of a markdown file,
 * returning the parsed `data` object and the remaining `content` body.
 *
 * Replaces the (unmaintained) `gray-matter` dependency with a direct js-yaml
 * call. Files without a leading `---` delimiter (or with an unterminated block)
 * yield `data: {}` and the original string as `content`, matching gray-matter's
 * behaviour. YAML is parsed with js-yaml's safe-by-default `load`.
 *
 * @param raw - Raw file contents.
 * @returns The parsed frontmatter `data` and the `content` after the closing delimiter.
 */
function parseFrontmatter(raw: string): ParsedFrontmatter {
  // Strip a leading UTF-8 BOM if present.
  const input = raw.codePointAt(0) === 0xfeff ? raw.slice(1) : raw;

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
  const parsed = loadYaml(yamlBlock);
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

/**
 * Validates that a required field is present and non-empty, returning it
 * coerced to a string (frontmatter values come back as `unknown` from the
 * YAML parser — e.g. an unquoted date becomes a `Date`, not a `string`).
 */
function requireString(value: unknown, fieldName: string, filePath: string): string {
  requireField(value, fieldName, filePath);
  if (typeof value === "object" && !(value instanceof Date)) {
    throw new TypeError(
      `Content validation error in "${filePath}": field "${fieldName}" must be a scalar value, not an object or array.`
    );
  }
  return String(value);
}

/** Coerces an optional frontmatter field to a string, or `undefined` if absent or not a scalar. */
function optionalString(value: unknown): string | undefined {
  if (typeof value === "object" && !(value instanceof Date)) return undefined;
  return value ? String(value) : undefined;
}

/**
 * Returns the first candidate directory that exists, or `fallback` when none
 * do — so the caller still has a concrete path to report as missing.
 */
function firstExistingDir(candidates: readonly string[], fallback: string): string {
  return candidates.find((dir) => fs.existsSync(dir)) ?? fallback;
}

/** Descending comparator for ISO-ish "YYYY-MM-DD" date strings. */
function compareDateDesc(a: string, b: string): number {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
}

// ─── Projects ────────────────────────────────────────────────────────────────

/** Parses and validates a single project markdown file. */
function parseProjectFile(filePath: string): Project {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  return {
    id: requireString(data.id, "id", filePath),
    title: requireString(data.title, "title", filePath),
    description: requireString(data.description, "description", filePath),
    longDescription: content.trim() || undefined,
    technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : [],
    images: Array.isArray(data.images) ? data.images.map(String) : [],
    liveUrl: optionalString(data.liveUrl),
    repoUrl: optionalString(data.repoUrl),
    appStoreUrl: optionalString(data.appStoreUrl),
    fdroidUrl: optionalString(data.fdroidUrl),
    featured: Boolean(data.featured),
    mockData: data.mockData === undefined ? undefined : Boolean(data.mockData),
    date: requireString(data.date, "date", filePath),
  };
}

/**
 * Reads all `.md` files from `<contentDir>/projects/<locale>/`, parses their
 * frontmatter, validates required fields, and returns the list sorted by date
 * (newest first). Falls back to the default locale (`pt-BR`), then to the
 * legacy flat layout (`<contentDir>/projects/`).
 *
 * @param locale - Locale code (e.g., 'pt-BR', 'en', 'es'). Defaults to 'pt-BR'.
 * @param contentDir - Root content directory. Defaults to `<cwd>/content`.
 *   Accepts a custom path to support testing with temporary directories.
 * @returns Sorted array of {@link Project} objects.
 * @throws If a file has missing required fields.
 */
export async function getProjects(
  locale: string = "pt-BR",
  contentDir: string = DEFAULT_CONTENT_DIR
): Promise<Project[]> {
  // Try the locale directory first, then the default locale, then the legacy
  // flat layout that predates localized project content.
  const projectsDir = firstExistingDir(
    [path.join(contentDir, "projects", locale), path.join(contentDir, "projects", "pt-BR")],
    path.join(contentDir, "projects")
  );

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
      projects.push(parseProjectFile(filePath));
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
  return projects.toSorted((a, b) => compareDateDesc(a.date, b.date));
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
/** Parses a single experience gallery image entry (a bare src string, or an object with metadata). */
function parseExperienceImage(img: unknown): ExperienceImage {
  if (typeof img === "string") return { src: img };
  const o = img as Record<string, unknown>;
  const src = typeof o.src === "string" ? o.src : "";
  const dims = EXPERIENCE_IMAGE_DIMENSIONS[src];
  return {
    src,
    title: optionalString(o.title),
    description: optionalString(o.description),
    width: o.width ? Number(o.width) : dims?.width,
    height: o.height ? Number(o.height) : dims?.height,
  };
}

/** Parses and validates a single experience markdown file. */
function parseExperienceFile(filePath: string): Experience {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  const id = requireString(data.id, "id", filePath);
  const type = requireString(data.type, "type", filePath);
  const organization = requireString(data.organization, "organization", filePath);
  const role = requireString(data.role, "role", filePath);
  const location = requireString(data.location, "location", filePath);
  const startDate = requireString(data.startDate, "startDate", filePath);

  if (type !== "professional" && type !== "academic") {
    throw new Error(
      `Content validation error in "${filePath}": field "type" must be "professional" or "academic", got "${type}".`
    );
  }

  // Parse achievements from markdown body (lines starting with "- ")
  const achievements = content
    .split("\n")
    .filter((line: string) => line.trim().startsWith("- "))
    .map((line: string) => line.trim().slice(2).trim())
    .filter(Boolean);

  return {
    id,
    type,
    organization,
    role,
    location,
    startDate,
    endDate: optionalString(data.endDate),
    description: content.trim(),
    achievements,
    technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : undefined,
    logo: optionalString(data.logo),
    images: Array.isArray(data.images) ? data.images.map(parseExperienceImage) : undefined,
    organizationUrl: optionalString(data.organizationUrl),
    featured: Boolean(data.featured),
  };
}

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
      experiences.push(parseExperienceFile(filePath));
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
  const sorted = experiences.toSorted((a, b) => compareDateDesc(a.startDate, b.startDate));

  if (type) {
    return sorted.filter((e) => e.type === type);
  }

  return sorted;
}

// ─── Skills ──────────────────────────────────────────────────────────────────

/**
 * Reads the locale-specific skills file (`<contentDir>/skills/<locale>.md`),
 * parses the `categories` frontmatter array, and returns the skill categories.
 * Falls back to the default locale (`pt-BR`), then to the legacy single-file
 * location (`<contentDir>/skills.md`).
 *
 * @param locale - Locale code (e.g., 'pt-BR', 'en', 'es'). Defaults to 'pt-BR'.
 * @param contentDir - Root content directory. Defaults to `<cwd>/content`.
 * @returns Array of {@link SkillCategory} objects.
 * @throws If the skills file is malformed.
 */
export async function getSkills(
  locale: string = "pt-BR",
  contentDir: string = DEFAULT_CONTENT_DIR
): Promise<SkillCategory[]> {
  const localeSkillsFile = path.join(contentDir, "skills", `${locale}.md`);
  const defaultSkillsFile = path.join(contentDir, "skills", "pt-BR.md");
  const legacySkillsFile = path.join(contentDir, "skills.md");

  let skillsFile: string;
  if (fs.existsSync(localeSkillsFile)) {
    skillsFile = localeSkillsFile;
  } else if (fs.existsSync(defaultSkillsFile)) {
    skillsFile = defaultSkillsFile;
  } else {
    skillsFile = legacySkillsFile;
  }

  if (!fs.existsSync(skillsFile)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[content] Skills file not found: ${skillsFile}`);
    }
    return [];
  }

  const raw = fs.readFileSync(skillsFile, "utf-8");
  const { data } = parseFrontmatter(raw);

  if (!Array.isArray(data.categories)) {
    throw new TypeError(
      `Content validation error in "${skillsFile}": "categories" must be an array.`
    );
  }

  return data.categories as SkillCategory[];
}
