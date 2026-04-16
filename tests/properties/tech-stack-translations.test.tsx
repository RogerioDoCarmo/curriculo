/**
 * Property-Based Tests for Tech Stack Translation Coverage
 *
 * Property 26: Tech Stack Translation Coverage
 * Validates: Requirements 23.7
 *
 * Tests that all tech stack explanations exist in all language files
 * with non-empty values.
 */

import * as fc from "fast-check";
import ptBR from "@/messages/pt-BR.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

describe("Property 26: Tech Stack Translation Coverage", () => {
  const languages = [
    { code: "pt-BR", messages: ptBR },
    { code: "en", messages: en },
    { code: "es", messages: es },
  ];

  it("should have techStack section in all language files", () => {
    languages.forEach(({ messages }) => {
      expect(messages).toHaveProperty("techStack");
      expect(messages.techStack).toBeDefined();
      expect(typeof messages.techStack).toBe("object");
    });
  });

  it("should have all required techStack fields in all languages", () => {
    const requiredFields = ["title", "subtitle", "categories", "technologies"];

    languages.forEach(({ messages }) => {
      requiredFields.forEach((field) => {
        expect(messages.techStack).toHaveProperty(field);
        expect(messages.techStack[field as keyof typeof messages.techStack]).toBeDefined();
      });
    });
  });

  it("should have all category translations in all languages", () => {
    const requiredCategories = [
      "framework",
      "styling",
      "content",
      "internationalization",
      "testing",
      "analytics",
      "deployment",
    ];

    languages.forEach(({ messages }) => {
      expect(messages.techStack).toHaveProperty("categories");

      requiredCategories.forEach((category) => {
        expect(messages.techStack.categories).toHaveProperty(category);
        expect(
          messages.techStack.categories[category as keyof typeof messages.techStack.categories]
        ).toBeTruthy();
        expect(
          typeof messages.techStack.categories[
            category as keyof typeof messages.techStack.categories
          ]
        ).toBe("string");
      });
    });
  });

  it("should have consistent technology keys across all languages", () => {
    // Get technology keys from pt-BR (reference language)
    const referenceTechKeys = Object.keys(ptBR.techStack?.technologies || {});
    expect(referenceTechKeys.length).toBeGreaterThan(0);

    // Verify all languages have the same technology keys
    languages.forEach(({ messages }) => {
      const techKeys = Object.keys(messages.techStack?.technologies || {});
      expect(techKeys.sort()).toEqual(referenceTechKeys.sort());
    });
  });

  it("should have complete technology data for each tech in all languages", () => {
    const requiredTechFields = ["name", "description", "why", "benefits"];

    languages.forEach(({ messages }) => {
      const technologies = messages.techStack?.technologies || {};
      const techKeys = Object.keys(technologies);

      expect(techKeys.length).toBeGreaterThan(0);

      techKeys.forEach((techKey) => {
        const tech = technologies[techKey as keyof typeof technologies];

        requiredTechFields.forEach((field) => {
          expect(tech).toHaveProperty(field);
          const value = tech[field as keyof typeof tech];
          expect(value).toBeTruthy();
          expect(typeof value).toBe("string");
          expect(value.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it("should have non-empty translation values for all tech stack content", () => {
    fc.assert(
      fc.property(fc.constantFrom(...languages), ({ messages }) => {
        // Check title and subtitle are non-empty
        expect(messages.techStack.title).toBeTruthy();
        expect(messages.techStack.subtitle).toBeTruthy();

        // Check all categories are non-empty
        const categories = messages.techStack.categories;
        Object.values(categories).forEach((categoryName) => {
          expect(categoryName).toBeTruthy();
          expect(categoryName.length).toBeGreaterThan(0);
        });

        // Check all technology data is non-empty
        const technologies = messages.techStack.technologies;
        Object.values(technologies).forEach((tech) => {
          expect(tech.name).toBeTruthy();
          expect(tech.description).toBeTruthy();
          expect(tech.why).toBeTruthy();
          expect(tech.benefits).toBeTruthy();
        });

        return true;
      }),
      { numRuns: 10 }
    );
  });

  it("should have descriptions that are understandable (reasonable length)", () => {
    languages.forEach(({ messages }) => {
      const technologies = messages.techStack?.technologies || {};

      Object.entries(technologies).forEach(([_key, tech]) => {
        // Description should be between 20 and 200 characters (reasonable for simple explanation)
        expect(tech.description.length).toBeGreaterThanOrEqual(20);
        expect(tech.description.length).toBeLessThanOrEqual(200);

        // Why should be between 20 and 150 characters
        expect(tech.why.length).toBeGreaterThanOrEqual(20);
        expect(tech.why.length).toBeLessThanOrEqual(150);

        // Benefits should be between 20 and 200 characters
        expect(tech.benefits.length).toBeGreaterThanOrEqual(20);
        expect(tech.benefits.length).toBeLessThanOrEqual(200);
      });
    });
  });

  it("should use simple, non-technical language in descriptions", () => {
    // Technical jargon to avoid in descriptions
    const technicalJargon = [
      "SSR",
      "SSG",
      "hydration",
      "bundle",
      "minification",
      "tree-shaking",
      "webpack",
      "transpilation",
      "polyfill",
      "middleware",
      "API endpoint",
      "serverless",
      "edge function",
    ];

    languages.forEach(({ messages }) => {
      const technologies = messages.techStack?.technologies || {};

      Object.entries(technologies).forEach(([_key, tech]) => {
        // Check description doesn't contain technical jargon
        const description = tech.description.toLowerCase();
        technicalJargon.forEach((jargon) => {
          expect(description).not.toContain(jargon.toLowerCase());
        });
      });
    });
  });

  it("should have consistent category assignments across languages", () => {
    // This test ensures that if a technology is in a category in one language,
    // it should be in the same category in all languages

    // For now, we verify that all languages have the same set of technologies
    const referenceTechs = Object.keys(ptBR.techStack?.technologies || {});

    languages.forEach(({ messages }) => {
      const techs = Object.keys(messages.techStack?.technologies || {});
      expect(techs.sort()).toEqual(referenceTechs.sort());
    });
  });

  it("should have URL field for documentation links", () => {
    languages.forEach(({ messages }) => {
      const technologies = messages.techStack?.technologies || {};

      Object.entries(technologies).forEach(([_key, tech]) => {
        // Each technology should have a url field
        expect(tech).toHaveProperty("url");
        expect(tech.url).toBeTruthy();
        expect(typeof tech.url).toBe("string");

        // URL should be a valid HTTP/HTTPS URL
        expect(tech.url).toMatch(/^https?:\/\/.+/);
      });
    });
  });
});
