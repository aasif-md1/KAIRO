import React from "react";
import { WindowFrame } from "../WindowFrame";

export function HeroStage() {
  return (
    <div className="hero-stage-container" aria-hidden="true">
      <div className="hero-stage-bleed" style={{ position: "relative" }}>
        {/* Main Report Window */}
        <WindowFrame
          path="app.kairo.dev/projects/acme-storefront-api/scans/scn_98b2c4"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            width: "100%",
            boxShadow: "none",
          }}
        >
          <div style={{ padding: "20px 24px" }}>
            {/* Header info bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--line)",
                paddingBottom: "14px",
                marginBottom: "16px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>
                    acme-storefront-api
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                    scn_98b2c4
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-2)", marginTop: "2px" }}>
                  Audit completed in 42s with 3 analysis layers
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    padding: "4px 8px",
                    backgroundColor: "var(--sunken)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--radius-control)",
                    color: "var(--text-2)",
                  }}
                >
                  Branch: main
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    padding: "4px 8px",
                    backgroundColor: "var(--accent-tint)",
                    border: "1px solid var(--accent)",
                    borderRadius: "var(--radius-control)",
                    color: "var(--accent-text)",
                    fontWeight: 600,
                  }}
                >
                  Export: SARIF / PDF
                </span>
              </div>
            </div>

            {/* Metric Overview Counters */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                  CRITICAL
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--sev-critical)", fontFamily: "var(--font-mono)" }}>
                  2
                </div>
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                  HIGH
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--sev-high)", fontFamily: "var(--font-mono)" }}>
                  1
                </div>
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                  MEDIUM
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--sev-medium)", fontFamily: "var(--font-mono)" }}>
                  1
                </div>
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                  ROUTES SCANNED
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                  28
                </div>
              </div>
            </div>

            {/* Findings List (4 Real Flaws) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "32px" }}>
              {/* Finding 1 */}
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--accent)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>
                      KR-V01
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                      State-changing route without authentication
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                    POST /api/orders routes/orders.js:42
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
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
                  <span className="badge-severity badge-high">
                    ▲ HIGH
                  </span>
                </div>
              </div>

              {/* Finding 2 */}
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>
                      KR-V05
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                      Hardcoded Stripe secret key in repository file
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                    config/payment.js:14
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      padding: "2px 6px",
                      backgroundColor: "var(--sunken)",
                      color: "var(--text-2)",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--radius-label)",
                    }}
                  >
                    Confirmed
                  </span>
                  <span className="badge-severity badge-critical">
                    ◆ CRITICAL
                  </span>
                </div>
              </div>

              {/* Finding 3 */}
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>
                      KR-V08
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                      SQL injection via unescaped string concatenation
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                    GET /api/products/search services/db.js:88
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      padding: "2px 6px",
                      backgroundColor: "var(--sunken)",
                      color: "var(--text-2)",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--radius-label)",
                    }}
                  >
                    Likely
                  </span>
                  <span className="badge-severity badge-critical">
                    ◆ CRITICAL
                  </span>
                </div>
              </div>

              {/* Finding 4 */}
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>
                      KR-V10
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                      Permissive CORS wildcard with credentials allowed
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                    ALL /api/* server.js:29
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      padding: "2px 6px",
                      backgroundColor: "var(--sunken)",
                      color: "var(--text-2)",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--radius-label)",
                    }}
                  >
                    Confirmed
                  </span>
                  <span className="badge-severity badge-medium">
                    ● MEDIUM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </WindowFrame>

        {/* Overlapping Inset Detail Card (55% width, borders only, no shadows) */}
        <div className="stage-inset-overlay">
          <div
            style={{
              padding: "6px 12px",
              backgroundColor: "var(--sunken)",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--text-2)",
            }}
          >
            <span>EVIDENCE // KR-V01</span>
            <span style={{ color: "var(--accent-text)", fontWeight: 600 }}>CONFIRMED TEST</span>
          </div>

          <div style={{ padding: "12px 14px" }}>
            {/* Cited code snippet */}
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: "4px" }}>
              routes/orders.js:42
            </div>
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                lineHeight: "1.45",
                backgroundColor: "var(--sunken)",
                padding: "8px 10px",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-control)",
                color: "var(--text)",
                marginBottom: "10px",
                overflowX: "auto",
              }}
            >
              <code>{`router.post('/orders', async (req, res) => {
  // Missing requireAuth middleware
  const order = await db.orders.create(req.body);
  return res.json(order);
});`}</code>
            </pre>

            {/* Replay Test Execution */}
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: "4px" }}>
              Sandbox Replay Execution
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                <div style={{ color: "var(--muted)" }}>REQUEST (No Auth)</div>
                <div style={{ color: "var(--text)", marginTop: "2px" }}>POST /api/orders</div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  backgroundColor: "var(--sev-critical-bg)",
                  border: "1px solid var(--sev-critical)",
                  borderRadius: "var(--radius-control)",
                }}
              >
                <div style={{ color: "var(--sev-critical)", fontWeight: 600 }}>RESPONSE 200 OK</div>
                <div style={{ color: "var(--text)", marginTop: "2px" }}>{`{"order_id": 9812}`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "32px", fontSize: "13px", color: "var(--muted)", textAlign: "right" }}>
        Caption: Sample data from synthetic test harness
      </div>
    </div>
  );
}
