import React from "react";

export function LayerDiagram() {
  return (
    <div
      style={{
        backgroundColor: "var(--sunken)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-card)",
        padding: "32px 24px",
        width: "100%",
        boxSizing: "border-box",
      }}
      aria-label="Three analysis layers pipeline converging into one deterministic report"
    >
      {/* Top Banner: Intake */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "14px 20px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-control)",
          maxWidth: "480px",
          margin: "0 auto 32px",
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 600, color: "var(--accent-text)" }}>
          REPOSITORY INTAKE
        </span>
        <span style={{ fontSize: "14px", color: "var(--text)" }}>
          Read-only AST extraction across 28 routes
        </span>
      </div>

      {/* Three Parallel Lanes (Full Width 3 Columns) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Lane 1: Static Engine */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-control)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>
            LANE 01 // DETERMINISTIC
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
            Tree-sitter AST & Route Table
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: "1.5", marginBottom: "16px" }}>
            Parses ASTs without executing untrusted code. Detects missing middleware on state-changing endpoints and hardcoded credentials.
          </p>
          <div
            style={{
              marginTop: "auto",
              padding: "10px 12px",
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-control)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--text-2)",
            }}
          >
            <div>Output: Route inventory</div>
            <div style={{ color: "var(--muted)", marginTop: "2px" }}>28 endpoints mapped</div>
          </div>
        </div>

        {/* Lane 2: Logic Review */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-control)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>
            LANE 02 // SEMANTIC
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
            AI-Assisted Logic Review
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: "1.5", marginBottom: "16px" }}>
            Examines business intent and authorization rules. Identifies IDOR logic gaps where user context is unchecked.
          </p>
          <div
            style={{
              marginTop: "auto",
              padding: "10px 12px",
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-control)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--text-2)",
            }}
          >
            <div>Output: Cited JSON logic verdict</div>
            <div style={{ color: "var(--muted)", marginTop: "2px" }}>Predicate check flagged</div>
          </div>
        </div>

        {/* Lane 3: Dynamic Sandbox */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-control)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>
            LANE 03 // EMPIRICAL
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>
            gVisor Sandbox Replay
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: "1.5", marginBottom: "16px" }}>
            Spins up isolated container with network egress disabled. Replays synthetic exploit request to observe true HTTP status.
          </p>
          <div
            style={{
              marginTop: "auto",
              padding: "10px 12px",
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-control)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--text-2)",
            }}
          >
            <div>Output: Empirical HTTP trace</div>
            <div style={{ color: "var(--status-fixed)", marginTop: "2px" }}>Replay confirmed 200 OK</div>
          </div>
        </div>
      </div>

      {/* Merged Synthesis Bar (Full Width) */}
      <div
        style={{
          padding: "20px 24px",
          backgroundColor: "var(--surface)",
          border: "2px solid var(--accent)",
          borderRadius: "var(--radius-control)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>
            Deterministic Synthesis & Calibration
          </div>
          <div style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "2px" }}>
            Correlates static AST facts with sandbox execution to eliminate false positives.
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              padding: "6px 12px",
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent-text)",
              border: "1px solid var(--accent)",
              borderRadius: "var(--radius-label)",
            }}
          >
            CONFIRMED BY TEST
          </span>
          <span
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              padding: "6px 12px",
              backgroundColor: "var(--sunken)",
              color: "var(--text-2)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-label)",
            }}
          >
            LIKELY
          </span>
          <span
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              padding: "6px 12px",
              backgroundColor: "var(--sunken)",
              color: "var(--muted)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-label)",
            }}
          >
            NEEDS REVIEW
          </span>
        </div>
      </div>
    </div>
  );
}
