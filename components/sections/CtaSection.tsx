"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Fish, Zap } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/content";

// TODO(client): Confirm these final-CTA claims before launch:
// - Live videos of pairs before packing
// - Direct reply from farm founders
// - 100% Live Arrival Across India claim (reconcile with shipping section guarantee)

interface CtaSectionProps {
  lang: "en" | "ml";
}

export function CtaSection({ lang }: CtaSectionProps) {
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <section
      id="cta"
      className="relative bg-[#2F65FB] overflow-hidden select-none transition-colors duration-300"
      style={{ backgroundColor: "#2F65FB" }}
    >
      {/* ============================================================ */}
      {/* 1. TOP GENTLE WAVE: Seamless transition from Reviews (#BDEBF5) */}
      {/* ============================================================ */}
      <div
        className="absolute top-0 left-0 right-0 w-full pointer-events-none z-20 overflow-hidden leading-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-14 lg:h-20 block preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L0,58 C260,86 440,32 860,38 C1120,42 1280,68 1440,52 L1440,0 Z"
            fill="#BDEBF5"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT AREA (Centered ~900px, generous vertical pad) */}
      {/* ============================================================ */}
      <div className="relative max-w-[920px] mx-auto px-4 sm:px-8 pt-18 sm:pt-28 lg:pt-36 pb-20 sm:pb-32 lg:pb-40 z-10 flex flex-col items-center text-center">
        {/* Glass Badge: FRESH STOCK EVERY WEEK */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-white text-[11px] sm:text-[13px] font-extrabold uppercase tracking-widest mb-4 sm:mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <Fish className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0 drop-shadow-sm" />
          <span>
            {lang === "en" ? "Fresh Stock Every Week" : "പുതിയ കളക്ഷൻ എല്ലാ ആഴ്ചയും"}
          </span>
        </div>

        {/* Headline: Clean heavy white geometric type */}
        <h2 className="text-3xl sm:text-5xl lg:text-[62px] font-extrabold text-white leading-[1.12] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)] mb-3 sm:mb-5 max-w-3xl">
          {lang === "en"
            ? "Ready to fill your tank?"
            : "നിങ്ങളുടെ അക്വേറിയം നിറയ്ക്കാൻ തയ്യാറാണോ?"}
        </h2>

        {/* Subtitle: Two lines on desktop, soft light-blue-white */}
        <p className="text-sm sm:text-lg lg:text-[19px] text-[#E0EAFF] font-medium leading-relaxed max-w-xl mx-auto mb-7 sm:mb-9 drop-shadow-sm">
          {lang === "en"
            ? "Connect directly with our fish culturists in Thrissur. We’ll share live videos of pairs before packing!"
            : "തൃശ്ശൂരിലെ ഫാമിൽ നിന്നുള്ള മത്സ്യങ്ങളുടെ ലൈവ് വീഡിയോ കണ്ടതിനു ശേഷം ഓർഡർ ചെയ്യാം."}
        </p>

        {/* Large Orange Pill Button: Order on WhatsApp */}
        <a
          href={getWhatsAppUrl(
            "Hi Midhula Farm Hut, I'd like to check your available fish stock and prices."
          )}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          className="group relative inline-flex items-center justify-center gap-3.5 h-[54px] sm:h-[66px] px-8 sm:px-12 rounded-full font-extrabold text-base sm:text-[19px] text-white bg-[#FF7A1A] hover:bg-[#FF8828] active:scale-[0.97] transition-all duration-200 cursor-pointer shadow-[0_12px_28px_rgba(255,110,20,0.45),0_4px_12px_rgba(0,0,0,0.22),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(0,0,0,0.18)]"
          aria-label="Order on WhatsApp"
        >
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0 drop-shadow-sm">
            <Image
              src="/clay/icons/whatsapp.webp"
              alt="WhatsApp"
              fill
              className="object-contain"
            />
          </div>
          <span className="drop-shadow-sm">
            {lang === "en" ? "Order on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യൂ"}
          </span>
        </a>

        {/* Founder Trust Note with Lightning Icon */}
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 text-xs sm:text-[14px] text-white/95 font-medium drop-shadow-sm">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white shrink-0" />
          <span>
            {lang === "en"
              ? "Direct reply from farm founders • 100% Live Arrival Across India"
              : "ഫാം സ്ഥാപകരിൽ നിന്നുള്ള നേരിട്ടുള്ള മറുപടി • 100% ലൈവ് അറൈവൽ ഉറപ്പ്"}
          </span>
        </div>

        {/* Mobile-Only Fishbowl Display (Placed below button and centered, <900px) */}
        <div className="min-[900px]:hidden mt-8 w-[210px] sm:w-[240px] aspect-[420/580] relative mx-auto motion-safe:animate-[idleFloat_5s_ease-in-out_infinite]">
          <FishbowlComposite buttonHovered={buttonHovered} />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. DESKTOP LEFT ILLUSTRATION: DECORATED FISHBOWL (>=900px)   */}
      {/* ============================================================ */}
      <div
        className="hidden min-[900px]:block absolute left-2 lg:left-6 xl:left-14 top-1/2 -translate-y-[45%] w-[210px] lg:w-[260px] xl:w-[300px] aspect-[420/580] pointer-events-none z-15 motion-safe:animate-[idleFloat_5.5s_ease-in-out_infinite]"
        aria-hidden="true"
      >
        <FishbowlComposite buttonHovered={buttonHovered} />
      </div>

      {/* ============================================================ */}
      {/* 4. DESKTOP RIGHT ILLUSTRATION: FISH FOOD JAR (>=900px)       */}
      {/* ============================================================ */}
      <div
        className="hidden min-[900px]:block absolute right-3 lg:right-8 xl:right-16 top-1/2 -translate-y-[32%] w-[125px] lg:w-[155px] xl:w-[180px] aspect-[320/420] pointer-events-none z-15 motion-safe:animate-[idleFloat_6.2s_ease-in-out_infinite_1s]"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <Image
            src="/clay/cta/jar.webp"
            alt="Fish Food Jar"
            fill
            sizes="(max-width: 1280px) 160px, 180px"
            className="object-contain"
          />

          {/* Bubbles rising gently from jar */}
          <div className="absolute top-[8%] left-[45%] w-2.5 h-2.5 rounded-full bg-white/70 border border-white/90 motion-safe:animate-[bubbleRise_3.5s_ease-in_infinite]" />
          <div className="absolute top-[14%] left-[60%] w-2 h-2 rounded-full bg-white/60 border border-white/80 motion-safe:animate-[bubbleRise_4.2s_ease-in_infinite_1.4s]" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. BOTTOM GENTLE WAVE: Seamless transition to Footer (#FEEDB5)*/}
      {/* ============================================================ */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-20 overflow-hidden leading-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-14 lg:h-20 block preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,90 L0,38 C220,18 460,74 820,58 C1120,44 1300,16 1440,36 L1440,90 Z"
            fill="#FEEDB5"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 6. KEYFRAME MOTION STYLES (Swims, Bubbles, Idle Sway)        */}
      {/* ============================================================ */}
      <style jsx>{`
        @keyframes idleFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(0.4deg);
          }
        }

        @keyframes swimOrange {
          0% {
            transform: translate(0px, 0px) scaleX(1) skewX(0deg);
          }
          25% {
            transform: translate(28px, -5px) scaleX(1) skewX(2deg);
          }
          49% {
            transform: translate(52px, 0px) scaleX(1) skewX(-1deg);
          }
          50% {
            transform: translate(52px, 0px) scaleX(-1) skewX(0deg);
          }
          75% {
            transform: translate(26px, 5px) scaleX(-1) skewX(-2deg);
          }
          99% {
            transform: translate(0px, 0px) scaleX(-1) skewX(1deg);
          }
          100% {
            transform: translate(0px, 0px) scaleX(1) skewX(0deg);
          }
        }

        @keyframes swimPink {
          0% {
            transform: translate(44px, 2px) scaleX(-1) skewX(-2deg);
          }
          25% {
            transform: translate(22px, -6px) scaleX(-1) skewX(1deg);
          }
          49% {
            transform: translate(0px, 0px) scaleX(-1) skewX(0deg);
          }
          50% {
            transform: translate(0px, 0px) scaleX(1) skewX(0deg);
          }
          75% {
            transform: translate(22px, 6px) scaleX(1) skewX(2deg);
          }
          99% {
            transform: translate(44px, 2px) scaleX(1) skewX(-1deg);
          }
          100% {
            transform: translate(44px, 2px) scaleX(-1) skewX(-2deg);
          }
        }

        @keyframes swimBlue {
          0% {
            transform: translate(6px, -3px) scaleX(1) skewX(1deg);
          }
          25% {
            transform: translate(32px, 4px) scaleX(1) skewX(-2deg);
          }
          49% {
            transform: translate(46px, -2px) scaleX(1) skewX(1deg);
          }
          50% {
            transform: translate(46px, -2px) scaleX(-1) skewX(0deg);
          }
          75% {
            transform: translate(22px, -6px) scaleX(-1) skewX(2deg);
          }
          99% {
            transform: translate(6px, -3px) scaleX(-1) skewX(-1deg);
          }
          100% {
            transform: translate(6px, -3px) scaleX(1) skewX(1deg);
          }
        }

        @keyframes pelletSink {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(68px);
            opacity: 0;
          }
        }

        @keyframes bubbleRise {
          0% {
            transform: translateY(0px) scale(0.6);
            opacity: 0;
          }
          25% {
            opacity: 0.85;
          }
          80% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-46px) scale(1.15);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * Reusable Decorated Fishbowl Component:
 * - Renders bowl image with decorations on flat blue background
 * - Animated swimming cutout fish inside water mask
 * - Interactive food pellet sinking on button hover
 * - Code-drawn bubbles rising inside the water
 */
function FishbowlComposite({ buttonHovered }: { buttonHovered: boolean }) {
  return (
    <div className="relative w-full h-full">
      {/* Base Decorated Bowl Image */}
      <Image
        src="/clay/cta/bowl.webp"
        alt="Decorated Fishbowl"
        fill
        sizes="(max-width: 900px) 240px, 300px"
        className="object-contain"
        priority
      />

      {/* Internal Water Mask: Clips swimming fish inside the water layer */}
      <div
        className="absolute top-[34%] left-[11%] w-[78%] h-[48%] rounded-[50%/45%] overflow-hidden pointer-events-none z-10"
        aria-hidden="true"
      >
        {/* Falling Food Pellets (Triggered on Button Hover) */}
        {buttonHovered && (
          <>
            <div
              className="absolute left-[35%] top-[5%] w-2 h-2 z-20 motion-safe:animate-[pelletSink_1.8s_ease-in_infinite]"
              style={{ animationDelay: "0ms" }}
            >
              <Image
                src="/clay/cta/pellet-1.webp"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <div
              className="absolute left-[52%] top-[5%] w-2.5 h-2.5 z-20 motion-safe:animate-[pelletSink_2.1s_ease-in_infinite]"
              style={{ animationDelay: "300ms" }}
            >
              <Image
                src="/clay/cta/pellet-2.webp"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <div
              className="absolute left-[64%] top-[5%] w-2 h-2 z-20 motion-safe:animate-[pelletSink_1.9s_ease-in_infinite]"
              style={{ animationDelay: "600ms" }}
            >
              <Image
                src="/clay/cta/pellet-3.webp"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </>
        )}

        {/* Fish 1: Orange Guppy (Primary swimmer, nibbles up on button hover) */}
        <div
          className={`absolute left-[14%] top-[34%] w-[38px] sm:w-[44px] aspect-[334/219] z-10 motion-safe:animate-[swimOrange_7.5s_ease-in-out_infinite] transition-transform duration-500 ${
            buttonHovered ? "-translate-y-2 scale-105" : ""
          }`}
        >
          <Image
            src="/clay/cta/fish-orange.webp"
            alt="Swimming Orange Guppy"
            fill
            className="object-contain drop-shadow-sm"
          />
        </div>

        {/* Fish 2: Pink Guppy (Upper water swimmer) */}
        <div className="absolute left-[38%] top-[12%] w-[34px] sm:w-[40px] aspect-[750/484] z-10 motion-safe:animate-[swimPink_8.2s_ease-in-out_infinite_1.2s]">
          <Image
            src="/clay/cta/fish-pink.webp"
            alt="Swimming Pink Guppy"
            fill
            className="object-contain drop-shadow-sm"
          />
        </div>

        {/* Fish 3: Blue Guppy (Lower swimmer above castle) */}
        <div className="absolute left-[24%] top-[48%] w-[30px] sm:w-[35px] aspect-[290/183] z-10 motion-safe:animate-[swimBlue_6.8s_ease-in-out_infinite_2.4s]">
          <Image
            src="/clay/cta/fish-blue.webp"
            alt="Swimming Blue Guppy"
            fill
            className="object-contain drop-shadow-sm"
          />
        </div>

        {/* Code-drawn Bubbles rising inside the bowl */}
        <div className="absolute left-[32%] bottom-[18%] w-2 h-2 rounded-full bg-white/75 border border-white/90 motion-safe:animate-[bubbleRise_3.8s_ease-in_infinite]" />
        <div className="absolute left-[58%] bottom-[22%] w-2.5 h-2.5 rounded-full bg-white/65 border border-white/85 motion-safe:animate-[bubbleRise_4.5s_ease-in_infinite_1.8s]" />
        <div className="absolute left-[44%] bottom-[12%] w-1.5 h-1.5 rounded-full bg-white/70 border border-white/80 motion-safe:animate-[bubbleRise_3.2s_ease-in_infinite_0.9s]" />
      </div>

      {/* Floating Bubbles above the bowl rim */}
      <div className="absolute top-[16%] left-[32%] w-3 h-3 rounded-full bg-white/50 border border-white/70 motion-safe:animate-[bubbleRise_4s_ease-in_infinite_0.5s]" />
      <div className="absolute top-[10%] left-[46%] w-4 h-4 rounded-full bg-white/55 border border-white/80 motion-safe:animate-[bubbleRise_5s_ease-in_infinite_1.6s]" />
    </div>
  );
}