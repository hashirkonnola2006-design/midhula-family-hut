"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { BRAND, NAV_LINKS, getWhatsAppUrl } from "@/lib/content";

interface NavbarProps {
  lang: "en" | "ml";
  onToggleLang: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuChange?: (open: boolean) => void;
}

export function Navbar({
  lang,
  onToggleLang,
  mobileMenuOpen: propMobileMenuOpen,
  onMobileMenuChange,
}: NavbarProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);

  const isMenuOpen = propMobileMenuOpen ?? internalMenuOpen;
  const setMenuOpen = (open: boolean) => {
    setInternalMenuOpen(open);
    onMobileMenuChange?.(open);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "species", "farm", "shipping", "reviews", "contact"];
      const scrollPos = window.scrollY + 100;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-2 sm:top-3 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none h-14 sm:h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
          
          {/* Brand Logo Pill */}
          <a
            href="#hero"
            className="flex items-center px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#FFF8E7]/95 backdrop-blur-md border border-[#F0DFB8] shadow-[0_4px_16px_rgba(180,140,30,0.12)] hover:shadow-[0_6px_20px_rgba(180,140,30,0.18)] transition-all duration-200"
            aria-label="Midhula Farm Hut"
          >
            <div className="relative w-[120px] sm:w-[160px] h-[30px] sm:h-[38px] flex items-center">
              <Image
                src="/logo.png"
                alt="Midhula Farm Hut"
                fill
                className="object-contain object-left block"
                priority
              />
            </div>
          </a>

          {/* Desktop Navigation: Cream Clay Pill Bar */}
          <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E7]/95 backdrop-blur-md border border-[#F0DFB8] shadow-[0_4px_18px_rgba(180,140,30,0.14)]">
            {NAV_LINKS.map((item) => {
              const targetId = item.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "clay-pill-orange px-4 py-1.5 text-white shadow-[0_4px_10px_rgba(255,106,19,0.35)]"
                      : "px-3.5 py-1.5 text-[#0E2038] hover:text-[#1F4FFF] rounded-full"
                  }`}
                >
                  {lang === "en" ? item.label : item.labelMl}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Language toggle + WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle Pill */}
            <button
              onClick={onToggleLang}
              className="h-10 px-3.5 rounded-full bg-[#FFF8E7]/95 backdrop-blur-md border border-[#F0DFB8] text-xs font-bold text-[#0E2038] hover:text-[#1F4FFF] shadow-[0_4px_14px_rgba(180,140,30,0.12)] transition-all flex items-center gap-1 cursor-pointer active:scale-[0.97]"
              aria-label="Toggle language between English and Malayalam"
            >
              <span className={lang === "en" ? "text-[#1F4FFF] font-black" : "opacity-60"}>
                EN
              </span>
              <span className="opacity-40">|</span>
              <span className={lang === "ml" ? "text-[#1F4FFF] font-black font-malayalam" : "opacity-60 font-malayalam"}>
                മലയാളം
              </span>
            </button>

            {/* Desktop WhatsApp Button */}
            <a
              href={getWhatsAppUrl("Hi Midhula Farm Hut, I'm interested in your guppies and ornamental fishes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm text-white clay-btn-orange shadow-[0_6px_18px_rgba(255,106,19,0.35)] active:scale-[0.97]"
            >
              <div className="relative w-5 h-5 shrink-0">
                <Image
                  src="/clay/icons/whatsapp.webp"
                  alt="WhatsApp"
                  fill
                  className="object-contain"
                />
              </div>
              <span>WhatsApp</span>
            </a>

            {/* Mobile Hamburger Button (44px min tap target) */}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="md:hidden w-11 h-11 rounded-full bg-[#FFF8E7]/95 border border-[#F0DFB8] shadow-sm text-[#0E2038] flex items-center justify-center cursor-pointer active:scale-[0.97]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Slide-In Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative w-full bg-[#FFF8E7] rounded-t-[32px] border-t-2 border-[#F0DEC0] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] p-6 z-10 max-h-[85vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F0DEC0] mb-4">
              <div className="relative w-[130px] h-[32px]">
                <Image
                  src="/logo.png"
                  alt="Midhula Farm Hut"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-[#FFFDF7] border border-[#F0DEC0] flex items-center justify-center text-[#0E2038] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links with 48px Tap Targets */}
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => {
                const targetId = item.href.replace("#", "");
                const isActive = activeSection === targetId;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`h-12 px-4 rounded-2xl font-display font-extrabold text-base flex items-center justify-between transition-all active:scale-[0.98] ${
                      isActive
                        ? "clay-pill-orange text-white shadow-md"
                        : "text-[#0E2038] hover:bg-[#FFF3DC]"
                    }`}
                  >
                    <span>{lang === "en" ? item.label : item.labelMl}</span>
                    <span className="text-xs opacity-60">→</span>
                  </a>
                );
              })}
            </div>

            {/* Language Toggle in Drawer */}
            <div className="mt-4 pt-4 border-t border-[#F0DEC0] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0E2038]/70">
                {lang === "en" ? "Language" : "ഭാഷ"}
              </span>
              <button
                onClick={onToggleLang}
                className="h-10 px-4 rounded-full clay-pill text-xs font-bold text-[#0E2038] flex items-center gap-1.5"
              >
                <span className={lang === "en" ? "text-[#1F4FFF] font-black" : "opacity-60"}>
                  English
                </span>
                <span className="opacity-40">|</span>
                <span className={lang === "ml" ? "text-[#1F4FFF] font-black font-malayalam" : "opacity-60 font-malayalam"}>
                  മലയാളം
                </span>
              </button>
            </div>

            {/* Big WhatsApp Action Button */}
            <div className="mt-4">
              <a
                href={getWhatsAppUrl("Hi Midhula Farm Hut, I'm interested in ordering live fishes!")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="w-full h-13 rounded-full font-bold text-sm text-white clay-btn-orange flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98]"
              >
                <div className="relative w-6 h-6 shrink-0">
                  <Image
                    src="/clay/icons/whatsapp.webp"
                    alt="WhatsApp"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>{lang === "en" ? "Order on WhatsApp" : "വാട്സ്ആപ്പിൽ ഓർഡർ ചെയ്യൂ"}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
