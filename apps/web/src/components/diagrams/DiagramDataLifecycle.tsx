import React from "react";

export function DiagramDataLifecycle() {
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
        viewBox="0 0 900 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", minWidth: "700px", display: "block" }}
        aria-label="KAIRO data lifecycle: read-only clone, isolated execution, guaranteed deletion"
      >
        {/* Step 1: Read-Only Intake */}
        <rect x="20" y="30" width="180" height="90" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="35" y="55" fill="var(--text)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
          1. Read-Only Intake
        </text>
        <text x="35" y="75" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          GitHub OAuth or ZIP
        </text>
        <text x="35" y="95" fill="var(--accent-text)" fontSize="11" fontFamily="var(--font-mono)">
          No push permissions
        </text>

        {/* Connector 1 */}
        <line x1="200" y1="75" x2="240" y2="75" stroke="var(--line-strong)" strokeWidth="1.5" />
        <polygon points="240,75 234,71 234,79" fill="var(--line-strong)" />

        {/* Step 2: Ephemeral Analysis */}
        <rect x="240" y="30" width="200" height="90" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="255" y="55" fill="var(--text)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
          2. Ephemeral Storage
        </text>
        <text x="255" y="75" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          Encrypted with per-project
        </text>
        <text x="255" y="95" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          AES-256 data keys
        </text>

        {/* Connector 2 */}
        <line x1="440" y1="75" x2="480" y2="75" stroke="var(--line-strong)" strokeWidth="1.5" />
        <polygon points="480,75 474,71 474,79" fill="var(--line-strong)" />

        {/* Step 3: Sandboxed Execution */}
        <rect x="480" y="30" width="200" height="90" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="495" y="55" fill="var(--text)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
          3. Isolated Sandbox
        </text>
        <text x="495" y="75" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          gVisor container
        </text>
        <text x="495" y="95" fill="var(--accent-text)" fontSize="11" fontFamily="var(--font-mono)">
          Zero outbound internet
        </text>

        {/* Connector 3 */}
        <line x1="680" y1="75" x2="720" y2="75" stroke="var(--line-strong)" strokeWidth="1.5" />
        <polygon points="720,75 714,71 714,79" fill="var(--line-strong)" />

        {/* Step 4: Deletion Guarantee */}
        <rect x="720" y="30" width="160" height="90" rx="4" fill="var(--surface)" stroke="var(--status-fixed)" strokeWidth="1.5" />
        <text x="735" y="55" fill="var(--status-fixed)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
          4. Complete Purge
        </text>
        <text x="735" y="75" fill="var(--text)" fontSize="11" fontFamily="var(--font-mono)">
          Deleted at scan end
        </text>
        <text x="735" y="95" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          Never kept &gt; 24 hours
        </text>
      </svg>
    </div>
  );
}
