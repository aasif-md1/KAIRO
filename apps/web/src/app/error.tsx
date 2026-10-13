"use client";

import React from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container" style={{ padding: "6rem 1.5rem", textAlign: "center", maxWidth: "500px" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--sev-critical)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Error
      </div>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>An Error Occurred</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "2rem", lineHeight: 1.6 }}>
        {error.message || "An unexpected system error occurred while processing this request."}
      </p>
      <button onClick={() => reset()} className="btn btn-primary">
        Try Again
      </button>
    </div>
  );
}
