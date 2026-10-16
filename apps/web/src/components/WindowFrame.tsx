import React from "react";

interface WindowFrameProps {
  url?: string;
  path?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function WindowFrame({
  url,
  path,
  children,
  className,
  style,
}: WindowFrameProps) {
  const displayUrl = path || url || "kairo.local/projects/acme-storefront-api/scans/scn_sample/findings";
  return (
    <div
      className={`window-frame ${className || ""}`}
      style={{
        position: "relative",
        ...style,
      }}
    >
      <div className="window-frame-bar">
        <span
          style={{
            display: "inline-block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {displayUrl}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}
