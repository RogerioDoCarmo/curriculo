import { setRequestLocale, getTranslations } from "next-intl/server";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content";
import ProjectsPage from "@/components/ProjectsPage";

interface ProjectsRouteProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ProjectsRouteProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  };
}

export default async function ProjectsRoute({ params }: ProjectsRouteProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  const projects = await getProjects(locale);

  return (
    <main className="min-h-screen">
      <ProjectsPage projects={projects} locale={locale} />
    </main>
  );
}
