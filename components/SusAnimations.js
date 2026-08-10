"use client";
import { useEffect } from "react";

export default function SusAnimations() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-sus-anim]"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.susAnim || "0", 10);
          setTimeout(() => el.classList.add("sus-anim--visible"), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    // Safety net: force all visible after 5s (prevents stuck opacity:0)
    const safety = setTimeout(() => {
      elements.forEach((el) => el.classList.add("sus-anim--visible"));
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return null;
}
