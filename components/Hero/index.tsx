"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { trackHeroCTAClick, trackExternalLinkClick, trackFooterLinkClick } from "@/lib/analytics";

interface HeroProps {
  readonly name: string;
  readonly title: string;
  readonly greeting: string;
  readonly ctaText: string;
  readonly contactText: string;
}

/** Picks the string for the current locale, defaulting to English. */
function localize(locale: string, strings: { ptBR: string; es: string; en: string }): string {
  if (locale === "pt-BR") return strings.ptBR;
  if (locale === "es") return strings.es;
  return strings.en;
}

export default function Hero({ name, title, greeting, ctaText, contactText }: HeroProps) {
  // Use useLocale hook to get current locale reactively (updates on language change)
  const currentLocale = useLocale();

  // Get locale-specific email
  const email =
    currentLocale === "pt-BR" ? "contato@rogeriodocarmo.com" : "contact@rogeriodocarmo.com";

  const downloadDissertationLabel = localize(currentLocale, {
    ptBR: "Baixar Dissertação (PDF)",
    es: "Descargar Disertación (PDF)",
    en: "Download Dissertation (PDF)",
  });

  return (
    <section
      id="home"
      tabIndex={-1}
      aria-label="Hero section"
      className="flex min-h-[80vh] items-center justify-center px-4 py-16 md:px-8 lg:px-16"
    >
      <div className="animate-fade-in flex flex-col-reverse items-center gap-8 md:flex-row-reverse md:justify-between md:gap-10 w-full max-w-5xl">
        {/* Text content */}
        <div className="text-center md:text-left md:flex-1">
          <p className="mb-2 text-lg font-medium text-primary-600 dark:text-primary-400">
            {greeting}
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
            {name}
          </h1>
          <p className="mb-2 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">{title}</p>

          {/* Education Section */}
          <div className="mb-4 flex items-center justify-center md:justify-start gap-4">
            <a
              href="https://www2.unesp.br/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackExternalLinkClick({
                  url: "https://www2.unesp.br/",
                  context: "hero_unesp_logo",
                })
              }
              aria-label="UNESP - Universidade Estadual Paulista"
              className="transition-opacity hover:opacity-80 dark:rounded-lg dark:bg-white dark:p-2 dark:shadow-sm"
            >
              <Image
                src="/images/logos/logo_unesp.png"
                alt="UNESP Logo"
                width={1280}
                height={427}
                priority
                className="rounded w-31.25 h-auto"
              />
            </a>
            <div className="text-left">
              <a
                href="https://www.fct.unesp.br/#!/graduacao/ciencia-da-computacao/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick({
                    url: "https://www.fct.unesp.br/#!/graduacao/ciencia-da-computacao/",
                    context: "hero_bachelor_degree",
                  })
                }
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {localize(currentLocale, {
                  ptBR: "Bacharel em Ciência da Computação",
                  es: "Licenciado en Ciencias de la Computación",
                  en: "Bachelor in Computer Science",
                })}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">UNESP - 2018</p>
              <a
                href="https://www.fct.unesp.br/#!/pos-graduacao/--ciencias-cartograficas/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick({
                    url: "https://www.fct.unesp.br/#!/pos-graduacao/--ciencias-cartograficas/",
                    context: "hero_master_degree",
                  })
                }
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
              >
                {localize(currentLocale, {
                  ptBR: "Mestre em Ciências Cartográficas",
                  es: "Máster en Ciencias Cartográficas",
                  en: "Master in Cartographic Sciences",
                })}
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400">UNESP - 2023</p>
            </div>
          </div>

          {/* Dissertation Section */}
          <div className="mb-6">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 text-center md:text-left">
              {localize(currentLocale, {
                ptBR: "Dissertação de mestrado completa:",
                es: "Disertación de maestría completa:",
                en: "Complete master's dissertation:",
              })}
            </p>
            <div className="flex items-center justify-center md:justify-start mb-2">
              {/* Note: hdl.handle.net institutional repository only supports HTTP protocol */}
              <a
                href="http://hdl.handle.net/11449/243430"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick({
                    url: "http://hdl.handle.net/11449/243430",
                    context: "hero_dissertation_link",
                  })
                }
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {localize(currentLocale, {
                  ptBR: "Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android",
                  es: "Evaluación de la calidad de las medidas y posicionamiento GNSS en smartphones Android",
                  en: "Evaluation of GNSS measurement quality and positioning in Android smartphones",
                })}
              </a>
            </div>
            {/* Download Dissertation Button */}
            <div className="flex items-center justify-center md:justify-start">
              <a
                href="/academic/masters_degree_dissertation_rogerio_do_carmo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackFooterLinkClick({
                    link_text: downloadDissertationLabel,
                    link_url: "/academic/masters_degree_dissertation_rogerio_do_carmo.pdf",
                    link_type: "dissertation_download",
                  })
                }
                aria-label={localize(currentLocale, {
                  ptBR: "Baixar dissertação de mestrado em PDF",
                  es: "Descargar disertación de maestría en PDF",
                  en: "Download master's dissertation in PDF",
                })}
                className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{downloadDissertationLabel}</span>
              </a>
            </div>
          </div>

          {/* Current Job Section */}
          <div className="mb-8 flex items-center justify-center md:justify-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <a
              href="https://www.topazevolution.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackExternalLinkClick({
                  url: "https://www.topazevolution.com/",
                  context: "hero_topaz_logo",
                })
              }
              aria-label="Topaz Evolution"
              className="transition-opacity hover:opacity-80 dark:rounded-lg dark:bg-white dark:p-2 dark:shadow-sm"
            >
              <Image
                src="/images/logos/logo_topaz.svg"
                alt="Company Logo"
                width={678}
                height={235}
                className="w-50 h-auto"
                priority
              />
            </a>
            <div className="text-left">
              <a
                href="https://www.topazevolution.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick({
                    url: "https://www.topazevolution.com/",
                    context: "hero_topaz_text",
                  })
                }
                className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {localize(currentLocale, {
                  ptBR: "Desenvolvedor Mobile Sênior",
                  es: "Desarrollador Mobile Senior",
                  en: "Senior Mobile Developer",
                })}
              </a>
              <a
                href="https://www.topazevolution.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackExternalLinkClick({
                    url: "https://www.topazevolution.com/",
                    context: "hero_topaz_date",
                  })
                }
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
              >
                {localize(currentLocale, {
                  ptBR: "2023 - 2026 (3 anos)",
                  es: "2023 - 2026 (3 años)",
                  en: "2023 - 2026 (3 years)",
                })}
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start md:items-start">
            <a
              href="#projects"
              onClick={() =>
                trackHeroCTAClick({
                  cta_text: ctaText,
                  cta_action: "view_projects",
                })
              }
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-lg font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              {ctaText}
            </a>
            <a
              href={`mailto:${email}`}
              onClick={() =>
                trackHeroCTAClick({
                  cta_text: contactText,
                  cta_action: "contact_email",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary-600 px-6 py-3 text-lg font-medium text-primary-600 transition-colors duration-200 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
              {contactText}
            </a>
          </div>
          {/* Professional Email Display */}
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <a
              href={`mailto:${email}`}
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {email}
            </a>
          </p>
        </div>

        {/* Profile photo */}
        <div className="shrink-0">
          <div className="relative h-40 w-40 min-h-40 min-w-40 sm:h-44 sm:w-44 md:h-48 md:w-48">
            <Image
              src="/images/profile/rogeriodocarmo.png"
              alt="Rogério do Carmo — Mobile React Native Developer"
              fill
              sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 192px"
              className="rounded-lg object-cover object-top shadow-xl ring-4 ring-primary-500 dark:ring-primary-800"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
