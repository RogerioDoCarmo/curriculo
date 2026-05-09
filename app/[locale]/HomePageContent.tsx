"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { LazyExitIntentModal } from "@/lib/lazy-components";
import Hero from "@/components/Hero";
import CareerPathSelector from "@/components/CareerPathSelector";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactForm from "@/components/ContactForm";
import BackToTopButton from "@/components/BackToTopButton";
import type { Experience, Project, SkillCategory, CareerPath } from "@/types/index";

interface HomePageContentProps {
  readonly locale: string;
  readonly heroTitle: string;
  readonly heroGreeting: string;
  readonly heroCtaText: string;
  readonly heroContactText: string;
  readonly contactTitle: string;
  readonly contactSubtitle: string;
  readonly experiences: Experience[];
  readonly projects: Project[];
  readonly skills: SkillCategory[];
}

export default function HomePageContent({
  locale,
  heroTitle,
  heroGreeting,
  heroCtaText,
  heroContactText,
  contactTitle,
  contactSubtitle,
  experiences,
  projects,
  skills,
}: HomePageContentProps) {
  const [careerPath, setCareerPath] = useState<CareerPath>("professional");
  const t = useTranslations("techStack");
  const tCareerPath = useTranslations("careerPath");
  const tHomepage = useTranslations("homepage");

  return (
    <>
      {/* Hero Section with Profile Photo */}
      <div className="bg-white dark:bg-gray-900">
        <Hero
          name="Rogério do Carmo"
          title={heroTitle}
          locale={locale}
          greeting={heroGreeting}
          ctaText={heroCtaText}
          contactText={heroContactText}
        />
      </div>

      {/* Storybook Link Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <a
            href="/storybook/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-primary-600 text-white rounded-lg
              hover:bg-primary-700 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
              font-medium
            "
            aria-label={tHomepage("storybookButton")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            {tHomepage("storybookButton")}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Career Path Selector (Professional/Academic) */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            {tCareerPath("sectionTitle")}
          </h2>
          <CareerPathSelector selected={careerPath} onSelect={setCareerPath} />
        </div>
      </div>

      {/* Experience Section with Timeline */}
      <div className="bg-white dark:bg-gray-900">
        <ExperienceSection careerPath={careerPath} experiences={experiences} locale={locale} />
      </div>

      {/* Skills Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50">
        <SkillsSection skills={skills} locale={locale} />
      </div>

      {/* Projects Portfolio Section */}
      <div className="bg-white dark:bg-gray-900">
        <ProjectsSection projects={projects} locale={locale} />
      </div>

      {/* Contact Form Section */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="contact-title" className="text-3xl font-bold text-center mb-8">
            {contactTitle}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">{contactSubtitle}</p>
          <ContactForm locale={locale} />
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Exit Intent Modal - Lazy loaded, client-side only */}
      <LazyExitIntentModal
        enabled={true}
        locale={locale}
        linkedInUrl="https://www.linkedin.com/in/rogeriodocarmo/"
        githubUrl="https://github.com/RogerioDoCarmo/curriculo"
      />
    </>
  );
}
