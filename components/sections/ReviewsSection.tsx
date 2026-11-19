"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

interface ReviewsSectionProps {
  lang: "en" | "ml";
}

export function ReviewsSection({ lang }: ReviewsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="relative py-10 sm:py-24 px-3 sm:px-8 bg-[#BDEBF5] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header with Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full clay-pill-orange text-xs font-bold text-white mb-2.5 sm:mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{lang === "en" ? "Hobbyist Community" : "ഉപഭോക്താക്കൾ പറയുന്നു"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold clay-heading-blue mb-1.5 sm:mb-2">
              {lang === "en" ? "Happy Customers" : "തൃപ്തികരമായ അനുഭവങ്ങൾ"}
            </h2>

            <p className="text-xs sm:text-base font-medium text-[#0E2038]/85">
              {lang === "en"
                ? "Real tank unboxings and thriving live arrivals across India."
                : "ഇന്ത്യയിലുടനീളമുള്ള ഞങ്ങളുടെ ഉപഭോക്താക്കളുടെ വാക്കുകൾ."}
            </p>
          </div>

          {/* Left/Right Scroll Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => scroll("left")}
              className="clay-btn-cream w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.97]"
              aria-label="Scroll reviews left"
            >
              <ChevronLeft className="w-5 h-5 text-[#0E2038]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="clay-btn-cream w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.97]"
              aria-label="Scroll reviews right"
            >
              <ChevronRight className="w-5 h-5 text-[#0E2038]" />
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Row with Scroll-Snap */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="clay-tile shrink-0 w-[82%] sm:w-96 p-4 sm:p-7 flex flex-col justify-between snap-start rounded-[22px] sm:rounded-[32px]"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-2.5 sm:mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FFB703] text-[#FFB703]" />
                  ))}
                  <span className="text-[11px] sm:text-xs font-black text-[#1F4FFF] ml-1.5">5.0 Verified</span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-base text-[#0E2038]/85 leading-relaxed italic mb-4 sm:mb-6 font-medium">
                  &ldquo;{lang === "en" ? item.text : item.malayalamText}&rdquo;
                </p>
              </div>

              {/* Customer Author Row */}
              <div className="flex items-center gap-3 pt-3 border-t-2 border-[#F0DEC0]">
                {/* Customer Photo */}
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#1F4FFF]/40 shrink-0 bg-[#FFF3DC] shadow-inner">
                  <Image
                    src={item.photo}
                    alt={item.author}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-display font-extrabold text-xs sm:text-base text-[#0E2038]">
                    {item.author}
                  </h4>
                  <p className="text-[10px] sm:text-xs font-bold text-[#1F7A3E]">
                    {item.location} • {item.speciesPurchased}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
