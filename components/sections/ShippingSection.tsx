"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SHIPPING_STEPS, getWhatsAppUrl } from "@/lib/content";

interface ShippingSectionProps {
  lang: "en" | "ml";
}

const STEP_ICONS = [
  "/clay/icons/location.webp",
  "/clay/icons/shield.webp",
  "/clay/icons/truck.webp",
  "/clay/icons/shield.webp",
];

export function ShippingSection({ lang }: ShippingSectionProps) {
  return (
    <section id="shipping" className="relative py-10 sm:py-24 px-3 sm:px-8 bg-[#FFE9A8] overflow-hidden">
      {/* Background Ambient Swimming Fish Crossing Behind Heading */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* Subtle Pink Guppy swimming LTR (Desktop only to prevent mobile clutter) */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-ltr opacity-80 hidden sm:block"
          style={{
            top: "12%",
            left: 0,
            animationDuration: "30s",
            animationDelay: "-6s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "none" }}>
            <div className="fish-bob fish-bob-gentle" style={{ animationDuration: "3.2s" }}>
              <div className="relative w-36 h-22">
                <Image
                  src="/clay/fish/pink-guppy.webp"
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

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full clay-pill-orange text-xs font-bold text-white mb-2.5 sm:mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{lang === "en" ? "100% Live Arrival Guarantee" : "ലൈവ് അറൈവൽ ഗ്യാരണ്ടി"}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold clay-heading-blue mb-2">
            {lang === "en" ? "How We Ship Live Fish" : "ലൈവ് ഷിപ്പിംഗ് പ്രക്രിയ"}
          </h2>

          <p className="text-xs sm:text-base font-medium text-[#0E2038]/85 leading-relaxed max-w-lg mx-auto">
            {lang === "en"
              ? "From our Nooluvally water tubs right to your doorstep, backed by medical oxygen packing."
              : "മെഡിക്കൽ ഓക്സിജൻ പാക്കിംഗിലൂടെയും തെർമോകോൾ ബോക്സുകളിലൂടെയും സുരക്ഷിതമായി എത്തിക്കുന്നു."}
          </p>
        </div>

        {/* 4 Steps: Horizontal Scroll-Snap on Mobile (<640px), Grid on Tablet & Desktop */}
        <div className="relative">
          {/* Decorative Wavy Clay Path (Desktop only) */}
          <div className="hidden lg:block absolute top-[110px] left-[8%] right-[8%] h-4 pointer-events-none z-0">
            <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 24">
              <path
                d="M 0 12 Q 250 -4 500 12 T 1000 12"
                fill="none"
                stroke="#F0D582"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="12 12"
              />
            </svg>
          </div>

          {/* Steps Container */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 overflow-x-auto pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
            {SHIPPING_STEPS.map((step, idx) => {
              const iconSrc = STEP_ICONS[idx] || "/clay/icons/shield.webp";
              return (
                <div
                  key={step.step}
                  className="clay-tile p-3.5 sm:p-5 flex flex-col justify-between w-[78%] sm:w-auto shrink-0 snap-start rounded-[22px] sm:rounded-[32px]"
                >
                  <div>
                    {/* Packing Photo */}
                    <div className="relative w-full h-32 sm:h-44 rounded-[18px] sm:rounded-[24px] overflow-hidden bg-[#FFF3DC] border-2 border-[#F0DEC0] mb-3 sm:mb-4 shadow-inner">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 25vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />

                      {/* Clay Step Badge */}
                      <div className="absolute top-2.5 left-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1F4FFF] text-white font-display font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-md">
                        {step.step}
                      </div>

                      {/* 3D Clay Icon Badge */}
                      <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 p-0.5 rounded-full bg-[#FFF8E7]/90 backdrop-blur-sm border border-[#F0DEC0] shadow-sm">
                        <div className="relative w-full h-full">
                          <Image
                            src={iconSrc}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-display font-extrabold text-sm sm:text-lg lg:text-xl text-[#0E2038] mb-1 sm:mb-2 leading-snug">
                      {lang === "en" ? step.title : step.malayalamTitle}
                    </h3>

                    {/* Step Description */}
                    <p className="text-[11px] sm:text-sm text-[#0E2038]/80 leading-relaxed font-medium">
                      {lang === "en" ? step.description : step.malayalamDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guarantee Banner below steps */}
        <div className="mt-6 sm:mt-12 p-4 sm:p-7 rounded-[24px] sm:rounded-[32px] bg-[#FFF8E7] border-2 border-[#F4E4BC] shadow-[0_8px_24px_rgba(180,140,30,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
            {/* 3D Clay Shield Icon */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
              <Image
                src="/clay/icons/shield.webp"
                alt="100% Guarantee"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-base sm:text-2xl text-[#1F4FFF]">
                {lang === "en" ? "100% Live Arrival Guarantee" : "100% ലൈവ് അറൈവൽ ഗ്യാരണ്ടി"}
              </h4>
              <p className="text-[11px] sm:text-sm text-[#0E2038]/80 mt-0.5 max-w-xl font-medium leading-relaxed">
                {lang === "en"
                  ? "Share an unboxing clip on WhatsApp if any transit loss occurs for an immediate free replacement or refund."
                  : "അൺബോക്സിങ് വീഡിയോ വാട്സ്ആപ്പിൽ പങ്കുവെച്ചാൽ ഉടനടി റീപ്ലേസ്മെന്റോ റീഫണ്ടോ നൽകുന്നു."}
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl("Hi Midhula Farm Hut, I'd like to check live fish delivery options for my pincode:")}
            target="_blank"
            rel="noopener noreferrer"
            className="clay-btn-orange w-full sm:w-auto h-11 sm:h-13 shrink-0 px-6 sm:px-8 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-[0_6px_20px_rgba(255,106,19,0.35)] active:scale-[0.97]"
          >
            <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0">
              <Image
                src="/clay/icons/whatsapp.webp"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
            <span>{lang === "en" ? "Check Pincode Delivery" : "പിൻകോഡ് ഡെലിവറി പരിശോധിക്കൂ"}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
