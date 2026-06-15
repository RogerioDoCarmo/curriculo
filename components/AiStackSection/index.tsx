"use client";

/**
 * AiStackSection component
 *
 * Showcases the AI tools used to design and build this site. The brand logos
 * are the primary content: a responsive grid of tiles, each linking out to the
 * tool's official site. External clicks are tracked for analytics.
 *
 * Logos live in public/images/logos/ and are rendered through next/image
 * (SVG, served unoptimized per the static-export config). Each logo sits on a
 * fixed white tile so the monochrome marks stay legible in light and dark mode.
 */

import { useTranslations } from "next-intl";
import Image from "next/image";
import { trackExternalLinkClick } from "@/lib/analytics";

interface AiTool {
  /** Translation key under `aiStack.tools` and analytics context suffix. */
  readonly key: string;
  /** Public path to the brand logo SVG. */
  readonly logo: string;
  /** Official site opened in a new tab. */
  readonly url: string;
}

const AI_TOOLS: readonly AiTool[] = [
  { key: "kiro", logo: "/images/logos/kiro.svg", url: "https://kiro.dev" },
  { key: "claudeCode", logo: "/images/logos/claude.svg", url: "https://claude.com/claude-code" },
  {
    key: "githubCopilot",
    logo: "/images/logos/github-copilot.svg",
    url: "https://github.com/features/copilot",
  },
  { key: "chatgpt", logo: "/images/logos/openai.svg", url: "https://chatgpt.com" },
];

export default function AiStackSection() {
  const t = useTranslations("aiStack");

  return (
    <section id="ai-stack" aria-labelledby="ai-stack-title" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 id="ai-stack-title" className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Logo grid */}
        <ul
          data-testid="ai-stack-grid"
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 list-none p-0"
        >
          {AI_TOOLS.map((tool) => {
            const name = t(`tools.${tool.key}.name`);
            const role = t(`tools.${tool.key}.role`);

            return (
              <li key={tool.key}>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackExternalLinkClick({ url: tool.url, context: `ai_stack_${tool.key}` })
                  }
                  aria-label={`${name} — ${role} (opens in new tab)`}
                  className="
                    group flex flex-col items-center gap-4
                    rounded-xl border border-border bg-card p-6 text-center
                    transition-shadow duration-200 hover:shadow-lg
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  "
                >
                  {/* Logo tile — white in both themes to keep monochrome marks legible */}
                  <span className="flex h-20 w-20 items-center justify-center rounded-lg bg-white p-4 shadow-sm">
                    <Image
                      src={tool.logo}
                      alt={`${name} logo`}
                      width={64}
                      height={64}
                      className="w-12 h-auto"
                    />
                  </span>

                  <span className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-foreground">{name}</span>
                    <span className="text-sm text-muted-foreground">{role}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
