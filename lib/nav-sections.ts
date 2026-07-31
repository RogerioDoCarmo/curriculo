/**
 * Canonical list of top-level page sections that have both a DOM id and a
 * translated nav label (see `nav.*` in messages/*.json). Shared by Header's
 * nav links and the ScrollMinimap so both stay in sync with the same ids.
 */
export const NAV_SECTIONS = ["home", "projects", "experience", "skills", "contact"] as const;

export type NavSection = (typeof NAV_SECTIONS)[number];
