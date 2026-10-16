import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { WindowFrame } from "@/components/WindowFrame";
import { WalkthroughStage } from "@/components/stages/WalkthroughStage";
import { LayerDiagram } from "@/components/stages/LayerDiagram";

export const metadata = {
  title: "How It Works: KAIRO Access-Control Audit Walkthrough",
  description:
    "Long-form walkthrough of KAIRO access-control auditing: repository connection, static AST inventory, logic review, dynamic sandbox verification, and report synthesis.",
};

export default function HowItWorksPage() {
  return (
    <div style={{ position: "relative" }}>
      {/* 1. Header Band with Scan Timeline Strip */}
      <section
        style={{
          paddingTop: "64px",
          paddingBottom: "64px",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Container>
          <div className="grid-12" style={{ alignItems: "center" }}>
            <div className="col-7">
              <span className="eyebrow">Documentation & walkthrough</span>
              <h1 className="hero-h1" style={{ fontSize: "clamp(36px, 4vw, 52px)", marginBottom: "16px" }}>
                How KAIRO audits web applications
              </h1>
              <p className="lead-p" style={{ margin: 0 }}>
                A technical explanation of the analysis pipeline, three-layer confidence model, isolated execution environment, and operational boundaries.
              </p>
            </div>

            {/* Scan Timeline Graphic (Horizontal Strip) */}
            <div className="col-5">
              <div
                style={{
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  padding: "16px 20px",
                }}
                aria-label="Scan Timeline Stages"
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: "12px" }}>
                  SCAN PIPELINE // 42s EXECUTION
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: "var(--text)" }}>01. AST Route Table</span>
                    <span style={{ color: "var(--status-fixed)" }}>✓ 3.2s</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "var(--line)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "var(--status-fixed)" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                    <span style={{ color: "var(--text)" }}>02. Logic Review</span>
                    <span style={{ color: "var(--status-fixed)" }}>✓ 18.4s</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "var(--line)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "var(--status-fixed)" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                    <span style={{ color: "var(--text)" }}>03. Sandbox Replay</span>
                    <span style={{ color: "var(--status-fixed)" }}>✓ 20.4s</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "var(--line)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "var(--status-fixed)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Main Body with Sticky Left Step Index */}
      <section className="section section-bg">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Sticky Left Rail (3 Columns) */}
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
                PIPELINE STEPS
              </div>
              <a href="#step-1" style={{ color: "var(--text)", textDecoration: "none" }}>
                1. Connect repository
              </a>
              <a href="#step-2" style={{ color: "var(--text)", textDecoration: "none" }}>
                2. Static AST analysis
              </a>
              <a href="#step-3" style={{ color: "var(--text)", textDecoration: "none" }}>
                3. Logic review
              </a>
              <a href="#step-4" style={{ color: "var(--text)", textDecoration: "none" }}>
                4. Dynamic sandbox replay
              </a>
              <a href="#step-5" style={{ color: "var(--text)", textDecoration: "none" }}>
                5. Correlate and report
              </a>

              <div style={{ height: "1px", backgroundColor: "var(--line)", margin: "8px 0" }} />

              <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                REFERENCE
              </div>
              <a href="#confidence-model" style={{ color: "var(--muted)", textDecoration: "none" }}>
                Confidence model
              </a>
              <a href="#boundaries" style={{ color: "var(--muted)", textDecoration: "none" }}>
                Operational boundaries
              </a>
              <a href="#glossary" style={{ color: "var(--muted)", textDecoration: "none" }}>
                Glossary
              </a>
            </aside>

            {/* Step Sections (9 Columns) */}
            <div className="col-9" style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
              {/* Step 1: Two Column Layout */}
              <div id="step-1" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "64px" }}>
                <span className="eyebrow">Step 01</span>
                <h2 className="section-h2" style={{ marginBottom: "24px" }}>
                  Connect repository with read-only scope
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
                  <div>
                    <p className="body-p" style={{ marginBottom: "16px" }}>
                      KAIRO integrates with GitHub via an OAuth installation that requests read-only archive access to repositories you explicitly authorize.
                    </p>
                    <p className="body-p">
                      KAIRO never requests write access, never modifies git history, and never opens unreviewed pull requests without your approval.
                    </p>
                  </div>
                  <div>
                    <WalkthroughStage step={1} />
                  </div>
                </div>
              </div>

              {/* Step 2: Two Column Layout */}
              <div id="step-2" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "64px" }}>
                <span className="eyebrow">Step 02</span>
                <h2 className="section-h2" style={{ marginBottom: "24px" }}>
                  Static AST route inventory & pattern detection
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
                  <div>
                    <p className="body-p" style={{ marginBottom: "16px" }}>
                      The static engine parses the repository Abstract Syntax Tree using Tree-sitter. It indexes all declared HTTP routes across Express, Next.js, FastAPI, and Flask.
                    </p>
                    <p className="body-p">
                      It traces middleware attachments and flags endpoints where authentication wrappers are absent on state-modifying actions.
                    </p>
                  </div>
                  <div>
                    <WindowFrame path="app.kairo.dev/projects/acme-storefront-api/routes">
                      <div style={{ padding: "16px", backgroundColor: "var(--surface)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
                          <span>POST /api/orders</span>
                          <span style={{ color: "var(--sev-critical)" }}>[Auth Absent]</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
                          <span>GET /api/orders/:id</span>
                          <span style={{ color: "var(--status-fixed)" }}>[Auth Detected]</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                          <span>DELETE /api/users/:id</span>
                          <span style={{ color: "var(--sev-critical)" }}>[Auth Absent]</span>
                        </div>
                      </div>
                    </WindowFrame>
                  </div>
                </div>
              </div>

              {/* Step 3: Two Column Layout */}
              <div id="step-3" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "64px" }}>
                <span className="eyebrow">Step 03</span>
                <h2 className="section-h2" style={{ marginBottom: "24px" }}>
                  Semantic logic review
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
                  <div>
                    <p className="body-p" style={{ marginBottom: "16px" }}>
                      Static analysis can find missing middleware, but cannot tell if an IDOR check like `order.user_id === session.user_id` is present in business logic.
                    </p>
                    <p className="body-p">
                      The semantic logic layer evaluates authorization rules against 13 flaw classes to formulate hypotheses for dynamic test verification.
                    </p>
                  </div>
                  <div>
                    <WindowFrame path="app.kairo.dev/logic/evaluation">
                      <div style={{ padding: "16px", backgroundColor: "var(--sunken)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                        <div style={{ color: "var(--muted)", marginBottom: "4px" }}>// Predicate Reasoning</div>
                        <div style={{ color: "var(--text)" }}>{`{ "route": "/api/orders/:id",`}</div>
                        <div style={{ color: "var(--text)" }}>{`  "auth_middleware": true,`}</div>
                        <div style={{ color: "var(--sev-high)" }}>{`  "tenant_scoping": "missing",`}</div>
                        <div style={{ color: "var(--accent-text)" }}>{`  "hypothesis": "IDOR_VULNERABLE" }`}</div>
                      </div>
                    </WindowFrame>
                  </div>
                </div>
              </div>

              {/* Step 4: Two Column Layout */}
              <div id="step-4" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "64px" }}>
                <span className="eyebrow">Step 04</span>
                <h2 className="section-h2" style={{ marginBottom: "24px" }}>
                  Dynamic sandbox verification in gVisor
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
                  <div>
                    <p className="body-p" style={{ marginBottom: "16px" }}>
                      Hypotheses are tested inside an isolated container sandbox running on a hardened gVisor kernel.
                    </p>
                    <p className="body-p">
                      Outbound internet connectivity is completely blocked. The test runner fires synthetic test requests to verify whether mutations succeed anonymously.
                    </p>
                  </div>
                  <div>
                    <WalkthroughStage step={2} />
                  </div>
                </div>
              </div>

              {/* Step 5: Two Column Layout */}
              <div id="step-5" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "64px" }}>
                <span className="eyebrow">Step 05</span>
                <h2 className="section-h2" style={{ marginBottom: "24px" }}>
                  Evidence correlation & actionable reporting
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
                  <div>
                    <p className="body-p" style={{ marginBottom: "16px" }}>
                      Findings from all three layers merge into a unified report. Every finding includes confidence levels, exact code locations, and framework-specific patch guidance.
                    </p>
                    <p className="body-p">
                      Export reports directly in SARIF 2.1.0, JSON, or executive PDF formats.
                    </p>
                  </div>
                  <div>
                    <WalkthroughStage step={3} />
                  </div>
                </div>
              </div>

              {/* Confidence Model: Three-Row Table (Not Boxes) */}
              <div id="confidence-model" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "64px" }}>
                <span className="eyebrow">Scoring rubric</span>
                <h2 className="section-h2" style={{ marginBottom: "16px" }}>
                  The three-tier confidence model
                </h2>
                <p className="body-p" style={{ marginBottom: "24px" }}>
                  KAIRO never presents speculative guesses as confirmed vulnerabilities. Every finding explicitly states its verification basis:
                </p>

                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                      fontSize: "14px",
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--line)", backgroundColor: "var(--sunken)" }}>
                        <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>TIER</th>
                        <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>VERIFICATION BASIS</th>
                        <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>EXAMPLE CRITERIA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "16px", fontWeight: 600, color: "var(--status-fixed)", fontFamily: "var(--font-mono)" }}>
                          CONFIRMED
                        </td>
                        <td style={{ padding: "16px", color: "var(--text-2)", lineHeight: "1.5" }}>
                          Reproduced and confirmed by dynamic sandbox execution with an empirical HTTP response payload.
                        </td>
                        <td style={{ padding: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                          Unauthenticated POST returned 200 OK
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "16px", fontWeight: 600, color: "var(--sev-high)", fontFamily: "var(--font-mono)" }}>
                          LIKELY
                        </td>
                        <td style={{ padding: "16px", color: "var(--text-2)", lineHeight: "1.5" }}>
                          High static or logic confidence, but sandbox replay was unavailable or skipped due to missing seed fixtures.
                        </td>
                        <td style={{ padding: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                          Raw SQL string concat without bindings
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "16px", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                          POSSIBLE
                        </td>
                        <td style={{ padding: "16px", color: "var(--text-2)", lineHeight: "1.5" }}>
                          Ambiguous code pattern detected that warrants review, but automatic analysis cannot verify exploitability.
                        </td>
                        <td style={{ padding: "16px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                          Custom auth wrapper with complex branches
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Operational Boundaries: Two-Column List */}
              <div id="boundaries" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "64px" }}>
                <span className="eyebrow">Scope</span>
                <h2 className="section-h2" style={{ marginBottom: "20px" }}>
                  Operational boundaries
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Offline Execution Only</div>
                    <p style={{ fontSize: "14px", color: "var(--text-2)", margin: 0, lineHeight: "1.6" }}>
                      Dynamic tests run solely inside isolated sandboxes. Live production endpoints are never contacted or scanned.
                    </p>
                  </div>
                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Blocked Internet Egress</div>
                    <p style={{ fontSize: "14px", color: "var(--text-2)", margin: 0, lineHeight: "1.6" }}>
                      External dependencies like live SMS gateways, external OAuth endpoints, and payment webhooks cannot execute.
                    </p>
                  </div>
                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>15-Minute Hard Timeout</div>
                    <p style={{ fontSize: "14px", color: "var(--text-2)", margin: 0, lineHeight: "1.6" }}>
                      Single scans hold a hard execution limit of 15 minutes before graceful termination to prevent infinite loops.
                    </p>
                  </div>
                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <div style={{ fontWeight: 600, fontSize: "15px", marginBottom: "4px" }}>Guaranteed Purge</div>
                    <p style={{ fontSize: "14px", color: "var(--text-2)", margin: 0, lineHeight: "1.6" }}>
                      Temporary clone volumes are purged upon scan completion and never stored longer than 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Glossary: Two-Column Definition List */}
              <div id="glossary">
                <span className="eyebrow">Terminology</span>
                <h2 className="section-h2" style={{ marginBottom: "20px" }}>
                  Glossary
                </h2>
                <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", margin: 0 }}>
                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <dt style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)", marginBottom: "4px" }}>
                      AST (Abstract Syntax Tree)
                    </dt>
                    <dd style={{ margin: 0, fontSize: "14px", color: "var(--text-2)", lineHeight: "1.6" }}>
                      A hierarchical representation of program source code generated by parsers without executing code.
                    </dd>
                  </div>

                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <dt style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)", marginBottom: "4px" }}>
                      gVisor Application Kernel
                    </dt>
                    <dd style={{ margin: 0, fontSize: "14px", color: "var(--text-2)", lineHeight: "1.6" }}>
                      A secure user-space kernel that intercepts and sandboxes container system calls, preventing container escapes.
                    </dd>
                  </div>

                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <dt style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)", marginBottom: "4px" }}>
                      IDOR
                    </dt>
                    <dd style={{ margin: 0, fontSize: "14px", color: "var(--text-2)", lineHeight: "1.6" }}>
                      Insecure Direct Object Reference; a flaw where an application provides direct access to objects based on user-supplied input.
                    </dd>
                  </div>

                  <div style={{ padding: "16px 0", borderTop: "1px solid var(--line)" }}>
                    <dt style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, color: "var(--accent-text)", marginBottom: "4px" }}>
                      SARIF
                    </dt>
                    <dd style={{ margin: 0, fontSize: "14px", color: "var(--text-2)", lineHeight: "1.6" }}>
                      Static Analysis Results Interchange Format; the OASIS JSON standard for sharing static analysis outputs with tools.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
