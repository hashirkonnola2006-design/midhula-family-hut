"use client";

import React from "react";
import Image from "next/image";
import { BRAND, getWhatsAppUrl } from "@/lib/content";

interface FooterProps {
  lang: "en" | "ml";
}

const EXPLORE_LINKS = [
  {
    id: "fish",
    label: "Fish",
    labelMl: "മത്സ്യങ്ങൾ",
    href: "#species",
    icon: "/clay/icons/nav-fish.webp",
  },
  {
    id: "farm",
    label: "Farm",
    labelMl: "ഫാം കാഴ്ചകൾ",
    href: "#farm",
    icon: "/clay/icons/nav-farm.webp",
  },
  {
    id: "shipping",
    label: "Shipping",
    labelMl: "ഷിപ്പിംഗ്",
    href: "#shipping",
    icon: "/clay/icons/nav-shipping.webp",
  },
  {
    id: "contact",
    label: "Contact",
    labelMl: "ബന്ധപ്പെടുക",
    href: "#contact",
    icon: "/clay/icons/nav-contact.webp",
  },
];

export function Footer({ lang }: FooterProps) {
  return (
    <footer
      id="contact"
      className="relative bg-[#FEEDB5] pt-20 sm:pt-28 pb-28 sm:pb-36 px-4 sm:px-8 text-[#1B2A38] z-10 overflow-hidden select-none"
    >
      {/* ========================================================== */}
      {/* Translucent Clay Bubbles on Left & Right                   */}
      {/* ========================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden" aria-hidden="true">
        {/* Left Bubbles */}
        <div className="absolute left-3 sm:left-8 top-1/2 -translate-y-8 w-5 h-5 sm:w-6 sm:h-6 opacity-85">
          <Image src="/clay/fx/bubble-2.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute left-6 sm:left-14 top-1/2 translate-y-6 w-6 h-6 sm:w-8 sm:h-8 opacity-80">
          <Image src="/clay/fx/bubble-1.webp" alt="" fill className="object-contain" />
        </div>

        {/* Right Bubbles */}
        <div className="absolute right-4 sm:right-12 top-20 sm:top-24 w-8 h-8 sm:w-10 sm:h-10 opacity-85">
          <Image src="/clay/fx/bubble-1.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute right-3 sm:right-8 top-1/2 -translate-y-4 w-5 h-5 sm:w-6 sm:h-6 opacity-80">
          <Image src="/clay/fx/bubble-3.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute right-8 sm:right-16 top-1/2 translate-y-8 w-6 h-6 sm:w-7 sm:h-7 opacity-75">
          <Image src="/clay/fx/bubble-2.webp" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* ========================================================== */}
      {/* Main Content Grid (3 Columns)                              */}
      {/* ========================================================== */}
      <div className="max-w-6xl mx-auto relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-start">
          
          {/* Column 1: Brand Logo, Location & Bio */}
          <div className="md:col-span-5 md:pr-10 lg:pr-12 md:border-r border-[#E8DAB2] flex flex-col items-start">
            {/* 3D Clay Logo */}
            <a href="#hero" className="block relative w-48 sm:w-56 h-12 sm:h-14 mb-3 transition-transform hover:scale-105 active:scale-95">
              <Image
                src="/clay/logo/logo.webp"
                alt="Midhula Farm Hut"
                fill
                sizes="(max-width: 640px) 200px, 240px"
                className="object-contain object-left"
                priority
              />
            </a>

            {/* Location Tag */}
            <div className="flex items-center gap-2 mb-3.5">
              <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0">
                <Image
                  src="/clay/icons/location-green.webp"
                  alt="Location"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#1B2A38]">
                {lang === "en" ? BRAND.location : BRAND.malayalamLocation}
              </span>
            </div>

            {/* Description Bio */}
            <p className="text-xs sm:text-[13px] font-medium text-[#3D4A5C] leading-relaxed max-w-sm">
              {lang === "en"
                ? "Dedicated ornamental fish culturists delivering vibrant farm-bred livebearers, dwarf crayfish, and shrimp to hobbyists across India."
                : "കേരളത്തിന്റെ തനതു ഗുണമേന്മയുള്ള വർണ്ണമത്സ്യങ്ങളും അക്വേറിയം ജീവികളും നിങ്ങളുടെ വീട്ടുപടിക്കൽ എത്തിക്കുന്നു."}
            </p>
          </div>

          {/* Column 2: Explore Farm Links */}
          <div className="md:col-span-3 md:px-8 lg:px-10 md:border-r border-[#E8DAB2]">
            <h4 className="font-display font-extrabold text-base sm:text-lg text-[#1B2A38] mb-4 sm:mb-5">
              {lang === "en" ? "Explore Farm" : "ലിങ്കുകൾ"}
            </h4>

            <div className="flex flex-col gap-3 sm:gap-3.5">
              {EXPLORE_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="group flex items-center gap-3.5 transition-transform hover:translate-x-1"
                >
                  {/* Single Clean 3D Clay Squircle Tile */}
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)] group-hover:scale-105 transition-transform">
                    <Image
                      src={link.icon}
                      alt={link.label}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Label */}
                  <span className="text-sm sm:text-[15px] font-bold text-[#1B2A38] group-hover:text-[#1F4FFF] transition-colors">
                    {lang === "en" ? link.label : link.labelMl}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Connect With Us Social Cards */}
          <div className="md:col-span-4 md:pl-8 lg:pl-10 flex flex-col">
            <h4 className="font-display font-extrabold text-base sm:text-lg text-[#1B2A38] mb-4 sm:mb-5">
              {lang === "en" ? "Connect With Us" : "സോഷ്യൽ മീഡിയ"}
            </h4>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              {/* WhatsApp Card */}
              <a
                href={getWhatsAppUrl("Hi Midhula Farm Hut, I'd like to inquire about your ornamental fish!")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#FFFDF8] border border-[#F0DEC0]/80 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,0.95)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all group"
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src="/clay/icons/whatsapp.webp"
                    alt="WhatsApp"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1B2A38] group-hover:text-[#1F4FFF] transition-colors">
                  WhatsApp: {BRAND.whatsappNumber}
                </span>
              </a>

              {/* Instagram Card */}
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#FFFDF8] border border-[#F0DEC0]/80 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,0.95)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all group"
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src="/clay/icons/instagram.webp"
                    alt="Instagram"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1B2A38] group-hover:text-[#1F4FFF] transition-colors">
                  Instagram: {BRAND.instagramHandle}
                </span>
              </a>

              {/* YouTube Card */}
              <a
                href={BRAND.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#FFFDF8] border border-[#F0DEC0]/80 shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,0.95)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all group"
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src="/clay/icons/youtube.webp"
                    alt="YouTube"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#1B2A38] group-hover:text-[#1F4FFF] transition-colors">
                  YouTube: Midhula Farm Hut
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* Horizontal Divider Line                                    */}
        {/* ========================================================== */}
        <div className="w-full border-t border-[#E8DAB2] mt-10 sm:mt-14 mb-6 sm:mb-8" />

        {/* ========================================================== */}
        {/* Bottom Bar: Copyright, Location Pill Badge, Credit         */}
        {/* ========================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-[13px] font-medium text-[#4B5563] text-center sm:text-left">
          {/* Copyright */}
          <div>
            © 2026 Midhula Farm Hut. All rights reserved.
          </div>

          {/* Center Location Clay Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF8] border border-[#F0DEC0]/80 shadow-[0_3px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] text-xs font-bold text-[#1F4FFF]">
            <div className="relative w-3.5 h-3.5 shrink-0">
              <Image
                src="/clay/icons/location.webp"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span>{lang === "en" ? BRAND.location : BRAND.malayalamLocation}</span>
          </div>

          {/* Passion Credit */}
          <div>
            {lang === "en" ? "Bred with passion in Thrissur, Kerala 💖" : "തൃശ്ശൂരിൽ നിന്നും സ്നേഹത്തോടെ 💖"}
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* Bottom Clay Water Wave Ribbon (100% width)                 */}
      {/* ========================================================== */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none select-none z-10 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 sm:h-24 object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Primary Clay Water Gradient */}
            <linearGradient id="footerClayWater" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38B6FF" />
              <stop offset="35%" stopColor="#258AFE" />
              <stop offset="100%" stopColor="#185FE8" />
            </linearGradient>

            {/* Back Layer Ocean Gradient */}
            <linearGradient id="footerClayWaterBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1F75F8" />
              <stop offset="100%" stopColor="#1248BC" />
            </linearGradient>

            {/* Clay Wave Shadow */}
            <filter id="footerWaveShadow" x="-5%" y="-20%" width="110%" height="150%">
              <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#0A368A" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Secondary Back Wave */}
          <path
            d="M0,45 C200,20 380,60 580,35 C780,10 980,55 1180,30 C1320,15 1400,35 1440,42 L1440,96 L0,96 Z"
            fill="url(#footerClayWaterBack)"
            opacity="0.75"
          />

          {/* Main Clay Water Wave */}
          <path
            d="M0,38 C180,58 360,18 540,40 C720,62 900,22 1080,44 C1260,64 1380,28 1440,36 L1440,96 L0,96 Z"
            fill="url(#footerClayWater)"
            filter="url(#footerWaveShadow)"
          />

          {/* 3D Crest Highlights */}
          <path
            d="M0,38 C180,58 360,18 540,40 C720,62 900,22 1080,44 C1260,64 1380,28 1440,36"
            stroke="#7ED0FF"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M0,38 C180,58 360,18 540,40 C720,62 900,22 1080,44 C1260,64 1380,28 1440,36"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* ========================================================== */}
      {/* Bottom Corner Props Artwork (Flush in corners)             */}
      {/* ========================================================== */}
      {/* Bottom Left: Grey Rocks Cluster, Green Seaweed, Red Clay Crayfish */}
      <div
        className="absolute pointer-events-none select-none z-20 overflow-visible"
        style={{
          bottom: "-2px",
          left: "-2px",
          width: "clamp(180px, 22vw, 320px)",
          height: "clamp(130px, 16vw, 220px)",
        }}
      >
        {/* Seaweed 1 */}
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
            sizes="(max-width: 640px) 110px, 180px"
          />
        </div>

        {/* Seaweed 2 */}
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
            sizes="(max-width: 640px) 70px, 120px"
          />
        </div>

        {/* Grey Rocks Cluster */}
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
            className="object-contain object-bottom object-left drop-shadow-[0_4px_12px_rgba(50,50,60,0.3)]"
            sizes="(max-width: 640px) 140px, 240px"
          />
        </div>

        {/* Red Clay Crayfish */}
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
            sizes="(max-width: 640px) 85px, 150px"
          />
        </div>
      </div>

      {/* Bottom Right: Large & Small Rocks and Mirrored Seaweed */}
      <div
        className="absolute pointer-events-none select-none z-20 overflow-visible"
        style={{
          bottom: "-2px",
          right: "-2px",
          width: "clamp(180px, 22vw, 320px)",
          height: "clamp(130px, 16vw, 220px)",
        }}
      >
        {/* Seaweed 1 (mirrored) */}
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
            sizes="(max-width: 640px) 110px, 180px"
          />
        </div>

        {/* Seaweed 2 (mirrored) */}
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
            sizes="(max-width: 640px) 70px, 120px"
          />
        </div>

        {/* Rock Large */}
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
            className="object-contain object-bottom drop-shadow-[0_4px_12px_rgba(50,50,60,0.3)]"
            sizes="(max-width: 640px) 110px, 190px"
          />
        </div>

        {/* Rock Small */}
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
            className="object-contain object-bottom object-right drop-shadow-[0_3px_10px_rgba(50,50,60,0.25)]"
            sizes="(max-width: 640px) 80px, 140px"
          />
        </div>
      </div>
    </footer>
  );
}
