import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import ComponentShowcase from "@/components/ComponentShowcase";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import HighlightedText from "@/components/HighlightedText";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";

interface ComponentGalleryPageProps {
  readonly params: Promise<{ locale: string }>;
}

// Generate static params for all locales
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ComponentGalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ComponentGallery" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ComponentGalleryPage({ params }: ComponentGalleryPageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  const t = await getTranslations("ComponentGallery");

  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">{t("heading")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t("subheading")}</p>
        </header>

        {/* Component Showcases */}
        <div className="space-y-16">
          {/* Button Component */}
          <ComponentShowcase title={t("button.title")} description={t("button.description")}>
            <div className="flex flex-wrap gap-4 p-4">
              <Button variant="primary">{t("button.primary")}</Button>
              <Button variant="secondary">{t("button.secondary")}</Button>
              <Button variant="ghost">{t("button.ghost")}</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 p-4">
              <Button variant="primary" size="small">
                {t("button.small")}
              </Button>
              <Button variant="primary" size="medium">
                {t("button.medium")}
              </Button>
              <Button variant="primary" size="large">
                {t("button.large")}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 p-4">
              <Button variant="primary" disabled>
                {t("button.disabled")}
              </Button>
              <Button variant="primary" loading>
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
                <HighlightedText>{t("highlightedText.example1")}</HighlightedText>
              </p>
              <p className="text-base">
                {t("highlightedText.example2")}{" "}
                <HighlightedText>
                  <strong>{t("highlightedText.highlighted")}</strong>
                </HighlightedText>
              </p>
            </div>
          </ComponentShowcase>

          {/* Modal Component */}
          <ComponentShowcase title={t("modal.title")} description={t("modal.description")}>
            <div className="flex flex-wrap gap-4 p-4">
              {/* Basic Modal */}
              <Modal
                trigger={
                  <Button variant="primary" size="md">
                    {t("modal.openButton")}
                  </Button>
                }
                title={t("modal.exampleTitle")}
              >
                <p>{t("modal.exampleContent")}</p>
              </Modal>

              {/* Confirmation Modal */}
              <Modal
                trigger={
                  <Button variant="secondary" size="md">
                    Confirmation Modal
                  </Button>
                }
                title="Confirm Action"
              >
                <p className="mb-4">Are you sure you want to proceed with this action?</p>
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm">
                    Confirm
                  </Button>
                </div>
              </Modal>

              {/* Information Modal */}
              <Modal
                trigger={
                  <Button variant="ghost" size="md">
                    Info Modal
                  </Button>
                }
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
              <Modal
                trigger={
                  <Button variant="primary" size="md">
                    Form Modal
                  </Button>
                }
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
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm">
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
              <LanguageSelector currentLocale={locale as SupportedLocale} />
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
