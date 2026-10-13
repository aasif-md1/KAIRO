import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions - KAIRO",
  description:
    "Terms governing the use of the KAIRO audit platform, authorized testing requirements, and acceptable use policies.",
};

export default function TermsPage() {
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
          Legal &amp; Terms of Service
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Terms and Conditions
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
          Effective Date: 10 October 2026 · Version 1.0 · Binding Legal Agreement
        </p>
      </div>

      {/* Main Sections */}
      <div style={{ color: "var(--text-2)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
        {/* Section 1 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            1. Agreement to Terms
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;,
            or &quot;your&quot;) and KAIRO (&quot;we&quot;, &quot;us&quot;, or &quot;the platform&quot;). By creating an account, connecting a repository,
            uploading source code, or initiating an audit scan, you explicitly acknowledge that you have read, understood,
            and agree to be bound by these Terms.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            If you are accessing the platform on behalf of an organization or commercial entity, you represent and warrant
            that you have the legal authority to bind that entity to these Terms.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            2. Mandatory Authorization Warranty (LR-1)
          </h2>
          <div
            className="card"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--line-strong)",
              padding: "1.25rem",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
              Crucial Requirement for All Security Audits:
            </p>
            <p style={{ fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
              You warrant and represent that you are either the sole intellectual property owner of the submitted code,
              or possess explicit, written, and verifiable authorization from the rightful owner to subject the software
              to automated security auditing, static code analysis, and dynamic sandbox test execution.
            </p>
          </div>
          <p style={{ marginBottom: "1rem" }}>
            Submitting applications without explicit legal authorization is a material breach of these Terms, violates
            applicable computer crime legislation, and will result in immediate account termination, revocation of all
            scan results, and notification of the relevant intellectual property owners.
          </p>
        </section>

        {/* Section 3 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            3. Permitted Scope &amp; Sandbox Isolation (LR-2, FR-D13)
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            In Release 1 of KAIRO, active dynamic testing executes exclusively inside isolated ephemeral sandboxes.
            External live URLs or production endpoints provided by the user are strictly not accepted or exercised.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            Dynamic test harnesses run inside unprivileged gVisor micro-containers with zero outbound internet routing.
            All tested database records, sessions, and credentials must be synthetic test artifacts. You agree never to
            provide live production database credentials or real customer records.
          </p>
        </section>

        {/* Section 4 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            4. Prohibited Conduct and Acceptable Use Policy
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            You agree not to engage in any of the following activities on or through KAIRO:
          </p>
          <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              Attempting to break out of the gVisor sandbox container, exploit the underlying Linux host kernel, or
              reach internal network interfaces of runner nodes.
            </li>
            <li>
              Uploading weaponized malware, ransomware, cryptominers, or destructive payloads designed to harm the
              scanning infrastructure.
            </li>
            <li>
              Circumventing platform concurrency limits (maximum 3 concurrent scans, 10 scans per hour) or attempting
              denial-of-service attacks against KAIRO APIs.
            </li>
            <li>
              Attempting to access, view, or tamper with projects, route inventories, or findings belonging to another
              user tenant.
            </li>
            <li>
              Using findings generated by KAIRO to conduct malicious attacks against third-party systems or applications.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            5. Intellectual Property and Ownership of Findings
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            <strong>Your Source Code and Findings:</strong> You retain complete, unencumbered ownership of all source
            code, repositories, and archives you provide, as well as all audit findings and reports generated from your
            code. We claim zero ownership, copyright, or licensing rights in your code.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            <strong>The KAIRO Platform:</strong> KAIRO, its Tree-sitter route extractors, AST static rules, design system,
            heuristics, and software platform are protected by intellectual property laws and remain the exclusive property
            of KAIRO and its maintainers.
          </p>
        </section>

        {/* Section 6 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            6. Nature of Automated Audits &amp; Disclaimer of Warranty
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            KAIRO provides automated static analysis, logic review, and dynamic sandbox testing to assist engineers in
            identifying potential authorization and secret-handling flaws.
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
              <strong>Important Security Notice:</strong> Automated security analysis does not constitute a certified
              penetration test, a forensic audit, or an absolute guarantee that an application is bug-free, invulnerable,
              or immune from exploitation. The absence of detected vulnerabilities in a report does not guarantee
              complete security. You remain solely responsible for the architecture, security review, and deployment
              of your software.
            </p>
          </div>
          <p style={{ marginBottom: "1rem" }}>
            THE PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER
            EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
        </section>

        {/* Section 7 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            7. Limitation of Liability
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL KAIRO, ITS MAINTAINERS, AFFILIATES, OR
            CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
            WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, BUSINESS INTERRUPTION, OR SECURITY BREACHES ARISING
            OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE PLATFORM.
          </p>
        </section>

        {/* Section 8 */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            8. Account Termination &amp; Suspension
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            You may terminate your account at any time by using the Delete Account action in your Account settings.
            We reserve the right to suspend or permanently terminate access for any user who violates the authorization
            warranties (LR-1), attempts platform abuse, or violates these Terms.
          </p>
        </section>

        {/* Section 9 */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.375rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            9. Governing Law and Dispute Resolution
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its
            conflict of law principles. Any legal action or proceeding arising under these Terms shall be brought
            exclusively in the competent courts located in New Delhi, India.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            For legal inquiries or notices regarding these Terms, contact{" "}
            <a href="mailto:legal@kairo.dev" style={{ color: "var(--accent)" }}>
              legal@kairo.dev
            </a>
            .
          </p>
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
