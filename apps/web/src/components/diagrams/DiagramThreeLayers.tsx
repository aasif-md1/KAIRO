import React from "react";

export function DiagramThreeLayers() {
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
        viewBox="0 0 800 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", minWidth: "600px", display: "block" }}
        aria-label="Three analysis layers funneling into one merged report"
      >
        {/* Layer 1: Static Engine */}
        <rect x="20" y="20" width="220" height="70" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="35" y="45" fill="var(--text)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
          Layer 1: Static Engine
        </text>
        <text x="35" y="65" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          Tree-sitter AST & Route Table
        </text>

        {/* Layer 2: Semantic Logic Review */}
        <rect x="290" y="20" width="220" height="70" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="305" y="45" fill="var(--text)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
          Layer 2: Logic Review
        </text>
        <text x="305" y="65" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          AI-Assisted Policy Analysis
        </text>

        {/* Layer 3: Dynamic Sandbox */}
        <rect x="560" y="20" width="220" height="70" rx="4" fill="var(--surface)" stroke="var(--line)" strokeWidth="1" />
        <text x="575" y="45" fill="var(--text)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
          Layer 3: Dynamic Sandbox
        </text>
        <text x="575" y="65" fill="var(--muted)" fontSize="11" fontFamily="var(--font-mono)">
          gVisor Isolated Container Replay
        </text>

        {/* Converging connector arrows */}
        <path d="M 130 90 L 130 130 L 390 130 L 390 150" stroke="var(--line-strong)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <path d="M 400 90 L 400 150" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
        <path d="M 670 90 L 670 130 L 410 130 L 410 150" stroke="var(--line-strong)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />

        {/* Merged Synthesis Box */}
        <rect x="140" y="150" width="520" height="66" rx="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="400" y="176" fill="var(--text)" fontSize="13" fontWeight="600" textAnchor="middle" fontFamily="var(--font-sans)">
          Deterministic Synthesis & Rubric
        </text>
        <text x="400" y="198" fill="var(--accent-text)" fontSize="11" textAnchor="middle" fontFamily="var(--font-mono)">
          Single Merged Audit Report with Calibrated Confidence
        </text>
      </svg>
    </div>
  );
}
