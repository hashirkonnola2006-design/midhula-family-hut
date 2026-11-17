"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { BRAND, NAV_LINKS, getWhatsAppUrl } from "@/lib/content";

interface NavbarProps {
  lang: "en" | "ml";
  onToggleLang: () => void;
}

export function Navbar({ lang, onToggleLang }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "species", "farm", "shipping", "reviews", "contact"];
      const scrollPos = window.scrollY + 120;
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
      <header className="fixed top-3 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* Brand Logo Pill */}
          <a
            href="#hero"
            className="flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#FFF8E7]/95 backdrop-blur-md border border-[#F0DFB8] shadow-[0_4px_16px_rgba(180,140,30,0.12)] hover:shadow-[0_6px_20px_rgba(180,140,30,0.18)] transition-all duration-200"
            aria-label="Midhula Farm Hut"
          >
            <div className="relative w-[130px] sm:w-[160px] h-[34px] sm:h-[40px] flex items-center">
              <Image
                src="/logo.png"
                alt="Midhula Farm Hut"
                fill
                className="object-contain object-left block"
                priority
              />
            </div>
          </a>

          {/* Desktop Navigation: Cream Clay Pill Bar with Active Orange Pill */}
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

          {/* Right Action: Language toggle + Orange WhatsApp Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Toggle Pill */}
            <button
              onClick={onToggleLang}
              className="px-3.5 py-2 rounded-full bg-[#FFF8E7]/95 backdrop-blur-md border border-[#F0DFB8] text-xs font-bold text-[#0E2038] hover:text-[#1F4FFF] shadow-[0_4px_14px_rgba(180,140,30,0.12)] transition-all flex items-center gap-1 cursor-pointer"
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

            {/* Orange Clay WhatsApp Pill Button with 3D Clay Icon */}
            <a
              href={getWhatsAppUrl("Hi Midhula Farm Hut, I'm interested in your guppies and ornamental fishes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm text-white clay-btn-orange shadow-[0_6px_18px_rgba(255,106,19,0.35)]"
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

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#FFF8E7]/95 border border-[#F0DFB8] shadow-sm text-[#0E2038] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-sm mx-auto mt-2 p-4 rounded-3xl bg-[#FFF8E7] border-2 border-[#F0DFB8] shadow-[0_12px_32px_rgba(180,140,30,0.2)] pointer-events-auto flex flex-col gap-2">
            {NAV_LINKS.map((item) => {
              const targetId = item.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold px-4 py-2.5 rounded-2xl transition-all ${
                    isActive
                      ? "clay-pill-orange text-white"
                      : "text-[#0E2038] hover:text-[#1F4FFF] hover:bg-[#FFF3DC]"
                  }`}
                >
                  {lang === "en" ? item.label : item.labelMl}
                </a>
              );
            })}

            <div className="pt-2 border-t border-[#F0DEC0] mt-1">
              <a
                href={getWhatsAppUrl("Hi Midhula Farm Hut, I'm interested in your guppies and ornamental fishes.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-full font-bold text-sm text-white clay-btn-orange flex items-center justify-center gap-2"
              >
                <div className="relative w-5 h-5 shrink-0">
                  <Image
                    src="/clay/icons/whatsapp.webp"
                    alt="WhatsApp"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
