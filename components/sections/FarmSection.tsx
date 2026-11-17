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
    <section id="farm" className="relative py-10 sm:py-24 px-3 sm:px-8 bg-[#FFF8E7] overflow-hidden">
      {/* Background Ambient Swimming Fish Crossing Behind Heading */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* Swordtail swimming RTL across mid area (Desktop only to prevent clutter on mobile) */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-rtl opacity-80 hidden sm:block"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Farm Story */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Orange Clay Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full clay-pill-orange text-xs font-bold text-white mb-2.5 sm:mb-3 w-fit shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{lang === "en" ? "Nooluvally, Thrissur" : "നൂലുവാള്ളി, തൃശ്ശൂർ"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold clay-heading-blue mb-2 leading-tight">
              {lang === "en" ? "Inside the Farm" : "ഫാം കാഴ്ചകൾ"}
            </h2>

            <p className="text-sm sm:text-lg font-bold text-[#1F7A3E] mb-3 sm:mb-4">
              {lang === "en" ? FARM_STORY.subtitle : FARM_STORY.malayalamSubtitle}
            </p>

            <div className="space-y-2.5 sm:space-y-4 text-xs sm:text-base text-[#0E2038]/85 leading-relaxed mb-5 sm:mb-7 font-medium">
              <p>
                {lang === "en" ? FARM_STORY.paragraphs[0] : FARM_STORY.malayalamParagraphs[0]}
              </p>
              <p className="hidden sm:block">
                {lang === "en" ? FARM_STORY.paragraphs[1] : FARM_STORY.malayalamParagraphs[1]}
              </p>
            </div>

            {/* Farm highlights: 2-column compact grid on mobile */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-7">
              {[
                { en: "Mineral Groundwater", ml: "മിനറൽ ഗ്രൗണ്ട് വാട്ടർ" },
                { en: "Live Micro-Fauna", ml: "ലൈവ് മൈക്രോ ഫൗണ" },
                { en: "Zero Hormones", ml: "ഹോർമോൺ രഹിതം" },
                { en: "Tank Acclimatised", ml: "അക്ലിമറ്റൈസ്ഡ്" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border-2 border-[#F0DEC0] shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-[#1F7A3E]/15 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#1F7A3E] stroke-[3]" />
                  </div>
                  <span className="text-[11px] sm:text-sm font-bold text-[#0E2038] leading-tight">
                    {lang === "en" ? item.en : item.ml}
                  </span>
                </div>
              ))}
            </div>

            {/* Farm Tour CTA Button */}
            <div>
              <button
                onClick={onOpenVideo}
                className="clay-btn-orange w-full sm:w-auto h-11 sm:h-13 px-6 sm:px-8 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_6px_20px_rgba(255,106,19,0.35)] active:scale-[0.97]"
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 shrink-0">
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
          <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-5">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="clay-tile p-3 sm:p-5 flex flex-col gap-3 rounded-[24px] sm:rounded-[32px]"
            >
              <div
                className="relative w-full aspect-[16/10] rounded-[18px] sm:rounded-[24px] overflow-hidden bg-[#FFF3DC] border-2 border-[#F0DEC0] shadow-inner group cursor-pointer"
                onClick={onOpenVideo}
              >
                <Image
                  src={FARM_STORY.gallery[activePhoto]?.src || FARM_STORY.gallery[0].src}
                  alt="Midhula Farm Hut ornamental fish breeding facility"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Video Play Overlay */}
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/35 transition-colors">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 drop-shadow-lg group-hover:scale-110 transition-transform">
                    <Image
                      src="/clay/icons/youtube.webp"
                      alt="Play Tour"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold">
                  {lang === "en" ? "Click to Watch Farm Tour" : "ഫാം ടൂർ കാണാൻ ക്ലിക്ക് ചെയ്യൂ"}
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {FARM_STORY.gallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
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
