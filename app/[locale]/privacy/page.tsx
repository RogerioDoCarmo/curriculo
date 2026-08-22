import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SUPPORTED_LOCALES } from "@/types/index";
import type { Metadata } from "next";

type Props = {
  readonly params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrivacyPolicyContent />;
}

function PrivacyPolicyContent() {
  const t = useTranslations("privacy");

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
        <p className="mb-4">{t("introduction.paragraph2")}</p>
      </section>

      {/* Data Collection */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("dataCollection.title")}</h2>
        <p className="mb-4">{t("dataCollection.intro")}</p>

        {/* Analytics Data */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{t("dataCollection.analytics.title")}</h3>
          <p className="mb-3 font-medium text-blue-600 dark:text-blue-400">
            {t("dataCollection.analytics.important")}
          </p>
          <p className="mb-3">{t("dataCollection.analytics.description")}</p>

          <h4 className="text-lg font-medium mb-2">
            {t("dataCollection.analytics.navigation.title")}
          </h4>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.analytics.navigation.pageViews")}</li>
            <li>{t("dataCollection.analytics.navigation.linkClicks")}</li>
            <li>{t("dataCollection.analytics.navigation.sectionNav")}</li>
            <li>{t("dataCollection.analytics.navigation.preferences")}</li>
          </ul>

          <h4 className="text-lg font-medium mb-2">{t("dataCollection.analytics.forms.title")}</h4>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.analytics.forms.fieldFocus")}</li>
            <li>{t("dataCollection.analytics.forms.validationErrors")}</li>
            <li>{t("dataCollection.analytics.forms.submissionEvents")}</li>
            <li>{t("dataCollection.analytics.forms.timing")}</li>
          </ul>

          <h4 className="text-lg font-medium mb-2">
            {t("dataCollection.analytics.engagement.title")}
          </h4>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.analytics.engagement.scrollDepth")}</li>
            <li>{t("dataCollection.analytics.engagement.timeOnPage")}</li>
            <li>{t("dataCollection.analytics.engagement.interactions")}</li>
          </ul>

          <h4 className="text-lg font-medium mb-2">
            {t("dataCollection.analytics.userPreferences.title")}
          </h4>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.analytics.userPreferences.theme")}</li>
            <li>{t("dataCollection.analytics.userPreferences.language")}</li>
            <li>{t("dataCollection.analytics.userPreferences.careerPath")}</li>
          </ul>

          <h4 className="text-lg font-medium mb-2">{t("dataCollection.analytics.errors.title")}</h4>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.analytics.errors.componentErrors")}</li>
            <li>{t("dataCollection.analytics.errors.apiFailures")}</li>
          </ul>
        </div>

        {/* Email Addresses */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{t("dataCollection.email.title")}</h3>
          <p className="mb-3">{t("dataCollection.email.description")}</p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.email.contactForm")}</li>
            <li>{t("dataCollection.email.subscription")}</li>
            <li>{t("dataCollection.email.storage")}</li>
          </ul>
        </div>

        {/* Notification Tokens */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{t("dataCollection.notifications.title")}</h3>
          <p className="mb-3">{t("dataCollection.notifications.description")}</p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.notifications.optIn")}</li>
            <li>{t("dataCollection.notifications.tokens")}</li>
            <li>{t("dataCollection.notifications.revoke")}</li>
          </ul>
        </div>

        {/* Browser Storage */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{t("dataCollection.browserStorage.title")}</h3>
          <p className="mb-3">{t("dataCollection.browserStorage.description")}</p>

          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
            <p className="mb-2 font-medium text-green-700 dark:text-green-300">
              🔑 {t("dataCollection.browserStorage.keyDifference")}
            </p>
            <p className="font-medium text-green-700 dark:text-green-300">
              ✅ {t("dataCollection.browserStorage.noConsentNeeded")}
            </p>
          </div>

          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li>{t("dataCollection.browserStorage.theme")}</li>
            <li>{t("dataCollection.browserStorage.language")}</li>
            <li>{t("dataCollection.browserStorage.consent")}</li>
            <li>{t("dataCollection.browserStorage.session")}</li>
            <li>{t("dataCollection.browserStorage.notifications")}</li>
            <li>{t("dataCollection.browserStorage.filterPulse")}</li>
          </ul>
        </div>
      </section>

      {/* Data Usage */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("dataUsage.title")}</h2>
        <p className="mb-4">{t("dataUsage.intro")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>
            <strong>{t("dataUsage.analytics.title")}:</strong>{" "}
            {t("dataUsage.analytics.description")}
          </li>
          <li>
            <strong>{t("dataUsage.communication.title")}:</strong>{" "}
            {t("dataUsage.communication.description")}
          </li>
          <li>
            <strong>{t("dataUsage.personalization.title")}:</strong>{" "}
            {t("dataUsage.personalization.description")}
          </li>
          <li>
            <strong>{t("dataUsage.improvement.title")}:</strong>{" "}
            {t("dataUsage.improvement.description")}
          </li>
        </ul>
      </section>

      {/* Data Storage */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("dataStorage.title")}</h2>
        <p className="mb-4">{t("dataStorage.intro")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>
            <strong>{t("dataStorage.firebase.title")}:</strong>{" "}
            {t("dataStorage.firebase.description")}
          </li>
          <li>
            <strong>{t("dataStorage.formspree.title")}:</strong>{" "}
            {t("dataStorage.formspree.description")}
          </li>
          <li>
            <strong>{t("dataStorage.sentry.title")}:</strong> {t("dataStorage.sentry.description")}
          </li>
          <li>
            <strong>{t("dataStorage.vercel.title")}:</strong> {t("dataStorage.vercel.description")}
          </li>
          <li>
            <strong>{t("dataStorage.localStorage.title")}:</strong>{" "}
            {t("dataStorage.localStorage.description")}
          </li>
        </ul>
      </section>

      {/* Data Sharing */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("dataSharing.title")}</h2>
        <p className="mb-4">{t("dataSharing.intro")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>
            <strong>{t("dataSharing.firebase.title")}:</strong>{" "}
            {t("dataSharing.firebase.description")}
          </li>
          <li>
            <strong>{t("dataSharing.formspree.title")}:</strong>{" "}
            {t("dataSharing.formspree.description")}
          </li>
          <li>
            <strong>{t("dataSharing.sentry.title")}:</strong> {t("dataSharing.sentry.description")}
          </li>
          <li>
            <strong>{t("dataSharing.vercel.title")}:</strong> {t("dataSharing.vercel.description")}
          </li>
        </ul>
        <p className="mt-4">{t("dataSharing.noSale")}</p>
      </section>

      {/* User Rights */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("userRights.title")}</h2>
        <p className="mb-4">{t("userRights.intro")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>
            <strong>{t("userRights.access.title")}:</strong> {t("userRights.access.description")}
          </li>
          <li>
            <strong>{t("userRights.deletion.title")}:</strong>{" "}
            {t("userRights.deletion.description")}
          </li>
          <li>
            <strong>{t("userRights.export.title")}:</strong> {t("userRights.export.description")}
          </li>
          <li>
            <strong>{t("userRights.correction.title")}:</strong>{" "}
            {t("userRights.correction.description")}
          </li>
          <li>
            <strong>{t("userRights.optOut.title")}:</strong> {t("userRights.optOut.description")}
          </li>
        </ul>
        <p className="mt-4">
          {t("userRights.contact")}{" "}
          <a
            href="mailto:contact@rogeriodocarmo.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            contact@rogeriodocarmo.com
          </a>
        </p>
      </section>

      {/* Cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("cookies.title")}</h2>
        <p className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
          <strong className="text-blue-700 dark:text-blue-300">⚠️</strong> {t("cookies.intro")}
        </p>
        <p className="mb-4">{t("cookies.localStorage")}</p>
        <p className="mb-4">
          {t("cookies.seeMore")}{" "}
          <a href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
            {t("cookies.cookiePolicyLink")}
          </a>
        </p>
      </section>

      {/* Analytics Opt-Out */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("analyticsOptOut.title")}</h2>
        <p className="mb-4">{t("analyticsOptOut.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("analyticsOptOut.cookieBanner")}</li>
          <li>{t("analyticsOptOut.browserSettings")}</li>
          <li>{t("analyticsOptOut.localStorage")}</li>
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

      {/* Compliance */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("compliance.title")}</h2>
        <p className="mb-4">{t("compliance.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>
            <strong>{t("compliance.gdpr.title")}:</strong> {t("compliance.gdpr.description")}
          </li>
          <li>
            <strong>{t("compliance.lgpd.title")}:</strong> {t("compliance.lgpd.description")}
          </li>
        </ul>
      </section>
    </main>
  );
}
