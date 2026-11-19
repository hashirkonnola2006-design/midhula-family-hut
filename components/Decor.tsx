"use client";

import React from "react";
import Image from "next/image";

export type DecorName =
  | "goldfish"
  | "guppy"
  | "koi"
  | "betta"
  | "swordtail"
  | "seaweed-tall"
  | "seaweed-short"
  | "pebbles"
  | "shell"
  | "starfish"
  | "coral"
  | "bubbles";

interface DecorMetadata {
  width: number;
  height: number;
  defaultSize: number;
  defaultAnim: "float" | "sway" | "none";
  defaultOpacity?: number;
}

const DECOR_META: Record<DecorName, DecorMetadata> = {
  goldfish: { width: 218, height: 169, defaultSize: 76, defaultAnim: "float" },
  guppy: { width: 214, height: 161, defaultSize: 74, defaultAnim: "float" },
  koi: { width: 227, height: 147, defaultSize: 82, defaultAnim: "float" },
  betta: { width: 228, height: 189, defaultSize: 78, defaultAnim: "float" },
  swordtail: { width: 278, height: 133, defaultSize: 86, defaultAnim: "float" },
  "seaweed-tall": { width: 165, height: 214, defaultSize: 105, defaultAnim: "sway" },
  "seaweed-short": { width: 196, height: 176, defaultSize: 95, defaultAnim: "sway" },
  pebbles: { width: 217, height: 145, defaultSize: 80, defaultAnim: "none" },
  shell: { width: 163, height: 154, defaultSize: 70, defaultAnim: "none" },
  starfish: { width: 200, height: 180, defaultSize: 72, defaultAnim: "none" },
  coral: { width: 181, height: 183, defaultSize: 74, defaultAnim: "none" },
  bubbles: { width: 160, height: 170, defaultSize: 42, defaultAnim: "float", defaultOpacity: 0.65 },
};

export interface DecorProps {
  name: DecorName;
  /** Positioning classes (e.g. "top-12 left-4 xl:left-8") */
  className?: string;
  /** Rendered width in pixels (height calculated from aspect ratio) */
  size?: number;
  /** Mirror horizontally so fish faces towards content */
  flip?: boolean;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds (defaults to 4.5s - 5.5s) */
  duration?: number;
  /** Override animation type */
  animation?: "float" | "sway" | "none";
  /** Opacity (0 to 1) */
  opacity?: number;
  /** Z-index class (defaults to "z-10") */
  zIndex?: string;
  /** Responsive visibility: "desktop" (>=1024px), "tablet" (>=768px, default), "all" */
  visibility?: "desktop" | "tablet" | "all";
  /** If false (default), hidden below 768px. If true, visible on mobile */
  showOnMobile?: boolean;
  /** Whether to apply soft drop-shadow filter */
  shadow?: boolean;
  style?: React.CSSProperties;
}

export function Decor({
  name,
  className = "",
  size,
  flip = false,
  delay = 0,
  duration,
  animation,
  opacity,
  zIndex = "z-10",
  visibility,
  showOnMobile = false,
  shadow = false,
  style = {},
}: DecorProps) {
  const meta = DECOR_META[name];
  const renderedWidth = size ?? meta.defaultSize;
  const renderedHeight = Math.round((renderedWidth * meta.height) / meta.width);
  const animType = animation ?? meta.defaultAnim;
  const renderedOpacity = opacity ?? meta.defaultOpacity ?? 1;

  // Responsive display class
  let displayClass = "hidden md:block";
  if (showOnMobile || visibility === "all") {
    displayClass = "block";
  } else if (visibility === "desktop") {
    displayClass = "hidden lg:block";
  } else if (visibility === "tablet") {
    displayClass = "hidden md:block";
  }

  // Animation CSS class
  let animClass = "";
  if (animType === "float") {
    animClass = "decor-anim-float";
  } else if (animType === "sway") {
    animClass = "decor-anim-sway";
  }

  const animStyle: React.CSSProperties = {
    animationDelay: `${delay}s`,
    ...(duration ? { animationDuration: `${duration}s` } : {}),
  };

  return (
    <div
      className={`absolute pointer-events-none select-none ${zIndex} ${displayClass} ${className}`}
      style={{
        width: renderedWidth,
        height: renderedHeight,
        opacity: renderedOpacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        className={`w-full h-full ${animClass}`}
        style={{
          transform: flip ? "scaleX(-1)" : undefined,
          ...animStyle,
        }}
      >
        <Image
          src={`/decor/${name}.webp`}
          alt=""
          width={meta.width}
          height={meta.height}
          loading="lazy"
          className={`w-full h-full object-contain ${
            shadow ? "drop-shadow-[0_6px_8px_rgba(0,0,0,0.12)]" : ""
          }`}
          unoptimized
        />
      </div>
    </div>
  );
}
