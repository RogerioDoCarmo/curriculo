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
  const t = await getTranslations({ locale, namespace: "terms" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TermsOfUsePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TermsOfUseContent />;
}

function TermsOfUseContent() {
  const t = useTranslations("terms");

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
        <p className="mb-4">{t("introduction.paragraph3")}</p>
      </section>

      {/* Acceptance of Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("acceptance.title")}</h2>
        <p className="mb-4">{t("acceptance.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("acceptance.browsing")}</li>
          <li>{t("acceptance.contactForm")}</li>
          <li>{t("acceptance.downloads")}</li>
          <li>{t("acceptance.interactions")}</li>
        </ul>
        <p className="mb-4">{t("acceptance.disagreement")}</p>
      </section>

      {/* Acceptable Use */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("acceptableUse.title")}</h2>
        <p className="mb-4">{t("acceptableUse.description")}</p>

        <h3 className="text-xl font-semibold mb-3">{t("acceptableUse.permitted.title")}</h3>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("acceptableUse.permitted.viewing")}</li>
          <li>{t("acceptableUse.permitted.contact")}</li>
          <li>{t("acceptableUse.permitted.sharing")}</li>
          <li>{t("acceptableUse.permitted.learning")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">{t("acceptableUse.prohibited.title")}</h3>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("acceptableUse.prohibited.scraping")}</li>
          <li>{t("acceptableUse.prohibited.hacking")}</li>
          <li>{t("acceptableUse.prohibited.spam")}</li>
          <li>{t("acceptableUse.prohibited.malware")}</li>
          <li>{t("acceptableUse.prohibited.impersonation")}</li>
          <li>{t("acceptableUse.prohibited.harassment")}</li>
          <li>{t("acceptableUse.prohibited.illegal")}</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("intellectualProperty.title")}</h2>
        <p className="mb-4">{t("intellectualProperty.description")}</p>

        <h3 className="text-xl font-semibold mb-3">{t("intellectualProperty.ownership.title")}</h3>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("intellectualProperty.ownership.content")}</li>
          <li>{t("intellectualProperty.ownership.design")}</li>
          <li>{t("intellectualProperty.ownership.code")}</li>
          <li>{t("intellectualProperty.ownership.trademarks")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">{t("intellectualProperty.license.title")}</h3>
        <p className="mb-4">{t("intellectualProperty.license.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("intellectualProperty.license.viewing")}</li>
          <li>{t("intellectualProperty.license.personal")}</li>
          <li>{t("intellectualProperty.license.sharing")}</li>
        </ul>

        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
          <p className="mb-2 font-medium text-blue-700 dark:text-blue-300">
            📄 {t("intellectualProperty.sourceCode.title")}
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            {t("intellectualProperty.sourceCode.description")}{" "}
            <a
              href="https://github.com/rogeriodocarmo/curriculo"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-800 dark:hover:text-blue-200"
            >
              {t("intellectualProperty.sourceCode.link")}
            </a>
          </p>
        </div>
      </section>

      {/* User Content */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("userContent.title")}</h2>
        <p className="mb-4">{t("userContent.description")}</p>

        <h3 className="text-xl font-semibold mb-3">{t("userContent.contactForm.title")}</h3>
        <p className="mb-4">{t("userContent.contactForm.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("userContent.contactForm.accurate")}</li>
          <li>{t("userContent.contactForm.respectful")}</li>
          <li>{t("userContent.contactForm.noSpam")}</li>
          <li>{t("userContent.contactForm.legal")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">{t("userContent.rights.title")}</h3>
        <p className="mb-4">{t("userContent.rights.description")}</p>
      </section>

      {/* Third-Party Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("thirdPartyLinks.title")}</h2>
        <p className="mb-4">{t("thirdPartyLinks.description")}</p>
        <p className="mb-4">{t("thirdPartyLinks.examples")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("thirdPartyLinks.github")}</li>
          <li>{t("thirdPartyLinks.linkedin")}</li>
          <li>{t("thirdPartyLinks.projects")}</li>
        </ul>
        <p className="mb-4">{t("thirdPartyLinks.disclaimer")}</p>
      </section>

      {/* Disclaimer of Warranties */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("disclaimer.title")}</h2>
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
          <p className="font-medium text-yellow-700 dark:text-yellow-300">
            ⚠️ {t("disclaimer.important")}
          </p>
        </div>
        <p className="mb-4">{t("disclaimer.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("disclaimer.asIs")}</li>
          <li>{t("disclaimer.noWarranty")}</li>
          <li>{t("disclaimer.accuracy")}</li>
          <li>{t("disclaimer.availability")}</li>
          <li>{t("disclaimer.errors")}</li>
        </ul>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("liability.title")}</h2>
        <p className="mb-4">{t("liability.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("liability.direct")}</li>
          <li>{t("liability.indirect")}</li>
          <li>{t("liability.dataLoss")}</li>
          <li>{t("liability.businessLoss")}</li>
          <li>{t("liability.thirdParty")}</li>
        </ul>
        <p className="mb-4">{t("liability.maximum")}</p>
      </section>

      {/* Indemnification */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("indemnification.title")}</h2>
        <p className="mb-4">{t("indemnification.description")}</p>
        <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
          <li>{t("indemnification.violations")}</li>
          <li>{t("indemnification.content")}</li>
          <li>{t("indemnification.infringement")}</li>
          <li>{t("indemnification.harm")}</li>
        </ul>
      </section>

      {/* Privacy and Data Protection */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("privacy.title")}</h2>
        <p className="mb-4">{t("privacy.description")}</p>
        <p className="mb-4">{t("privacy.hosting")}</p>
        <p className="mb-4">
          {t("privacy.seeMore")}{" "}
          <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            {t("privacy.privacyPolicyLink")}
          </a>{" "}
          {t("privacy.and")}{" "}
          <a href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">
            {t("privacy.cookiePolicyLink")}
          </a>
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("changes.title")}</h2>
        <p className="mb-4">{t("changes.description")}</p>
        <p className="mb-4">{t("changes.notification")}</p>
        <p className="mb-4">{t("changes.continued")}</p>
      </section>

      {/* Governing Law */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("governingLaw.title")}</h2>
        <p className="mb-4">{t("governingLaw.description")}</p>
        <p className="mb-4">{t("governingLaw.jurisdiction")}</p>
      </section>

      {/* Severability */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("severability.title")}</h2>
        <p className="mb-4">{t("severability.description")}</p>
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

      {/* Acknowledgment */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("acknowledgment.title")}</h2>
        <p className="mb-4">{t("acknowledgment.description")}</p>
      </section>
    </main>
  );
}
