"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SPECIES_CATALOG, SpeciesItem, getWhatsAppUrl } from "@/lib/content";

interface SpeciesSectionProps {
  lang: "en" | "ml";
}

const CATEGORY_CHIPS = [
  { id: "all", label: "All", labelMl: "എല്ലാം" },
  { id: "guppies", label: "Guppies", labelMl: "ഗുപ്പികൾ" },
  { id: "platies", label: "Platies", labelMl: "പ്ലാറ്റികൾ" },
  { id: "swordtails", label: "Swordtails", labelMl: "സ്വാർഡ്‌ടെയിലുകൾ" },
  { id: "shrimp", label: "Shrimp", labelMl: "ചെമ്മീൻ" },
  { id: "crayfish", label: "Crayfish", labelMl: "ക്രേഫിഷ്" },
];

const LIP_COLORS = [
  "clay-lip-blue",
  "clay-lip-orange",
  "clay-lip-green",
  "clay-lip-purple",
  "clay-lip-blue",
];

export function SpeciesSection({ lang }: SpeciesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return SPECIES_CATALOG;
    return SPECIES_CATALOG.filter((item) => item.id === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="species" className="relative py-10 sm:py-24 px-3 sm:px-8 bg-[#BDEBF5] overflow-hidden">
      {/* Background Ambient Swimming Fish Crossing Behind Heading */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* Subtle Electric Blue Guppy swimming LTR */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-ltr opacity-85 hidden sm:block"
          style={{
            top: "14%",
            left: 0,
            animationDuration: "28s",
            animationDelay: "-8s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "none" }}>
            <div className="fish-bob fish-bob-gentle" style={{ animationDuration: "3.2s" }}>
              <div className="relative w-36 h-24">
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

        {/* Ambient Seaweed at Right Edge */}
        <div className="absolute -bottom-2 right-2 w-32 h-44 opacity-75 hidden lg:block">
          <Image
            src="/clay/props/seaweed-1.webp"
            alt=""
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>

      {/* 3D Electric Blue Clay Seashell peeking from right edge (matching reference mockup) */}
      <div
        className="absolute -right-8 sm:-right-16 top-[28%] sm:top-[22%] w-32 sm:w-60 h-36 sm:h-64 pointer-events-none select-none z-10"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <Image
            src="/clay/props/blue-shell.webp"
            alt=""
            fill
            className="object-contain object-right drop-shadow-[0_10px_24px_rgba(31,79,255,0.22)]"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          {/* Orange Clay Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full clay-pill-orange text-xs font-bold text-white mb-2.5 sm:mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{lang === "en" ? "Fresh From Farm Tubs" : "ഫാമിൽ നിന്നും നേരിട്ട്"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold clay-heading-blue mb-2">
            {lang === "en" ? "Our Fish" : "ഞങ്ങളുടെ മത്സ്യങ്ങൾ"}
          </h2>

          <p className="text-xs sm:text-base font-medium text-[#0E2038]/85 leading-relaxed max-w-lg mx-auto">
            {lang === "en"
              ? "Healthy, hardy Kerala stock bred in natural open-air mineral water tubs."
              : "സ്വാഭാവിക അന്തരീക്ഷത്തിൽ വളർത്തുന്ന ഗുണനിലവാരമുള്ള മത്സ്യങ്ങൾ."}
          </p>
        </div>

        {/* Sticky Horizontally Scrollable Category Filter Chips */}
        <div className="sticky top-14 sm:top-16 z-20 py-2.5 mb-5 sm:mb-8 -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x justify-start sm:justify-center">
            {CATEGORY_CHIPS.map((chip) => {
              const isSelected = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  data-category={chip.id}
                  onClick={() => setSelectedCategory(chip.id)}
                  className={`h-9 px-4 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer snap-start flex items-center justify-center active:scale-[0.97] ${
                    isSelected
                      ? "clay-pill-orange text-white shadow-md"
                      : "clay-pill text-[#0E2038] hover:text-[#1F4FFF]"
                  }`}
                >
                  {lang === "en" ? chip.label : chip.labelMl}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Mobile Grid (<640px), 2-3 Column Tablet, 3-Column Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <SpeciesClayTile
                key={item.id}
                item={item}
                index={idx}
                lipClass={LIP_COLORS[idx % LIP_COLORS.length]}
                lang={lang}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SpeciesClayTile({
  item,
  index,
  lipClass,
  lang,
}: {
  item: SpeciesItem;
  index: number;
  lipClass: string;
  lang: "en" | "ml";
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={`clay-tile p-2.5 sm:p-5 flex flex-col justify-between rounded-[22px] sm:rounded-[32px] ${lipClass}`}
    >
      <div>
        {/* 3D Clay Illustration Frame: 1:1 on mobile, 4:3 on desktop */}
        <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-[18px] sm:rounded-[24px] overflow-hidden bg-[#FFF3DC] border-2 border-[#F0DEC0] mb-2.5 sm:mb-4 shadow-inner">
          <Image
            src={item.photo}
            alt={`3D clay illustration of ${item.name} bred at Midhula Farm Hut`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 380px"
            className="object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />

          {/* Compact Category Badge */}
          <span className="absolute top-2 left-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white clay-pill-orange shadow-sm z-10">
            {item.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-extrabold text-sm sm:text-xl lg:text-2xl text-[#1F4FFF] mb-0.5 sm:mb-1 leading-snug">
          {lang === "en" ? item.name : item.malayalamName}
        </h3>

        {/* Scientific & Tank Info (2 lines max on mobile) */}
        <p className="text-[10px] sm:text-xs font-bold text-[#1F7A3E] mb-1.5 sm:mb-2 leading-tight line-clamp-1">
          {item.scientificGroup} • Tank: {item.tankSize}
        </p>

        {/* Description: 2 lines on mobile, expandable on tap */}
        <div className="mb-3 sm:mb-5">
          <p
            className={`text-xs sm:text-sm text-[#0E2038]/85 leading-relaxed font-medium ${
              expanded ? "" : "line-clamp-2 sm:line-clamp-none"
            }`}
          >
            {lang === "en" ? item.description : item.malayalamDescription}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="sm:hidden text-[11px] font-bold text-[#1F4FFF] hover:underline mt-0.5 cursor-pointer block"
          >
            {expanded ? (lang === "en" ? "Less ▲" : "കുറയ്ക്കുക ▲") : (lang === "en" ? "More ▼" : "കൂടുതൽ ▼")}
          </button>
        </div>
      </div>

      {/* Compact Orange Clay WhatsApp Button (min 44px tap target) */}
      <a
        href={getWhatsAppUrl(item.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="clay-btn-orange w-full h-10 sm:h-12 min-h-[44px] px-3 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,106,19,0.3)] active:scale-[0.97] transition-transform"
      >
        <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0">
          <Image
            src="/clay/icons/whatsapp.webp"
            alt="WhatsApp"
            fill
            className="object-contain"
          />
        </div>
        <span>{lang === "en" ? "Ask WhatsApp" : "വാട്സ്ആപ്പ്"}</span>
      </a>
    </motion.div>
  );
}
