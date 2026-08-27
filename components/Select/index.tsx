"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";

interface SelectProps<T> {
  /** Currently selected option. */
  readonly value: T;
  /** All selectable options. */
  readonly options: readonly T[];
  /** Called with the newly selected option. */
  readonly onChange: (option: T) => void;
  /** Text shown for each option. */
  readonly getLabel: (option: T) => string;
  /** Stable, unique identifier for each option (used as the DOM `value`). */
  readonly getKey: (option: T) => string;
  /** Accessible label for the control. */
  readonly label: string;
  /** Additional CSS classes to apply to the wrapper. */
  readonly className?: string;
}

/**
 * A generic, fully-typed `<select>`: `T` can be any option shape, not just
 * strings — `getLabel`/`getKey` describe how to render and identify each
 * option, so callers get full type-checking and autocomplete on `value`
 * and `onChange` at every call site. Renders a native `<select>` so
 * keyboard, screen reader, and mobile behavior come from the browser.
 */
export default function Select<T>({
  value,
  options,
  onChange,
  getLabel,
  getKey,
  label,
  className = "",
}: SelectProps<T>) {
  const id = useId();
  const selectedKey = getKey(value);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = options.find((option) => getKey(option) === event.target.value);
    if (next) onChange(next);
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={selectedKey}
        onChange={handleChange}
        aria-label={label}
        className="
          appearance-none bg-transparent
          text-sm font-medium
          text-foreground
          border border-border rounded-md
          px-3 py-1.5 pr-8
          cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-ring
          transition-colors duration-200
          hover:bg-accent hover:text-accent-foreground
        "
      >
        {options.map((option) => (
          <option key={getKey(option)} value={getKey(option)}>
            {getLabel(option)}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
      >
        ▾
      </span>
    </div>
  );
}
