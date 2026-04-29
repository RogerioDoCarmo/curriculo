/**
 * Integration tests for resume download flow
 * Task 27.6: Write integration test for resume download flow
 *
 * Tests:
 * - Clicking download button opens correct PDF for each locale
 * - PDF files are accessible and downloadable
 * - Fallback behavior if PDF doesn't exist
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import ExitIntentModal from "@/components/ExitIntentModal";
import fs from "fs";
import path from "path";

// Mock useExitIntent hook to always show modal
jest.mock("@/hooks/useExitIntent", () => ({
  useExitIntent: () => ({
    showModal: true,
    dismissModal: jest.fn(),
  }),
}));

const messages = {
  exitIntent: {
    title: "Before you go...",
    headline: "Before you go...",
    subtitle: "Would you like to connect or download my resume?",
    downloadResume: "Download Resume (PDF)",
    downloadResumeAriaLabel: "Download resume in PDF format",
    connectLinkedIn: "Connect on LinkedIn",
    connectLinkedInAriaLabel: "Connect with me on LinkedIn",
    starGitHub: "Star on GitHub",
    starGitHubAriaLabel: "Star repository on GitHub",
    footerNote: "Thanks for visiting!",
    emailPrompt: "Or leave your email and I'll reach out:",
    emailPlaceholder: "your@email.com",
    emailButton: "Contact me",
    emailSuccess: "Got it! I'll be in touch soon.",
  },
};

// SKIPPED: next-intl 4.x ESM modules not compatible with Jest 29
// See Task 31 in tasks.md for resolution plan
describe.skip("Resume Download Integration Tests", () => {
  let mockWindowOpen: jest.Mock;

  beforeEach(() => {
    mockWindowOpen = jest.fn();
    global.window.open = mockWindowOpen;
  });

  afterEach(() => {
    mockWindowOpen.mockRestore();
  });

  describe("Download flow for each locale", () => {
    it("should open correct PDF when download button is clicked for pt-BR", async () => {
      render(
        <NextIntlClientProvider locale="pt-BR" messages={messages}>
          <ExitIntentModal enabled={true} locale="pt-BR" />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith("/resumes/resume.pdf", "_blank");
      });
    });

    it("should open correct PDF when download button is clicked for English", async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ExitIntentModal enabled={true} locale="en" />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith("/resumes/resume.pdf", "_blank");
      });
    });

    it("should open correct PDF when download button is clicked for Spanish", async () => {
      render(
        <NextIntlClientProvider locale="es" messages={messages}>
          <ExitIntentModal enabled={true} locale="es" />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith("/resumes/resume.pdf", "_blank");
      });
    });
  });

  describe("PDF file accessibility", () => {
    it("should verify that main resume.pdf file exists", () => {
      const resumePath = path.join(process.cwd(), "public", "resumes", "resume.pdf");
      const fileExists = fs.existsSync(resumePath);

      expect(fileExists).toBe(true);
    });

    it("should verify that resume.pdf is a valid PDF file", () => {
      const resumePath = path.join(process.cwd(), "public", "resumes", "resume.pdf");

      if (fs.existsSync(resumePath)) {
        const fileBuffer = fs.readFileSync(resumePath);
        const pdfHeader = fileBuffer.toString("utf8", 0, 5);

        // PDF files start with "%PDF-"
        expect(pdfHeader).toBe("%PDF-");
      }
    });

    it("should verify that resume.pdf file size is reasonable (< 2MB)", () => {
      const resumePath = path.join(process.cwd(), "public", "resumes", "resume.pdf");

      if (fs.existsSync(resumePath)) {
        const stats = fs.statSync(resumePath);
        const fileSizeInMB = stats.size / (1024 * 1024);

        expect(fileSizeInMB).toBeLessThan(2);
      }
    });
  });

  describe("Fallback behavior", () => {
    it("should use fallback resume.pdf when locale-specific file doesn't exist", async () => {
      // Test with a locale that doesn't have a specific PDF
      render(
        <NextIntlClientProvider locale="fr" messages={messages}>
          <ExitIntentModal enabled={true} locale="fr" />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      fireEvent.click(downloadButton);

      await waitFor(() => {
        // Should fallback to main resume.pdf
        expect(mockWindowOpen).toHaveBeenCalledWith("/resumes/resume.pdf", "_blank");
      });
    });

    it("should handle undefined locale gracefully", async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ExitIntentModal enabled={true} locale={undefined} />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledWith("/resumes/resume.pdf", "_blank");
      });
    });
  });

  describe("User interaction flow", () => {
    it("should complete full download flow: modal open → click download → new tab opens", async () => {
      const { container } = render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ExitIntentModal enabled={true} locale="en" />
        </NextIntlClientProvider>
      );

      // Verify modal is visible
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();

      // Find and click download button
      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });
      expect(downloadButton).toBeVisible();

      fireEvent.click(downloadButton);

      // Verify window.open was called with correct parameters
      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledTimes(1);
        expect(mockWindowOpen).toHaveBeenCalledWith("/resumes/resume.pdf", "_blank");
      });

      // Verify modal remains open (doesn't auto-dismiss)
      expect(modal).toBeInTheDocument();
    });

    it("should allow multiple download attempts without closing modal", async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ExitIntentModal enabled={true} locale="en" />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      // Click download button multiple times
      fireEvent.click(downloadButton);
      fireEvent.click(downloadButton);
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalledTimes(3);
      });

      // Modal should still be visible
      const modal = screen.getByRole("dialog");
      expect(modal).toBeInTheDocument();
    });
  });

  describe("Feature flag behavior", () => {
    it("should use single PDF when USE_LOCALE_SPECIFIC_PDFS is false", async () => {
      // Test all locales use the same PDF
      const locales = ["pt-BR", "en", "es"];

      for (const locale of locales) {
        mockWindowOpen.mockClear();

        const { unmount } = render(
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ExitIntentModal enabled={true} locale={locale} />
          </NextIntlClientProvider>
        );

        const downloadButton = screen.getByRole("button", {
          name: /download resume/i,
        });

        fireEvent.click(downloadButton);

        await waitFor(() => {
          expect(mockWindowOpen).toHaveBeenCalledWith("/resumes/resume.pdf", "_blank");
        });

        unmount();
      }
    });
  });

  describe("Accessibility in download flow", () => {
    it("should maintain focus management during download", async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ExitIntentModal enabled={true} locale="en" />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      // Focus the button
      downloadButton.focus();
      expect(downloadButton).toHaveFocus();

      // Click the button
      fireEvent.click(downloadButton);

      await waitFor(() => {
        expect(mockWindowOpen).toHaveBeenCalled();
      });

      // Button should still be focusable after click
      expect(downloadButton).toBeInTheDocument();
    });

    it("should have proper accessible name for download action", () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <ExitIntentModal enabled={true} locale="en" />
        </NextIntlClientProvider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /download resume/i,
      });

      expect(downloadButton).toHaveAccessibleName();
      expect(downloadButton.textContent).toContain("PDF");
    });
  });
});
