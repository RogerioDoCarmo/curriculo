import { unstable_setRequestLocale } from "next-intl/server";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { notFound } from "next/navigation";

interface HomePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-center">Personal Resume Website</h1>
      <p className="mt-4 text-muted-foreground text-center">
        A modern, responsive personal resume website built with Next.js 14, TypeScript, and Tailwind
        CSS.
      </p>
    </div>
  );
}
