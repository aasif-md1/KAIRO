import React from "react";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata = {
  title: "Privacy Policy: KAIRO",
  description:
    "Privacy Policy explaining how KAIRO handles source code, authentication tokens, and user data with zero model training and ephemeral storage.",
};

const SECTIONS = [
  { id: "overview", title: "1. Overview and core commitments" },
  { id: "data-collection", title: "2. Information we process" },
  { id: "code-handling", title: "3. Source code and model training" },
  { id: "local-storage", title: "4. Cookies and local storage" },
  { id: "retention", title: "5. Data retention and deletion" },
  { id: "rights", title: "6. Your data rights" },
  { id: "contact", title: "7. Contact and grievances" },
  { id: "history", title: "8. Previous versions" },
];

const SUMMARY_POINTS = [
  "We do not use customer code to train machine learning models.",
  "AI-assisted logic review of real user code stays switched off until an approved provider with strict data terms is in place, and can be disabled per project.",
  "Source code archives are ephemeral: purged immediately when the scan ends and never kept longer than 24 hours.",
  "We set no tracking cookies. Appearance preferences (kairo-theme) are stored purely in client-side localStorage.",
  "This draft policy is designed to meet the duties of India's Digital Personal Data Protection Act, 2023 (DPDP Act).",
];

export default function PrivacyPage() {
  const privacyEmail = process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "privacy@kairo.example";

  return (
    <LegalLayout
      title="Privacy Policy"
      version="0.1 (Draft)"
      effectiveDate="October 2026"
      summary={SUMMARY_POINTS}
      sections={SECTIONS}
    >
      {/* 1. Overview */}
      <section id="overview">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          1. Overview and core commitments
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          KAIRO provides an automated access-control, IDOR, and secret-handling audit platform for developers. We recognize that source code constitutes sensitive proprietary intellectual property.
        </p>
        <p style={{ margin: 0 }}>
          This policy describes our data processing activities for Release 1. The document is designed to meet the duties of India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act) and international data minimization standards.
        </p>
      </section>

      {/* 2. Information we process */}
      <section id="data-collection">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          2. Information we process
        </h2>
        <p style={{ margin: "0 0 16px" }}>
          We collect and process minimal categories of information necessary to deliver automated audits:
        </p>
        <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius-card)", overflow: "hidden", marginBottom: "16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--sunken)", borderBottom: "1px solid var(--line)" }}>
                <th style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>Category</th>
                <th style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>Purpose</th>
                <th style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>Storage Location</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "10px 14px", fontWeight: 600 }}>GitHub Identity</td>
                <td style={{ padding: "10px 14px" }}>Account sign-in and session verification</td>
                <td style={{ padding: "10px 14px" }}>Encrypted user database</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "10px 14px", fontWeight: 600 }}>Repository Archives</td>
                <td style={{ padding: "10px 14px" }}>Parsing routes and evaluating vulnerabilities</td>
                <td style={{ padding: "10px 14px" }}>Ephemeral scratch volume (deleted after scan)</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 14px", fontWeight: 600 }}>Audit Findings</td>
                <td style={{ padding: "10px 14px" }}>Generating reports and tracking remediation</td>
                <td style={{ padding: "10px 14px" }}>Encrypted project database</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Source code and model training */}
      <section id="code-handling">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          3. Source code and model training
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          KAIRO does not use customer source code, AST trees, or vulnerability findings to train machine learning models.
        </p>
        <p style={{ margin: 0 }}>
          AI-assisted logic review of real user code stays switched off until a model provider with suitable zero-data-retention commercial terms is approved. When enabled, project administrators can turn off AI-assisted logic review completely in the project settings panel.
        </p>
      </section>

      {/* 4. Cookies and local storage */}
      <section id="local-storage">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          4. Cookies and local storage
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          KAIRO does not use third-party tracking cookies or advertising pixels.
        </p>
        <p style={{ margin: 0 }}>
          We store your visual appearance preference under the localStorage key <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>kairo-theme</code> (values: &quot;system&quot;, &quot;light&quot;, or &quot;dark&quot;). This preference remains exclusively on your device, is not sent to our servers, and requires no cookie consent banner.
        </p>
      </section>

      {/* 5. Data retention and deletion */}
      <section id="retention">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          5. Data retention and deletion
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          Source code archives downloaded for static and dynamic evaluation are destroyed as soon as the audit completes. In no event are source archives retained longer than 24 hours.
        </p>
        <p style={{ margin: 0 }}>
          Account profile details and audit findings reports are preserved until you delete your project or account. Account deletion purges all associated audit history immediately.
        </p>
      </section>

      {/* 6. Your data rights */}
      <section id="rights">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          6. Your data rights
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          Under applicable data protection laws, including India&apos;s DPDP Act, you have the right to request access to your personal information, request correction of inaccurate data, and demand erasure of your personal data.
        </p>
        <p style={{ margin: 0 }}>
          To exercise your rights, email our privacy desk using the contact address below.
        </p>
      </section>

      {/* 7. Contact and grievances */}
      <section id="contact">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          7. Contact and grievances
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          For inquiries or grievance redressal regarding data privacy:
        </p>
        <div className="card" style={{ padding: "16px", backgroundColor: "var(--sunken)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Privacy Officer</span>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>example address</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--accent-text)" }}>
            {privacyEmail}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>
            Target response time: 5 business days (owner-confirmed).
          </div>
        </div>
      </section>

      {/* 8. Previous versions */}
      <section id="history">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          8. Previous versions
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>
          None. This is initial Draft 0.1 for Release 1 in development.
        </p>
      </section>
    </LegalLayout>
  );
}
