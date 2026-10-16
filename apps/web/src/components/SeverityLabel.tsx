import React from "react";

export type SeverityType = "critical" | "high" | "medium" | "low" | "informational" | "fixed";

interface SeverityLabelProps {
  severity: SeverityType;
  className?: string;
  style?: React.CSSProperties;
}

export function SeverityLabel({ severity, className, style }: SeverityLabelProps) {
  const norm = severity.toLowerCase() as SeverityType;

  const config: Record<
    SeverityType,
    { label: string; badgeClass: string; shape: React.ReactNode }
  > = {
    critical: {
      label: "Critical",
      badgeClass: "badge-critical",
      shape: (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
          <polygon points="4,0 8,4 4,8 0,4" />
        </svg>
      ),
    },
    high: {
      label: "High",
      badgeClass: "badge-high",
      shape: (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
          <polygon points="4,0 8,8 0,8" />
        </svg>
      ),
    },
    medium: {
      label: "Medium",
      badgeClass: "badge-medium",
      shape: (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
          <circle cx="4" cy="4" r="3.5" />
        </svg>
      ),
    },
    low: {
      label: "Low",
      badgeClass: "badge-low",
      shape: (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" />
        </svg>
      ),
    },
    informational: {
      label: "Informational",
      badgeClass: "badge-info",
      shape: (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="4" cy="4" r="3" />
        </svg>
      ),
    },
    fixed: {
      label: "Fixed",
      badgeClass: "badge-fixed",
      shape: (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
          <polygon points="4,1 7,7 1,7" />
        </svg>
      ),
    },
  };

  const item = config[norm] || config.informational;

  return (
    <span
      className={`badge-severity ${item.badgeClass} ${className || ""}`}
      style={{
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        ...style,
      }}
    >
      {item.shape}
      <span>{item.label}</span>
    </span>
  );
}
