"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WelcomePage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    setError(null);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const res = await fetch(`${apiBase}/me/terms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          terms_version: "2026-10-10",
          terms_text: "KAIRO Terms and Conditions v0.1 accepted by user.",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to record terms acceptance.");
      }

      router.push("/projects");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "600px" }}>
      <div className="card" style={{ padding: "2.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Welcome to KAIRO</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Before proceeding, please review and accept our operating terms and privacy policy.
        </p>

        <div
          style={{
            backgroundColor: "var(--sunken)",
            padding: "1rem",
            borderRadius: "var(--radius-control)",
            fontSize: "0.875rem",
            color: "var(--text-2)",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ marginBottom: "0.75rem" }}>
            <strong>1. Authorization:</strong> You agree to scan only codebases you own or have explicit
            permission to test.
          </p>
          <p style={{ marginBottom: "0.75rem" }}>
            <strong>2. Privacy:</strong> Source snapshots are stored encrypted and permanently deleted
            within 24 hours of scan completion.
          </p>
          <p>
            <strong>3. Limitations:</strong> KAIRO findings represent automated observations and logic reviews.
            A clean report does not guarantee complete security.
          </p>
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

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: "3px" }}
            />
            <span>
              I have read and agree to the{" "}
              <Link href="/terms" target="_blank">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed || loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.75rem", opacity: agreed ? 1 : 0.6 }}
          >
            {loading ? "Recording acceptance..." : "Continue to Projects"}
          </button>
        </form>
      </div>
    </div>
  );
}
