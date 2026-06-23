"use client";

/**
 * Shared helpers and presentational pieces for the experience cards.
 *
 * Extracted so both {@link ExperienceSection} (the career-path-filtered list) and
 * the standalone FeaturedExperience section can reuse the same date formatting
 * and organization-logo rendering without duplication.
 */

import Image from "next/image";
import { trackExternalLinkClick } from "@/lib/analytics";

/**
 * Format a date string (YYYY-MM-DD or YYYY-MM) to a human-readable month/year.
 * Uses the provided locale for proper date formatting.
 */
export function formatDate(dateStr: string, locale: string): string {
  try {
    const date = new Date(dateStr + (dateStr.length === 7 ? "-01" : ""));
    return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate duration between two dates in years/months.
 * Uses translations for proper localization of duration text.
 *
 * @param now - Unix timestamp (ms) to use as "today" for open-ended positions.
 *   Pass a server-captured value so SSR and client hydration produce the same string.
 */
export function calcDuration(
  startDate: string,
  endDate: string | undefined,
  t: (key: string) => string,
  now?: number
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(now ?? Date.now());
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

  if (months < 1) return t("duration.lessThanMonth");

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years > 0) {
    const yearLabel = years === 1 ? t("duration.year") : t("duration.years");
    parts.push(`${years} ${yearLabel}`);
  }

  if (remainingMonths > 0) {
    const monthLabel = remainingMonths === 1 ? t("duration.month") : t("duration.months");
    parts.push(`${remainingMonths} ${monthLabel}`);
  }

  return parts.join(" ");
}

/**
 * Renders an organization logo on a white tile. When `organizationUrl` is set,
 * the logo links out to the official site in a new tab and the click is tracked.
 * White tile keeps logos legible in both light and dark mode (matches AiStackSection).
 */
export function ExperienceLogo({
  logo,
  organization,
  organizationUrl,
  visitLabel,
}: {
  readonly logo: string;
  readonly organization: string;
  readonly organizationUrl?: string;
  readonly visitLabel: string;
}) {
  const image = (
    <Image
      src={logo}
      alt={`${organization} logo`}
      width={600}
      height={468}
      className="h-10 w-auto object-contain"
    />
  );

  const tile = (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-sm">
      {image}
    </span>
  );

  if (!organizationUrl) {
    return tile;
  }

  return (
    <a
      href={organizationUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackExternalLinkClick({ url: organizationUrl, context: `experience_${organization}` })
      }
      aria-label={`${organization} — ${visitLabel}`}
      className="shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
    >
      {tile}
    </a>
  );
}
