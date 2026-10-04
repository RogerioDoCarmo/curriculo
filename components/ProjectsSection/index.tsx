"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/index";
import SwipeCarousel from "@/components/SwipeCarousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useProjectDialog } from "@/hooks/useProjectDialog";
import {
  PROJECTS_SECTION_ID,
  buildProjectShareUrl,
  getProjectsPagePath,
} from "@/lib/project-deep-link";
import { getHomeProjects } from "@/lib/projects";
import { ProjectCard, ProjectDialog } from "./ProjectParts";

interface ProjectsSectionProps {
  /** Every project: only the first few are shown, but a deep link can open any of them. */
  readonly projects: Project[];
  readonly locale: string;
}

/**
 * The home page's projects section: the first three projects (featured first,
 * then newest) as cards (a swipe carousel on phones), a detail dialog, and a
 * link to the projects page that holds all of them and lets visitors filter by
 * technology.
 */
export default function ProjectsSection({ projects, locale }: ProjectsSectionProps) {
  const t = useTranslations();
  const { selectedProject, open, close, step } = useProjectDialog(projects, PROJECTS_SECTION_ID);
  // Below the `sm` breakpoint, swap the grid for a one-card-per-swipe carousel.
  const isMobile = useMediaQuery("(max-width: 639px)");

  const shown = getHomeProjects(projects);

  const projectsContent = isMobile ? (
    /* Mobile: one card per swipe, looping infinitely. */
    <SwipeCarousel
      ariaLabel={t("sections.projects")}
      itemClassName="w-[85%]"
      showControls
      prevLabel={t("projects.previousProject")}
      nextLabel={t("projects.nextProject")}
      items={shown.map((project, index) => ({
        key: `${project.id}-${index}`,
        node: <ProjectCard project={project} onClick={() => open(project)} />,
      }))}
    />
  ) : (
    /* Desktop: grid. */
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((project, index) => (
        <ProjectCard
          key={`${project.id}-${index}`}
          project={project}
          onClick={() => open(project)}
        />
      ))}
    </div>
  );

  return (
    <section
      id={PROJECTS_SECTION_ID}
      tabIndex={-1}
      aria-label={t("sections.projects")}
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("sections.projects")}
        </h2>

        {projectsContent}

        <div className="mt-8 flex justify-center">
          <Link
            href={getProjectsPagePath(locale)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("projects.viewAll")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Prev/Next step through the projects on screen */}
        <ProjectDialog
          project={selectedProject}
          navProjects={shown}
          locale={locale}
          shareUrl={buildProjectShareUrl}
          onClose={close}
          onStep={step}
        />
      </div>
    </section>
  );
}
