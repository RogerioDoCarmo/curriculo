"use client";

/**
 * BanksSection
 *
 * Highlights the financial institutions whose mobile apps benefited from the
 * work described in the current professional experience. Brand logos scroll in
 * a seamless, auto-advancing carousel that pauses on hover/focus. Motion is
 * driven by JavaScript (`scrollLeft`) rather than a CSS transform so the Prev/
 * Next buttons can step the same track at the visitor's own pace. The track
 * holds two identical copies of the logo list; once a full copy has scrolled
 * past, its width is subtracted to wrap around without a visible seam.
 *
 * Accessibility: the second (duplicate) copy is `aria-hidden` and non-focusable
 * so screen readers and keyboard users only encounter each bank once. The
 * Prev/Next buttons carry localized labels. Users who prefer reduced motion get
 * a static, wrapped grid (no auto-scroll, controls hidden).
 *
 * Logos live in public/images/logos/banks/ and are served unoptimized per the
 * static-export config. They currently ship as simple text placeholders — swap
 * in the official brand assets at the same paths.
 */

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
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

/** A circular chevron control for stepping the carousel one tile at a time.
 * Sits beside the track (not over the logos) as a flex item. */
function NavButton({
  direction,
  label,
  onClick,
}: {
  readonly direction: "prev" | "next";
  readonly label: string;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 motion-reduce:hidden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </button>
  );
}

export default function BanksSection() {
  const t = useTranslations("banks");
  const newTabLabel = t("opensInNewTab");
  const trackRef = useRef<HTMLDivElement>(null);
  // Refs (not state) so the rAF loop reads the latest values without resubscribing.
  const hoverPaused = useRef(false);
  // Set for 10s after a manual step, so a button press lets the visitor look.
  const manualPaused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance the track unless the visitor prefers reduced motion. The two
  // identical copies make the wrap-around at the halfway point seamless: once a
  // full copy has scrolled past, subtract its width to loop invisibly.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    // scrollLeft snaps to an integer on assignment, so a sub-pixel step like 0.5
    // would round back to 0 every frame on a 1x display and never move. Carry the
    // fractional remainder and only apply whole-pixel increments.
    let carry = 0;
    const SPEED = 0.5; // px per frame (~30px/s at 60fps)
    const tick = () => {
      if (!hoverPaused.current && !manualPaused.current && el.scrollWidth > el.clientWidth) {
        carry += SPEED;
        const whole = Math.floor(carry);
        if (whole >= 1) {
          el.scrollLeft += whole;
          carry -= whole;
        }
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Clear any pending resume timer when the component unmounts.
  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    []
  );

  // Step one logo tile (including the inter-tile gap) in the given direction, and
  // pause the auto-scroll for 10s so the manual move isn't immediately undone.
  const step = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector("li");
    const list = item?.parentElement;
    const gap = list ? parseFloat(getComputedStyle(list).columnGap) || 0 : 0;
    const tile = item ? item.getBoundingClientRect().width + gap : 256;

    // Wrap-around so the buttons loop infinitely like the auto-scroll instead of
    // clamping at the track ends. The track holds two identical copies, so a ±half
    // jump is invisible. Normalise into the first copy, then ensure a full tile of
    // room exists in the press direction by hopping into the other copy first.
    const half = el.scrollWidth / 2;
    if (half > 0) {
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      if (direction === -1 && el.scrollLeft < tile) el.scrollLeft += half;
    }
    el.scrollBy({ left: tile * direction, behavior: "smooth" });

    manualPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      manualPaused.current = false;
    }, 10000);
  }, []);

  const pause = () => {
    hoverPaused.current = true;
  };
  const resume = () => {
    hoverPaused.current = false;
  };

  return (
    <section id="banks" aria-labelledby="banks-title" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 id="banks-title" className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Controls sit beside the track (outside the scrolling area). Hovering or
            keyboard-focusing anywhere here pauses the auto-scroll so reading and
            manual stepping aren't fighting the motion. */}
        <div
          className="group flex items-center gap-3 sm:gap-4"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocusCapture={pause}
          onBlurCapture={resume}
        >
          <NavButton direction="prev" label={t("previous")} onClick={() => step(-1)} />

          <div ref={trackRef} className="flex-1 overflow-hidden" data-testid="banks-carousel">
            <ul className="flex w-max items-center gap-8 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-6 sm:gap-12">
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

          <NavButton direction="next" label={t("next")} onClick={() => step(1)} />
        </div>
      </div>
    </section>
  );
}
