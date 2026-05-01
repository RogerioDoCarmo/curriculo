import { setRequestLocale, getTranslations } from "next-intl/server";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import TechStackSection from "@/components/TechStackSection";

interface TechStackPageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: TechStackPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "techStack" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function TechStackPage({ params }: TechStackPageProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <TechStackSection />
    </main>
  );
}
