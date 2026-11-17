"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";

interface StatsSectionProps {
  lang: "en" | "ml";
}

interface StatItem {
  iconSrc: string;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  labelMl: string;
}

const STATS: StatItem[] = [
  {
    iconSrc: "/clay/icons/instagram.webp",
    value: 28.7,
    suffix: "K+",
    label: "Instagram Family",
    labelMl: "ഇൻസ്റ്റാഗ്രാം ഫോളോവേഴ്സ്",
  },
  {
    iconSrc: "/clay/icons/youtube.webp",
    value: 75,
    suffix: "K+",
    label: "YouTube Subscribers",
    labelMl: "യൂട്യൂബ് സബ്സ്ക്രൈബേഴ്സ്",
  },
  {
    iconSrc: "/clay/icons/community.webp",
    value: 1500,
    suffix: "+",
    label: "Posts & Care Guides",
    labelMl: "പങ്കുവെച്ച അറിവുകൾ",
  },
  {
    iconSrc: "/clay/icons/truck.webp",
    value: 100,
    suffix: "%",
    label: "Shipped Live Across India",
    labelMl: "ലൈവ് അറൈവൽ ഗ്യാരണ്ടി",
  },
];

export function StatsSection({ lang }: StatsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-8 bg-[#FFE9A8] overflow-hidden">
      <div ref={containerRef} className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => (
            <StatClayTile
              key={idx}
              stat={stat}
              startCounting={isInView}
              index={idx}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatClayTile({
  stat,
  startCounting,
  index,
  lang,
}: {
  stat: StatItem;
  startCounting: boolean;
  index: number;
  lang: "en" | "ml";
}) {
  const [displayValue, setDisplayValue] = useState(stat.value);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!startCounting || animatedRef.current) return;
    animatedRef.current = true;

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (stat.value - start) * easeProgress;

      setDisplayValue(Number(current.toFixed(stat.value % 1 === 0 ? 0 : 1)));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(stat.value);
      }
    };

    requestAnimationFrame(update);
  }, [startCounting, stat.value]);

  return (
    <div
      className="clay-tile p-5 sm:p-7 flex flex-col items-center text-center justify-between min-h-[190px] sm:min-h-[220px]"
      style={{
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* 3D Clay Icon Container */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-3 shrink-0">
        <Image
          src={stat.iconSrc}
          alt={stat.label}
          fill
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* Numeric Count Up */}
      <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1F4FFF] tracking-tight my-1">
        {stat.prefix}
        {displayValue}
        <span className="text-[#FF6A13] ml-0.5">{stat.suffix}</span>
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm font-bold text-[#0E2038]/85 leading-snug">
        {lang === "en" ? stat.label : stat.labelMl}
      </p>
    </div>
  );
}
