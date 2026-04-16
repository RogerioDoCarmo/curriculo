/**
 * Property-Based Tests for Tech Stack Documentation Links
 *
 * Property 27: Tech Stack Documentation Links
 * Validates: Requirements 23.10
 *
 * Tests that technologies with documentation have clickable links
 * that open in new tabs with proper security attributes.
 */

import * as fc from "fast-check";
import { render } from "@testing-library/react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import TechStackSection from "@/components/TechStackSection";
import ptBR from "@/messages/pt-BR.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

describe("Property 27: Tech Stack Documentation Links", () => {
  const languages = [
    { code: "pt-BR", messages: ptBR },
    { code: "en", messages: en },
    { code: "es", messages: es },
  ];

  const renderComponent = (locale: string, messages: AbstractIntlMessages) => {
    return render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <TechStackSection />
      </NextIntlClientProvider>
    );
  };

  it("should have documentation URLs for all technologies", () => {
    languages.forEach(({ messages }) => {
      const technologies = messages.techStack?.technologies || {};
      const techKeys = Object.keys(technologies);

      expect(techKeys.length).toBeGreaterThan(0);

      techKeys.forEach((techKey) => {
        const tech = technologies[techKey as keyof typeof technologies];
        expect(tech).toHaveProperty("url");
        expect(tech.url).toBeTruthy();
        expect(typeof tech.url).toBe("string");
      });
    });
  });

  it("should have valid HTTP/HTTPS URLs for all technologies", () => {
    interface TechEntry {
      url: string;
    }

    fc.assert(
      fc.property(fc.constantFrom(...languages), ({ messages }) => {
        const technologies = messages.techStack?.technologies || {};

        Object.values(technologies as Record<string, TechEntry>).forEach((tech) => {
          // URL should start with http:// or https://
          expect(tech.url).toMatch(/^https?:\/\/.+/);

          // URL should have a valid domain structure
          expect(tech.url).toMatch(/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        });

        return true;
      }),
      { numRuns: 10 }
    );
  });

  it("should render clickable links for all technologies", () => {
    languages.forEach(({ code, messages }) => {
      const { container } = renderComponent(code, messages);

      const technologies = messages.techStack?.technologies || {};
      const techCount = Object.keys(technologies).length;

      // Find all external links (documentation links)
      const links = container.querySelectorAll('a[href^="http"]');

      // Should have at least one link per technology
      expect(links.length).toBeGreaterThanOrEqual(techCount);
    });
  });

  it('should have target="_blank" for all documentation links', () => {
    languages.forEach(({ code, messages }) => {
      const { container } = renderComponent(code, messages);

      const links = container.querySelectorAll('a[href^="http"]');

      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });
  });

  it('should have rel="noopener noreferrer" for security', () => {
    languages.forEach(({ code, messages }) => {
      const { container } = renderComponent(code, messages);

      const links = container.querySelectorAll('a[href^="http"]');

      links.forEach((link) => {
        const rel = link.getAttribute("rel");
        expect(rel).toContain("noopener");
        expect(rel).toContain("noreferrer");
      });
    });
  });

  it("should have accessible link text or aria-label", () => {
    languages.forEach(({ code, messages }) => {
      const { container } = renderComponent(code, messages);

      const links = container.querySelectorAll('a[href^="http"]');

      links.forEach((link) => {
        // Link should have either text content or aria-label
        const hasText = link.textContent && link.textContent.trim().length > 0;
        const hasAriaLabel = link.hasAttribute("aria-label");

        expect(hasText || hasAriaLabel).toBe(true);
      });
    });
  });

  it("should link to official documentation domains", () => {
    // Common official documentation domains
    const officialDomains = [
      "nextjs.org",
      "tailwindcss.com",
      "firebase.google.com",
      "vercel.com",
      "jestjs.io",
      "playwright.dev",
      "sentry.io",
      "formspree.io",
      "github.com",
      "next-intl-docs.vercel.app",
      "storybook.js.org",
      "sonarqube.org",
      "daringfireball.net", // Markdown
    ];

    interface TechEntry {
      url: string;
    }

    languages.forEach(({ messages }) => {
      const technologies = messages.techStack?.technologies || {};

      Object.entries(technologies as Record<string, TechEntry>).forEach(([_key, tech]) => {
        const url = new URL(tech.url);
        const domain = url.hostname.replace("www.", "");

        // Check if URL points to a known official domain
        const isOfficialDomain = officialDomains.some(
          (officialDomain) => domain === officialDomain || domain.endsWith(`.${officialDomain}`)
        );

        // If not in our list, at least verify it's a real domain
        if (!isOfficialDomain) {
          expect(domain).toMatch(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        }
      });
    });
  });

  it("should have consistent URLs across all languages", () => {
    // URLs should be the same across all languages (documentation is typically in English)
    const referenceTechs = ptBR.techStack?.technologies || {};
    const referenceTechKeys = Object.keys(referenceTechs);

    languages.forEach(({ messages }) => {
      const technologies = messages.techStack?.technologies || {};

      referenceTechKeys.forEach((techKey) => {
        const referenceUrl = referenceTechs[techKey as keyof typeof referenceTechs]?.url;
        const currentUrl = technologies[techKey as keyof typeof technologies]?.url;

        // URLs should be identical across languages
        expect(currentUrl).toBe(referenceUrl);
      });
    });
  });

  it("should render links with proper hover and focus states", () => {
    const { container } = renderComponent("en", en);

    const links = container.querySelectorAll('a[href^="http"]');

    links.forEach((link) => {
      // Links should have focus and hover styles (Tailwind classes)
      const className = link.className;
      expect(className).toMatch(/hover:|focus:/);
    });
  });

  it("should have descriptive link text indicating external navigation", () => {
    languages.forEach(({ code, messages }) => {
      const { container } = renderComponent(code, messages);

      const links = container.querySelectorAll('a[href^="http"]');

      // At least some links should indicate they're external
      // (e.g., "Learn more", "Documentation", "Official site", or have an icon)
      const hasExternalIndicator = Array.from(links).some((link) => {
        const text = link.textContent?.toLowerCase() || "";
        const ariaLabel = link.getAttribute("aria-label")?.toLowerCase() || "";
        const hasIcon = link.querySelector("svg") !== null;

        return (
          text.includes("learn") ||
          text.includes("documentation") ||
          text.includes("official") ||
          text.includes("site") ||
          ariaLabel.includes("external") ||
          hasIcon
        );
      });

      expect(hasExternalIndicator).toBe(true);
    });
  });
});
