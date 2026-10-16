import React from "react";
import { SeverityLabel } from "@/components/SeverityLabel";

export default function AssetReportScreen() {
  const findings = [
    {
      id: "fnd_01",
      ruleId: "KR-V01",
      title: "State-changing route without authentication",
      route: "POST /api/orders",
      file: "routes/orders.js:42",
      severity: "high" as const,
      confidence: "Confirmed",
    },
    {
      id: "fnd_02",
      ruleId: "KR-V05",
      title: "Hardcoded Stripe secret key",
      route: null,
      file: "config/payment.js:14",
      severity: "critical" as const,
      confidence: "Confirmed",
    },
    {
      id: "fnd_03",
      ruleId: "KR-V08",
      title: "SQL injection via query concatenation",
      route: "GET /api/products/search",
      file: "services/db.js:88",
      severity: "critical" as const,
      confidence: "Likely",
    },
    {
      id: "fnd_04",
      ruleId: "KR-V10",
      title: "Permissive CORS origin wildcard with credentials",
      route: "ALL /api/*",
      file: "server.js:29",
      severity: "medium" as const,
      confidence: "Confirmed",
    },
  ];

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
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--line)",
            marginBottom: "24px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                acme-storefront-api
              </span>
              <span style={{ color: "var(--line-strong)" }}>/</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)" }}>
                scn_98b2c4
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>Audit Findings Report</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "4px 8px",
                backgroundColor: "var(--sunken)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-control)",
                color: "var(--muted)",
              }}
            >
              Export: PDF | JSON | SARIF
            </span>
          </div>
        </div>

        {/* Summary Metric Counters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div className="card" style={{ padding: "12px 16px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              Critical
            </span>
            <div style={{ fontSize: "24px", fontWeight: 600, color: "var(--sev-critical)", marginTop: "4px" }}>
              2
            </div>
          </div>
          <div className="card" style={{ padding: "12px 16px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              High
            </span>
            <div style={{ fontSize: "24px", fontWeight: 600, color: "var(--sev-high)", marginTop: "4px" }}>
              1
            </div>
          </div>
          <div className="card" style={{ padding: "12px 16px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              Medium
            </span>
            <div style={{ fontSize: "24px", fontWeight: 600, color: "var(--sev-medium)", marginTop: "4px" }}>
              1
            </div>
          </div>
          <div className="card" style={{ padding: "12px 16px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              Routes Scanned
            </span>
            <div style={{ fontSize: "24px", fontWeight: 600, color: "var(--text)", marginTop: "4px" }}>
              28
            </div>
          </div>
        </div>

        {/* Findings List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {findings.map((f) => (
            <div
              key={f.id}
              className="card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent-text)", fontWeight: 600 }}>
                    {f.ruleId}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: 600 }}>{f.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                  {f.route && <span>{f.route}</span>}
                  <span>{f.file}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    padding: "3px 8px",
                    backgroundColor: "var(--sunken)",
                    borderRadius: "var(--radius-label)",
                    border: "1px solid var(--line)",
                    color: "var(--text-2)",
                  }}
                >
                  {f.confidence}
                </span>
                <SeverityLabel severity={f.severity} />
              </div>
            </div>
          ))}
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
