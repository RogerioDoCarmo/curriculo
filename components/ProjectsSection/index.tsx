"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/index";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import { getTechColorClasses } from "@/lib/tag-colors";

interface ProjectsSectionProps {
  readonly projects: Project[];
  readonly locale: string;
}

export default function ProjectsSection({ projects, locale: _locale }: ProjectsSectionProps) {
  const t = useTranslations();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [techFilter, setTechFilter] = useState<string>("");

  // Collect all unique technologies
  const allTechs = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort();

  const filtered = techFilter
    ? projects.filter((p) => p.technologies.includes(techFilter))
    : projects;

  return (
    <section
      id="projects"
      aria-label={t("sections.projects")}
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("sections.projects")}
        </h2>

        {/* Technology filter */}
        {allTechs.length > 0 && (
          <div
            className="mb-8 flex flex-wrap gap-2"
            role="group"
            aria-label={t("projects.filterByTech")}
          >
            <button
              type="button"
              onClick={() => setTechFilter("")}
              className={[
                "rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
                !techFilter
                  ? "bg-primary-600 text-white dark:bg-primary-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
              ].join(" ")}
              aria-pressed={!techFilter}
            >
              {t("projects.all")}
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => setTechFilter(tech === techFilter ? "" : tech)}
                className={[
                  "rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
                  techFilter === tech
                    ? "bg-primary-600 text-white dark:bg-primary-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
                ].join(" ")}
                aria-pressed={techFilter === tech}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {/* Projects grid */}
        {filtered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400" role="status">
            {t("projects.noMatch")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard
                key={`${project.id}-${index}`}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}

        {/* Project detail modal */}
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.title}
        >
          {selectedProject && <ProjectDetail project={selectedProject} />}
        </Modal>
      </div>
    </section>
  );
}

// ─── ProjectCard ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  readonly project: Project;
  readonly onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const t = useTranslations();
  const firstImage = project.images[0];

  // Determine if this is mock data (projects without real images or repos)
  const isMockData = !project.repoUrl || project.images.length === 0;

  return (
    <Card
      className={[
        "group cursor-pointer transition-all duration-200",
        project.featured ? "ring-2 ring-primary-200 dark:ring-primary-800" : "",
      ].join(" ")}
    >
      <article
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${t("projects.viewDetails")} ${project.title}`}
      >
        {/* Project image */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 -mx-6 -mt-6 mb-4">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={`${project.title} ${t("projects.screenshot")} 1`}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              loading="lazy"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {project.title}
          </h3>
          <div className="flex shrink-0 gap-1">
            {project.featured && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {t("projects.featured")}
              </span>
            )}
            {isMockData && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                {t("projects.mockData")}
              </span>
            )}
          </div>
        </div>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={`${project.id}-tech-${index}`}
              className={`rounded px-2 py-0.5 text-xs font-medium ${getTechColorClasses(tech)}`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-500">
              +{project.technologies.length - 4} {t("projects.more")}
            </span>
          )}
        </div>
      </article>
    </Card>
  );
}

// ─── ProjectDetail (modal content) ───────────────────────────────────────────

interface ProjectDetailProps {
  readonly project: Project;
}

function ProjectDetail({ project }: ProjectDetailProps) {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      {/* Images */}
      {project.images.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {project.images.map((src, index) => (
            <div
              key={src}
              className="relative h-40 w-64 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700"
            >
              <Image
                src={src}
                alt={`${project.title} ${t("projects.screenshot")} ${index + 1}`}
                fill
                sizes="256px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-md bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("projects.noImages")}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {project.longDescription || project.description}
        </p>
      </div>

      {/* Technologies */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t("projects.technologies")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={`${project.id}-tech-${index}`}
              className={`rounded-full px-3 py-1 text-xs font-medium ${getTechColorClasses(tech)}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      {(project.liveUrl || project.repoUrl) && (
        <div className="flex gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600"
              aria-label={`${t("projects.liveDemo")} ${project.title}`}
            >
              {t("projects.liveDemo")}
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={`${t("projects.repository")} ${project.title}`}
            >
              {t("projects.repository")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
