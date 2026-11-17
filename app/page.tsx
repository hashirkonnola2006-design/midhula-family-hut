"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/hero/Hero";
import { SpeciesSection } from "@/components/sections/SpeciesSection";
import { FarmSection } from "@/components/sections/FarmSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ShippingSection } from "@/components/sections/ShippingSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";
import { VideoModal } from "@/components/VideoModal";
import { ClayWaveDivider } from "@/components/ClayWaveDivider";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function HomePage() {
  const [lang, setLang] = useState<"en" | "ml">("en");
  const [videoOpen, setVideoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ml" : "en"));
  };

  return (
    <div className="relative min-h-screen bg-[#FFE9A0] text-[#0E2038] overflow-x-hidden selection:bg-[#FF6A13]/30 selection:text-[#FF6A13]">
      {/* Clay-styled Sticky Floating Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuChange={setMobileMenuOpen}
      />

      {/* Floating Circular 3D Clay WhatsApp Button (Pinned Bottom-Right) */}
      <FloatingWhatsApp hidden={mobileMenuOpen} />

      {/* Hero: Bold Clay Typography Poster */}
      <Hero lang={lang} onOpenVideo={() => setVideoOpen(true)} />

      {/* Wave Transition 1: Butter-Yellow -> Sky Aqua */}
      <ClayWaveDivider fillColor="#BDEBF5" />

      {/* 1. "Our Fish": Compact 2-Column Mobile Grid with Filter Chips */}
      <SpeciesSection lang={lang} />

      {/* Wave Transition 2: Sky Aqua -> Cream */}
      <ClayWaveDivider fillColor="#FFF8E7" />

      {/* 2. "Inside the Farm": Tub Rows, Story & YouTube Tile */}
      <FarmSection lang={lang} onOpenVideo={() => setVideoOpen(true)} />

      {/* Wave Transition 3: Cream -> Butter-Yellow */}
      <ClayWaveDivider fillColor="#FFE9A0" />

      {/* 3. Stats Row: Count-Up Clay Badges */}
      <StatsSection lang={lang} />

      {/* 4. "How We Ship Live Fish": 4 Steps Along Clay Path */}
      <ShippingSection lang={lang} />

      {/* Wave Transition 4: Butter-Yellow -> Sky Aqua */}
      <ClayWaveDivider fillColor="#BDEBF5" />

      {/* 5. "Happy Customers": Horizontal Scrollable Photo Cards */}
      <ReviewsSection lang={lang} />

      {/* Wave Transition 5: Sky Aqua -> Electric Blue */}
      <ClayWaveDivider fillColor="#1F4FFF" />

      {/* 6. Final CTA Band: Electric Blue Clay Banner */}
      <CtaSection lang={lang} />

      {/* Wave Transition 6: Electric Blue -> Butter Yellow */}
      <ClayWaveDivider fillColor="#FEEDB5" />

      {/* 7. Footer: Butter Yellow with 3D Clay River Wave & Corners */}
      <Footer lang={lang} />

      {/* Video Modal for Malayalam Farm Tour */}
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}
