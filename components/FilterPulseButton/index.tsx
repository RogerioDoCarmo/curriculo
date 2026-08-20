"use client";

/**
 * FilterPulseButton component — triggers a one-shot circular filter-pulse
 * animation (see FilterPulseOverlay / useFilterPulse). Which registered
 * filter it plays defaults to DEFAULT_FILTER_PULSE_ID (lib/filterPulses.ts)
 * but can be overridden per instance via the `filterId` prop.
 *
 * @example
 * ```tsx
 * <FilterPulseButton />
 * ```
 *
 * @example
 * ```tsx
 * <FilterPulseButton filterId="grayscale" label="Trigger grayscale pulse" />
 * ```
 */

import { useFilterPulse } from "@/hooks/useFilterPulse";
import type { FilterPulseId } from "@/lib/filterPulses";

interface FilterPulseButtonProps {
  /** Which registered filter to trigger; defaults to DEFAULT_FILTER_PULSE_ID. */
  readonly filterId?: FilterPulseId;
  /** Additional CSS classes to apply to the button */
  readonly className?: string;
  /** Accessible name / tooltip text. Defaults to English. */
  readonly label?: string;
  /**
   * Called right after a trigger fires. Used e.g. to close a containing
   * mobile sidebar `<dialog>`, whose top-layer promotion would otherwise
   * visually hide the fixed overlay underneath it.
   */
  readonly onTriggered?: () => void;
}

export default function FilterPulseButton({
  filterId,
  className = "",
  label = "Trigger filter pulse effect",
  onTriggered,
}: FilterPulseButtonProps) {
  const { phase, trigger } = useFilterPulse();
  const isIdle = phase === "idle";

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    trigger({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, filterId);
    onTriggered?.();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isIdle}
      aria-label={label}
      title={label}
      className={`
        inline-flex shrink-0 items-center justify-center
        w-9 h-9 rounded-md
        border border-border
        bg-transparent
        text-foreground
        transition-colors duration-200
        hover:bg-accent hover:text-accent-foreground
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
        print:hidden
        ${className}
      `}
    >
      <span aria-hidden="true" className="text-base leading-none">
        ✨
      </span>
    </button>
  );
}
