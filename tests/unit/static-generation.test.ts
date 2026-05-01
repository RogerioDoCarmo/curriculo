/**
 * Unit tests for static generation optimizations
 *
 * Validates: Requirements 6.1, 6.2, 21.9
 * Task: 22.3 - Implement static generation optimizations
 */

import { SUPPORTED_LOCALES } from "@/types/index";
import fs from "fs";
import path from "path";

describe("Static Generation Optimizations", () => {
  const outDir = path.join(process.cwd(), "out");

  describe("Pre-rendered pages", () => {
    it("should generate static HTML for all locales", () => {
      // Verify that the out directory exists
      expect(fs.existsSync(outDir)).toBe(true);

      // Verify that each locale has a static HTML file
      SUPPORTED_LOCALES.forEach((locale) => {
        const localePath = path.join(outDir, locale, "index.html");
        expect(fs.existsSync(localePath)).toBe(true);

        // Verify the HTML file is not empty
        const content = fs.readFileSync(localePath, "utf-8");
        expect(content.length).toBeGreaterThan(0);
        expect(content).toContain("<!DOCTYPE html>");
        expect(content).toContain("<html");
      });
    });

    it("should generate root index.html for default locale redirect", () => {
      const rootIndexPath = path.join(outDir, "index.html");
      expect(fs.existsSync(rootIndexPath)).toBe(true);

      const content = fs.readFileSync(rootIndexPath, "utf-8");
      expect(content).toContain("<!DOCTYPE html>");
    });

    it("should generate 404 page", () => {
      const notFoundPath = path.join(outDir, "404.html");
      expect(fs.existsSync(notFoundPath)).toBe(true);

      const content = fs.readFileSync(notFoundPath, "utf-8");
      // Next.js 404 page may not have DOCTYPE in static export
      // but should contain the 404 error message
      expect(content).toContain("404");
      expect(content).toContain("This page could not be found");
    });
  });

  describe("Static assets", () => {
    it("should generate sitemap.xml", () => {
      const sitemapPath = path.join(outDir, "sitemap.xml");
      expect(fs.existsSync(sitemapPath)).toBe(true);

      const content = fs.readFileSync(sitemapPath, "utf-8");
      expect(content).toContain("<?xml");
      expect(content).toContain("<urlset");
    });

    it("should generate robots.txt", () => {
      const robotsPath = path.join(outDir, "robots.txt");
      expect(fs.existsSync(robotsPath)).toBe(true);

      const content = fs.readFileSync(robotsPath, "utf-8");
      expect(content.length).toBeGreaterThan(0);
    });

    it("should generate JSON resume", () => {
      const resumePath = path.join(outDir, "resume.json");
      expect(fs.existsSync(resumePath)).toBe(true);

      const content = fs.readFileSync(resumePath, "utf-8");
      const json = JSON.parse(content);
      expect(json).toHaveProperty("basics");
    });
  });

  describe("JavaScript bundles", () => {
    it("should generate optimized JavaScript chunks", () => {
      const nextStaticPath = path.join(outDir, "_next", "static");
      expect(fs.existsSync(nextStaticPath)).toBe(true);

      // Verify chunks directory exists
      const chunksPath = path.join(nextStaticPath, "chunks");
      expect(fs.existsSync(chunksPath)).toBe(true);
    });

    it("should have code splitting for lazy-loaded components", () => {
      const nextStaticPath = path.join(outDir, "_next", "static");
      const chunksPath = path.join(nextStaticPath, "chunks");

      // Read all chunk files
      const files = fs.readdirSync(chunksPath, { recursive: true }) as string[];
      const jsFiles = files.filter((f) => f.endsWith(".js"));

      // Should have multiple chunks (indicating code splitting)
      expect(jsFiles.length).toBeGreaterThan(1);
    });
  });

  describe("Locale-specific content", () => {
    it("should have different content for each locale", () => {
      const localeContents: Record<string, string> = {};

      SUPPORTED_LOCALES.forEach((locale) => {
        const localePath = path.join(outDir, locale, "index.html");
        localeContents[locale] = fs.readFileSync(localePath, "utf-8");
      });

      // Verify that pt-BR and en have different content
      expect(localeContents["pt-BR"]).not.toBe(localeContents["en"]);
      expect(localeContents["pt-BR"]).not.toBe(localeContents["es"]);
      expect(localeContents["en"]).not.toBe(localeContents["es"]);
    });

    it("should include locale in HTML lang attribute", () => {
      SUPPORTED_LOCALES.forEach((locale) => {
        const localePath = path.join(outDir, locale, "index.html");
        const content = fs.readFileSync(localePath, "utf-8");

        // Should have lang attribute with the locale
        expect(content).toMatch(new RegExp(`<html[^>]*lang="${locale}"`));
      });
    });
  });

  describe("SEO and metadata", () => {
    it("should include meta tags in all locale pages", () => {
      SUPPORTED_LOCALES.forEach((locale) => {
        const localePath = path.join(outDir, locale, "index.html");
        const content = fs.readFileSync(localePath, "utf-8");

        // Should have essential meta tags
        expect(content).toContain("<meta");
        expect(content).toContain('name="description"');
        expect(content).toContain('property="og:');
      });
    });

    it("should include structured data in all locale pages", () => {
      SUPPORTED_LOCALES.forEach((locale) => {
        const localePath = path.join(outDir, locale, "index.html");
        const content = fs.readFileSync(localePath, "utf-8");

        // Should have JSON-LD structured data (rendered by Next.js Script component)
        // Next.js Script with beforeInteractive renders differently but content is still present
        expect(content).toContain("@context");
        expect(content).toContain("schema.org");
        expect(content).toContain("Person");
        expect(content).toContain("WebSite");
      });
    });
  });

  describe("Performance optimizations", () => {
    it("should have minified HTML", () => {
      const localePath = path.join(outDir, "pt-BR", "index.html");
      const content = fs.readFileSync(localePath, "utf-8");

      // Minified HTML should not have excessive whitespace
      // Check that there are no lines with only whitespace
      const lines = content.split("\n");
      const whitespaceOnlyLines = lines.filter((line) => line.trim() === "");

      // Should have minimal whitespace-only lines (some are acceptable)
      expect(whitespaceOnlyLines.length).toBeLessThan(lines.length * 0.1);
    });

    it("should have compressed JavaScript files", () => {
      const nextStaticPath = path.join(outDir, "_next", "static");
      const chunksPath = path.join(nextStaticPath, "chunks");

      const files = fs.readdirSync(chunksPath, { recursive: true }) as string[];
      const jsFiles = files.filter((f) => f.endsWith(".js"));

      // Verify at least one JS file exists
      expect(jsFiles.length).toBeGreaterThan(0);

      // Check that JS files are minified (no excessive whitespace)
      const sampleFile = path.join(chunksPath, jsFiles[0]);
      const content = fs.readFileSync(sampleFile, "utf-8");

      // Minified JS should have high character density
      const nonWhitespaceChars = content.replace(/\s/g, "").length;
      const totalChars = content.length;
      const density = nonWhitespaceChars / totalChars;

      // Minified code should have > 80% non-whitespace characters
      expect(density).toBeGreaterThan(0.8);
    });
  });
});
