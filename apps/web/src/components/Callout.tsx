import React from "react";

interface CalloutProps {
  number?: number;
  label?: string;
  text?: string;
  sublabel?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  style?: React.CSSProperties;
}

export function Callout({
  number,
  label,
  text,
  sublabel,
  className,
  style,
}: CalloutProps) {
  const displayText = text || label || "";
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-control)",
        padding: "6px 12px",
        boxShadow: "none",
        zIndex: 10,
        ...style,
      }}
    >
      {number !== undefined && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "var(--accent)",
            color: "var(--on-accent)",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {number}
        </span>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            color: "var(--text)",
          }}
        >
          {displayText}
        </span>
        {sublabel && (
          <span
            style={{
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
