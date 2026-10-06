"use client";

import { reopenConsent } from "@/lib/consent";

/*
 * The way back to the cookie choice.
 *
 * The banner appears once and then never again, so without this a visitor
 * who accepted analytics had no way to change their mind. The privacy
 * policy promises they can, and GDPR Article 7(3) requires withdrawal to be
 * as easy as consent was.
 *
 * It renders nothing when no analytics ID is configured: with no cookies to
 * manage, a settings link leads to a banner about nothing. The separator
 * lives in here with it, so it disappears at the same time rather than
 * leaving a stray divider in the footer.
 */
const HAS_ANALYTICS = Boolean(process.env.NEXT_PUBLIC_GA_ID);

export default function CookieSettingsLink({ className, separatorClassName, withSeparator }) {
  if (!HAS_ANALYTICS) return null;

  return (
    <>
      {withSeparator && <span className={separatorClassName}>|</span>}
      <button type="button" className={className} onClick={reopenConsent}>
        Cookie settings
      </button>
    </>
  );
}
