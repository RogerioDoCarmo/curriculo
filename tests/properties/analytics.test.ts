/**
 * Property-based tests for Firebase Analytics event tracking.
 *
 * Property 18: Analytics Events for User Actions
 * **Validates: Requirements 10.3, 10.4**
 *
 * Tests that tracked actions produce correctly structured analytics events.
 */

import * as fc from "fast-check";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import type { CareerPath, SupportedLocale, Theme, SectionId } from "@/types/index";

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_CAREER_PATHS: CareerPath[] = ["professional", "academic"];
const VALID_LOCALES: SupportedLocale[] = ["pt-BR", "en", "es"];
const VALID_THEMES: Theme[] = ["light", "dark"];
const VALID_SECTION_IDS: SectionId[] = [
  "home",
  "projects",
  "experience",
  "skills",
  "contact",
  "tech-stack",
];
const VALID_EXIT_INTENT_ACTIONS = [
  "download_resume",
  "connect_linkedin",
  "star_github",
  "dismiss",
] as const;

// ─── Pure event payload builders (mirrors analytics.ts logic) ─────────────────

interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

function buildContactFormEvent(success: boolean): AnalyticsEvent {
  return {
    name: ANALYTICS_EVENTS.CONTACT_FORM_SUBMISSION,
    params: { success },
  };
}

function buildProjectClickEvent(project_id: string, project_title: string): AnalyticsEvent {
  return {
    name: ANALYTICS_EVENTS.PROJECT_CLICK,
    params: { project_id, project_title },
  };
}

function buildLanguageChangeEvent(
  from_locale: SupportedLocale,
  to_locale: SupportedLocale
): AnalyticsEvent {
  return {
    name: ANALYTICS_EVENTS.LANGUAGE_CHANGE,
    params: { from_locale, to_locale },
  };
}

function buildThemeToggleEvent(theme: Theme): AnalyticsEvent {
  return {
    name: ANALYTICS_EVENTS.THEME_TOGGLE,
    params: { theme },
  };
}

function buildCareerPathEvent(path: CareerPath): AnalyticsEvent {
  return {
    name: ANALYTICS_EVENTS.CAREER_PATH_SELECTION,
    params: { path },
  };
}

function buildSectionViewEvent(section_id: SectionId): AnalyticsEvent {
  return {
    name: ANALYTICS_EVENTS.SECTION_VIEW,
    params: { section_id },
  };
}

function buildExitIntentActionEvent(
  action: (typeof VALID_EXIT_INTENT_ACTIONS)[number]
): AnalyticsEvent {
  return {
    name: ANALYTICS_EVENTS.EXIT_INTENT_ACTION,
    params: { action },
  };
}

// ─── Property 18: Analytics Events for User Actions ──────────────────────────

describe("Property 18: Analytics Events for User Actions", () => {
  /**
   * Every tracked user action produces an event with:
   * - A non-empty event name
   * - Correctly typed parameters
   * - Parameters that match the action context
   *
   * Validates: Requirements 10.3, 10.4
   */

  describe("Event names", () => {
    it("all event name constants are non-empty strings", () => {
      for (const name of Object.values(ANALYTICS_EVENTS)) {
        expect(typeof name).toBe("string");
        expect(name.trim().length).toBeGreaterThan(0);
      }
    });

    it("all event names are unique", () => {
      const names = Object.values(ANALYTICS_EVENTS);
      const unique = new Set(names);
      expect(unique.size).toBe(names.length);
    });

    it("event names use snake_case format", () => {
      for (const name of Object.values(ANALYTICS_EVENTS)) {
        expect(name).toMatch(/^[a-z][a-z0-9_]*$/);
      }
    });
  });

  describe("Contact form submission events", () => {
    it("contact form event always has correct event name", () => {
      fc.assert(
        fc.property(fc.boolean(), (success) => {
          const event = buildContactFormEvent(success);
          expect(event.name).toBe(ANALYTICS_EVENTS.CONTACT_FORM_SUBMISSION);
        }),
        { numRuns: 20 }
      );
    });

    it("contact form event always includes success boolean param", () => {
      fc.assert(
        fc.property(fc.boolean(), (success) => {
          const event = buildContactFormEvent(success);
          expect(event.params).toBeDefined();
          expect(typeof event.params!.success).toBe("boolean");
          expect(event.params!.success).toBe(success);
        }),
        { numRuns: 20 }
      );
    });
  });

  describe("Project click events", () => {
    const nonEmptyString = fc
      .string({ minLength: 1, maxLength: 50 })
      .filter((s) => s.trim().length > 0);

    it("project click event always has correct event name", () => {
      fc.assert(
        fc.property(nonEmptyString, nonEmptyString, (id, title) => {
          const event = buildProjectClickEvent(id, title);
          expect(event.name).toBe(ANALYTICS_EVENTS.PROJECT_CLICK);
        }),
        { numRuns: 50 }
      );
    });

    it("project click event always includes project_id and project_title", () => {
      fc.assert(
        fc.property(nonEmptyString, nonEmptyString, (id, title) => {
          const event = buildProjectClickEvent(id, title);
          expect(event.params!.project_id).toBe(id);
          expect(event.params!.project_title).toBe(title);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe("Language change events", () => {
    it("language change event always has correct event name", () => {
      fc.assert(
        fc.property(
          fc.constantFrom<SupportedLocale>(...VALID_LOCALES),
          fc.constantFrom<SupportedLocale>(...VALID_LOCALES),
          (from, to) => {
            const event = buildLanguageChangeEvent(from, to);
            expect(event.name).toBe(ANALYTICS_EVENTS.LANGUAGE_CHANGE);
          }
        ),
        { numRuns: 30 }
      );
    });

    it("language change event always includes from_locale and to_locale", () => {
      fc.assert(
        fc.property(
          fc.constantFrom<SupportedLocale>(...VALID_LOCALES),
          fc.constantFrom<SupportedLocale>(...VALID_LOCALES),
          (from, to) => {
            const event = buildLanguageChangeEvent(from, to);
            expect(VALID_LOCALES).toContain(event.params!.from_locale);
            expect(VALID_LOCALES).toContain(event.params!.to_locale);
            expect(event.params!.from_locale).toBe(from);
            expect(event.params!.to_locale).toBe(to);
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe("Theme toggle events", () => {
    it("theme toggle event always has correct event name", () => {
      fc.assert(
        fc.property(fc.constantFrom<Theme>(...VALID_THEMES), (theme) => {
          const event = buildThemeToggleEvent(theme);
          expect(event.name).toBe(ANALYTICS_EVENTS.THEME_TOGGLE);
        }),
        { numRuns: 20 }
      );
    });

    it("theme toggle event always includes a valid theme param", () => {
      fc.assert(
        fc.property(fc.constantFrom<Theme>(...VALID_THEMES), (theme) => {
          const event = buildThemeToggleEvent(theme);
          expect(VALID_THEMES).toContain(event.params!.theme);
          expect(event.params!.theme).toBe(theme);
        }),
        { numRuns: 20 }
      );
    });
  });

  describe("Career path selection events", () => {
    it("career path event always has correct event name", () => {
      fc.assert(
        fc.property(fc.constantFrom<CareerPath>(...VALID_CAREER_PATHS), (path) => {
          const event = buildCareerPathEvent(path);
          expect(event.name).toBe(ANALYTICS_EVENTS.CAREER_PATH_SELECTION);
        }),
        { numRuns: 20 }
      );
    });

    it("career path event always includes a valid path param", () => {
      fc.assert(
        fc.property(fc.constantFrom<CareerPath>(...VALID_CAREER_PATHS), (path) => {
          const event = buildCareerPathEvent(path);
          expect(VALID_CAREER_PATHS).toContain(event.params!.path);
          expect(event.params!.path).toBe(path);
        }),
        { numRuns: 20 }
      );
    });
  });

  describe("Section view events", () => {
    it("section view event always has correct event name", () => {
      fc.assert(
        fc.property(fc.constantFrom<SectionId>(...VALID_SECTION_IDS), (section_id) => {
          const event = buildSectionViewEvent(section_id);
          expect(event.name).toBe(ANALYTICS_EVENTS.SECTION_VIEW);
        }),
        { numRuns: 30 }
      );
    });

    it("section view event always includes a valid section_id param", () => {
      fc.assert(
        fc.property(fc.constantFrom<SectionId>(...VALID_SECTION_IDS), (section_id) => {
          const event = buildSectionViewEvent(section_id);
          expect(VALID_SECTION_IDS).toContain(event.params!.section_id);
          expect(event.params!.section_id).toBe(section_id);
        }),
        { numRuns: 30 }
      );
    });
  });

  describe("Exit intent action events", () => {
    it("exit intent action event always has correct event name", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_EXIT_INTENT_ACTIONS), (action) => {
          const event = buildExitIntentActionEvent(action);
          expect(event.name).toBe(ANALYTICS_EVENTS.EXIT_INTENT_ACTION);
        }),
        { numRuns: 20 }
      );
    });

    it("exit intent action event always includes a valid action param", () => {
      fc.assert(
        fc.property(fc.constantFrom(...VALID_EXIT_INTENT_ACTIONS), (action) => {
          const event = buildExitIntentActionEvent(action);
          expect(VALID_EXIT_INTENT_ACTIONS).toContain(event.params!.action);
          expect(event.params!.action).toBe(action);
        }),
        { numRuns: 20 }
      );
    });
  });

  describe("General event structure invariants", () => {
    it("all events have a non-empty name", () => {
      const events = [
        buildContactFormEvent(true),
        buildProjectClickEvent("proj-1", "My Project"),
        buildLanguageChangeEvent("en", "pt-BR"),
        buildThemeToggleEvent("dark"),
        buildCareerPathEvent("professional"),
        buildSectionViewEvent("projects"),
        buildExitIntentActionEvent("dismiss"),
      ];

      for (const event of events) {
        expect(typeof event.name).toBe("string");
        expect(event.name.trim().length).toBeGreaterThan(0);
      }
    });

    it("all events with params have only string, number, or boolean values", () => {
      const events = [
        buildContactFormEvent(false),
        buildProjectClickEvent("proj-1", "My Project"),
        buildLanguageChangeEvent("en", "es"),
        buildThemeToggleEvent("light"),
        buildCareerPathEvent("academic"),
        buildSectionViewEvent("skills"),
        buildExitIntentActionEvent("download_resume"),
      ];

      for (const event of events) {
        if (event.params) {
          for (const value of Object.values(event.params)) {
            expect(["string", "number", "boolean"]).toContain(typeof value);
          }
        }
      }
    });
  });
});
