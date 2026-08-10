"use client";
import { useEffect } from "react";

export default function BlogAnimations() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-blog-anim]"));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.blogAnim || "0", 10);
          setTimeout(() => el.classList.add("blog-anim--in"), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));

    const safety = setTimeout(() => {
      els.forEach((el) => el.classList.add("blog-anim--in"));
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return null;
}
