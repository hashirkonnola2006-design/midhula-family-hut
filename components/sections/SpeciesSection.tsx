"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from "lucide-react";
import { SPECIES_CATALOG, SpeciesItem, getWhatsAppUrl } from "@/lib/content";

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

export function SpeciesSection({ lang }: SpeciesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesItem | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to card at specific index
  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cards = container.children;
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      // Center card on mobile, align to start on desktop
      const isMobile = window.innerWidth < 640;
      const targetLeft = isMobile
        ? card.offsetLeft - (container.clientWidth - card.clientWidth) / 2
        : card.offsetLeft;

      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  }, []);

  // Sync category filter chip when currentIndex changes
  useEffect(() => {
    const activeItem = SPECIES_CATALOG[currentIndex];
    if (activeItem) {
      setSelectedCategory(activeItem.id);
    }
  }, [currentIndex]);

  // Handle Category Chip Click
  const handleChipClick = (chip: typeof CATEGORY_CHIPS[0]) => {
    setSelectedCategory(chip.id);
    scrollToIndex(chip.itemIndex);
  };

  // Previous & Next navigation
  const handlePrev = () => {
    const newIdx = currentIndex === 0 ? SPECIES_CATALOG.length - 1 : currentIndex - 1;
    scrollToIndex(newIdx);
  };

  const handleNext = () => {
    const newIdx = (currentIndex + 1) % SPECIES_CATALOG.length;
    scrollToIndex(newIdx);
  };

  // Autoplay functionality: moves automatically, stops when hovered or touched
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % SPECIES_CATALOG.length;
        scrollToIndex(next);
        return next;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isHovered, scrollToIndex]);

  // Track manual scroll to update active pagination index
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;

    let closestIdx = 0;
    let minDiff = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const card = child as HTMLElement;
      const diff = Math.abs(card.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== currentIndex) {
      setCurrentIndex(closestIdx);
    }
  }, [currentIndex]);

  return (
    <section
      id="species"
      className="relative py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#BDEBF5] overflow-hidden select-none"
    >
      {/* Background Ambient Elements matching reference */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* Ambient swimming orange/white fish at top right (facing left) */}
        <div
          className="absolute top-6 sm:top-10 right-4 sm:right-16 w-20 sm:w-28 h-14 sm:h-20 opacity-90 hidden sm:block pointer-events-none"
          style={{
            animation: "swimFloat 6s ease-in-out infinite alternate",
          }}
        >
          <div className="relative w-full h-full -scale-x-100">
            <Image
              src="/clay/fish/orange-small-1.webp"
              alt=""
              fill
              className="object-contain drop-shadow-[0_6px_12px_rgba(20,60,110,0.18)]"
            />
          </div>
        </div>

        {/* Electric Blue Clay Fan Shell on right edge matching reference */}
        <div className="absolute top-8 sm:top-12 -right-8 sm:-right-12 w-28 sm:w-36 h-28 sm:h-36 opacity-95 pointer-events-none select-none z-0">
          <Image
            src="/clay/props/blue-shell.webp"
            alt=""
            fill
            unoptimized
            className="object-contain drop-shadow-[0_8px_20px_rgba(20,60,140,0.22)] -rotate-12"
          />
        </div>

        {/* Ambient Blue Clay Bubbles */}
        <div className="absolute top-28 left-6 sm:left-12 w-6 sm:w-8 h-6 sm:h-8 opacity-80 pointer-events-none">
          <Image src="/clay/fx/bubble-1.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-52 left-16 sm:left-28 w-4 sm:w-5 h-4 sm:h-5 opacity-70 pointer-events-none">
          <Image src="/clay/fx/bubble-2.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-36 right-8 sm:right-24 w-5 sm:w-7 h-5 sm:h-7 opacity-75 pointer-events-none">
          <Image src="/clay/fx/bubble-3.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-16 right-12 sm:right-32 w-7 sm:w-9 h-7 sm:h-9 opacity-70 pointer-events-none">
          <Image src="/clay/fx/bubble-4.webp" alt="" fill className="object-contain" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          {/* Orange Clay Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full clay-pill-orange text-xs font-bold text-white mb-2.5 sm:mb-3 shadow-[0_4px_12px_rgba(255,106,19,0.3)]">
            <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
            <span>{lang === "en" ? "Fresh From Farm Tubs" : "ഫാമിൽ നിന്നും നേരിട്ട്"}</span>
          </div>

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
                className={`h-9 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer snap-start flex items-center justify-center active:scale-95 ${
                  isSelected
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
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
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

          {/* 3-Cards Horizontal Scroll Track */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-3 px-1 sm:px-2 scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {SPECIES_CATALOG.map((item, idx) => (
              <ProductClayCard
                key={item.id}
                item={item}
                index={idx}
                lang={lang}
                onSelect={() => setSelectedSpecies(item)}
              />
            ))}
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
            const isActive = dotIdx === currentIndex;
            return (
              <button
                key={dotIdx}
                onClick={() => scrollToIndex(dotIdx)}
                aria-label={`Jump to fish product ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
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
            ? "Hover or touch to pause • Tap arrow to order directly on WhatsApp"
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
  onSelect,
}: {
  item: SpeciesItem;
  index: number;
  lang: "en" | "ml";
  onSelect: () => void;
}) {
  return (
    <div
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
            priority
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
