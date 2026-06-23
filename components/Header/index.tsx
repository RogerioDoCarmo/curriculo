"use client";

/**
 * Header component — responsive navigation with anchor support.
 *
 * - Desktop (≥768px): Horizontal navbar at top of page
 * - Mobile (<768px): Hamburger button + left sidebar that slides in
 *
 * Requirements: 4.1, 4.2, 4.3, 17.5, 24.1-24.10
 */

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LanguageSelector, { getLanguageName } from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { useAnchorNavigation } from "@/hooks/useAnchorNavigation";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { trackNavLinkClick, trackExternalLinkClick } from "@/lib/analytics";
import type { SupportedLocale } from "@/types/index";

interface HeaderProps {
  readonly locale: string;
}

const NAV_SECTIONS = ["home", "projects", "experience", "skills", "contact"] as const;

/**
 * Get the resume URL based on locale and feature flag.
 * Mirrors the logic in Footer/ExitIntentModal so the navbar download serves
 * the same locale-specific PDF.
 */
function getResumeUrl(locale: string, useLocaleSpecificPdfs: boolean): string {
  if (!useLocaleSpecificPdfs) {
    return "/resumes/resume.pdf";
  }

  const localeMap: Record<string, string> = {
    "pt-BR": "/resumes/resume-pt-BR.pdf",
    en: "/resumes/resume-en.pdf",
    es: "/resumes/resume-es.pdf",
  };

  return localeMap[locale] || "/resumes/resume.pdf";
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();

  // Localized tooltips: "Switch between dark and light mode (currently …)" and
  // "Select language (currently …)". ThemeToggle picks the dark/light variant
  // after mount; `label` is the theme-independent SSR fallback.
  const themeToggleLabels = {
    label: t("theme.switchLabel"),
    darkModeLabel: t("theme.switchTooltip", { mode: t("theme.modeDark") }),
    lightModeLabel: t("theme.switchTooltip", { mode: t("theme.modeLight") }),
  };
  const languageLabel = t("language.selectTooltip", {
    language: getLanguageName(locale as SupportedLocale),
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [_isMobile, _setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { isActive, navigateTo } = useAnchorNavigation([...NAV_SECTIONS]);

  // Locale-specific resume PDF. Defaults to true to match the Remote Config
  // defaultConfig so the correct PDF is served even before the flag resolves.
  const { value: useLocaleSpecificPdfs } = useFeatureFlag("use_locale_specific_pdfs", true);
  const resumeUrl = getResumeUrl(locale, useLocaleSpecificPdfs);

  // Check if we're on the home page (where anchor sections exist)
  // Home page paths: /{locale} or /{locale}/ or /{locale}#section
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isTechStackPage = pathname?.includes("/tech-stack");

  // Detect mobile viewport and set mounted flag
  useEffect(() => {
    setMounted(true);
    function checkMobile() {
      _setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function handleNavClick(section: string, label: string) {
    // Track navigation
    trackNavLinkClick({ link_text: label, link_url: `#${section}` });

    // If we're NOT on the home page, navigate to home page with hash
    // This handles any future pages (blog, about, portfolio, etc.) automatically
    // without needing to update this logic for each new page
    if (!isHomePage) {
      window.location.href = `/${locale}#${section}`;
    } else {
      // We're on home page, just scroll to the section smoothly
      navigateTo(section);
    }
    closeSidebar();
  }

  const navLinks = [
    { key: "home", label: t("nav.home"), href: "#home", isExternal: false },
    { key: "projects", label: t("nav.projects"), href: "#projects", isExternal: false },
    { key: "experience", label: t("nav.experience"), href: "#experience", isExternal: false },
    { key: "skills", label: t("nav.skills"), href: "#skills", isExternal: false },
    { key: "contact", label: t("nav.contact"), href: "#contact", isExternal: false },
    {
      key: "tech-stack",
      label: t("nav.techStack"),
      href: `/${locale}/tech-stack`,
      isExternal: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-md print:hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile: Hamburger button - Always render, hide with CSS on desktop */}
          <button
            type="button"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            onClick={sidebarOpen ? closeSidebar : openSidebar}
            className="
              inline-flex items-center justify-center
              w-9 h-9 rounded-md
              border border-border
              bg-transparent text-foreground
              transition-colors duration-200
              hover:bg-accent hover:text-accent-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              md:hidden
            "
          >
            {/* Hamburger icon */}
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
            </span>
          </button>

          {/* Desktop: Horizontal nav - Hide on mobile with CSS */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-6"
          >
            {navLinks.map(({ key, label, href, isExternal }) =>
              isExternal ? (
                <Link
                  key={key}
                  href={href}
                  onClick={() => trackNavLinkClick({ link_text: label, link_url: href })}
                  className={`
                      text-sm font-medium transition-colors duration-200
                      hover:text-primary-600
                      focus:outline-none focus:ring-2 focus:ring-ring rounded
                      ${isTechStackPage && key === "tech-stack" ? "text-primary-600 font-semibold" : "text-foreground"}
                    `}
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={key}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(key, label);
                  }}
                  className={`
                      text-sm font-medium transition-colors duration-200
                      hover:text-primary-600
                      focus:outline-none focus:ring-2 focus:ring-ring rounded
                      ${mounted && isActive(key) ? "text-primary-600 font-semibold" : "text-foreground"}
                    `}
                >
                  {label}
                </a>
              )
            )}
          </nav>

          {/* Controls: Resume + GitHub + Linktree + LanguageSelector + ThemeToggle */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Resume Download Link — spaced apart from the GitHub icon */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("footer.downloadResumeLabel")}
              title={t("footer.downloadResume")}
              onClick={() =>
                trackExternalLinkClick({
                  url: resumeUrl,
                  context: "header_resume_download",
                })
              }
              className="
                mr-3 inline-flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1
                text-gray-700 dark:text-gray-200
                hover:text-primary-600 dark:hover:text-primary-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
              {/* Icon + label form one centered block, vertically aligned as a
                  unit against the GitHub/Linktree controls. */}
              <span className="text-[10px] font-medium leading-none hidden sm:block">
                {t("nav.resume")}
              </span>
            </a>

            {/* GitHub Repository Link */}
            <a
              href="https://github.com/rogeriodocarmo/curriculo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              onClick={() =>
                trackExternalLinkClick({
                  url: "https://github.com/rogeriodocarmo/curriculo",
                  context: "header_github",
                })
              }
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                text-gray-700 dark:text-gray-200
                hover:text-primary-600 dark:hover:text-primary-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">GitHub</span>
            </a>

            {/* Linktree Profile Link */}
            <a
              href="https://linktr.ee/rogeriodocarmo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linktree profile"
              onClick={() =>
                trackExternalLinkClick({
                  url: "https://linktr.ee/rogeriodocarmo",
                  context: "header_linktree",
                })
              }
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                text-gray-700 dark:text-gray-200
                hover:text-primary-600 dark:hover:text-primary-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.528.897 1.052.897h.244l4.72-4.72v6.782c0 .566.404 1.052.972 1.133.647.08 1.214-.404 1.214-1.052v-6.863l4.72 4.72h.244c.405 0 .81-.162 1.052-.486.324-.404.324-.97 0-1.375l-5.934-5.934 5.934-5.934c.324-.404.324-.97 0-1.375-.243-.324-.647-.486-1.052-.486h-.244l-4.72 4.72V.972C15.08.405 14.676 0 14.11 0c-.648 0-1.133.486-1.133 1.133v5.61L8.257 2.023h-.244c-.405 0-.81.162-1.052.486-.324.404-.324.97 0 1.375l5.934 5.934-5.934 5.934c-.243.162-.324.405-.324.648.08.243.162.486.324.648l-.008-.002z" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Linktree</span>
            </a>
            <LanguageSelector
              currentLocale={locale as SupportedLocale}
              className="mr-2"
              label={languageLabel}
            />
            <ThemeToggle {...themeToggleLabels} />
          </div>
        </div>
      </div>

      {/* Mobile: Sidebar overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            data-testid="sidebar-backdrop"
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden="true"
          />

          {/* Sidebar */}
          <div
            role="dialog"
            aria-label="Navigation menu"
            aria-modal="true"
            className="
              fixed top-0 left-0 z-50
              h-full w-64
              bg-background border-r border-border
              flex flex-col
              animate-slide-in-left
            "
          >
            {/* Sidebar header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <span className="font-semibold text-foreground">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeSidebar}
                className="
                  inline-flex items-center justify-center
                  w-8 h-8 rounded-md
                  text-foreground
                  hover:bg-accent hover:text-accent-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring
                "
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>

            {/* Sidebar nav links */}
            <nav className="flex flex-col gap-1 p-4 flex-1">
              {navLinks.map(({ key, label, href, isExternal }) =>
                isExternal ? (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => {
                      trackNavLinkClick({ link_text: label, link_url: href });
                      closeSidebar();
                    }}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium
                      transition-colors duration-200
                      hover:bg-accent hover:text-accent-foreground
                      focus:outline-none focus:ring-2 focus:ring-ring
                      ${isTechStackPage && key === "tech-stack" ? "bg-accent text-accent-foreground font-semibold" : "text-foreground"}
                    `}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={key}
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(key, label);
                    }}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium
                      transition-colors duration-200
                      hover:bg-accent hover:text-accent-foreground
                      focus:outline-none focus:ring-2 focus:ring-ring
                      ${mounted && isActive(key) ? "bg-accent text-accent-foreground font-semibold" : "text-foreground"}
                    `}
                  >
                    {label}
                  </a>
                )
              )}
            </nav>

            {/* Sidebar controls */}
            <div className="flex items-center gap-2 p-4 border-t border-border">
              <LanguageSelector
                currentLocale={locale as SupportedLocale}
                className="mr-2"
                label={languageLabel}
              />
              <ThemeToggle {...themeToggleLabels} />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
