"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";

interface FarmSectionProps {
  lang: "en" | "ml";
  onOpenVideo?: () => void;
}

export interface PlaylistVideo {
  id: string;
  title: string;
  titleMl: string;
  subtitle: string;
  subtitleMl: string;
  duration: string;
  thumbnail: string;
  previewImage: string;
}

const PLAYLIST_VIDEOS: PlaylistVideo[] = [
  {
    id: "Nb7lEGYEp8o",
    title: "Our Fish Collection",
    titleMl: "ഞങ്ങളുടെ മത്സ്യ ശേഖരം",
    subtitle: "A glimpse of our beautiful fishes.",
    subtitleMl: "മനോഹരമായ മത്സ്യങ്ങളുടെ ഒരു ദൃശ്യം.",
    duration: "2:15",
    thumbnail: "/clay/farm/playlist-1-hd.webp",
    previewImage: "/clay/farm/player-preview.webp",
  },
  {
    id: "mbYrTBN6lGs",
    title: "Farm Setup",
    titleMl: "ഫാം സെറ്റപ്പ്",
    subtitle: "Our modern farming setup.",
    subtitleMl: "ഞങ്ങളുടെ ആധുനിക ഫാം ഒരുക്കങ്ങൾ.",
    duration: "1:48",
    thumbnail: "/clay/farm/playlist-2-hd.webp",
    previewImage: "/clay/farm/player-preview.webp",
  },
  {
    id: "RFvvwpDLLN0",
    title: "Feeding Time",
    titleMl: "തീറ്റ കൊടുക്കുന്ന സമയം",
    subtitle: "How we feed our fishes.",
    subtitleMl: "മത്സ്യങ്ങൾക്ക് ഭക്ഷണം നൽകുന്ന വിധം.",
    duration: "3:10",
    thumbnail: "/clay/farm/playlist-3-hd.webp",
    previewImage: "/clay/farm/player-preview.webp",
  },
  {
    id: "rVtX4Ns7N9Y",
    title: "A Day at the Farm",
    titleMl: "ഫാമിലെ ഒരു ദിനം",
    subtitle: "Life at Midhula Farm Hut.",
    subtitleMl: "മിഥുല ഫാം ഹട്ടിലെ ജീവിതം.",
    duration: "2:20",
    thumbnail: "/clay/farm/playlist-4-hd.webp",
    previewImage: "/clay/farm/player-preview.webp",
  },
];

export function FarmSection({ lang }: FarmSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const activeVideo = PLAYLIST_VIDEOS[selectedIndex];

  const handleSelectVideo = (index: number) => {
    setSelectedIndex(index);
    setIsPlaying(true);
    if (playerRef.current && window.innerWidth < 1024) {
      playerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      id="farm"
      className="relative bg-[#FAF4E8] text-[#1E293B] pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      {/* ============================================================ */}
      {/* AMBIENT DECORATIONS: Floating Clay Fish & Animated Bubbles   */}
      {/* ============================================================ */}

      {/* Floating Orange Goldfish (Left Side) with Dynamic Animated Bubbles */}
      <div className="absolute left-2 sm:left-6 lg:left-10 top-[44%] -translate-y-1/2 pointer-events-none z-10 hidden sm:block animate-float-slow select-none">
        <Image
          src="/clay/farm/clay-goldfish-left-hd.webp"
          alt="Clay Goldfish"
          width={200}
          height={130}
          className="w-16 sm:w-22 h-auto drop-shadow-md"
        />
      </div>

      {/* Dynamic Animated Clay Bubbles Left */}
      <div className="absolute left-6 sm:left-14 top-14 w-7 h-7 sm:w-9 sm:h-9 pointer-events-none z-0 hidden sm:block animate-bubble-float opacity-85">
        <Image src="/clay/fx/clay-bubble.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute left-10 sm:left-22 top-32 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none z-0 hidden sm:block animate-float-delayed opacity-75">
        <Image src="/clay/fx/bubble-1.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute left-4 sm:left-12 top-[62%] w-6 h-6 sm:w-7 sm:h-7 pointer-events-none z-0 hidden sm:block animate-bubble-drift opacity-80">
        <Image src="/clay/fx/bubble-2.webp" alt="" fill className="object-contain" />
      </div>

      {/* Dynamic Animated Clay Bubbles & Swimming Guppy Right */}
      <div className="absolute right-3 sm:right-6 lg:right-10 top-[54%] pointer-events-none z-10 hidden lg:block animate-float select-none">
        <Image
          src="/clay/fish/blue-guppy.webp"
          alt="Blue Guppy"
          width={200}
          height={126}
          className="w-16 lg:w-20 h-auto drop-shadow-md"
        />
      </div>
      <div className="absolute right-6 sm:right-16 top-1/3 w-7 h-7 sm:w-9 sm:h-9 pointer-events-none z-0 hidden sm:block animate-bubble-float opacity-85">
        <Image src="/clay/fx/clay-bubble.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute right-10 sm:right-24 top-2/3 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none z-0 hidden sm:block animate-float-slow opacity-75">
        <Image src="/clay/fx/bubble-3.webp" alt="" fill className="object-contain" />
      </div>
      <div className="absolute right-16 sm:right-32 top-[78%] w-4 h-4 pointer-events-none z-0 hidden sm:block animate-bubble-drift opacity-60">
        <Image src="/clay/fx/bubble-4.webp" alt="" fill className="object-contain" />
      </div>

      {/* ============================================================ */}
      {/* BOTTOM BLUE WAVES & SEAWEED CORNERS                          */}
      {/* ============================================================ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden z-0 leading-none">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 text-[#A8D4FF] block"
        >
          <path
            d="M0,45 C280,10 440,75 720,78 C1000,80 1180,15 1440,35 L1440,96 L0,96 Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          <path
            d="M0,60 C320,32 480,85 720,82 C980,80 1200,42 1440,55 L1440,96 L0,96 Z"
            fill="#93C5FD"
            fillOpacity="0.65"
          />
        </svg>
      </div>

      {/* Bottom-left Seaweed sprigs */}
      <div className="absolute bottom-0 left-0 w-24 sm:w-36 md:w-44 pointer-events-none z-10">
        <Image
          src="/clay/farm/seaweed-bl-hd.webp"
          alt="Seaweed"
          width={220}
          height={300}
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(20,80,40,0.15)]"
        />
      </div>

      {/* Bottom-right Seaweed sprigs */}
      <div className="absolute bottom-0 right-0 w-24 sm:w-36 md:w-44 pointer-events-none z-10">
        <Image
          src="/clay/farm/seaweed-br-hd.webp"
          alt="Seaweed"
          width={220}
          height={300}
          className="w-full h-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(20,80,40,0.15)]"
        />
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTAINER CONTENT                                       */}
      {/* ============================================================ */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            {/* Soft Light Blue Pill Badge: ▶ Our Farm */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DCEBFF] text-[#2F6BFF] text-xs sm:text-sm font-extrabold shadow-2xs mb-2.5">
              <Play className="w-3 h-3 fill-current" />
              <span>{lang === "en" ? "Our Farm" : "ഞങ്ങളുടെ ഫാം"}</span>
            </div>

            {/* Title: Inside the Farm */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
              {lang === "en" ? (
                <>
                  Inside the <span className="text-[#2F6BFF]">Farm</span>
                </>
              ) : (
                <>
                  ഫാമിൻ്റെ <span className="text-[#2F6BFF]">ഉള്ളിലേക്ക്</span>
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#64748B] font-medium mt-1.5 max-w-xl leading-relaxed">
              {lang === "en"
                ? "Take a look at our farm, and see how we care for our aquatic friends."
                : "ഞങ്ങളുടെ ഫാമിന്റെ പ്രവർത്തനങ്ങളും പരിചരണവും നേരിട്ട് കാണുക."}
            </p>
          </div>

          {/* Floating 3D Clay Kohaku Koi Fish (swimming gracefully near top-right header area) */}
          <div className="absolute right-44 sm:right-56 md:right-64 top-4 sm:top-6 pointer-events-none z-20 hidden md:block animate-float select-none">
            <Image
              src="/clay/farm/clay-kohaku-koi.webp"
              alt="Clay Kohaku Koi"
              width={260}
              height={280}
              className="w-20 sm:w-26 md:w-30 h-auto drop-shadow-[0_12px_24px_rgba(220,50,40,0.22)]"
            />
          </div>

          {/* Top-Right Action Button: View all videos → */}
          <div className="shrink-0 self-start md:self-end">
            <a
              href="https://www.youtube.com/@Midhula_Farm_Hut"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFFDF8] hover:bg-white text-[#1E293B] hover:text-[#2F6BFF] font-bold text-xs sm:text-sm border border-[#E9DFCF] shadow-xs hover:shadow transition-all group cursor-pointer"
            >
              <span>{lang === "en" ? "View all videos" : "എല്ലാ വീഡിയോകളും"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIDEO & PLAYLIST GRID                                        */}
        {/* Left ~60%: TV Monitor Video Player                          */}
        {/* Right ~40%: 4 Rounded Cream Playlist Cards                   */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* ---------------------------------------------------------- */}
          {/* LEFT: Video Player (Squircle TV / Monitor Frame)           */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-7" ref={playerRef}>
            <div className="relative w-full aspect-video rounded-[28px] sm:rounded-[36px] md:rounded-[40px] overflow-hidden border-[8px] sm:border-[12px] md:border-[14px] border-white shadow-[0_20px_50px_rgba(20,40,80,0.14)] bg-black group select-none">
              {!isPlaying ? (
                /* Click-to-load Facade / Video Preview */
                <div
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full cursor-pointer overflow-hidden"
                  title="Click to play video"
                >
                  {/* Clean preview image matching mockup */}
                  <Image
                    src={activeVideo.previewImage}
                    alt={lang === "en" ? activeVideo.title : activeVideo.titleMl}
                    fill
                    priority
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              ) : (
                /* YouTube Embed Player */
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={lang === "en" ? activeVideo.title : activeVideo.titleMl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT: 4 Playlist Cards Stack                               */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-3.5">
            {PLAYLIST_VIDEOS.map((video, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(idx)}
                  className={`group flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white border border-[#2F6BFF]/30 shadow-[0_8px_24px_rgba(47,107,255,0.12)] -translate-y-0.5"
                      : "bg-[#FFFDF8] hover:bg-white border border-[#EFE5D5] shadow-xs hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-24 sm:w-28 md:w-32 aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-slate-900/10">
                    <Image
                      src={video.thumbnail}
                      alt={lang === "en" ? video.title : video.titleMl}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Centered subtle play icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/15">
                      <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge at bottom-right */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-0.5 leading-none">
                      <Play className="w-2 h-2 fill-white" />
                      <span>{video.duration}</span>
                    </div>
                  </div>

                  {/* Video Title & Subtitle */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h3
                      className={`text-sm sm:text-base font-extrabold line-clamp-1 leading-snug transition-colors ${
                        isSelected
                          ? "text-[#2F6BFF]"
                          : "text-[#1E293B] group-hover:text-[#2F6BFF]"
                      }`}
                    >
                      {lang === "en" ? video.title : video.titleMl}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] font-medium line-clamp-1 mt-0.5 leading-snug">
                      {lang === "en" ? video.subtitle : video.subtitleMl}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
