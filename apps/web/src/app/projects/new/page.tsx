"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"github" | "zip">("github");
  const [name, setName] = useState("");
  const [repoFullName, setRepoFullName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleCreateGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !repoFullName) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          repo_full_name: repoFullName,
          source_type: "github",
          default_branch: "main",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to connect project.");
      }

      const proj = await res.json();
      router.push(`/projects/${proj.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadZip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Create project
      const res = await fetch(`${apiBase}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          source_type: "archive",
          default_branch: "main",
        }),
      });

      if (!res.ok) throw new Error("Failed to create project container.");
      const proj = await res.json();

      // 2. Upload ZIP
      const formData = new FormData();
      formData.append("file", file);

      const upRes = await fetch(`${apiBase}/projects/${proj.id}/archive`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!upRes.ok) {
        const upData = await upRes.json();
        throw new Error(upData.detail || "Failed to extract ZIP archive.");
      }

      router.push(`/projects/${proj.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "3rem 1.5rem", maxWidth: "600px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/projects" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>
          ← Back to projects
        </Link>
        <h1 style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>Connect Application</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--line)" }}>
        <button
          type="button"
          onClick={() => setTab("github")}
          style={{
            padding: "0.5rem 1rem",
            background: "none",
            border: "none",
            borderBottom: tab === "github" ? "2px solid var(--accent)" : "2px solid transparent",
            color: tab === "github" ? "var(--accent-text)" : "var(--muted)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          GitHub Repository
        </button>
        <button
          type="button"
          onClick={() => setTab("zip")}
          style={{
            padding: "0.5rem 1rem",
            background: "none",
            border: "none",
            borderBottom: tab === "zip" ? "2px solid var(--accent)" : "2px solid transparent",
            color: tab === "zip" ? "var(--accent-text)" : "var(--muted)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Upload ZIP Archive
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "var(--sev-critical-bg)",
            color: "var(--sev-critical)",
            borderRadius: "var(--radius-control)",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {tab === "github" ? (
        <form onSubmit={handleCreateGitHub} className="card">
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Project Name
            </label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. my-vibe-app"
              required
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              GitHub Repository (owner/repo)
            </label>
            <input
              type="text"
              className="input"
              value={repoFullName}
              onChange={(e) => setRepoFullName(e.target.value)}
              placeholder="e.g. octocat/sample-vibe-app"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
            {loading ? "Connecting..." : "Connect Repository"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleUploadZip} className="card">
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Project Name
            </label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. offline-vibe-app"
              required
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              ZIP File (Max 50 MB)
            </label>
            <input
              type="file"
              accept=".zip"
              className="input"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              Safely extracted without symlinks or binary executables.
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
            {loading ? "Uploading and Extracting..." : "Upload and Create Project"}
          </button>
        </form>
      )}
    </div>
  );
}
