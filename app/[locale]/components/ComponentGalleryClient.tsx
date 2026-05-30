"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import HighlightedText from "@/components/HighlightedText";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import ComponentShowcase from "@/components/ComponentShowcase";
import type { SupportedLocale } from "@/types/index";

interface ComponentGalleryClientProps {
  readonly locale: SupportedLocale;
}

export default function ComponentGalleryClient({ locale }: ComponentGalleryClientProps) {
  const t = useTranslations("ComponentGallery");
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">{t("heading")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-6">{t("subheading")}</p>
          <a
            href="https://www.chromatic.com/library?appId=6a1b4e8a78d533ad545f5bc0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#FC521F] hover:bg-[#e04519] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FC521F] focus:ring-offset-2 transition-all duration-200"
          >
            {t("storybookButton")}
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </header>

        {/* Component Showcases */}
        <div className="space-y-16">
          {/* Button Component */}
          <ComponentShowcase title={t("button.title")} description={t("button.description")}>
            <div className="flex flex-wrap gap-4 p-4">
              <Button variant="primary" size="md">
                {t("button.primary")}
              </Button>
              <Button variant="secondary" size="md">
                {t("button.secondary")}
              </Button>
              <Button variant="ghost" size="md">
                {t("button.ghost")}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 p-4">
              <Button variant="primary" size="sm">
                {t("button.small")}
              </Button>
              <Button variant="primary" size="md">
                {t("button.medium")}
              </Button>
              <Button variant="primary" size="lg">
                {t("button.large")}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 p-4">
              <Button variant="primary" size="md" disabled>
                {t("button.disabled")}
              </Button>
              <Button variant="primary" size="md" loading>
                {t("button.loading")}
              </Button>
            </div>
          </ComponentShowcase>

          {/* Card Component */}
          <ComponentShowcase title={t("card.title")} description={t("card.description")}>
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Card title={t("card.withTitle")}>
                <p>{t("card.content")}</p>
              </Card>
              <Card>
                <p>{t("card.withoutTitle")}</p>
              </Card>
            </div>
          </ComponentShowcase>

          {/* HighlightedText Component */}
          <ComponentShowcase
            title={t("highlightedText.title")}
            description={t("highlightedText.description")}
          >
            <div className="space-y-4 p-4">
              <p className="text-base">
                <HighlightedText text={t("highlightedText.example1")} highlight="highlighted" />
              </p>
              <p className="text-base">
                {t("highlightedText.example2")}{" "}
                <HighlightedText
                  text={t("highlightedText.highlighted")}
                  highlight={t("highlightedText.highlighted")}
                />
              </p>
            </div>
          </ComponentShowcase>

          {/* Modal Component */}
          <ComponentShowcase title={t("modal.title")} description={t("modal.description")}>
            <div className="flex flex-wrap gap-4 p-4">
              {/* Basic Modal */}
              <Button variant="primary" size="md" onClick={() => setIsBasicModalOpen(true)}>
                {t("modal.openButton")}
              </Button>
              <Modal
                isOpen={isBasicModalOpen}
                onClose={() => setIsBasicModalOpen(false)}
                title={t("modal.exampleTitle")}
              >
                <p>{t("modal.exampleContent")}</p>
              </Modal>

              {/* Confirmation Modal */}
              <Button variant="secondary" size="md" onClick={() => setIsConfirmModalOpen(true)}>
                Confirmation Modal
              </Button>
              <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirm Action"
              >
                <p className="mb-4">Are you sure you want to proceed with this action?</p>
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
                    Confirm
                  </Button>
                </div>
              </Modal>

              {/* Information Modal */}
              <Button variant="ghost" size="md" onClick={() => setIsInfoModalOpen(true)}>
                Info Modal
              </Button>
              <Modal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                title="Information"
              >
                <div className="space-y-3">
                  <p>This is an informational modal with multiple paragraphs.</p>
                  <p>It can contain any content you need to display to the user.</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Feature one</li>
                    <li>Feature two</li>
                    <li>Feature three</li>
                  </ul>
                </div>
              </Modal>

              {/* Form Modal */}
              <Button variant="primary" size="md" onClick={() => setIsFormModalOpen(true)}>
                Form Modal
              </Button>
              <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title="Contact Form"
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      id="modal-name"
                      type="text"
                      placeholder="Your name"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsFormModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setIsFormModalOpen(false)}>
                      Submit
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </ComponentShowcase>

          {/* LanguageSelector Component */}
          <ComponentShowcase
            title={t("languageSelector.title")}
            description={t("languageSelector.description")}
          >
            <div className="p-4">
              <LanguageSelector currentLocale={locale} />
            </div>
          </ComponentShowcase>

          {/* ThemeToggle Component */}
          <ComponentShowcase
            title={t("themeToggle.title")}
            description={t("themeToggle.description")}
          >
            <div className="p-4">
              <ThemeToggle />
            </div>
          </ComponentShowcase>
        </div>
      </div>
    </main>
  );
}
