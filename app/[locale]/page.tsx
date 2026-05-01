import { setRequestLocale, getTranslations } from "next-intl/server";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import { LazyTechStackSection } from "@/lib/lazy-components";
import { getExperiences, getProjects, getSkills } from "@/lib/content";
import HomePageContent from "./HomePageContent";

interface HomePageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations("homepage");
  const heroT = await getTranslations("hero");

  // Load all content
  const [experiences, projects, skills] = await Promise.all([
    getExperiences(),
    getProjects(),
    getSkills(),
  ]);

  return (
    <HomePageContent
      locale={locale}
      heroTitle={t("hero.title")}
      heroGreeting={heroT("greeting")}
      heroCtaText={heroT("cta")}
      heroContactText={t("contact.title")}
      contactTitle={t("contact.title")}
      contactSubtitle={t("contact.subtitle")}
      experiences={experiences}
      projects={projects}
      skills={skills}
    />
  );
}
