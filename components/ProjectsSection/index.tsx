"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/types/index";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import MarkdownText from "@/components/MarkdownText";
import SwipeCarousel from "@/components/SwipeCarousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getTechColorClasses } from "@/lib/tag-colors";

/**
 * Locales with localized store-badge artwork under `public/images/badges/`.
 * Any other locale falls back to the English badge.
 */
const STORE_BADGE_LOCALES: readonly string[] = ["pt-BR", "en", "es"];
const FALLBACK_BADGE_LOCALE = "en";

interface ProjectsSectionProps {
  readonly projects: Project[];
  readonly locale: string;
}

export default function ProjectsSection({ projects, locale }: ProjectsSectionProps) {
  const t = useTranslations();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [techFilter, setTechFilter] = useState<string>("");
  // Below the `sm` breakpoint, swap the grid for a one-card-per-swipe carousel.
  const isMobile = useMediaQuery("(max-width: 639px)");

  // Collect all unique technologies
  const allTechs = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort((a, b) =>
    a.localeCompare(b)
  );

  const filtered = techFilter
    ? projects.filter((p) => p.technologies.includes(techFilter))
    : projects;

  // Step to the next/previous project within the open detail modal, wrapping.
  const navProject = (delta: 1 | -1) => {
    setSelectedProject((current) => {
      if (!current || filtered.length < 2) return current;
      const i = filtered.findIndex((p) => p.id === current.id);
      if (i < 0) return current;
      return filtered[(i + delta + filtered.length) % filtered.length];
    });
  };
  const canNavProjects = !!selectedProject && filtered.length > 1;

  let projectsContent: React.ReactNode;
  if (filtered.length === 0) {
    projectsContent = (
      <output className="block text-gray-500 dark:text-gray-400">{t("projects.noMatch")}</output>
    );
  } else if (isMobile) {
    projectsContent = (
      /* Mobile: one card per swipe, looping infinitely. */
      <SwipeCarousel
        ariaLabel={t("sections.projects")}
        itemClassName="w-[85%]"
        showControls
        prevLabel={t("projects.previousProject")}
        nextLabel={t("projects.nextProject")}
        items={filtered.map((project, index) => ({
          key: `${project.id}-${index}`,
          node: <ProjectCard project={project} onClick={() => setSelectedProject(project)} />,
        }))}
      />
    );
  } else {
    projectsContent = (
      /* Desktop: grid. */
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, index) => (
          <ProjectCard
            key={`${project.id}-${index}`}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>
    );
  }

  return (
    <section
      id="projects"
      tabIndex={-1}
      aria-label={t("sections.projects")}
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("sections.projects")}
        </h2>

        {/* Technology filter */}
        {allTechs.length > 0 && (
          <fieldset className="mb-8 flex min-w-0 flex-wrap gap-2 border-0 p-0">
            <legend className="sr-only">{t("projects.filterByTech")}</legend>
            <FilterButton
              label={t("projects.all")}
              active={!techFilter}
              onClick={() => setTechFilter("")}
            />
            {allTechs.map((tech) => (
              <FilterButton
                key={tech}
                label={tech}
                active={techFilter === tech}
                onClick={() => setTechFilter(tech === techFilter ? "" : tech)}
              />
            ))}
          </fieldset>
        )}

        {/* Projects grid */}
        {projectsContent}

        {/* Project detail modal — Prev/Next step through the (filtered) projects */}
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.title}
          onPrev={canNavProjects ? () => navProject(-1) : undefined}
          onNext={canNavProjects ? () => navProject(1) : undefined}
          prevLabel={t("projects.previousProject")}
          nextLabel={t("projects.nextProject")}
        >
          {selectedProject && <ProjectDetail project={selectedProject} locale={locale} />}
        </Modal>
      </div>
    </section>
  );
}

// ─── FilterButton ────────────────────────────────────────────────────────────

/**
 * A technology filter chip. Rendered in two branches so `aria-pressed` is a
 * literal "true"/"false" string — static a11y linters can't evaluate JSX
 * expressions and would flag `aria-pressed={expr}` as an invalid value.
 */
function FilterButton({
  label,
  active,
  onClick,
}: {
  readonly label: string;
  readonly active: boolean;
  readonly onClick: () => void;
}) {
  const className = [
    "rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600",
    active
      ? "bg-primary-600 text-white dark:bg-primary-600"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
  ].join(" ");
  const props = { onClick, className };

  return active ? (
    <button type="button" {...props} aria-pressed="true">
      {label}
    </button>
  ) : (
    <button type="button" {...props} aria-pressed="false">
      {label}
    </button>
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
  // Explicit `mockData` wins; otherwise fall back to the heuristic (no repo or
  // no images). Lets real projects without a public repo (e.g. INCT) opt out.
  const isMockData = project.mockData ?? (!project.repoUrl || project.images.length === 0);

  return (
    <Card
      className={[
        "group h-full cursor-pointer transition-all duration-200",
        project.featured ? "ring-2 ring-primary-200 dark:ring-primary-800" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`${t("projects.viewDetails")} ${project.title}`}
        className="block w-full text-left"
      >
        {/* Project image — contained (aligned with the card content, not full
            bleed) and centered, with breathing room around it. */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 mb-4">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={`${project.title} ${t("projects.screenshot")} 1`}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              loading="lazy"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
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

        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {project.featured && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {t("projects.featured")}
              </span>
            )}
            {isMockData && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-sm font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
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
              className={`rounded px-2 py-0.5 text-sm font-medium ${getTechColorClasses(tech)}`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-300">
              +{project.technologies.length - 4} {t("projects.more")}
            </span>
          )}
        </div>
      </button>
    </Card>
  );
}

// ─── ProjectDetail (modal content) ───────────────────────────────────────────

interface ProjectDetailProps {
  readonly project: Project;
  readonly locale: string;
}

function ProjectDetail({ project, locale }: ProjectDetailProps) {
  const t = useTranslations();
  const badgeLocale = STORE_BADGE_LOCALES.includes(locale) ? locale : FALLBACK_BADGE_LOCALE;

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
                className="object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-md bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
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
        <MarkdownText text={project.longDescription || project.description} />
      </div>

      {/* Technologies */}
      <div className="mt-2">
        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t("projects.technologies")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={`${project.id}-tech-${index}`}
              className={`rounded-full px-3 py-1 text-sm font-medium ${getTechColorClasses(tech)}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Store badges */}
      {(project.appStoreUrl || project.fdroidUrl) && (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.appStoreUrl && (
            <a
              href={project.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <Image
                src={`/images/badges/app-store-${badgeLocale}.svg`}
                alt={`${t("projects.appStore")} — ${project.title}`}
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </a>
          )}
          {project.fdroidUrl && (
            <a
              href={project.fdroidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <Image
                src={`/images/badges/f-droid-${badgeLocale}.svg`}
                alt={`${t("projects.fdroid")} — ${project.title}`}
                width={646}
                height={250}
                className="h-12 w-auto"
              />
            </a>
          )}
        </div>
      )}

      {/* Links */}
      {(project.liveUrl || project.repoUrl) && (
        <div className="flex gap-3 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
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
