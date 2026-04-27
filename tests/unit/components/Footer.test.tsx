/**
 * Unit tests for Footer component
 *
 * Requirements: 3.1, 7.5
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Footer from "@/components/Footer";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "footer.copyright": "All rights reserved.",
      "footer.sitemap": "Sitemap",
    };
    return translations[key] ?? key;
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderFooter(locale = "en") {
  return render(<Footer locale={locale} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Footer", () => {
  // -------------------------------------------------------------------------
  // Semantic structure
  // -------------------------------------------------------------------------
  it("renders a <footer> element with role=contentinfo", async () => {
    renderFooter();
    await waitFor(() => {
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Navigation links
  // -------------------------------------------------------------------------
  it("renders all navigation section links", async () => {
    renderFooter();
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /experience/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /skills/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /tech stack/i })).toBeInTheDocument();
    });
  });

  it("navigation links point to anchor hrefs", async () => {
    renderFooter();
    await waitFor(() => {
      expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "#home");
      expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute("href", "#projects");
      expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute(
        "href",
        "#experience"
      );
      expect(screen.getByRole("link", { name: /skills/i })).toHaveAttribute("href", "#skills");
      expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "#contact");
      expect(screen.getByRole("link", { name: /tech stack/i })).toHaveAttribute(
        "href",
        "#tech-stack"
      );
    });
  });

  // -------------------------------------------------------------------------
  // Social media links
  // -------------------------------------------------------------------------
  it("renders LinkedIn social link", async () => {
    renderFooter();
    await waitFor(() => {
      const linkedIn = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedIn).toBeInTheDocument();
      expect(linkedIn).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
    });
  });

  it("renders GitHub social link", async () => {
    renderFooter();
    await waitFor(() => {
      const github = screen.getByRole("link", { name: /github/i });
      expect(github).toBeInTheDocument();
      expect(github).toHaveAttribute("href", expect.stringContaining("github.com"));
    });
  });

  it("renders Twitter social link", async () => {
    renderFooter();
    await waitFor(() => {
      const twitter = screen.getByRole("link", { name: /twitter/i });
      expect(twitter).toBeInTheDocument();
      expect(twitter).toHaveAttribute("href", expect.stringContaining("twitter.com"));
    });
  });

  // -------------------------------------------------------------------------
  // Copyright notice
  // -------------------------------------------------------------------------
  it("displays copyright notice with current year and author name", async () => {
    renderFooter();
    const year = new Date().getFullYear();
    await waitFor(() => {
      const copyright = screen.getByText(new RegExp(`© ${year} Rogério do Carmo`, "i"));
      expect(copyright).toBeInTheDocument();
    });
  });

  it("displays 'All rights reserved.' in copyright", async () => {
    renderFooter();
    await waitFor(() => {
      expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Language links
  // -------------------------------------------------------------------------
  it("renders Portuguese language link", async () => {
    renderFooter();
    await waitFor(() => {
      const ptLink = screen.getByRole("link", { name: /português/i });
      expect(ptLink).toBeInTheDocument();
      expect(ptLink).toHaveAttribute("href", "/pt-BR");
    });
  });

  it("renders English language link", async () => {
    renderFooter();
    await waitFor(() => {
      const enLink = screen.getByRole("link", { name: /english/i });
      expect(enLink).toBeInTheDocument();
      expect(enLink).toHaveAttribute("href", "/en");
    });
  });

  it("renders Spanish language link", async () => {
    renderFooter();
    await waitFor(() => {
      const esLink = screen.getByRole("link", { name: /español/i });
      expect(esLink).toBeInTheDocument();
      expect(esLink).toHaveAttribute("href", "/es");
    });
  });

  // -------------------------------------------------------------------------
  // Keyboard accessibility — all links must have href
  // -------------------------------------------------------------------------
  it("all links have an href attribute (keyboard accessible)", async () => {
    renderFooter();
    await waitFor(() => {
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
        expect(link.getAttribute("href")).not.toBe("");
      });
    });
  });

  // -------------------------------------------------------------------------
  // Section headings
  // -------------------------------------------------------------------------
  it("renders Navigate, Languages, and Connect section headings", async () => {
    renderFooter();
    await waitFor(() => {
      expect(screen.getByText(/navigate/i)).toBeInTheDocument();
      expect(screen.getByText(/languages/i)).toBeInTheDocument();
      expect(screen.getByText(/connect/i)).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Resume download link (Task 27.7)
  // -------------------------------------------------------------------------
  it("renders resume download link", async () => {
    renderFooter();
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume/i });
      expect(resumeLink).toBeInTheDocument();
    });
  });

  it("resume download link points to correct PDF for pt-BR locale", async () => {
    renderFooter("pt-BR");
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume/i });
      expect(resumeLink).toHaveAttribute("href", "/resumes/resume.pdf");
    });
  });

  it("resume download link points to correct PDF for English locale", async () => {
    renderFooter("en");
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume/i });
      expect(resumeLink).toHaveAttribute("href", "/resumes/resume.pdf");
    });
  });

  it("resume download link points to correct PDF for Spanish locale", async () => {
    renderFooter("es");
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume/i });
      expect(resumeLink).toHaveAttribute("href", "/resumes/resume.pdf");
    });
  });

  it("resume download link opens in new tab", async () => {
    renderFooter();
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume/i });
      expect(resumeLink).toHaveAttribute("target", "_blank");
      expect(resumeLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("resume download link has proper aria-label for accessibility", async () => {
    renderFooter();
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume in pdf format/i });
      expect(resumeLink).toBeInTheDocument();
      expect(resumeLink).toHaveAttribute("aria-label", "Download resume in PDF format");
    });
  });

  it("resume download link has download icon with aria-hidden", async () => {
    const { container } = renderFooter();
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume/i });
      const svg = resumeLink.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("resume download link is keyboard accessible", async () => {
    renderFooter();
    await waitFor(() => {
      const resumeLink = screen.getByRole("link", { name: /download resume/i });
      expect(resumeLink).toHaveAttribute("href");
      expect(resumeLink.getAttribute("href")).not.toBe("");
    });
  });
});
