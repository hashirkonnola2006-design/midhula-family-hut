"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export interface FishConfigItem {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  direction: "ltr" | "rtl";
  facing?: "left" | "right";
  laneTop: string;
  desktopWidth: number;
  mobileWidth: number;
  vwWidth: number;
  duration: number; // linear travel duration (seconds)
  delay: number; // negative delay (seconds) so fish are pre-populated
  bobDur: number;
  bobAmp: "gentle" | "subtle";
  staticLeft: string; // fallback position for prefers-reduced-motion
  mobileHidden?: boolean;
}

export const FISH_CONFIG: FishConfigItem[] = [
  // 1. Anchor Hot-Pink Guppy (Upper Open Lane - RTL)
  {
    id: "pink-guppy-anchor",
    name: "Anchor Pink Guppy",
    src: "/clay/fish/pink-guppy.webp",
    width: 294,
    height: 182,
    direction: "rtl",
    facing: "right",
    laneTop: "12%",
    desktopWidth: 195,
    mobileWidth: 110,
    vwWidth: 15,
    duration: 23,
    delay: -6.5,
    bobDur: 3.2,
    bobAmp: "gentle",
    staticLeft: "75%",
    mobileHidden: false,
  },
  // 2. Big Orange Guppy (Upper Mid Lane - LTR)
  {
    id: "orange-guppy-hero",
    name: "Big Orange Guppy",
    src: "/clay/fish/orange-guppy.webp",
    width: 334,
    height: 219,
    direction: "ltr",
    facing: "right",
    laneTop: "17%",
    desktopWidth: 235,
    mobileWidth: 130,
    vwWidth: 18,
    duration: 26,
    delay: -14,
    bobDur: 3.8,
    bobAmp: "gentle",
    staticLeft: "12%",
    mobileHidden: false,
  },
  // 3. Electric Blue Guppy (Behind MIDHULA - RTL)
  {
    id: "blue-guppy-hero",
    name: "Electric Blue Guppy",
    src: "/clay/fish/blue-guppy.webp",
    width: 290,
    height: 183,
    direction: "rtl",
    facing: "right",
    laneTop: "33%",
    desktopWidth: 180,
    mobileWidth: 105,
    vwWidth: 14,
    duration: 24,
    delay: -18,
    bobDur: 3.0,
    bobAmp: "gentle",
    staticLeft: "68%",
    mobileHidden: false,
  },
  // 4. Small Orange Guppy (Between MIDHULA & FARM - LTR)
  {
    id: "orange-small-1",
    name: "Small Orange Guppy",
    src: "/clay/fish/orange-small-1.webp",
    width: 238,
    height: 119,
    direction: "ltr",
    facing: "right",
    laneTop: "39%",
    desktopWidth: 135,
    mobileWidth: 78,
    vwWidth: 10,
    duration: 19,
    delay: -4,
    bobDur: 2.6,
    bobAmp: "subtle",
    staticLeft: "22%",
    mobileHidden: false,
  },
  // 5. Swordtail (Open Band below FARM HUT - LTR)
  {
    id: "swordtail-hero",
    name: "Swordtail",
    src: "/clay/fish/swordtail.webp",
    width: 315,
    height: 127,
    direction: "ltr",
    facing: "right",
    laneTop: "58%",
    desktopWidth: 175,
    mobileWidth: 98,
    vwWidth: 13,
    duration: 21,
    delay: -11,
    bobDur: 2.8,
    bobAmp: "subtle",
    staticLeft: "38%",
    mobileHidden: false,
  },
  // 6. Small Orange-Cream Guppy (Open Band below FARM HUT - RTL)
  {
    id: "orange-small-2",
    name: "Small Orange-Cream Guppy",
    src: "/clay/fish/orange-small-2.webp",
    width: 225,
    height: 103,
    direction: "rtl",
    facing: "right",
    laneTop: "60.5%",
    desktopWidth: 125,
    mobileWidth: 72,
    vwWidth: 9.5,
    duration: 20,
    delay: -8,
    bobDur: 2.5,
    bobAmp: "subtle",
    staticLeft: "80%",
    mobileHidden: false,
  },
  // 7. Second Pink Guppy (Lower Open Water below Buttons - LTR - Desktop)
  {
    id: "pink-guppy-lower",
    name: "Lower Pink Guppy",
    src: "/clay/fish/pink-guppy.webp",
    width: 294,
    height: 182,
    direction: "ltr",
    facing: "right",
    laneTop: "86%",
    desktopWidth: 155,
    mobileWidth: 90,
    vwWidth: 11,
    duration: 25,
    delay: -16,
    bobDur: 3.4,
    bobAmp: "gentle",
    staticLeft: "28%",
    mobileHidden: true,
  },
  // 8. Second Blue Guppy (Upper Water - LTR - Desktop)
  {
    id: "blue-guppy-upper",
    name: "Upper Blue Guppy",
    src: "/clay/fish/blue-guppy.webp",
    width: 290,
    height: 183,
    direction: "ltr",
    facing: "right",
    laneTop: "23%",
    desktopWidth: 145,
    mobileWidth: 85,
    vwWidth: 10.5,
    duration: 27,
    delay: -2,
    bobDur: 3.5,
    bobAmp: "subtle",
    staticLeft: "48%",
    mobileHidden: true,
  },
  // 9. Second Swordtail (Behind FARM HUT - RTL - Desktop)
  {
    id: "swordtail-mid",
    name: "Mid Swordtail",
    src: "/clay/fish/swordtail.webp",
    width: 315,
    height: 127,
    direction: "rtl",
    facing: "right",
    laneTop: "50%",
    desktopWidth: 150,
    mobileWidth: 85,
    vwWidth: 11,
    duration: 23,
    delay: -15,
    bobDur: 2.9,
    bobAmp: "subtle",
    staticLeft: "55%",
    mobileHidden: true,
  },
  // 10. Small Orange Guppy Pair Leader (Deep Open Water - RTL - Desktop)
  {
    id: "pair-lead",
    name: "School Pair Lead",
    src: "/clay/fish/orange-small-1.webp",
    width: 238,
    height: 119,
    direction: "rtl",
    facing: "right",
    laneTop: "88%",
    desktopWidth: 115,
    mobileWidth: 65,
    vwWidth: 8,
    duration: 22,
    delay: -12,
    bobDur: 2.4,
    bobAmp: "subtle",
    staticLeft: "62%",
    mobileHidden: true,
  },
  // 11. Small Orange Guppy Pair Follower (Deep Open Water - RTL - Desktop)
  {
    id: "pair-follower",
    name: "School Pair Follower",
    src: "/clay/fish/orange-small-2.webp",
    width: 225,
    height: 103,
    direction: "rtl",
    facing: "right",
    laneTop: "90%",
    desktopWidth: 100,
    mobileWidth: 58,
    vwWidth: 7,
    duration: 22,
    delay: -11.3,
    bobDur: 2.4,
    bobAmp: "subtle",
    staticLeft: "66%",
    mobileHidden: true,
  },
];

interface HeroBubbleConfig {
  id: string;
  left: string;
  size: 12 | 22 | 36;
  duration: number;
  delay: number;
  swayDuration: number;
  mobileHidden?: boolean;
}

const HERO_BUBBLES: HeroBubbleConfig[] = [
  // 6 bubbles on mobile & desktop
  { id: "b-1", left: "7%", size: 22, duration: 15, delay: -4.2, swayDuration: 3.8 },
  { id: "b-2", left: "23%", size: 12, duration: 18, delay: -11.5, swayDuration: 4.2 },
  { id: "b-3", left: "41%", size: 36, duration: 13, delay: -7.0, swayDuration: 4.8 },
  { id: "b-4", left: "63%", size: 22, duration: 16, delay: -2.8, swayDuration: 3.5 },
  { id: "b-5", left: "79%", size: 12, duration: 19, delay: -14.1, swayDuration: 4.0 },
  { id: "b-6", left: "92%", size: 36, duration: 14, delay: -8.9, swayDuration: 4.5 },
  // 6 additional bubbles on desktop (12 total)
  { id: "b-7", left: "14%", size: 36, duration: 12, delay: -9.5, swayDuration: 3.6, mobileHidden: true },
  { id: "b-8", left: "31%", size: 12, duration: 20, delay: -3.4, swayDuration: 4.4, mobileHidden: true },
  { id: "b-9", left: "51%", size: 22, duration: 17, delay: -13.2, swayDuration: 3.9, mobileHidden: true },
  { id: "b-10", left: "72%", size: 36, duration: 14, delay: -6.1, swayDuration: 4.6, mobileHidden: true },
  { id: "b-11", left: "85%", size: 22, duration: 16, delay: -15.7, swayDuration: 3.7, mobileHidden: true },
  { id: "b-12", left: "96%", size: 12, duration: 21, delay: -10.0, swayDuration: 4.1, mobileHidden: true },
];

interface FishFieldProps {
  isVisible?: boolean;
  isPaused?: boolean;
  reducedMotion?: boolean;
}

export function FishField({
  isVisible = true,
  isPaused = false,
  reducedMotion: propReducedMotion,
}: FishFieldProps) {
  const [reducedMotion, setReducedMotion] = useState(propReducedMotion ?? false);

  useEffect(() => {
    if (typeof propReducedMotion === "boolean") {
      setReducedMotion(propReducedMotion);
      return;
    }
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [propReducedMotion]);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${
        isPaused ? "hero-animations-paused" : ""
      }`}
      aria-hidden="true"
    >
      {/* ============================================================== */}
      {/* LAYER Z-5: Continuous Horizontal Swimming Fish (11 total)      */}
      {/* Three-tier element architecture: lane -> flip -> bob           */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {FISH_CONFIG.map((fish) => {
          const facing = fish.facing || "right";
          const isMovingRight = fish.direction === "ltr";
          // Direction formula: right-facing moving right = no flip; right-facing moving left = scaleX(-1)
          const needsFlip = facing === "right" ? !isMovingRight : isMovingRight;

          const trackClass = isMovingRight ? "fish-track-ltr" : "fish-track-rtl";
          const bobClass = fish.bobAmp === "gentle" ? "fish-bob-gentle" : "fish-bob-subtle";

          return (
            /* Outer Tier: .fish-lane (ONLY horizontal translation) */
            <div
              key={fish.id}
              className={`fish-lane absolute pointer-events-none select-none ${
                fish.mobileHidden ? "hidden sm:block" : "block"
              } ${reducedMotion ? "" : trackClass}`}
              style={{
                top: fish.laneTop,
                left: reducedMotion ? fish.staticLeft : 0,
                animationDuration: `${fish.duration}s`,
                animationDelay: `${fish.delay}s`,
                willChange: "transform",
              }}
            >
              {/* Middle Tier: .fish-flip (STATIC transform: scaleX(-1) or none, never animated) */}
              <div
                className="fish-flip"
                style={{
                  transform: needsFlip ? "scaleX(-1)" : "none",
                }}
              >
                {/* Inner Tier: .fish-bob (ONLY gentle vertical bobbing) */}
                <div
                  className={`fish-bob ${reducedMotion ? "" : bobClass}`}
                  style={{
                    animationDuration: `${fish.bobDur}s`,
                    willChange: "transform",
                  }}
                >
                  {/* Sizing Container */}
                  <div
                    className="relative pointer-events-none select-none"
                    style={{
                      width: `clamp(${fish.mobileWidth}px, ${fish.vwWidth}vw, ${fish.desktopWidth}px)`,
                      aspectRatio: `${fish.width} / ${fish.height}`,
                    }}
                  >
                    <Image
                      src={fish.src}
                      alt=""
                      fill
                      priority={!fish.mobileHidden}
                      sizes={`(max-width: 640px) ${fish.mobileWidth}px, ${fish.desktopWidth}px`}
                      className="object-contain drop-shadow-[0_6px_14px_rgba(30,20,5,0.18)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* LAYER Z-6: Rising Clay Bubbles (12 Desktop, 6 Mobile)          */}
      {/* Consistent 3D clay spheres: 12px, 22px, 36px, rising & swaying */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-6 pointer-events-none overflow-hidden">
        {HERO_BUBBLES.map((b) => (
          <div
            key={b.id}
            className={`absolute bottom-[-50px] pointer-events-none select-none ${
              b.mobileHidden ? "hidden sm:block" : "block"
            } ${reducedMotion ? "hidden" : "bubble-rise"}`}
            style={{
              left: b.left,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              willChange: "transform, opacity",
            }}
          >
            <div
              className={reducedMotion ? "" : "bubble-sway"}
              style={{
                animationDuration: `${b.swayDuration}s`,
                willChange: "transform",
              }}
            >
              <div
                className="relative select-none"
                style={{
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                }}
              >
                <Image
                  src="/clay/fx/clay-bubble.webp"
                  alt=""
                  fill
                  sizes={`${b.size}px`}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* LAYER Z-30: Corner Decorations Anchored Flush to Bottom Corners*/}
      {/* ============================================================== */}
      <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none">
        
        {/* BOTTOM-LEFT CORNER: Rocks cluster, seaweed, and red crayfish */}
        <div
          className="absolute pointer-events-none select-none overflow-visible"
          style={{
            bottom: "-2px",
            left: "-2px",
            width: "clamp(190px, 24vw, 340px)",
            height: "clamp(140px, 17vw, 240px)",
          }}
        >
          {/* Seaweed 1 (large green) - behind rocks */}
          <div
            className="absolute seaweed-sway-1"
            style={{
              bottom: "0px",
              left: "0px",
              width: "56%",
              height: "94%",
              transformOrigin: "bottom left",
            }}
          >
            <Image
              src="/clay/props/seaweed-1.webp"
              alt=""
              fill
              className="object-contain object-bottom object-left"
              sizes="(max-width: 640px) 120px, 200px"
            />
          </div>

          {/* Seaweed 2 (small green) - behind rocks */}
          <div
            className="absolute seaweed-sway-2"
            style={{
              bottom: "0px",
              left: "18%",
              width: "36%",
              height: "64%",
              transformOrigin: "bottom center",
            }}
          >
            <Image
              src="/clay/props/seaweed-2.webp"
              alt=""
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 80px, 130px"
            />
          </div>

          {/* Grey Clay Rocks Cluster - sits 100% flush on bottom: 0, left: 0 */}
          <div
            className="absolute"
            style={{
              bottom: "0px",
              left: "0px",
              width: "78%",
              height: "66%",
            }}
          >
            <Image
              src="/clay/props/rocks-cluster.webp"
              alt=""
              fill
              className="object-contain object-bottom object-left drop-shadow-[0_6px_16px_rgba(50,50,60,0.3)]"
              sizes="(max-width: 640px) 150px, 270px"
            />
          </div>

          {/* Red Clay Crayfish - resting on bottom-left rocks */}
          <div
            className="absolute crayfish-sway"
            style={{
              bottom: "12%",
              left: "7%",
              width: "48%",
              height: "48%",
            }}
          >
            <Image
              src="/clay/props/crayfish.webp"
              alt=""
              fill
              className="object-contain drop-shadow-[0_6px_16px_rgba(180,40,20,0.35)]"
              sizes="(max-width: 640px) 90px, 160px"
            />
          </div>
        </div>

        {/* BOTTOM-RIGHT CORNER: Large & small rocks and mirrored seaweed */}
        <div
          className="absolute pointer-events-none select-none overflow-visible"
          style={{
            bottom: "-2px",
            right: "-2px",
            width: "clamp(190px, 24vw, 340px)",
            height: "clamp(140px, 17vw, 240px)",
          }}
        >
          {/* Seaweed 1 (large, mirrored) - behind rocks on the right */}
          <div
            className="absolute seaweed-sway-1"
            style={{
              bottom: "0px",
              right: "0px",
              width: "56%",
              height: "94%",
              transformOrigin: "bottom right",
              transform: "scaleX(-1)",
            }}
          >
            <Image
              src="/clay/props/seaweed-1.webp"
              alt=""
              fill
              className="object-contain object-bottom object-right"
              sizes="(max-width: 640px) 120px, 200px"
            />
          </div>

          {/* Seaweed 2 (small, mirrored) - behind rocks */}
          <div
            className="absolute seaweed-sway-2"
            style={{
              bottom: "0px",
              right: "18%",
              width: "36%",
              height: "64%",
              transformOrigin: "bottom center",
              transform: "scaleX(-1)",
            }}
          >
            <Image
              src="/clay/props/seaweed-2.webp"
              alt=""
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 640px) 80px, 130px"
            />
          </div>

          {/* Rock Large - sits flush on bottom */}
          <div
            className="absolute"
            style={{
              bottom: "0px",
              right: "20%",
              width: "60%",
              height: "60%",
            }}
          >
            <Image
              src="/clay/props/rock-large.webp"
              alt=""
              fill
              className="object-contain object-bottom drop-shadow-[0_6px_16px_rgba(50,50,60,0.3)]"
              sizes="(max-width: 640px) 120px, 210px"
            />
          </div>

          {/* Rock Small - sits 100% flush in bottom-right corner */}
          <div
            className="absolute"
            style={{
              bottom: "0px",
              right: "0px",
              width: "44%",
              height: "48%",
            }}
          >
            <Image
              src="/clay/props/rock-small.webp"
              alt=""
              fill
              className="object-contain object-bottom object-right drop-shadow-[0_4px_12px_rgba(50,50,60,0.25)]"
              sizes="(max-width: 640px) 90px, 150px"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
