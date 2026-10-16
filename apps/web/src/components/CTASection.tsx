import React from "react";
import Link from "next/link";
import { Container } from "./Container";

interface CTASectionProps {
  title?: string;
  lead?: string;
}

export function CTASection({
  title = "Check your app before your users do.",
  lead = "KAIRO scans your code, runs your routes in an isolated sandbox, and delivers proof-backed access-control findings.",
}: CTASectionProps) {
  return (
    <section className="section section-inverted" style={{ position: "relative", overflow: "hidden" }}>
      {/* Decorative Chamfered Tile Outline at Right */}
      <svg
        aria-hidden="true"
        width="280"
        height="280"
        viewBox="0 0 280 280"
        fill="none"
        style={{
          position: "absolute",
          right: "-40px",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      >
        <path
          d="M 60 10 L 260 10 L 270 20 L 270 260 L 260 270 L 20 270 L 10 260 L 10 60 Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M 90 40 L 230 40 L 240 50 L 240 230 L 230 240 L 50 240 L 40 230 L 40 90 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      <Container style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "760px" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              opacity: 0.85,
              marginBottom: "32px",
            }}
          >
            {lead}
          </p>
          <div>
            <Link
              href="/sign-in"
              className="btn btn-primary"
              style={{
                height: "48px",
                padding: "0 24px",
                fontSize: "15px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Continue with GitHub</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
