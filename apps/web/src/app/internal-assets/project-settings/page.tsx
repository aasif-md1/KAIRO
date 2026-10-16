import React from "react";

export default function AssetProjectSettingsScreen() {
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Navigation tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            borderBottom: "1px solid var(--line)",
            marginBottom: "24px",
            fontSize: "14px",
          }}
        >
          <span style={{ paddingBottom: "12px", color: "var(--muted)" }}>General</span>
          <span
            style={{
              paddingBottom: "12px",
              fontWeight: 600,
              color: "var(--accent-text)",
              borderBottom: "2px solid var(--accent)",
            }}
          >
            Run Settings
          </span>
          <span style={{ paddingBottom: "12px", color: "var(--muted)" }}>Security and Scopes</span>
          <span style={{ paddingBottom: "12px", color: "var(--muted)" }}>Model Privacy</span>
        </div>

        <h1 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>Sandbox Execution Configuration</h1>
        <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 24px" }}>
          Configure execution parameters for dynamic testing in the isolated sandbox. Network egress is blocked by default.
        </p>

        {/* Form fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ padding: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Application Start Command
            </label>
            <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 10px" }}>
              Command executed inside the gVisor sandbox container to initialize the web application.
            </p>
            <input
              type="text"
              readOnly
              value="node server.js"
              style={{
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "var(--sunken)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-control)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text)",
              }}
            />
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Local Target Port
            </label>
            <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 10px" }}>
              Port where the HTTP test listener binds inside the isolated sandbox namespace.
            </p>
            <input
              type="text"
              readOnly
              value="3000"
              style={{
                width: "160px",
                padding: "8px 12px",
                backgroundColor: "var(--sunken)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-control)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text)",
              }}
            />
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Sandbox Environment Variables
            </label>
            <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 10px" }}>
              Key-value pairs supplied to the test runner. Values are encrypted at rest with project-specific keys.
            </p>
            <div
              style={{
                backgroundColor: "var(--sunken)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius-control)",
                padding: "12px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                lineHeight: "20px",
              }}
            >
              <div>NODE_ENV=test</div>
              <div>PORT=3000</div>
              <div>JWT_SECRET=sandbox_ephemeral_test_key_884</div>
            </div>
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
