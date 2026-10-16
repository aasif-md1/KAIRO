import React from "react";
import { SeverityLabel } from "@/components/SeverityLabel";

export default function AssetFindingDetailScreen() {
  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        padding: "32px",
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        {/* Finding header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--line)",
            marginBottom: "24px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>
                KR-V01
              </span>
              <span style={{ color: "var(--line-strong)" }}>•</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                CWE-306
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>
              State-changing route without authentication
            </h1>
            <div style={{ marginTop: "6px", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--muted)" }}>
              POST /api/orders (routes/orders.js:42)
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--status-fixed)",
                backgroundColor: "var(--status-fixed-bg)",
                padding: "3px 8px",
                borderRadius: "var(--radius-label)",
              }}
            >
              Confirmed by dynamic test
            </span>
            <SeverityLabel severity="high" />
          </div>
        </div>

        {/* Observed Evidence Code Snippet */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted)",
              marginBottom: "8px",
            }}
          >
            Observed Evidence (Static Layer)
          </h2>
          <div
            style={{
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-card)",
              padding: "16px",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              lineHeight: "22px",
            }}
          >
            <div style={{ color: "var(--muted)", marginBottom: "6px", fontSize: "11px" }}>routes/orders.js</div>
            <pre style={{ margin: 0 }}>
              <code>
{`41: // Order creation route
42: router.post('/api/orders', async (req, res) => {
43:   const { items, total } = req.body;
44:   const order = await db.orders.create({ data: { items, total } });
45:   res.status(201).json(order);
46: });`}
              </code>
            </pre>
          </div>
        </div>

        {/* Dynamic Sandbox Replay Proof */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted)",
              marginBottom: "8px",
            }}
          >
            Sandbox Replay Verification (Dynamic Layer)
          </h2>
          <div
            style={{
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-card)",
              padding: "16px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              lineHeight: "20px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <span style={{ color: "var(--muted)", display: "block", marginBottom: "4px" }}>UNAUTHENTICATED REQUEST</span>
              <div style={{ backgroundColor: "var(--surface)", padding: "10px", borderRadius: "3px", border: "1px solid var(--line)" }}>
                POST /api/orders HTTP/1.1<br />
                Host: sandbox.local:3000<br />
                Content-Type: application/json<br /><br />
                {`{"items": ["item_99"], "total": 450}`}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--muted)", display: "block", marginBottom: "4px" }}>EXPLOIT CONFIRMATION RESPONSE</span>
              <div style={{ backgroundColor: "var(--surface)", padding: "10px", borderRadius: "3px", border: "1px solid var(--sev-high)" }}>
                <span style={{ color: "var(--sev-high)", fontWeight: 600 }}>HTTP/1.1 201 Created</span><br />
                Content-Type: application/json<br /><br />
                {`{"id": "ord_102", "status": "pending"}`}<br />
                <span style={{ color: "var(--muted)", fontSize: "11px" }}>// Flaw verified: Unauthenticated write accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Framework Remediation */}
        <div>
          <h2
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted)",
              marginBottom: "8px",
            }}
          >
            Suggested Fix (Express)
          </h2>
          <div
            style={{
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--accent)",
              borderRadius: "var(--radius-card)",
              padding: "16px",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              lineHeight: "22px",
            }}
          >
            <pre style={{ margin: 0, color: "var(--accent-text)" }}>
              <code>
{`// Attach authentication middleware to enforce token verification
router.post('/api/orders', requireAuth, async (req, res) => {
  const { items, total } = req.body;
  const order = await db.orders.create({ data: { items, total, userId: req.user.id } });
  res.status(201).json(order);
});`}
              </code>
            </pre>
          </div>
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Sample data
          </span>
        </div>
      </div>
    </div>
  );
}
