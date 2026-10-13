"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ScanSubnav } from "@/components/ScanSubnav";

interface RouteItem {
  id: string;
  method: string;
  path: string;
  handler_name: string | null;
  file_path: string | null;
  line_number: number | null;
  auth_signal: "detected" | "absent" | "unknown";
  ownership_signal: "detected" | "absent" | "unknown";
  role_signal: "detected" | "absent" | "unknown";
}

interface ScanData {
  id: string;
  project_id: string;
  status: string;
  rule_set_version: string;
  created_at: string;
}

export default function RouteInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const scanId = resolvedParams.id;

  const [scan, setScan] = useState<ScanData | null>(null);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("ALL");
  const [selectedAuth, setSelectedAuth] = useState("ALL");

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/scans/${scanId}`, { credentials: "include" }).then((r) => {
        if (!r.ok) throw new Error("Failed to load scan.");
        return r.json();
      }),
      fetch(`${apiBase}/scans/${scanId}/routes`, { credentials: "include" }).then((r) => {
        if (!r.ok) throw new Error("Failed to load routes.");
        return r.json();
      }),
    ])
      .then(([scanData, routesData]) => {
        setScan(scanData);
        setRoutes(Array.isArray(routesData) ? routesData : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [scanId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <p style={{ color: "var(--muted)" }}>Loading route inventory...</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Error Loading Routes</h1>
        <p style={{ color: "var(--danger)", marginBottom: "1.5rem" }}>{error || "Scan not found."}</p>
        <Link href={`/scans/${scanId}`} className="btn btn-secondary" style={{ fontSize: "0.875rem" }}>
          &larr; Back to scan progress
        </Link>
      </div>
    );
  }

  // Filter routes
  const filteredRoutes = routes.filter((r) => {
    if (selectedMethod !== "ALL" && r.method !== selectedMethod) return false;
    if (selectedAuth !== "ALL" && r.auth_signal !== selectedAuth) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchPath = r.path.toLowerCase().includes(q);
      const matchHandler = (r.handler_name || "").toLowerCase().includes(q);
      const matchFile = (r.file_path || "").toLowerCase().includes(q);
      if (!matchPath && !matchHandler && !matchFile) return false;
    }
    return true;
  });

  const getMethodBadgeStyle = (method: string): React.CSSProperties => {
    switch (method.toUpperCase()) {
      case "GET":
        return {
          backgroundColor: "var(--sev-low-bg)",
          color: "var(--sev-low)",
          border: "1px solid var(--sev-low)",
        };
      case "POST":
        return {
          backgroundColor: "var(--status-fixed-bg)",
          color: "var(--status-fixed)",
          border: "1px solid var(--status-fixed)",
        };
      case "PUT":
      case "PATCH":
        return {
          backgroundColor: "var(--sev-high-bg)",
          color: "var(--sev-high)",
          border: "1px solid var(--sev-high)",
        };
      case "DELETE":
        return {
          backgroundColor: "var(--sev-critical-bg)",
          color: "var(--sev-critical)",
          border: "1px solid var(--sev-critical)",
        };
      default:
        return {
          backgroundColor: "var(--sunken)",
          color: "var(--muted)",
          border: "1px solid var(--line)",
        };
    }
  };

  const getSignalBadge = (sig: "detected" | "absent" | "unknown") => {
    switch (sig) {
      case "detected":
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
            Detected
          </span>
        );
      case "absent":
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
            Absent
          </span>
        );
      case "unknown":
      default:
        return (
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--sev-medium-bg)",
              color: "var(--sev-medium)",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Unknown
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

      {/* Header and stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 600 }}>
            Route Inventory ({routes.length} endpoints)
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
            Discovered from framework AST analysis with three-valued authorization signals.
          </p>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.75rem",
            color: "var(--muted)",
            backgroundColor: "var(--surface)",
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-control)",
            border: "1px solid var(--line)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--status-fixed)" }} />
            Detected (Fail-closed)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--sev-critical)" }} />
            Absent (Unprotected)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--sev-medium)" }} />
            Unknown (Logic Review)
          </span>
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
            placeholder="Search by path, handler, or file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", fontSize: "0.875rem" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>Method:</label>
          <select
            className="input"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            style={{ fontSize: "0.8125rem", padding: "0.4rem 0.6rem" }}
          >
            <option value="ALL">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>Auth:</label>
          <select
            className="input"
            value={selectedAuth}
            onChange={(e) => setSelectedAuth(e.target.value)}
            style={{ fontSize: "0.8125rem", padding: "0.4rem 0.6rem" }}
          >
            <option value="ALL">All Signals</option>
            <option value="detected">Detected</option>
            <option value="absent">Absent</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      {/* Routes table */}
      {filteredRoutes.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--muted)",
            fontSize: "0.875rem",
          }}
        >
          {routes.length === 0
            ? "No routes discovered for this scan yet. Ensure static analysis has completed."
            : "No routes match the selected search or filter criteria."}
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: 0,
            overflowX: "auto",
            borderColor: "var(--line)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--sunken)",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Method</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Endpoint Path</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Handler Location</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Authentication</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Ownership Check</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Role Check</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((r, idx) => (
                <tr
                  key={r.id || idx}
                  style={{
                    borderBottom: idx < filteredRoutes.length - 1 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span
                      style={{
                        padding: "0.15rem 0.45rem",
                        borderRadius: "var(--radius-control)",
                        fontSize: "0.6875rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        ...getMethodBadgeStyle(r.method),
                      }}
                    >
                      {r.method}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <code
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8125rem",
                        color: "var(--text)",
                      }}
                    >
                      {r.path}
                    </code>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--muted)", fontSize: "0.8125rem" }}>
                    {r.file_path ? (
                      <span>
                        {r.file_path}
                        {r.line_number ? `:${r.line_number}` : ""}
                        {r.handler_name ? ` (${r.handler_name})` : ""}
                      </span>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>{getSignalBadge(r.auth_signal)}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{getSignalBadge(r.ownership_signal)}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{getSignalBadge(r.role_signal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
