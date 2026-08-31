"use client";
import { useCallback, useRef } from "react";

/*
 * An in-page anchor that eases instead of jumping.
 *
 * The site already sets `scroll-behavior: smooth` on <html>, but the native
 * curve is short and engine-specific — Safari in particular lands hard. This
 * runs its own tween so the transition reads the same in every browser, and
 * offsets the landing by the fixed header so the section heading is not
 * hidden underneath it.
 *
 * Anything that is not a same-page anchor is rendered as a plain link and
 * left alone.
 */

const DURATION_MIN = 700;
const DURATION_MAX = 1200;

/* Slow at both ends, quickest in the middle — the soft one. */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function headerOffset() {
  const header = document.querySelector(".site-header");
  return header ? header.offsetHeight : 0;
}

export default function ScrollLink({ href, className, children, ...rest }) {
  const frame = useRef(0);

  const onClick = useCallback(
    (event) => {
      if (typeof href !== "string" || !href.startsWith("#")) return;

      // Cmd/ctrl/shift/middle click still means "open this somewhere else".
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }

      const target = document.getElementById(href.slice(1));
      if (!target) return; // no anchor on the page — let the browser decide

      event.preventDefault();

      const to = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - headerOffset()
      );

      /*
       * Focus follows the scroll so keyboard and screen reader users carry
       * on from the section they asked for, not from the top of the page.
       */
      const land = () => {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        history.pushState(null, "", href);
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        window.scrollTo({ top: to, behavior: "instant" });
        land();
        return;
      }

      const from = window.scrollY;
      const distance = to - from;
      if (Math.abs(distance) < 2) {
        land();
        return;
      }

      const duration = Math.min(
        DURATION_MAX,
        Math.max(DURATION_MIN, Math.abs(distance) * 0.6)
      );

      /*
       * The CSS smooth behaviour would otherwise apply to every scrollTo
       * below and fight the tween, so it is suspended for the duration.
       */
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";

      const stop = () => {
        cancelAnimationFrame(frame.current);
        root.style.scrollBehavior = previous;
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchstart", stop);
        window.removeEventListener("keydown", stop);
      };

      // Hand control straight back if the reader takes over mid-flight.
      window.addEventListener("wheel", stop, { passive: true, once: true });
      window.addEventListener("touchstart", stop, { passive: true, once: true });
      window.addEventListener("keydown", stop, { once: true });

      const start = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        window.scrollTo({ top: from + distance * easeInOutCubic(progress), behavior: "instant" });
        if (progress < 1) {
          frame.current = requestAnimationFrame(step);
        } else {
          stop();
          land();
        }
      };
      frame.current = requestAnimationFrame(step);
    },
    [href]
  );

  return (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
