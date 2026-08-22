"use client";

/**
 * TimeStopFilter — the inline SVG <filter> used by the cinematic filter pulse
 * to give its glow rings the wavy "time stop" shimmer seen in the reference
 * footage (frames 58-64).
 *
 * Rendered once alongside the overlay and referenced via `filter: url(#…)`.
 * The turbulence is animated with SMIL so the ripple keeps moving for the
 * whole pulse without a JS render loop.
 *
 * Note: this can only be applied to the overlay's own graphics, not to the
 * page behind it — `backdrop-filter` does not reliably accept `url()` SVG
 * filters, and putting `filter: url()` on a wrapper around the page would
 * create a containing block, breaking the sticky header and the fixed
 * back-to-top button for the duration of the effect.
 */

export const TIME_STOP_FILTER_ID = "fp-timestop-ripple";

export default function TimeStopFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="absolute h-0 w-0 overflow-hidden print:hidden"
      data-testid="time-stop-filter"
    >
      <defs>
        <filter id={TIME_STOP_FILTER_ID} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.006 0.014"
            numOctaves="2"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="4s"
              values="0.006 0.014;0.013 0.024;0.006 0.014"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
