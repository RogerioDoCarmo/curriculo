/**
 * Tag color utilities for technology badges.
 *
 * Every technology badge shares one uniform palette so the tech tags read as a
 * single, consistent group rather than a multi-color cloud. The palette matches
 * the former "mobile"/React Native blue: a light-blue surface with deep-blue
 * text in light mode, inverting to a deep-blue surface with light-blue text in
 * dark mode.
 */

/** Uniform color classes shared by every technology badge. */
export const TECH_TAG_CLASSES = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";

/**
 * Get the color classes for a technology tag.
 *
 * Returns the same uniform blue palette for every technology. The `tech`
 * argument is accepted for call-site compatibility (and to leave room for
 * per-technology styling in the future) but does not affect the result.
 */
export function getTechColorClasses(_tech: string): string {
  return TECH_TAG_CLASSES;
}
