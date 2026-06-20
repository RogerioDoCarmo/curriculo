"use client";

/**
 * BanksSection
 *
 * Highlights the financial institutions whose mobile apps benefited from the
 * work described in the current professional experience. Brand logos scroll in
 * a seamless, auto-advancing marquee that pauses on hover. The track holds two
 * identical copies of the logo list so the CSS `marquee` animation (a -50%
 * shift) loops without a visible seam.
 *
 * Accessibility: the second (duplicate) copy is `aria-hidden` and non-focusable
 * so screen readers and keyboard users only encounter each bank once. Users who
 * prefer reduced motion get a static, wrapped grid instead of the animation.
 *
 * Logos live in public/images/logos/banks/ and are served unoptimized per the
 * static-export config. They currently ship as simple text placeholders — swap
 * in the official brand assets at the same paths.
 */

import Image from "next/image";
import { useTranslations } from "next-intl";
import { trackExternalLinkClick } from "@/lib/analytics";

interface Bank {
  /** Display name, used for the logo alt text and analytics context. */
  readonly name: string;
  /** Public path to the brand logo. */
  readonly logo: string;
  /** Country the institution operates in (shown as a caption). */
  readonly country: string;
  /** Official site, opened in a new tab when present. */
  readonly url?: string;
}

const BANKS: readonly Bank[] = [
  {
    name: "Banco do Nordeste",
    logo: "/images/logos/banks/bnb.svg",
    country: "Brasil",
    url: "https://www.bnb.gov.br/",
  },
  {
    name: "CrediSIS",
    logo: "/images/logos/banks/credisis.svg",
    country: "Brasil",
    url: "https://credisis.com.br/",
  },
  {
    name: "Bradescard",
    logo: "/images/logos/banks/bradescard.svg",
    country: "México",
    url: "https://www.bradescard.com.mx/",
  },
  {
    name: "Banco Macro",
    logo: "/images/logos/banks/banco-macro.svg",
    country: "Argentina",
    url: "https://www.macro.com.ar/",
  },
];

/**
 * One logo tile. `duplicate` items are visual-only padding for the seamless
 * loop: they carry empty alt text, are hidden from assistive tech, and are not
 * focusable.
 */
function BankLogo({ bank, duplicate }: { readonly bank: Bank; readonly duplicate: boolean }) {
  const tile = (
    <span className="flex h-16 w-44 items-center justify-center rounded-lg bg-white px-4 shadow-sm">
      <Image
        src={bank.logo}
        alt={duplicate ? "" : `${bank.name} logo`}
        width={260}
        height={64}
        className="h-10 w-auto object-contain"
      />
    </span>
  );

  if (!bank.url) {
    return tile;
  }

  return (
    <a
      href={bank.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackExternalLinkClick({ url: bank.url ?? "", context: `bank_${bank.name}` })}
      aria-label={duplicate ? undefined : `${bank.name} (${bank.country})`}
      // Duplicates live inside an aria-hidden <li>; tabIndex={-1} also drops them
      // from the tab order so the focusable link isn't reachable inside hidden content.
      tabIndex={duplicate ? -1 : undefined}
      className="rounded-lg transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
    >
      {tile}
    </a>
  );
}

export default function BanksSection() {
  const t = useTranslations("banks");

  return (
    <section id="banks" aria-labelledby="banks-title" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 id="banks-title" className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="group relative overflow-hidden" data-testid="banks-carousel">
          <ul className="flex w-max items-center gap-8 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-6 motion-reduce:animate-none sm:gap-12">
            {BANKS.map((bank) => (
              <li key={bank.name}>
                <BankLogo bank={bank} duplicate={false} />
              </li>
            ))}
            {/* Duplicate copy: drives the seamless loop, hidden from a11y and reduced-motion. */}
            {BANKS.map((bank) => (
              <li key={`dup-${bank.name}`} aria-hidden="true" className="motion-reduce:hidden">
                <BankLogo bank={bank} duplicate />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
