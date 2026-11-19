"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS, Testimonial } from "@/lib/content";

interface ReviewsSectionProps {
  lang: "en" | "ml";
}

// Sparkle dash pill pairs matching the reference
function SparklePair({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="w-2 sm:w-2.5 h-5 sm:h-6 rounded-full bg-[#FFB703] shadow-[0_2px_6px_rgba(255,183,3,0.4)]" />
      <div className="w-2 sm:w-2.5 h-3.5 sm:h-4.5 rounded-full bg-[#FF8A2A] shadow-[0_2px_6px_rgba(255,138,42,0.4)] mt-1" />
    </div>
  );
}

// Translucent glowing bubbles matching reference
const BUBBLES = [
  { size: 28, left: "4%", top: "16%", duration: 5.2, delay: 0 },
  { size: 40, left: "7%", top: "64%", duration: 6.0, delay: 0.8 },
  { size: 22, left: "45%", top: "10%", duration: 4.8, delay: 0.4 },
  { size: 18, left: "53%", top: "22%", duration: 5.5, delay: 1.2 },
  { size: 34, right: "4%", top: "12%", duration: 5.8, delay: 0.6 },
  { size: 46, right: "6%", top: "54%", duration: 6.4, delay: 1.5 },
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
        backgroundColor: "var(--color-customers-bg, #BBDDFA)",
      }}
      className="relative py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-12 overflow-hidden select-none"
    >
      <span id="customers" className="absolute top-0 pointer-events-none" style={{ scrollMarginTop: "88px" }} />

      {/* Gentle gradient transition at top to smoothly blend with butter-yellow section above */}
      <div
        className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#FDE58B]/25 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Lighter-Blue Radial Glow behind the illustration */}
      <div
        className="absolute top-0 right-0 w-[540px] sm:w-[700px] h-[460px] sm:h-[540px] bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.48)_0%,transparent_68%)] pointer-events-none"
        aria-hidden="true"
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
            }}
            className="absolute rounded-full border border-white/55 bg-white/20 backdrop-blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(60,100,200,0.12)] before:content-[''] before:absolute before:top-1.5 before:left-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-white/80"
          />
        ))}

        {/* Sparkle Dash Pair 1: Top Right near Boy's Head */}
        <div className="absolute top-8 sm:top-12 right-6 sm:right-16 lg:right-32 rotate-[25deg]">
          <SparklePair />
        </div>

        {/* Sparkle Dash Pair 2: Far Left near Card 1 */}
        <div className="absolute top-[420px] sm:top-[440px] left-3 sm:left-6 rotate-[-20deg]">
          <SparklePair />
        </div>

        {/* Sparkle Dash Pair 3: Bottom Right near Card 3 */}
        <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-12 rotate-[42deg]">
          <SparklePair />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* ================================================================== */}
        {/* TOP ROW: Left Header + Right 3D Clay Hero Illustration & Podium     */}
        {/* ================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-6 mb-10 sm:mb-14 lg:mb-16">
          {/* Header Left (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Orange Pill Badge: "Hobbyist Community" */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[var(--color-customers-pill-from,#FF8A3D)] to-[var(--color-customers-pill-to,#F26A1B)] text-white text-xs sm:text-sm font-extrabold shadow-[0_4px_14px_rgba(242,106,27,0.35)] mb-3 sm:mb-4 select-none">
              <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
              <span>{lang === "en" ? "Hobbyist Community" : "ഉപഭോക്താക്കൾ പറയുന്നു"}</span>
            </div>

            {/* Main Title: Solid Deep Navy, Clamped Extra-Bold */}
            <h2 className="text-4xl sm:text-6xl lg:text-[72px] xl:text-[80px] font-black text-[var(--color-customers-navy,#1F2A6B)] leading-[1.04] tracking-tight font-display mb-3 sm:mb-4">
              {lang === "en" ? "Happy Customers" : "തൃപ്തികരമായ അനുഭവങ്ങൾ"}
            </h2>

            {/* Subtitle: Medium Navy-Grey */}
            <p className="text-sm sm:text-base lg:text-[20px] font-medium text-[var(--color-customers-quote,#3B4A7A)] max-w-xl leading-relaxed">
              {lang === "en"
                ? "Real tank unboxings and thriving live arrivals across India."
                : "ഇന്ത്യയിലുടനീളമുള്ള ഞങ്ങളുടെ ഉപഭോക്താക്കളുടെ വാക്കുകൾ."}
            </p>
          </div>

          {/* Right Hero Illustration with Clay Podium (5 cols on desktop) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            {/* Rounded Blue 3D Clay Podium / Pedestal (Positioned Behind Illustration & overlapping Card 3) */}
            <div
              className="absolute -bottom-8 lg:-bottom-14 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-0 w-[320px] sm:w-[400px] lg:w-[450px] h-[100px] sm:h-[125px] lg:h-[140px] rounded-[50px] sm:rounded-[60px] bg-[var(--color-customers-podium,#86B8F5)] shadow-[inset_0_4px_6px_rgba(255,255,255,0.7),0_14px_28px_rgba(30,70,140,0.16)] border-t-2 border-white/40 z-0 pointer-events-none"
              aria-hidden="true"
            />

            {/* Floating 3D Clay Illustration (Boy Resting Chin + Glass Fishbowl) */}
            <motion.div
              animate={shouldAnimate ? { y: [0, -6, 0] } : {}}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-[300px] sm:w-[380px] lg:w-[420px] aspect-[410/240] z-10 shrink-0 select-none"
            >
              <Image
                src="/assets/happy-customers-hero.png"
                alt="Happy customer with glass fishbowl"
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 420px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(30,70,140,0.18)]"
              />
            </motion.div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* CARDS CONTAINER & CAROUSEL CONTROLS                                */}
        {/* ================================================================== */}
        <div className="relative">
          {/* Soft White Circular Carousel Buttons with Navy Chevrons (Aligned Right Above Cards) */}
          <div className="flex items-center justify-end gap-3 mb-4 pr-1 z-20">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[var(--color-customers-navy,#1F2A6B)] shadow-[0_6px_20px_rgba(60,100,200,0.16)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/80 ${
                !canScrollLeft ? "opacity-35 cursor-not-allowed hover:scale-100" : "hover:bg-white hover:shadow-[0_8px_24px_rgba(60,100,200,0.24)]"
              }`}
              aria-label="Previous customer testimonial"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[var(--color-customers-navy,#1F2A6B)] shadow-[0_6px_20px_rgba(60,100,200,0.16)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/80 ${
                !canScrollRight ? "opacity-35 cursor-not-allowed hover:scale-100" : "hover:bg-white hover:shadow-[0_8px_24px_rgba(60,100,200,0.24)]"
              }`}
              aria-label="Next customer testimonial"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Horizontally Scrollable Track (Desktop shows 3 cards in row, slides to 4th; Tablet 2-col; Mobile 1-col peek) */}
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-7 overflow-x-auto pb-10 pt-6 px-3 -mx-3 scrollbar-none snap-x snap-mandatory"
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
 * Individual Testimonial Squircle Card
 * Matches the reference mockup:
 * - Rounded 40px squircle
 * - Soft lavender-white background (#F6F6FC)
 * - Blue layered shadow
 * - Top-left light blue quote badge
 * - Italic navy quote
 * - Thin divider
 * - Author row with avatar, bold navy name, map pin icon, and muted location/product
 * - Subtle tilt per card (Card 1: -1.5deg, Card 2: +1deg down, Card 3: -1deg up/overlapping podium)
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
  // Tilt & offset per card on desktop (Card 1: -1.5deg, Card 2: +1deg down, Card 3: -1deg up/overlapping podium)
  // On mobile, reduced tilt (0.5deg) to maintain comfortable reading
  const getCardTransformClass = () => {
    switch (index % 3) {
      case 0:
        return "-rotate-[0.5deg] lg:-rotate-[1.5deg] lg:translate-y-0";
      case 1:
        return "rotate-[0.5deg] lg:rotate-[1deg] lg:translate-y-5";
      case 2:
        return "-rotate-[0.5deg] lg:-rotate-[1deg] lg:-translate-y-3 z-20";
      default:
        return "rotate-[0.5deg] lg:rotate-[1deg] lg:translate-y-2";
    }
  };

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 30 } : undefined}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={`testimonial-card relative shrink-0 w-[86%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start ${getCardTransformClass()}`}
    >
      {/* Blue "Shadow Card" peeking behind Card 2 for depth */}
      {index === 1 && (
        <div
          className="hidden lg:block absolute inset-0 bg-[#D4E6FC] rounded-[38px] sm:rounded-[42px] -rotate-2 translate-y-3.5 -z-10 shadow-[0_16px_32px_rgba(60,100,200,0.12)] pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Main Squircle Card */}
      <div
        className="relative bg-[var(--color-customers-card,#F6F6FC)] rounded-[36px] sm:rounded-[42px] p-6 sm:p-8 lg:p-9 flex flex-col justify-between h-full border-0 transition-all duration-300 ease-out group hover:-translate-y-2 hover:rotate-0 hover:shadow-[0_28px_50px_rgba(60,100,200,0.22)] cursor-default"
        style={{
          boxShadow:
            "0 20px 40px rgba(60, 100, 200, 0.14), inset 0 1px 2px rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* Floating Quote Badge (Top-Left, Overlapping Card Edge) */}
        <div
          className="absolute -top-4 sm:-top-5 -left-2 sm:-left-3 w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-[18px] sm:rounded-[20px] bg-[var(--color-customers-badge,#DCEBFF)] text-[var(--color-customers-navy,#1F2A6B)] flex items-center justify-center font-serif text-3xl sm:text-4xl font-black shadow-[0_6px_16px_rgba(60,100,200,0.18)] z-10 select-none"
          aria-hidden="true"
        >
          “
        </div>

        {/* Review Quote Text */}
        <div className="pt-4 sm:pt-5 mb-5 sm:mb-6">
          <p className="text-[var(--color-customers-quote,#2A3470)] italic font-medium text-base sm:text-lg lg:text-[18.5px] leading-[1.58]">
            &ldquo;{lang === "en" ? item.text : item.malayalamText}&rdquo;
          </p>
        </div>

        <div>
          {/* Thin Divider Line */}
          <div className="w-full h-px bg-[#E2EAF8] mb-4 sm:mb-5" />

          {/* Customer Author Row */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Avatar */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-[0_2px_8px_rgba(60,100,200,0.15)] bg-[#E8F0FC]">
              <Image
                src={item.photo}
                alt={item.author}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Author Meta */}
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-base sm:text-[17.5px] text-[var(--color-customers-navy,#1F2A6B)] leading-snug truncate">
                {item.author}
              </h4>
              <div className="flex items-center gap-1.5 text-xs sm:text-[13.5px] font-medium text-[var(--color-customers-muted,#5B6A9A)] mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-customers-muted,#5B6A9A)] shrink-0" />
                <span className="truncate">
                  {item.location} • {item.speciesPurchased}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
