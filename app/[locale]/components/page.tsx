import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";
import ComponentGalleryClient from "./ComponentGalleryClient";

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

  return <ComponentGalleryClient locale={locale as SupportedLocale} />;
}
