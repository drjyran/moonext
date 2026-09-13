"use client";

import { useEffect } from "react";

type Props = {
  className?: string;
  delay?: 0 | 1 | 2 | 3;
  children: React.ReactNode;
};

export function Reveal({ className = "", delay = 0, children }: Props) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const delayClass = delay === 1 ? " reveal-delay-1" : delay === 2 ? " reveal-delay-2" : delay === 3 ? " reveal-delay-3" : "";

  return <div className={`reveal${delayClass}${className ? ` ${className}` : ""}`}>{children}</div>;
}
