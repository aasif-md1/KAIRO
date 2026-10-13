import React from "react";
import Link from "next/link";

export default function SignInPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "480px" }}>
      <div className="card" style={{ textAlign: "center", padding: "2.5rem 2rem" }}>
        {/* Chamfered logo tile */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <img
            src="/tile-emerald.png"
            alt="KAIRO"
            style={{ width: "48px", height: "48px" }}
          />
        </div>

        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Sign in to KAIRO</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          Connect your GitHub account to import repositories and audit access control logic.
        </p>

        <a
          href={`${apiBase}/auth/github/start`}
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", marginBottom: "1.5rem" }}
        >
          Continue with GitHub
        </a>

        <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.5 }}>
          By signing in, you agree to our{" "}
          <Link href="/terms" style={{ color: "var(--text-2)" }}>
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" style={{ color: "var(--text-2)" }}>
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
