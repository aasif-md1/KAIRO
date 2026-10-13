"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ScanSubnavProps {
  scanId: string;
  projectId?: string;
  status: string;
  ruleSetVersion?: string;
  createdAt?: string;
}

export function ScanSubnav({
  scanId,
  projectId,
  status,
  ruleSetVersion,
  createdAt,
}: ScanSubnavProps) {
  const pathname = usePathname();

  const isProgress = pathname === `/scans/${scanId}`;
  const isRoutes = pathname === `/scans/${scanId}/routes`;
  const isFindings = pathname === `/scans/${scanId}/findings`;

  const getStatusBadge = () => {
    switch (status) {
      case "running":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
                display: "inline-block",
                boxShadow: "0 0 0 2px var(--accent-tint)",
              }}
            />
            RUNNING (LIVE)
          </span>
        );
      case "completed":
        return (
          <span
            style={{
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--status-fixed-bg)",
              color: "var(--status-fixed)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            COMPLETED
          </span>
        );
      case "failed":
        return (
          <span
            style={{
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--sev-critical-bg)",
              color: "var(--sev-critical)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            FAILED
          </span>
        );
      case "cancelled":
        return (
          <span
            style={{
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--sev-high-bg)",
              color: "var(--sev-high)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            CANCELLED
          </span>
        );
      default:
        return (
          <span
            style={{
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--sunken)",
              color: "var(--muted)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div
      style={{
        marginBottom: "2rem",
        borderBottom: "1px solid var(--line)",
        paddingBottom: "1rem",
      }}
    >
      {/* Top breadcrumb and title bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.8125rem",
              color: "var(--muted)",
              marginBottom: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {projectId ? (
              <Link
                href={`/projects/${projectId}`}
                style={{ color: "var(--muted)", textDecoration: "none" }}
              >
                &larr; Project Details
              </Link>
            ) : (
              <Link
                href="/projects"
                style={{ color: "var(--muted)", textDecoration: "none" }}
              >
                &larr; Projects
              </Link>
            )}
            <span>/</span>
            <span>Scan {scanId.slice(0, 10)}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Scan {scanId}
            </h1>
            {getStatusBadge()}
          </div>
          {createdAt && (
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.8125rem",
                marginTop: "0.25rem",
                marginBottom: 0,
              }}
            >
              Started {new Date(createdAt).toLocaleString()} · Rule set v{ruleSetVersion || "2026.10.0"}
            </p>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <nav
        style={{
          display: "flex",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        <Link
          href={`/scans/${scanId}`}
          style={{
            padding: "0.5rem 0.875rem",
            fontSize: "0.875rem",
            fontWeight: isProgress ? 600 : 500,
            textDecoration: "none",
            borderRadius: "var(--radius-control)",
            color: isProgress ? "var(--accent)" : "var(--text-2)",
            backgroundColor: isProgress ? "var(--accent-tint)" : "transparent",
            border: isProgress ? "1px solid var(--accent)" : "1px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          Scan Progress
        </Link>
        <Link
          href={`/scans/${scanId}/routes`}
          style={{
            padding: "0.5rem 0.875rem",
            fontSize: "0.875rem",
            fontWeight: isRoutes ? 600 : 500,
            textDecoration: "none",
            borderRadius: "var(--radius-control)",
            color: isRoutes ? "var(--accent)" : "var(--text-2)",
            backgroundColor: isRoutes ? "var(--accent-tint)" : "transparent",
            border: isRoutes ? "1px solid var(--accent)" : "1px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          Route Inventory
        </Link>
        <Link
          href={`/scans/${scanId}/findings`}
          style={{
            padding: "0.5rem 0.875rem",
            fontSize: "0.875rem",
            fontWeight: isFindings ? 600 : 500,
            textDecoration: "none",
            borderRadius: "var(--radius-control)",
            color: isFindings ? "var(--accent)" : "var(--text-2)",
            backgroundColor: isFindings ? "var(--accent-tint)" : "transparent",
            border: isFindings ? "1px solid var(--accent)" : "1px solid transparent",
            transition: "all 0.15s ease",
          }}
        >
          Findings &amp; Flaws
        </Link>
      </nav>
    </div>
  );
}
