import React from "react";

export function TrustDiagram() {
  return (
    <div style={{ width: "100%", boxSizing: "border-box" }} aria-label="KAIRO Three-Zone Trust Architecture and Data Lifecycle">
      {/* 3-Zone Topology Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Zone 1: Client Edge */}
        <div
          style={{
            padding: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "var(--radius-control)",
          }}
        >
          <div className="inverted-accent" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            ZONE 01 // CLIENT EDGE
          </div>
          <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            User Browser
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.5", opacity: 0.85, marginBottom: "16px" }}>
            Next.js static client shell. Communicates strictly over TLS 1.3. Zero tracking scripts, zero third-party telemetry.
          </p>
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "var(--radius-control)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
            }}
          >
            Encrypted Session Cookie
          </div>
        </div>

        {/* Zone 2: Control Plane */}
        <div
          style={{
            padding: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "var(--radius-control)",
          }}
        >
          <div className="inverted-accent" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            ZONE 02 // CONTROL PLANE
          </div>
          <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            API & Metadata Store
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.5", opacity: 0.85, marginBottom: "16px" }}>
            FastAPI metadata backend. Manages audit job queues and encrypted findings. Holds zero customer source code long-term.
          </p>
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "var(--radius-control)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
            }}
          >
            Row-Level Isolated DB
          </div>
        </div>

        {/* Zone 3: Execution Sandbox */}
        <div
          style={{
            padding: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--accent)",
            borderRadius: "var(--radius-control)",
          }}
        >
          <div className="inverted-accent" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            ZONE 03 // EXECUTION SANDBOX
          </div>
          <div style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            gVisor Runner Nodes
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.5", opacity: 0.85, marginBottom: "16px" }}>
            Isolated application kernel with network egress hard-blocked. Executes dynamic tests with zero production database credentials.
          </p>
          <div
            className="inverted-accent"
            style={{
              padding: "8px 12px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "var(--radius-control)",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Zero Outbound Internet
          </div>
        </div>
      </div>

      {/* 4-Step Data Lifecycle Banner */}
      <div
        style={{
          padding: "20px 24px",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "var(--radius-control)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.7 }}>01 // INTAKE</div>
          <div style={{ fontSize: "15px", fontWeight: 600, marginTop: "2px" }}>Read-only scope</div>
          <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>No write or push permissions requested</div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.7 }}>02 // ENCRYPTION</div>
          <div style={{ fontSize: "15px", fontWeight: 600, marginTop: "2px" }}>AES-256 Per-Job</div>
          <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>Ephemeral volume keys held in memory</div>
        </div>

        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.7 }}>03 // ZERO TRAINING</div>
          <div style={{ fontSize: "15px", fontWeight: 600, marginTop: "2px" }}>No Model Ingestion</div>
          <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>Code never trains AI or public models</div>
        </div>

        <div>
          <div className="inverted-accent" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600 }}>04 // GUARANTEE</div>
          <div className="inverted-accent" style={{ fontSize: "15px", fontWeight: 600, marginTop: "2px" }}>
            24h Maximum Lifespan
          </div>
          <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>Source deleted immediately at scan completion</div>
        </div>
      </div>
    </div>
  );
}
