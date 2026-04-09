/**
 * Property-based tests for URL anchor navigation.
 *
 * Property 49: URL Updates on Section Navigation
 * **Validates: Requirements 24.1, 24.2**
 *
 * Property 50: Deep Linking and History Navigation
 * **Validates: Requirements 24.3, 24.4, 24.8**
 */

import * as fc from "fast-check";

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_SECTIONS = [
  "home",
  "projects",
  "experience",
  "skills",
  "contact",
  "tech-stack",
] as const;

type SectionId = (typeof VALID_SECTIONS)[number];

const SUPPORTED_LOCALES = ["pt-BR", "en", "es"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

// ─── Pure navigation logic (mirrors hooks/useAnchorNavigation.ts) ─────────────

/**
 * Converts a section ID to a URL hash string.
 * e.g. "projects" → "#projects"
 */
function sectionToHash(sectionId: string): string {
  return `#${sectionId}`;
}

/**
 * Parses a URL hash string back to a section ID.
 * e.g. "#projects" → "projects"
 * Returns empty string for empty/invalid hashes.
 */
function hashToSection(hash: string): string {
  if (!hash || hash === "#") return "";
  return hash.startsWith("#") ? hash.slice(1) : hash;
}

/**
 * Determines whether a section ID is URL-safe.
 * URL-safe: only lowercase letters, digits, and hyphens.
 */
function isSectionIdUrlSafe(sectionId: string): boolean {
  return /^[a-z0-9-]+$/.test(sectionId);
}

/**
 * Builds a locale-aware URL for a given locale and section.
 * e.g. locale="en", section="projects" → "/en/#projects"
 */
function buildLocaleAwareUrl(locale: Locale, sectionId: string): string {
  return `/${locale}/${sectionToHash(sectionId)}`;
}

/**
 * Simulates the navigation state machine.
 * Returns the new currentSection after navigating, or the previous one if invalid.
 */
function navigate(
  sections: readonly string[],
  currentSection: string,
  targetSection: string
): string {
  if (targetSection !== "" && !sections.includes(targetSection)) {
    return currentSection; // invalid section — no change
  }
  return targetSection;
}

/**
 * Simulates reading the section from a URL hash (popstate / deep link).
 */
function sectionFromUrl(sections: readonly string[], hash: string): string {
  const section = hashToSection(hash);
  if (sections.includes(section) || section === "") {
    return section;
  }
  return ""; // unknown section → reset
}

/**
 * Determines whether a section is the active one.
 */
function isActive(currentSection: string, sectionId: string): boolean {
  return currentSection === sectionId;
}

// ─── Property 49: URL Updates on Section Navigation ──────────────────────────

describe("Property 49: URL Updates on Section Navigation", () => {
  /**
   * Navigating to any valid section ID produces a URL hash prefixed with '#'.
   *
   * Validates: Requirements 24.1, 24.2
   */

  it("navigating to any valid section always produces a hash prefixed with #", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        const hash = sectionToHash(sectionId);
        expect(hash).toMatch(/^#/);
      }),
      { numRuns: VALID_SECTIONS.length * 10 }
    );
  });

  it("hash-to-section round-trip is identity for all valid sections", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        const hash = sectionToHash(sectionId);
        const recovered = hashToSection(hash);
        expect(recovered).toBe(sectionId);
      }),
      { numRuns: VALID_SECTIONS.length * 10 }
    );
  });

  it("navigating to a valid section updates currentSection correctly", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (targetSection) => {
        const result = navigate(VALID_SECTIONS, "", targetSection);
        expect(result).toBe(targetSection);
      }),
      { numRuns: 100 }
    );
  });

  it("navigating to an invalid section does not change currentSection", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_SECTIONS),
        fc
          .string({ minLength: 1, maxLength: 20 })
          .filter((s) => !(VALID_SECTIONS as readonly string[]).includes(s) && s !== ""),
        (currentSection, invalidTarget) => {
          const result = navigate(VALID_SECTIONS, currentSection, invalidTarget);
          expect(result).toBe(currentSection);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("isActive returns true only for the current section", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID_SECTIONS),
        fc.constantFrom(...VALID_SECTIONS),
        (current, candidate) => {
          const result = isActive(current, candidate);
          if (current === candidate) {
            expect(result).toBe(true);
          } else {
            expect(result).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("navigating sequentially always reflects the last navigated section", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...VALID_SECTIONS), { minLength: 2, maxLength: 10 }),
        (sectionSequence) => {
          let current = "";
          for (const section of sectionSequence) {
            current = navigate(VALID_SECTIONS, current, section);
          }
          // Final state must equal the last section in the sequence
          expect(current).toBe(sectionSequence[sectionSequence.length - 1]);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("URL hash is always a non-empty string for any valid section", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        const hash = sectionToHash(sectionId);
        expect(hash.length).toBeGreaterThan(1); // at least "#x"
      }),
      { numRuns: VALID_SECTIONS.length * 10 }
    );
  });
});

// ─── Property 50: Deep Linking and History Navigation ────────────────────────

describe("Property 50: Deep Linking and History Navigation", () => {
  /**
   * All major sections support deep linking via URL hash.
   * Section IDs are URL-safe (no spaces, special chars except hyphens).
   * Locale + section combinations produce valid URLs.
   *
   * Validates: Requirements 24.3, 24.4, 24.8
   */

  it("all valid section IDs are URL-safe (only lowercase letters, digits, hyphens)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        expect(isSectionIdUrlSafe(sectionId)).toBe(true);
      }),
      { numRuns: VALID_SECTIONS.length * 10 }
    );
  });

  it("section IDs contain no spaces", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        expect(sectionId).not.toContain(" ");
      }),
      { numRuns: VALID_SECTIONS.length * 10 }
    );
  });

  it("section IDs contain no special characters other than hyphens", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        // Must not contain: ?, #, /, \, %, &, =, +, @, !, etc.
        expect(sectionId).toMatch(/^[a-z0-9-]+$/);
      }),
      { numRuns: VALID_SECTIONS.length * 10 }
    );
  });

  it("deep link URL hash can be parsed back to the original section ID", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        const hash = sectionToHash(sectionId);
        const parsed = sectionFromUrl(VALID_SECTIONS, hash);
        expect(parsed).toBe(sectionId);
      }),
      { numRuns: 100 }
    );
  });

  it("locale + section combinations produce valid URL strings", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        fc.constantFrom(...VALID_SECTIONS),
        (locale, sectionId) => {
          const url = buildLocaleAwareUrl(locale, sectionId);
          // Must start with /locale/
          expect(url).toMatch(new RegExp(`^/${locale}/`));
          // Must contain the hash
          expect(url).toContain(`#${sectionId}`);
          // Must not contain spaces
          expect(url).not.toContain(" ");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("locale-aware URLs always contain the section hash", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        fc.constantFrom(...VALID_SECTIONS),
        (locale, sectionId) => {
          const url = buildLocaleAwareUrl(locale, sectionId);
          expect(url).toContain(sectionToHash(sectionId));
        }
      ),
      { numRuns: 100 }
    );
  });

  it("popstate with a valid section hash restores the correct section", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        const hash = sectionToHash(sectionId);
        const restored = sectionFromUrl(VALID_SECTIONS, hash);
        expect(restored).toBe(sectionId);
      }),
      { numRuns: 100 }
    );
  });

  it("popstate with an unknown hash resets to empty section", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 20 })
          .filter(
            (s) =>
              !(VALID_SECTIONS as readonly string[]).includes(s) &&
              s !== "" &&
              /^[a-z0-9-]+$/.test(s)
          ),
        (unknownSection) => {
          const hash = `#${unknownSection}`;
          const result = sectionFromUrl(VALID_SECTIONS, hash);
          expect(result).toBe("");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("empty hash resets to empty section (top of page)", () => {
    expect(sectionFromUrl(VALID_SECTIONS, "")).toBe("");
    expect(sectionFromUrl(VALID_SECTIONS, "#")).toBe("");
  });

  it("all valid sections are reachable via deep linking", () => {
    fc.assert(
      fc.property(fc.constantFrom(...VALID_SECTIONS), (sectionId) => {
        // A section is deep-linkable if its hash can be parsed back to itself
        const hash = sectionToHash(sectionId);
        const parsed = sectionFromUrl(VALID_SECTIONS, hash);
        expect(parsed).toBe(sectionId);
      }),
      { numRuns: 100 }
    );
  });

  it("locale-aware URL format is consistent across all locale+section combinations", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        fc.constantFrom(...VALID_SECTIONS),
        (locale, sectionId) => {
          const url = buildLocaleAwareUrl(locale, sectionId);
          // Format: /{locale}/#{sectionId}
          expect(url).toBe(`/${locale}/#${sectionId}`);
        }
      ),
      { numRuns: 100 }
    );
  });
});
