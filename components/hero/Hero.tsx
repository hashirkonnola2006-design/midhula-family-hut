"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin, MessageCircle, Play } from "lucide-react";
import { BRAND, getWhatsAppUrl } from "@/lib/content";
import { FishField } from "./FishField";

interface HeroProps {
  lang?: "en" | "ml";
  onOpenVideo?: () => void;
}

interface LetterDef {
  char: string;
  file: string;
  width: number;
  height: number;
}

const BLUE_LETTERS: LetterDef[] = [
  { char: "M", file: "blue-M.webp", width: 260, height: 214 },
  { char: "I", file: "blue-I.webp", width: 85, height: 213 },
  { char: "D", file: "blue-D.webp", width: 203, height: 216 },
  { char: "H", file: "blue-H.webp", width: 183, height: 211 },
  { char: "U", file: "blue-U.webp", width: 182, height: 212 },
  { char: "L", file: "blue-L.webp", width: 144, height: 211 },
  { char: "A", file: "blue-A.webp", width: 208, height: 209 },
];
const BLUE_TOTAL_WIDTH = BLUE_LETTERS.reduce((sum, l) => sum + l.width, 0); // 1265

const ORANGE_FARM: LetterDef[] = [
  { char: "F", file: "orange-F.webp", width: 143, height: 186 },
  { char: "A", file: "orange-A.webp", width: 222, height: 188 },
  { char: "R", file: "orange-R.webp", width: 163, height: 187 },
  { char: "M", file: "orange-M.webp", width: 224, height: 188 },
];
const FARM_TOTAL_WIDTH = ORANGE_FARM.reduce((sum, l) => sum + l.width, 0); // 752

const ORANGE_HUT: LetterDef[] = [
  { char: "H", file: "orange-H.webp", width: 163, height: 184 },
  { char: "U", file: "orange-U.webp", width: 167, height: 183 },
  { char: "T", file: "orange-T.webp", width: 156, height: 183 },
];
const HUT_TOTAL_WIDTH = ORANGE_HUT.reduce((sum, l) => sum + l.width, 0); // 486

const WORD_GAP_WIDTH = 110;
const LINE2_TOTAL_WIDTH = FARM_TOTAL_WIDTH + WORD_GAP_WIDTH + HUT_TOTAL_WIDTH; // 1348

export function Hero({ lang = "en", onOpenVideo }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mouse Parallax for gentle letter depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22 });

  useEffect(() => {
    if (!containerRef.current) return;

    // IntersectionObserver to pause fish and animations when hero is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", motionListener);

    // Cache hero height for fallback scroll progress without getBoundingClientRect in scroll loop
    let cachedHeroHeight = containerRef.current.offsetHeight || window.innerHeight || 800;
    const handleResize = () => {
      cachedHeroHeight = containerRef.current?.offsetHeight || window.innerHeight || 800;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Single rAF-throttled scroll listener fallback for browsers without native scroll-driven animations
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (mql.matches) {
            containerRef.current?.style.setProperty("--hero-scroll-progress", "0");
          } else {
            // Progress over first 40% of hero height (opacity 1 -> 0, translateY 0 -> -40px, scale 1 -> 0.92)
            const p = Math.min(Math.max(window.scrollY / (cachedHeroHeight * 0.4), 0), 1);
            containerRef.current?.style.setProperty("--hero-scroll-progress", p.toFixed(3));
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const handleMouseMove = (e: MouseEvent) => {
      if (mql.matches) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx * 4);
      mouseY.set(ny * 3);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", motionListener);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Staggered floating wobble for clay letters (±2px Y, ±0.8 deg rotate, 4-6s cycle)
  const getLetterWobble = (index: number) => {
    if (reducedMotion) return {};
    const duration = 4.2 + (index % 4) * 0.5;
    const delay = index * 0.14;
    return {
      animate: {
        y: [-2, 2, -2],
        rotate: [-0.8, 0.8, -0.8],
      },
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay,
      },
    };
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-screen md:h-[900px] md:max-h-screen pt-20 sm:pt-24 pb-0 px-4 sm:px-8 flex flex-col justify-center items-center butter-backdrop overflow-hidden select-none"
    >
      {/* Layered Fish & Clay Props Field (Z-5, Z-25, Z-30) - Fish NEVER hide or fade on scroll */}
      <FishField
        isVisible={true}
        isPaused={!isInView}
        reducedMotion={reducedMotion}
      />

      {/* Main Content Area */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center flex-1 my-auto text-center z-10 pointer-events-auto">
        
        {/* Screen Reader & SEO Title */}
        <h1 className="sr-only">Midhula Farm Hut</h1>

        {/* Headline Title Container: Only the big title fades and drifts up slightly on scroll; never docks/overlaps logo */}
        <motion.div
          style={{
            x: reducedMotion ? 0 : springX,
            y: reducedMotion ? 0 : springY,
          }}
          className="hero-title-scroll-container w-full flex flex-col items-center justify-center gap-1.5 sm:gap-3 mb-4 sm:mb-6 relative z-10 select-none"
          aria-hidden="true"
        >
          {/* ========================================================== */}
          {/* Line 1: MIDHULA in Electric Blue (Fills ~86% width)        */}
          {/* ========================================================== */}
          <div
            className="flex items-end justify-center mx-auto gap-[1.2%] sm:gap-[1.6%]"
            style={{ width: "88%", maxWidth: "1100px" }}
          >
            {BLUE_LETTERS.map((item, idx) => {
              const widthPct = (item.width / BLUE_TOTAL_WIDTH) * 100;

              // The peeking fish sits inside the counter hole of 'D' (rendered BEHIND D)
              if (item.char === "D") {
                return (
                  <motion.div
                    key={`l1-${item.char}-${idx}`}
                    {...getLetterWobble(idx)}
                    className="relative inline-block"
                    style={{ width: `${widthPct}%` }}
                  >
                    {/* peek-blue anchored inside the hole of the 'D' and rendered BEHIND D (Z-1) */}
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ zIndex: 1 }}
                    >
                      <motion.div
                        animate={
                          reducedMotion
                            ? {}
                            : {
                                y: [-3, 3, -3],
                                rotate: [-1.4, 1.4, -1.4],
                              }
                        }
                        transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" as const }}
                        style={{ width: "56%", height: "56%", marginTop: "-4%", marginLeft: "-4%" }}
                        className="relative"
                      >
                        <Image
                          src="/clay/fish/peek-blue.webp"
                          alt=""
                          fill
                          className="object-contain drop-shadow-[0_2px_8px_rgba(20,50,150,0.35)]"
                        />
                      </motion.div>
                    </div>

                    {/* D Letter Image on top (Z-10) with open counter hole */}
                    <div className="relative z-10 w-full">
                      <Image
                        src={`/clay/letters/${item.file}`}
                        alt={item.char}
                        width={item.width}
                        height={item.height}
                        priority
                        className="clay-headline-letter w-full h-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                        style={{
                          filter: "drop-shadow(0 14px 24px rgba(31,75,255,0.18))",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={`l1-${item.char}-${idx}`}
                  {...getLetterWobble(idx)}
                  className="relative inline-block"
                  style={{ width: `${widthPct}%` }}
                >
                  <Image
                    src={`/clay/letters/${item.file}`}
                    alt={item.char}
                    width={item.width}
                    height={item.height}
                    priority
                    className="clay-headline-letter w-full h-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                    style={{
                      filter: "drop-shadow(0 14px 24px rgba(31,75,255,0.18))",
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* ========================================================== */}
          {/* Line 2: FARM HUT in Vibrant Orange (Equal Height Scale)   */}
          {/* ========================================================== */}
          <div
            className="flex items-end justify-center mx-auto -mt-2 sm:-mt-3.5"
            style={{ width: "66%", maxWidth: "830px" }}
          >
            {/* FARM group with guaranteed gap between letters (F-A never touch!) */}
            <div
              className="flex items-end justify-between gap-[2%] sm:gap-[2.8%]"
              style={{ width: `${(FARM_TOTAL_WIDTH / LINE2_TOTAL_WIDTH) * 100}%` }}
            >
              {ORANGE_FARM.map((item, idx) => {
                const widthPct = (item.width / FARM_TOTAL_WIDTH) * 100;
                return (
                  <motion.div
                    key={`farm-${item.char}-${idx}`}
                    {...getLetterWobble(idx + 7)}
                    className="relative inline-block flex-1"
                    style={{ maxWidth: `${widthPct * 1.08}%` }}
                  >
                    <Image
                      src={`/clay/letters/${item.file}`}
                      alt={item.char}
                      width={item.width}
                      height={item.height}
                      priority
                      className="clay-headline-letter w-full h-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                      style={{
                        filter: "drop-shadow(0 14px 24px rgba(255,106,26,0.18))",
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Word Gap between FARM and HUT (~0.6x letter width) */}
            <div
              style={{ width: `${(WORD_GAP_WIDTH / LINE2_TOTAL_WIDTH) * 100}%` }}
              aria-hidden="true"
            />

            {/* HUT group with guaranteed gap between letters */}
            <div
              className="flex items-end justify-between gap-[2%] sm:gap-[2.8%]"
              style={{ width: `${(HUT_TOTAL_WIDTH / LINE2_TOTAL_WIDTH) * 100}%` }}
            >
              {ORANGE_HUT.map((item, idx) => {
                const widthPct = (item.width / HUT_TOTAL_WIDTH) * 100;
                return (
                  <motion.div
                    key={`hut-${item.char}-${idx}`}
                    {...getLetterWobble(idx + 11)}
                    className="relative inline-block flex-1"
                    style={{ maxWidth: `${widthPct * 1.08}%` }}
                  >
                    <Image
                      src={`/clay/letters/${item.file}`}
                      alt={item.char}
                      width={item.width}
                      height={item.height}
                      priority
                      className="clay-headline-letter w-full h-auto object-contain cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                      style={{
                        filter: "drop-shadow(0 14px 24px rgba(255,106,26,0.18))",
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Location Pill (Z-40: never covered by fish) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill text-xs sm:text-sm font-bold text-[#0E2038] mb-3 relative z-40"
        >
          <MapPin className="w-3.5 h-3.5 text-[#1F4BFF]" />
          <span>{lang === "en" ? BRAND.location : BRAND.malayalamLocation}</span>
        </motion.div>

        {/* Subtext (Z-40: never covered by fish) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base sm:text-lg md:text-xl font-bold text-[#0E2038] max-w-2xl mx-auto mb-6 tracking-tight relative z-40"
        >
          {lang === "en"
            ? "Farm-bred, colourful and delivered live to your door."
            : BRAND.malayalamSubtext}
        </motion.p>

        {/* Call-to-action buttons (Z-40: instant clickability) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative z-40"
        >
          {/* Order on WhatsApp Button */}
          <a
            href={getWhatsAppUrl("Hi Midhula Farm Hut, I'd like to order farm-bred guppies!")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full font-bold text-base text-white clay-btn-orange"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#FF6A1A]" />
            <span>{lang === "en" ? "Order on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യൂ"}</span>
          </a>

          {/* Watch Farm Tour Button */}
          <button
            onClick={onOpenVideo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full font-bold text-base text-[#0E2038] clay-btn-cream cursor-pointer"
          >
            <Play className="w-4 h-4 fill-[#0E2038] text-[#0E2038]" />
            <span>{lang === "en" ? "Watch farm tour" : "ഫാം കാഴ്ചകൾ"}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
