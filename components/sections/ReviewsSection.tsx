"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

interface ReviewsSectionProps {
  lang: "en" | "ml";
}

export function ReviewsSection({ lang }: ReviewsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="reviews" className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#BDEBF5] overflow-hidden">
      {/* Background Ambient Swimming Fish */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        <div
          className="fish-lane absolute pointer-events-none fish-track-rtl opacity-80"
          style={{
            top: "16%",
            left: 0,
            animationDuration: "28s",
            animationDelay: "-10s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "scaleX(-1)" }}>
            <div className="fish-bob fish-bob-gentle" style={{ animationDuration: "3.2s" }}>
              <div className="relative w-36 h-22">
                <Image
                  src="/clay/fish/blue-guppy.webp"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header with Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill-orange text-xs font-bold text-white mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{lang === "en" ? "Hobbyist Community" : "ഉപഭോക്താക്കൾ പറയുന്നു"}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold clay-heading-blue mb-2">
              {lang === "en" ? "Happy Customers" : "തൃപ്തികരമായ അനുഭവങ്ങൾ"}
            </h2>

            <p className="text-base sm:text-lg font-medium text-[#0E2038]/85">
              {lang === "en"
                ? "Real tank unboxings and thriving live arrivals across India."
                : "ഇന്ത്യയിലുടനീളമുള്ള ഞങ്ങളുടെ ഉപഭോക്താക്കളുടെ വാക്കുകൾ."}
            </p>
          </div>

          {/* Left/Right Scroll Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="clay-btn-cream w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-md"
              aria-label="Scroll reviews left"
            >
              <ChevronLeft className="w-6 h-6 text-[#0E2038]" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="clay-btn-cream w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-md"
              aria-label="Scroll reviews right"
            >
              <ChevronRight className="w-6 h-6 text-[#0E2038]" />
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Row with Scroll-Snap */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
              className="clay-tile flex-shrink-0 w-80 sm:w-96 p-6 sm:p-7 flex flex-col justify-between snap-start"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFB703] text-[#FFB703]" />
                  ))}
                  <span className="text-xs font-black text-[#1F4FFF] ml-2">5.0 Verified</span>
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-[#0E2038]/85 leading-relaxed italic mb-6 font-medium">
                  &ldquo;{lang === "en" ? item.text : item.malayalamText}&rdquo;
                </p>
              </div>

              {/* Customer Author Row */}
              <div className="flex items-center gap-3.5 pt-4 border-t-2 border-[#F0DEC0]">
                {/* Customer Photo */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#1F4FFF]/40 shrink-0 bg-[#FFF3DC] shadow-inner">
                  <Image
                    src={item.photo}
                    alt={item.author}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-display font-extrabold text-base text-[#0E2038]">
                    {item.author}
                  </h4>
                  <p className="text-xs font-bold text-[#1F7A3E]">
                    {item.location} • {item.speciesPurchased}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
