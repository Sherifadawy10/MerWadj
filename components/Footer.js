import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getFooterOptions, getMediaById, getMenu, withContactLink } from "@/lib/wordpress";
import { filterInsightsFromMenu } from "@/lib/features";

async function resolveImage(field) {
  if (!field) return null;
  if (typeof field === "number") {
    const media = await getMediaById(field);
    return media ? { url: media.url, alt: media.alt || "" } : null;
  }
  if (Array.isArray(field)) {
    return field.length ? resolveImage(field[0]) : null;
  }
  if (typeof field === "object") {
    const url = field.url || field.sizes?.large || field.source_url || null;
    return url ? { url, alt: field.alt || "" } : null;
  }
  if (typeof field === "string" && field) {
    return { url: field, alt: "" };
  }
  return null;
}

/** Digits only, so the dialler gets something it can actually call. */
function telHref(phone) {
  const digits = String(phone).replace(/[^\d+]/g, "");
  return digits.length >= 6 ? `tel:${digits}` : null;
}

export default async function Footer() {
  const [options, rawFooterNav, footerLegal] = await Promise.all([
    getFooterOptions(),
    getMenu("footer_menu"),
    getMenu("footer_legal_menu"),
  ]);

  const footerNav = filterInsightsFromMenu(withContactLink(rawFooterNav));

  const acfBg = await resolveImage(options?.["footer-background"]);
  const bgUrl = acfBg?.url || null;

  const title = options?.footer_title || "LET’S TALK";
  const phone = options?.phone || null;
  const email = options?.email || null;
  const address = options?.address || null;
  const copyright = options?.copiright || null;

  const rawSocials = Array.isArray(options?.social_links) ? options.social_links : [];
  const resolvedSocials = await Promise.all(
    rawSocials.map(async (item) => {
      const group = item?.link || {};
      const icon = await resolveImage(group.social_icon);
      const linkField = group.social_link || {};
      return {
        icon,
        href: typeof linkField.url === "string" ? linkField.url.trim() : "",
        text: group.social_text || "",
      };
    })
  );

  /*
   * A social icon pointing at "#" is a dead link, not a social profile.
   * Until a real URL is set in the ACF options, the row is not rendered
   * at all rather than shipping something that goes nowhere.
   */
  const socials = resolvedSocials.filter(
    (s) => s.href && s.href !== "#" && !s.href.startsWith("#")
  );

  return (
    <footer className="site-footer">
      <div className="site-footer__bg-wrap">
        {bgUrl && (
          <Image src={bgUrl} alt="" fill className="site-footer__bg-img" />
        )}
        <div className="site-footer__overlay" />
      </div>

      <div className="site-footer__inner">
        <h2 className="site-footer__heading">{title}</h2>

        <div className="site-footer__columns">
          {/* Left — Phone + Address */}
          <div className="site-footer__col">
            {phone && (
              <>
                <p className="site-footer__label">PHONE</p>
                {telHref(phone) ? (
                  <a href={telHref(phone)} className="site-footer__value site-footer__link">
                    {phone}
                  </a>
                ) : (
                  <p className="site-footer__value">{phone}</p>
                )}
              </>
            )}
            {address && (
              <p
                className="site-footer__address"
                dangerouslySetInnerHTML={{ __html: address.replace(/\n/g, "<br />") }}
              />
            )}
          </div>

          {/* Middle — Email + Socials */}
          <div className="site-footer__col">
            {email && (
              <>
                <p className="site-footer__label">EMAIL</p>
                <a
                  href={`mailto:${email}`}
                  className="site-footer__value site-footer__link"
                >
                  {email}
                </a>
              </>
            )}

            {socials.length > 0 && (
              <div className="site-footer__socials">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-footer__social-link"
                  >
                    {s.icon ? (
                      <Image
                        src={s.icon.url}
                        alt=""
                        aria-hidden="true"
                        width={16}
                        height={16}
                        className="site-footer__social-icon"
                      />
                    ) : null}
                    <span>{s.text}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right — Nav links */}
          {footerNav.length > 0 && (
            <div className="site-footer__col site-footer__col--nav">
              {footerNav.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.target}
                  className="site-footer__nav-link"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="site-footer__bottom">
        <span className="site-footer__copy">
          {copyright || "© 2025 MERWADJ. All rights reserved."}
        </span>
        {footerLegal.length > 0 && (
          <div className="site-footer__legal">
            {footerLegal.map((item, i) => (
              <React.Fragment key={item.id}>
                {i > 0 && <span className="site-footer__legal-sep">|</span>}
                <Link href={item.href} target={item.target} className="site-footer__legal-link">
                  {item.title}
                </Link>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
