import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "6rem 1.5rem", textAlign: "center", maxWidth: "500px" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Error 404
      </div>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Page Not Found</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "2rem", lineHeight: 1.6 }}>
        The requested resource or page does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}
