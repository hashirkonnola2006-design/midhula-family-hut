"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/content";

interface FloatingWhatsAppProps {
  hidden?: boolean;
}

export function FloatingWhatsApp({ hidden = false }: FloatingWhatsAppProps) {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("#contact, #shipping-banner");
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isAnyVisible = entries.some((e) => e.isIntersecting);
        setFooterVisible(isAnyVisible);
      },
      { threshold: 0.05 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  if (hidden || footerVisible) return null;

  return (
    <aside
      className="fixed z-40 transition-all duration-300"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        right: "16px",
      }}
      aria-label="Contact on WhatsApp"
    >
      <a
        href={getWhatsAppUrl("Hi Midhula Farm Hut, I'd like to check current fish stock & pricing!")}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full clay-btn-orange shadow-[0_8px_24px_rgba(255,106,19,0.45)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform group"
        aria-label="Chat with us on WhatsApp"
      >
        <div className="relative w-8 h-8 shrink-0 group-hover:scale-110 transition-transform">
          <Image
            src="/clay/icons/whatsapp.webp"
            alt="WhatsApp"
            fill
            className="object-contain"
          />
        </div>
      </a>
    </aside>
  );
}
