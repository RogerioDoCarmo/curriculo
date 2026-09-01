/**
 * Deep-link helpers for the project detail dialog.
 *
 * A shared project link looks like `https://site/<locale>/?project=<id>#projects`:
 * the query param names the project whose dialog should open, and the hash lands
 * the reader on the projects section. The site is a static export with no
 * middleware, so both halves are read and written client-side.
 *
 * Kept as pure string functions (no `window`) so they are testable and covered
 * by mutation testing, which is scoped to `lib/`.
 */

import type { NavSection } from "@/lib/nav-sections";

/** Query-string key naming the project whose dialog should be open. */
export const PROJECT_QUERY_PARAM = "project";

/**
 * DOM id of the projects section. Typed as `NavSection` so renaming the section
 * in `lib/nav-sections.ts` breaks the build here instead of silently producing
 * links that scroll nowhere.
 */
export const PROJECTS_SECTION_ID: NavSection = "projects";

/**
 * Reads the project id out of a location search string (`"?project=miroji"`).
 * Returns null when the param is absent or empty.
 */
export function readProjectParam(search: string): string | null {
  // `get` already yields null when the param is absent; only the present-but-
  // empty case needs normalising.
  const value = new URLSearchParams(search).get(PROJECT_QUERY_PARAM);
  return value === "" ? null : value;
}

/**
 * Returns `search` with the project param set to `projectId`, or removed when
 * `projectId` is null. Other params are preserved. Yields `""` rather than a
 * dangling `"?"` when nothing is left, so a closed dialog gives a clean URL.
 */
export function withProjectParam(search: string, projectId: string | null): string {
  const params = new URLSearchParams(search);
  if (projectId === null || projectId === "") {
    params.delete(PROJECT_QUERY_PARAM);
  } else {
    params.set(PROJECT_QUERY_PARAM, projectId);
  }
  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}

/**
 * Builds the same-page URL to write into history when a project opens or closes.
 * Keeps the current path and any unrelated params, and always ends on the
 * projects hash so back/forward still land on the section.
 */
export function buildProjectHistoryUrl(params: {
  readonly pathname: string;
  readonly search: string;
  readonly projectId: string | null;
}): string {
  const { pathname, search, projectId } = params;
  return `${pathname}${withProjectParam(search, projectId)}#${PROJECTS_SECTION_ID}`;
}

/**
 * Strips any trailing slashes off an origin.
 *
 * Walks an index backwards instead of using `/\/+$/`: that pattern backtracks
 * quadratically over a long run of slashes that *isn't* at the end of the
 * string (Sonar S8786), retrying every shorter run from every start position.
 * `charAt` yields `""` for a negative index, so an all-slashes string
 * terminates the loop without needing a separate bounds guard.
 */
function stripTrailingSlashes(value: string): string {
  let end = value.length;
  while (value.charAt(end - 1) === "/") {
    end -= 1;
  }
  return value.slice(0, end);
}

/**
 * Builds the absolute URL to hand to someone else, e.g.
 * `https://site.dev/en/?project=miroji#projects`. The trailing slash after the
 * locale matches `trailingSlash: true` in next.config.js, so recipients don't
 * eat a redirect.
 */
export function buildProjectShareUrl(params: {
  readonly origin: string;
  readonly locale: string;
  readonly projectId: string;
}): string {
  const { origin, locale, projectId } = params;
  const base = stripTrailingSlashes(origin);
  const query = `${PROJECT_QUERY_PARAM}=${encodeURIComponent(projectId)}`;
  return `${base}/${locale}/?${query}#${PROJECTS_SECTION_ID}`;
}
