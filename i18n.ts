import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@/types/index";

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the request
  const locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
