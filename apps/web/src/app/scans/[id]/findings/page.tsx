"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ScanSubnav } from "@/components/ScanSubnav";

interface FindingItem {
  id: string;
  fingerprint: string;
  vulnerability_class: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational";
  confidence: "Confirmed" | "Likely" | "Possible";
  status: "open" | "fixed" | "dismissed";
  route_path: string | null;
  route_method: string | null;
  file_path: string | null;
  start_line: number | null;
  end_line: number | null;
  snippet: string | null;
  plain_language_explanation: string;
  remediation_advice: string;
  is_ai_assisted: boolean;
}

interface ScanData {
  id: string;
  project_id: string;
  status: string;
  rule_set_version: string;
  created_at: string;
}

const CLASS_DESCRIPTIONS: Record<string, string> = {
  V01: "Missing Authentication",
  V02: "Cross-Account Object Access (IDOR)",
  V03: "Privilege Escalation via Role Tampering",
  V04: "Client-Side-Only Access Control",
  V05: "Hardcoded Secret or Credential",
  V06: "Insecure Token or Session Handling",
  V07: "Weak Credential Storage or Hashing",
  V08: "Query Injection via String Concatenation",
  V09: "Missing Rate Limiting",
  V10: "Permissive CORS",
  V11: "Missing Row-Level Security",
  V12: "Mass Assignment",
  V13: "Debug Mode in Production",
};

export default function FindingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const scanId = resolvedParams.id;

  const [scan, setScan] = useState<ScanData | null>(null);
  const [findings, setFindings] = useState<FindingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedClass, setSelectedClass] = useState("ALL");
  const [search, setSearch] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/scans/${scanId}`, { credentials: "include" }).then((r) => {
        if (!r.ok) throw new Error("Failed to load scan.");
        return r.json();
      }),
      fetch(`${apiBase}/scans/${scanId}/findings`, { credentials: "include" }).then((r) => {
        if (!r.ok) throw new Error("Failed to load findings.");
        return r.json();
      }),
    ])
      .then(([scanData, findingsData]) => {
        setScan(scanData);
        setFindings(Array.isArray(findingsData) ? findingsData : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [scanId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <p style={{ color: "var(--muted)" }}>Loading scan findings...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Error Loading Findings</h1>
        <p style={{ color: "var(--danger)", marginBottom: "1.5rem" }}>{error || "Scan not found."}</p>
        <Link href={`/scans/${scanId}`} className="btn btn-secondary" style={{ fontSize: "0.875rem" }}>
          &larr; Back to scan progress
        </Link>
      </div>
    );
  }

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    if (selectedSeverity !== "ALL" && f.severity !== selectedSeverity) return false;
    if (selectedClass !== "ALL" && f.vulnerability_class !== selectedClass) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = f.title.toLowerCase().includes(q);
      const matchExpl = f.plain_language_explanation.toLowerCase().includes(q);
      const matchFile = (f.file_path || "").toLowerCase().includes(q);
      const matchRoute = (f.route_path || "").toLowerCase().includes(q);
      if (!matchTitle && !matchExpl && !matchFile && !matchRoute) return false;
    }
    return true;
  });

  // Severity counts
  const criticalCount = findings.filter((f) => f.severity === "Critical").length;
  const highCount = findings.filter((f) => f.severity === "High").length;
  const mediumCount = findings.filter((f) => f.severity === "Medium").length;
  const lowCount = findings.filter((f) => f.severity === "Low").length;

  const getSeverityStyle = (sev: string): React.CSSProperties => {
    switch (sev) {
      case "Critical":
        return {
          backgroundColor: "var(--sev-critical-bg)",
          color: "var(--sev-critical)",
          borderColor: "var(--sev-critical)",
        };
      case "High":
        return {
          backgroundColor: "var(--sev-high-bg)",
          color: "var(--sev-high)",
          borderColor: "var(--sev-high)",
        };
      case "Medium":
        return {
          backgroundColor: "var(--sev-medium-bg)",
          color: "var(--sev-medium)",
          borderColor: "var(--sev-medium)",
        };
      case "Low":
        return {
          backgroundColor: "var(--sev-low-bg)",
          color: "var(--sev-low)",
          borderColor: "var(--sev-low)",
        };
      default:
        return {
          backgroundColor: "var(--sev-info-bg)",
          color: "var(--sev-info)",
          borderColor: "var(--sev-info)",
        };
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    return (
      <span
        style={{
          padding: "0.15rem 0.45rem",
          borderRadius: "var(--radius-control)",
          backgroundColor: "var(--sunken)",
          color: "var(--muted)",
          fontSize: "0.6875rem",
          fontWeight: 600,
        }}
      >
        {confidence.toUpperCase()} CONFIDENCE
      </span>
    );
  };

  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      <ScanSubnav
        scanId={scan.id}
        projectId={scan.project_id}
        status={scan.status}
        ruleSetVersion={scan.rule_set_version}
        createdAt={scan.created_at}
      />

      {/* Severity Counters Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          className="card"
          style={{
            padding: "0.875rem",
            backgroundColor: "var(--surface)",
            cursor: "pointer",
            border: selectedSeverity === "ALL" ? "2px solid var(--accent)" : "1px solid var(--line)",
          }}
          onClick={() => setSelectedSeverity("ALL")}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Total Findings</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.25rem" }}>
            {findings.length}
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "0.875rem",
            backgroundColor: "var(--surface)",
            cursor: "pointer",
            border: selectedSeverity === "Critical" ? "2px solid var(--sev-critical)" : "1px solid var(--line)",
          }}
          onClick={() => setSelectedSeverity(selectedSeverity === "Critical" ? "ALL" : "Critical")}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--sev-critical)", fontWeight: 600 }}>
            Critical
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--sev-critical)" }}>
            {criticalCount}
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "0.875rem",
            backgroundColor: "var(--surface)",
            cursor: "pointer",
            border: selectedSeverity === "High" ? "2px solid var(--sev-high)" : "1px solid var(--line)",
          }}
          onClick={() => setSelectedSeverity(selectedSeverity === "High" ? "ALL" : "High")}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--sev-high)", fontWeight: 600 }}>
            High
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--sev-high)" }}>
            {highCount}
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "0.875rem",
            backgroundColor: "var(--surface)",
            cursor: "pointer",
            border: selectedSeverity === "Medium" ? "2px solid var(--sev-medium)" : "1px solid var(--line)",
          }}
          onClick={() => setSelectedSeverity(selectedSeverity === "Medium" ? "ALL" : "Medium")}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--sev-medium)", fontWeight: 600 }}>
            Medium
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--sev-medium)" }}>
            {mediumCount}
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: "0.875rem",
            backgroundColor: "var(--surface)",
            cursor: "pointer",
            border: selectedSeverity === "Low" ? "2px solid var(--sev-low)" : "1px solid var(--line)",
          }}
          onClick={() => setSelectedSeverity(selectedSeverity === "Low" ? "ALL" : "Low")}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--sev-low)", fontWeight: 600 }}>
            Low
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: "0.25rem", color: "var(--sev-low)" }}>
            {lowCount}
          </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div
        className="card"
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, minWidth: "220px" }}>
          <input
            type="text"
            className="input"
            placeholder="Search findings by title, file, or explanation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", fontSize: "0.875rem" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>Severity:</label>
          <select
            className="input"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            style={{ fontSize: "0.8125rem", padding: "0.4rem 0.6rem" }}
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>Vulnerability Class:</label>
          <select
            className="input"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ fontSize: "0.8125rem", padding: "0.4rem 0.6rem" }}
          >
            <option value="ALL">All Classes</option>
            <option value="V01">V01 - Missing Authentication</option>
            <option value="V05">V05 - Hardcoded Secrets</option>
            <option value="V06">V06 - Token Misuse</option>
            <option value="V07">V07 - Weak Credentials</option>
            <option value="V08">V08 - SQL Injection</option>
            <option value="V10">V10 - Permissive CORS</option>
            <option value="V13">V13 - Debug Mode</option>
          </select>
        </div>
      </div>

      {/* Findings list */}
      {filteredFindings.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "3.5rem 1.5rem",
            backgroundColor: "var(--surface)",
          }}
        >
          {findings.length === 0 ? (
            <div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--status-fixed-bg)",
                  color: "var(--status-fixed)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                &#10003;
              </div>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "0.25rem" }}>
                Zero Vulnerabilities Detected
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
                Static analysis found no known access-control flaws or hardcoded secrets in this codebase snapshot.
              </p>
            </div>
          ) : (
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.875rem" }}>
              No findings match your active filter criteria.
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredFindings.map((f) => {
            const classTitle = CLASS_DESCRIPTIONS[f.vulnerability_class] || f.vulnerability_class;

            return (
              <div
                key={f.id}
                className="card"
                style={{
                  padding: "1.5rem",
                  borderLeft: `4px solid ${getSeverityStyle(f.severity).color}`,
                }}
              >
                {/* Header: Class + Severity + Title */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.35rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          padding: "0.15rem 0.45rem",
                          borderRadius: "var(--radius-control)",
                          backgroundColor: "var(--sunken)",
                          color: "var(--text)",
                          fontSize: "0.75rem",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                        }}
                      >
                        {f.vulnerability_class}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--muted)",
                        }}
                      >
                        {classTitle}
                      </span>
                      {getConfidenceBadge(f.confidence)}
                      {f.is_ai_assisted && (
                        <span
                          style={{
                            padding: "0.15rem 0.45rem",
                            borderRadius: "var(--radius-control)",
                            backgroundColor: "var(--accent-tint)",
                            color: "var(--accent)",
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                          }}
                        >
                          AI-REVIEWED
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "1.0625rem", margin: 0, fontWeight: 600 }}>
                      {f.title}
                    </h3>
                  </div>

                  <span
                    style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: "var(--radius-control)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      border: "1px solid",
                      ...getSeverityStyle(f.severity),
                    }}
                  >
                    {f.severity.toUpperCase()}
                  </span>
                </div>

                {/* Location indicator */}
                <div
                  style={{
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--muted)",
                    marginBottom: "1rem",
                    padding: "0.35rem 0.6rem",
                    backgroundColor: "var(--sunken)",
                    borderRadius: "var(--radius-control)",
                    display: "inline-block",
                  }}
                >
                  {f.route_method && f.route_path ? (
                    <span>
                      {f.route_method} {f.route_path}
                      {f.file_path ? ` · ${f.file_path}` : ""}
                    </span>
                  ) : f.file_path ? (
                    <span>
                      {f.file_path}
                      {f.start_line ? `:${f.start_line}` : ""}
                    </span>
                  ) : (
                    "Global Configuration"
                  )}
                </div>

                {/* Plain-Language Explanation */}
                <div style={{ marginBottom: "1rem" }}>
                  <h4
                    style={{
                      fontSize: "0.8125rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--muted)",
                      margin: "0 0 0.35rem 0",
                    }}
                  >
                    Explanation
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      margin: 0,
                      color: "var(--text)",
                    }}
                  >
                    {f.plain_language_explanation}
                  </p>
                </div>

                {/* Code Snippet Box (if present) */}
                {f.snippet && (
                  <div style={{ marginBottom: "1rem" }}>
                    <h4
                      style={{
                        fontSize: "0.8125rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--muted)",
                        margin: "0 0 0.35rem 0",
                      }}
                    >
                      Code Snippet ({f.file_path}:{f.start_line})
                    </h4>
                    <pre
                      style={{
                        backgroundColor: "#11141A",
                        color: "#E5E9F0",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-control)",
                        fontSize: "0.8125rem",
                        fontFamily: "var(--font-mono)",
                        overflowX: "auto",
                        margin: 0,
                        border: "1px solid var(--line-strong)",
                      }}
                    >
                      <code>{f.snippet}</code>
                    </pre>
                  </div>
                )}

                {/* Remediation Advice */}
                <div
                  style={{
                    backgroundColor: "var(--surface)",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-control)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.8125rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--accent)",
                      margin: "0 0 0.25rem 0",
                      fontWeight: 600,
                    }}
                  >
                    Remediation Advice
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      margin: 0,
                      color: "var(--text-2)",
                    }}
                  >
                    {f.remediation_advice}
                  </p>
                </div>

                {/* Footer metadata: Fingerprint */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.875rem",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                  }}
                >
                  <span>
                    Fingerprint: <code style={{ fontFamily: "var(--font-mono)" }}>{f.fingerprint}</code>
                  </span>
                  <span>Status: <strong>{f.status.toUpperCase()}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
