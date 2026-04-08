/**
 * JSON Resume format generator.
 *
 * Generates a JSON object following the JSON Resume schema (https://jsonresume.org/schema/)
 * by reading content from the content management system.
 *
 * Requirements: 20.6
 */

import { getProjects, getExperiences, getSkills } from "@/lib/content";
import type { Experience, SkillCategory } from "@/types/index";

// ─── JSON Resume Schema Types ─────────────────────────────────────────────────

export interface JsonResumeBasics {
  name: string;
  label: string;
  image?: string;
  email: string;
  phone?: string;
  url: string;
  summary: string;
  location: {
    address?: string;
    postalCode?: string;
    city: string;
    countryCode: string;
    region?: string;
  };
  profiles: Array<{
    network: string;
    username: string;
    url: string;
  }>;
}

export interface JsonResumeWork {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
}

export interface JsonResumeEducation {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface JsonResumeSkill {
  name: string;
  level?: string;
  keywords: string[];
}

export interface JsonResumeLanguage {
  language: string;
  fluency: string;
}

export interface JsonResume {
  $schema: string;
  basics: JsonResumeBasics;
  work: JsonResumeWork[];
  education: JsonResumeEducation[];
  skills: JsonResumeSkill[];
  languages: JsonResumeLanguage[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Maps an Experience of type 'professional' to a JSON Resume work entry.
 */
function experienceToWork(exp: Experience): JsonResumeWork {
  return {
    name: exp.organization,
    position: exp.role,
    startDate: exp.startDate,
    endDate: exp.endDate,
    summary: exp.description,
    highlights: exp.achievements,
  };
}

/**
 * Maps an Experience of type 'academic' to a JSON Resume education entry.
 */
function experienceToEducation(exp: Experience): JsonResumeEducation {
  return {
    institution: exp.organization,
    area: exp.role,
    studyType: "Graduate",
    startDate: exp.startDate,
    endDate: exp.endDate,
  };
}

/**
 * Maps a SkillCategory to a JSON Resume skill entry.
 */
function skillCategoryToJsonResumeSkill(category: SkillCategory): JsonResumeSkill {
  return {
    name: category.category,
    keywords: category.skills.map((s) => s.name),
  };
}

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generates a JSON Resume object from the site's content files.
 *
 * Personal info (name, email, etc.) uses placeholder values — replace with
 * real data once the content is populated.
 *
 * @param contentDir - Optional custom content directory (for testing).
 * @returns A JSON Resume schema-compliant object.
 */
export async function generateJsonResume(contentDir?: string): Promise<JsonResume> {
  const [projects, professionalExperiences, academicExperiences, skillCategories] =
    await Promise.all([
      getProjects(contentDir),
      getExperiences("professional", contentDir),
      getExperiences("academic", contentDir),
      getSkills(contentDir),
    ]);

  // Suppress unused variable warning — projects are available for future use
  void projects;

  const basics: JsonResumeBasics = {
    name: "Your Name",
    label: "Mobile React Native Developer",
    email: "email@example.com",
    phone: "+55 (11) 99999-9999",
    url: "https://example.com",
    summary:
      "Experienced Mobile React Native Developer with expertise in building cross-platform mobile applications for enterprise clients.",
    location: {
      city: "São Paulo",
      countryCode: "BR",
      region: "SP",
    },
    profiles: [
      {
        network: "LinkedIn",
        username: "username",
        url: "https://linkedin.com/in/username",
      },
      {
        network: "GitHub",
        username: "username",
        url: "https://github.com/username",
      },
    ],
  };

  const work: JsonResumeWork[] = professionalExperiences.map(experienceToWork);
  const education: JsonResumeEducation[] = academicExperiences.map(experienceToEducation);
  const skills: JsonResumeSkill[] = skillCategories.map(skillCategoryToJsonResumeSkill);

  const languages: JsonResumeLanguage[] = [
    { language: "Portuguese", fluency: "Native speaker" },
    { language: "English", fluency: "Professional working proficiency" },
    { language: "Spanish", fluency: "Elementary proficiency" },
  ];

  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics,
    work,
    education,
    skills,
    languages,
  };
}
