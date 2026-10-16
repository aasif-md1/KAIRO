import React from "react";

interface BrandGeometryProps {
  className?: string;
  style?: React.CSSProperties;
}

export function BrandGeometry({ className, style }: BrandGeometryProps) {
  return (
    <svg
      className={className}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        pointerEvents: "none",
        opacity: 0.45,
        zIndex: 0,
        ...style,
      }}
      width="480"
      height="480"
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 45-degree structural lines derived from KAIRO identity */}
      <line x1="80" y1="0" x2="480" y2="400" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="160" y1="0" x2="480" y2="320" stroke="var(--line)" strokeWidth="1" />
      <line x1="240" y1="0" x2="480" y2="240" stroke="var(--line)" strokeWidth="1" strokeDasharray="6 6" />
      <line x1="320" y1="0" x2="480" y2="160" stroke="var(--line)" strokeWidth="1" />
      <line x1="400" y1="0" x2="480" y2="80" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Chamfered brand accents */}
      <polygon
        points="380,40 440,40 440,100 420,120 380,120"
        stroke="var(--line)"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="300,120 360,120 360,180 340,200 300,200"
        stroke="var(--line)"
        strokeWidth="1"
        fill="none"
      />
      <rect x="420" y="24" width="8" height="8" fill="var(--accent)" opacity="0.6" />
    </svg>
  );
}
