"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SPECIES_CATALOG, SpeciesItem, getWhatsAppUrl } from "@/lib/content";

interface SpeciesSectionProps {
  lang: "en" | "ml";
}

const LIP_COLORS = [
  "clay-lip-blue",
  "clay-lip-orange",
  "clay-lip-green",
  "clay-lip-purple",
  "clay-lip-blue",
];

export function SpeciesSection({ lang }: SpeciesSectionProps) {
  return (
    <section id="species" className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#BDEBF5] overflow-hidden">
      {/* ============================================================== */}
      {/* Background Ambient Swimming Fish Crossing Behind Heading       */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* Subtle Electric Blue Guppy swimming LTR across upper area */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-ltr opacity-85"
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

        {/* Subtle Pink Guppy swimming RTL across lower area */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-rtl opacity-80"
          style={{
            bottom: "8%",
            left: 0,
            animationDuration: "32s",
            animationDelay: "-14s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "scaleX(-1)" }}>
            <div className="fish-bob fish-bob-gentle" style={{ animationDuration: "3.5s" }}>
              <div className="relative w-36 h-24">
                <Image
                  src="/clay/fish/pink-guppy.webp"
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

        {/* Ambient Rock at Left Edge */}
        <div className="absolute -bottom-2 left-2 w-28 h-24 opacity-70 hidden lg:block">
          <Image
            src="/clay/props/rock-large.webp"
            alt=""
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          {/* Orange Clay Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill-orange text-xs font-bold text-white mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>{lang === "en" ? "Fresh From Farm Tubs" : "ഫാമിൽ നിന്നും നേരിട്ട്"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold clay-heading-blue mb-3">
            {lang === "en" ? "Our Fish" : "ഞങ്ങളുടെ മത്സ്യങ്ങൾ"}
          </h2>

          <p className="text-base sm:text-lg font-medium text-[#0E2038]/85 leading-relaxed">
            {lang === "en"
              ? "Healthy, hardy Kerala stock bred in natural open-air mineral water tubs."
              : "സ്വാഭാവിക അന്തരീക്ഷത്തിൽ വളർത്തുന്ന ഗുണനിലവാരമുള്ള മത്സ്യങ്ങൾ."}
          </p>
        </div>

        {/* 5 Species Clay Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SPECIES_CATALOG.map((item, idx) => (
            <SpeciesClayTile
              key={item.id}
              item={item}
              index={idx}
              lipClass={LIP_COLORS[idx % LIP_COLORS.length]}
              lang={lang}
            />
          ))}
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
  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={`clay-tile p-5 sm:p-6 flex flex-col justify-between ${lipClass}`}
    >
      <div>
        {/* Farm Clay 3D Illustration inside 4:3 rounded frame */}
        <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-[#FFF3DC] border-2 border-[#F0DEC0] mb-5 shadow-inner">
          <Image
            src={item.photo}
            alt={`3D clay illustration of ${item.name} bred at Midhula Farm Hut`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3.5 py-1 rounded-full text-xs font-bold text-white clay-pill-orange shadow-md z-10">
            {item.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-extrabold text-2xl text-[#1F4FFF] mb-1">
          {lang === "en" ? item.name : item.malayalamName}
        </h3>

        {/* Scientific / Sub info */}
        <p className="text-xs font-bold text-[#1F7A3E] mb-3">
          {item.scientificGroup} • Tank: {item.tankSize}
        </p>

        {/* Description */}
        <p className="text-sm text-[#0E2038]/85 leading-relaxed mb-6 font-medium">
          {lang === "en" ? item.description : item.malayalamDescription}
        </p>
      </div>

      {/* "Ask on WhatsApp" Orange Clay Button with 3D Clay Icon */}
      <a
        href={getWhatsAppUrl(item.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="clay-btn-orange w-full py-3.5 px-4 rounded-full font-bold text-sm inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_6px_18px_rgba(255,106,19,0.35)]"
      >
        <div className="relative w-5 h-5 shrink-0">
          <Image
            src="/clay/icons/whatsapp.webp"
            alt="WhatsApp"
            fill
            className="object-contain"
          />
        </div>
        <span>{lang === "en" ? "Ask on WhatsApp" : "വാട്സ്ആപ്പിൽ ചോദിക്കൂ"}</span>
      </a>
    </motion.div>
  );
}
