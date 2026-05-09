import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SUPPORTED_LOCALES } from "@/types/index";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookies" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CookiePolicyContent />;
}

function CookiePolicyContent() {
  const t = useTranslations("cookies");

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t("title")}</h1>

      {/* Last Updated */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        {t("lastUpdated")}: {t("lastUpdatedDate")}
      </p>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("introduction.title")}</h2>
        <p className="mb-4">{t("introduction.paragraph1")}</p>
        <p className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
          <strong className="text-blue-700 dark:text-blue-300">⚠️ Important:</strong>{" "}
          {t("introduction.paragraph2")}
        </p>
      </section>

      {/* What Are Cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("whatAreCookies.title")}</h2>
        <p className="mb-4">{t("whatAreCookies.description")}</p>
        <p className="mb-4">{t("whatAreCookies.purpose")}</p>
      </section>

      {/* Cookies vs localStorage */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("cookiesVsLocalStorage.title")}</h2>
        <p className="mb-4">{t("cookiesVsLocalStorage.intro")}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-4">
          {/* Cookies */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-amber-700 dark:text-amber-300">
              {t("cookiesVsLocalStorage.cookies.title")}
            </h3>
            <p>{t("cookiesVsLocalStorage.cookies.description")}</p>
          </div>

          {/* localStorage */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-300">
              {t("cookiesVsLocalStorage.localStorage.title")}
            </h3>
            <p>{t("cookiesVsLocalStorage.localStorage.description")}</p>
          </div>
        </div>

        <p className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-medium">
          🔑 {t("cookiesVsLocalStorage.keyDifference")}
        </p>
      </section>

      {/* Actual Cookies Used */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("actualCookies.title")}</h2>
        <p className="mb-4">{t("actualCookies.intro")}</p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{t("actualCookies.analytics.title")}</h3>
          <p className="mb-3">{t("actualCookies.analytics.description")}</p>
          <p className="mb-3 font-medium text-amber-600 dark:text-amber-400">
            {t("actualCookies.analytics.nonEssential")}
          </p>
          <p className="mb-3">{t("actualCookies.analytics.purpose")}</p>
          <p className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded font-medium text-green-700 dark:text-green-300">
            ✅ {t("actualCookies.analytics.ifRejected")}
          </p>
        </div>
      </section>

      {/* Cookie List */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("cookieList.title")}</h2>
        <p className="mb-4">{t("cookieList.intro")}</p>

        {/* Firebase Analytics Cookies */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{t("cookieList.firebaseAnalytics.title")}</h3>
          <p className="mb-3 font-medium text-amber-600 dark:text-amber-400">
            {t("cookieList.firebaseAnalytics.category")}
          </p>
          <p className="mb-4">{t("cookieList.firebaseAnalytics.purpose")}</p>

          {/* _ga Cookie */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-lg font-medium mb-2">
              {t("cookieList.firebaseAnalytics.cookies.ga.name")}
            </h4>
            <p className="mb-2">
              <strong>{t("cookieList.firebaseAnalytics.cookies.ga.purposeLabel")}:</strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.ga.purpose")}
            </p>
            <p className="mb-2">
              <strong>{t("cookieList.firebaseAnalytics.cookies.ga.expirationLabel")}:</strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.ga.expiration")}
            </p>
          </div>

          {/* _ga_<container-id> Cookie */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-lg font-medium mb-2">
              {t("cookieList.firebaseAnalytics.cookies.gaContainer.name")}
            </h4>
            <p className="mb-2">
              <strong>{t("cookieList.firebaseAnalytics.cookies.gaContainer.purposeLabel")}:</strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.gaContainer.purpose")}
            </p>
            <p className="mb-2">
              <strong>
                {t("cookieList.firebaseAnalytics.cookies.gaContainer.expirationLabel")}:
              </strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.gaContainer.expiration")}
            </p>
          </div>

          {/* _gid Cookie */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-lg font-medium mb-2">
              {t("cookieList.firebaseAnalytics.cookies.gid.name")}
            </h4>
            <p className="mb-2">
              <strong>{t("cookieList.firebaseAnalytics.cookies.gid.purposeLabel")}:</strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.gid.purpose")}
            </p>
            <p className="mb-2">
              <strong>{t("cookieList.firebaseAnalytics.cookies.gid.expirationLabel")}:</strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.gid.expiration")}
            </p>
          </div>

          {/* _gat Cookie */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-lg font-medium mb-2">
              {t("cookieList.firebaseAnalytics.cookies.gat.name")}
            </h4>
            <p className="mb-2">
              <strong>{t("cookieList.firebaseAnalytics.cookies.gat.purposeLabel")}:</strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.gat.purpose")}
            </p>
            <p className="mb-2">
              <strong>{t("cookieList.firebaseAnalytics.cookies.gat.expirationLabel")}:</strong>{" "}
              {t("cookieList.firebaseAnalytics.cookies.gat.expiration")}
            </p>
          </div>
        </div>
      </section>

      {/* Browser Storage (localStorage) */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("browserStorage.title")}</h2>
        <p className="mb-4">{t("browserStorage.intro")}</p>

        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
          <p className="mb-2 font-medium text-green-700 dark:text-green-300">
            🔑 {t("browserStorage.keyDifference")}
          </p>
          <p className="font-medium text-green-700 dark:text-green-300">
            ✅ {t("browserStorage.noConsentNeeded")}
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-3">{t("browserStorage.whatWeStore")}</h3>

        {/* Theme */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-lg font-medium mb-2">{t("browserStorage.items.theme.name")}</h4>
          <p>{t("browserStorage.items.theme.purpose")}</p>
        </div>

        {/* Language */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-lg font-medium mb-2">{t("browserStorage.items.language.name")}</h4>
          <p>{t("browserStorage.items.language.purpose")}</p>
        </div>

        {/* Consent */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-lg font-medium mb-2">{t("browserStorage.items.consent.name")}</h4>
          <p>{t("browserStorage.items.consent.purpose")}</p>
        </div>

        {/* Preferences */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-lg font-medium mb-2">{t("browserStorage.items.preferences.name")}</h4>
          <p>{t("browserStorage.items.preferences.purpose")}</p>
        </div>

        {/* Notifications */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-lg font-medium mb-2">
            {t("browserStorage.items.notifications.name")}
          </h4>
          <p>{t("browserStorage.items.notifications.purpose")}</p>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t("browserStorage.howToManage")}
        </p>
      </section>

      {/* How to Manage Cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("manageCookies.title")}</h2>
        <p className="mb-4">{t("manageCookies.intro")}</p>

        {/* Chrome */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">{t("manageCookies.chrome.title")}</h3>
          <ol className="list-decimal list-inside mb-4 ml-4 space-y-1">
            <li>{t("manageCookies.chrome.step1")}</li>
            <li>{t("manageCookies.chrome.step2")}</li>
            <li>{t("manageCookies.chrome.step3")}</li>
            <li>{t("manageCookies.chrome.step4")}</li>
          </ol>
        </div>

        {/* Firefox */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">{t("manageCookies.firefox.title")}</h3>
          <ol className="list-decimal list-inside mb-4 ml-4 space-y-1">
            <li>{t("manageCookies.firefox.step1")}</li>
            <li>{t("manageCookies.firefox.step2")}</li>
            <li>{t("manageCookies.firefox.step3")}</li>
            <li>{t("manageCookies.firefox.step4")}</li>
          </ol>
        </div>

        {/* Safari */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">{t("manageCookies.safari.title")}</h3>
          <ol className="list-decimal list-inside mb-4 ml-4 space-y-1">
            <li>{t("manageCookies.safari.step1")}</li>
            <li>{t("manageCookies.safari.step2")}</li>
            <li>{t("manageCookies.safari.step3")}</li>
            <li>{t("manageCookies.safari.step4")}</li>
          </ol>
        </div>

        {/* Edge */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">{t("manageCookies.edge.title")}</h3>
          <ol className="list-decimal list-inside mb-4 ml-4 space-y-1">
            <li>{t("manageCookies.edge.step1")}</li>
            <li>{t("manageCookies.edge.step2")}</li>
            <li>{t("manageCookies.edge.step3")}</li>
            <li>{t("manageCookies.edge.step4")}</li>
          </ol>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("thirdPartyCookies.title")}</h2>
        <p className="mb-4">{t("thirdPartyCookies.intro")}</p>

        {/* Firebase Analytics */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">
            {t("thirdPartyCookies.firebaseAnalytics.title")}
          </h3>
          <p className="mb-3">{t("thirdPartyCookies.firebaseAnalytics.description")}</p>
          <p className="mb-2">
            <strong>{t("thirdPartyCookies.firebaseAnalytics.providerLabel")}:</strong>{" "}
            {t("thirdPartyCookies.firebaseAnalytics.provider")}
          </p>
          <p className="mb-2">
            <strong>{t("thirdPartyCookies.firebaseAnalytics.purposeLabel")}:</strong>{" "}
            {t("thirdPartyCookies.firebaseAnalytics.purpose")}
          </p>
          <p className="mb-2">
            <strong>{t("thirdPartyCookies.firebaseAnalytics.privacyPolicyLabel")}:</strong>{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t("thirdPartyCookies.firebaseAnalytics.privacyPolicyLink")}
            </a>
          </p>
        </div>
      </section>

      {/* Cookie Consent */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("cookieConsent.title")}</h2>
        <p className="mb-4">{t("cookieConsent.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>
            <strong>{t("cookieConsent.acceptAll.title")}:</strong>{" "}
            {t("cookieConsent.acceptAll.description")}
          </li>
          <li>
            <strong>{t("cookieConsent.rejectAll.title")}:</strong>{" "}
            {t("cookieConsent.rejectAll.description")}
          </li>
          <li>
            <strong>{t("cookieConsent.customize.title")}:</strong>{" "}
            {t("cookieConsent.customize.description")}
          </li>
        </ul>
        <p className="mt-4">{t("cookieConsent.changePreferences")}</p>
      </section>

      {/* Analytics Opt-Out */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("analyticsOptOut.title")}</h2>
        <p className="mb-4">{t("analyticsOptOut.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("analyticsOptOut.cookieBanner")}</li>
          <li>{t("analyticsOptOut.browserSettings")}</li>
          <li>
            {t("analyticsOptOut.googleOptOut")}{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t("analyticsOptOut.googleOptOutLink")}
            </a>
          </li>
        </ul>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
        <p className="mb-4">{t("contact.description")}</p>
        <p className="mb-2">
          <strong>{t("contact.email")}:</strong>{" "}
          <a
            href="mailto:contact@rogeriodocarmo.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            contact@rogeriodocarmo.com
          </a>
        </p>
        <p className="mb-2">
          <strong>{t("contact.website")}:</strong>{" "}
          <a
            href="https://rogeriodocarmo.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            https://rogeriodocarmo.com
          </a>
        </p>
      </section>

      {/* Policy Updates */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("policyUpdates.title")}</h2>
        <p className="mb-4">{t("policyUpdates.description")}</p>
        <p className="mb-4">{t("policyUpdates.notification")}</p>
      </section>

      {/* More Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("moreInformation.title")}</h2>
        <p className="mb-4">
          {t("moreInformation.description")}{" "}
          <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            {t("moreInformation.privacyPolicyLink")}
          </a>
        </p>
      </section>
    </main>
  );
}
