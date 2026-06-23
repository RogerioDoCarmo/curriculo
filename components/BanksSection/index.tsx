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
  /** Intrinsic pixel width of the logo file (for next/image aspect ratio). */
  readonly width: number;
  /** Intrinsic pixel height of the logo file. */
  readonly height: number;
  /** Country the institution operates in (shown as a caption). */
  readonly country: string;
  /** Official site, opened in a new tab when present. */
  readonly url?: string;
}

const BANKS: readonly Bank[] = [
  {
    name: "Virtus Pay",
    logo: "/images/logos/banks/virtus.jpg",
    width: 510,
    height: 602,
    country: "Brasil",
    // Website is offline; the Instagram profile is the live presence.
    url: "https://www.instagram.com/virtuspay/",
  },
  {
    name: "Banco Digimais",
    logo: "/images/logos/banks/banco-digimais.svg",
    width: 500,
    height: 277,
    country: "Brasil",
    url: "https://www.bancodigimais.com.br/",
  },
  {
    name: "CrediSIS",
    logo: "/images/logos/banks/credisis.png",
    width: 613,
    height: 501,
    country: "Brasil",
    url: "https://credisis.com.br/",
  },
  {
    name: "Bradescard",
    logo: "/images/logos/banks/bradescard.jpg",
    width: 554,
    height: 554,
    country: "México",
    url: "https://www.bradescard.com.mx/",
  },
  {
    name: "Banco Macro",
    logo: "/images/logos/banks/banco-macro.svg",
    width: 400,
    height: 95,
    country: "Argentina",
    url: "https://www.macro.com.ar/",
  },
  {
    name: "Banco do Nordeste",
    logo: "/images/logos/banks/bnb.svg",
    width: 500,
    height: 180,
    country: "Brasil",
    url: "https://www.bnb.gov.br/",
  },
];

/** Country → flag asset. Flags are public-domain SVGs and decorative (the
 *  country is already in each card's accessible name). */
const COUNTRY_FLAGS: Record<string, string> = {
  Brasil: "/images/flags/br.svg",
  México: "/images/flags/mx.svg",
  Argentina: "/images/flags/ar.svg",
};

/**
 * One logo tile. `duplicate` items are visual-only padding for the seamless
 * loop: they carry empty alt text, are hidden from assistive tech, and are not
 * focusable.
 */
function BankLogo({
  bank,
  duplicate,
  newTabLabel,
}: {
  readonly bank: Bank;
  readonly duplicate: boolean;
  readonly newTabLabel: string;
}) {
  const flag = COUNTRY_FLAGS[bank.country];
  const tile = (
    <span className="relative flex h-40 w-64 items-center justify-center rounded-lg bg-white p-5 shadow-sm">
      <Image
        src={bank.logo}
        alt={duplicate ? "" : `${bank.name} logo`}
        width={bank.width}
        height={bank.height}
        // Bounding box keeps wide wordmarks and square/portrait logos uniform.
        className="h-auto max-h-full w-auto max-w-full object-contain"
      />
      {flag && (
        <Image
          src={flag}
          // Decorative: the country is already in the link's accessible name.
          alt=""
          aria-hidden="true"
          width={24}
          height={16}
          className="absolute bottom-2 right-2 h-auto w-9 rounded-sm ring-1 ring-black/10"
        />
      )}
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
      // Native tooltip on hover; the new-tab note is also in the accessible name.
      title={newTabLabel}
      aria-label={duplicate ? undefined : `${bank.name} (${bank.country}) — ${newTabLabel}`}
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
  const newTabLabel = t("opensInNewTab");

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
                <BankLogo bank={bank} duplicate={false} newTabLabel={newTabLabel} />
              </li>
            ))}
            {/* Duplicate copy: drives the seamless loop, hidden from a11y and reduced-motion. */}
            {BANKS.map((bank) => (
              <li key={`dup-${bank.name}`} aria-hidden="true" className="motion-reduce:hidden">
                <BankLogo bank={bank} duplicate newTabLabel={newTabLabel} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
