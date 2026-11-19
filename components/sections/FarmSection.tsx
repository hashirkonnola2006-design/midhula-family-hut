"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Info,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { YouTubeIcon } from "@/components/icons/SocialIcons";
import { FARM_STORY } from "@/lib/content";

interface FarmSectionProps {
  lang: "en" | "ml";
  onOpenVideo?: () => void;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  views: string;
  thumbnail: string;
}

export interface ChannelInfo {
  name: string;
  avatar: string;
  url: string;
  subscribers: string;
  videoCount?: string;
}

const FILTER_KEYWORDS: Record<string, string[]> = {
  All: [],
  "Farm Tour": ["farm", "tour", "setup", "pond", "കുളം", "ഫാം", "water", "tub"],
  Guppies: ["guppy", "guppi", "ഗപ്പി", "ഗുപ്പി"],
  Shrimp: ["shrimp", "shrimps", "ചെമ്മീൻ", "crayfish", "lobster"],
  Koi: ["koi", "swordtail", "സ്വോർഡ്ടെയിൽ", "platy"],
  Arrivals: ["arrival", "new", "updates", "പുതിയ", "വാങ്ങി", "stock"],
  Shorts: ["shorts", "#shorts"],
};

function renderClickableText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF6A13] font-semibold underline underline-offset-2 hover:text-[#E05908] break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export function FarmSection({ lang }: FarmSectionProps) {
  const [channel, setChannel] = useState<ChannelInfo>({
    name: "Midhula Farm Hut",
    avatar: "https://yt3.googleusercontent.com/9U44x8cT71pXfzOQ3vmR_NxraZuVry1wW0b-MkPcCct-ygkLl-xHcK99J9HA85NKdXiqyKRM=s160-c-k-c0x00ffffff-no-rj",
    url: "https://www.youtube.com/@Midhula_Farm_Hut",
    subscribers: "91.4K subscribers",
  });
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Active playing video state
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbError, setThumbError] = useState<Record<string, boolean>>({});

  // UI accordion toggles
  const [descExpanded, setDescExpanded] = useState(false);
  const [aboutFarmOpen, setAboutFarmOpen] = useState(false);

  // Grid filter & search
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const playerRef = useRef<HTMLDivElement>(null);

  // Fetch YouTube videos from API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/youtube");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.channel) setChannel(data.channel);
            if (data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
              setVideos(data.videos);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch /api/youtube:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentVideo = videos[currentVideoIndex] || videos[0];

  const getThumb = (v: VideoItem) => {
    if (!v) return "";
    if (thumbError[v.id]) {
      return `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`;
    }
    return v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  };

  const handleSelectVideo = (video: VideoItem) => {
    const idx = videos.findIndex((v) => v.id === video.id);
    if (idx !== -1) {
      setCurrentVideoIndex(idx);
    }
    setIsPlaying(true);
    setDescExpanded(false);

    // Scroll to player smoothly on mobile / tablet
    if (typeof window !== "undefined" && window.innerWidth < 1024 && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Up Next list: all videos except currently playing, up to 10
  const upNextVideos = useMemo(() => {
    if (!currentVideo) return videos;
    return videos.filter((v) => v.id !== currentVideo.id);
  }, [videos, currentVideo]);

  // Filter chips availability: hide chips with 0 videos
  const availableChips = useMemo(() => {
    return Object.keys(FILTER_KEYWORDS).filter((chip) => {
      if (chip === "All") return true;
      const keywords = FILTER_KEYWORDS[chip];
      return videos.some((v) => {
        const text = (v.title + " " + v.description).toLowerCase();
        if (chip === "Shorts") {
          return text.includes("shorts") || v.duration.startsWith("0:") || parseInt(v.duration.split(":")[0] || "0", 10) === 0;
        }
        return keywords.some((kw) => text.includes(kw.toLowerCase()));
      });
    });
  }, [videos]);

  // Filtered list for "More from the channel" grid
  const filteredGridVideos = useMemo(() => {
    let list = videos.filter((v) => v.id !== currentVideo?.id);

    // Filter by chip
    if (activeFilter !== "All") {
      const keywords = FILTER_KEYWORDS[activeFilter] || [];
      list = list.filter((v) => {
        const text = (v.title + " " + v.description).toLowerCase();
        if (activeFilter === "Shorts") {
          return text.includes("shorts") || v.duration.startsWith("0:") || parseInt(v.duration.split(":")[0] || "0", 10) === 0;
        }
        return keywords.some((kw) => text.includes(kw.toLowerCase()));
      });
    }

    // Filter by live search input
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((v) =>
        (v.title + " " + v.description).toLowerCase().includes(q)
      );
    }

    return list;
  }, [videos, currentVideo, activeFilter, searchQuery]);

  return (
    <section
      id="farm"
      style={{ scrollMarginTop: "88px" }}
      className="relative py-12 sm:py-20 lg:py-24 px-3 sm:px-6 lg:px-8 bg-[#FFF8E7] overflow-hidden select-none"
    >
      {/* Background Ambient Swimming Fish */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        <div
          className="fish-lane absolute pointer-events-none fish-track-rtl opacity-60 hidden sm:block"
          style={{
            top: "14%",
            left: 0,
            animationDuration: "28s",
            animationDelay: "-8s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "scaleX(-1)" }}>
            <div className="fish-bob fish-bob-subtle" style={{ animationDuration: "3s" }}>
              <div className="relative w-36 h-14">
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
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ============================================================ */}
        {/* SECTION HEADER (Compact with actions on right)               */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-[#F0DEC0]">
          <div>
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full clay-pill-orange text-xs font-bold text-white mb-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{lang === "en" ? "Nooluvally, Thrissur" : "നൂലുവാള്ളി, തൃശ്ശൂർ"}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold clay-heading-blue leading-tight mb-1.5 tracking-tight">
              {lang === "en" ? "Inside the Farm" : "ഫാം കാഴ്ചകൾ"}
            </h2>

            <p className="text-xs sm:text-base text-[#4A5568] font-semibold mb-3">
              {lang === "en"
                ? "Watch our farm, fish and arrivals, straight from our YouTube channel."
                : "ഞങ്ങളുടെ ഫാം, മീനുകൾ, പുതിയ വരവുകൾ - യൂട്യൂബിൽ നേരിട്ട് കാണാം."}
            </p>

            {/* 4 Feature Chips (Slim single row) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { en: "Mineral Groundwater", ml: "മിനറൽ ഗ്രൗണ്ട് വാട്ടർ" },
                { en: "Live Micro-Fauna", ml: "ലൈവ് മൈക്രോ ഫൗണ" },
                { en: "Zero Hormones", ml: "ഹോർമോൺ രഹിതം" },
                { en: "Tank Acclimatised", ml: "അക്ലിമറ്റൈസ്ഡ്" },
              ].map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFDF7] border border-[#F0DEC0] text-[11px] sm:text-xs font-bold text-[#1B2A38] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A3E]" />
                  <span>{lang === "en" ? chip.en : chip.ml}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Top-Right Channel CTA Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-end">
            {/* Visit Channel (Outline Orange) */}
            <a
              href="https://www.youtube.com/@Midhula_Farm_Hut"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-2 border-[#FF6A13] text-[#FF6A13] hover:bg-[#FF6A13] hover:text-white transition-all font-bold text-xs sm:text-sm active:scale-95 shadow-sm"
              aria-label="Visit Midhula Farm Hut YouTube Channel"
            >
              <YouTubeIcon className="w-4 h-4" />
              <span>{lang === "en" ? "Visit Channel" : "ചാനൽ കാണുക"}</span>
            </a>

            {/* YouTube Subscribe Button (Red) */}
            <a
              href="https://www.youtube.com/@Midhula_Farm_Hut?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#CC0000] hover:bg-[#E60000] text-white transition-all font-bold text-xs sm:text-sm shadow-[0_4px_12px_rgba(204,0,0,0.3)] active:scale-95"
              aria-label="Subscribe to Midhula Farm Hut on YouTube"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{lang === "en" ? "Subscribe" : "സബ്സ്ക്രൈബ്"}</span>
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN WATCH PAGE LAYOUT: ~68% Player / ~32% Up Next           */}
        {/* ============================================================ */}
        {loading ? (
          // Shimmering Skeleton Loader matching layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="aspect-video w-full rounded-[24px] bg-[#E8DFC8] animate-pulse" />
              <div className="h-7 w-3/4 bg-[#E8DFC8] rounded-lg animate-pulse" />
              <div className="h-10 w-full bg-[#E8DFC8] rounded-xl animate-pulse" />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex gap-3 h-20 rounded-xl bg-[#E8DFC8] animate-pulse p-2" />
              ))}
            </div>
          </div>
        ) : !currentVideo ? (
          // Empty State
          <div className="p-12 text-center bg-[#FFFDF7] rounded-3xl border border-[#F0DEC0] my-8">
            <p className="text-lg font-bold text-[#4A5568] mb-4">
              No videos currently available.
            </p>
            <a
              href="https://www.youtube.com/@Midhula_Farm_Hut"
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn-orange px-6 py-2.5 rounded-full text-white font-bold inline-flex items-center gap-2"
            >
              <YouTubeIcon className="w-5 h-5" />
              <span>Watch directly on YouTube</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12 sm:mb-16">
            {/* ======================================================== */}
            {/* LEFT COLUMN: Main Player (16:9) + Meta + About Farm      */}
            {/* ======================================================== */}
            <div ref={playerRef} className="lg:col-span-8 flex flex-col scroll-mt-24">
              {/* 16:9 Facade / Iframe Container */}
              <div className="relative w-full aspect-video rounded-[20px] sm:rounded-[24px] overflow-hidden bg-black shadow-[0_12px_32px_rgba(20,30,60,0.14)] border border-[#F0DEC0] group">
                {!isPlaying ? (
                  // Click-to-load Facade
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="relative w-full h-full block cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6A13]"
                    aria-label={`Play video: ${currentVideo.title}`}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={getThumb(currentVideo)}
                      onError={() => {
                        setThumbError((prev) => ({ ...prev, [currentVideo.id]: true }));
                      }}
                      alt={currentVideo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Big YouTube-style Red Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-11 sm:w-20 sm:h-14 rounded-[14px] sm:rounded-[18px] bg-[#CC0000] group-hover:bg-[#FF0000] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(204,0,0,0.5)] transition-all duration-300 group-hover:scale-110 active:scale-95">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge in bottom corner */}
                    {currentVideo.duration && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/85 text-white text-xs font-extrabold tracking-wide">
                        {currentVideo.duration}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
                      <span>{lang === "en" ? "Click to Watch" : "കാണാൻ ക്ലിക്ക് ചെയ്യൂ"}</span>
                    </span>
                  </button>
                ) : (
                  // Iframe Player
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={currentVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              {/* Video Title */}
              <h1 className="text-lg sm:text-[22px] font-extrabold text-[#0E2038] leading-snug mt-3 sm:mt-4 mb-2.5">
                {currentVideo.title}
              </h1>

              {/* Channel Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0DEC0]/70">
                {/* Left: Avatar + Channel Info + Subscribe */}
                <div className="flex items-center gap-3">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-10 h-10 rounded-full overflow-hidden border border-[#F0DEC0] shrink-0 hover:opacity-90"
                  >
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </a>
                  <div>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-extrabold text-sm sm:text-base text-[#0E2038] hover:text-[#FF6A13] transition-colors leading-tight block"
                    >
                      {channel.name}
                    </a>
                    <span className="text-xs text-[#5A687A] font-medium">
                      {channel.subscribers}
                    </span>
                  </div>

                  <a
                    href="https://www.youtube.com/@Midhula_Farm_Hut?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-3.5 py-1.5 rounded-full bg-[#CC0000] hover:bg-[#E60000] text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all"
                  >
                    {lang === "en" ? "Subscribe" : "സബ്സ്ക്രൈബ്"}
                  </a>
                </div>

                {/* Right: Meta & Watch on YouTube Link */}
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#5A687A]">
                  <span>
                    {currentVideo.views} • {currentVideo.publishedAt}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#FF6A13] hover:text-[#E05908] font-bold text-xs bg-[#FFFDF7] px-2.5 py-1 rounded-full border border-[#F0DEC0] shadow-2xs hover:shadow-xs transition-all"
                    title="Watch on YouTube"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Collapsible Video Description Box (Cream Card) */}
              {currentVideo.description && (
                <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF7] border border-[#F0DEC0] text-xs sm:text-sm text-[#2D3748] leading-relaxed shadow-sm">
                  <div
                    className={`whitespace-pre-line ${
                      !descExpanded ? "line-clamp-2 max-h-12 overflow-hidden" : ""
                    }`}
                  >
                    {renderClickableText(currentVideo.description)}
                  </div>
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="mt-2 text-xs font-bold text-[#0E2038] hover:text-[#FF6A13] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{descExpanded ? "Show less" : "Show more"}</span>
                    {descExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Collapsible "About Our Farm" Block (Farm story moved from top) */}
              <div className="mt-4 rounded-2xl bg-[#FFFDF7] border border-[#F0DEC0] overflow-hidden shadow-sm">
                <button
                  onClick={() => setAboutFarmOpen(!aboutFarmOpen)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-[#0E2038] hover:bg-[#FFF5DF] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#FF6A13]" />
                    <span>
                      {lang === "en" ? "About Midhula Farm Hut" : "മിഥുല ഫാമിനെക്കുറിച്ച്"}
                    </span>
                  </div>
                  {aboutFarmOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {aboutFarmOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#F0DEC0]/60 text-xs sm:text-sm text-[#374151] leading-relaxed space-y-2.5">
                    <p>
                      {lang === "en" ? FARM_STORY.paragraphs[0] : FARM_STORY.malayalamParagraphs[0]}
                    </p>
                    <p>
                      {lang === "en" ? FARM_STORY.paragraphs[1] : FARM_STORY.malayalamParagraphs[1]}
                    </p>
                    <p className="font-semibold text-[#1F7A3E]">
                      {lang === "en" ? FARM_STORY.paragraphs[2] : FARM_STORY.malayalamParagraphs[2]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: "Up Next" Scrollable List                  */}
            {/* Desktop: vertical list with custom scrollbar (~540px max)*/}
            {/* Tablet: horizontal scroll-snap row                       */}
            {/* Mobile: compact vertical rows                           */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-extrabold text-base sm:text-lg text-[#0E2038] flex items-center gap-1.5">
                  <span>{lang === "en" ? "Up next" : "അടുത്തത്"}</span>
                  <span className="text-xs font-semibold text-[#5A687A]">
                    ({upNextVideos.length})
                  </span>
                </h3>
                <span className="text-[11px] font-bold text-[#FF6A13] uppercase tracking-wider">
                  Farm Collection
                </span>
              </div>

              {/* Up Next List Container */}
              <div className="flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                {upNextVideos.slice(0, 10).map((video) => {
                  const isActive = video.id === currentVideo.id;
                  return (
                    <button
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      className={`group flex items-start gap-3 p-2 rounded-xl text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] ${
                        isActive
                          ? "bg-[#FFE8D1] border-l-4 border-[#FF6A13] shadow-xs"
                          : "bg-[#FFFDF7] hover:bg-[#FFF4DF] border border-[#F0DEC0]/70 shadow-2xs"
                      }`}
                    >
                      {/* 168x94 Aspect Ratio Thumbnail */}
                      <div className="relative w-[120px] sm:w-[136px] aspect-[16/9] rounded-lg overflow-hidden shrink-0 bg-black/10">
                        <img
                          src={getThumb(video)}
                          onError={() => {
                            setThumbError((prev) => ({ ...prev, [video.id]: true }));
                          }}
                          alt={video.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {video.duration && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-bold text-white leading-none">
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {/* Video Title & Meta */}
                      <div className="flex flex-col flex-1 min-w-0 pr-1">
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#0E2038] line-clamp-2 leading-snug group-hover:text-[#FF6A13] transition-colors">
                          {video.title}
                        </h4>
                        <span className="text-[11px] text-[#5A687A] font-medium mt-1">
                          {video.views} • {video.publishedAt}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* "MORE FROM THE CHANNEL": Filter Chips, Live Search & Grid    */}
        {/* ============================================================ */}
        <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-[#F0DEC0]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0E2038] leading-tight">
                {lang === "en" ? "More from the channel" : "കൂടുതൽ വീഡിയോകൾ"}
              </h3>
              <p className="text-xs sm:text-sm text-[#5A687A] font-medium">
                {lang === "en"
                  ? "Explore breeding updates, farm tours and fish varieties"
                  : "ഫാം അപ്‌ഡേറ്റുകളും മത്സ്യ ഇനങ്ങളും കാണുക"}
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#8C9BAE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "en" ? "Search videos..." : "തിരയുക..."}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FFFDF7] border border-[#F0DEC0] text-xs sm:text-sm text-[#0E2038] placeholder-[#8C9BAE] focus:outline-none focus:ring-2 focus:ring-[#FF6A13] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C9BAE] hover:text-[#0E2038]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* YouTube-Style Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar scroll-smooth">
            {availableChips.map((chip) => {
              const isActive = activeFilter === chip;
              return (
                <button
                  key={chip}
                  onClick={() => {
                    setActiveFilter(chip);
                    setVisibleCount(6);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isActive
                      ? "bg-[#FF6A13] text-white shadow-sm"
                      : "bg-[#FFFDF7] text-[#334155] border border-[#F0DEC0] hover:bg-[#FFF4E0]"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Videos Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
          {filteredGridVideos.length === 0 ? (
            <div className="py-12 text-center bg-[#FFFDF7] rounded-2xl border border-[#F0DEC0]">
              <p className="text-sm font-bold text-[#5A687A] mb-3">
                {lang === "en"
                  ? "No videos found matching your filter or search."
                  : "വീഡിയോകൾ ഒന്നും കണ്ടെത്തിയില്ല."}
              </p>
              <button
                onClick={() => {
                  setActiveFilter("All");
                  setSearchQuery("");
                }}
                className="px-4 py-1.5 rounded-full bg-[#FF6A13] text-white font-bold text-xs hover:bg-[#E05908] cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredGridVideos.slice(0, visibleCount).map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className="group flex flex-col p-3 rounded-2xl bg-[#FFFDF7] border border-[#F0DEC0] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* 16:9 Thumbnail container */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/10">
                      <img
                        src={getThumb(video)}
                        onError={() => {
                          setThumbError((prev) => ({ ...prev, [video.id]: true }));
                        }}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {video.duration && (
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-[11px] font-bold text-white leading-none">
                          {video.duration}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#CC0000] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Card Title */}
                    <h4 className="font-bold text-sm sm:text-base text-[#0E2038] line-clamp-2 leading-snug mt-2.5 mb-1.5 group-hover:text-[#FF6A13] transition-colors">
                      {video.title}
                    </h4>

                    {/* Card Meta & External link */}
                    <div className="mt-auto pt-2 flex items-center justify-between text-xs text-[#5A687A] font-medium border-t border-[#F0DEC0]/50">
                      <span>
                        {video.views} • {video.publishedAt}
                      </span>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#FF6A13] hover:text-[#E05908] flex items-center gap-1 font-bold"
                        title="Watch on YouTube"
                      >
                        <span>YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredGridVideos.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="clay-btn-orange px-8 py-2.5 rounded-full text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{lang === "en" ? "Load More Videos" : "കൂടുതൽ വീഡിയോകൾ കാണുക"}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
