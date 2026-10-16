"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { DraftBanner } from "@/components/DraftBanner";
import { DiagramArchitecture } from "@/components/diagrams/DiagramArchitecture";
import { DiagramDataLifecycle } from "@/components/diagrams/DiagramDataLifecycle";
import { Check, Copy } from "lucide-react";

export default function SecurityPage() {
  const contactEmail = process.env.NEXT_PUBLIC_SECURITY_EMAIL || "security@kairo.example";
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative" }}>
      <DraftBanner />

      {/* 1. Split Hero */}
      <section className="hero-section" style={{ borderBottom: "1px solid var(--line)" }}>
        <Container>
          <div className="grid-12" style={{ alignItems: "center" }}>
            <div className="col-6">
              <span className="eyebrow">Trust & platform security</span>
              <h1 className="hero-h1" style={{ fontSize: "clamp(36px, 4vw, 52px)", marginBottom: "16px" }}>
                Security Architecture & Vulnerability Disclosure
              </h1>
              <p className="lead-p" style={{ margin: 0 }}>
                How KAIRO protects your source code, isolates execution environments, and handles vulnerability disclosures.
              </p>
            </div>

            {/* Compact 3-Zone Topology Visual on Right */}
            <div className="col-6">
              <div
                style={{
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  padding: "20px 24px",
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: "12px" }}>
                  PLATFORM TOPOLOGY // THREE PHYSICAL ZONES
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-control)" }}>
                    <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontWeight: 600 }}>ZONE 1: CLIENT EDGE</div>
                    <div style={{ fontSize: "13px", color: "var(--text)", marginTop: "2px" }}>Next.js static client - HTTPS TLS 1.3 - Zero telemetry</div>
                  </div>
                  <div style={{ padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-control)" }}>
                    <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontWeight: 600 }}>ZONE 2: CONTROL PLANE</div>
                    <div style={{ fontSize: "13px", color: "var(--text)", marginTop: "2px" }}>FastAPI backend - Isolated tenant DB - No long-term code storage</div>
                  </div>
                  <div style={{ padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--accent)", borderRadius: "var(--radius-control)" }}>
                    <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontWeight: 600 }}>ZONE 3: SANDBOX</div>
                    <div style={{ fontSize: "13px", color: "var(--text)", marginTop: "2px" }}>gVisor kernel - Offline execution - Hard blocked egress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Four Principles Row (Numbered Columns Separated by Dividers) */}
      <section style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--line)", padding: "40px 0" }}>
        <Container>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
            }}
          >
            <div style={{ paddingRight: "16px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)", marginBottom: "4px" }}>
                01. LEAST PRIVILEGE
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
                Read-Only GitHub Access
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5" }}>
                KAIRO requests only read-only archive downloads and never commits to repositories.
              </div>
            </div>

            <div style={{ paddingLeft: "16px", borderLeft: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)", marginBottom: "4px" }}>
                02. HARDENED ISOLATION
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
                gVisor Application Kernel
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5" }}>
                Dynamic tests run inside gVisor containers on dedicated runner nodes with blocked network egress.
              </div>
            </div>

            <div style={{ paddingLeft: "16px", borderLeft: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)", marginBottom: "4px" }}>
                03. ZERO RETENTION
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
                24-Hour Maximum Lifecycle
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5" }}>
                Code snapshots are purged upon scan completion and never retained beyond 24 hours.
              </div>
            </div>

            <div style={{ paddingLeft: "16px", borderLeft: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)", marginBottom: "4px" }}>
                04. ZERO MODEL TRAINING
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>
                Customer Code Protected
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5" }}>
                Customer code is never used to train machine learning models.
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Full-Width Architecture Diagram */}
      <section className="section section-bg">
        <Container>
          <div style={{ maxWidth: "760px", marginBottom: "32px" }}>
            <span className="eyebrow">Architecture overview</span>
            <h2 className="section-h2">Three-Zone Isolation Model</h2>
            <p className="lead-p" style={{ margin: 0 }}>
              Physical and logical boundaries preventing lateral movement between tenant data and untrusted execution.
            </p>
          </div>

          <DiagramArchitecture />
        </Container>
      </section>

      {/* 4. Inverted Band for Data Lifecycle */}
      <section className="section section-inverted">
        <Container>
          <div style={{ maxWidth: "760px", marginBottom: "36px" }}>
            <span className="eyebrow inverted-accent">Lifecycle & retention</span>
            <h2 style={{ fontSize: "clamp(32px, 3.4vw, 48px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.015em", color: "inherit", marginBottom: "16px" }}>
              Source Code Data Lifecycle
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.5, opacity: 0.85, margin: 0 }}>
              Ephemeral by design: code is cloned to memory, evaluated offline, and wiped upon audit completion.
            </p>
          </div>

          <div style={{ marginBottom: "36px" }}>
            <DiagramDataLifecycle />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "inherit", marginBottom: "6px" }}>
                Archive Ingestion
              </div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.85, margin: 0 }}>
                Repositories are ingested via temporary read-only GitHub archives into memory-backed filesystems.
              </p>
            </div>

            <div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "inherit", marginBottom: "6px" }}>
                Immediate Purge
              </div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.85, margin: 0 }}>
                Scratch storage volumes are unmounted and wiped immediately after the final report is generated.
              </p>
            </div>

            <div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "inherit", marginBottom: "6px" }}>
                Hard Ceiling
              </div>
              <p style={{ fontSize: "14px", lineHeight: "1.6", opacity: 0.85, margin: 0 }}>
                Regardless of scan completion or cancellation, ephemeral disks are destroyed after 24 hours.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. 3-Column Composed Details Layout (3 cols left TOC, 6 cols center content, 3 cols right rail) */}
      <section className="section section-bg">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 3 Columns: Sticky Index */}
            <aside
              className="col-3"
              style={{
                position: "sticky",
                top: "96px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                SECURITY SECTIONS
              </div>
              <a href="#isolation" style={{ color: "var(--text)", textDecoration: "none" }}>
                1. Sandbox isolation
              </a>
              <a href="#encryption" style={{ color: "var(--text)", textDecoration: "none" }}>
                2. Cryptography & keys
              </a>
              <a href="#model-use" style={{ color: "var(--text)", textDecoration: "none" }}>
                3. Model training policy
              </a>
              <a href="#disclosure" style={{ color: "var(--text)", textDecoration: "none" }}>
                4. Vulnerability disclosure
              </a>
            </aside>

            {/* Center 6 Columns: Prose Content */}
            <div className="col-6" style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
              {/* Section 1: Isolation */}
              <div id="isolation">
                <span className="eyebrow">Section 01</span>
                <h2 className="section-h2" style={{ fontSize: "28px", marginBottom: "16px" }}>
                  Sandbox isolation via gVisor kernel
                </h2>
                <p className="body-p" style={{ marginBottom: "16px" }}>
                  Dynamic execution of customer code introduces inherent security risks. KAIRO relies on Google gVisor, an application kernel that intercepts system calls in user space rather than passing them directly to the host Linux kernel.
                </p>
                <p className="body-p">
                  Network isolation is strictly enforced: the container has loopback access only. No external Internet egress is permitted, preventing data exfiltration and external scanning attacks.
                </p>
              </div>

              {/* Section 2: Cryptography */}
              <div id="encryption" style={{ borderTop: "1px solid var(--line)", paddingTop: "48px" }}>
                <span className="eyebrow">Section 02</span>
                <h2 className="section-h2" style={{ fontSize: "28px", marginBottom: "16px" }}>
                  Cryptography and key derivation
                </h2>
                <p className="body-p" style={{ marginBottom: "16px" }}>
                  Sensitive values (such as test environment variables and GitHub OAuth tokens) are encrypted at rest using AES-256-GCM.
                </p>
                <p className="body-p">
                  Each project uses distinct encryption keys derived via HKDF-SHA256, ensuring multi-tenant cryptographic isolation.
                </p>
              </div>

              {/* Section 3: Model Policy */}
              <div id="model-use" style={{ borderTop: "1px solid var(--line)", paddingTop: "48px" }}>
                <span className="eyebrow">Section 03</span>
                <h2 className="section-h2" style={{ fontSize: "28px", marginBottom: "16px" }}>
                  Policy on machine learning models
                </h2>
                <p className="body-p" style={{ marginBottom: "16px" }}>
                  KAIRO does not use customer source code to train machine learning models.
                </p>
                <p className="body-p">
                  AI-assisted logic review of real user code stays switched off until a model provider with suitable zero-data-retention commercial terms is approved. When enabled, logic review can be turned off per project in project settings.
                </p>
              </div>

              {/* Section 4: Disclosure */}
              <div id="disclosure" style={{ borderTop: "1px solid var(--line)", paddingTop: "48px" }}>
                <span className="eyebrow">Section 04</span>
                <h2 className="section-h2" style={{ fontSize: "28px", marginBottom: "16px" }}>
                  Vulnerability disclosure policy
                </h2>
                <p className="body-p" style={{ marginBottom: "16px" }}>
                  If you discover a vulnerability in the KAIRO platform, please report it to our security team. We ask researchers to act in good faith, avoid privacy violations, and refrain from disrupting running services.
                </p>
                <p className="body-p">
                  We commit to acknowledging received reports within 48 hours and providing an initial severity assessment within 7 business days.
                </p>
              </div>
            </div>

            {/* Right 3 Columns: Sticky "Report a vulnerability" Panel */}
            <aside className="col-3" style={{ position: "sticky", top: "96px" }}>
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  padding: "24px",
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontWeight: 600, marginBottom: "6px" }}>
                  REPORT A VULNERABILITY
                </div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
                  Security Contact
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5", marginBottom: "16px" }}>
                  Send encrypted disclosures directly to our engineering security inbox:
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: "var(--sunken)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius-control)",
                    marginBottom: "16px",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text)" }}>
                    {contactEmail}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy security email"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: copied ? "var(--status-fixed)" : "var(--muted)",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: "1.5", marginBottom: "16px" }}>
                  Target response times: 48 hours acknowledgment; 7 business days assessment.
                </div>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                  <Link
                    href="/.well-known/security.txt"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "var(--accent-text)",
                      textDecoration: "underline",
                    }}
                  >
                    View security.txt →
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
