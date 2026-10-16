"use client";

import React, { useState } from "react";

export function ProblemExplainer() {
  const [hasCheck, setHasCheck] = useState(false);

  return (
    <div
      className="card"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        border: "1px solid var(--line)",
      }}
    >
      {/* Segmented Control */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Ownership Inspection
        </span>

        <div
          role="radiogroup"
          aria-label="Select code implementation state"
          style={{
            display: "inline-flex",
            backgroundColor: "var(--sunken)",
            padding: "2px",
            borderRadius: "var(--radius-control)",
            border: "1px solid var(--line)",
          }}
        >
          <button
            type="button"
            role="radio"
            aria-checked={!hasCheck}
            onClick={() => setHasCheck(false)}
            className={`explainer-tab-btn ${!hasCheck ? "active" : ""}`}
          >
            Without the ownership check
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={hasCheck}
            onClick={() => setHasCheck(true)}
            className={`explainer-tab-btn ${hasCheck ? "active" : ""}`}
          >
            With the ownership check
          </button>
        </div>
      </div>

      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="polite" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>
        {hasCheck ? "Showing code with ownership check. Request refused with 404 Not Found." : "Showing code without ownership check. Data exposed to unauthorized user."}
      </div>

      {/* Split Code and Outcome */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Source Code Panel */}
        <div
          style={{
            backgroundColor: "var(--sunken)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-card)",
            padding: "16px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            lineHeight: "20px",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              color: "var(--muted)",
              fontSize: "11px",
              marginBottom: "8px",
              paddingBottom: "6px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            routes/invoices.js
          </div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "var(--text)" }}>
            <code>
{`// Route handler
app.get('/invoices/:id', auth, async (req, res) => {
  const invId = req.params.id;
`}
            {hasCheck ? (
              <span style={{ color: "var(--accent-text)", fontWeight: 600 }}>
{`  // Verified ownership check
  const inv = await db.invoices.findFirst({
    where: { id: invId, tenantId: req.user.tenantId }
  });
  if (!inv) return res.status(404).send();
`}
              </span>
            ) : (
              <span style={{ color: "var(--sev-critical)", fontWeight: 600 }}>
{`  // Missing tenant ownership check
  const inv = await db.invoices.findFirst({
    where: { id: invId }
  });
`}
              </span>
            )}
{`  res.json(inv);
});`}
            </code>
          </pre>
        </div>

        {/* HTTP Inspection Panel */}
        <div
          style={{
            backgroundColor: "var(--sunken)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-card)",
            padding: "16px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            lineHeight: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Request */}
          <div>
            <div
              style={{
                color: "var(--muted)",
                fontSize: "11px",
                marginBottom: "4px",
              }}
            >
              REQUEST by User B (tenant_beta)
            </div>
            <div
              style={{
                color: "var(--text)",
                backgroundColor: "var(--surface)",
                padding: "8px",
                borderRadius: "var(--radius-label)",
                border: "1px solid var(--line)",
              }}
            >
              GET /invoices/inv_userA_901<br />
              Authorization: Bearer token_user_b
            </div>
          </div>

          {/* Response */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "var(--muted)", fontSize: "11px" }}>RESPONSE</span>
              {hasCheck ? (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--status-fixed)",
                    backgroundColor: "var(--status-fixed-bg)",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-label)",
                  }}
                >
                  Request refused
                </span>
              ) : (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--sev-critical)",
                    backgroundColor: "var(--sev-critical-bg)",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-label)",
                  }}
                >
                  Data exposed
                </span>
              )}
            </div>

            <div
              style={{
                backgroundColor: "var(--surface)",
                padding: "8px",
                borderRadius: "var(--radius-label)",
                border: `1px solid ${hasCheck ? "var(--line)" : "var(--sev-critical)"}`,
                color: hasCheck ? "var(--text)" : "var(--sev-critical)",
              }}
            >
              {hasCheck ? (
                <div>
                  <strong>HTTP/1.1 404 Not Found</strong>
                  <div style={{ color: "var(--muted)", marginTop: "4px" }}>{`{"error": "Invoice not found"}`}</div>
                </div>
              ) : (
                <div>
                  <strong>HTTP/1.1 200 OK</strong>
                  <div style={{ marginTop: "4px" }}>
                    {`{"id": "inv_userA_901", "amount": 14500, "customer": "Acme Corp"}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
