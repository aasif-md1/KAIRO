import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Security Model & Vulnerability Disclosure - KAIRO",
  description:
    "Comprehensive technical security architecture, threat model, gVisor sandboxing, envelope encryption, and vulnerability disclosure program.",
};

export default function SecurityPage() {
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
          Engineering &amp; Platform Trust
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Security Architecture &amp; Vulnerability Disclosure
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
          Defense-in-depth engineering principles, isolation controls, and responsible disclosure program.
        </p>
      </div>

      {/* Main Sections */}
      <div style={{ color: "var(--text-2)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
        {/* Section 1 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            1. Security Architecture Principles
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            Because KAIRO audits sensitive customer code and executes untrusted application artifacts in dynamic testing,
            our own platform architecture is built around defense-in-depth and the principle of least privilege.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            We operate under five non-negotiable architectural mandates:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>Zero Runner Credentials:</strong> Worker and sandbox runner nodes possess zero database
              credentials, zero cloud access keys, and zero object-storage tokens.
            </li>
            <li>
              <strong>Virtualization-Level Sandbox Isolation:</strong> Scanned user applications are built and executed
              within hardened gVisor micro-containers with user-space kernel interception.
            </li>
            <li>
              <strong>Fail-Closed Static Signals:</strong> Named auth functions without proven behavior yield &quot;unknown&quot;
              signals rather than false clean verdicts.
            </li>
            <li>
              <strong>Masked Secret Retention:</strong> Raw passwords and tokens discovered in source code are never
              stored in finding databases.
            </li>
            <li>
              <strong>Immediate 404 on Cross-Tenant Access:</strong> Any attempt to reference a project, scan, or finding
              belonging to another user returns an indistinguishable HTTP 404, preventing object enumeration.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            2. Sandbox Isolation &amp; Sandboxed Runtimes (gVisor)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            Dynamic testing builds and runs customer applications inside unprivileged containers managed by the gVisor
            runtime (<code>runsc</code>). gVisor intercepts all system calls in a sandboxed user-space kernel written in
            Go, completely shielding the host Linux kernel from potential container breakout vulnerabilities.
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
            <h3 style={{ fontSize: "1rem", color: "var(--text)", marginBottom: "0.5rem" }}>
              Network Isolation &amp; Egress Sinkholing (NFR-S6)
            </h3>
            <ul style={{ paddingLeft: "1.25rem", margin: 0, fontSize: "0.875rem", lineHeight: 1.6 }}>
              <li>
                <strong>Zero Outbound Gateway:</strong> Test bridge networks have no default route to the public
                internet, preventing exfiltration or SSRF attacks.
              </li>
              <li>
                <strong>Private Sidecar Links:</strong> The application container can only reach its dedicated, pre-seeded
                sidecar databases (Postgres, MySQL, Redis, Mongo) over an internal virtual bridge.
              </li>
              <li>
                <strong>Registry Allowlisting:</strong> Package installations (npm, pip) pass through an allowlisted
                local caching proxy that blocks all non-package domains.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            3. Envelope Encryption &amp; Credential Protection (NFR-S4)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            All user-supplied secrets (test account passwords, environment variables, database URLs) are protected
            using two-tier envelope encryption:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>Unique Data Encryption Keys (DEKs):</strong> Every project receives a cryptographically random
              256-bit AES key generated at project intake.
            </li>
            <li>
              <strong>Authenticated Encryption (AES-256-GCM):</strong> Sensitive values are encrypted with authenticated
              GCM tags, guaranteeing confidentiality and tamper detection.
            </li>
            <li>
              <strong>Key Wrapping:</strong> Project DEKs are encrypted under a platform Master Key stored separately in
              secure environment variables and never logged.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            4. Secret Masking &amp; Redaction Pipeline (TRD Section 7)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            When the static engine flags hardcoded credentials (V05), KAIRO enforces strict data minimization:
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
            <p style={{ fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
              <strong>Masked Value Format:</strong> Raw secrets are never saved to the database. Instead, the finding
              retains only the first two and last two characters combined with a salted SHA-256 hash
              (e.g., <code>AK...EF (hash:7a92b3c1)</code>). This ensures stable fingerprint recognition across scans
              without storing the plaintext credential anywhere on disk or in reports.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            5. Safe Archive Extraction (NFR-S7)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            Our archive intake service guards against malicious ZIP payloads before files touch the filesystem:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>Zip Bomb Defense:</strong> Maximum compressed archive size of 50 MB, maximum uncompressed size of
              200 MB, and maximum file count of 20,000 files.
            </li>
            <li>
              <strong>Path Traversal Prevention:</strong> Every archive member is verified against canonical parent paths.
              Entries containing <code>../</code>, absolute root paths, or Windows drive prefixes are instantly rejected.
            </li>
            <li>
              <strong>Symlink Neutralization:</strong> Symbolic links and special device files are discarded to prevent
              file-descriptor escape.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            6. Vulnerability Disclosure Program (VDP)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            We welcome collaboration with the global security research community. If you believe you have found a
            security vulnerability in KAIRO, please report it to us responsibly under our Coordinated Disclosure Policy.
          </p>

          <h3 style={{ fontSize: "1.0625rem", color: "var(--text)", marginTop: "1rem", marginBottom: "0.5rem" }}>
            Safe Harbor Commitment
          </h3>
          <p style={{ marginBottom: "1rem" }}>
            We consider security research conducted in good faith under this policy to be authorized. We will not take
            legal action against researchers who:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>Make a good faith effort to avoid privacy violations, data destruction, and service degradation.</li>
            <li>Give us a reasonable timeframe (minimum 14 calendar days) to remediate the vulnerability before public disclosure.</li>
            <li>Do not modify or exfiltrate data belonging to other users.</li>
          </ul>

          <h3 style={{ fontSize: "1.0625rem", color: "var(--text)", marginTop: "1rem", marginBottom: "0.5rem" }}>
            How to Submit a Report
          </h3>
          <div
            className="card"
            style={{
              backgroundColor: "var(--surface)",
              padding: "1.25rem",
              lineHeight: 1.6,
              fontSize: "0.875rem",
            }}
          >
            <div>
              <strong>Security Contact:</strong>{" "}
              <a href="mailto:security@kairo.dev" style={{ color: "var(--accent)" }}>
                security@kairo.dev
              </a>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <strong>Response SLA:</strong> Initial response and triage acknowledgment within <strong>48 hours</strong>.
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <strong>Remediation Target:</strong> Critical and High severity issues patched within <strong>14 days</strong>.
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
