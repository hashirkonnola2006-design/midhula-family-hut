"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { BRAND, getWhatsAppUrl } from "@/lib/content";

interface NavbarProps {
  lang: "en" | "ml";
  onToggleLang?: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuChange?: (open: boolean) => void;
}

const NAVBAR_LINKS = [
  { id: "fish", label: "Fish", labelMl: "മത്സ്യങ്ങൾ", href: "#species" },
  { id: "farm", label: "Farm", labelMl: "ഫാം", href: "#farm" },
  { id: "arrival", label: "Arrival", labelMl: "ലൈവ് ഗ്യാരണ്ടി", href: "#shipping" },
  { id: "customers", label: "Customers", labelMl: "ഉപഭോക്താക്കൾ", href: "#reviews" },
];

export function Navbar({
  lang = "en",
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
      if (window.scrollY < 200) {
        setActiveSection("hero");
        return;
      }

      const sections = [
        { id: "species", navId: "species" },
        { id: "farm", navId: "farm" },
        { id: "shipping", navId: "shipping" },
        { id: "reviews", navId: "reviews" },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220) {
            setActiveSection(s.navId);
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
          
          {/* Brand Logo White Clay Pill */}
          <a
            href="#hero"
            className="flex items-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#FFFDF8] border border-[#F0DEC0]/80 shadow-[0_4px_14px_rgba(180,140,30,0.1)] hover:shadow-[0_6px_18px_rgba(180,140,30,0.16)] transition-all duration-200 active:scale-95"
            aria-label="Midhula Farm Hut"
          >
            <div className="relative w-[125px] sm:w-[155px] h-[30px] sm:h-[36px] flex items-center">
              <Image
                src="/clay/logo/logo.webp"
                alt="Midhula Farm Hut"
                fill
                className="object-contain object-left block"
                priority
              />
            </div>
          </a>

          {/* Desktop Navigation: 3 Clean Links in White Clay Pill Bar */}
          <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF8] border border-[#F0DEC0]/80 shadow-[0_4px_14px_rgba(180,140,30,0.1)]">
            {NAVBAR_LINKS.map((item) => {
              const targetId = item.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "clay-pill-orange px-4 py-1.5 text-white shadow-[0_4px_10px_rgba(255,106,19,0.35)]"
                      : "px-3.5 py-1.5 text-[#1B2A38] hover:text-[#1F4FFF] rounded-full"
                  }`}
                >
                  {lang === "en" ? item.label : item.labelMl}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Mobile Hamburger Button & Desktop Balance Spacer */}
          <div className="flex items-center justify-end md:w-[125px] sm:md:w-[155px]">
            {/* Mobile Hamburger Button (44px min tap target) */}
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-[#FFFDF8] border border-[#F0DEC0]/80 shadow-sm text-[#0E2038] flex items-center justify-center cursor-pointer active:scale-[0.97]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* ==================================================================== */}
      {/* Mobile Slide-In Navigation Drawer (Full-Height Overlay)               */}
      {/* ==================================================================== */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0E2038]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs bg-[#FFF8E7] h-full shadow-2xl p-6 flex flex-col justify-between z-10 border-l-2 border-[#F0DFB8]">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#F0DFB8] mb-6">
                <div className="relative w-36 h-9">
                  <Image
                    src="/clay/logo/logo.webp"
                    alt="Midhula Farm Hut"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-full clay-btn-cream flex items-center justify-center cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links (>=44px touch targets) */}
              <nav className="flex flex-col gap-2">
                {NAVBAR_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between h-12 px-4 rounded-xl text-base font-bold text-[#0E2038] hover:bg-[#FFE9A0]/60 active:scale-[0.98] transition-all"
                  >
                    <span>{lang === "en" ? link.label : link.labelMl}</span>
                    <span className="text-[#FF6A13] text-lg">→</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-[#F0DFB8] flex flex-col gap-3">
              {/* WhatsApp Action Button */}
              <a
                href={getWhatsAppUrl("Hi Midhula Farm Hut, I'd like to check available stock!")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="w-full h-[52px] rounded-full font-bold text-sm text-white clay-btn-green flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98]"
              >
                <div className="relative w-5 h-5 shrink-0">
                  <Image
                    src="/clay/icons/whatsapp-circle-btn.webp"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span>Order on WhatsApp</span>
              </a>

              <p className="text-center text-xs font-semibold text-[#0E2038]/60 mt-1">
                {BRAND.location}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
