/**
 * Unit tests for tag-colors utilities.
 *
 * Covers theme resolution, the technology->class mapping, and the per-theme
 * class lookup including the fallback path.
 */

import {
  getTechTheme,
  getTechColorClasses,
  getThemeColorClasses,
  TAG_COLORS,
  type TagTheme,
} from "@/lib/tag-colors";

const THEMES: TagTheme[] = ["mobile", "web", "backend", "devops", "tools"];

describe("getTechTheme", () => {
  it.each([
    ["React Native", "mobile"],
    ["Next.js", "web"],
    ["PostgreSQL", "backend"],
    ["Docker", "devops"],
    ["Git", "tools"],
  ])("maps %s to the %s theme", (tech, theme) => {
    expect(getTechTheme(tech)).toBe(theme);
  });

  it("falls back to 'tools' for an unknown technology", () => {
    expect(getTechTheme("CompletelyUnknownTech")).toBe("tools");
  });
});

describe("getThemeColorClasses", () => {
  it.each(THEMES)("returns the configured classes for the %s theme", (theme) => {
    const classes = getThemeColorClasses(theme);
    expect(classes).toContain(TAG_COLORS[theme].bg);
    expect(classes).toContain(TAG_COLORS[theme].text);
    expect(classes).toContain(TAG_COLORS[theme].darkBg);
    expect(classes).toContain(TAG_COLORS[theme].darkText);
  });

  it("returns the tools palette for an unexpected theme value (default branch)", () => {
    // Force the default branch with an out-of-union value.
    const classes = getThemeColorClasses("unexpected" as TagTheme);
    expect(classes).toBe(getThemeColorClasses("tools"));
  });
});

describe("getTechColorClasses", () => {
  it("resolves a known technology to its theme's classes", () => {
    expect(getTechColorClasses("React Native")).toBe(getThemeColorClasses("mobile"));
    expect(getTechColorClasses("TypeScript")).toBe(getThemeColorClasses("web"));
  });

  it("uses the tools palette for an unknown technology", () => {
    expect(getTechColorClasses("NopeNotReal")).toBe(getThemeColorClasses("tools"));
  });
});
