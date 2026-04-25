/**
 * ExitIntentModal Component
 *
 * Displays a modal when exit intent is detected, encouraging visitors to:
 * - Download the resume
 * - Connect on LinkedIn
 * - Star the GitHub repository
 *
 * Features:
 * - Shows only once per session
 * - Displays within 100ms of exit intent detection
 * - Includes close button and backdrop dismiss
 * - Accessible with keyboard navigation and screen readers
 *
 * Requirements: 19.3, 19.4, 19.5, 19.6, 19.8, 19.10
 */

"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";
import { useExitIntent } from "@/hooks/useExitIntent";

interface ExitIntentModalProps {
  readonly enabled?: boolean;
  readonly resumeUrl?: string;
  readonly linkedInUrl?: string;
  readonly githubUrl?: string;
}

export default function ExitIntentModal({
  enabled = true,
  resumeUrl = "/resume.pdf",
  linkedInUrl = "https://www.linkedin.com/in/rogeriodocarmo/",
  githubUrl = "https://github.com/RogerioDoCarmo/curriculo",
}: ExitIntentModalProps) {
  const t = useTranslations("exitIntent");

  const { showModal, dismissModal } = useExitIntent({
    enabled,
    threshold: 20,
    minTimeOnPage: 5000, // 5 seconds
  });

  // Track analytics when modal is shown
  useEffect(() => {
    if (showModal && typeof window !== "undefined") {
      // TODO: Integrate with analytics service (Firebase Analytics, etc.)
      // trackEvent('exit_intent_modal_shown');
    }
  }, [showModal]);

  const handleDownloadResume = () => {
    // TODO: Track download event with analytics
    // trackEvent('exit_intent_resume_download');
    window.open(resumeUrl, "_blank");
    dismissModal();
  };

  const handleConnectLinkedIn = () => {
    // TODO: Track LinkedIn click with analytics
    // trackEvent('exit_intent_linkedin_click');
    window.open(linkedInUrl, "_blank");
    dismissModal();
  };

  const handleStarGitHub = () => {
    // TODO: Track GitHub star click with analytics
    // trackEvent('exit_intent_github_click');
    window.open(githubUrl, "_blank");
    dismissModal();
  };

  return (
    <Modal isOpen={showModal} onClose={dismissModal} title={t("title")}>
      <div className="space-y-6">
        {/* Headline */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("headline")}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t("subtitle")}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleDownloadResume}
            className="w-full"
            aria-label={t("downloadResumeAriaLabel")}
          >
            <svg
              className="w-5 h-5 mr-2 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("downloadResume")}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleConnectLinkedIn}
            className="w-full"
            aria-label={t("connectLinkedInAriaLabel")}
          >
            <svg
              className="w-5 h-5 mr-2 inline-block"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            {t("connectLinkedIn")}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleStarGitHub}
            className="w-full"
            aria-label={t("starGitHubAriaLabel")}
          >
            <svg
              className="w-5 h-5 mr-2 inline-block"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            {t("starGitHub")}
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">{t("footerNote")}</p>

        {/* Email capture */}
        <div className="border-t border-border pt-4">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-3">
            Or leave your email and I&apos;ll reach out:
          </p>
          <EmailSubscribeForm
            placeholder="your@email.com"
            buttonLabel="Contact me"
            successMessage="Got it! I'll be in touch soon."
          />
        </div>
      </div>
    </Modal>
  );
}
