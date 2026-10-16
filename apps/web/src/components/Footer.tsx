import React from "react";
import Link from "next/link";
import { Container } from "./Container";
import { BrandLogo } from "./BrandLogo";
import { AppearanceControl } from "./AppearanceControl";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: "1px solid var(--line)",
        backgroundColor: "var(--bg)",
        marginTop: "auto",
      }}
    >
      <Container
        style={{
          paddingTop: "64px",
          paddingBottom: "32px",
        }}
      >
        {/* Top Band: Brand lockup, 1-sentence product summary, Continue with GitHub link */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            paddingBottom: "48px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div style={{ maxWidth: "480px" }}>
            <Link href="/" aria-label="KAIRO Home" style={{ textDecoration: "none" }}>
              <BrandLogo variant="footer" height={36} />
            </Link>
            <p
              style={{
                marginTop: "16px",
                color: "var(--muted)",
                fontSize: "14px",
                lineHeight: "22px",
              }}
            >
              Access-control and secret-handling audit platform for AI-built web applications.
            </p>
          </div>

          <div>
            <Link
              href="/sign-in"
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                fontSize: "14px",
                padding: "8px 16px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Continue with GitHub</span>
            </Link>
          </div>
        </div>

        {/* Four Column Link Grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px",
            padding: "48px 0",
            borderBottom: "1px solid var(--line)",
          }}
        >
          {/* Column 1: Product */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--text)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Product
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link href="/how-it-works" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/coverage" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Coverage
                </Link>
              </li>
              <li>
                <Link href="/security" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Security
                </Link>
              </li>
              <li>
                <Link href="/sign-in" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--text)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Company
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link href="/about" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--text)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Legal
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/licenses" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Licenses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "var(--text)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Trust
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link href="/security#disclosure" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  Security disclosure
                </Link>
              </li>
              <li>
                <Link href="/security#security-txt" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "14px" }}>
                  security.txt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, version, appearance control, release status note */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            paddingTop: "24px",
            fontSize: "13px",
            color: "var(--muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <span>© 2026 KAIRO.</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-2)" }}>Release 1 in development.</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>v0.1.0</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>Theme</span>
            <AppearanceControl id="footer-appearance-control" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
