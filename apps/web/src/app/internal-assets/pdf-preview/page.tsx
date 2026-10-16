import React from "react";

export default function AssetPdfPreviewScreen() {
  return (
    <div
      style={{
        backgroundColor: "var(--sunken)",
        padding: "40px 20px",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* A4 Sheet representation */}
      <div
        style={{
          width: "595px",
          minHeight: "842px",
          backgroundColor: "#FFFFFF",
          color: "#181A1B",
          padding: "48px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #181A1B", paddingBottom: "16px", marginBottom: "28px" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em" }}>KAIRO</div>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#5F6368" }}>ACCESS-CONTROL AND SECRET AUDIT</div>
            </div>
            <div style={{ textAlign: "right", fontSize: "10px", fontFamily: "var(--font-mono)", color: "#5F6368" }}>
              <div>REPORT ID: RPT-2026-98B2C4</div>
              <div>DATE: 2026-10-14 00:00 UTC</div>
            </div>
          </div>

          {/* Audit target */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "#5F6368", textTransform: "uppercase" }}>TARGET REPOSITORY</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>acme-corp/acme-storefront-api</div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "#5F6368", marginTop: "2px" }}>
              Commit: 98b2c481 (branch: main) | Scan duration: 28.4s
            </div>
          </div>

          {/* Executive Summary */}
          <div style={{ backgroundColor: "#F7F6F2", padding: "16px", border: "1px solid #E5E2D9", marginBottom: "28px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>
              Executive Summary
            </div>
            <p style={{ fontSize: "12px", lineHeight: "18px", margin: 0, color: "#2E3032" }}>
              KAIRO evaluated 28 HTTP endpoints against 13 access-control and secret-exposure vulnerability classes. The scan identified 4 actionable findings: 2 Critical, 1 High, and 1 Medium. 1 finding was verified via dynamic test replay.
            </p>
          </div>

          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "28px" }}>
            <div style={{ border: "1px solid #E5E2D9", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5F6368" }}>CRITICAL</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#C0392B" }}>2</div>
            </div>
            <div style={{ border: "1px solid #E5E2D9", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5F6368" }}>HIGH</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#D35400" }}>1</div>
            </div>
            <div style={{ border: "1px solid #E5E2D9", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5F6368" }}>MEDIUM</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#B7950B" }}>1</div>
            </div>
            <div style={{ border: "1px solid #E5E2D9", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-mono)", color: "#5F6368" }}>ENDPOINTS</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#181A1B" }}>28</div>
            </div>
          </div>

          {/* Findings Table preview */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "8px" }}>
              Primary Findings Overview
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #181A1B", color: "#5F6368" }}>
                  <th style={{ padding: "6px 0" }}>ID</th>
                  <th style={{ padding: "6px 0" }}>SEVERITY</th>
                  <th style={{ padding: "6px 0" }}>RULE</th>
                  <th style={{ padding: "6px 0" }}>LOCATION</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #E5E2D9" }}>
                  <td style={{ padding: "6px 0", fontFamily: "var(--font-mono)" }}>KR-V05</td>
                  <td style={{ padding: "6px 0", color: "#C0392B", fontWeight: 600 }}>Critical</td>
                  <td style={{ padding: "6px 0" }}>Hardcoded Stripe secret key</td>
                  <td style={{ padding: "6px 0", fontFamily: "var(--font-mono)" }}>config/payment.js:14</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #E5E2D9" }}>
                  <td style={{ padding: "6px 0", fontFamily: "var(--font-mono)" }}>KR-V08</td>
                  <td style={{ padding: "6px 0", color: "#C0392B", fontWeight: 600 }}>Critical</td>
                  <td style={{ padding: "6px 0" }}>SQL injection via query concatenation</td>
                  <td style={{ padding: "6px 0", fontFamily: "var(--font-mono)" }}>services/db.js:88</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #E5E2D9" }}>
                  <td style={{ padding: "6px 0", fontFamily: "var(--font-mono)" }}>KR-V01</td>
                  <td style={{ padding: "6px 0", color: "#D35400", fontWeight: 600 }}>High</td>
                  <td style={{ padding: "6px 0" }}>State-changing route without authentication</td>
                  <td style={{ padding: "6px 0", fontFamily: "var(--font-mono)" }}>routes/orders.js:42</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #E5E2D9", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#5F6368" }}>
          <div>KAIRO Security Audit Engine - Page 1 of 6</div>
          <div>Confidential - Prepared for Acme Corp</div>
        </div>
      </div>
    </div>
  );
}
