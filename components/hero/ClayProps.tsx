"use client";

import React from "react";
import Image from "next/image";

/**
 * 4-Point Yellow Clay Star Sprite (from /clay/fx/star.webp)
 */
export function ClayStar({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/clay/fx/star.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes={`${size}px`}
        className="object-contain drop-shadow-[0_4px_10px_rgba(180,120,10,0.3)]"
      />
    </div>
  );
}

/**
 * Real Blue Clay Bubble Sprite (from /clay/fx/bubble-1.webp to bubble-5)
 */
export function ClayBubble({
  size = 40,
  variant = 1,
  className = "",
}: {
  size?: number;
  variant?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}) {
  const v = Math.min(Math.max(1, variant), 4);
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src={`/clay/fx/bubble-${v}.webp`}
        alt=""
        aria-hidden="true"
        fill
        sizes={`${size}px`}
        className="object-contain drop-shadow-[0_3px_8px_rgba(20,70,160,0.25)]"
      />
    </div>
  );
}

/**
 * Splash Water Droplets Sprite (from /clay/fx/droplet-*.webp)
 */
export function ClayDroplets({
  className = "",
  size = 64,
  variant = 1,
}: {
  className?: string;
  size?: number;
  variant?: 1 | 2 | 3 | 4;
}) {
  const v = Math.min(Math.max(1, variant), 4);
  return (
    <div
      style={{ width: size, height: (size * 3) / 4 }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src={`/clay/fx/droplet-${v}.webp`}
        alt=""
        aria-hidden="true"
        fill
        sizes={`${size}px`}
        className="object-contain drop-shadow-[0_2px_6px_rgba(20,80,180,0.25)]"
      />
    </div>
  );
}

/**
 * Clay Rays (from /clay/fx/rays.webp)
 */
export function ClayRays({
  className = "",
  width = 110,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <div
      style={{ width, height: (width * 203) / 195 }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/clay/fx/rays.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes={`${width}px`}
        className="object-contain drop-shadow-[0_4px_12px_rgba(255,140,20,0.35)]"
      />
    </div>
  );
}

/**
 * Green Clay Seaweed (tall / small)
 */
export function ClaySeaweed({
  variant = 1,
  className = "",
  height = 240,
}: {
  variant?: 1 | 2;
  className?: string;
  height?: number;
}) {
  const width = variant === 1 ? (height * 315) / 313 : (height * 178) / 214;
  return (
    <div
      style={{ width, height, transformOrigin: "bottom center" }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src={`/clay/props/seaweed-${variant}.webp`}
        alt=""
        aria-hidden="true"
        fill
        sizes={`${Math.round(width)}px`}
        className="object-contain drop-shadow-[0_6px_14px_rgba(30,100,40,0.28)]"
      />
    </div>
  );
}

/**
 * Grey Clay Rocks (large, small, cluster)
 */
export function ClayRock({
  variant = "large",
  className = "",
  width = 220,
}: {
  variant?: "large" | "small" | "cluster";
  className?: string;
  width?: number;
}) {
  const file = variant === "cluster" ? "rocks-cluster" : `rock-${variant}`;
  const aspect = variant === "cluster" ? 219 / 303 : variant === "small" ? 107 / 152 : 242 / 331;
  const height = width * aspect;

  return (
    <div
      style={{ width, height }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src={`/clay/props/${file}.webp`}
        alt=""
        aria-hidden="true"
        fill
        sizes={`${width}px`}
        className="object-contain drop-shadow-[0_6px_16px_rgba(50,50,60,0.3)]"
      />
    </div>
  );
}

/**
 * Red Clay Crayfish (facing right)
 */
export function ClayCrayfish({
  className = "",
  width = 170,
}: {
  className?: string;
  width?: number;
}) {
  const height = (width * 233) / 419;
  return (
    <div
      style={{ width, height }}
      className={`relative inline-block select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/clay/props/crayfish.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes={`${width}px`}
        className="object-contain drop-shadow-[0_6px_16px_rgba(180,40,20,0.35)]"
      />
    </div>
  );
}
