import React from "react";

interface BrandLogoProps {
  variant?: "navbar" | "footer" | "tile";
  height?: number;
  width?: number;
  showText?: boolean;
  className?: string;
}

export function BrandLogo({ variant = "navbar", height, width, showText = true, className }: BrandLogoProps) {
  if (variant === "tile" || !showText) {
    const tileHeight = height || (width ? Math.min(width, 32) : 32);
    return (
      <img
        src="/tile-emerald.png"
        alt="KAIRO"
        width={tileHeight}
        height={tileHeight}
        className={className}
        style={{ height: `${tileHeight}px`, width: "auto", display: "inline-block" }}
      />
    );
  }

  if (variant === "footer") {
    const footerHeight = height || 48;
    return (
      <div className={className} style={{ display: "inline-block" }}>
        <img
          src="/footer-logo-dark.png"
          alt="KAIRO"
          className="brand-dark"
          width={footerHeight * 1.5}
          height={footerHeight}
          style={{ height: `${footerHeight}px`, width: "auto" }}
        />
        <img
          src="/footer-logo-light.png"
          alt="KAIRO"
          className="brand-light"
          width={footerHeight * 1.5}
          height={footerHeight}
          style={{ height: `${footerHeight}px`, width: "auto" }}
        />
      </div>
    );
  }

  // Navbar default
  const navHeight = height || 30;
  return (
    <div className={className} style={{ display: "inline-flex", alignItems: "center" }}>
      <img
        src="/navbar-logo-dark.png"
        alt="KAIRO"
        className="brand-dark"
        width={navHeight * 3.5}
        height={navHeight}
        style={{ height: `${navHeight}px`, width: "auto" }}
      />
      <img
        src="/navbar-logo-light.png"
        alt="KAIRO"
        className="brand-light"
        width={navHeight * 3.5}
        height={navHeight}
        style={{ height: `${navHeight}px`, width: "auto" }}
      />
    </div>
  );
}
