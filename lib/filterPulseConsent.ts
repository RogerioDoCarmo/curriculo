/**
 * Remembers whether the visitor has acknowledged the photosensitivity warning
 * shown before "The World" plays.
 *
 * Only acceptance is stored. Declining deliberately persists nothing: someone
 * who cancels (or mis-clicks) should be asked again rather than silently
 * locked out of the effect, whereas someone who has read the warning once
 * does not need to read it on every click.
 *
 * There is no explicit `typeof window` guard. Server-side, `localStorage` is
 * simply not a defined identifier, so touching it throws a ReferenceError that
 * the try/catch below already handles — the same catch that covers private
 * mode and blocked storage. An extra guard would be a second, untestable
 * branch protecting against something already protected.
 */

const CONSENT_STORAGE_KEY = "filter-pulse-photosensitivity-consent";
const CONSENT_VALUE = "acknowledged";

/** True when the visitor has already acknowledged the warning. */
export function hasPulseConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === CONSENT_VALUE;
  } catch {
    // Unreadable store (SSR, private mode, blocked cookies) counts as "not yet
    // acknowledged", so the warning still shows rather than being skipped.
    return false;
  }
}

/** Records that the visitor acknowledged the warning. */
export function setPulseConsent(): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, CONSENT_VALUE);
  } catch {
    // Ignore write errors — the warning simply shows again next time.
  }
}

/** Clears the stored acknowledgement. Exposed for tests and manual resets. */
export function clearPulseConsent(): void {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
