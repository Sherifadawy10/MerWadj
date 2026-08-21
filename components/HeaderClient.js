"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LIGHT_PAGES = [
  /^\/blog\/.+/,
  /^\/insights\/.+/,
  /^\/privacy-policy$/,
  /^\/terms-of-service$/,
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function HeaderClient({ menu = [], logoSvg = null, blackLogoSvg = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLight = LIGHT_PAGES.some((p) => p.test(pathname));
  const activeSvg = isLight && blackLogoSvg ? blackLogoSvg : logoSvg;

  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  const flatItems = menu.length
    ? menu
    : [
        { id: "home", title: "Home", href: "/", parent: 0 },
        { id: "blog", title: "Blog", href: "/blog", parent: 0 },
        { id: "contact", title: "Contact Us", href: "/contact", parent: 0 },
      ];

  const rootItems = flatItems.filter((item) => !item.parent);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  /*
   * Escape closes, Tab cycles inside the panel, and focus goes back to the
   * button that opened it. Without this the panel was a dialog you could
   * tab straight out of and never find your way back into.
   */
  useEffect(() => {
    if (!isOpen) return undefined;

    const panel = panelRef.current;
    const opener = toggleRef.current;

    const first = panel?.querySelectorAll(FOCUSABLE)[0];
    first?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const items = [...panel.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!items.length) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [isOpen, close]);

  return (
    <>
      <header className={`site-header${isLight ? " site-header--light" : ""}`}>
        <div className="site-header__inner">
          <Link href="/" className="site-header__brand" aria-label="MERWADJ — home">
            {activeSvg ? (
              <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: activeSvg }} />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src="/logo.svg" alt="" aria-hidden="true" width={58} height={58} />
            )}
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className={`menu-toggle${isOpen ? " is-open" : ""}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="primary-menu-panel"
            onClick={isOpen ? close : open}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`menu-backdrop${isOpen ? " menu-backdrop--open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Right panel */}
      <div
        id="primary-menu-panel"
        ref={panelRef}
        className={`menu-panel${isOpen ? " menu-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!isOpen}
        /* React 19 renders a boolean inert attribute; belt and braces with visibility:hidden */
        inert={!isOpen}
      >
        <nav className="menu-panel__nav" aria-label="Primary">
          {rootItems.map((item, i) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`menu-panel__link${active ? " menu-panel__link--active" : ""}`}
                style={{ animationDelay: isOpen ? `${180 + i * 90}ms` : "0ms" }}
                aria-current={active ? "page" : undefined}
                onClick={close}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
