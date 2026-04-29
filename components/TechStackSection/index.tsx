"use client";

/**
 * TechStackSection component
 *
 * Displays technologies used to build the website organized by category.
 * Each technology includes:
 * - Name and logo/icon
 * - Simple, non-technical description
 * - Why it was chosen
 * - Benefits it provides
 * - Link to official documentation
 *
 * Requirements: 23.1, 23.2, 23.5, 23.6, 23.7, 23.8, 23.9, 23.10
 */

import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

// Technology category mapping
const TECH_CATEGORIES = {
  framework: ["nextjs", "typescript"],
  styling: ["tailwind"],
  content: ["markdown"],
  internationalization: ["nextIntl"],
  testing: ["jest", "playwright"],
  analytics: ["firebase", "sentry"],
  deployment: ["vercel", "formspree", "storybook", "githubActions", "sonarqube"],
} as const;

type CategoryKey = keyof typeof TECH_CATEGORIES;

export default function TechStackSection() {
  const t = useTranslations("techStack");

  return (
    <section
      id="tech-stack"
      className="py-16 px-4 sm:px-6 lg:px-8"
      aria-labelledby="tech-stack-title"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="tech-stack-title" className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Technologies by Category */}
        <div className="space-y-12">
          {(Object.keys(TECH_CATEGORIES) as CategoryKey[]).map((categoryKey) => {
            const techKeys = TECH_CATEGORIES[categoryKey];

            return (
              <div key={categoryKey} data-category={categoryKey}>
                {/* Category Heading */}
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  {t(`categories.${categoryKey}`)}
                </h3>

                {/* Technology Grid */}
                <div
                  data-testid="tech-stack-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {techKeys.map((techKey) => {
                    const tech = {
                      name: t(`technologies.${techKey}.name`),
                      description: t(`technologies.${techKey}.description`),
                      why: t(`technologies.${techKey}.why`),
                      benefits: t(`technologies.${techKey}.benefits`),
                      url: t(`technologies.${techKey}.url`),
                    };

                    return (
                      <article
                        key={techKey}
                        data-testid="tech-card"
                        className="
                          p-6 rounded-lg border border-border
                          bg-card text-card-foreground
                          hover:shadow-lg transition-shadow duration-200
                          dark:bg-card dark:border-border
                        "
                      >
                        {/* Technology Name */}
                        <h4 className="text-xl font-semibold mb-3 text-foreground">{tech.name}</h4>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-3">{tech.description}</p>

                        {/* Why Chosen */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {t("labels.why")}
                          </p>
                          <p className="text-sm text-muted-foreground">{tech.why}</p>
                        </div>

                        {/* Benefits */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {t("labels.benefits")}
                          </p>
                          <p className="text-sm text-muted-foreground">{tech.benefits}</p>
                        </div>

                        {/* Documentation Link */}
                        <a
                          href={tech.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex items-center gap-2
                            text-sm font-medium text-primary-600
                            hover:text-primary-700 hover:underline
                            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded
                            transition-colors duration-200
                          "
                          aria-label={`${t("labels.learnMore")} ${tech.name} (opens in new tab)`}
                        >
                          {t("labels.learnMore")}
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
