import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import { LazyExitIntentModal, LazyTechStackSection } from "@/lib/lazy-components";
import { getExperiences, getProjects, getSkills } from "@/lib/content";
import Hero from "@/components/Hero";
import CareerPathSelector from "@/components/CareerPathSelector";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactForm from "@/components/ContactForm";
import BackToTopButton from "@/components/BackToTopButton";

interface HomePageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface HomePageContentProps {
  readonly locale: string;
}

async function HomePageContent({ locale }: HomePageContentProps) {
  const t = useTranslations("homepage");

  // Load all content
  const [experiences, projects, skills] = await Promise.all([
    getExperiences(),
    getProjects(),
    getSkills(),
  ]);

  return (
    <>
      {/* Hero Section with Profile Photo */}
      <Hero name="Rogério do Carmo" title={t("hero.title")} locale={locale} />

      {/* Career Path Selector (Professional/Academic) */}
      <CareerPathSelector />

      {/* Experience Section with Timeline */}
      <ExperienceSection careerPath="professional" experiences={experiences} locale={locale} />

      {/* Skills Section */}
      <SkillsSection skills={skills} locale={locale} />

      {/* Projects Portfolio Section */}
      <ProjectsSection projects={projects} locale={locale} />

      {/* Tech Stack Section - Lazy loaded for code splitting */}
      <LazyTechStackSection />

      {/* Contact Form Section */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="contact-title" className="text-3xl font-bold text-center mb-8">
            {t("contact.title")}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            {t("contact.subtitle")}
          </p>
          <ContactForm />
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Exit Intent Modal - Lazy loaded, client-side only */}
      <LazyExitIntentModal
        enabled={true}
        locale={locale}
        linkedInUrl="https://www.linkedin.com/in/rogeriodocarmo/"
        githubUrl="https://github.com/RogerioDoCarmo/curriculo"
      />
    </>
  );
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  return <HomePageContent locale={locale} />;
}
