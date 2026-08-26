"use client";

/**
 * TimeStopFilter — the inline SVG <filter> used by the cinematic filter pulse
 * to give its glow rings the wavy "time stop" shimmer seen in the reference
 * footage (frames 58-64).
 *
 * Rendered only while the ring layers are mounted, and referenced via
 * `filter: url(#…)`.
 *
 * Performance: the turbulence is deliberately STATIC. An earlier version
 * animated `baseFrequency` via SMIL, which forces the browser to regenerate
 * the Perlin noise texture every single frame across the whole filter region
 * — measured at ~10fps of the pulse's total budget, and the single largest
 * source of the stalls. The rings are already scaling, so they sweep through
 * a fixed noise field and still read as rippling. numOctaves is 1 for the
 * same reason: each additional octave is another full noise pass.
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
        {/* Tight filter region: the default -10%/120% would enlarge the
            already full-viewport source, multiplying the pixels filtered. */}
        <filter
          id={TIME_STOP_FILTER_ID}
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.009 0.018"
            numOctaves="1"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
