import React from "react";

export function DiagramArchitecture() {
  return (
    <div
      style={{
        backgroundColor: "var(--sunken)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-card)",
        padding: "24px",
        overflowX: "auto",
      }}
    >
      <svg
        viewBox="0 0 880 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", minWidth: "650px", display: "block" }}
        aria-label="KAIRO three-zone security architecture"
      >
        {/* Zone 1: Client */}
        <rect x="20" y="20" width="240" height="220" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="35" y="45" fill="var(--accent-text)" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
          ZONE 1: CLIENT
        </text>
        <text x="35" y="70" fill="var(--text)" fontSize="14" fontWeight="600" fontFamily="var(--font-sans)">
          User Browser
        </text>
        <rect x="35" y="90" width="210" height="40" rx="3" fill="var(--sunken)" stroke="var(--line)" strokeWidth="1" />
        <text x="45" y="115" fill="var(--text-2)" fontSize="12" fontFamily="var(--font-mono)">
          Next.js Static Shell
        </text>
        <rect x="35" y="145" width="210" height="40" rx="3" fill="var(--sunken)" stroke="var(--line)" strokeWidth="1" />
        <text x="45" y="170" fill="var(--text-2)" fontSize="12" fontFamily="var(--font-mono)">
          Encrypted Session Cookie
        </text>

        {/* Arrow Zone 1 to Zone 2 */}
        <line x1="260" y1="130" x2="310" y2="130" stroke="var(--line-strong)" strokeWidth="1.5" />
        <polygon points="310,130 304,126 304,134" fill="var(--line-strong)" />
        <text x="285" y="120" fill="var(--muted)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
          HTTPS
        </text>

        {/* Zone 2: Control Plane */}
        <rect x="320" y="20" width="240" height="220" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="335" y="45" fill="var(--accent-text)" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
          ZONE 2: CONTROL PLANE
        </text>
        <text x="335" y="70" fill="var(--text)" fontSize="14" fontWeight="600" fontFamily="var(--font-sans)">
          API & Metadata Storage
        </text>
        <rect x="335" y="90" width="210" height="40" rx="3" fill="var(--sunken)" stroke="var(--line)" strokeWidth="1" />
        <text x="345" y="115" fill="var(--text-2)" fontSize="12" fontFamily="var(--font-mono)">
          FastAPI Backend Service
        </text>
        <rect x="335" y="145" width="210" height="40" rx="3" fill="var(--sunken)" stroke="var(--line)" strokeWidth="1" />
        <text x="345" y="170" fill="var(--text-2)" fontSize="12" fontFamily="var(--font-mono)">
          Isolated Multi-Tenant DB
        </text>

        {/* Arrow Zone 2 to Zone 3 */}
        <line x1="560" y1="130" x2="610" y2="130" stroke="var(--line-strong)" strokeWidth="1.5" />
        <polygon points="610,130 604,126 604,134" fill="var(--line-strong)" />
        <text x="585" y="120" fill="var(--muted)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
          Queue
        </text>

        {/* Zone 3: Execution Sandbox */}
        <rect x="620" y="20" width="240" height="220" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="635" y="45" fill="var(--accent-text)" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
          ZONE 3: SANDBOX
        </text>
        <text x="635" y="70" fill="var(--text)" fontSize="14" fontWeight="600" fontFamily="var(--font-sans)">
          Ephemeral Worker Node
        </text>
        <rect x="635" y="90" width="210" height="40" rx="3" fill="var(--sunken)" stroke="var(--line)" strokeWidth="1" />
        <text x="645" y="115" fill="var(--text-2)" fontSize="12" fontFamily="var(--font-mono)">
          gVisor Application Kernel
        </text>
        <rect x="635" y="145" width="210" height="40" rx="3" fill="var(--sunken)" stroke="var(--line)" strokeWidth="1" />
        <text x="645" y="170" fill="var(--text-2)" fontSize="12" fontFamily="var(--font-mono)">
          Zero DB Credentials
        </text>
        <text x="635" y="215" fill="var(--accent-text)" fontSize="11" fontFamily="var(--font-mono)">
          No egress internet access
        </text>
      </svg>
    </div>
  );
}
