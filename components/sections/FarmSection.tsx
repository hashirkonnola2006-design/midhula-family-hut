"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FARM_STORY } from "@/lib/content";

interface FarmSectionProps {
  lang: "en" | "ml";
  onOpenVideo: () => void;
}

export function FarmSection({ lang, onOpenVideo }: FarmSectionProps) {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <section id="farm" className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#FFF8E7] overflow-hidden">
      {/* ============================================================== */}
      {/* Background Ambient Swimming Fish Crossing Behind Heading       */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* Swordtail swimming RTL across mid area */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-rtl opacity-80"
          style={{
            top: "22%",
            left: 0,
            animationDuration: "26s",
            animationDelay: "-11s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "scaleX(-1)" }}>
            <div className="fish-bob fish-bob-subtle" style={{ animationDuration: "2.8s" }}>
              <div className="relative w-40 h-16">
                <Image
                  src="/clay/fish/swordtail.webp"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Small Orange Guppy swimming LTR */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-ltr opacity-85"
          style={{
            bottom: "12%",
            left: 0,
            animationDuration: "22s",
            animationDelay: "-5s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "none" }}>
            <div className="fish-bob fish-bob-gentle" style={{ animationDuration: "2.5s" }}>
              <div className="relative w-28 h-14">
                <Image
                  src="/clay/fish/orange-small-1.webp"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Seaweed at Left Edge */}
        <div className="absolute -bottom-2 left-0 w-32 h-48 opacity-75 hidden lg:block">
          <Image
            src="/clay/props/seaweed-2.webp"
            alt=""
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Farm Story */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Orange Clay Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill-orange text-xs font-bold text-white mb-4 w-fit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{lang === "en" ? "Nooluvally, Thrissur" : "നൂലുവാള്ളി, തൃശ്ശൂർ"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold clay-heading-blue mb-3 leading-tight">
              {lang === "en" ? "Inside the Farm" : "ഫാം കാഴ്ചകൾ"}
            </h2>

            <p className="text-base sm:text-lg font-bold text-[#1F7A3E] mb-5">
              {lang === "en" ? FARM_STORY.subtitle : FARM_STORY.malayalamSubtitle}
            </p>

            <div className="space-y-4 text-sm sm:text-base text-[#0E2038]/85 leading-relaxed mb-8 font-medium">
              {(lang === "en" ? FARM_STORY.paragraphs : FARM_STORY.malayalamParagraphs).map(
                (p, idx) => (
                  <p key={idx}>{p}</p>
                )
              )}
            </div>

            {/* Farm highlights grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {[
                "Kerala Mineral Groundwater",
                "Live Micro-Fauna Nutrition",
                "Zero Artificial Hormones",
                "Home Tank Acclimatised",
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFFDF7] border-2 border-[#F0DEC0] shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1F7A3E]/15 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#1F7A3E] stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#0E2038]">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Farm Tour CTA Button with 3D Clay YouTube Icon */}
            <div>
              <button
                onClick={onOpenVideo}
                className="clay-btn-orange px-8 py-3.5 rounded-full font-bold text-sm inline-flex items-center gap-3 cursor-pointer shadow-[0_6px_20px_rgba(255,106,19,0.35)]"
              >
                <div className="relative w-6 h-6 shrink-0">
                  <Image
                    src="/clay/icons/youtube.webp"
                    alt="YouTube"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{lang === "en" ? "Watch Farm Tour on YouTube" : "യൂട്യൂബിൽ ഫാം കാണൂ"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Photo Collage & Video Thumbnail Tile */}
          <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
            {/* Main Interactive Photo Tile */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="clay-tile p-4 sm:p-5 flex flex-col gap-4"
            >
              <div className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden bg-[#FFF3DC] border-2 border-[#F0DEC0] shadow-inner group cursor-pointer"
                   onClick={onOpenVideo}>
                <Image
                  src={FARM_STORY.gallery[activePhoto]?.src || FARM_STORY.gallery[0].src}
                  alt="Midhula Farm Hut ornamental fish breeding facility"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Video Play Overlay */}
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/35 transition-colors">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg group-hover:scale-110 transition-transform">
                    <Image
                      src="/clay/icons/youtube.webp"
                      alt="Play Tour"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold">
                  {lang === "en" ? "Click to Watch Farm Tour" : "ഫാം ടൂർ കാണാൻ ക്ലിക്ക് ചെയ്യൂ"}
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {FARM_STORY.gallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activePhoto === idx
                        ? "border-[#1F4FFF] scale-105 shadow-md"
                        : "border-[#F0DEC0] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={`Farm thumbnail ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
