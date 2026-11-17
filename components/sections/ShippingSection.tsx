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
    <section id="shipping" className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#FFE9A8] overflow-hidden">
      {/* ============================================================== */}
      {/* Background Ambient Swimming Fish Crossing Behind Heading       */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* Subtle Pink Guppy swimming LTR */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-ltr opacity-80"
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

        {/* Small Orange Guppy 2 swimming RTL */}
        <div
          className="fish-lane absolute pointer-events-none fish-track-rtl opacity-85"
          style={{
            bottom: "10%",
            left: 0,
            animationDuration: "24s",
            animationDelay: "-14s",
            willChange: "transform",
          }}
        >
          <div className="fish-flip" style={{ transform: "scaleX(-1)" }}>
            <div className="fish-bob fish-bob-subtle" style={{ animationDuration: "2.6s" }}>
              <div className="relative w-28 h-14">
                <Image
                  src="/clay/fish/orange-small-2.webp"
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
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill-orange text-xs font-bold text-white mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>{lang === "en" ? "100% Live Arrival Guarantee" : "ലൈവ് അറൈവൽ ഗ്യാരണ്ടി"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold clay-heading-blue mb-3">
            {lang === "en" ? "How We Ship Live Fish" : "ലൈവ് ഷിപ്പിംഗ് പ്രക്രിയ"}
          </h2>

          <p className="text-base sm:text-lg font-medium text-[#0E2038]/85 leading-relaxed">
            {lang === "en"
              ? "From our Nooluvally water tubs right to your doorstep, backed by medical oxygen packing."
              : "മെഡിക്കൽ ഓക്സിജൻ പാക്കിംഗിലൂടെയും തെർമോകോൾ ബോക്സുകളിലൂടെയും സുരക്ഷിതമായി എത്തിക്കുന്നു."}
          </p>
        </div>

        {/* 4 Steps along a wavy clay path */}
        <div className="relative">
          {/* Decorative Wavy Clay Path (Desktop) */}
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

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {SHIPPING_STEPS.map((step, idx) => {
              const iconSrc = STEP_ICONS[idx] || "/clay/icons/shield.webp";
              return (
                <motion.div
                  key={step.step}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.08,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="clay-tile p-5 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Packing Photo in 24px rounded frame */}
                    <div className="relative w-full h-44 rounded-[24px] overflow-hidden bg-[#FFF3DC] border-2 border-[#F0DEC0] mb-5 shadow-inner">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />

                      {/* Clay Step Badge */}
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#1F4FFF] text-white font-display font-extrabold text-sm flex items-center justify-center shadow-md">
                        {step.step}
                      </div>

                      {/* 3D Clay Icon Badge */}
                      <div className="absolute top-2.5 right-2.5 w-10 h-10 p-1 rounded-full bg-[#FFF8E7]/90 backdrop-blur-sm border border-[#F0DEC0] shadow-sm">
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
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#0E2038] mb-2 leading-snug">
                      {lang === "en" ? step.title : step.malayalamTitle}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-sm text-[#0E2038]/80 leading-relaxed font-medium">
                      {lang === "en" ? step.description : step.malayalamDescription}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Guarantee Banner below steps */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="mt-14 p-6 sm:p-8 rounded-[32px] bg-[#FFF8E7] border-2 border-[#F4E4BC] shadow-[0_12px_32px_rgba(180,140,30,0.14)] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 sm:gap-5">
            {/* 3D Clay Shield Icon */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
              <Image
                src="/clay/icons/shield.webp"
                alt="100% Guarantee"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-xl sm:text-2xl text-[#1F4FFF]">
                {lang === "en" ? "100% Live Arrival Guarantee" : "100% ലൈവ് അറൈവൽ ഗ്യാരണ്ടി"}
              </h4>
              <p className="text-xs sm:text-sm text-[#0E2038]/80 mt-1 max-w-xl font-medium leading-relaxed">
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
            className="clay-btn-orange shrink-0 px-8 py-3.5 rounded-full font-bold text-sm inline-flex items-center gap-2.5 cursor-pointer shadow-[0_6px_20px_rgba(255,106,19,0.35)]"
          >
            <div className="relative w-5 h-5 shrink-0">
              <Image
                src="/clay/icons/whatsapp.webp"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
            <span>{lang === "en" ? "Check Pincode Delivery" : "പിൻകോഡ് ഡെലിവറി പരിശോധിക്കൂ"}</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
