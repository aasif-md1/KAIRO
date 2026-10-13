import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - KAIRO",
  description:
    "Comprehensive Privacy Policy detailing how KAIRO collects, encrypts, and deletes your data with zero model training.",
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "860px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--line)", paddingBottom: "1.5rem" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--accent-text)",
            marginBottom: "0.5rem",
          }}
        >
          Legal &amp; Data Protection
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
          Effective Date: 10 October 2026 · Version 1.0 · Complies with DPDP Act (India) and GDPR principles
        </p>
      </div>

      {/* Main Content Sections */}
      <div style={{ color: "var(--text-2)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
        {/* Section 1 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            1. Overview and Core Privacy Commitment
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            KAIRO (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) provides an automated access-control, IDOR, and secret-handling
            audit platform for developers and engineering teams. We believe that security testing must never come
            at the expense of data privacy or software confidentiality.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            Our privacy architecture is built upon three foundational pillars:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>Zero Model Training:</strong> Your private source code, AST trees, and vulnerability findings
              are NEVER used to train, evaluate, or fine-tune public artificial intelligence models.
            </li>
            <li>
              <strong>Ephemeral Source Processing:</strong> Uploaded archives and repository checkouts are retained
              only for the duration of the scan and are permanently purged within 24 hours.
            </li>
            <li>
              <strong>Zero Advertising or Tracking Cookies:</strong> We run no third-party analytics scripts, no
              behavioral tracking pixels, and no marketing beacons.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            2. Information We Collect
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            We adhere to strict data minimization principles, collecting only information necessary to authenticate
            your account and perform security audits:
          </p>

          <h3 style={{ fontSize: "1.0625rem", color: "var(--text)", marginTop: "1rem", marginBottom: "0.5rem" }}>
            A. Account Information
          </h3>
          <p style={{ marginBottom: "1rem" }}>
            When you sign in using GitHub OAuth, we receive your unique GitHub user ID, username, public email address
            (if made public in your GitHub profile), and avatar image URL. If your GitHub profile does not share an
            email address, your account is created without one.
          </p>

          <h3 style={{ fontSize: "1.0625rem", color: "var(--text)", marginTop: "1rem", marginBottom: "0.5rem" }}>
            B. Application Source Code and Archives
          </h3>
          <p style={{ marginBottom: "1rem" }}>
            To perform static parsing and sandbox testing, we temporarily receive the source files of the repository
            or ZIP archive you submit. This code is stored in encrypted workspaces with strict access control.
          </p>

          <h3 style={{ fontSize: "1.0625rem", color: "var(--text)", marginTop: "1rem", marginBottom: "0.5rem" }}>
            C. Project Configuration and Test Credentials
          </h3>
          <p style={{ marginBottom: "1rem" }}>
            When configuring dynamic testing, you may provide start commands, environment variables, and synthetic test
            accounts. Test account credentials and environment secrets are write-only: they are encrypted immediately
            upon receipt and are never revealed back in API responses or user interfaces.
          </p>

          <h3 style={{ fontSize: "1.0625rem", color: "var(--text)", marginTop: "1rem", marginBottom: "0.5rem" }}>
            D. Audit Results and Findings Metadata
          </h3>
          <p style={{ marginBottom: "1rem" }}>
            We store the normalized vulnerability findings, route inventory records, and execution logs generated by
            your scans to render your reports and enable SARIF/PDF exports.
          </p>
        </section>

        {/* Section 3 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            3. How We Use Your Information
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            We process your information strictly for the following purposes:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>Authenticating your session and verifying project ownership.</li>
            <li>Constructing route inventories and parsing concrete syntax trees via Tree-sitter.</li>
            <li>Executing active security checks against your application inside isolated gVisor containers.</li>
            <li>Generating audit reports, SARIF exports, and executive PDF documents.</li>
            <li>Enforcing abuse limits (maximum 3 concurrent scans, 10 scans per hour).</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            4. 24-Hour Source Code Retention &amp; Automatic Erasure Policy
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            KAIRO enforces automated data lifecycle rules across all scanning nodes:
          </p>
          <div
            className="card"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--line)",
              padding: "1.25rem",
              marginBottom: "1rem",
            }}
          >
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.875rem", lineHeight: 1.6 }}>
              <li>
                <strong>Source Code Snapshots:</strong> Automatically and permanently expunged 24 hours after scan
                initiation.
              </li>
              <li>
                <strong>Sandbox Artifacts:</strong> Ephemeral containers and network bridges are destroyed immediately
                upon completion of the dynamic testing stage.
              </li>
              <li>
                <strong>Immediate Project Deletion:</strong> Deleting a project from the Settings tab triggers an
                instant cascade purge of all associated archives, route records, and findings.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            5. Encryption and Data Security (NFR-S4)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            We implement industry-grade cryptographic controls to safeguard data in transit and at rest:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>Data in Transit:</strong> All HTTP traffic is protected by Transport Layer Security (TLS 1.3)
              with strict cipher suites and HSTS enforcement.
            </li>
            <li>
              <strong>Envelope Encryption:</strong> Sensitive project configurations and credentials are encrypted
              using AES-256-GCM. Each project is assigned a unique 256-bit data encryption key (DEK) wrapped by a
              master key.
            </li>
            <li>
              <strong>Runner Credential Isolation:</strong> Test runner nodes that execute dynamic tests possess zero
              database credentials, zero storage credentials, and zero access to other customer tenants.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            6. Strictly Necessary Cookies (LR-7)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            KAIRO uses only strictly necessary first-party HTTP cookies:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <code>kairo_session</code>: Encrypted, HttpOnly, SameSite=Lax session token used solely to identify your
              authenticated session.
            </li>
            <li>
              <code>kairo_csrf</code>: Cryptographic token preventing cross-site request forgery attacks.
            </li>
          </ul>
          <p style={{ marginBottom: "1rem" }}>
            Because we use no advertising, analytical, or tracking cookies, no invasive cookie consent banner is
            displayed. If non-essential cookies are ever evaluated in the future, explicit equal accept/reject controls
            will be introduced first.
          </p>
        </section>

        {/* Section 7 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            7. Subprocessors and Third Parties
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            We do not sell, trade, or rent personal data. We utilize only minimal infrastructure subprocessors:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>GitHub API:</strong> For user authentication and retrieving authorized repository snapshots.
            </li>
            <li>
              <strong>Dedicated Virtual Machines:</strong> Dedicated Linux application and sandbox runner nodes.
            </li>
            <li>
              <strong>AI Review Providers:</strong> In Milestone 2 logic review, small redacted code blocks (with all
              secrets replaced by typed tokens like <code>&lt;SECRET_1&gt;</code>) are sent over encrypted API endpoints
              under commercial zero-data-retention terms.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            8. Your Rights and Data Control
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            Regardless of your geographic location, you possess full ownership and control over your data:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>Right to Export:</strong> Download all findings, SARIF files, and reports in machine-readable
              formats at any time.
            </li>
            <li>
              <strong>Right to Erasure:</strong> Delete any individual project or permanently delete your entire user
              account from the Account settings. All corresponding records are erased immediately.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Update your profile metadata, test accounts, and configuration
              parameters at will.
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            9. Contact Us
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            For privacy inquiries, data subject requests, or regulatory questions, please contact our Data Protection
            Lead:
          </p>
          <div
            className="card"
            style={{
              backgroundColor: "var(--surface)",
              padding: "1rem 1.25rem",
              display: "inline-block",
            }}
          >
            <div>
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@kairo.dev" style={{ color: "var(--accent)" }}>
                privacy@kairo.dev
              </a>
            </div>
            <div style={{ marginTop: "0.25rem" }}>
              <strong>Response SLA:</strong> We respond to verified data subject inquiries within 48 business hours.
            </div>
          </div>
        </section>
      </div>

      {/* Back link */}
      <div style={{ marginTop: "3rem", borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
