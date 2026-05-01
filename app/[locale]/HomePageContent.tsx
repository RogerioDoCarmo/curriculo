"use client";

import { useState } from "react";
import { LazyExitIntentModal } from "@/lib/lazy-components";
import Hero from "@/components/Hero";
import CareerPathSelector from "@/components/CareerPathSelector";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactForm from "@/components/ContactForm";
import BackToTopButton from "@/components/BackToTopButton";
import type { Experience, Project, Skill, CareerPath } from "@/types/index";

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
  readonly skills: Skill[];
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

      {/* Career Path Selector (Professional/Academic) */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl flex justify-center">
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
