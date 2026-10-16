import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";

export const metadata = {
  title: "About KAIRO: Principles, Architecture, and Project Background",
  description:
    "Why KAIRO was built: evidence-first security auditing, honest operational limits, and privacy-preserving design for modern web development.",
};

export default function AboutPage() {
  return (
    <div style={{ position: "relative" }}>
      {/* 1. Hero with Large Editorial Statement */}
      <section
        style={{
          paddingTop: "80px",
          paddingBottom: "80px",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Container>
          <div className="grid-12">
            <div className="col-8">
              <span className="eyebrow">Project background</span>
              <h1 className="hero-h1" style={{ fontSize: "clamp(36px, 4vw, 52px)", marginBottom: "24px" }}>
                Why KAIRO was built
              </h1>
              <p
                style={{
                  fontSize: "clamp(24px, 2.5vw, 32px)",
                  fontWeight: 500,
                  lineHeight: 1.35,
                  letterSpacing: "-0.015em",
                  color: "var(--text)",
                  margin: 0,
                }}
              >
                AI coding tools make software construction faster, but often generate subtle access-control oversights. KAIRO was designed to systematically detect and verify those gaps.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. The Authorization Problem (Two-Column Section) */}
      <section className="section section-bg">
        <Container>
          <div className="grid-12" style={{ alignItems: "center" }}>
            {/* Left 6 Columns: Prose */}
            <div className="col-6">
              <span className="eyebrow">The core problem</span>
              <h2 className="section-h2" style={{ marginBottom: "20px" }}>
                The Authorization Problem
              </h2>
              <p className="body-p" style={{ marginBottom: "16px" }}>
                Modern code generators and rapid frameworks make it trivial to build full CRUD backends in minutes. However, access control is inherently contextual: a database query that returns an order must determine whether the caller owns that order or possesses tenant administrative privileges.
              </p>
              <p className="body-p">
                Existing static scanners report hundreds of noisy warnings based on simplistic regex patterns. Dynamic penetration tools often require extensive manual session setup. KAIRO bridges this gap by cross-referencing static route inventory with isolated sandbox replay verification.
              </p>
            </div>

            {/* Right 6 Columns: Compact Request/Response Diagram */}
            <div className="col-6">
              <div
                style={{
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  padding: "24px",
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: "12px" }}>
                  CONTEXTUAL AUTHORIZATION CHECK // REPLAY
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ padding: "12px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-control)" }}>
                    <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>CLIENT REQUEST (User B)</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text)", marginTop: "2px" }}>
                      GET /api/orders/order_usr_A_982
                    </div>
                  </div>

                  <div style={{ textAlign: "center", color: "var(--text)", fontWeight: 500, fontSize: "14px" }}>
                    ↓ Passes Authentication // Evaluates Ownership Logic
                  </div>

                  <div style={{ padding: "12px 14px", backgroundColor: "var(--sev-critical-bg)", border: "1px solid var(--sev-critical)", borderRadius: "var(--radius-control)" }}>
                    <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--sev-critical)", fontWeight: 600 }}>FLAW CONFIRMED // IDOR LEAK</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text)", marginTop: "2px" }}>
                      HTTP 200 OK - Order data returned to foreign user
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Guiding Principles (Three Numbered Columns Separated by Dividers, No Boxes) */}
      <section style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "80px 0" }}>
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <span className="eyebrow">Foundation</span>
            <h2 className="section-h2">Guiding Principles</h2>
            <p className="lead-p" style={{ margin: 0 }}>
              Three engineering commitments that guide KAIRO&apos;s product and technical development.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {/* Principle 1 */}
            <div style={{ paddingRight: "20px" }}>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                  lineHeight: "1",
                  color: "transparent",
                  WebkitTextStroke: "1.5px var(--line-strong)",
                  marginBottom: "16px",
                }}
              >
                01
              </div>
              <h3 className="section-h3" style={{ fontSize: "20px", marginBottom: "8px" }}>
                Evidence First
              </h3>
              <p className="body-p" style={{ margin: 0 }}>
                We prioritize deterministic reproduction over speculative volume. Findings distinguish clearly between confirmed dynamic sandbox exploits and static heuristic hypotheses.
              </p>
            </div>

            {/* Principle 2 */}
            <div style={{ paddingLeft: "20px", paddingRight: "20px", borderLeft: "1px solid var(--line)" }}>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                  lineHeight: "1",
                  color: "transparent",
                  WebkitTextStroke: "1.5px var(--line-strong)",
                  marginBottom: "16px",
                }}
              >
                02
              </div>
              <h3 className="section-h3" style={{ fontSize: "20px", marginBottom: "8px" }}>
                Honest About Limits
              </h3>
              <p className="body-p" style={{ margin: 0 }}>
                A clean audit report never declares an application completely secure; it states precisely what was checked and what was outside the evaluation perimeter.
              </p>
            </div>

            {/* Principle 3 */}
            <div style={{ paddingLeft: "20px", borderLeft: "1px solid var(--line)" }}>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                  lineHeight: "1",
                  color: "transparent",
                  WebkitTextStroke: "1.5px var(--line-strong)",
                  marginBottom: "16px",
                }}
              >
                03
              </div>
              <h3 className="section-h3" style={{ fontSize: "20px", marginBottom: "8px" }}>
                Privacy by Design
              </h3>
              <p className="body-p" style={{ margin: 0 }}>
                Customer source code is never used to train machine learning models. Ephemeral clones run in offline, network-blocked sandboxes and are deleted immediately upon completion.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. How KAIRO Was Designed (Horizontal Timeline of 4 Documents) */}
      <section className="section section-bg">
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <span className="eyebrow">System architecture</span>
            <h2 className="section-h2">How KAIRO was designed</h2>
            <p className="lead-p" style={{ margin: 0 }}>
              The platform was designed through four formal specification documents establishing technical boundaries and audit integrity.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              paddingBottom: "32px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>01 // PRD</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>Product Requirements</div>
              <p style={{ fontSize: "13px", color: "var(--text-2)", marginTop: "6px", lineHeight: "1.5" }}>
                Defines the 13 flaw classes, three-tier confidence rubric, and strict ephemeral data retention.
              </p>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>02 // TRD</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>Technical Requirements</div>
              <p style={{ fontSize: "13px", color: "var(--text-2)", marginTop: "6px", lineHeight: "1.5" }}>
                Specifies three-zone network architecture, gVisor sandboxing, and deterministic JSON schemas.
              </p>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>03 // FLOW</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>Application Flow</div>
              <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5" }}>
                Maps the complete audit lifecycle from GitHub OAuth installation to finding remediation.
              </p>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>04 // BRIEF</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>Design Brief</div>
              <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "1.5" }}>
                Enforces contrast-verified token palette, keyboard navigation rules, and zero-flash theme switching.
              </p>
            </div>
          </div>

          <div style={{ paddingTop: "20px", fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
            Implementation status: Truthfully verified against all four system specifications.
          </div>
        </Container>
      </section>

      {/* 5. Who Built It (Two-Column Row) */}
      <section className="section section-surface">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            <div className="col-6">
              <span className="eyebrow">Origins</span>
              <h2 className="section-h2">Who built it</h2>
              <p className="body-p" style={{ marginBottom: "16px" }}>
                KAIRO was developed by independent engineering students as an applied computer science research initiative in automated software security testing and runtime verification.
              </p>
              <div style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                Status: Release 1 in active pre-production development.
              </div>
            </div>

            <div className="col-6">
              <div
                style={{
                  padding: "24px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
                  Engineering Research Focus
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: "1.6", margin: "0 0 16px" }}>
                  Our objective is to deliver verifiable, proof-backed vulnerability reporting for developers building with modern AI tools, eliminating false positive fatigue through deterministic container replay.
                </p>
                <Link href="/contact" style={{ color: "var(--accent-text)", textDecoration: "underline", fontSize: "13px", fontWeight: 600 }}>
                  Contact the engineering team →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Roadmap as in Home */}
      <section className="section section-bg">
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <span className="eyebrow">Development plan</span>
            <h2 className="section-h2">Roadmap</h2>
            <p className="lead-p" style={{ margin: 0 }}>
              Current milestone capabilities and planned additions.
            </p>
          </div>

          <div className="grid-12" style={{ alignItems: "start" }}>
            <div className="col-6">
              <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "24px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--accent-text)" }}>
                  RELEASE 1 // ACTIVE
                </div>
                <h3 className="section-h3" style={{ margin: "6px 0 12px" }}>
                  Core Audit Engine
                </h3>
                <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--text-2)", lineHeight: "1.7", margin: 0 }}>
                  <li>Static route analysis for Express, Next.js, FastAPI, and Flask</li>
                  <li>Isolated gVisor dynamic sandbox execution</li>
                  <li>13 vulnerability classes (KR-V01 to KR-V13)</li>
                  <li>Deterministic export formats: PDF, JSON, and SARIF</li>
                </ul>
              </div>
            </div>

            <div className="col-6">
              <div style={{ borderLeft: "2px solid var(--line)", paddingLeft: "24px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>
                  RELEASE 2 // PLANNED
                </div>
                <h3 className="section-h3" style={{ margin: "6px 0 12px" }}>
                  Continuous Verification
                </h3>
                <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--text-2)", lineHeight: "1.7", margin: 0 }}>
                  <li>GitHub Pull Request verification checks and commit statuses</li>
                  <li>Additional frameworks: Django, Ruby on Rails, and Go Chi</li>
                  <li>Verified staging environment replay with synthetic test data</li>
                  <li>Multi-user team workspaces with role-based permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Final Call to Action */}
      <CTASection />
    </div>
  );
}
