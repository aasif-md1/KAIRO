import React from "react";
import { Container } from "./Container";

export function DraftBanner() {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) return null;

  return (
    <div
      role="note"
      aria-label="Draft Notice"
      style={{
        backgroundColor: "var(--sunken)",
        borderBottom: "1px dashed var(--line-strong)",
        marginTop: "16px",
        marginBottom: "32px",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        color: "var(--text-2)",
      }}
    >
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent-text)",
              padding: "2px 6px",
              borderRadius: "var(--radius-label)",
            }}
          >
            DRAFT
          </span>
          <span>
            Non-production draft document. Subject to legal and compliance review before public production release.
          </span>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)", flexShrink: 0 }}>
          PRD LR-11
        </span>
      </Container>
    </div>
  );
}
