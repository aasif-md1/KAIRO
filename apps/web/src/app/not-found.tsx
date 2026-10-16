import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Page not found: KAIRO",
};

export default function NotFound() {
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
            <div className="eyebrow" style={{ marginBottom: "12px" }}>
              Error 404 (E-01)
            </div>
            <h1 className="section-h2" style={{ margin: "0 0 16px" }}>
              Page not found
            </h1>
            <p className="body-p" style={{ margin: "0 0 32px" }}>
              The page you requested does not exist or may have been moved.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/" className="btn btn-primary" id="notfound-btn-home">
                Return to home
              </Link>
              <Link href="/contact" className="btn btn-secondary" id="notfound-btn-contact">
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
