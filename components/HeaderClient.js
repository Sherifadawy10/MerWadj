"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LIGHT_PAGES = [/^\/blog\/.+/, /^\/insights\/.+/, /^\/privacy-policy$/, /^\/terms-of-service$/, /^\/terms$/];

export default function HeaderClient({ menu = [], logoSvg = null, blackLogoSvg = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLight = LIGHT_PAGES.some((p) => p.test(pathname));
  const activeSvg = isLight && blackLogoSvg ? blackLogoSvg : logoSvg;

  const flatItems = menu.length
    ? menu
    : [
        { id: "home", title: "Home", href: "/", parent: 0 },
        { id: "blog", title: "Blog", href: "/blog", parent: 0 },
      ];

  const rootItems = flatItems.filter((item) => !item.parent);

  function open() { setIsOpen(true); }
  function close() { setIsOpen(false); }

  return (
    <>
      <header className={`site-header${isLight ? " site-header--light" : ""}`}>
        <div className="site-header__inner">
          <Link href="/" className="site-header__brand" aria-label="Merwadj home">
            {activeSvg ? (
              <span dangerouslySetInnerHTML={{ __html: activeSvg }} />
            ) : (
              <img src="/logo.svg" alt="Merwadj" width={58} height={58} />
            )}
          </Link>

          <button
            type="button"
            className={`menu-toggle${isOpen ? " is-open" : ""}`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={isOpen ? close : open}
          >
            <span />
            <span />
            <span />
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
        className={`menu-panel${isOpen ? " menu-panel--open" : ""}`}
        aria-hidden={!isOpen}
      >
        <nav className="menu-panel__nav" aria-label="Primary navigation">
          {rootItems.map((item, i) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`menu-panel__link${active ? " menu-panel__link--active" : ""}`}
                style={{
                  animationDelay: isOpen ? `${180 + i * 90}ms` : "0ms",
                }}
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
