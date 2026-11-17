"use client";

import React from "react";
import Image from "next/image";
import { BRAND, FOUNDER_NOTE, getWhatsAppUrl, NAV_LINKS } from "@/lib/content";

interface FooterProps {
  lang: "en" | "ml";
}

export function Footer({ lang }: FooterProps) {
  return (
    <footer id="contact" className="relative bg-[#FFF8E7] pt-12 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-8 text-[#0E2038] z-10 overflow-hidden">
      
      {/* Footer Corner Decorations (hidden on mobile to save vertical space) */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none select-none z-0" aria-hidden="true">
        {/* Bottom Left Corner: Seaweed & Rock */}
        <div className="absolute -bottom-2 left-0 w-36 h-40 opacity-75 hidden sm:block">
          <Image
            src="/clay/props/seaweed-1.webp"
            alt=""
            fill
            className="object-contain object-bottom object-left"
          />
        </div>
        <div className="absolute -bottom-1 left-8 w-28 h-20 opacity-70 hidden sm:block">
          <Image
            src="/clay/props/rock-large.webp"
            alt=""
            fill
            className="object-contain object-bottom object-left"
          />
        </div>

        {/* Bottom Right Corner: Mirrored Seaweed & Small Rock */}
        <div className="absolute -bottom-2 right-0 w-36 h-40 opacity-75 hidden sm:block" style={{ transform: "scaleX(-1)" }}>
          <Image
            src="/clay/props/seaweed-1.webp"
            alt=""
            fill
            className="object-contain object-bottom object-left"
          />
        </div>
        <div className="absolute -bottom-1 right-8 w-24 h-18 opacity-70 hidden sm:block">
          <Image
            src="/clay/props/rock-small.webp"
            alt=""
            fill
            className="object-contain object-bottom object-right"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 pb-8 sm:pb-12 border-b-2 border-[#F0DEC0]">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="relative h-10 w-40 sm:h-12 sm:w-48 mb-2 sm:mb-3">
              <Image
                src={BRAND.logoPath}
                alt="Midhula Farm Hut Logo"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>

            <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
              <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0">
                <Image
                  src="/clay/icons/location.webp"
                  alt="Location"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#1F7A3E]">
                Nooluvally, Thrissur - Kerala
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#0E2038]/85 leading-relaxed max-w-sm mb-3 sm:mb-5">
              {lang === "en"
                ? "Dedicated ornamental fish culturists delivering vibrant farm-bred livebearers, dwarf crayfish, and shrimp to hobbyists across India."
                : "കേരളത്തിന്റെ തനതു ഗുണമേന്മയുള്ള വർണ്ണമത്സ്യങ്ങളും അക്വേറിയം ജീവികളും നിങ്ങളുടെ വീട്ടുപടിക്കൽ എത്തിക്കുന്നു."}
            </p>

            {/* Founder Story Line */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border-2 border-[#F0DEC0] text-[11px] sm:text-xs text-[#0E2038]/85 italic max-w-sm shadow-sm">
              &ldquo;{lang === "en" ? FOUNDER_NOTE.quote : FOUNDER_NOTE.malayalamQuote}&rdquo;
              <span className="block mt-1 font-bold text-[#1F4FFF] not-italic">
                — {FOUNDER_NOTE.author}, {FOUNDER_NOTE.location}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-extrabold text-sm sm:text-base text-[#1F4FFF] uppercase tracking-wider mb-2.5 sm:mb-4">
              {lang === "en" ? "Explore Farm" : "ലിങ്കുകൾ"}
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm font-bold">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="hover:text-[#1F4FFF] transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A13]" />
                    <span>{lang === "en" ? link.label : link.labelMl}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social & WhatsApp Connect */}
          <div className="lg:col-span-4 flex flex-col">
            <h4 className="font-display font-extrabold text-sm sm:text-base text-[#1F4FFF] uppercase tracking-wider mb-2.5 sm:mb-4">
              {lang === "en" ? "Connect With Us" : "സോഷ്യൽ മീഡിയ"}
            </h4>

            <div className="space-y-2.5 sm:space-y-3.5 mb-3 sm:mb-5 text-xs sm:text-sm font-bold">
              {/* WhatsApp */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border-2 border-[#F0DEC0] hover:border-[#1F4FFF] text-[#0E2038] hover:text-[#1F4FFF] transition-all shadow-sm group"
              >
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 group-hover:scale-110 transition-transform">
                  <Image
                    src="/clay/icons/whatsapp.webp"
                    alt="WhatsApp"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-[#0E2038]/60 font-medium">WhatsApp Orders</div>
                  <div className="text-xs sm:text-sm font-bold">{BRAND.whatsappNumber}</div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border-2 border-[#F0DEC0] hover:border-[#1F4FFF] text-[#0E2038] hover:text-[#1F4FFF] transition-all shadow-sm group"
              >
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 group-hover:scale-110 transition-transform">
                  <Image
                    src="/clay/icons/instagram.webp"
                    alt="Instagram"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-[#0E2038]/60 font-medium">Instagram Family</div>
                  <div className="text-xs sm:text-sm font-bold">{BRAND.instagramHandle} (28.7K)</div>
                </div>
              </a>

              {/* YouTube */}
              <a
                href={BRAND.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-[#FFFDF7] border-2 border-[#F0DEC0] hover:border-[#1F4FFF] text-[#0E2038] hover:text-[#1F4FFF] transition-all shadow-sm group"
              >
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 group-hover:scale-110 transition-transform">
                  <Image
                    src="/clay/icons/youtube.webp"
                    alt="YouTube"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-[#0E2038]/60 font-medium">YouTube Channel</div>
                  <div className="text-xs sm:text-sm font-bold">@midhulafarmhut (75K)</div>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[10px] sm:text-xs font-semibold text-[#0E2038]/70 text-center sm:text-left">
          <div>
            © 2026 Midhula Farm Hut. All rights reserved. Nooluvally, Thrissur.
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span>Farm-Bred Ornamental Fish Culturists</span>
            <span>•</span>
            <span className="text-[#1F4FFF]">Kerala, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
