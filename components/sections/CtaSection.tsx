"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Fish } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/content";

interface CtaSectionProps {
  lang: "en" | "ml";
}

export function CtaSection({ lang }: CtaSectionProps) {
  return (
    <section className="relative py-12 sm:py-24 px-4 sm:px-8 bg-[#1F4FFF] overflow-hidden text-center">
      {/* Background soft ambient circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
        <span className="w-80 h-80 rounded-full border-4 border-white animate-ping" />
        <span className="w-[500px] h-[500px] rounded-full border-2 border-white" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
          <Fish className="w-3.5 h-3.5" />
          <span>{lang === "en" ? "Fresh Stock Every Week" : "പുതിയ കളക്ഷൻ എല്ലാ ആഴ്ചയും"}</span>
        </div>

        {/* White Clay Headline */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold clay-heading-white mb-2 sm:mb-4 leading-tight">
          {lang === "en" ? "Ready to fill your tank?" : "നിങ്ങളുടെ അക്വേറിയം നിറയ്ക്കാൻ തയ്യാറാണോ?"}
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-lg font-medium text-white/90 max-w-xl mx-auto mb-6 sm:mb-9 leading-relaxed">
          {lang === "en"
            ? "Connect directly with our fish culturists in Thrissur. We'll share live videos of pairs before packing!"
            : "തൃശ്ശൂരിലെ ഫാമിൽ നിന്നുള്ള മത്സ്യങ്ങളുടെ ലൈവ് വീഡിയോ കണ്ടതിനു ശേഷം ഓർഡർ ചെയ്യാം."}
        </p>

        {/* Orange Clay CTA Button with 3D Clay WhatsApp Icon */}
        <a
          href={getWhatsAppUrl("Hi Midhula Farm Hut, I am ready to order ornamental fish! Please share current catalog & delivery slots.")}
          target="_blank"
          rel="noopener noreferrer"
          className="clay-btn-orange w-full sm:w-auto h-13 sm:h-15 px-8 sm:px-11 rounded-full font-bold text-sm sm:text-base inline-flex items-center justify-center gap-3 cursor-pointer shadow-[0_10px_28px_rgba(0,0,0,0.3)] active:scale-[0.97] transition-transform"
        >
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0">
            <Image
              src="/clay/icons/whatsapp.webp"
              alt="WhatsApp"
              fill
              className="object-contain"
            />
          </div>
          <span>{lang === "en" ? "Order on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യൂ"}</span>
        </a>

        {/* Trust Note */}
        <div className="mt-5 sm:mt-8 flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-white/85">
          <Sparkles className="w-3 h-3 text-[#FFE9A0]" />
          <span>Direct reply from farm founders • 100% Live Arrival Across India</span>
        </div>
      </div>
    </section>
  );
}
