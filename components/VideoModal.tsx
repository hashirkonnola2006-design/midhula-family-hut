"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BRAND } from "@/lib/content";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="relative w-full max-w-4xl bg-[#FFF8E7] rounded-[32px] overflow-hidden border-2 border-[#F0DEC0] shadow-[0_20px_60px_rgba(0,0,0,0.35)] z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 px-6 border-b-2 border-[#F0DEC0] bg-[#FFF8E7]">
              <div className="flex items-center gap-3">
                <div className="relative w-7 h-7 shrink-0">
                  <Image
                    src="/clay/icons/youtube.webp"
                    alt="YouTube"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1F4FFF]">
                  Midhula Farm Hut — Malayalam Farm Tour
                </h3>
              </div>
              <button
                onClick={onClose}
                className="clay-btn-cream w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
                aria-label="Close video modal"
              >
                <X className="w-5 h-5 text-[#0E2038]" />
              </button>
            </div>

            {/* Video Iframe Container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${BRAND.youtubeTourId}?autoplay=1&rel=0`}
                title="Midhula Farm Hut Malayalam Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-[#FFF8E7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#0E2038]/80">
              <span>Visit our farm in Nooluvally, Thrissur or watch on YouTube!</span>
              <a
                href={BRAND.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn-orange px-5 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider shrink-0 inline-flex items-center gap-2"
              >
                <span>Open YouTube Channel →</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
