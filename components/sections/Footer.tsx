"use client";

import React from "react";
import Image from "next/image";
import { BRAND, getWhatsAppUrl } from "@/lib/content";

// TODO(client): Confirm these footer claims before launch:
// - "dedicated ornamental fish cultures"
// - "delivering ... to hobbyists across India"

interface FooterProps {
  lang: "en" | "ml";
}

const EXPLORE_LINKS = [
  {
    id: "fish",
    label: "Fish",
    labelMl: "മത്സ്യങ്ങൾ",
    href: "#species",
  },
  {
    id: "farm",
    label: "Farm",
    labelMl: "ഫാം",
    href: "#farm",
  },
  {
    id: "shipping",
    label: "Shipping",
    labelMl: "ഷിപ്പിംഗ്",
    href: "#shipping",
  },
  {
    id: "contact",
    label: "Contact",
    labelMl: "ബന്ധപ്പെടുക",
    href: "#contact",
  },
];

export function Footer({ lang }: FooterProps) {
  return (
    <footer
      id="contact"
      className="relative bg-[#FFF4D6] pt-16 sm:pt-24 text-[#2F3440] overflow-hidden select-none"
    >
      {/* ========================================================== */}
      {/* 1. FAINT ORGANIC TOP-LEFT BLOBS (Matching Reference)        */}
      {/* ========================================================== */}
      <div
        className="absolute top-0 left-0 w-full h-[450px] pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1000 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-12 -left-12 w-[850px] h-[450px] opacity-75"
        >
          <path
            d="M-40,-40 C180,-20 320,60 380,140 C440,220 360,320 280,360 C180,410 40,380 -40,320 Z"
            fill="#FCEFC5"
          />
          <path
            d="M-40,-40 C120,-10 240,40 280,110 C320,180 260,260 190,290 C110,325 20,310 -40,260 Z"
            fill="#FDF0C6"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* ========================================================== */}
      {/* 2. MAIN 3-COLUMN CONTENT CONTAINER (Max 1200px)            */}
      {/* ========================================================== */}
      <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10 z-20">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-0 items-stretch">
          
          {/* -------------------------------------------------------- */}
          {/* COLUMN 1: Brand Column (Widest, ~42% width)              */}
          {/* -------------------------------------------------------- */}
          <div className="min-[900px]:col-span-5 min-[900px]:pr-8 lg:pr-10 min-[900px]:border-r border-[rgba(60,50,30,0.12)] flex flex-col items-start justify-start">
            {/* Transparent Logo (w ~260px desktop, ~220px mobile) */}
            <a
              href="#hero"
              className="block relative w-[220px] sm:w-[260px] aspect-[1160/256] mb-5 transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4BFF] rounded-lg"
            >
              <Image
                src="/clay/logo/logo.webp"
                alt="Midhula Farm Hut"
                fill
                sizes="(max-width: 640px) 220px, 260px"
                className="object-contain object-left"
                priority
              />
            </a>

            {/* Location Tag with Teal Pin Icon */}
            <div className="flex items-center gap-2.5 mb-4 text-[#2F3440]">
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#20B2AA] shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-[15px] sm:text-[16px] font-normal text-[#2F3440]">
                {lang === "en" ? BRAND.location : BRAND.malayalamLocation}
              </span>
            </div>

            {/* Bio Description (Muted warm grey #6B645A, ~17px, line-height 1.7) */}
            <p className="text-[15px] sm:text-[17px] font-normal text-[#6B645A] leading-[1.7] max-w-md">
              {lang === "en"
                ? "Dedicated ornamental fish cultures delivering vibrant farm-bred livebearers, dwarf crayfish, and shrimp to hobbyists across India."
                : "കേരളത്തിന്റെ തനതു ഗുണമേന്മയുള്ള വർണ്ണമത്സ്യങ്ങളും അക്വേറിയം ജീവികളും നിങ്ങളുടെ വീട്ടുപടിക്കൽ എത്തിക്കുന്നു."}
            </p>
          </div>

          {/* -------------------------------------------------------- */}
          {/* COLUMN 2: Explore Farm (~28% width)                      */}
          {/* -------------------------------------------------------- */}
          <nav
            aria-label="Explore"
            className="min-[900px]:col-span-3 min-[900px]:px-6 lg:px-8 min-[900px]:border-r border-[rgba(60,50,30,0.12)] flex flex-col pt-4 min-[900px]:pt-0 border-t min-[900px]:border-t-0 border-[rgba(60,50,30,0.12)]"
          >
            <h3 className="font-semibold text-[22px] sm:text-[25px] text-[#2F3440] mb-5 tracking-tight">
              {lang === "en" ? "Explore Farm" : "ലിങ്കുകൾ"}
            </h3>

            <ul className="flex flex-col space-y-[20px] sm:space-y-[22px] list-none p-0 m-0">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="relative inline-block text-[18px] sm:text-[20px] text-[#3B3A36] font-normal hover:text-[#1F4BFF] transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4BFF] rounded"
                  >
                    <span>{lang === "en" ? link.label : link.labelMl}</span>
                    <span
                      className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-[#1F4BFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* -------------------------------------------------------- */}
          {/* COLUMN 3: Follow Us (~30% width)                         */}
          {/* -------------------------------------------------------- */}
          <nav
            aria-label="Social"
            className="min-[900px]:col-span-4 min-[900px]:pl-6 lg:pl-8 flex flex-col pt-4 min-[900px]:pt-0 border-t min-[900px]:border-t-0 border-[rgba(60,50,30,0.12)]"
          >
            <h3 className="font-semibold text-[22px] sm:text-[25px] text-[#2F3440] mb-5 tracking-tight">
              {lang === "en" ? "Follow Us" : "സോഷ്യൽ മീഡിയ"}
            </h3>

            <div className="flex flex-col space-y-[13px] sm:space-y-[14px] w-full">
              {/* WhatsApp Pill */}
              <a
                href={getWhatsAppUrl(
                  "Hi Midhula Farm Hut, I'd like to check your available fish stock and prices."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 sm:gap-4 px-4.5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#FFF9EC] border border-[#F3E5CC]/80 shadow-[0_4px_14px_rgba(60,50,30,0.06),0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(60,50,30,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] active:translate-y-0 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4BFF]"
                aria-label="WhatsApp: +91 8129120437"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                    <rect width="40" height="40" rx="20" fill="#25D366" />
                    <path
                      d="M28.5 20c0-4.69-3.81-8.5-8.5-8.5S11.5 15.31 11.5 20c0 1.58.43 3.06 1.19 4.34L11.5 28.5l4.3-1.13c1.23.69 2.65 1.13 4.2 1.13 4.69 0 8.5-3.81 8.5-8.5z"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M24.8 22.7c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.77-1.09-.65-.58-1.09-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.21-.69-1.65-.18-.44-.37-.38-.5-.39h-.43c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.86s.8 2.15.91 2.3c.11.15 1.57 2.4 3.8 3.37.53.23.94.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.09-.2-.15-.42-.26z"
                      fill="#25D366"
                    />
                  </svg>
                </div>
                <span className="text-[13.5px] min-[400px]:text-[14.5px] sm:text-[15.5px] font-normal text-[#2F3440] tracking-normal whitespace-nowrap">
                  WhatsApp: +91 8129120437
                </span>
              </a>

              {/* Instagram Pill */}
              <a
                href="https://instagram.com/midhula_farm_hut"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 sm:gap-4 px-4.5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#FFF9EC] border border-[#F3E5CC]/80 shadow-[0_4px_14px_rgba(60,50,30,0.06),0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(60,50,30,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] active:translate-y-0 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4BFF]"
                aria-label="Instagram: @midhula_farm_hut"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                    <defs>
                      <linearGradient id="igGradientFooter" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFDC80" />
                        <stop offset="25%" stopColor="#F77737" />
                        <stop offset="50%" stopColor="#F56040" />
                        <stop offset="75%" stopColor="#C13584" />
                        <stop offset="100%" stopColor="#405DE6" />
                      </linearGradient>
                    </defs>
                    <rect width="40" height="40" rx="12" fill="url(#igGradientFooter)" />
                    <rect
                      x="11"
                      y="11"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="20" cy="20" r="4.5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                    <circle cx="24.5" cy="15.5" r="1.2" fill="#FFFFFF" />
                  </svg>
                </div>
                <span className="text-[13.5px] min-[400px]:text-[14.5px] sm:text-[15.5px] font-normal text-[#2F3440] tracking-normal whitespace-nowrap">
                  Instagram: @midhula_farm_hut
                </span>
              </a>

              {/* YouTube Pill */}
              <a
                href={BRAND.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 sm:gap-4 px-4.5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#FFF9EC] border border-[#F3E5CC]/80 shadow-[0_4px_14px_rgba(60,50,30,0.06),0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(60,50,30,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] active:translate-y-0 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4BFF]"
                aria-label="YouTube: Midhula Farm Hut"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                    <rect width="40" height="40" rx="12" fill="#FF0000" />
                    <path d="M17 14.5L26 20L17 25.5V14.5Z" fill="#FFFFFF" />
                  </svg>
                </div>
                <span className="text-[13.5px] min-[400px]:text-[14.5px] sm:text-[15.5px] font-normal text-[#2F3440] tracking-normal whitespace-nowrap">
                  YouTube: Midhula Farm Hut
                </span>
              </a>
            </div>
          </nav>

        </div>

        {/* ========================================================== */}
        {/* 3. BOTTOM ROW: Divider, Copyright & Passion Text           */}
        {/* ========================================================== */}
        <div className="border-t border-[rgba(60,50,30,0.12)] mt-10 sm:mt-14 pt-7 sm:pt-8 mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[15px] sm:text-[16px] font-normal text-[#6B645A]">
            <div>© 2026 Midhula Farm Hut. All rights reserved.</div>
            <div>Bred with passion in Thrissur, Kerala</div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. BIG SOFT LAYERED SVG WAVES AT BOTTOM                    */}
      {/* ========================================================== */}
      <div
        className="relative w-full h-[90px] sm:h-[135px] lg:h-[145px] overflow-hidden leading-none pointer-events-none select-none z-10"
        aria-hidden="true"
      >
        {/* Wave Layer 1: Back Light Blue (#7CCBFF), slowest loop */}
        <div className="absolute inset-x-0 bottom-0 w-[200%] h-full motion-safe:animate-[waveDrift_28s_linear_infinite]">
          <svg
            viewBox="0 0 2880 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            <path
              d="M0,70 C360,110 720,25 1080,65 C1440,105 1800,25 2160,65 C2520,105 2700,45 2880,70 L2880,140 L0,140 Z"
              fill="#7CCBFF"
            />
          </svg>
        </div>

        {/* Wave Layer 2: Middle Sky Blue (#4DA8FF), medium loop */}
        <div className="absolute inset-x-0 bottom-0 w-[200%] h-full motion-safe:animate-[waveDrift_22s_linear_infinite]">
          <svg
            viewBox="0 0 2880 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            <path
              d="M0,82 C320,38 680,115 1040,75 C1400,35 1760,115 2120,75 C2480,35 2720,95 2880,82 L2880,140 L0,140 Z"
              fill="#4DA8FF"
            />
          </svg>
        </div>

        {/* Wave Layer 3: Front Deeper Blue (#2F7BFF -> #165EDA Gradient), fastest loop */}
        <div className="absolute inset-x-0 bottom-0 w-[200%] h-full motion-safe:animate-[waveDrift_17s_linear_infinite]">
          <svg
            viewBox="0 0 2880 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="frontWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2F7BFF" />
                <stop offset="50%" stopColor="#256FEF" />
                <stop offset="100%" stopColor="#165EDA" />
              </linearGradient>
            </defs>
            <path
              d="M0,55 C380,115 760,40 1140,85 C1520,130 1900,40 2280,85 C2660,130 2780,70 2880,55 L2880,140 L0,140 Z"
              fill="url(#frontWaveGradient)"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 5. MOTION STYLES (Infinite Horizontal Wave Drift)          */}
      {/* ========================================================== */}
      <style jsx>{`
        @keyframes waveDrift {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
          }
        }
      `}</style>
    </footer>
  );
}
