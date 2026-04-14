/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fc from "fast-check";
import { generatePersonSchema, generateWebSiteSchema } from "@/lib/structured-data";

/**
 * Property 41: Structured Data Completeness
 * Validates: Requirements 20.2
 *
 * Test that Person schema includes all essential properties:
 * - @context and @type
 * - name, jobTitle, description
 * - url, sameAs (social links)
 * - knowsAbout (skills)
 * - email, image
 */
describe("Property 41: Structured Data Completeness", () => {
  const locales = ["pt-BR", "en", "es"];

  it("should include all essential Person schema properties for all locales", () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const personSchema = generatePersonSchema(locale) as any;

        // Verify required schema properties
        expect(personSchema["@context"]).toBe("https://schema.org");
        expect(personSchema["@type"]).toBe("Person");

        // Verify essential person properties
        expect(personSchema.name).toBeDefined();
        expect(personSchema.name).not.toBe("");
        expect(typeof personSchema.name).toBe("string");

        expect(personSchema.jobTitle).toBeDefined();
        expect(personSchema.jobTitle).not.toBe("");
        expect(typeof personSchema.jobTitle).toBe("string");

        expect(personSchema.description).toBeDefined();
        expect(personSchema.description).not.toBe("");
        expect(typeof personSchema.description).toBe("string");

        // Verify URL
        expect(personSchema.url).toBeDefined();
        expect(personSchema.url).toMatch(/^https?:\/\//);

        // Verify social links (sameAs)
        expect(personSchema.sameAs).toBeDefined();
        expect(Array.isArray(personSchema.sameAs)).toBe(true);
        if (personSchema.sameAs) {
          expect(personSchema.sameAs.length).toBeGreaterThan(0);
          personSchema.sameAs.forEach((link: string) => {
            expect(typeof link).toBe("string");
            expect(link).toMatch(/^https?:\/\//);
          });
        }

        // Verify skills (knowsAbout)
        expect(personSchema.knowsAbout).toBeDefined();
        expect(Array.isArray(personSchema.knowsAbout)).toBe(true);
        if (personSchema.knowsAbout) {
          expect(personSchema.knowsAbout.length).toBeGreaterThan(0);
        }

        // Verify contact information
        expect(personSchema.email).toBeDefined();
        expect(personSchema.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        // Verify image
        expect(personSchema.image).toBeDefined();
        expect(personSchema.image).toMatch(/^https?:\/\//);
      }),
      { numRuns: 100 }
    );
  });

  it("should include all essential WebSite schema properties for all locales", () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const webSiteSchema = generateWebSiteSchema(locale) as any;

        // Verify required schema properties
        expect(webSiteSchema["@context"]).toBe("https://schema.org");
        expect(webSiteSchema["@type"]).toBe("WebSite");

        // Verify essential website properties
        expect(webSiteSchema.name).toBeDefined();
        expect(webSiteSchema.name).not.toBe("");
        expect(typeof webSiteSchema.name).toBe("string");

        expect(webSiteSchema.description).toBeDefined();
        expect(webSiteSchema.description).not.toBe("");
        expect(typeof webSiteSchema.description).toBe("string");

        // Verify URL
        expect(webSiteSchema.url).toBeDefined();
        expect(webSiteSchema.url).toMatch(/^https?:\/\//);

        // Verify language support
        expect(webSiteSchema.inLanguage).toBeDefined();
        expect(Array.isArray(webSiteSchema.inLanguage)).toBe(true);
        if (webSiteSchema.inLanguage) {
          expect(webSiteSchema.inLanguage.length).toBeGreaterThan(0);
        }

        // Verify author
        expect(webSiteSchema.author).toBeDefined();
        expect(webSiteSchema.author).toHaveProperty("@type", "Person");
        expect(webSiteSchema.author).toHaveProperty("name");
      }),
      { numRuns: 100 }
    );
  });

  it("should have consistent data across all locales", () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const personSchema = generatePersonSchema(locale) as any;

        // URL should be consistent across locales
        expect(personSchema.url).toBe("https://rogeriodocarmo.com");

        // Social links should be consistent
        expect(personSchema.sameAs).toContain("https://github.com/rogeriodocarmo");
        expect(personSchema.sameAs).toContain("https://linkedin.com/in/rogeriodocarmo");

        // Skills should be consistent (language-independent)
        expect(personSchema.knowsAbout).toContain("JavaScript");
        expect(personSchema.knowsAbout).toContain("TypeScript");
        expect(personSchema.knowsAbout).toContain("React");
      }),
      { numRuns: 100 }
    );
  });

  it("should generate valid JSON-LD that can be parsed", () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const personSchema = generatePersonSchema(locale);
        const webSiteSchema = generateWebSiteSchema(locale);

        // Should be serializable to JSON
        const personJson = JSON.stringify(personSchema);
        const webSiteJson = JSON.stringify(webSiteSchema);

        expect(() => JSON.parse(personJson)).not.toThrow();
        expect(() => JSON.parse(webSiteJson)).not.toThrow();

        // Parsed JSON should match original
        expect(JSON.parse(personJson)).toEqual(personSchema);
        expect(JSON.parse(webSiteJson)).toEqual(webSiteSchema);
      }),
      { numRuns: 100 }
    );
  });
});
