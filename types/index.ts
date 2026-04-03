/**
 * Core data model type definitions for the personal resume website.
 * These types are used throughout the application for content management,
 * component props, and API responses.
 */

// ─── Project ────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  images: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  date: string; // ISO 8601 date string (e.g., "2024-01-15")
}

// ─── Experience ─────────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  type: "professional" | "academic";
  organization: string;
  role: string;
  location: string;
  startDate: string; // ISO 8601 date string
  endDate?: string; // undefined means current position
  description: string;
  achievements: string[];
  technologies?: string[];
}

// ─── Skills ─────────────────────────────────────────────────────────────────

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
  name: string;
  level?: SkillLevel;
  yearsOfExperience?: number;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

// ─── Contact Form ────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// ─── Tech Stack ──────────────────────────────────────────────────────────────

export type TechStackCategory =
  | "framework"
  | "styling"
  | "content"
  | "internationalization"
  | "testing"
  | "analytics"
  | "monitoring"
  | "deployment";

export interface TechStackItem {
  id: string;
  name: string;
  category: TechStackCategory;
  /** Simple, non-technical description (1-2 sentences) */
  description: string;
  /** Why this technology was chosen for this project */
  whyChosen: string;
  /** How it benefits the website */
  benefits: string[];
  /** Icon name or identifier */
  icon?: string;
  /** URL to official documentation */
  documentationUrl?: string;
  /** URL to technology logo/icon */
  logoUrl?: string;
}

// ─── Timeline ────────────────────────────────────────────────────────────────

export type TimelineItemType = "education" | "work" | "achievement" | "milestone";

export interface TimelineItem {
  id: string;
  date: string; // ISO 8601 date string or display string
  title: string;
  subtitle?: string; // Organization or institution name
  description: string;
  type: TimelineItemType;
  icon?: string; // Optional icon name
  highlighted?: boolean; // For important milestones (degrees, promotions)
}

// ─── Career Path ─────────────────────────────────────────────────────────────

export type CareerPath = "professional" | "academic";

// ─── Locale ──────────────────────────────────────────────────────────────────

export type SupportedLocale = "pt-BR" | "en" | "es";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["pt-BR", "en", "es"];
export const DEFAULT_LOCALE: SupportedLocale = "pt-BR";

// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

// ─── Navigation ──────────────────────────────────────────────────────────────

export type SectionId = "home" | "projects" | "experience" | "skills" | "contact" | "tech-stack";

export const SECTION_IDS: SectionId[] = [
  "home",
  "projects",
  "experience",
  "skills",
  "contact",
  "tech-stack",
];
