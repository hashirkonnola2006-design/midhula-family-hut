"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from "lucide-react";
import { SPECIES_CATALOG, SpeciesItem, getWhatsAppUrl } from "@/lib/content";
import { Decor } from "@/components/Decor";

interface SpeciesSectionProps {
  lang: "en" | "ml";
}

const CATEGORY_CHIPS = [
  { id: "all", label: "All", labelMl: "എല്ലാം", itemIndex: 2 },
  { id: "guppies", label: "Guppies", labelMl: "ഗുപ്പികൾ", itemIndex: 0 },
  { id: "platies", label: "Platies", labelMl: "പ്ലാറ്റികൾ", itemIndex: 1 },
  { id: "swordtails", label: "Swordtails", labelMl: "സ്വാർഡ്‌ടെയിലുകൾ", itemIndex: 2 },
  { id: "crayfish", label: "Crayfish", labelMl: "ക്രേഫിഷ്", itemIndex: 3 },
  { id: "shrimp", label: "Shrimp", labelMl: "ചെമ്മീൻ", itemIndex: 4 },
];

const N = SPECIES_CATALOG.length; // 5 items
const REPEAT_SETS = 7;
const CENTER_SET = 3;
const BASE_INDEX = CENTER_SET * N; // 15
const INFINITE_ITEMS = Array.from({ length: REPEAT_SETS }, () => SPECIES_CATALOG).flat();

// Translucent glassy floating bubbles matching reference image
const WATER_BUBBLES = [
  { size: 28, left: "7%", top: "22%", delay: 0 },
  { size: 16, left: "13%", top: "14%", delay: 0.6 },
  { size: 40, right: "9%", top: "11%", delay: 0.3 },
  { size: 22, right: "5%", top: "19%", delay: 0.9 },
];

export function SpeciesSection({ lang }: SpeciesSectionProps) {
  // Start at Swordtails (item 2 in Set 3) to match reference exact default view
  const [displayIndex, setDisplayIndex] = useState(BASE_INDEX + 2);
  const [enableTransition, setEnableTransition] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("swordtails");
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesItem | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const wasDragged = useRef(false);
  const [dragDelta, setDragDelta] = useState(0);

  const lastActionRef = useRef<number>(0);
  const isResettingRef = useRef<boolean>(false);

  // Active item index in [0, N-1]
  const activeIdx = ((displayIndex % N) + N) % N;

  // Measure container width for pixel-perfect card step calculations
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        setContainerWidth((prev) => {
          if (Math.abs(prev - newWidth) > 1) {
            setEnableTransition(false);
            return newWidth;
          }
          return prev;
        });
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute card dimensions and step based on container width
  const isDesktop = containerWidth >= 1024;
  const isTablet = containerWidth >= 640 && containerWidth < 1024;
  const gap = isDesktop || isTablet ? 24 : 16;
  let cardWidth = 0;
  if (containerWidth > 0) {
    if (isDesktop) {
      cardWidth = (containerWidth - 48) / 3;
    } else if (isTablet) {
      cardWidth = (containerWidth - 24) / 2;
    } else {
      cardWidth = Math.round(containerWidth * 0.85);
    }
  }
  const step = cardWidth + gap;

  // Sync category filter chip when activeIdx changes
  useEffect(() => {
    const activeItem = SPECIES_CATALOG[activeIdx];
    if (activeItem) {
      setSelectedCategory(activeItem.id);
    }
  }, [activeIdx]);

  // Handle seamless wrap-around when transition finishes
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform" || e.target !== e.currentTarget) return;

    const lowerBound = N;
    const upperBound = (REPEAT_SETS - 1) * N;

    if (displayIndex < lowerBound || displayIndex >= upperBound) {
      isResettingRef.current = true;
      setEnableTransition(false);
      const normalized = BASE_INDEX + activeIdx;
      setDisplayIndex(normalized);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          isResettingRef.current = false;
        });
      });
    }
  };

  const handlePrev = useCallback(() => {
    if (isResettingRef.current) return;
    const now = Date.now();
    if (now - lastActionRef.current < 200) return;
    lastActionRef.current = now;
    setEnableTransition(true);
    setDisplayIndex((prev) => prev - 1);
  }, []);

  const handleNext = useCallback(() => {
    if (isResettingRef.current) return;
    const now = Date.now();
    if (now - lastActionRef.current < 200) return;
    lastActionRef.current = now;
    setEnableTransition(true);
    setDisplayIndex((prev) => prev + 1);
  }, []);

  const handleChipClick = (chip: (typeof CATEGORY_CHIPS)[0]) => {
    setSelectedCategory(chip.id);
    if (chip.id === "all") return;
    let diff = chip.itemIndex - activeIdx;
    if (diff > 2) diff -= N;
    if (diff < -2) diff += N;
    if (diff === 0) return;
    setEnableTransition(true);
    setDisplayIndex((prev) => prev + diff);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = document.getElementById("species");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontalSwipe.current = null;
    wasDragged.current = false;
    setDragDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const dx = currentX - touchStartPos.current.x;
    const dy = currentY - touchStartPos.current.y;

    if (isHorizontalSwipe.current === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
      }
    }

    if (isHorizontalSwipe.current) {
      wasDragged.current = true;
      setEnableTransition(false);
      setDragDelta(dx);
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (isHorizontalSwipe.current) {
      setEnableTransition(true);
      if (dragDelta < -40) {
        handleNext();
      } else if (dragDelta > 40) {
        handlePrev();
      }
    }
    setDragDelta(0);
    isHorizontalSwipe.current = null;
    setTimeout(() => {
      wasDragged.current = false;
    }, 120);
  };

  return (
    <section
      id="species"
      style={{ scrollMarginTop: "88px" }}
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-[#DCF4FC] via-[#CFEFF9] to-[#C2EBF7] overflow-hidden select-none"
    >
      <span id="fish" className="absolute top-0 pointer-events-none" style={{ scrollMarginTop: "88px" }} />

      {/* Top-left soft translucent water swirl arc */}
      <div
        className="absolute -top-12 -left-12 w-80 sm:w-96 h-48 sm:h-56 rounded-br-[200px] bg-gradient-to-br from-white/45 via-white/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Top-right soft translucent water swirl arc */}
      <div
        className="absolute -top-12 -right-12 w-80 sm:w-96 h-48 sm:h-56 rounded-bl-[200px] bg-gradient-to-bl from-white/45 via-white/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle mid-water undulating wave line behind cards */}
      <div
        className="absolute inset-x-0 bottom-6 sm:bottom-12 h-32 pointer-events-none opacity-30 overflow-hidden"
        aria-hidden="true"
      >
        <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,64 C320,15 640,95 960,35 C1160,0 1340,55 1440,42 L1440,120 L0,120 Z"
            fill="#78CCE5"
          />
        </svg>
      </div>

      {/* Floating Glassy Water Bubbles matching reference */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {WATER_BUBBLES.map((b, idx) => (
          <div
            key={idx}
            style={{
              width: `${b.size}px`,
              height: `${b.size}px`,
              left: b.left,
              right: b.right,
              top: b.top,
              animationDelay: `${b.delay}s`,
            }}
            className="absolute rounded-full border border-white/70 bg-white/25 backdrop-blur-[0.5px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_12px_rgba(60,120,200,0.12)] before:content-[''] before:absolute before:top-1.5 before:left-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-white/90 animate-float pointer-events-none select-none"
          />
        ))}
      </div>

      {/* Corner Decor: Seaweed sprout (bottom-left) and Pebble with sprout (bottom-right) */}
      <Decor
        name="seaweed-short"
        className="-bottom-6 -left-3 sm:left-0 z-10"
        size={120}
      />
      <Decor
        name="pebbles"
        className="-bottom-6 -right-3 sm:right-0 z-10"
        size={115}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header: Pill Badge + Title + Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 flex flex-col items-center">
          {/* Top Pill Badge: ≈ Our Fish */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-[0_4px_14px_rgba(20,100,160,0.08)] mb-3 select-none">
            <svg
              className="w-5 h-5 text-[#0284C7]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            </svg>
            <span className="text-[#0284C7] font-extrabold text-sm tracking-tight font-heading">
              {lang === "en" ? "Our Fish" : "ഞങ്ങളുടെ മത്സ്യങ്ങൾ"}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#13224E] mb-2.5 tracking-tight font-heading">
            {lang === "en" ? "Our Fish" : "ഞങ്ങളുടെ മത്സ്യങ്ങൾ"}
          </h2>

          <p className="text-sm sm:text-base lg:text-[17px] font-medium text-[#465E7D] leading-relaxed max-w-xl mx-auto">
            {lang === "en"
              ? "Healthy, hardy Kerala stock bred in natural open-air mineral water tubs."
              : "സ്വാഭാവിക അന്തരീക്ഷത്തിൽ വളർത്തുന്ന ഗുണനിലവാരമുള്ള മത്സ്യങ്ങൾ."}
          </p>
        </div>

        {/* Category Filter Chips Bar (Vibrant Green for Active Tab) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 mb-8 sm:mb-10 scrollbar-none snap-x px-2 sm:px-0">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip)}
                className={`h-9 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer snap-start flex items-center justify-center active:scale-95 ${
                  isSelected
                    ? "bg-[#5CB82A] text-white shadow-[0_4px_14px_rgba(92,184,42,0.4)] scale-105"
                    : "bg-white/85 text-[#13224E] hover:text-[#0284C7] hover:bg-white border border-white/70 shadow-[0_2px_8px_rgba(20,80,140,0.06)]"
                }`}
              >
                {lang === "en" ? chip.label : chip.labelMl}
              </button>
            );
          })}
        </div>

        {/* Carousel Container with Centered Left/Right Navigation Arrows */}
        <div
          className="relative group px-1 sm:px-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous fish"
            className="absolute -left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-white/90 shadow-[0_6px_20px_rgba(20,60,110,0.12)] text-[#13224E] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next fish"
            className="absolute -right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-white/90 shadow-[0_6px_20px_rgba(20,60,110,0.12)] text-[#13224E] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Continuous Wheel Horizontal Sliding Track */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden py-4 -my-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex gap-4 sm:gap-6 items-stretch will-change-transform"
              style={{
                transform: step > 0 ? `translateX(-${displayIndex * step - dragDelta}px)` : undefined,
                transition: enableTransition
                  ? "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {INFINITE_ITEMS.map((item, idx) => (
                <ProductClayCard
                  key={`${item.id}-${idx}`}
                  item={item}
                  index={idx}
                  lang={lang}
                  width={cardWidth}
                  onSelect={() => {
                    if (!wasDragged.current) {
                      setSelectedSpecies(item);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Pagination Indicator Dots (Green Elongated Active Pill) */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {SPECIES_CATALOG.map((_, dotIdx) => {
            const isActive = dotIdx === activeIdx;
            return (
              <button
                key={dotIdx}
                onClick={() => {
                  if (isResettingRef.current) return;
                  const now = Date.now();
                  if (now - lastActionRef.current < 180) return;
                  lastActionRef.current = now;

                  let diff = dotIdx - activeIdx;
                  if (diff > 2) diff -= N;
                  if (diff < -2) diff += N;
                  if (diff === 0) return;
                  setEnableTransition(true);
                  setDisplayIndex((prev) => prev + diff);
                }}
                aria-label={`Jump to fish product ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-7 h-2.5 bg-[#5CB82A] shadow-[0_2px_8px_rgba(92,184,42,0.4)]"
                    : "w-2.5 h-2.5 bg-[#96DCEE] hover:bg-[#5CB82A]/50"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Detail Modal for Hobbyists */}
      {selectedSpecies && (
        <SpeciesDetailModal
          item={selectedSpecies}
          lang={lang}
          onClose={() => setSelectedSpecies(null)}
        />
      )}
    </section>
  );
}

/**
 * 3D Fish Product Card (Matches Reference Image Exactly)
 */
function ProductClayCard({
  item,
  index,
  lang,
  width,
  onSelect,
}: {
  item: SpeciesItem;
  index: number;
  lang: "en" | "ml";
  width: number;
  onSelect: () => void;
}) {
  return (
    <div
      style={width > 0 ? { width: `${width}px`, minWidth: `${width}px` } : undefined}
      className="flex-shrink-0 w-[85%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start bg-white rounded-[28px] sm:rounded-[32px] p-3 sm:p-3.5 shadow-[0_12px_32px_rgba(30,80,130,0.08)] border border-white/90 hover:shadow-[0_18px_40px_rgba(30,80,130,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
      onClick={onSelect}
    >
      <div>
        {/* Framed Image Container (16:10 aspect ratio) */}
        <div className="relative w-full aspect-[16/10] rounded-[20px] sm:rounded-[22px] overflow-hidden bg-[#DCEFF5] mb-3.5 shadow-inner">
          <Image
            src={item.photo}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={index >= 12 && index <= 18}
          />

          {/* Top-Left Green Translucent Badge matching reference */}
          <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-[#5CB82A]/90 backdrop-blur-md shadow-sm z-10 flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
            <span className="text-white text-xs font-bold leading-none tracking-tight">
              {item.badge}
            </span>
          </div>
        </div>

        {/* Card Content Row */}
        <div className="flex items-center justify-between gap-3 px-1.5 pb-1">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-extrabold text-base sm:text-lg lg:text-[19px] text-[#13224E] group-hover:text-[#0284C7] transition-colors leading-snug truncate font-heading">
              {lang === "en" ? item.name : item.malayalamName}
            </h3>

            {/* Subtitle / Tagline */}
            <p className="text-xs sm:text-sm font-medium text-[#64748B] truncate mt-0.5">
              {lang === "en" ? item.tagline : item.malayalamTagline}
            </p>
          </div>

          {/* Circular Arrow Button (Matches reference bottom-right button) */}
          <a
            href={getWhatsAppUrl(item.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Order ${item.name} on WhatsApp`}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F0F3FA] border border-[#E4EAF4] text-[#13224E] shadow-sm flex items-center justify-center shrink-0 group/btn hover:bg-[#5CB82A] hover:text-white hover:border-[#5CB82A] hover:shadow-[0_4px_12px_rgba(92,184,42,0.35)] active:scale-90 transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] transition-transform group-hover/btn:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Modal dialog for full species details
 */
function SpeciesDetailModal({
  item,
  lang,
  onClose,
}: {
  item: SpeciesItem;
  lang: "en" | "ml";
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2038]/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF8] rounded-[32px] border-2 border-[#E8DCC2] p-5 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FFE9A0]/60 hover:bg-[#FFE9A0] flex items-center justify-center font-bold text-[#0E2038] transition-all cursor-pointer"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Modal Image */}
        <div className="relative w-full aspect-[16/10] rounded-[22px] overflow-hidden bg-[#DCEFF5] border border-[#CFE7EF] mb-4">
          <Image src={item.photo} alt={item.name} fill className="object-cover" />
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#5CB82A] shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{item.badge}</span>
          </span>
        </div>

        {/* Title & Scientific Info */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#13224E] mb-1 font-heading">
          {lang === "en" ? item.name : item.malayalamName}
        </h3>
        <p className="text-xs font-bold text-[#1F7A3E] mb-3">
          {item.scientificGroup} • Tank: {item.tankSize} • Care: {item.careLevel}
        </p>

        {/* Description */}
        <p className="text-sm font-medium text-[#0E2038]/85 leading-relaxed mb-4">
          {lang === "en" ? item.description : item.malayalamDescription}
        </p>

        {/* Farm Diet & Care */}
        <div className="p-3 bg-[#FFE9A0]/40 rounded-2xl mb-5 text-xs text-[#0E2038]/85 space-y-1">
          <p>
            <span className="font-bold">Farm Diet:</span> {item.diet}
          </p>
          <p>
            <span className="font-bold">Acclimatised to:</span> Kerala open-air mineral water
          </p>
        </div>

        {/* WhatsApp Action */}
        <a
          href={getWhatsAppUrl(item.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-full bg-[#5CB82A] hover:bg-[#4FA422] font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{lang === "en" ? "Order This Breed on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യുക"}</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
