import React, { Suspense } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Sign in to KAIRO",
  description: "Connect your GitHub account to access KAIRO security audits.",
};

function SignInContent({ error }: { error?: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const getErrorMessage = (errCode?: string) => {
    switch (errCode) {
      case "E-04":
        return "Authentication declined: GitHub authorization was cancelled or denied.";
      case "E-05":
        return "Session expired: Your GitHub authorization token has expired. Please sign in again.";
      case "E-06":
        return "Authentication failure: An error occurred communicating with GitHub.";
      default:
        return null;
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 72px - 160px)", paddingTop: "64px", paddingBottom: "96px" }}>
      <Container>
        {/* Header aligned to container left edge */}
        <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
          <div className="eyebrow" style={{ marginBottom: "12px" }}>
            Account access
          </div>
          <h1 className="hero-h1" style={{ margin: "0 0 16px" }}>
            Sign in to KAIRO
          </h1>
          <p className="lead-p" style={{ margin: 0 }}>
            Connect your GitHub account to access your repositories, run deep logic audits, and inspect verified vulnerability reports.
          </p>
        </div>

        {/* 50/50 Split Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "32px",
            alignItems: "stretch",
          }}
        >
          {/* Left: Inverted Panel with Lockup, Facts, and Live Report Visual */}
          <div
            className="section-inverted"
            style={{
              padding: "40px",
              borderRadius: "var(--radius-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid var(--line)",
            }}
          >
            <div>
              <div style={{ marginBottom: "20px" }}>
                <BrandLogo width={150} height={30} />
              </div>
              <p style={{ fontSize: "17px", lineHeight: "26px", opacity: 0.9, margin: "0 0 28px" }}>
                Independent access-control security audit pipeline for modern web applications.
              </p>

              {/* Three Plain Facts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "14px", lineHeight: "20px" }}>
                  <span className="inverted-accent" style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>01</span>
                  <span>Read-only repository access authorized per project</span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "14px", lineHeight: "20px" }}>
                  <span className="inverted-accent" style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>02</span>
                  <span>Zero customer code used for model training</span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "14px", lineHeight: "20px" }}>
                  <span className="inverted-accent" style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>03</span>
                  <span>Isolated gVisor sandbox testing with blocked network egress</span>
                </div>
              </div>
            </div>

            {/* Small Live Report Visual */}
            <div
              style={{
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--line)",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                overflow: "hidden",
                fontSize: "12px",
              }}
              aria-hidden="true"
            >
              {/* Window Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--line)",
                  backgroundColor: "var(--sunken)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--muted)",
                }}
              >
                <span>app.kairo.dev/reports/scn_98b2c4</span>
                <span style={{ color: "var(--accent-text)" }}>Report ready</span>
              </div>

              {/* Report Header */}
              <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>acme-storefront-api</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>branch: main • commit: 8f2a1b9</div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ padding: "2px 6px", borderRadius: "var(--radius-label)", fontSize: "11px", fontWeight: 600, backgroundColor: "var(--sev-high-bg)", color: "var(--sev-high)" }}>1 High</span>
                  <span style={{ padding: "2px 6px", borderRadius: "var(--radius-label)", fontSize: "11px", fontWeight: 600, backgroundColor: "var(--sev-med-bg)", color: "var(--sev-med)" }}>2 Medium</span>
                </div>
              </div>

              {/* Finding items */}
              <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ padding: "8px 10px", borderRadius: "var(--radius-control)", backgroundColor: "var(--surface)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--sev-high)", fontWeight: 600 }}>KAIRO-001</div>
                    <div style={{ fontSize: "12px", fontWeight: 500 }}>Missing tenant isolation on orders</div>
                  </div>
                  <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: "var(--radius-label)", backgroundColor: "var(--accent-subtle)", color: "var(--accent-text)", border: "1px solid var(--accent)" }}>Confirmed</span>
                </div>
                <div style={{ padding: "8px 10px", borderRadius: "var(--radius-control)", backgroundColor: "var(--surface)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--sev-med)", fontWeight: 600 }}>KAIRO-004</div>
                    <div style={{ fontSize: "12px", fontWeight: 500 }}>In-memory token leak in error responses</div>
                  </div>
                  <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: "var(--radius-label)", backgroundColor: "var(--accent-subtle)", color: "var(--accent-text)", border: "1px solid var(--accent)" }}>Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sign-in Card */}
          <div
            style={{
              padding: "48px 40px",
              backgroundColor: "var(--surface)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Error Banner */}
            {errorMessage && (
              <div
                style={{
                  backgroundColor: "var(--sev-high-bg)",
                  border: "1px solid var(--sev-high)",
                  borderRadius: "var(--radius-card)",
                  padding: "12px 16px",
                  marginBottom: "24px",
                  fontSize: "13px",
                  color: "var(--sev-high)",
                  lineHeight: "18px",
                }}
              >
                <strong>{error}:</strong> {errorMessage}
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <div className="eyebrow" style={{ marginBottom: "8px" }}>
                Authentication
              </div>
              <h2 className="section-h2" style={{ margin: "0 0 12px" }}>
                Continue with GitHub
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: "24px", margin: 0 }}>
                KAIRO uses OAuth authorization to manage your repositories and audit schedules.
              </p>
            </div>

            <a
              href={`${apiBase}/auth/github/start`}
              className="btn btn-primary"
              style={{
                width: "100%",
                height: "48px",
                fontSize: "15px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
              id="signin-btn-github"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              Continue with GitHub
            </a>

            <div
              style={{
                fontSize: "13px",
                color: "var(--text-2)",
                lineHeight: "20px",
                backgroundColor: "var(--sunken)",
                padding: "16px",
                borderRadius: "var(--radius-control)",
                border: "1px solid var(--line)",
                marginBottom: "24px",
              }}
            >
              <strong>Permission scope:</strong> KAIRO asks GitHub for your identity only. Repository access is a separate step that you control explicitly when registering a scan target.
            </div>

            <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "20px" }}>
              By signing in, you agree to our{" "}
              <Link href="/terms" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
                Privacy Policy
              </Link>.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default async function SignInPage(props: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  return (
    <Suspense fallback={<div style={{ padding: "48px", textAlign: "center" }}>Loading...</div>}>
      <SignInContent error={searchParams?.error} />
    </Suspense>
  );
}
