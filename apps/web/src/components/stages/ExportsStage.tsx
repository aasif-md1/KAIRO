import React from "react";

export function ExportsStage() {
  return (
    <div style={{ position: "relative", minHeight: "360px", width: "100%" }} aria-hidden="true">
      {/* Sheet 1 (Background): Executive PDF Report Summary */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "75%",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-card)",
          padding: "20px 24px",
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "12px", marginBottom: "14px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em" }}>KAIRO AUDIT REPORT</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>FORMAT: PDF/A-1b</div>
        </div>
        <div style={{ fontSize: "13px", color: "var(--text)", fontWeight: 600, marginBottom: "4px" }}>
          Executive Security Assessment
        </div>
        <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "14px" }}>
          Target: acme-storefront-api | Verdict: 2 Critical, 1 High, 1 Medium
        </div>
        <div style={{ display: "flex", gap: "8px", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
          <span style={{ padding: "4px 8px", backgroundColor: "var(--sunken)", borderRadius: "var(--radius-control)" }}>
            gVisor verified
          </span>
          <span style={{ padding: "4px 8px", backgroundColor: "var(--sunken)", borderRadius: "var(--radius-control)" }}>
            ISO/IEC 27001 ready
          </span>
        </div>
      </div>

      {/* Sheet 2 (Middle): SARIF 2.1.0 Standard Fragment */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "0",
          width: "72%",
          backgroundColor: "var(--sunken)",
          border: "1px solid var(--line-strong)",
          borderRadius: "var(--radius-card)",
          padding: "16px 20px",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--accent-text)" }}>
            report.sarif (OASIS Standard)
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>
            schema: 2.1.0
          </span>
        </div>
        <pre
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            lineHeight: "1.45",
            color: "var(--text-2)",
            margin: 0,
            overflowX: "hidden",
          }}
        >
          <code>{`{
  "version": "2.1.0",
  "runs": [{
    "tool": { "driver": { "name": "KAIRO" } },
    "results": [{
      "ruleId": "KR-V01",
      "level": "error",
      "message": { "text": "Unauthenticated state route" }
    }]
  }]
}`}</code>
        </pre>
      </div>

      {/* Sheet 3 (Foreground): Raw JSON Artifact */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "24px",
          width: "68%",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--accent)",
          borderRadius: "var(--radius-card)",
          padding: "14px 18px",
          boxSizing: "border-box",
          zIndex: 3,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--accent-text)" }}>
            findings.json (CI/CD Pipeline)
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--status-fixed)" }}>
            ✓ Verified
          </span>
        </div>
        <pre
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            lineHeight: "1.4",
            color: "var(--text)",
            margin: 0,
          }}
        >
          <code>{`{
  "scan_id": "scn_98b2c4",
  "confidence": "confirmed",
  "replay_status": 200,
  "fix_suggested": true
}`}</code>
        </pre>
      </div>
    </div>
  );
}
