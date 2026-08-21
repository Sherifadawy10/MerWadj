"use client";

import { useEffect, useState } from "react";
import Preloader from "./Preloader";
import { PRELOADER_MS, PRELOADER_SESSION_KEY } from "@/lib/preloader";

/**
 * The preloader is an entrance, not a transition: it plays once per session
 * on the first load and never again. It used to be keyed on the pathname,
 * which replayed a 2.6s full-screen animation on every internal link click.
 */
export default function PreloaderManager({ svgCode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1";
      window.sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    } catch {
      // Storage blocked — fall back to showing it once per page load.
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setDone(true);
      return undefined;
    }

    const timer = setTimeout(() => setDone(true), PRELOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return <Preloader svgCode={svgCode} />;
}
