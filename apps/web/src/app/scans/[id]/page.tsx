"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ScanSubnav } from "@/components/ScanSubnav";

interface StageItem {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

interface ScanData {
  id: string;
  project_id: string;
  status: "running" | "completed" | "failed" | "cancelled" | "queued";
  commit_hash: string;
  rule_set_version: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  stages: StageItem[];
}

const STAGE_DESCRIPTIONS: Record<string, { label: string; desc: string }> = {
  prepare: {
    label: "Prepare",
    desc: "Archive extraction, size validation, and snapshot staging.",
  },
  static: {
    label: "Static Analysis",
    desc: "Tree-sitter AST parsing, route inventory extraction, and vulnerability rule execution.",
  },
  logic: {
    label: "Logic Review",
    desc: "AI-assisted business logic analysis with automated redaction.",
  },
  dynamic: {
    label: "Dynamic Testing",
    desc: "Ephemeral sandbox execution and active authorization test harness.",
  },
  merge: {
    label: "Merge and Rate",
    desc: "Evidence synthesis, duplicate resolution, and severity rubric rating.",
  },
  report: {
    label: "Report Generation",
    desc: "SARIF export, audit records, and executive summary compilation.",
  },
};

export default function ScanProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const scanId = resolvedParams.id;

  const [scan, setScan] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stopping, setStopping] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchScan = async () => {
    try {
      const res = await fetch(`${apiBase}/scans/${scanId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error("Scan not found.");
        throw new Error("Failed to load scan details.");
      }
      const data = await res.json();
      setScan(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScan();
    // Live polling every 2.5s while scan is running
    const timer = setInterval(() => {
      if (scan?.status === "running" || scan?.status === "queued" || !scan) {
        fetchScan();
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [scanId, scan?.status]);

  const handleStopScan = async () => {
    setStopping(true);
    try {
      const res = await fetch(`${apiBase}/scans/${scanId}/cancel`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to cancel scan.");
      setShowCancelDialog(false);
      await fetchScan();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setStopping(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <p style={{ color: "var(--muted)" }}>Loading scan progress...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Error Loading Scan</h1>
        <p style={{ color: "var(--danger)", marginBottom: "1.5rem" }}>{error || "Scan not found."}</p>
        <Link href="/projects" className="btn btn-secondary" style={{ fontSize: "0.875rem" }}>
          &larr; Back to projects
        </Link>
      </div>
    );
  }

  const getStageBadge = (stageStatus: string) => {
    switch (stageStatus) {
      case "completed":
        return (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--status-fixed-bg)",
              color: "var(--status-fixed)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Completed
          </span>
        );
      case "running":
        return (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            In Progress
          </span>
        );
      case "failed":
        return (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--sev-critical-bg)",
              color: "var(--sev-critical)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Failed
          </span>
        );
      case "skipped":
        return (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--sunken)",
              color: "var(--muted)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Skipped
          </span>
        );
      default:
        return (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--sunken)",
              color: "var(--muted)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Pending
          </span>
        );
    }
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

      {/* Action / Stop Scan Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 600 }}>
            Analysis Stage Pipeline
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
            Each analysis layer executes with isolated boundaries and fail-closed security gates.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          {scan.status === "running" && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="btn btn-secondary"
              style={{
                borderColor: "var(--danger)",
                color: "var(--danger)",
                fontSize: "0.8125rem",
              }}
            >
              Stop Scan
            </button>
          )}

          <Link
            href={`/scans/${scan.id}/routes`}
            className="btn btn-primary"
            style={{ fontSize: "0.8125rem" }}
          >
            View Route Inventory &rarr;
          </Link>
          <Link
            href={`/scans/${scan.id}/findings`}
            className="btn btn-secondary"
            style={{ fontSize: "0.8125rem" }}
          >
            View Findings &rarr;
          </Link>
        </div>
      </div>

      {/* Confirmation Dialog for Stop Scan (D-02) */}
      {showCancelDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: "480px",
              width: "100%",
              backgroundColor: "var(--surface)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", marginTop: 0 }}>Stop this scan?</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.5 }}>
              Stopping a running scan will terminate active sandbox runners and static engine workers.
              Partial route inventory records are preserved, but dynamic testing will halt.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                onClick={() => setShowCancelDialog(false)}
                className="btn btn-secondary"
                disabled={stopping}
                style={{ fontSize: "0.875rem" }}
              >
                Continue Scan
              </button>
              <button
                onClick={handleStopScan}
                className="btn btn-primary"
                disabled={stopping}
                style={{
                  backgroundColor: "var(--danger)",
                  borderColor: "var(--danger)",
                  fontSize: "0.875rem",
                }}
              >
                {stopping ? "Stopping..." : "Yes, Stop Scan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stages list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {scan.stages.map((stg, idx) => {
          const info = STAGE_DESCRIPTIONS[stg.name] || {
            label: stg.name.toUpperCase(),
            desc: "Execution stage.",
          };

          return (
            <div
              key={stg.id || idx}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem",
                borderLeft:
                  stg.status === "completed"
                    ? "4px solid var(--status-fixed)"
                    : stg.status === "running"
                    ? "4px solid var(--accent)"
                    : stg.status === "failed"
                    ? "4px solid var(--sev-critical)"
                    : "4px solid var(--line)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--muted)",
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                    {info.label}
                  </span>
                </div>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.8125rem",
                    margin: 0,
                  }}
                >
                  {info.desc}
                </p>
                {stg.error_message && (
                  <p
                    style={{
                      color: "var(--danger)",
                      fontSize: "0.8125rem",
                      marginTop: "0.375rem",
                      marginBottom: 0,
                    }}
                  >
                    Error: {stg.error_message}
                  </p>
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                {getStageBadge(stg.status)}
                {stg.started_at && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      marginTop: "0.375rem",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {new Date(stg.started_at).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
