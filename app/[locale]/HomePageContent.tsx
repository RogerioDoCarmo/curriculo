"use client";

import { useState } from "react";
import { LazyExitIntentModal, LazyTechStackSection } from "@/lib/lazy-components";
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
      <Hero
        name="Rogério do Carmo"
        title={heroTitle}
        locale={locale}
        greeting={heroGreeting}
        ctaText={heroCtaText}
        contactText={heroContactText}
      />

      {/* Career Path Selector (Professional/Academic) */}
      <CareerPathSelector selected={careerPath} onSelect={setCareerPath} />

      {/* Experience Section with Timeline */}
      <ExperienceSection careerPath={careerPath} experiences={experiences} locale={locale} />

      {/* Skills Section */}
      <SkillsSection skills={skills} locale={locale} />

      {/* Projects Portfolio Section */}
      <ProjectsSection projects={projects} locale={locale} />

      {/* Tech Stack Section - Lazy loaded for code splitting */}
      <LazyTechStackSection />

      {/* Contact Form Section */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
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
