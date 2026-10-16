import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { BrandGeometry } from "@/components/BrandGeometry";
import { ProblemExplainer } from "@/components/ProblemExplainer";
import { TabbedCoverage } from "@/components/TabbedCoverage";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { HeroStage } from "@/components/stages/HeroStage";
import { WalkthroughStage } from "@/components/stages/WalkthroughStage";
import { LayerDiagram } from "@/components/stages/LayerDiagram";
import { TrustDiagram } from "@/components/stages/TrustDiagram";
import { ExportsStage } from "@/components/stages/ExportsStage";
import { WindowFrame } from "@/components/WindowFrame";

export const metadata = {
  title: "KAIRO: Access-Control and Secret Audit Platform",
  description:
    "Automated access-control, IDOR, and secret audit platform for Express, Next.js, FastAPI, and Flask web applications.",
};

export default function HomePage() {
  return (
    <div style={{ position: "relative", overflowX: "clip" }}>
      {/* 1) HERO SECTION */}
      <section className="hero-section" style={{ borderBottom: "1px solid var(--line)" }}>
        <BrandGeometry />

        <Container style={{ position: "relative", zIndex: 1 }}>
          <div className="grid-12" style={{ alignItems: "center" }}>
            {/* Left 5 Columns */}
            <div className="col-5">
              <span className="eyebrow">Release 1 in development</span>

              <h1 className="hero-h1">
                Find access-control flaws in AI-built apps before you launch.
              </h1>

              <p className="lead-p">
                KAIRO reads your code, reviews the logic that decides who can see what, and tests a running copy in an isolated sandbox. Every finding comes with evidence, a fix and a re-check.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                <Link
                  href="/sign-in"
                  className="btn btn-primary"
                  style={{
                    height: "46px",
                    padding: "0 22px",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                  id="hero-cta-github"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <span>Continue with GitHub</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="btn btn-secondary"
                  style={{
                    height: "46px",
                    padding: "0 20px",
                    fontSize: "15px",
                  }}
                  id="hero-cta-how-it-works"
                >
                  See how it works
                </a>
              </div>

              <div className="caption-p" style={{ fontFamily: "var(--font-mono)" }}>
                Read-only access. Source code deleted when the scan ends and never kept longer than 24 hours. No tracking cookies.
              </div>
            </div>

            {/* Right 7 Columns (Bleeding) */}
            <div className="col-7">
              <HeroStage />
            </div>
          </div>
        </Container>
      </section>

      {/* 2) BY DESIGN STRIP */}
      <section
        style={{
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
          padding: "48px 0 36px",
        }}
      >
        <Container>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              paddingBottom: "36px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            {/* Fact 1 */}
            <div style={{ paddingRight: "16px" }}>
              <div style={{ fontSize: "clamp(26px, 2.5vw, 36px)", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                13
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                Flaw classes
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                Targeted access-control and secret rules
              </div>
            </div>

            {/* Fact 2 */}
            <div style={{ paddingLeft: "16px", borderLeft: "1px solid var(--line)" }}>
              <div style={{ fontSize: "clamp(26px, 2.5vw, 36px)", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                Read-only
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                GitHub access
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                Zero repository write permissions requested
              </div>
            </div>

            {/* Fact 3 */}
            <div style={{ paddingLeft: "16px", borderLeft: "1px solid var(--line)" }}>
              <div style={{ fontSize: "clamp(26px, 2.5vw, 36px)", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                24 hours
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                Maximum retention
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                Source code purged upon scan completion
              </div>
            </div>

            {/* Fact 4 */}
            <div style={{ paddingLeft: "16px", borderLeft: "1px solid var(--line)" }}>
              <div style={{ fontSize: "clamp(26px, 2.5vw, 36px)", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                3 layers
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                Analysis pipeline
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                Static AST, logic review, and dynamic sandbox
              </div>
            </div>
          </div>

          {/* Framework support sub-line */}
          <div
            style={{
              paddingTop: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "24px",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--muted)",
            }}
          >
            <span>Release 1 supports:</span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ color: "var(--text)", fontWeight: 600, padding: "3px 10px", backgroundColor: "var(--sunken)", border: "1px solid var(--line)", borderRadius: "var(--radius-control)" }}>
                Express
              </span>
              <span style={{ color: "var(--text)", fontWeight: 600, padding: "3px 10px", backgroundColor: "var(--sunken)", border: "1px solid var(--line)", borderRadius: "var(--radius-control)" }}>
                Next.js
              </span>
              <span style={{ color: "var(--text)", fontWeight: 600, padding: "3px 10px", backgroundColor: "var(--sunken)", border: "1px solid var(--line)", borderRadius: "var(--radius-control)" }}>
                FastAPI
              </span>
              <span style={{ color: "var(--text)", fontWeight: 600, padding: "3px 10px", backgroundColor: "var(--sunken)", border: "1px solid var(--line)", borderRadius: "var(--radius-control)" }}>
                Flask
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3) PROBLEM STORY */}
      <section className="section section-bg">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 5 columns */}
            <div className="col-5">
              <span className="eyebrow">The authorization gap</span>

              <h2 className="section-h2">
                AI builds the feature. It rarely builds the rules about who may use it.
              </h2>

              <p className="body-p" style={{ marginBottom: "28px" }}>
                AI code generation assistants quickly create working API endpoints, but boilerplate prompts consistently omit authorization boundaries:
              </p>

              {/* Numbered list with dividers (no boxes) */}
              <div style={{ display: "flex", flexDirection: "column", marginBottom: "32px" }}>
                <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)" }}>01</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>Unauthenticated state changes</div>
                    <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "2px" }}>POST and DELETE routes missing login middleware.</div>
                  </div>
                </div>

                <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)" }}>02</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>Missing object ownership check</div>
                    <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "2px" }}>Users can access other tenants' data by guessing IDs.</div>
                  </div>
                </div>

                <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)" }}>03</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>Role escalation via mass assignment</div>
                    <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "2px" }}>Request body payloads bind directly to internal role fields.</div>
                  </div>
                </div>

                <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)" }}>04</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>Hardcoded credentials in repositories</div>
                    <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "2px" }}>API keys and tokens committed in client bundles and configs.</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: "1.6" }}>
                Broken Access Control holds the #1 position on the{" "}
                <a
                  href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--accent-text)", textDecoration: "underline" }}
                >
                  OWASP Top 10
                </a>{" "}
                security risks, affecting 94% of audited web applications.
              </div>
            </div>

            {/* Right 7 columns */}
            <div className="col-7">
              <ProblemExplainer />
            </div>
          </div>
        </Container>
      </section>

      {/* 4) HOW IT WORKS (Alternating Chess Rows) */}
      <section id="how-it-works" className="section section-surface">
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "80px" }}>
            <span className="eyebrow">Walkthrough</span>
            <h2 className="section-h2">How it works</h2>
            <p className="lead-p" style={{ margin: 0 }}>
              Three steps from repository connection to verified remediation.
            </p>
          </div>

          {/* Step 1: Chess Row 1 (Text Left 5, Visual Right 7) */}
          <div className="grid-12" style={{ alignItems: "center", marginBottom: "96px" }}>
            <div className="col-5">
              <div
                style={{
                  fontSize: "64px",
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
              <h3 className="section-h3" style={{ marginBottom: "12px" }}>
                Connect your repository
              </h3>
              <p className="body-p" style={{ marginBottom: "20px" }}>
                Authorize KAIRO via GitHub OAuth. KAIRO requests read-only archive scope, clones the selected repository into an ephemeral worker, and generates an initial AST symbol table.
              </p>
              <Link
                href="/how-it-works#step-1"
                style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--accent-text)" }}
              >
                Learn about repository intake scope →
              </Link>
            </div>
            <div className="col-7">
              <WalkthroughStage step={1} />
            </div>
          </div>

          {/* Step 2: Chess Row 2 (Visual Left 7, Text Right 5) */}
          <div className="grid-12" style={{ alignItems: "center", marginBottom: "96px" }}>
            <div className="col-7">
              <WalkthroughStage step={2} />
            </div>
            <div className="col-5">
              <div
                style={{
                  fontSize: "64px",
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
              <h3 className="section-h3" style={{ marginBottom: "12px" }}>
                Multi-layer audit execution
              </h3>
              <p className="body-p" style={{ marginBottom: "20px" }}>
                Static analysis maps all endpoints. Semantic logic review evaluates authorization predicates. Dynamic testing runs in an isolated gVisor container with zero outbound internet access to replay hypotheses.
              </p>
              <Link
                href="/how-it-works#step-2"
                style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--accent-text)" }}
              >
                Explore our three analysis layers →
              </Link>
            </div>
          </div>

          {/* Step 3: Chess Row 3 (Text Left 5, Visual Right 7) */}
          <div className="grid-12" style={{ alignItems: "center" }}>
            <div className="col-5">
              <div
                style={{
                  fontSize: "64px",
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
              <h3 className="section-h3" style={{ marginBottom: "12px" }}>
                Fix and export verified findings
              </h3>
              <p className="body-p" style={{ marginBottom: "20px" }}>
                Every confirmed vulnerability comes with exact source code file and line citations, reproduction curl commands, and tested framework patches ready for review.
              </p>
              <Link
                href="/how-it-works#step-3"
                style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--accent-text)" }}
              >
                Read about finding calibration and fixes →
              </Link>
            </div>
            <div className="col-7">
              <WalkthroughStage step={3} />
            </div>
          </div>
        </Container>
      </section>

      {/* 5) THREE LAYERS */}
      <section className="section section-bg">
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <span className="eyebrow">Analysis pipeline</span>
            <h2 className="section-h2">Three layers, one report</h2>
            <p className="lead-p" style={{ margin: 0 }}>
              KAIRO cross-references static syntax, AI-assisted semantic logic, and empirical sandbox testing into a single calibrated report.
            </p>
          </div>

          {/* Full Container Width Layer Diagram */}
          <div style={{ marginBottom: "48px" }}>
            <LayerDiagram />
          </div>

          {/* Three-Column Definition List (No Boxes) */}
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
              margin: 0,
              paddingTop: "24px",
              borderTop: "1px solid var(--line)",
            }}
          >
            <div>
              <dt style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)", marginBottom: "6px" }}>
                01. Static Engine
              </dt>
              <dd style={{ margin: 0, fontSize: "15px", color: "var(--text-2)", lineHeight: "1.6" }}>
                Tree-sitter AST extraction discovers routes and middleware attachments without executing code.
              </dd>
            </div>

            <div>
              <dt style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)", marginBottom: "6px" }}>
                02. Semantic Review
              </dt>
              <dd style={{ margin: 0, fontSize: "15px", color: "var(--text-2)", lineHeight: "1.6" }}>
                AI-assisted logic reasoning compares developer intent with database filtering to catch IDOR vulnerabilities.
              </dd>
            </div>

            <div>
              <dt style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)", marginBottom: "6px" }}>
                03. Dynamic Sandbox
              </dt>
              <dd style={{ margin: 0, fontSize: "15px", color: "var(--text-2)", lineHeight: "1.6" }}>
                Offline gVisor kernel replays synthesized exploits against running servers to measure real HTTP status codes.
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* 6) COVERAGE EXPLORER TEASER */}
      <section className="section section-surface">
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "40px" }}>
            <span className="eyebrow">Flaw catalog</span>
            <h2 className="section-h2">What KAIRO checks in Release 1</h2>
            <p className="lead-p" style={{ margin: "0 0 16px" }}>
              13 distinct flaw classes covering broken authorization, committed credentials, and web application injection.
            </p>
          </div>

          <TabbedCoverage />

          <div style={{ marginTop: "32px" }}>
            <Link
              href="/coverage"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--accent-text)",
                textDecoration: "underline",
              }}
            >
              View detailed detection rules and code examples on the Coverage page →
            </Link>
          </div>
        </Container>
      </section>

      {/* 7) REPORT SHOWCASE */}
      <section className="section section-bg">
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <span className="eyebrow">Evidence-backed output</span>
            <h2 className="section-h2">A report you can act on</h2>
            <p className="lead-p" style={{ margin: "0 0 10px" }}>
              Every finding includes reproducible code evidence, sandbox replay confirmation, and verified remediation diffs.
            </p>
            <div className="caption-p" style={{ fontFamily: "var(--font-mono)" }}>
              A clean report never says your app is safe. It says what was checked and what was not.
            </div>
          </div>

          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 7 columns: Finding detail */}
            <div className="col-7">
              <WindowFrame path="app.kairo.dev/projects/acme-storefront-api/findings/KR-V01">
                <div style={{ padding: "20px 24px", backgroundColor: "var(--surface)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)" }}>
                          KR-V01
                        </span>
                        <span className="badge-severity badge-high">▲ HIGH</span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            padding: "2px 6px",
                            backgroundColor: "var(--accent-tint)",
                            color: "var(--accent-text)",
                            border: "1px solid var(--accent)",
                            borderRadius: "var(--radius-label)",
                          }}
                        >
                          Confirmed by test
                        </span>
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                        State-changing route without authentication
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: "4px" }}>
                    routes/orders.js:42
                  </div>
                  <pre
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      lineHeight: "1.5",
                      backgroundColor: "var(--sunken)",
                      padding: "12px 14px",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--radius-control)",
                      color: "var(--text)",
                      marginBottom: "14px",
                    }}
                  >
                    <code>{`router.post('/orders', async (req, res) => {
  // Flaw: Endpoint allows unauthenticated callers to write orders
  const order = await db.orders.create(req.body);
  return res.json(order);
});`}</code>
                  </pre>

                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "6px" }}>
                    Verified Fix
                  </div>
                  <pre
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      lineHeight: "1.5",
                      backgroundColor: "var(--sunken)",
                      padding: "10px 14px",
                      border: "1px solid var(--accent)",
                      borderRadius: "var(--radius-control)",
                      color: "var(--accent-text)",
                    }}
                  >
                    <code>{`+ router.post('/orders', requireAuth, async (req, res) => {`}</code>
                  </pre>
                </div>
              </WindowFrame>
            </div>

            {/* Right 5 columns: Export formats & numbered list */}
            <div className="col-5">
              <h3 className="section-h3" style={{ marginBottom: "12px" }}>
                Three deterministic export formats
              </h3>
              <p className="body-p" style={{ marginBottom: "24px" }}>
                Reports can be consumed by engineering leads, security reviewers, and automated CI pipelines.
              </p>

              {/* Exports stage (PDF, SARIF, JSON overlapping sheets) */}
              <div style={{ marginBottom: "32px" }}>
                <ExportsStage />
              </div>

              {/* Numbered list of what each finding contains */}
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
                <div style={{ fontSize: "13px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text)", marginBottom: "12px" }}>
                  EACH FINDING CONTAINS:
                </div>
                <ol style={{ paddingLeft: "20px", fontSize: "14px", color: "var(--text-2)", lineHeight: "1.8" }}>
                  <li>Exact file path and line number citation</li>
                  <li>Unauthenticated curl reproduction command</li>
                  <li>Calibrated confidence rating (Confirmed, Likely, Possible)</li>
                  <li>Tested framework patch ready for review</li>
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8) TRUST MOMENT (Inverted Section) */}
      <section className="section section-inverted">
        <Container>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <span className="eyebrow inverted-accent">Trust and security</span>
            <h2 style={{ fontSize: "clamp(32px, 3.4vw, 48px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.015em", color: "inherit", marginBottom: "16px" }}>
              Built so you can trust it with your code
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.5, opacity: 0.85, margin: 0 }}>
              Your source code constitutes sensitive proprietary intellectual property. KAIRO enforces strict physical and logical boundaries throughout the scan lifecycle.
            </p>
          </div>

          {/* Full Width Trust Diagram */}
          <div style={{ marginBottom: "48px" }}>
            <TrustDiagram />
          </div>

          {/* Two-Column List of Plain Facts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "40px",
              paddingTop: "32px",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "inherit", marginBottom: "8px" }}>
                Zero model training
              </h3>
              <p style={{ fontSize: "15px", lineHeight: "1.6", opacity: 0.85, margin: 0 }}>
                We never use customer source code or vulnerability reports to train machine learning models. AI logic review remains turned off by default until approved strict data processing agreements are in place.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "inherit", marginBottom: "8px" }}>
                Strict 24-hour maximum retention
              </h3>
              <p style={{ fontSize: "15px", lineHeight: "1.6", opacity: 0.85, margin: 0 }}>
                Ephemeral repository clone archives are wiped immediately upon scan completion. No source files are ever stored longer than 24 hours under any circumstances.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 9) LIMITS AND ROADMAP (In One Row) */}
      <section className="section section-surface">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 6 columns: What KAIRO does not do (Plain list) */}
            <div className="col-6">
              <span className="eyebrow">Boundaries</span>
              <h2 className="section-h2">What KAIRO does not do</h2>
              <p className="lead-p" style={{ marginBottom: "28px" }}>
                Honest limits prevent false security confidence.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ paddingBottom: "16px", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>
                    Not a penetration test or compliance certification
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "4px", lineHeight: "1.6" }}>
                    KAIRO tests code against 13 specific vulnerability rules. It is not an alternative to manual human red-team assessments or formal SOC2/ISO audit certifications.
                  </div>
                </div>

                <div style={{ paddingBottom: "16px", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>
                    Does not attack live production environments
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "4px", lineHeight: "1.6" }}>
                    Release 1 executes dynamic tests solely inside synthetic, isolated sandboxes. It never sends test payloads to your live customer-facing domains.
                  </div>
                </div>

                <div style={{ paddingBottom: "16px", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>
                    Cannot test dependencies requiring external third-party services
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "4px", lineHeight: "1.6" }}>
                    Workflows that require SMS gateways, external OAuth provider redirects, or live payment webhooks cannot execute inside the offline sandbox.
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 columns: Roadmap (Two-Step Vertical Timeline, No Boxes) */}
            <div className="col-6">
              <span className="eyebrow">Development plan</span>
              <h2 className="section-h2">Roadmap</h2>
              <p className="lead-p" style={{ marginBottom: "28px" }}>
                Current milestone capabilities and planned additions.
              </p>

              <div style={{ position: "relative", paddingLeft: "32px", borderLeft: "2px solid var(--line)" }}>
                {/* Milestone 1 */}
                <div style={{ position: "relative", marginBottom: "40px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "-38px",
                      top: "4px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent)",
                      border: "2px solid var(--bg)",
                    }}
                  />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--accent-text)", textTransform: "uppercase" }}>
                    ACTIVE DEVELOPMENT // RELEASE 1
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                    Core Audit Engine
                  </div>
                  <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--text-2)", lineHeight: "1.7", marginTop: "8px" }}>
                    <li>Static route analysis for Express, Next.js, FastAPI, and Flask</li>
                    <li>Isolated gVisor dynamic sandbox execution</li>
                    <li>13 vulnerability classes (KR-V01 to KR-V13)</li>
                    <li>Deterministic export formats: PDF, JSON, and SARIF</li>
                  </ul>
                </div>

                {/* Milestone 2 */}
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "-38px",
                      top: "4px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "var(--muted)",
                      border: "2px solid var(--bg)",
                    }}
                  />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" }}>
                    PLANNED // RELEASE 2
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                    Continuous Verification
                  </div>
                  <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--text-2)", lineHeight: "1.7", marginTop: "8px" }}>
                    <li>GitHub Pull Request verification checks and commit statuses</li>
                    <li>Additional frameworks: Django, Ruby on Rails, and Go Chi</li>
                    <li>Verified staging environment replay with synthetic test data</li>
                    <li>Multi-user team workspaces with role-based permissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10) FAQ */}
      <section className="section section-bg">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 4 columns: Heading and note */}
            <div className="col-4">
              <span className="eyebrow">FAQ</span>
              <h2 className="section-h2">Frequently asked questions</h2>
              <p className="body-p">
                Direct answers regarding testing mechanics, data handling, and project status.
              </p>
            </div>

            {/* Right 8 columns: Accordion */}
            <div className="col-8">
              <FAQAccordion />
            </div>
          </div>
        </Container>
      </section>

      {/* 11) FINAL CALL TO ACTION */}
      <CTASection />
    </div>
  );
}
