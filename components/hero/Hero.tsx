"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin } from "lucide-react";
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
      className="relative w-full min-h-[100svh] pt-14 sm:pt-20 pb-8 sm:pb-14 px-3 sm:px-8 flex flex-col justify-center items-center butter-backdrop overflow-hidden select-none"
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
          className="clay-location-pill inline-flex items-center gap-2 px-5 py-2 rounded-full font-display font-extrabold text-xs sm:text-sm text-[#1F4FFF] mb-3 relative z-40 select-none shadow-[0_6px_18px_rgba(180,140,30,0.15)]"
        >
          <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0">
            <Image
              src="/clay/icons/location.webp"
              alt="Location"
              fill
              unoptimized
              className="object-contain drop-shadow-[0_2px_4px_rgba(31,75,255,0.3)]"
            />
          </div>
          <span className="tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
            {lang === "en" ? BRAND.location : BRAND.malayalamLocation}
          </span>
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

        {/* Call-to-action button with 3 yellow clay spark rays (matching reference mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative inline-flex items-center justify-center mx-auto z-40"
        >
          {/* 3 Yellow Clay Spark Rays to the left (matching reference) */}
          <div className="absolute -left-11 sm:-left-14 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-14 sm:h-16 pointer-events-none select-none">
            <Image
              src="/clay/fx/clay-rays.webp"
              alt=""
              fill
              priority
              unoptimized
              className="object-contain drop-shadow-[0_4px_10px_rgba(210,130,0,0.22)]"
            />
          </div>

          {/* Chunky 3D Clay WhatsApp CTA Button */}
          <a
            href={getWhatsAppUrl("Hi Midhula Farm Hut, I'd like to order farm-bred fishes!")}
            target="_blank"
            rel="noopener noreferrer"
            className="clay-btn-green-chubby group relative inline-flex items-center justify-center gap-3 sm:gap-3.5 px-8 sm:px-11 h-[60px] sm:h-[68px] min-w-[280px] sm:min-w-[320px] rounded-full text-white font-display font-extrabold text-base sm:text-lg md:text-xl tracking-wide select-none active:scale-[0.97]"
          >
            {/* WhatsApp Speech Bubble Icon in Crisp White Clay Style */}
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-full h-full"
                aria-hidden="true"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>

            {/* CTA Text with 3D Clay Letter Shadow */}
            <span className="drop-shadow-[0_2px_4px_rgba(10,50,25,0.65)] font-black">
              {lang === "en" ? "Order on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യൂ"}
            </span>

            {/* White Arrow with Hover Bump */}
            <span className="text-xl sm:text-2xl font-black drop-shadow-[0_2px_4px_rgba(10,50,25,0.65)] group-hover:translate-x-1.5 transition-transform ml-0.5">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
