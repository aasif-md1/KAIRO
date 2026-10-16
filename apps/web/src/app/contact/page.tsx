import React from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ContactCard } from "@/components/ContactCard";

export const metadata = {
  title: "Contact & Communication Channels: KAIRO",
  description:
    "Direct contact addresses for technical support, privacy requests, security disclosure, and platform abuse reports.",
};

export default function ContactPage() {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div style={{ position: "relative" }}>
      <section className="section section-bg">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 5 Columns */}
            <div className="col-5">
              <span className="eyebrow">Communication channels</span>
              <h1 className="hero-h1" style={{ fontSize: "clamp(36px, 4vw, 52px)", marginBottom: "16px" }}>
                Contact the team
              </h1>
              <p className="lead-p" style={{ marginBottom: "32px" }}>
                KAIRO sends no automated marketing emails. Reach out directly to our operational inboxes using the verified addresses on this page.
              </p>

              {/* Before you write list */}
              <div
                style={{
                  padding: "24px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "12px" }}>
                  Before you write:
                </div>
                <ul
                  style={{
                    paddingLeft: "18px",
                    margin: 0,
                    fontSize: "14px",
                    color: "var(--text-2)",
                    lineHeight: "1.7",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <li>
                    <strong>Check documentation:</strong> For questions regarding AST parsing or sandbox mechanics, consult the{" "}
                    <Link href="/how-it-works" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
                      walkthrough
                    </Link>{" "}
                    or{" "}
                    <Link href="/coverage" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
                      coverage catalog
                    </Link>.
                  </li>
                  <li>
                    <strong>Security disclosures:</strong> Please review our{" "}
                    <Link href="/security" style={{ color: "var(--accent-text)", textDecoration: "underline" }}>
                      responsible disclosure policy
                    </Link>{" "}
                    prior to transmitting vulnerability details.
                  </li>
                  <li>
                    <strong>Include reproduction steps:</strong> State your framework, error trace, and scan identifier where applicable.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right 7 Columns: 2x2 Grid of Equal Cards (No Orphan Card) */}
            <div className="col-7">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                }}
              >
                {/* Inbox 1 */}
                <ContactCard
                  title="Technical Support & Bugs"
                  email={process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@kairo.example"}
                  isExampleDomain={isDev}
                  targetResponse="2 business days"
                  checklist={[
                    "Framework & version (e.g. Express 4.19)",
                    "Scan ID (e.g. scn_98b2c4)",
                    "Observed vs expected outcome",
                  ]}
                />

                {/* Inbox 2 */}
                <ContactCard
                  title="Privacy & Data Subject Rights"
                  email={process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "privacy@kairo.example"}
                  isExampleDomain={isDev}
                  targetResponse="5 business days"
                  checklist={[
                    "Registered GitHub username",
                    "Specific right requested (access/erasure)",
                    "Project identifiers or scan timestamps",
                  ]}
                />

                {/* Inbox 3 */}
                <ContactCard
                  title="Security Vulnerability Reports"
                  email={process.env.NEXT_PUBLIC_SECURITY_EMAIL || "security@kairo.example"}
                  isExampleDomain={isDev}
                  targetResponse="48 hours"
                  checklist={[
                    "Vulnerability summary & impacted zone",
                    "Step-by-step reproduction curl script",
                    "Public key if encrypted reply requested",
                  ]}
                />

                {/* Inbox 4 */}
                <ContactCard
                  title="Abuse & Unauthorized Scans"
                  email={process.env.NEXT_PUBLIC_ABUSE_EMAIL || "abuse@kairo.example"}
                  isExampleDomain={isDev}
                  targetResponse="24 hours"
                  checklist={[
                    "Target repository URL",
                    "Proof of repository ownership",
                    "Evidence of unauthorized audit execution",
                  ]}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
