"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Project } from "@/types/index";
import Modal from "@/components/Modal";

interface ProjectsSectionProps {
  projects: Project[];
  locale: string;
}

export default function ProjectsSection({ projects, locale: _locale }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [techFilter, setTechFilter] = useState<string>("");

  // Collect all unique technologies
  const allTechs = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort();

  const filtered = techFilter
    ? projects.filter((p) => p.technologies.includes(techFilter))
    : projects;

  return (
    <section id="projects" aria-label="Projects section" className="py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>

      {/* Technology filter */}
      {allTechs.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
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
            All
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
          No projects match the selected filter.
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
    </section>
  );
}

// ─── ProjectCard ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const firstImage = project.images[0];

  return (
    <article
      className={[
        "group cursor-pointer rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-gray-800",
        project.featured
          ? "border-primary-200 dark:border-primary-800"
          : "border-gray-200 dark:border-gray-700",
      ].join(" ")}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
    >
      {/* Project image */}
      {firstImage && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-700">
          <Image
            src={firstImage}
            alt={`${project.title} screenshot 1`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {project.title}
          </h3>
          {project.featured && (
            <span className="shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              Featured
            </span>
          )}
        </div>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={`${project.id}-tech-${index}`}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-500">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── ProjectDetail (modal content) ───────────────────────────────────────────

interface ProjectDetailProps {
  project: Project;
}

function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="space-y-4">
      {/* Images */}
      {project.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {project.images.map((src, index) => (
            <div
              key={src}
              className="relative h-40 w-64 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700"
            >
              <Image
                src={src}
                alt={`${project.title} screenshot ${index + 1}`}
                fill
                sizes="256px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          ))}
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
          Technologies
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={`${project.id}-tech-${index}`}
              className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300"
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
              aria-label={`Live demo for ${project.title}`}
            >
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={`Repository for ${project.title}`}
            >
              Repository
            </a>
          )}
        </div>
      )}
    </div>
  );
}
