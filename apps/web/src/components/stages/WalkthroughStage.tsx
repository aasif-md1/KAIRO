import React from "react";
import { WindowFrame } from "../WindowFrame";

interface WalkthroughStageProps {
  step: 1 | 2 | 3;
}

export function WalkthroughStage({ step }: WalkthroughStageProps) {
  if (step === 1) {
    // Step 1: Connect Repository
    return (
      <div style={{ position: "relative", width: "100%", minWidth: "560px" }} aria-hidden="true">
        <WindowFrame path="app.kairo.dev/connect">
          <div style={{ padding: "20px 24px", backgroundColor: "var(--surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>Select GitHub Repository</div>
                <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>Read-only archive access authorized</div>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  padding: "4px 8px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                OAuth App Scope: repo:read
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--accent)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>acme-corp/acme-storefront-api</div>
                  <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-2)" }}>Express 4.18 - TypeScript - 28 routes</div>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--accent-text)",
                    backgroundColor: "var(--accent-tint)",
                    padding: "4px 8px",
                    borderRadius: "var(--radius-control)",
                    border: "1px solid var(--accent)",
                  }}
                >
                  Selected
                </span>
              </div>

              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>acme-corp/billing-service</div>
                  <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-2)" }}>FastAPI - Python - 14 routes</div>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-2)" }}>Ready</span>
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* Numbered Callout 1 */}
        <div
          style={{
            position: "absolute",
            top: "-12px",
            right: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--accent)",
            padding: "6px 12px",
            borderRadius: "var(--radius-control)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "var(--accent)",
              color: "var(--on-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
            }}
          >
            1
          </span>
          <span style={{ color: "var(--text)" }}>Zero write permissions required</span>
        </div>
      </div>
    );
  }

  if (step === 2) {
    // Step 2: Three Analysis Stages
    return (
      <div style={{ position: "relative", width: "100%", minWidth: "560px" }} aria-hidden="true">
        <WindowFrame path="app.kairo.dev/scans/scn_98b2c4/progress">
          <div style={{ padding: "20px 24px", backgroundColor: "var(--surface)" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>
              Active Pipeline Execution
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  padding: "12px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Stage 1: Tree-sitter AST & Route Table</div>
                  <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginTop: "2px" }}>
                    28 routes indexed, 4 middleware chains resolved
                  </div>
                </div>
                <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--status-fixed)" }}>✓ Done (3.2s)</span>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--accent)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Stage 2: Semantic Logic & Auth Policy Review</div>
                  <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginTop: "2px" }}>
                    Comparing state-changing verbs against permission predicates
                  </div>
                </div>
                <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--status-fixed)" }}>✓ Done (18.4s)</span>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Stage 3: gVisor Dynamic Container Sandbox Replay</div>
                  <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginTop: "2px" }}>
                    Synthesized test requests sent to ephemeral runner node
                  </div>
                </div>
                <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontWeight: 600 }}>
                  Active (20.4s)
                </span>
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* Numbered Callout 2 */}
        <div
          style={{
            position: "absolute",
            bottom: "-12px",
            left: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--accent)",
            padding: "6px 12px",
            borderRadius: "var(--radius-control)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "var(--accent)",
              color: "var(--on-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
            }}
          >
            2
          </span>
          <span style={{ color: "var(--text)" }}>Isolated execution with zero internet egress</span>
        </div>
      </div>
    );
  }

  // Step 3: Calibrated Findings Report
  return (
    <div style={{ position: "relative", width: "100%", minWidth: "560px" }} aria-hidden="true">
      <WindowFrame path="app.kairo.dev/scans/scn_98b2c4/findings/KR-V01">
        <div style={{ padding: "20px 24px", backgroundColor: "var(--surface)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
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
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
                State-changing route without authentication
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-control)",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>Recommended Fix</div>
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                lineHeight: "1.4",
                color: "var(--accent-text)",
                margin: 0,
              }}
            >
              <code>{`+ router.post('/orders', requireAuth, async (req, res) => {`}</code>
            </pre>
          </div>
        </div>
      </WindowFrame>

      {/* Numbered Callout 3 */}
      <div
        style={{
          position: "absolute",
          top: "-12px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--accent)",
          padding: "6px 12px",
          borderRadius: "var(--radius-control)",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        <span
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "var(--accent)",
            color: "var(--on-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
          }}
        >
          3
        </span>
        <span style={{ color: "var(--text)" }}>Tested fix ready for pull request</span>
      </div>
    </div>
  );
}
