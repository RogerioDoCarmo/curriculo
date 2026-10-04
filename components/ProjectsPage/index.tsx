"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/index";
import { useProjectDialog } from "@/hooks/useProjectDialog";
import { buildProjectsPageShareUrl, readTechParam, withTechParam } from "@/lib/project-deep-link";
import {
  filterProjectsByTechnology,
  getProjectTechnologies,
  sortProjectsForDisplay,
} from "@/lib/projects";
import {
  FilterButton,
  ProjectCard,
  ProjectDialog,
} from "@/components/ProjectsSection/ProjectParts";

interface ProjectsPageProps {
  readonly projects: Project[];
  readonly locale: string;
}

/**
 * Every project, in the same order as the home page (featured first, then
 * newest), with a technology filter. The chosen technology lives in the URL
 * (`?tech=Kotlin`) so a filtered view can be linked to.
 */
export default function ProjectsPage({ projects, locale }: ProjectsPageProps) {
  const t = useTranslations();
  const { selectedProject, open, close, step } = useProjectDialog(projects, null);
  const [techFilter, setTechFilter] = useState("");

  const allTechs = getProjectTechnologies(projects);

  // Read the URL after mount, not in the initial state: the server render has
  // no query string, and starting from it would mismatch on hydration. A name
  // no project uses is ignored rather than leaving an empty page.
  useEffect(() => {
    const fromUrl = readTechParam(window.location.search);
    const known = getProjectTechnologies(projects);
    setTechFilter(fromUrl !== null && known.includes(fromUrl) ? fromUrl : "");
  }, [projects]);

  const chooseTech = (tech: string) => {
    setTechFilter(tech);
    // Replace, not push: flipping filters shouldn't bury the Back button.
    const search = withTechParam(window.location.search, tech);
    window.history.replaceState(null, "", `${window.location.pathname}${search}`);
  };

  const filtered = filterProjectsByTechnology(sortProjectsForDisplay(projects), techFilter);

  return (
    <section aria-labelledby="projects-page-title" className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1
          id="projects-page-title"
          className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          {t("projects.pageHeading")}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{t("projects.pageSubtitle")}</p>

        {allTechs.length > 0 && (
          <fieldset className="mb-8 flex min-w-0 flex-wrap gap-2 border-0 p-0">
            <legend className="sr-only">{t("projects.filterByTech")}</legend>
            <FilterButton
              label={t("projects.all")}
              active={!techFilter}
              onClick={() => chooseTech("")}
            />
            {allTechs.map((tech) => (
              <FilterButton
                key={tech}
                label={tech}
                active={techFilter === tech}
                onClick={() => chooseTech(tech === techFilter ? "" : tech)}
              />
            ))}
          </fieldset>
        )}

        {filtered.length === 0 ? (
          <output className="block text-gray-500 dark:text-gray-400">
            {t("projects.noMatch")}
          </output>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => open(project)} />
            ))}
          </div>
        )}

        {/* Prev/Next step through the (filtered) projects on screen */}
        <ProjectDialog
          project={selectedProject}
          navProjects={filtered}
          locale={locale}
          shareUrl={buildProjectsPageShareUrl}
          onClose={close}
          onStep={step}
        />
      </div>
    </section>
  );
}
