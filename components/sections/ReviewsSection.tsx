"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS, Testimonial } from "@/lib/content";
import { Decor } from "@/components/Decor";

interface ReviewsSectionProps {
  lang: "en" | "ml";
}

// Sparkle dash pill arc above boy's head matching the reference
function HeadSparkles({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="w-2 sm:w-2.5 h-5 sm:h-6 rounded-full bg-[#FFB703] shadow-[0_2px_6px_rgba(255,183,3,0.4)] rotate-[22deg]" />
      <div className="w-2 sm:w-2.5 h-6 sm:h-7 rounded-full bg-[#FF8A2A] shadow-[0_2px_6px_rgba(255,138,42,0.4)] rotate-[38deg] -translate-y-1" />
      <div className="w-2 sm:w-2.5 h-5 sm:h-6 rounded-full bg-[#FFB703] shadow-[0_2px_6px_rgba(255,183,3,0.4)] rotate-[54deg]" />
    </div>
  );
}

// Translucent glowing bubbles matching reference
const BUBBLES = [
  { size: 28, left: "6%", bottom: "35%", duration: 5.2, delay: 0 },
  { size: 22, left: "52%", top: "18%", duration: 4.8, delay: 0.4 },
  { size: 34, right: "5%", top: "15%", duration: 5.8, delay: 0.6 },
  { size: 20, right: "7%", top: "25%", duration: 5.0, delay: 1.2 },
];

export function ReviewsSection({ lang }: ReviewsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = !shouldReduceMotion;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to update arrow states
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector(".testimonial-card");
    const step = card ? card.clientWidth + 24 : 380;
    const offset = direction === "left" ? -step : step;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      id="reviews"
      style={{
        scrollMarginTop: "88px",
        backgroundColor: "#BBDDFA",
      }}
      className="relative py-14 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden select-none"
    >
      <span id="customers" className="absolute top-0 pointer-events-none" style={{ scrollMarginTop: "88px" }} />

      {/* Gentle gradient transition at top to smoothly blend with butter-yellow section above */}
      <div
        className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#FDE58B]/25 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Lighter-Blue Radial Glow behind the illustration */}
      <div
        className="absolute top-0 right-0 w-[540px] sm:w-[720px] h-[460px] sm:h-[540px] bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,0.6)_0%,transparent_65%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Unified Sprite Sheet Decor: Starfish (upper-left) & Seaweed-short (bottom-left) */}
      <Decor
        name="starfish"
        className="top-16 lg:top-20 left-4 lg:left-8 xl:left-14"
        size={72}
        shadow
      />
      <Decor
        name="seaweed-short"
        className="bottom-8 lg:bottom-12 left-4 lg:left-8 xl:left-14"
        size={95}
        shadow
      />

      {/* Translucent Animated Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {BUBBLES.map((b, idx) => (
          <motion.div
            key={idx}
            animate={shouldAnimate ? { y: [-6, 6, -6] } : {}}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: b.left,
              right: b.right,
              top: b.top,
              bottom: b.bottom,
            }}
            className="absolute rounded-full border border-white/60 bg-white/20 backdrop-blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.85),0_4px_12px_rgba(60,100,200,0.12)] before:content-[''] before:absolute before:top-1.5 before:left-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-white/80"
          />
        ))}
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* ================================================================== */}
        {/* TOP ROW: Left Header + Right 3D Clay Hero Illustration & Podium     */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {/* Header Left (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 pt-2">


            {/* Main Title: Solid Deep Navy, Bold Clamped */}
            <h2 className="text-4xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-black text-[#1F2A6B] leading-[1.06] tracking-tight font-display mb-3">
              {lang === "en" ? "Happy Customers" : "തൃപ്തികരമായ അനുഭവങ്ങൾ"}
            </h2>

            {/* Subtitle: Medium Navy-Grey */}
            <p className="text-sm sm:text-base lg:text-[19px] font-medium text-[#3B4A7A] max-w-xl leading-relaxed">
              {lang === "en"
                ? "Real tank unboxings and thriving live arrivals across India."
                : "ഇന്ത്യയിലുടനീളമുള്ള ഞങ്ങളുടെ ഉപഭോക്താക്കളുടെ വാക്കുകൾ."}
            </p>
          </div>

          {/* Right Hero Illustration with Podium (5 cols on desktop) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            {/* Sparkles above boy's head */}
            <div className="absolute -top-3 sm:-top-5 right-[55%] sm:right-[52%] z-20">
              <HeadSparkles />
            </div>

            {/* Floating 3D Clay Illustration (Boy Resting Chin + Glass Fishbowl on Podium) */}
            <motion.div
              animate={shouldAnimate ? { y: [0, -6, 0] } : {}}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-[320px] sm:w-[420px] lg:w-[480px] aspect-[768/717] z-0 shrink-0 select-none -mb-8 lg:-mb-20"
            >
              <Image
                src="/assets/happy-customers-hero.webp"
                alt="Happy customer with glass fishbowl on podium"
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 310px, (max-width: 1024px) 410px, 460px"
                className="object-contain drop-shadow-[0_16px_32px_rgba(30,70,140,0.22)]"
              />
            </motion.div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* CARDS CONTAINER & CAROUSEL CONTROLS                                */}
        {/* ================================================================== */}
        <div className="relative z-10">
          {/* Circular Carousel Buttons (Aligned Right Above Cards) */}
          <div className="flex items-center justify-end gap-3 mb-4 pr-1 z-30">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF7] text-[#1F2A6B] shadow-[0_4px_14px_rgba(60,100,200,0.14)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#F0DEC0]/70 ${
                !canScrollLeft ? "opacity-35 cursor-not-allowed hover:scale-100" : "hover:bg-white hover:shadow-[0_8px_24px_rgba(60,100,200,0.2)]"
              }`}
              aria-label="Previous customer testimonial"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF7] text-[#1F2A6B] shadow-[0_4px_14px_rgba(60,100,200,0.14)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#F0DEC0]/70 ${
                !canScrollRight ? "opacity-35 cursor-not-allowed hover:scale-100" : "hover:bg-white hover:shadow-[0_8px_24px_rgba(60,100,200,0.2)]"
              }`}
              aria-label="Next customer testimonial"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Horizontally Scrollable Track (Desktop shows 3 cards in row, slides to 4th; Tablet 2-col; Mobile 1-col peek) */}
          <div
            ref={scrollRef}
            className="flex gap-5 sm:gap-6 lg:gap-7 overflow-x-auto pb-6 pt-2 px-2 -mx-2 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {TESTIMONIALS.map((item, idx) => (
              <TestimonialCard
                key={item.id}
                item={item}
                index={idx}
                lang={lang}
                shouldAnimate={shouldAnimate}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Testimonial Cream Card matching the reference mockup:
 * - 5 Gold Stars ★★★★★
 * - "5.0 Verified" light blue pill badge
 * - Quoted testimonial text in italic navy
 * - Thin light blue divider line
 * - Customer Author row with circular avatar, name, and location • species
 */
function TestimonialCard({
  item,
  index,
  lang,
  shouldAnimate,
}: {
  item: Testimonial;
  index: number;
  lang: "en" | "ml";
  shouldAnimate: boolean;
}) {
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : undefined}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className="testimonial-card relative shrink-0 w-[88%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start z-10"
    >
      {/* Main Cream Card */}
      <div
        className="relative bg-[#FFFDF7] rounded-[28px] sm:rounded-[34px] p-6 sm:p-7 lg:p-8 flex flex-col justify-between h-full border border-[#F0DEC0]/50 transition-all duration-300 ease-out group hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(40,80,160,0.18)] cursor-default"
        style={{
          boxShadow:
            "0 14px 32px rgba(40, 80, 160, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* Top Row: 5 Gold Stars + 5.0 Verified Badge */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
          {/* 5 Golden Stars */}
          <div className="flex items-center gap-0.5 text-[#FFB703]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>

          {/* 5.0 Verified Pill */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EAF2FF] border border-[#D5E5FD] text-[#1A5CFF] text-[11px] sm:text-xs font-bold leading-normal">
            5.0 Verified
          </span>
        </div>

        {/* Review Quote Text */}
        <div className="mb-4 sm:mb-5">
          <p className="text-[#1F2A6B] italic font-medium text-sm sm:text-base lg:text-[17px] leading-[1.6]">
            &ldquo;{lang === "en" ? item.text : item.malayalamText}&rdquo;
          </p>
        </div>

        <div>
          {/* Thin Divider Line */}
          <div className="w-full h-px bg-[#E2EAF8] mb-3.5 sm:mb-4" />

          {/* Customer Author Row */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Avatar */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs bg-[#E8F0FC]">
              <Image
                src={item.photo}
                alt={item.author}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Author Details */}
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-base text-[#1F2A6B] leading-snug truncate">
                {item.author}
              </span>
              <span className="text-xs text-[#5A687A] font-medium flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#1F7A3E] shrink-0" />
                <span className="truncate">{item.location} • {item.speciesPurchased}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
