import React from "react";

interface ThemeImageProps {
  name: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
}

export function ThemeImage({
  name,
  alt,
  width,
  height,
  caption = "Sample data",
  priority = false,
}: ThemeImageProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        {/* Dark theme image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/marketing/${name}-dark@2x.png`}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="img-dark"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        {/* Light theme image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/marketing/${name}-light@2x.png`}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="img-light"
          style={{
            width: "100%",
            height: "auto",
            display: "none",
          }}
        />
      </div>

      {caption && (
        <div style={{ marginTop: "6px", textAlign: "right" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}
