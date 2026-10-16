"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SeverityLabel, SeverityType } from "./SeverityLabel";

interface RuleItem {
  id: string;
  name: string;
  desc: string;
  severity: SeverityType;
}

export function TabbedCoverage() {
  const [activeTab, setActiveTab] = useState<string>("access");

  const categories: Record<string, { label: string; rules: RuleItem[] }> = {
    access: {
      label: "Access control",
      rules: [
        {
          id: "KR-V01",
          name: "State-changing route without authentication",
          desc: "POST, PUT, or DELETE routes modifying database records without authentication middleware.",
          severity: "high",
        },
        {
          id: "KR-V02",
          name: "Broken object-level authorization (BOLA)",
          desc: "Record lookup by parameter without tenant or owner verification.",
          severity: "critical",
        },
        {
          id: "KR-V03",
          name: "Broken function-level authorization (BFLA)",
          desc: "Administrative endpoints exposed to regular authenticated users.",
          severity: "high",
        },
        {
          id: "KR-V04",
          name: "Mass assignment of role or permission fields",
          desc: "User registration or profile update endpoints accepting arbitrary permission flags.",
          severity: "high",
        },
      ],
    },
    secrets: {
      label: "Secrets and tokens",
      rules: [
        {
          id: "KR-V05",
          name: "Hardcoded credentials and API keys",
          desc: "High-entropy secrets, cloud tokens, and database passwords committed to source code.",
          severity: "critical",
        },
        {
          id: "KR-V06",
          name: "Token misuse and leaked keys",
          desc: "Server-side secret keys exposed in client bundles or public configuration files.",
          severity: "high",
        },
        {
          id: "KR-V07",
          name: "Weak credentials and default secrets",
          desc: "Default session secrets, weak JWT signing keys, and fallback development passwords.",
          severity: "medium",
        },
      ],
    },
    input: {
      label: "Input and queries",
      rules: [
        {
          id: "KR-V08",
          name: "SQL and NoSQL injection",
          desc: "Raw user input interpolated directly into database queries without parametrization.",
          severity: "critical",
        },
        {
          id: "KR-V09",
          name: "Command injection",
          desc: "External process execution passing unvalidated parameters to system shell commands.",
          severity: "critical",
        },
      ],
    },
    config: {
      label: "Configuration",
      rules: [
        {
          id: "KR-V10",
          name: "Permissive CORS configuration",
          desc: "Access-Control-Allow-Origin wildcard paired with credential sharing allowed.",
          severity: "medium",
        },
        {
          id: "KR-V11",
          name: "Missing rate limiting",
          desc: "Authentication and resource-intensive endpoints lacking rate-limiting defenses.",
          severity: "low",
        },
        {
          id: "KR-V12",
          name: "Information disclosure in errors",
          desc: "Verbose application stack traces and internal paths returned in HTTP error responses.",
          severity: "low",
        },
        {
          id: "KR-V13",
          name: "Debug mode enabled",
          desc: "Framework debug flags or interactive development consoles active in production configuration.",
          severity: "medium",
        },
      ],
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Tab Navigation */}
      <div
        role="tablist"
        aria-label="Vulnerability categories"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "8px",
        }}
      >
        {Object.entries(categories).map(([key, data]) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${key}`}
              id={`tab-${key}`}
              type="button"
              onClick={() => setActiveTab(key)}
              style={{
                padding: "8px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--text)" : "var(--muted)",
                backgroundColor: isActive ? "var(--surface)" : "transparent",
                border: isActive ? "1px solid var(--line)" : "1px solid transparent",
                borderRadius: "var(--radius-control)",
                cursor: "pointer",
                transition: "all var(--dur-fast) var(--ease)",
              }}
            >
              {data.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {categories[activeTab].rules.map((rule) => (
          <div
            key={rule.id}
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "800px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--accent-text)",
                  }}
                >
                  {rule.id}
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {rule.name}
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--muted)",
                  lineHeight: "22px",
                  margin: 0,
                }}
              >
                {rule.desc}
              </p>
            </div>

            <div style={{ flexShrink: 0 }}>
              <SeverityLabel severity={rule.severity} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "8px" }}>
        <Link
          href="/coverage"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--accent-text)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>Explore all 13 vulnerability definitions</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
