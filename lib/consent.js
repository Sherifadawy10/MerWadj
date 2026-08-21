export const CONSENT_KEY = "merwadj.consent.v1";
export const CONSENT_EVENT = "merwadj:consent";

export const GRANTED = "granted";
export const DENIED = "denied";

/** Reads the stored choice. Returns null when the visitor has not decided yet. */
export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === GRANTED || value === DENIED ? value : null;
  } catch {
    // Private mode or storage disabled — treat as undecided rather than crash.
    return null;
  }
}

/** Persists the choice and notifies listeners in the same tab. */
export function writeConsent(value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Nothing to do — the in-memory event below still gates this page view.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
