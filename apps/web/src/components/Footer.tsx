import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        backgroundColor: "var(--bg)",
        padding: "3rem 0 2rem 0",
        marginTop: "auto",
      }}
    >
      <div className="container" style={{ textAlign: "center" }}>
        {/* Centered Tile Lockup */}
        <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <img
            src="/footer-logo-dark.png"
            alt="KAIRO"
            className="brand-dark"
            style={{ height: "48px", width: "auto" }}
          />
          <img
            src="/footer-logo-light.png"
            alt="KAIRO"
            className="brand-light"
            style={{ height: "48px", width: "auto" }}
          />
        </div>

        {/* Five mandatory links (BR-12) */}
        <nav
          aria-label="Footer Navigation"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
            Terms and Conditions
          </Link>
          <Link href="/security" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
            Security
          </Link>
          <Link href="/contact" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
            Contact
          </Link>
          <Link href="/licenses" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
            Licenses
          </Link>
        </nav>

        {/* Copyright notice without em dash (BR-3) */}
        <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
          KAIRO. Open source and privacy first.
        </p>
      </div>
    </footer>
  );
}
