"use client";

import React, { useState } from "react";

interface ContactCardProps {
  title: string;
  email: string;
  isExampleDomain?: boolean;
  targetResponse: string;
  checklist: string[];
}

export function ContactCard({
  title,
  email,
  isExampleDomain = true,
  targetResponse,
  checklist,
}: ContactCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text)" }}>
          {title}
        </h3>
        {isExampleDomain && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              padding: "2px 6px",
              backgroundColor: "var(--sunken)",
              color: "var(--muted)",
              borderRadius: "var(--radius-label)",
              border: "1px solid var(--line)",
            }}
          >
            Example address
          </span>
        )}
      </div>

      {/* Email Address with Copy Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--sunken)",
          padding: "8px 12px",
          borderRadius: "var(--radius-control)",
          border: "1px solid var(--line)",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--accent-text)",
            wordBreak: "break-all",
          }}
        >
          {email}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="btn btn-secondary"
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Target Response Time */}
      <div style={{ fontSize: "13px", color: "var(--muted)" }}>
        Target response time: <strong style={{ color: "var(--text)" }}>{targetResponse}</strong> (config target)
      </div>

      {/* Checklist of What to Include */}
      <div style={{ marginTop: "4px" }}>
        <span
          style={{
            display: "block",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--muted)",
            marginBottom: "8px",
          }}
        >
          What to include:
        </span>
        <ul
          style={{
            paddingLeft: "18px",
            fontSize: "14px",
            lineHeight: "22px",
            color: "var(--text)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {checklist.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
