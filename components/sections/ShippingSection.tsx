"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SHIPPING_STEPS, getWhatsAppUrl } from "@/lib/content";

interface ShippingSectionProps {
  lang: "en" | "ml";
}

export function ShippingSection({ lang }: ShippingSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldAnimate = mounted && !prefersReducedMotion;

  return (
    <section
      id="shipping"
      style={{ scrollMarginTop: "-10px" }}
      className="relative pt-20 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#FDE58B] overflow-hidden select-none"
    >
      <span id="arrival" className="absolute top-0 pointer-events-none" style={{ scrollMarginTop: "-10px" }} />
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, #FFF2B2 0%, rgba(253,229,139,0) 80%)",
        }}
        aria-hidden="true"
      />

      {/* Floating Ambient Clay Bubbles around Title */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute top-16 left-[12%] w-6 h-6 sm:w-8 sm:h-8 opacity-80 animate-float-slow">
          <Image src="/clay/shipping/bubbles.webp" alt="" fill className="object-contain" priority unoptimized />
        </div>
        <div className="absolute top-28 left-[24%] w-4 h-4 sm:w-5 sm:h-5 opacity-70 animate-float-delayed">
          <Image src="/clay/shipping/bubbles.webp" alt="" fill className="object-contain" priority unoptimized />
        </div>
        <div className="absolute top-20 right-[15%] w-7 h-7 sm:w-9 sm:h-9 opacity-75 animate-float-slow">
          <Image src="/clay/shipping/bubbles.webp" alt="" fill className="object-contain" priority unoptimized />
        </div>
        <div className="absolute top-36 right-[26%] w-5 h-5 sm:w-6 sm:h-6 opacity-65 animate-float-delayed">
          <Image src="/clay/shipping/bubbles.webp" alt="" fill className="object-contain" priority unoptimized />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ================================================================== */}
        {/* Header (Centered with Pink Guppy & Orange Guarantee Pill)           */}
        {/* ================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 relative">
          {/* Orange Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full clay-pill-orange text-xs sm:text-sm font-bold text-white mb-3 shadow-[0_4px_12px_rgba(255,106,19,0.3)]">
            <span>{lang === "en" ? "100% Live Arrival Guarantee" : "100% ലൈവ് അറൈവൽ ഗ്യാരണ്ടി"}</span>
          </div>

          {/* Title Row with Swimming Pink Guppy to Left */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-2.5">
            {/* Swimming Pink Guppy (~14% section width, bobbing gently) */}
            <motion.div
              animate={
                shouldAnimate
                  ? {
                      y: [-4, 4, -4],
                      rotate: [-1.5, 1.5, -1.5],
                    }
                  : {}
              }
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-14 sm:w-20 md:w-24 lg:w-28 aspect-[750/484] shrink-0"
              aria-hidden="true"
            >
              <Image
                src="/clay/shipping/guppy-pink.webp"
                alt=""
                fill
                className="object-contain drop-shadow-[0_8px_16px_rgba(255,79,163,0.25)]"
                priority
                unoptimized
              />
            </motion.div>

            {/* Electric-Blue 3D Clay Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold clay-heading-blue tracking-tight">
              {lang === "en" ? "How We Ship Live Fish" : "ലൈവ് ഷിപ്പിംഗ് പ്രക്രിയ"}
            </h2>
          </div>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg font-bold text-[#0E2038]/85 max-w-xl mx-auto leading-relaxed">
            {lang === "en"
              ? "From our Nooluvally water tubs right to your doorstep, backed by medical oxygen packing."
              : "ഞങ്ങളുടെ നൂലുവാള്ളിയിലെ വാട്ടർ ടബ്ബുകളിൽ നിന്നും നിങ്ങളുടെ വീട്ടുപടിക്കൽ വരെ, മെഡിക്കൽ ഓക്സിജൻ പാക്കിംഗിലൂടെ."}
          </p>
        </div>

        {/* ================================================================== */}
        {/* 4 Cards in a Row with Clean Arched Dashed Connectors               */}
        {/* ================================================================== */}
        <div className="relative">
          {/* Cards Grid: 4 columns >= 1200px, 2 columns 700-1199px, 1 column < 700px */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 items-stretch">
            {SHIPPING_STEPS.map((step, idx) => (
              <ShippingCard
                key={step.step}
                step={step}
                index={idx}
                lang={lang}
                shouldAnimate={shouldAnimate}
              />
            ))}
          </div>
        </div>

        {/* ================================================================== */}
        {/* Wide Cream Guarantee Banner (32px radius, Shield & Check Pincode)  */}
        {/* ================================================================== */}
        <motion.div
          id="shipping-banner"
          initial={shouldAnimate ? { opacity: 0, y: 30 } : undefined}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-[32px] bg-[#FFF3DC] border-2 border-[#F3E3BC]/85 shadow-[0_10px_32px_rgba(180,140,40,0.12)] flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          {/* Left Side: Shield + Text */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 w-full lg:w-auto">
            {/* 3D Clay Shield with checkmark and splash rays */}
            <motion.div
              animate={
                shouldAnimate
                  ? {
                      scale: [1, 1.03, 1],
                      rotate: [-1, 1, -1],
                    }
                  : {}
              }
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0"
            >
              <Image
                src="/clay/shipping/shield.webp"
                alt="100% Live Guarantee"
                fill
                className="object-contain drop-shadow-[0_6px_16px_rgba(31,79,255,0.22)]"
                priority
                unoptimized
              />
            </motion.div>

            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1F4FFF] clay-heading-blue">
                {lang === "en" ? "100% Live Arrival Guarantee" : "100% ലൈവ് അറൈവൽ ഗ്യാരണ്ടി"}
              </h3>
              {/* TODO(client): unconfirmed claim: 100% live arrival guarantee with free replacement or refund */}
              <p className="text-xs sm:text-sm font-medium text-[#0E2038]/85 mt-1 max-w-xl leading-relaxed">
                {lang === "en"
                  ? "Share an unboxing clip on WhatsApp if any transit loss occurs for an immediate free replacement or refund."
                  : "അൺബോക്സിങ് വീഡിയോ വാട്സ്ആപ്പിൽ പങ്കുവെച്ചാൽ ഉടനടി സൗജന്യ റീപ്ലേസ്മെന്റോ റീഫണ്ടോ നൽകുന്നു."}
              </p>
            </div>
          </div>

          {/* Right Side: Orange Pill Button */}
          <a
            href={getWhatsAppUrl(
              "Hi Midhula Farm Hut, I'd like to check live fish delivery options for my pincode: "
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="clay-btn-orange w-full sm:w-auto h-[52px] sm:h-[54px] shrink-0 px-8 rounded-full font-bold text-sm sm:text-base text-white inline-flex items-center justify-center gap-3 cursor-pointer shadow-[0_6px_22px_rgba(255,106,19,0.38)] active:scale-95 transition-all whitespace-nowrap"
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

/**
 * 3D Clay Shipping Step Card
 * Cream background, 32px radius, blue circular badge overlapping top-left,
 * frameless 3D clay illustration with soft oval ground shadow, bold navy title, body text.
 */
function ShippingCard({
  step,
  index,
  lang,
  shouldAnimate,
}: {
  step: (typeof SHIPPING_STEPS)[0];
  index: number;
  lang: "en" | "ml";
  shouldAnimate: boolean;
}) {
  // Idle animation per card
  const getIdleAnimation = () => {
    if (!shouldAnimate) return undefined;
    switch (step.step) {
      case 1:
        // Tub fish bobs
        return {
          y: [-3, 3, -3],
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
        };
      case 2:
        // Bag bubbles rise & float
        return {
          y: [-2.5, 2.5, -2.5],
          rotate: [-0.6, 0.6, -0.6],
          transition: { duration: 3.8, repeat: Infinity, ease: "easeInOut" as const },
        };
      case 3:
        // Box wobbles slightly
        return {
          rotate: [-0.8, 0.8, -0.8],
          y: [-2, 2, -2],
          transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" as const },
        };
      case 4:
        // Van rocks gently
        return {
          x: [-2.5, 2.5, -2.5],
          y: [-1, 1, -1],
          transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const },
        };
      default:
        return undefined;
    }
  };

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, scale: 0.88, y: 30 } : undefined}
      whileInView={
        shouldAnimate
          ? {
              opacity: 1,
              scale: [0.88, 1.03, 0.98, 1],
              y: 0,
            }
          : undefined
      }
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="relative bg-[#FFF3DC] rounded-[32px] border-2 border-[#F3E3BC]/85 p-6 sm:p-7 shadow-[inset_0_2px_2px_rgba(255,255,255,0.85),0_10px_28px_rgba(180,140,40,0.12)] hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),0_16px_36px_rgba(180,140,40,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full group"
    >
      {/* Overlapping Blue Circular Number Badge (Top-Left) */}
      <div
        className="absolute -top-3.5 -left-3.5 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1F4FFF] text-white font-extrabold text-sm sm:text-base flex items-center justify-center shadow-[0_4px_14px_rgba(31,79,255,0.38)] z-20 group-hover:scale-110 transition-transform"
        aria-hidden="true"
      >
        {step.step}
      </div>

      <div>
        {/* Upper Half: Frameless Clay Illustration with Soft Oval Ground Shadow */}
        <div className="relative w-full h-44 sm:h-48 flex items-center justify-center mb-5 pt-2">
          {/* Soft Oval Ground Shadow */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[72%] h-4 bg-[#D4BC88]/40 rounded-[100%] blur-[4px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Clay Illustration with Idle Animation */}
          <motion.div
            animate={getIdleAnimation()}
            className="relative w-full h-full flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-[240px] max-h-[160px]">
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1200px) 45vw, 25vw"
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </div>

        {/* Bold Navy Title */}
        <h3 className="font-display font-extrabold text-base sm:text-lg lg:text-xl text-[#0E2038] mb-2 leading-snug group-hover:text-[#1F4FFF] transition-colors">
          {lang === "en" ? step.title : step.malayalamTitle}
        </h3>

        {/* Body Text */}
        <p className="text-xs sm:text-sm text-[#0E2038]/80 leading-relaxed font-medium">
          {lang === "en" ? step.description : step.malayalamDescription}
        </p>
      </div>

      {/* Playful Arched Dashed Step Connector (Desktop & Tablet Horizontal Gaps) */}
      {index < 3 && (
        <div
          className={`absolute left-full top-[108px] w-6 lg:w-7 h-6 -translate-y-1/2 items-center justify-center pointer-events-none z-20 ${
            index === 0 || index === 2 ? "hidden md:flex" : "hidden xl:flex"
          }`}
          aria-hidden="true"
        >
          <svg
            className="w-full h-auto overflow-visible"
            viewBox="0 0 28 16"
            fill="none"
          >
            {/* Smooth Arched Dashed Trajectory bridging the gap */}
            <path
              d="M 2 12 Q 13.5 -7 25 10"
              stroke="#FF7A13"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="3.6 4"
            />
            {/* Soft Rounded Clay Directional Chevron */}
            <path
              d="M 20.5 7 L 25 10 L 21.5 13.5"
              stroke="#FF7A13"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Mobile-only Vertical Connector to Next Card */}
      {index < 3 && (
        <div className="md:hidden flex justify-center -mb-9 mt-4 z-10 pointer-events-none">
          <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="28"
              stroke="#FF8A2A"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="5 6"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
