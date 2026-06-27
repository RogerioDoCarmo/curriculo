"use client";

/**
 * FeaturedExperience
 *
 * Renders the experiences flagged with `featured: true` as dedicated, highlighted
 * cards shown above the career-path selector — independent of the
 * professional/academic toggle. Each card keeps a short, always-visible intro
 * (paragraph + technology tags) and a collapsible "achievements" (Conquistas)
 * section that can be shown or hidden.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Experience } from "@/types/index";
import MarkdownText from "@/components/MarkdownText";
import Modal from "@/components/Modal";
import { getTechColorClasses } from "@/lib/tag-colors";
import { trackExternalLinkClick } from "@/lib/analytics";
import {
  ExperienceLogo,
  calcDuration,
  formatDate,
  experienceIntro,
} from "@/components/ExperienceSection/shared";

interface FeaturedExperienceProps {
  readonly experiences: Experience[];
  readonly locale: string;
  /** Unix timestamp (ms) from the server — keeps duration strings stable across SSR/hydration. */
  readonly now?: number;
}

function FeaturedCard({
  exp,
  locale,
  now,
  t,
}: {
  readonly exp: Experience;
  readonly locale: string;
  readonly now?: number;
  readonly t: (key: string) => string;
}) {
  // The achievements (Conquistas) section starts open and can be hidden.
  const [showAchievements, setShowAchievements] = useState(true);
  // Index of the image shown in the fullscreen lightbox, or null when closed.
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Horizontal-swipe start position for navigating the lightbox on touch.
  const swipeStartX = useRef<number | null>(null);
  const images = exp.images ?? [];

  // Move the lightbox by one image, wrapping around both ends (infinite).
  const moveLightbox = (delta: 1 | -1) =>
    setLightboxIndex((i) => (i === null ? i : (i + delta + images.length) % images.length));
  const hasTech = (exp.technologies?.length ?? 0) > 0;
  const intro = experienceIntro(exp.description);
  const detailsId = `featured-details-${exp.id}`;

  // Render the toggle in two branches so aria-expanded is a literal "true"/"false"
  // string that static a11y linters can validate (matches ExperienceSection).
  const toggleProps = {
    type: "button" as const,
    "aria-controls": detailsId,
    onClick: () => setShowAchievements((open) => !open),
    className:
      "shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200",
    "aria-label": showAchievements ? t("collapseDetails") : t("expandDetails"),
  };
  const toggleIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 transition-transform duration-200 ${showAchievements ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
  const hasAchievements = exp.achievements.length > 0;
  const toggleButton = hasAchievements ? (
    showAchievements ? (
      <button {...toggleProps} aria-expanded="true">
        {toggleIcon}
      </button>
    ) : (
      <button {...toggleProps} aria-expanded="false">
        {toggleIcon}
      </button>
    )
  ) : null;

  return (
    <>
      <article className="rounded-lg border-2 border-primary-500 bg-primary-50/50 p-6 shadow-sm dark:border-primary-400 dark:bg-primary-900/20">
        <div className="mb-3 flex items-center gap-1.5 text-primary-700 dark:text-primary-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0 -translate-y-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 10.8c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span className="text-sm font-semibold uppercase leading-none tracking-wide">
            {t("featured")}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 items-start gap-4">
            {exp.logo && (
              <ExperienceLogo
                logo={exp.logo}
                organization={exp.organization}
                organizationUrl={exp.organizationUrl}
                visitLabel={t("visitWebsite")}
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {exp.organizationUrl ? (
                  <a
                    href={exp.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackExternalLinkClick({
                        url: exp.organizationUrl ?? "",
                        context: `experience_role_${exp.organization}`,
                      })
                    }
                    title={t("visitWebsite")}
                    className="rounded-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    {exp.role}
                  </a>
                ) : (
                  exp.role
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {exp.organization} · {exp.location}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(exp.startDate, locale)} –{" "}
                {exp.endDate ? formatDate(exp.endDate, locale) : t("present")}{" "}
                {t("duration.separator")} {calcDuration(exp.startDate, exp.endDate, t, now)}
              </p>
            </div>
          </div>
          {toggleButton}
        </div>

        {intro && (
          <div className="mt-3">
            <MarkdownText text={intro} />
          </div>
        )}

        {/* Collapsible achievements (Conquistas) section. */}
        {hasAchievements && showAchievements && (
          <div id={detailsId} className="mt-8">
            <h4 className="mt-4 mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              {t("achievements")}
            </h4>
            <div className="space-y-1">
              {exp.achievements.map((achievement, i) => (
                <MarkdownText key={i} text={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Technologies (left) and image thumbnails (bottom-right corner, aligned
            with the last tags line). Click a thumbnail to open the lightbox. */}
        {(hasTech || images.length > 0) && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {hasTech ? (
              <div className="min-w-0 flex-1">
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {t("technologies")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getTechColorClasses(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:shrink-0">
                {images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={
                      img.title ? `${t("viewImage")}: ${img.title}` : `${t("viewImage")} ${i + 1}`
                    }
                    className="relative h-20 w-28 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-primary-300 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:ring-primary-700"
                  >
                    <Image src={img.src} alt="" fill sizes="112px" className="object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </article>

      {images.length > 0 && (
        <Modal
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          title={t("images")}
        >
          {lightboxIndex !== null && (
            <div className="space-y-3">
              {/* Prev/Next sit in side gutters; the image takes the middle and is
                  sized to its real aspect (capped) so landscape shots don't leave
                  a big gap. Swipe also moves through the gallery (wraps). */}
              <div className="flex items-center gap-1 sm:gap-2">
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => moveLightbox(-1)}
                    aria-label={t("previousImage")}
                    className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-white text-gray-900 shadow-md ring-1 ring-black/10 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-600 dark:text-white dark:ring-white/25 dark:hover:bg-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                <div
                  className="min-w-0 flex-1 touch-pan-y select-none"
                  onTouchStart={(e) => {
                    swipeStartX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    if (swipeStartX.current === null || images.length < 2) return;
                    const dx = e.changedTouches[0].clientX - swipeStartX.current;
                    swipeStartX.current = null;
                    if (dx <= -40) moveLightbox(1);
                    else if (dx >= 40) moveLightbox(-1);
                  }}
                >
                  <Image
                    src={images[lightboxIndex].src}
                    alt={images[lightboxIndex].title || `${exp.role} — ${lightboxIndex + 1}`}
                    width={images[lightboxIndex].width ?? 1200}
                    height={images[lightboxIndex].height ?? 800}
                    sizes="100vw"
                    className="mx-auto block h-auto max-h-[70vh] w-auto max-w-full object-contain"
                  />
                </div>

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => moveLightbox(1)}
                    aria-label={t("nextImage")}
                    className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-white text-gray-900 shadow-md ring-1 ring-black/10 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:bg-gray-600 dark:text-white dark:ring-white/25 dark:hover:bg-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {(images[lightboxIndex].title || images[lightboxIndex].description) && (
                <div className="mx-auto max-w-2xl text-center">
                  {images[lightboxIndex].title && (
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {images[lightboxIndex].title}
                    </h3>
                  )}
                  {images[lightboxIndex].description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {images[lightboxIndex].description}
                    </p>
                  )}
                </div>
              )}
              {images.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {images.map((img, i) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={
                        img.title ? `${t("viewImage")}: ${img.title}` : `${t("viewImage")} ${i + 1}`
                      }
                      className={`relative h-12 w-16 overflow-hidden rounded-md ring-2 transition ${
                        i === lightboxIndex
                          ? "ring-primary-600"
                          : "ring-transparent hover:ring-primary-300"
                      }`}
                    >
                      <Image src={img.src} alt="" fill sizes="64px" className="object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

export default function FeaturedExperience({ experiences, locale, now }: FeaturedExperienceProps) {
  const t = useTranslations("experience");
  const featured = experiences.filter((e) => e.featured);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section aria-label={t("featured")} className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {featured.map((exp) => (
          <FeaturedCard key={exp.id} exp={exp} locale={locale} now={now} t={t} />
        ))}
      </div>
    </section>
  );
}
