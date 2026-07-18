"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { DEFAULT_LOCALE, type SupportedLocale } from "@/types/index";
import { getStoredLocale, detectBrowserLocale } from "@/hooks/useLanguage";
// Rendered outside the [locale] segment (root layout is a passthrough), so
// this owns its own <html>/<body> and loads Tailwind directly, same as
// app/page.tsx.
import "./globals.css";

const TEXT: Record<
  SupportedLocale,
  { title: string; heading: string; message: string; cta: string }
> = {
  "pt-BR": {
    title: "Página não encontrada",
    heading: "Página não encontrada",
    message: "A página que você está procurando não existe ou foi movida.",
    cta: "Voltar para o início",
  },
  en: {
    title: "Page Not Found",
    heading: "Page not found",
    message: "The page you're looking for doesn't exist or has been moved.",
    cta: "Back to homepage",
  },
  es: {
    title: "Página no encontrada",
    heading: "Página no encontrada",
    message: "La página que buscas no existe o fue movida.",
    cta: "Volver al inicio",
  },
};

export default function NotFound() {
  // Seeded to the default locale so the first client render matches the
  // statically exported HTML exactly (no hydration mismatch), then swaps to
  // the visitor's stored/browser locale once mounted.
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocale(getStoredLocale() ?? detectBrowserLocale());
  }, []);

  const { title, heading, message, cta } = TEXT[locale];
  const homeHref = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Next.js auto-injects <meta name="robots" content="noindex" /> for
            the not-found route, so this only needs the title + theme init. */}
        <title>{title}</title>
        <script src="/theme-init.js" async />
      </head>
      <body className="bg-background text-foreground font-sans" suppressHydrationWarning>
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
          {/* Playful "broken image" placeholder — a self-drawn lucide icon
              (bundled, no external request, no copyright) tilted like a
              crooked photo frame. */}
          <div
            aria-hidden="true"
            className="bg-muted border-border animate-fade-in flex h-32 w-32 -rotate-6 items-center justify-center rounded-xl border-2 border-dashed shadow-sm"
          >
            <ImageOff className="text-muted-foreground h-14 w-14" strokeWidth={1.5} />
          </div>
          <p className="text-primary-600 dark:text-primary-400 mt-6 text-8xl font-bold">404</p>
          <h1 className="mt-8 text-2xl font-semibold">{heading}</h1>
          <p className="text-muted-foreground mt-2 max-w-md">{message}</p>
          <Link
            href={homeHref}
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 mt-8 inline-flex items-center justify-center rounded-md px-6 py-2.5 text-base font-medium text-white transition-colors duration-200"
          >
            {cta}
          </Link>
        </main>
      </body>
    </html>
  );
}
