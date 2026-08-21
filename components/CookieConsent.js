"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DENIED, GRANTED, readConsent, writeConsent } from "@/lib/consent";

const HAS_ANALYTICS = Boolean(process.env.NEXT_PUBLIC_GA_ID);

/**
 * Consent banner for analytics cookies.
 *
 * It only renders when there is actually something to consent to — i.e.
 * when an analytics ID is configured. A banner on a site that sets no
 * cookies asks the visitor to agree to nothing, which is worse than no
 * banner at all. Add NEXT_PUBLIC_GA_ID and this appears on its own.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!HAS_ANALYTICS) return;
    if (readConsent() === null) setVisible(true);
  }, []);

  /*
   * Deliberately no autofocus. The banner is a non-modal notice, and
   * pulling focus out of the page on load would move a keyboard user off
   * the skip link before they ever reach it.
   */

  function decide(value) {
    writeConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="cookie"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <div className="cookie__inner">
        <div className="cookie__copy">
          <h2 id="cookie-title" className="cookie__title">
            Cookies on this site
          </h2>
          <p id="cookie-text" className="cookie__text">
            We use analytics cookies to understand which pages are useful. They are
            not set unless you accept. Essential cookies needed to serve the site are
            always on. Read our{" "}
            <Link href="/privacy-policy" className="cookie__link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="cookie__actions">
          <button
            type="button"
            className="cookie__btn cookie__btn--ghost"
            onClick={() => decide(DENIED)}
          >
            Decline
          </button>
          <button
            type="button"
            className="cookie__btn cookie__btn--solid"
            onClick={() => decide(GRANTED)}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
