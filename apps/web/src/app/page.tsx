import React from "react";
import Link from "next/link";

export const metadata = {
  title: "KAIRO - Access-Control and Secret-Handling Audit Platform",
  description:
    "Automated access-control, IDOR, and secret audit platform for Express, Next.js, FastAPI, and Flask web applications.",
};

const VULN_CLASSES = [
  {
    code: "V01",
    title: "Missing Authentication on State-Changing Routes",
    severity: "High",
    layer: "Static",
    desc: "Unauthenticated callers can trigger POST, PUT, or DELETE endpoints that mutate application data.",
  },
  {
    code: "V02",
    title: "Cross-Account Object Access (IDOR)",
    severity: "Critical",
    layer: "Dynamic",
    desc: "Endpoints accept record identifiers without verifying that the requesting user owns the object.",
  },
  {
    code: "V03",
    title: "Privilege Escalation via Role Tampering",
    severity: "High",
    layer: "Dynamic",
    desc: "Attackers can supply modified role parameters in request payloads to grant administrative rights.",
  },
  {
    code: "V04",
    title: "Client-Side-Only Access Control",
    severity: "High",
    layer: "Logic",
    desc: "Security checks implemented in frontend components without corresponding server-side enforcement.",
  },
  {
    code: "V05",
    title: "Hardcoded Secrets & Committed Keys",
    severity: "High",
    layer: "Static",
    desc: "High-entropy API tokens, private keys, database URLs, and committed .env files exposed in code.",
  },
  {
    code: "V06",
    title: "Insecure JWT & Session Handling",
    severity: "High",
    layer: "Static",
    desc: "Unverified token signatures (verify=False), acceptance of the 'none' algorithm, and weak secrets.",
  },
  {
    code: "V07",
    title: "Weak Credential Storage & Insecure Cookies",
    severity: "High",
    layer: "Static",
    desc: "Deprecated MD5/SHA-1 password hashing and sensitive session cookies missing HttpOnly and Secure flags.",
  },
  {
    code: "V08",
    title: "SQL Injection via String Concatenation",
    severity: "Critical",
    layer: "Static",
    desc: "Raw database queries constructed via dynamic string formatting rather than parameterized statements.",
  },
  {
    code: "V09",
    title: "Missing Rate Limiting on Sensitive Endpoints",
    severity: "Medium",
    layer: "Dynamic",
    desc: "Login, password reset, and authentication endpoints vulnerable to automated brute-force attacks.",
  },
  {
    code: "V10",
    title: "Permissive Cross-Origin Resource Sharing (CORS)",
    severity: "High",
    layer: "Static",
    desc: "Overly permissive wildcard or reflective CORS origins combined with credentials enabled.",
  },
  {
    code: "V11",
    title: "Missing Row-Level Security & Tenant Isolation",
    severity: "Critical",
    layer: "Logic",
    desc: "Database queries in multi-tenant systems executed without tenant identifier scoping.",
  },
  {
    code: "V12",
    title: "Mass Assignment Vulnerabilities",
    severity: "High",
    layer: "Dynamic",
    desc: "Handlers bind untrusted HTTP request body dictionaries directly to database ORM models.",
  },
  {
    code: "V13",
    title: "Debug Mode & Stack Trace Leakage",
    severity: "Medium",
    layer: "Static",
    desc: "Frameworks initialized with debug=True or error handlers exposing verbose stack traces in production.",
  },
];

const FAQS = [
  {
    q: "How does KAIRO differ from traditional SAST tools?",
    a: "Traditional SAST tools focus on generic syntax patterns and dependency CVEs. KAIRO is purpose-built to discover broken access control (OWASP Top 10 #1). It maps the complete route inventory of your application, verifies whether credential checks exist, checks object ownership, and confirms authorization live in an isolated sandbox.",
  },
  {
    q: "Is my source code stored or used to train AI models?",
    a: "Never. Your source code is retrieved into memory or temporary encrypted staging solely to execute your requested audit. Code snapshots are encrypted with AES-256-GCM under project-specific keys and permanently erased within 24 hours. Your code is never used to train or fine-tune public models.",
  },
  {
    q: "How does the dynamic sandbox test without affecting production?",
    a: "Dynamic tests run inside an isolated gVisor container on dedicated runner nodes with zero outbound internet access. The application runs with isolated sidecar databases (PostgreSQL, MySQL, Redis, MongoDB) populated with synthetic mock data.",
  },
  {
    q: "Which frameworks and programming languages are supported in Release 1?",
    a: "KAIRO supports Express, Next.js (App Router & Pages Router), FastAPI, and Flask across Python, JavaScript, TypeScript, and TSX. File discovery supports repositories and ZIP archives up to 200 MB and 20,000 files.",
  },
  {
    q: "What report formats does KAIRO produce?",
    a: "KAIRO provides an interactive web dashboard, standard SARIF 2.1.0 exports for CI/CD ingestion, and publication-ready tagged PDF executive reports.",
  },
];

export default function HomePage() {
  return (
    <div className="container" style={{ padding: "3rem 1.5rem" }}>
      {/* Hero Section */}
      <section
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          textAlign: "center",
          padding: "3rem 0 4rem 0",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--accent-text)",
            backgroundColor: "var(--accent-tint)",
            padding: "0.25rem 0.75rem",
            borderRadius: "var(--radius-control)",
            marginBottom: "1.5rem",
          }}
        >
          <span>Defense-In-Depth Security Audit Platform</span>
          <span>·</span>
          <span>Release 1.0</span>
        </div>

        <h1
          style={{
            fontSize: "3rem",
            lineHeight: 1.15,
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          Find access-control flaws in modern web applications before you ship.
        </h1>

        <p
          style={{
            fontSize: "1.1875rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
            maxWidth: "760px",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          KAIRO combines in-house Tree-sitter static parsing, gated logic review, and isolated sandbox
          execution into one verified finding report. Catch missing authentication, IDOR, token misuse,
          and hardcoded credentials across Express, Next.js, FastAPI, and Flask.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "3rem",
          }}
        >
          <Link
            href="/sign-in"
            className="btn btn-primary"
            style={{ fontSize: "1rem", padding: "0.75rem 1.75rem" }}
          >
            Start Free Audit &rarr;
          </Link>
          <Link
            href="/security"
            className="btn btn-secondary"
            style={{ fontSize: "1rem", padding: "0.75rem 1.75rem" }}
          >
            Read Security Architecture
          </Link>
        </div>

        {/* Supported stacks callout */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            color: "var(--muted)",
            fontSize: "0.8125rem",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            padding: "1rem 0",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--text)" }}>Supported Frameworks:</span>
          <span>Express (Node.js)</span>
          <span>·</span>
          <span>Next.js (App &amp; Pages)</span>
          <span>·</span>
          <span>FastAPI (Python)</span>
          <span>·</span>
          <span>Flask (Python)</span>
          <span>·</span>
          <span>ZIP &amp; GitHub Ingestion</span>
        </div>
      </section>

      {/* The Problem Section: Why Access Control? */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            The Access-Control Blind Spot in AI-Assisted Code
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "680px", margin: "0 auto", fontSize: "1rem" }}>
            Code generators create functioning business logic, but consistently miss authorization checks,
            tenant scoping, and cryptographic verification.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <div className="card">
            <h3 style={{ fontSize: "1.125rem", color: "var(--sev-critical)", marginBottom: "0.5rem" }}>
              Traditional Linters Stop at Syntax
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              Standard linters and static tools verify formatting and known package dependencies, but
              cannot understand whether User A can read User B&apos;s records or trigger administrative actions.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.125rem", color: "var(--sev-high)", marginBottom: "0.5rem" }}>
              Hallucinated Auth Middleware
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              AI assistants frequently assign names like &quot;auth&quot; or &quot;protect&quot; to functions that do not actually
              fail closed, giving developers a false sense of security while leaving routes wide open.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.125rem", color: "var(--accent)", marginBottom: "0.5rem" }}>
              KAIRO Proves Flaws with Proof
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              KAIRO models your complete route inventory, inspects authentication and role signals, and
              corroborates findings dynamically in an isolated sandbox with dual test personas.
            </p>
          </div>
        </div>
      </section>

      {/* Three Analysis Layers */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
            Multi-Layer Defense
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Three Independent Engines. Zero Conflicting Results.
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "680px", margin: "0 auto", fontSize: "1rem" }}>
            Every scan runs through three distinct evaluation layers to eliminate blind spots and false positives.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {/* Layer 1: Static Engine */}
          <div className="card" style={{ borderTop: "4px solid var(--accent)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.5rem" }}>
              LAYER 01
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Tree-Sitter Static Engine</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              In-house concrete syntax tree parsers extract every route, middleware chain, and dependency parameter.
              Builds a normalized route inventory with three-valued signals: detected, absent, or unknown.
            </p>
            <ul style={{ color: "var(--text-2)", fontSize: "0.8125rem", paddingLeft: "1.25rem", lineHeight: 1.6 }}>
              <li>Deterministic YAML rules validated by JSON Schema</li>
              <li>Shannon entropy secret scanning &amp; mask redaction</li>
              <li>Stable fingerprints that survive line shifts</li>
            </ul>
          </div>

          {/* Layer 2: Logic Review */}
          <div className="card" style={{ borderTop: "4px solid var(--emerald-tile)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--emerald-tile)", marginBottom: "0.5rem" }}>
              LAYER 02
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Gated Logic Review</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Inspects ambiguous handler logic up to two call levels deep. Strict PII and credential redaction
              strips sensitive secrets before sending line-numbered context through a temperature-0 provider interface.
            </p>
            <ul style={{ color: "var(--text-2)", fontSize: "0.8125rem", paddingLeft: "1.25rem", lineHeight: 1.6 }}>
              <li>Mandatory line citations required for all findings</li>
              <li>Schema validation discards ungrounded responses</li>
              <li>Confidence capped at Possible without dynamic proof</li>
            </ul>
          </div>

          {/* Layer 3: Dynamic Sandbox */}
          <div className="card" style={{ borderTop: "4px solid var(--status-fixed)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--status-fixed)", marginBottom: "0.5rem" }}>
              LAYER 03
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Isolated Dynamic Sandbox</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
              Builds and runs your application inside a hardened gVisor micro-container with isolated network
              bridges and zero outbound internet gateway. Automated drivers exercise endpoints using dual test accounts.
            </p>
            <ul style={{ color: "var(--text-2)", fontSize: "0.8125rem", paddingLeft: "1.25rem", lineHeight: 1.6 }}>
              <li>Deterministic proof of cross-tenant IDOR access</li>
              <li>Pre-seeded sidecars: Postgres, MySQL, Redis, Mongo</li>
              <li>Runner nodes hold zero platform credentials</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 13 Vulnerability Classes Showcase */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
            Audit Scope
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            13 Release 1 Vulnerability Classes
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "680px", margin: "0 auto", fontSize: "1rem" }}>
            Targeted specifically at access control, authentication bypass, and credential misuse.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1rem" }}>
          {VULN_CLASSES.map((vc) => (
            <div key={vc.code} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    padding: "0.15rem 0.45rem",
                    backgroundColor: "var(--sunken)",
                    borderRadius: "var(--radius-control)",
                  }}
                >
                  {vc.code}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color:
                      vc.severity === "Critical"
                        ? "var(--sev-critical)"
                        : vc.severity === "High"
                        ? "var(--sev-high)"
                        : "var(--sev-medium)",
                  }}
                >
                  {vc.severity}
                </span>
              </div>
              <h3 style={{ fontSize: "0.9375rem", marginBottom: "0.35rem", fontWeight: 600 }}>{vc.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.5, margin: 0 }}>
                {vc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Before & After Walkthrough */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Actionable Findings with Exact Remediation
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto", fontSize: "1rem" }}>
            KAIRO explains what is broken, why it is dangerous, and provides copy-paste ready fixes.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* Vulnerable Code */}
          <div
            className="card"
            style={{
              borderColor: "var(--sev-critical)",
              backgroundColor: "var(--surface)",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--sev-critical)",
                }}
              />
              <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--sev-critical)" }}>
                Vulnerable Code (V01 + V08)
              </span>
            </div>
            <pre
              style={{
                backgroundColor: "#11141A",
                color: "#E5E9F0",
                padding: "1rem",
                borderRadius: "var(--radius-control)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                overflowX: "auto",
                lineHeight: 1.5,
              }}
            >
              <code>{`// Missing auth & SQL string interpolation
app.post("/invoices/:id", async (req, res) => {
  const { amount } = req.body;
  // Flaw 1: Anyone can trigger update
  // Flaw 2: Direct SQL interpolation
  await db.query(
    \`UPDATE invoices SET amt = \${amount} 
     WHERE id = '\${req.params.id}'\`
  );
  res.json({ ok: true });
});`}</code>
            </pre>
          </div>

          {/* Remediated Code */}
          <div
            className="card"
            style={{
              borderColor: "var(--status-fixed)",
              backgroundColor: "var(--surface)",
              padding: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--status-fixed)",
                }}
              />
              <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--status-fixed)" }}>
                KAIRO Remediated Code
              </span>
            </div>
            <pre
              style={{
                backgroundColor: "#11141A",
                color: "#E5E9F0",
                padding: "1rem",
                borderRadius: "var(--radius-control)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                overflowX: "auto",
                lineHeight: 1.5,
              }}
            >
              <code>{`// Protected with auth & parameterized query
app.post("/invoices/:id", requireAuth, async (req, res) => {
  const { amount } = req.body;
  // Fix 1: Verified user owns invoice
  // Fix 2: Parameterized query ($1, $2)
  await db.query(
    \`UPDATE invoices SET amt = $1 
     WHERE id = $2 AND owner_id = $3\`,
    [amount, req.params.id, req.user.id]
  );
  res.json({ ok: true });
});`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Pillars */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 5rem auto" }}>
        <div className="card" style={{ padding: "2.5rem", backgroundColor: "var(--surface)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              Privacy and Trust by Design
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", maxWidth: "600px", margin: "0 auto" }}>
              We treat your source code with absolute confidentiality and mathematical guarantees.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                24-Hour Automatic Erasure
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.6, margin: 0 }}>
                Uploaded ZIP archives and code clones are automatically wiped after 24 hours. Delete your project
                at any time for instant purge.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Zero Customer Model Training
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.6, margin: 0 }}>
                We operate under strict zero-data-retention agreements. Your private code is never logged, cached,
                or used to train language models.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Envelope Encryption (AES-256-GCM)
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.6, margin: 0 }}>
                Sensitive environment variables and test account credentials are encrypted with unique per-project
                keys stored independently from application databases.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Strictly Necessary Cookies Only
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.8125rem", lineHeight: 1.6, margin: 0 }}>
                No tracking cookies. No third-party ad networks. We store only your encrypted session cookie
                and CSRF token.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section style={{ maxWidth: "800px", margin: "0 auto 5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Frequently Asked Questions</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
            Common questions about KAIRO security scans, sandboxing, and data privacy.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} className="card" style={{ padding: "1.25rem 1.5rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{faq.q}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-footer Call to Action */}
      <section
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          padding: "3rem 1.5rem",
          backgroundColor: "var(--surface)",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--line)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
          Secure your applications before production launch.
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "1rem", marginBottom: "1.75rem", maxWidth: "560px", margin: "0 auto 1.75rem auto" }}>
          Connect a GitHub repository or drop a ZIP archive to generate your first access-control audit report.
        </p>
        <Link
          href="/sign-in"
          className="btn btn-primary"
          style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}
        >
          Sign in and audit code &rarr;
        </Link>
      </section>
    </div>
  );
}
