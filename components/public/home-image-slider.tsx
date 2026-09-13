"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

type Props = {
  slides: readonly Slide[];
};

export function HomeImageSlider({ slides }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/12 bg-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
      <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] xl:aspect-[5/4]">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-all duration-700 ${index === activeIndex ? "scale-100 opacity-100" : "pointer-events-none scale-105 opacity-0"}`}
            aria-hidden={index === activeIndex ? undefined : true}
          >
            <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === 0} />
          </div>
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.22),transparent_25%),linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.44)_45%,rgba(15,23,42,0.92)_100%)]" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
          <div className="rounded-full border border-white/20 bg-slate-950/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-200 backdrop-blur-md">
            Live Project Visuals
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-white/15 bg-slate-950/35 px-3 py-1 text-[11px] font-semibold tracking-[0.28em] text-white/80 backdrop-blur-md sm:inline-flex">
              {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/35 text-white transition hover:bg-slate-950/60"
              aria-label="Previous slide"
              onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/35 text-white transition hover:bg-slate-950/60"
              aria-label="Next slide"
              onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="max-w-xl rounded-[28px] border border-white/10 bg-slate-950/38 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200">{currentSlide.eyebrow}</p>
            <h2 className="public-display mt-3 text-3xl font-semibold leading-tight text-white sm:text-[2.15rem]">
              {currentSlide.title}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">{currentSlide.description}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-10 bg-moonext-orange shadow-[0_0_18px_rgba(249,115,22,0.5)]" : "w-2.5 bg-white/45 hover:bg-white/70"}`}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
