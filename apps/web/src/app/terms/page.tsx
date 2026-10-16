import React from "react";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata = {
  title: "Terms and Conditions: KAIRO",
  description:
    "Terms and Conditions governing the use of the KAIRO automated access-control security audit platform.",
};

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of terms" },
  { id: "authorized-use", title: "2. Authorized access and scope" },
  { id: "intellectual-property", title: "3. Source code and IP rights" },
  { id: "limits-of-service", title: "4. Nature of automated audits" },
  { id: "disclaimers", title: "5. Disclaimers and liability" },
  { id: "governing-law", title: "6. Governing law" },
  { id: "contact", title: "7. Contact information" },
  { id: "history", title: "8. Previous versions" },
];

const SUMMARY_POINTS = [
  "You must own or have written authorization to audit any repository connected to KAIRO.",
  "KAIRO never claims ownership over your source code or generated findings.",
  "Automated scans provide heuristic security evidence; they do not constitute formal penetration tests or regulatory certifications.",
  "Pricing is undecided; the platform is in development under Release 1.",
  "Governing law and dispute jurisdiction are to be set by the owner.",
];

export default function TermsPage() {
  const legalEmail = process.env.NEXT_PUBLIC_LEGAL_EMAIL || "legal@kairo.example";
  const governingLaw = process.env.NEXT_PUBLIC_GOVERNING_LAW || "To be set by the owner";

  return (
    <LegalLayout
      title="Terms and Conditions"
      version="0.1 (Draft)"
      effectiveDate="October 2026"
      summary={SUMMARY_POINTS}
      sections={SECTIONS}
    >
      {/* 1. Acceptance */}
      <section id="acceptance">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          1. Acceptance of terms
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          These terms govern your use of the KAIRO platform during its Release 1 development period. By accessing or using KAIRO, you agree to these terms.
        </p>
        <p style={{ margin: 0 }}>
          This document is an unreviewed working draft provided for engineering evaluation and is subject to formal legal review before general public release.
        </p>
      </section>

      {/* 2. Authorized access */}
      <section id="authorized-use">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          2. Authorized access and scope
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          You represent and warrant that you own, maintain, or possess explicit authorization from the legitimate copyright holder to submit code repositories for analysis by KAIRO.
        </p>
        <p style={{ margin: 0 }}>
          You agree not to connect repositories or execute dynamic test replays against infrastructure you are not authorized to evaluate.
        </p>
      </section>

      {/* 3. Intellectual property */}
      <section id="intellectual-property">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          3. Source code and IP rights
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          You retain all right, title, and intellectual property ownership in your source code, application architectures, and vulnerability findings reports.
        </p>
        <p style={{ margin: 0 }}>
          KAIRO claims no intellectual property interest in your repositories. We do not use customer code to train machine learning models.
        </p>
      </section>

      {/* 4. Nature of automated audits */}
      <section id="limits-of-service">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          4. Nature of automated audits
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          KAIRO provides automated static pattern analysis, semantic logic review, and dynamic sandbox verification against 13 specific vulnerability classes.
        </p>
        <p style={{ margin: 0 }}>
          An audit report indicating zero findings does not guarantee that an application is free of vulnerabilities or immune to attack. KAIRO is an engineering evaluation aid, not a substitute for human red-team assessments or formal security certifications.
        </p>
      </section>

      {/* 5. Disclaimers */}
      <section id="disclaimers">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          5. Disclaimers and liability
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis during development. To the maximum extent permitted by applicable law, KAIRO disclaims all warranties, express or implied.
        </p>
        <p style={{ margin: 0 }}>
          In no event shall the authors or project maintainers be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the platform.
        </p>
      </section>

      {/* 6. Governing law */}
      <section id="governing-law">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          6. Governing law
        </h2>
        <div className="card" style={{ padding: "16px", backgroundColor: "var(--sunken)" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
            Jurisdiction and Applicable Law
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--accent-text)" }}>
            {governingLaw}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>
            Governing law and dispute resolution mechanisms will be designated prior to commercial release.
          </div>
        </div>
      </section>

      {/* 7. Contact */}
      <section id="contact">
        <h2 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 12px" }}>
          7. Contact information
        </h2>
        <p style={{ margin: "0 0 12px" }}>
          For inquiries regarding these draft terms:
        </p>
        <div className="card" style={{ padding: "16px", backgroundColor: "var(--sunken)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Legal Notices</span>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>example address</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--accent-text)" }}>
            {legalEmail}
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
