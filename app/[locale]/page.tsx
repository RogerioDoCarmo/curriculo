import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import { LazyExitIntentModal, LazyTechStackSection } from "@/lib/lazy-components";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";

interface HomePageProps {
  readonly params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

function HomePageContent() {
  const t = useTranslations("homepage");

  return (
    <>
      <article className="flex min-h-screen flex-col items-center justify-center p-8">
        <header>
          <h1 className="text-4xl font-bold text-center">{t("title")}</h1>
        </header>
        <section className="mt-4">
          <p className="text-muted-foreground text-center">{t("description")}</p>
        </section>
      </article>

      {/* Tech Stack Section - Lazy loaded for code splitting */}
      <LazyTechStackSection />

      {/* Email capture section at the bottom of the page */}
      <section
        id="stay-in-touch"
        aria-labelledby="stay-in-touch-title"
        className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border"
      >
        <div className="mx-auto max-w-md text-center">
          <h2 id="stay-in-touch-title" className="text-2xl font-bold text-foreground mb-2">
            {t("stayInTouch.title")}
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">{t("stayInTouch.subtitle")}</p>
          <EmailSubscribeForm
            placeholder={t("stayInTouch.placeholder")}
            buttonLabel={t("stayInTouch.buttonLabel")}
            successMessage={t("stayInTouch.successMessage")}
            showMessage={true}
            messagePlaceholder={t("stayInTouch.messagePlaceholder")}
          />
        </div>
      </section>

      {/* Exit Intent Modal - Lazy loaded, client-side only */}
      <LazyExitIntentModal
        enabled={true}
        resumeUrl="/resume.pdf"
        linkedInUrl="https://www.linkedin.com/in/rogeriodocarmo/"
        githubUrl="https://github.com/RogerioDoCarmo/curriculo"
      />
    </>
  );
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  unstable_setRequestLocale(locale);

  return <HomePageContent />;
}
