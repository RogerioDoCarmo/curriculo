"use client";

/**
 * Footer component — site-wide footer with social links, copyright, and sitemap.
 *
 * Requirements: 3.1, 7.5
 */

import { useTranslations } from "next-intl";

interface FooterProps {
  readonly locale: string;
}

// Feature flag: Set to true when locale-specific PDFs are available
const USE_LOCALE_SPECIFIC_PDFS = false;

/**
 * Get the resume URL based on locale
 * @param locale - Current locale (pt-BR, en, es)
 * @returns Resume PDF URL
 */
function getResumeUrl(locale: string): string {
  if (!USE_LOCALE_SPECIFIC_PDFS) {
    // Use single PDF for all locales
    return "/resumes/resume.pdf";
  }

  // Use locale-specific PDFs
  const localeMap: Record<string, string> = {
    "pt-BR": "/resumes/resume-pt-BR.pdf",
    en: "/resumes/resume-en.pdf",
    es: "/resumes/resume-es.pdf",
  };

  return localeMap[locale] || "/resumes/resume.pdf";
}

const SOCIAL_LINKS = [
  {
    name: "Linktree",
    href: "https://linktr.ee/rogeriodocarmo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.528.897 1.052.897h.244l4.72-4.72v6.782c0 .566.404 1.052.972 1.133.647.08 1.214-.404 1.214-1.052v-6.863l4.72 4.72h.244c.405 0 .81-.162 1.052-.486.324-.404.324-.97 0-1.375l-5.934-5.934 5.934-5.934c.324-.404.324-.97 0-1.375-.243-.324-.647-.486-1.052-.486h-.244l-4.72 4.72V.972C15.08.405 14.676 0 14.11 0c-.648 0-1.133.486-1.133 1.133v5.61L8.257 2.023h-.244c-.405 0-.81.162-1.052.486-.324.404-.324.97 0 1.375l5.934 5.934-5.934 5.934c-.243.162-.324.405-.324.648.08.243.162.486.324.648l-.008-.002z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/rogeriodocarmo/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/RogerioDoCarmo/curriculo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/rogeriodocarmo",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const NAV_SECTIONS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
  { label: "Tech Stack", href: "#tech-stack" },
];

const LANGUAGE_LINKS = [
  { label: "Português (pt-BR)", href: "/pt-BR" },
  { label: "English (en)", href: "/en" },
  { label: "Español (es)", href: "/es" },
];

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const resumeUrl = getResumeUrl(locale);

  return (
    <footer
      role="contentinfo"
      className="
        bg-gray-50 dark:bg-gray-900
        border-t border-gray-200 dark:border-gray-700
        text-gray-600 dark:text-gray-400
        mt-auto
      "
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Sitemap grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Navigate */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              Navigate
            </h2>
            <ul className="space-y-2">
              {NAV_SECTIONS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="
                      text-sm hover:text-primary-600 dark:hover:text-primary-400
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary-500 rounded
                    "
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              Languages
            </h2>
            <ul className="space-y-2">
              {LANGUAGE_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="
                      text-sm hover:text-primary-600 dark:hover:text-primary-400
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary-500 rounded
                    "
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="social-links print:hidden">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              Connect
            </h2>
            <ul className="space-y-2">
              {/* Professional Email */}
              <li>
                <a
                  href={`mailto:${t("footer.email")}`}
                  aria-label={t("footer.emailLabel")}
                  className="
                    inline-flex items-center gap-2 text-sm
                    hover:text-primary-600 dark:hover:text-primary-400
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 rounded
                    font-medium
                  "
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
                  <span>{t("footer.email")}</span>
                </a>
              </li>
              {/* Resume Download Link */}
              <li>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download resume in PDF format"
                  className="
                    inline-flex items-center gap-2 text-sm
                    hover:text-primary-600 dark:hover:text-primary-400
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 rounded
                  "
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
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Resume</span>
                </a>
              </li>
              {SOCIAL_LINKS.map(({ name, href, icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} profile`}
                    className="
                      inline-flex items-center gap-2 text-sm
                      hover:text-primary-600 dark:hover:text-primary-400
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary-500 rounded
                    "
                  >
                    {icon}
                    <span>{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-center text-gray-500 dark:text-gray-500">
            © {year} Rogério do Carmo. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
