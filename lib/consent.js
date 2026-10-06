export const CONSENT_KEY = "merwadj.consent.v1";
export const CONSENT_EVENT = "merwadj:consent";
/* Fired when the visitor asks to review the choice they already made. */
export const REOPEN_EVENT = "merwadj:consent:reopen";

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

/*
 * Reopens the banner so a visitor can change their mind.
 *
 * Consent that cannot be withdrawn is not consent: GDPR Article 7(3) asks
 * for withdrawal to be as easy as giving it, and the privacy policy tells
 * visitors they can do this. The stored choice is left alone until they
 * actually choose again, so closing the banner without deciding keeps
 * whatever was set before.
 */
export function reopenConsent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REOPEN_EVENT));
}
