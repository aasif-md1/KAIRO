"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 0",
      }}
    >
      <Container>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="card"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "40px 36px",
              textAlign: "center",
            }}
          >
            <div className="eyebrow" style={{ color: "var(--sev-high)", marginBottom: "12px" }}>
              Error 500 (E-02)
            </div>
            <h1 className="section-h2" style={{ margin: "0 0 16px" }}>
              Application error
            </h1>
            <p className="body-p" style={{ margin: "0 0 32px" }}>
              An unexpected error occurred while processing your request. Our team has been notified.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => reset()}
                className="btn btn-primary"
                id="error-btn-retry"
              >
                Try again
              </button>
              <Link href="/" className="btn btn-secondary" id="error-btn-home">
                Return to home
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
