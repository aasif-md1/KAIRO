"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { DraftBanner } from "./DraftBanner";

interface SectionItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  version: string;
  effectiveDate: string;
  summary: string[];
  sections: SectionItem[];
  keyFacts?: Array<{ label: string; value: string }>;
  contactEmail?: string;
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  version,
  effectiveDate,
  summary,
  sections,
  keyFacts = [
    { label: "Source Retention", value: "24h max lifecycle" },
    { label: "Tracking Cookies", value: "None used" },
    { label: "Model Training", value: "Zero customer code ingestion" },
    { label: "Compliance Target", value: "India DPDP Act 2023" },
  ],
  contactEmail = "legal@kairo.example",
  children,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div style={{ position: "relative" }}>
      <DraftBanner />

      {/* Title Row: H1 on left, metadata on right on same row */}
      <section
        style={{
          paddingTop: "48px",
          paddingBottom: "36px",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <span className="eyebrow" style={{ marginBottom: "8px" }}>Legal documentation</span>
              <h1 className="hero-h1" style={{ fontSize: "clamp(32px, 3.5vw, 44px)", margin: 0 }}>
                {title}
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--muted)",
                paddingBottom: "4px",
              }}
            >
              <span>Version {version}</span>
              <span>•</span>
              <span>Effective: {effectiveDate}</span>
              <span>•</span>
              <span style={{ color: "var(--accent-text)" }}>Draft in development</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main 3-Column Layout: Left 3 cols TOC, Center 6 cols Prose, Right 3 cols Info Rail */}
      <section className="section section-bg" style={{ paddingTop: "64px", paddingBottom: "96px" }}>
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 3 Columns: Sticky Table of Contents */}
            <aside
              className="col-3"
              style={{
                position: "sticky",
                top: "96px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--muted)",
                  marginBottom: "6px",
                }}
              >
                CONTENTS
              </div>
              {sections.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    style={{
                      fontSize: "13px",
                      lineHeight: "18px",
                      color: isActive ? "var(--text)" : "var(--muted)",
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: "none",
                      borderLeft: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
                      paddingLeft: "10px",
                      transition: "all var(--dur-fast) var(--ease)",
                    }}
                  >
                    {s.title}
                  </a>
                );
              })}
            </aside>

            {/* Center 6 Columns: Prose Content (17px body, held to 720px) */}
            <main
              className="col-6"
              style={{
                fontSize: "17px",
                lineHeight: "1.65",
                color: "var(--text-2)",
                display: "flex",
                flexDirection: "column",
                gap: "48px",
              }}
            >
              {children}
            </main>

            {/* Right 3 Columns: Information Rail (The Short Version, Key Facts, Contact) */}
            <aside
              className="col-3"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                position: "sticky",
                top: "96px",
              }}
            >
              {/* The Short Version */}
              {summary && summary.length > 0 && (
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius-card)",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--accent-text)",
                      marginBottom: "12px",
                    }}
                  >
                    THE SHORT VERSION
                  </div>
                  <ul
                    style={{
                      paddingLeft: "16px",
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.5",
                      color: "var(--text-2)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {summary.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Facts Table */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "12px",
                  }}
                >
                  KEY FACTS
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <tbody>
                    {keyFacts.map((fact, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < keyFacts.length - 1 ? "1px solid var(--line)" : "none" }}>
                        <td style={{ padding: "8px 0", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                          {fact.label}
                        </td>
                        <td style={{ padding: "8px 0", textAlign: "right", color: "var(--text)", fontWeight: 500 }}>
                          {fact.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Version & History */}
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "10px",
                  }}
                >
                  VERSION HISTORY
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: "1.5" }}>
                  <div><strong>v0.1.0 (Draft)</strong> - Initial pre-release baseline designed for statutory compliance review.</div>
                </div>
                <div style={{ marginTop: "12px", fontSize: "12px" }}>
                  <Link href="/contact" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
                    Inquire about legal terms →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </div>
  );
}
