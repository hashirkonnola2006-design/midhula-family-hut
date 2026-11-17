import React from "react";

interface ClayWaveDividerProps {
  fillColor: string;
  flipY?: boolean;
  className?: string;
}

export function ClayWaveDivider({
  fillColor,
  flipY = false,
  className = "",
}: ClayWaveDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}
      style={{ transform: flipY ? "scaleY(-1)" : "none" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 85"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-10 sm:h-14 md:h-20 block"
      >
        {/* Soft subtle shadow layer for clay depth */}
        <path
          d="M 0 0 
             C 280 48, 540 68, 760 38 
             C 980 8, 1220 52, 1440 28 
             L 1440 85 L 0 85 Z"
          fill="rgba(0, 0, 0, 0.04)"
          transform="translate(0, 4)"
        />
        {/* Main curved clay wave */}
        <path
          d="M 0 0 
             C 280 48, 540 68, 760 38 
             C 980 8, 1220 52, 1440 28 
             L 1440 85 L 0 85 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
