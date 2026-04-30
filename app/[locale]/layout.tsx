import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";
import { ThemeProvider } from "@/hooks/useTheme";
import { generateStructuredDataScript } from "@/lib/structured-data";
import "../globals.css";
import "../../styles/print.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ─── Locale-specific metadata config ─────────────────────────────────────────

const SITE_URL = "https://rogeriodocarmo.com";

const metadataByLocale: Record<
  SupportedLocale,
  { title: string; description: string; keywords: string[] }
> = {
  "pt-BR": {
    title: "Rogério do Carmo | Desenvolvedor React Native Mobile",
    description:
      "Portifólio e currículo de Rogério do Carmo, especialista em desenvolvimento de aplicações mobile multiplataforma com React Native.",
    keywords: [
      "React Native",
      "React",
      "React JS",
      "Java",
      "Kotlin",
      "Desenvolvedor Mobile",
      "TypeScript",
      "JavaScript",
      "iOS",
      "Android",
      "Portfólio",
      "Currículo",
      "Desenvolvedor Frontend",
    ],
  },
  en: {
    title: "Rogério do Carmo | Mobile React Native Developer",
    description:
      "Portfolio and resume of Rogério do Carmo, specialist in cross-platform mobile application development with React Native.",
    keywords: [
      "React Native",
      "React",
      "React JS",
      "Java",
      "Kotlin",
      "Mobile Developer",
      "TypeScript",
      "JavaScript",
      "iOS",
      "Android",
      "Portfolio",
      "Resume",
      "Frontend Developer",
    ],
  },
  es: {
    title: "Rogério do Carmo | Desarrollador React Native Mobile",
    description:
      "Portafolio y currículum de Rogério do Carmo, especialista en desarrollo de aplicaciones móviles multiplataforma con React Native.",
    keywords: [
      "React Native",
      "React",
      "React JS",
      "Java",
      "Kotlin",
      "Desarrollador Mobile",
      "TypeScript",
      "JavaScript",
      "iOS",
      "Android",
      "Portafolio",
      "Currículum",
      "Desarrollador Frontend",
    ],
  },
};

// ─── Dynamic metadata generation ─────────────────────────────────────────────

interface GenerateMetadataProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { locale } = await params;

  const safeLocale = SUPPORTED_LOCALES.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : "pt-BR";

  const { title, description, keywords } = metadataByLocale[safeLocale];
  const canonicalUrl = safeLocale === "pt-BR" ? SITE_URL : `${SITE_URL}/${safeLocale}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Rogério do Carmo", url: SITE_URL }],
    creator: "Rogério do Carmo",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "pt-BR": SITE_URL,
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: "Rogério do Carmo",
      locale: safeLocale,
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== safeLocale),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@rogeriodocarmo",
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

/** Generate static params for all supported locales. */
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = await getMessages();

  // Generate structured data for SEO
  const { personSchema, webSiteSchema } = generateStructuredDataScript(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Schema.org structured data for Person */}
        {/* SECURITY: JSON.stringify() automatically escapes special characters, preventing XSS.
            The data comes from a controlled source (generateStructuredDataScript) with no user input. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
        {/* Schema.org structured data for WebSite */}
        {/* SECURITY: JSON.stringify() automatically escapes special characters, preventing XSS.
            The data comes from a controlled source (generateStructuredDataScript) with no user input. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: webSiteSchema }} />
      </head>
      <body
        className={`${inter.variable} font-sans bg-background text-foreground`}
        suppressHydrationWarning
      >
        {/* FOUC prevention: apply theme before React hydration */}
        {/* SECURITY: This inline script is safe - it only reads from localStorage and applies a CSS class.
            No user input is involved. The script is static and controlled by the application. */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      if (saved === 'dark') document.documentElement.classList.add('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
            `.trim(),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
