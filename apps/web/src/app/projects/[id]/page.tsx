"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [attested, setAttested] = useState(false);
  const [startingScan, setStartingScan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const loadData = () => {
    Promise.all([
      fetch(`${apiBase}/projects/${projectId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${apiBase}/projects/${projectId}/scans`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([pData, sData]) => {
        setProject(pData);
        setAttested(pData.is_attested);
        setScans(Array.isArray(sData) ? sData : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleAttest = async () => {
    setError(null);
    try {
      const res = await fetch(`${apiBase}/projects/${projectId}/attestation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          terms_text: "I confirm that I own this code or have explicit authorization to perform security testing.",
        }),
      });
      if (!res.ok) throw new Error("Failed to record attestation.");
      setAttested(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStartScan = async () => {
    if (!attested) return;
    setStartingScan(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/projects/${projectId}/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ layers: ["static", "dynamic"] }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to start scan.");
      }

      const scan = await res.json();
      router.push(`/scans/${scan.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setStartingScan(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: "4rem 1.5rem" }}>Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem" }}>
        <h1>Project Not Found</h1>
        <Link href="/projects">← Back to projects</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/projects" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>
          ← Back to projects
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "0.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{project.name}</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              {project.repo_full_name || "ZIP archive"} · {project.default_branch}
            </p>
          </div>
          {attested ? (
            <button
              onClick={handleStartScan}
              disabled={startingScan}
              className="btn btn-primary"
            >
              {startingScan ? "Starting..." : "Start Scan"}
            </button>
          ) : (
            <button onClick={handleAttest} className="btn btn-secondary">
              Confirm Authorization to Scan
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "var(--sev-critical-bg)",
            color: "var(--sev-critical)",
            borderRadius: "var(--radius-control)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {!attested && (
        <div className="card" style={{ marginBottom: "2rem", borderColor: "var(--line-strong)" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Authorization Confirmation Required</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Before running security scans against this codebase, please confirm that you have explicit permission
            to audit this application.
          </p>
          <button onClick={handleAttest} className="btn btn-primary" style={{ fontSize: "0.875rem" }}>
            I confirm I am authorized to test this application
          </button>
        </div>
      )}

      {/* Scans list */}
      <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Scan History</h2>
      {scans.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--muted)", fontSize: "0.875rem" }}>
          No scans run yet. Click "Start Scan" to run your first access-control audit.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {scans.map((s) => (
            <Link
              key={s.id}
              href={`/scans/${s.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.25rem",
                  transition: "border-color 0.15s ease",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Scan {s.id.slice(0, 10)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    Status: <strong>{s.status}</strong> · {new Date(s.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="badge-severity badge-info">
                    {s.status.toUpperCase()}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
