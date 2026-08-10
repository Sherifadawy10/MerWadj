"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    const show = (el) => {
      const delay = parseInt(el.dataset.anim || "0", 10);
      setTimeout(() => el.setAttribute("data-anim-state", "in"), delay);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );

    const observeNew = () => {
      document
        .querySelectorAll("[data-anim]:not([data-anim-state])")
        .forEach((el) => io.observe(el));
    };

    // Defer past hydration so DOM attributes don't mismatch during reconciliation
    const raf = requestAnimationFrame(() => {
      observeNew();

      const mo = new MutationObserver(observeNew);
      mo.observe(document.body, { childList: true, subtree: true });
      const t = setTimeout(() => mo.disconnect(), 5000);

      return () => {
        mo.disconnect();
        clearTimeout(t);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
