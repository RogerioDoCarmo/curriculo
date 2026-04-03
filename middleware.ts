import createMiddleware from "next-intl/middleware";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/types/index";

export default createMiddleware({
  // All supported locales
  locales: SUPPORTED_LOCALES,

  // Default locale — no prefix in URL for pt-BR
  defaultLocale: DEFAULT_LOCALE,

  // Don't add locale prefix for the default locale
  localePrefix: "as-needed",
});

export const config = {
  // Match all pathnames except for static files, api routes, and Next.js internals
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
