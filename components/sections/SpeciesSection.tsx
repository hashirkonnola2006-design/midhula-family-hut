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
  { id: "all", label: "All", labelMl: "എല്ലാം", itemIndex: 0 },
  { id: "guppies", label: "Guppies", labelMl: "ഗുപ്പികൾ", itemIndex: 0 },
  { id: "platies", label: "Platies", labelMl: "പ്ലാറ്റികൾ", itemIndex: 1 },
  { id: "swordtails", label: "Swordtails", labelMl: "സ്വാർഡ്‌ടെയിലുകൾ", itemIndex: 2 },
  { id: "crayfish", label: "Crayfish", labelMl: "ക്രേഫിഷ്", itemIndex: 3 },
  { id: "shrimp", label: "Shrimp", labelMl: "ചെമ്മീൻ", itemIndex: 4 },
];

const N = SPECIES_CATALOG.length; // 5 items
// 7 repeated sets (35 items total) gives a wide runway so rapid clicking never runs out of cards
const REPEAT_SETS = 7;
const CENTER_SET = 3; // Sets 0, 1, 2, [3], 4, 5, 6
const BASE_INDEX = CENTER_SET * N; // 15
const INFINITE_ITEMS = Array.from({ length: REPEAT_SETS }, () => SPECIES_CATALOG).flat();

export function SpeciesSection({ lang }: SpeciesSectionProps) {
  // Start at Set 3 (middle set: index BASE_INDEX = 15)
  const [displayIndex, setDisplayIndex] = useState(BASE_INDEX);
  const [enableTransition, setEnableTransition] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesItem | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const wasDragged = useRef(false);
  const [dragDelta, setDragDelta] = useState(0);

  // Guards against rapid click flooding and desync during silent reset
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
      if (selectedCategory !== "all" || activeIdx !== 0) {
        setSelectedCategory(activeItem.id);
      }
    }
  }, [activeIdx, selectedCategory]);

  // Handle seamless wrap-around when transition finishes
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform" || e.target !== e.currentTarget) return;

    // If displayIndex drifted away from the center set (below index 10 or at/above 20),
    // normalize it back into the center set [15..19] silently.
    if (displayIndex < BASE_INDEX - N || displayIndex >= BASE_INDEX + 2 * N) {
      const activeModulo = ((displayIndex % N) + N) % N;
      const normalized = BASE_INDEX + activeModulo;
      if (normalized !== displayIndex) {
        isResettingRef.current = true;
        setEnableTransition(false);
        setDisplayIndex(normalized);
      }
    }
  };

  // Re-enable transition on the next frame after silent repositioning
  useEffect(() => {
    if (!enableTransition) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          isResettingRef.current = false;
        });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [enableTransition]);

  // Navigate to next card with rapid-click throttling & safety bounds wrapping
  const handleNext = useCallback(() => {
    if (isResettingRef.current) return;
    const now = Date.now();
    if (now - lastActionRef.current < 160) return;
    lastActionRef.current = now;

    setEnableTransition(true);
    setDisplayIndex((prev) => {
      // Safety guard: if near the extreme buffer edge (rare), wrap into center
      if (prev >= REPEAT_SETS * N - 4) {
        return BASE_INDEX + (((prev + 1) % N) + N) % N;
      }
      return prev + 1;
    });
  }, []);

  // Navigate to previous card with rapid-click throttling & safety bounds wrapping
  const handlePrev = useCallback(() => {
    if (isResettingRef.current) return;
    const now = Date.now();
    if (now - lastActionRef.current < 160) return;
    lastActionRef.current = now;

    setEnableTransition(true);
    setDisplayIndex((prev) => {
      // Safety guard: if near the extreme left buffer edge, wrap into center
      if (prev <= 3) {
        return BASE_INDEX + (((prev - 1) % N) + N) % N;
      }
      return prev - 1;
    });
  }, []);

  // Handle Category Chip Click via shortest circular path
  const handleChipClick = (chip: typeof CATEGORY_CHIPS[0]) => {
    if (isResettingRef.current) return;
    const now = Date.now();
    if (now - lastActionRef.current < 180) return;
    lastActionRef.current = now;

    setSelectedCategory(chip.id);
    const targetIdx = chip.itemIndex;
    let diff = targetIdx - activeIdx;
    if (diff > 2) diff -= N;
    if (diff < -2) diff += N;
    if (diff === 0) return;

    setEnableTransition(true);
    setDisplayIndex((prev) => prev + diff);
  };

  // Autoplay functionality: moves automatically like a continuous wheel, resets timer on user actions
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, handleNext, displayIndex]);

  // Touch Swipe Handlers for mobile
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
      className="relative py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#BDEBF5] overflow-hidden select-none"
    >
      <span id="fish" className="absolute top-0 pointer-events-none" style={{ scrollMarginTop: "88px" }} />

      {/* Unified Sprite Sheet Decor: Pebbles (bottom-left), Shell (bottom-right), Swordtail (upper-left) */}
      <Decor
        name="swordtail"
        className="top-24 lg:top-28 left-4 lg:left-8 xl:left-14"
        size={80}
        flip={true}
        delay={0.4}
        shadow
      />
      <Decor
        name="pebbles"
        className="bottom-0 left-4 lg:left-8 xl:left-14"
        size={84}
        shadow
      />
      <Decor
        name="shell"
        className="bottom-0 right-4 lg:right-8 xl:right-14"
        size={70}
        shadow
      />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header (Circled tag removed as requested) */}
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold clay-heading-blue mb-2.5 tracking-tight">
                {lang === "en" ? "Our Fish" : "ഞങ്ങളുടെ മത്സ്യങ്ങൾ"}
              </h2>

              <p className="text-sm sm:text-base font-semibold text-[#0E2038]/80 leading-relaxed max-w-lg mx-auto">
                {lang === "en"
                  ? "Healthy, hardy Kerala stock bred in natural open-air mineral water tubs."
                  : "സ്വാഭാവിക അന്തരീക്ഷത്തിൽ വളർത്തുന്ന ഗുണനിലവാരമുള്ള മത്സ്യങ്ങൾ."}
              </p>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 mb-6 sm:mb-10 scrollbar-none snap-x px-2 sm:px-0">
              {CATEGORY_CHIPS.map((chip) => {
                const isSelected = selectedCategory === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip)}
                    className={`h-9 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer snap-start flex items-center justify-center active:scale-95 ${isSelected
                      ? "clay-pill-orange text-white shadow-[0_4px_14px_rgba(255,106,19,0.35)] scale-105"
                      : "clay-pill text-[#0E2038] hover:text-[#1F4FFF] hover:bg-white"
                      }`}
                  >
                    {lang === "en" ? chip.label : chip.labelMl}
                  </button>
                );
              })}
            </div>

            {/* Carousel Container with Interactive Left/Right Clay Controls */}
            <div
              className="relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Left Arrow Button (Desktop/Tablet) */}
              <button
                onClick={handlePrev}
                aria-label="Previous fish"
                className="hidden sm:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FFFDF8] border border-[#E8DCC2] shadow-[0_6px_18px_rgba(20,50,90,0.15)] text-[#0E2038] items-center justify-center hover:bg-[#FF6A13] hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow Button (Desktop/Tablet) */}
              <button
                onClick={handleNext}
                aria-label="Next fish"
                className="hidden sm:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#FFFDF8] border border-[#E8DCC2] shadow-[0_6px_18px_rgba(20,50,90,0.15)] text-[#0E2038] items-center justify-center hover:bg-[#FF6A13] hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
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

              {/* Autoplay Pause/Play Status Indicator (Subtle Floating Pill) */}
              {isHovered && (
                <div className="absolute top-1 right-2 sm:right-4 z-20 pointer-events-none">
                  <span className="text-[10px] font-bold text-[#0E2038]/60 bg-white/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/50 shadow-sm animate-fade-in">
                    ⏸ Paused
                  </span>
                </div>
              )}
            </div>

            {/* Carousel Pagination Indicator Dots */}
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
                    className={`transition-all duration-300 rounded-full cursor-pointer ${isActive
                      ? "w-8 h-2.5 bg-[#FF6A13] shadow-[0_2px_8px_rgba(255,106,19,0.4)]"
                      : "w-2.5 h-2.5 bg-[#8ED8EA] hover:bg-[#FF6A13]/50"
                      }`}
                  />
                );
              })}
            </div>

            {/* Quick Help Subtext */}
            <p className="text-center text-xs font-semibold text-[#0E2038]/50 mt-3 sm:mt-4">
              {lang === "en"
                ? "Hover or touch to pause • Continuous wheel auto-scrolls through breeds"
                : "ഓർഡർ ചെയ്യുവാൻ അമ്പടയാളത്തിൽ ക്ലിക്ക് ചെയ്യുക"}
            </p>
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
         * 3D Clay Product Card (Matches Reference Image Exactly)
         * Sized so exactly 3 cards fit on desktop, 2 on tablet, 1+peek on mobile
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
          className="flex-shrink-0 w-[85%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] snap-start bg-[#FFFDF9] rounded-[28px] sm:rounded-[34px] border-2 border-[#E8DCC2]/90 p-3 sm:p-4 shadow-[0_10px_28px_rgba(14,32,56,0.07)] hover:shadow-[0_16px_36px_rgba(14,32,56,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          onClick={onSelect}
        >
          <div>
            {/* Framed Image Container */}
            <div className="relative w-full aspect-[16/10] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#DCEFF5] border border-[#CFE7EF] mb-3.5 sm:mb-4 shadow-inner">
              <Image
                src={item.photo}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 380px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index >= 12 && index <= 18}
                unoptimized
              />

              {/* Top-Left Orange Clay Badge */}
              <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white clay-pill-orange shadow-[0_3px_8px_rgba(255,106,19,0.35)] z-10">
                {item.badge}
              </div>
            </div>

            {/* Card Content Row */}
            <div className="flex items-center justify-between gap-3 px-1 pb-1">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="font-extrabold text-base sm:text-lg lg:text-xl text-[#0E2038] group-hover:text-[#1F4FFF] transition-colors leading-snug truncate">
                  {lang === "en" ? item.name : item.malayalamName}
                </h3>

                {/* Subtitle / Tagline from reference mockup */}
                <p className="text-xs sm:text-sm font-semibold text-[#5A6E82] truncate mt-0.5">
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
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFF5E6] border border-[#F0DEC0] text-[#0E2038] shadow-sm flex items-center justify-center shrink-0 group/btn hover:bg-[#FF6A13] hover:text-white hover:border-[#FF6A13] hover:shadow-[0_4px_12px_rgba(255,106,19,0.35)] active:scale-90 transition-all cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-0.5" />
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
              <Image src={item.photo} alt={item.name} fill className="object-cover" unoptimized />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white clay-pill-orange shadow-sm">
                {item.badge}
              </span>
            </div>

            {/* Title & Scientific Info */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F4FFF] mb-1">
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
              className="w-full h-12 rounded-full clay-btn-green font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{lang === "en" ? "Order This Breed on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യുക"}</span>
              <span>→</span>
            </a>
          </div>
        </div>
        );
}
