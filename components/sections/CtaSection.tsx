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
    <section className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#1F4FFF] overflow-hidden text-center">
      {/* Background soft ambient circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
        <span className="w-80 h-80 rounded-full border-4 border-white animate-ping" />
        <span className="w-[500px] h-[500px] rounded-full border-2 border-white" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider mb-6">
          <Fish className="w-4 h-4" />
          <span>{lang === "en" ? "Fresh Stock Every Week" : "പുതിയ കളക്ഷൻ എല്ലാ ആഴ്ചയും"}</span>
        </div>

        {/* White Clay Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold clay-heading-white mb-4 leading-tight">
          {lang === "en" ? "Ready to fill your tank?" : "നിങ്ങളുടെ അക്വേറിയം നിറയ്ക്കാൻ തയ്യാറാണോ?"}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-medium text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          {lang === "en"
            ? "Connect directly with our fish culturists in Thrissur. We'll share live videos of pairs before packing!"
            : "തൃശ്ശൂരിലെ ഫാമിൽ നിന്നുള്ള മത്സ്യങ്ങളുടെ ലൈവ് വീഡിയോ കണ്ടതിനു ശേഷം ഓർഡർ ചെയ്യാം."}
        </p>

        {/* Orange Clay CTA Button with 3D Clay WhatsApp Icon */}
        <a
          href={getWhatsAppUrl("Hi Midhula Farm Hut, I am ready to order ornamental fish! Please share current catalog & delivery slots.")}
          target="_blank"
          rel="noopener noreferrer"
          className="clay-btn-orange px-10 py-4.5 rounded-full font-bold text-lg inline-flex items-center justify-center gap-3.5 cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
        >
          <div className="relative w-7 h-7 shrink-0">
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
        <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-white/85">
          <Sparkles className="w-3.5 h-3.5 text-[#FFE9A0]" />
          <span>Direct reply from farm founders • 100% Live Arrival Across India</span>
        </div>
      </div>
    </section>
  );
}
