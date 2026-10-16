import React from "react";

export default function AssetScanProgressScreen() {
  const stages = [
    { name: "Repository fetch and archive verification", status: "completed", duration: "1.2s", detail: "SHA-256 verified, read-only unpacked" },
    { name: "Static route and AST analysis", status: "completed", duration: "4.8s", detail: "28 routes inventoried, 3 framework handlers mapped" },
    { name: "Logic review and hypothesis generation", status: "completed", duration: "8.1s", detail: "Rule evaluation across 13 vulnerability classes" },
    { name: "Dynamic sandbox verification", status: "running", duration: "14.3s", detail: "Testing route 19/28 in isolated gVisor container" },
    { name: "Evidence correlation and deduplication", status: "pending", duration: "-", detail: "Awaiting sandbox run completion" },
    { name: "Report generation and artifact signing", status: "pending", duration: "-", detail: "PDF, JSON, SARIF formats" },
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
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            paddingBottom: "20px",
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
                branch: main
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>Scan in Progress: scn_98b2c4</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "4px 10px",
                backgroundColor: "var(--accent-subtle)",
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-control)",
                color: "var(--accent-text)",
                fontWeight: 600,
              }}
            >
              Stage 4 of 6: Dynamic sandbox
            </span>
          </div>
        </div>

        {/* Progress bar container */}
        <div
          style={{
            backgroundColor: "var(--sunken)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-card)",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
            <span style={{ fontWeight: 500 }}>Overall Scan Progress</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}>65% completed</span>
          </div>
          <div
            style={{
              height: "6px",
              backgroundColor: "var(--line)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "65%",
                height: "100%",
                backgroundColor: "var(--accent)",
              }}
            />
          </div>
        </div>

        {/* Stages list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {stages.map((stg, idx) => (
            <div
              key={stg.name}
              className="card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "2px",
                    backgroundColor:
                      stg.status === "completed"
                        ? "var(--status-fixed-bg)"
                        : stg.status === "running"
                        ? "var(--accent-subtle)"
                        : "var(--sunken)",
                    color:
                      stg.status === "completed"
                        ? "var(--status-fixed)"
                        : stg.status === "running"
                        ? "var(--accent-text)"
                        : "var(--muted)",
                    fontWeight: 600,
                  }}
                >
                  {idx + 1}
                </span>

                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "3px" }}>
                    {stg.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {stg.detail}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                  {stg.duration}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "var(--radius-label)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    backgroundColor:
                      stg.status === "completed"
                        ? "var(--status-fixed-bg)"
                        : stg.status === "running"
                        ? "var(--accent-subtle)"
                        : "var(--sunken)",
                    color:
                      stg.status === "completed"
                        ? "var(--status-fixed)"
                        : stg.status === "running"
                        ? "var(--accent-text)"
                        : "var(--muted)",
                  }}
                >
                  {stg.status}
                </span>
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
