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
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full relative flex items-center justify-center cursor-pointer active:scale-95 hover:scale-105 transition-transform duration-200 drop-shadow-[0_6px_18px_rgba(20,100,55,0.4)] group"
        aria-label="Chat with us on WhatsApp"
      >
        <Image
          src="/clay/icons/whatsapp-circle-btn.webp"
          alt="WhatsApp"
          fill
          className="object-contain"
        />
      </a>
    </aside>
  );
}
