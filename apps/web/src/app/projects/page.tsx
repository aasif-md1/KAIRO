"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  repo_full_name?: string;
  source_type: string;
  default_branch: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiBase}/projects`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Projects</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Connected repositories and uploaded archives audited with KAIRO.
          </p>
        </div>
        <Link href="/projects/new" className="btn btn-primary">
          Add Project
        </Link>
      </div>

      {loading ? (
        <div style={{ color: "var(--muted)", padding: "3rem 0", textAlign: "center" }}>
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No projects added yet</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.5rem", maxWidth: "400px", margin: "0 auto 1.5rem auto" }}>
            Connect a GitHub repository or upload a ZIP archive of your web application to get started.
          </p>
          <Link href="/projects/new" className="btn btn-primary">
            Connect a repository
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="card"
              style={{
                textDecoration: "none",
                color: "var(--text)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "border-color var(--dur-fast)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>
                  {p.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {p.repo_full_name || "ZIP archive"} · {p.default_branch} · Added {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
              <span className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                View Scans →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
