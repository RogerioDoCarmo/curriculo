"use client";

import Image from "next/image";

interface HeroProps {
  readonly name: string;
  readonly title: string;
  readonly locale: string;
  readonly greeting: string;
  readonly ctaText: string;
  readonly contactText: string;
}

export default function Hero({ name, title, locale, greeting, ctaText, contactText }: HeroProps) {
  // Get locale-specific email
  const email = locale === "pt-BR" ? "contato@rogeriodocarmo.com" : "contact@rogeriodocarmo.com";

  return (
    <section
      id="home"
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
          <p className="mb-4 text-xl text-gray-600 dark:text-gray-300 sm:text-2xl">{title}</p>

          {/* Education Section */}
          <div className="mb-4 flex items-center justify-center md:justify-start gap-4">
            <Image
              src="/images/logos/logo_unesp.png"
              alt="UNESP Logo"
              width={125}
              height={125}
              style={{ width: "125px", height: "auto" }}
              className="rounded"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {locale === "pt-BR"
                  ? "Bacharel em Ciência da Computação"
                  : "Bachelor in Computer Science"}
              </p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {locale === "pt-BR"
                  ? "Mestre em Ciências Cartográficas"
                  : "Master in Cartographic Sciences"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">UNESP</p>
            </div>
          </div>

          {/* Dissertation Section */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 text-center md:text-left">
              {locale === "pt-BR"
                ? "Dissertação de mestrado completa"
                : "Complete master's dissertation"}
            </p>
            <div className="flex items-center justify-center md:justify-start mb-2">
              <a
                href="http://hdl.handle.net/11449/243430"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline flex items-center gap-1"
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
                {locale === "pt-BR"
                  ? "Avaliação da qualidade das medidas e posicionamento GNSS em smartphones Android"
                  : "Evaluation of GNSS measurement quality and positioning in Android smartphones"}
              </a>
            </div>
            {/* Download Dissertation Button */}
            <div className="flex items-center justify-center md:justify-start">
              <a
                href="/academic/masters_degree_dissertation_rogerio_do_carmo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  locale === "pt-BR"
                    ? "Baixar dissertação de mestrado em PDF"
                    : "Download master's dissertation in PDF"
                }
                className="inline-flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
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
                <span>
                  {locale === "pt-BR" ? "Baixar Dissertação (PDF)" : "Download Dissertation (PDF)"}
                </span>
              </a>
            </div>
          </div>

          {/* Current Job Section */}
          <div className="mb-8 flex items-center justify-center md:justify-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Image
              src="/images/logos/logo_topaz.webp"
              alt="Company Logo"
              width={200}
              height={200}
              style={{ width: "200px", height: "auto" }}
              className="rounded"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {locale === "pt-BR" ? "Desenvolvedor Mobile Sênior" : "Senior Mobile Developer"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {locale === "pt-BR" ? "Atual" : "Current"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start md:items-start">
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-lg font-medium text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {ctaText}
            </a>
            <a
              href={`mailto:${email}`}
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
        <div className="flex-shrink-0">
          <div className="relative h-40 w-40 sm:h-44 sm:w-44 md:h-48 md:w-48">
            <Image
              src="/images/profile/rogeriodocarmo.png"
              alt="Rogério do Carmo — Mobile React Native Developer"
              fill
              sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 192px"
              className="rounded-lg object-cover object-top shadow-xl ring-4 ring-primary-200 dark:ring-primary-800"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
