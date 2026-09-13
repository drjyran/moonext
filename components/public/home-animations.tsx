"use client";

import { useEffect } from "react";

export function HomeAnimations({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
    if (elements.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}