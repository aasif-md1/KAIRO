import React from "react";

export function FAQAccordion() {
  const faqs = [
    {
      q: "How does KAIRO differ from traditional static analysis scanners?",
      a: "Traditional scanners match regex signatures on isolated lines of code without running your application. KAIRO combines static tree-sitter route inventory with semantic logic review and runs a sandboxed copy in an isolated gVisor container to verify whether authorization flaws can actually be exploited.",
    },
    {
      q: "Is customer source code used to train machine learning models?",
      a: "No. KAIRO does not use customer source code to train models. AI-assisted logic review of user code remains switched off until a model provider with suitable zero-data-retention agreements is approved, and it can be disabled per project.",
    },
    {
      q: "Does KAIRO commit changes or alter our Git repository?",
      a: "No. KAIRO requires read-only repository intake. It never commits to, pushes to, or modifies your repository.",
    },
    {
      q: "Which frameworks are supported in Release 1?",
      a: "Release 1 supports Express, Next.js, FastAPI, and Flask. Additional frameworks such as Django, Rails, and Spring are planned for Release 2.",
    },
    {
      q: "Does KAIRO test live production websites?",
      a: "No. Release 1 is strictly for pre-production code review. KAIRO spins up a temporary sandbox environment from your repository code. It does not scan live internet-facing domain URLs.",
    },
    {
      q: "What does KAIRO cost?",
      a: "KAIRO is a project in development. Pricing has not been decided.",
    },
    {
      q: "How long is source code kept on KAIRO systems?",
      a: "Source code snapshots are ephemeral and deleted immediately upon scan completion. Under no circumstances is source code retained longer than 24 hours.",
    },
    {
      q: "What does the final audit report contain?",
      a: "The report contains an executive summary, discovered route table inventory, prioritized findings with calibrated confidence levels (Confirmed, Likely, Possible), reproducible evidence (HTTP request and response replays or code line citations), and actionable remediation guidance. Reports can be exported as PDF, JSON, and SARIF.",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {faqs.map((item, idx) => (
        <details
          key={idx}
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            cursor: "pointer",
            border: "1px solid var(--line)",
          }}
        >
          <summary
            style={{
              padding: "18px 24px",
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--text)",
              listStyle: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              outline: "none",
            }}
          >
            <span>{item.q}</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--muted)",
                fontSize: "14px",
                marginLeft: "16px",
              }}
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <div
            style={{
              padding: "0 24px 20px 24px",
              color: "var(--muted)",
              fontSize: "15px",
              lineHeight: "24px",
              borderTop: "1px solid var(--line)",
              paddingTop: "16px",
              cursor: "default",
            }}
          >
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
