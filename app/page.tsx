"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE } from "@/types/index";
import { getStoredLocale } from "@/hooks/useLanguage";
// Load Tailwind on this standalone redirect page so utility classes apply
// (it renders its own <html>/<body> outside the locale layout).
import "./globals.css";

// The root URL (https://rogeriodocarmo.com) is the canonical that gets shared.
// It's a tiny static page that client-redirects to the default locale, so it's
// served as a small 200 — unlike the large localized pages, which Vercel serves
// with a 206 Partial Content for crawler Range requests (LinkedIn then reads only
// the first KB and misses the Open Graph tags). Rendering the OG tags here gives
// social crawlers a reliable, fully-readable preview without following the JS
// redirect into a localized page.
const SITE_URL = "https://rogeriodocarmo.com";
const TITLE = "Rogério do Carmo | Desenvolvedor React Native Mobile";
const DESCRIPTION =
  "Portifólio e currículo de Rogério do Carmo, especialista em desenvolvimento de aplicações mobile multiplataforma com React Native.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const AUTHOR = "Rogério Ramos Rodrigues do Carmo";
// When the site was first published (project inception). ISO 8601 for crawlers.
const PUBLISHED_TIME = "2026-03-31T00:00:00Z";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Honor a returning visitor's previously chosen language (localStorage
    // persists across tab close/reopen; there's no cookie or middleware in
    // this statically-exported site to do that redirect server-side).
    router.replace(`/${getStoredLocale() ?? DEFAULT_LOCALE}`);
  }, [router]);

  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="author" content={AUTHOR} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta property="article:author" content={AUTHOR} />
        <meta property="article:published_time" content={PUBLISHED_TIME} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rogério do Carmo" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
      </head>
      <body suppressHydrationWarning>
        <div className="p-8 text-center">
          <p>Redirecting…</p>
        </div>
      </body>
    </html>
  );
}
