"use client";

import React from "react";
import Image from "next/image";
import { Fish, Zap } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/content";

interface CtaSectionProps {
  lang: "en" | "ml";
}

// Translucent bubbles matching the mobile reference screenshot
const MOBILE_BUBBLES = [
  { size: 30, left: "7%", top: "12%", duration: 5.4, delay: 0 },
  { size: 14, left: "68%", top: "7%", duration: 4.8, delay: 0.6 },
  { size: 22, right: "10%", top: "11%", duration: 5.8, delay: 0.3 },
  { size: 16, right: "6%", top: "17%", duration: 5.0, delay: 1.1 },
  { size: 28, left: "9%", bottom: "34%", duration: 6.2, delay: 0.5 },
  { size: 38, right: "8%", bottom: "31%", duration: 6.6, delay: 0.9 },
  { size: 18, right: "10%", bottom: "24%", duration: 5.2, delay: 1.4 },
];

export function CtaSection({ lang }: CtaSectionProps) {
  return (
    <section
      id="cta"
      className="relative bg-[#2F65FB] overflow-hidden select-none"
      style={{ backgroundColor: "#2F65FB" }}
    >
      {/* ============================================================ */}
      {/* 1. TOP GENTLE WAVE: Seamless transition from Reviews (#BBDDFA) */}
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
            fill="#BBDDFA"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 1.5 MOBILE AQUATIC WAVE CONTOURS & BUBBLES (<900px)          */}
      {/* ============================================================ */}
      <div className="min-[900px]:hidden absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Layered dark blue curved wave contours giving underwater landscape depth */}
        <svg
          viewBox="0 0 400 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Upper smooth curve */}
          <path
            d="M0,450 C80,420 180,480 400,430 L400,700 L0,700 Z"
            fill="#265EE8"
            opacity="0.55"
          />
          {/* Lower deeper curve */}
          <path
            d="M0,520 C140,500 240,560 400,510 L400,700 L0,700 Z"
            fill="#1E52D8"
            opacity="0.45"
          />
        </svg>

        {/* Translucent Floating Bubbles */}
        {MOBILE_BUBBLES.map((b, idx) => (
          <div
            key={idx}
            className="absolute rounded-full border border-white/55 bg-white/15 backdrop-blur-[1px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-1px_3px_rgba(0,0,0,0.1),0_4px_10px_rgba(0,0,0,0.06)] motion-safe:animate-[idleFloat_5s_ease-in-out_infinite]"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              right: b.right,
              top: b.top,
              bottom: b.bottom,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT AREA (Centered ~900px, generous vertical pad) */}
      {/* ============================================================ */}
      <div className="relative max-w-[920px] mx-auto px-4 sm:px-8 pt-18 sm:pt-28 lg:pt-36 pb-12 sm:pb-32 lg:pb-40 z-10 flex flex-col items-center text-center">
        {/* Glass Badge: FRESH STOCK EVERY WEEK */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-white text-[11px] sm:text-[13px] font-extrabold uppercase tracking-widest mb-4 sm:mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <Fish className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0 drop-shadow-sm" />
          <span>
            {lang === "en" ? "Fresh Stock Every Week" : "പുതിയ കളക്ഷൻ എല്ലാ ആഴ്ചയും"}
          </span>
        </div>

        {/* Headline: Clean heavy white geometric type */}
        <h2 className="text-[36px] sm:text-5xl lg:text-[62px] font-extrabold text-white leading-[1.12] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)] mb-3 sm:mb-5 max-w-xs sm:max-w-3xl">
          {lang === "en" ? (
            <>
              Ready to fill <br className="sm:hidden" />
              your tank?
            </>
          ) : (
            "നിങ്ങളുടെ അക്വേറിയം നിറയ്ക്കാൻ തയ്യാറാണോ?"
          )}
        </h2>

        {/* Subtitle: Two lines on desktop, soft light-blue-white */}
        <p className="text-[13.5px] sm:text-lg lg:text-[19px] text-[#E0EAFF] font-medium leading-relaxed max-w-[330px] sm:max-w-xl mx-auto mb-6 sm:mb-9 drop-shadow-sm px-2">
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
          className="group relative inline-flex items-center justify-center gap-3 w-full max-w-[285px] sm:max-w-[340px] h-[54px] sm:h-[66px] px-6 sm:px-10 rounded-full font-extrabold text-[17px] sm:text-[19px] text-white bg-gradient-to-b from-[#FF881E] to-[#FF6500] hover:from-[#FF922E] hover:to-[#FF7008] active:scale-[0.97] transition-all duration-200 cursor-pointer shadow-[0_12px_28px_rgba(255,100,10,0.45),0_4px_12px_rgba(0,0,0,0.22),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-3px_0_rgba(0,0,0,0.18)]"
          aria-label="Order on WhatsApp"
        >
          {/* Circular WhatsApp Badge matching the mobile reference */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-[0_2px_5px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.5)]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span className="drop-shadow-sm tracking-wide">
            {lang === "en" ? "Order on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യൂ"}
          </span>
        </a>

        {/* Founder Trust Note with Lightning Icon */}
        <div className="mt-3.5 sm:mt-6 inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-[14px] text-white/95 font-medium drop-shadow-sm px-2 text-center whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white shrink-0" />
          <span className="tracking-tight">
            {lang === "en"
              ? "Direct reply from farm founders • 100% Live Arrival Across India"
              : "ഫാം സ്ഥാപകരിൽ നിന്നുള്ള നേരിട്ടുള്ള മറുപടി • 100% ലൈവ് അറൈവൽ ഉറപ്പ്"}
          </span>
        </div>

        {/* Mobile-Only Complete Scene Display (<900px): Bowl + Food Jar matching the reference */}
        <div className="min-[900px]:hidden mt-6 sm:mt-8 w-[310px] sm:w-[360px] aspect-[490/370] relative mx-auto motion-safe:animate-[idleFloat_5.5s_ease-in-out_infinite]">
          <Image
            src="/clay/cta/mobile-bowl-scene.webp"
            alt="Decorated Fishbowl and Fish Food Jar"
            fill
            sizes="360px"
            className="object-contain drop-shadow-[0_16px_28px_rgba(10,30,80,0.3)]"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. DESKTOP LEFT ILLUSTRATION: DECORATED FISHBOWL (>=900px)   */}
      {/* High-quality generated 3D clay & glass fishbowl with sand &  */}
      {/* sandcastle, no fish, no bubbles.                             */}
      {/* ============================================================ */}
      <div
        className="hidden min-[900px]:block absolute left-2 lg:left-6 xl:left-14 top-1/2 -translate-y-[45%] w-[220px] lg:w-[275px] xl:w-[320px] aspect-[734/690] pointer-events-none z-15 motion-safe:animate-[idleFloat_5.5s_ease-in-out_infinite]"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <Image
            src="/clay/cta/bowl.webp"
            alt="Decorated Fishbowl with sand and sandcastle"
            fill
            sizes="(max-width: 1280px) 275px, 320px"
            className="object-contain drop-shadow-[0_16px_32px_rgba(10,30,80,0.28)]"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. DESKTOP RIGHT ILLUSTRATION: FISH FOOD JAR (>=900px)       */}
      {/* High-quality generated 3D clay canister with pellets,        */}
      {/* no bubbles.                                                  */}
      {/* ============================================================ */}
      <div
        className="hidden min-[900px]:block absolute right-3 lg:right-8 xl:right-16 top-1/2 -translate-y-[36%] w-[130px] lg:w-[165px] xl:w-[190px] aspect-[585/718] pointer-events-none z-15 motion-safe:animate-[idleFloat_6.2s_ease-in-out_infinite_1s]"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <Image
            src="/clay/cta/jar.webp"
            alt="Fish Food Jar and Pellets"
            fill
            sizes="(max-width: 1280px) 165px, 190px"
            className="object-contain drop-shadow-[0_16px_32px_rgba(10,30,80,0.28)]"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. BOTTOM GENTLE WAVE: Seamless transition to Footer (#FFF4D6)*/}
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
            fill="#FFF4D6"
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* 6. KEYFRAME MOTION STYLES (Gentle Idle Sway)                 */}
      {/* ============================================================ */}
      <style jsx>{`
        @keyframes idleFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(0.5deg);
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
