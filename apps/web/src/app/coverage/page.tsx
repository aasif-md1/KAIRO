"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SeverityLabel } from "@/components/SeverityLabel";

interface VulnRule {
  id: string;
  name: string;
  category: "access_control" | "secrets" | "injection" | "config";
  severity: "critical" | "high" | "medium" | "low";
  layer: "Static" | "Logic" | "Dynamic";
  cwe: string;
  owasp: string;
  description: string;
  detection: string;
  vulnerableCode: string;
  fixedCode: string;
}

const RULES: VulnRule[] = [
  {
    id: "KR-V01",
    name: "Missing Authentication on State-Changing Routes",
    category: "access_control",
    severity: "high",
    layer: "Static",
    cwe: "CWE-306",
    owasp: "A01:2021",
    description: "Unauthenticated callers can trigger POST, PUT, or DELETE endpoints that mutate application data.",
    detection: "Static AST analysis indexes HTTP verbs and identifies missing authentication middleware on routes performing database writes or updates.",
    vulnerableCode: `// Missing auth middleware on order creation
app.post('/api/orders', async (req, res) => {
  const order = await db.orders.create({ data: req.body });
  res.status(201).json(order);
});`,
    fixedCode: `// Require verified session token before mutation
app.post('/api/orders', requireAuth, async (req, res) => {
  const order = await db.orders.create({
    data: { ...req.body, userId: req.user.id }
  });
  res.status(201).json(order);
});`,
  },
  {
    id: "KR-V02",
    name: "Cross-Account Object Access (IDOR)",
    category: "access_control",
    severity: "critical",
    layer: "Dynamic",
    cwe: "CWE-639",
    owasp: "A01:2021",
    description: "Endpoints accept record identifiers without verifying that the requesting user owns the object.",
    detection: "Dynamic sandbox replays simulated tenant requests with mismatched session tokens to verify if arbitrary object IDs return 200 OK.",
    vulnerableCode: `// Accepts order ID from path without checking user ownership
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  res.json(order);
});`,
    fixedCode: `// Query scoped to authenticated user ID
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await db.orders.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});`,
  },
  {
    id: "KR-V03",
    name: "Privilege Escalation via Role Tampering",
    category: "access_control",
    severity: "high",
    layer: "Dynamic",
    cwe: "CWE-269",
    owasp: "A01:2021",
    description: "Attackers supply modified role parameters in request payloads to grant administrative rights.",
    detection: "Synthesizes payloads injecting administrative role keys (`role: 'admin'`, `is_staff: true`) during profile updates.",
    vulnerableCode: `// User profile update accepts arbitrary role field
app.put('/api/users/profile', requireAuth, async (req, res) => {
  await db.users.update(req.user.id, req.body);
  res.json({ ok: true });
});`,
    fixedCode: `// Explicit allowlist of editable profile fields
app.put('/api/users/profile', requireAuth, async (req, res) => {
  const { name, bio } = req.body;
  await db.users.update(req.user.id, { name, bio });
  res.json({ ok: true });
});`,
  },
  {
    id: "KR-V04",
    name: "Client-Side-Only Access Control",
    category: "access_control",
    severity: "high",
    layer: "Logic",
    cwe: "CWE-602",
    owasp: "A01:2021",
    description: "Security checks implemented in frontend components without corresponding server-side enforcement.",
    detection: "Traces backend handler logic for administrative endpoints to confirm whether server-side authorization guards exist.",
    vulnerableCode: `// Server assumes caller verified isAdmin on frontend
app.delete('/api/admin/tenants/:id', async (req, res) => {
  await db.tenants.delete(req.params.id);
  res.status(204).end();
});`,
    fixedCode: `// Enforce role authorization server-side
app.delete('/api/admin/tenants/:id', requireAdmin, async (req, res) => {
  await db.tenants.delete(req.params.id);
  res.status(204).end();
});`,
  },
  {
    id: "KR-V05",
    name: "Committed Cloud and SaaS Secrets",
    category: "secrets",
    severity: "critical",
    layer: "Static",
    cwe: "CWE-798",
    owasp: "A07:2021",
    description: "High-entropy API keys, private tokens, or access credentials hardcoded directly into source files.",
    detection: "Regular expression pattern matching and Shannon entropy scoring across all source files, checking against known key formats.",
    vulnerableCode: `// Hardcoded third-party payment secret
const stripe = new Stripe('sk_live_sample_placeholder_key_demo');`,
    fixedCode: `// Load secret securely from environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);`,
  },
  {
    id: "KR-V06",
    name: "Database Credentials in Repository Files",
    category: "secrets",
    severity: "critical",
    layer: "Static",
    cwe: "CWE-259",
    owasp: "A07:2021",
    description: "Database connection strings containing plaintext usernames and passwords committed to git.",
    detection: "AST scanner detects database URI literals containing protocol schemes (`postgres://`, `mongodb://`) with embedded credentials.",
    vulnerableCode: `// Plaintext connection string with credentials
const client = new MongoClient('mongodb://admin:p@ssw0rd123@db.prod.internal:27017');`,
    fixedCode: `// Read connection URI from environment configuration
const client = new MongoClient(process.env.DATABASE_URL);`,
  },
  {
    id: "KR-V07",
    name: "JWT Secrets with Weak Entropy",
    category: "secrets",
    severity: "high",
    layer: "Static",
    cwe: "CWE-326",
    owasp: "A02:2021",
    description: "JWT signing secrets set to easily guessable words or default template values.",
    detection: "Compares signing key literals against dictionaries of common developer boilerplate keys ('secret', 'test1234', 'jwt_secret').",
    vulnerableCode: `// Guessable default signing secret
const token = jwt.sign(payload, 'mysecretkey123', { expiresIn: '1h' });`,
    fixedCode: `// High-entropy secret from vault or environment
const token = jwt.sign(payload, process.env.JWT_SIGNING_SECRET, { expiresIn: '1h' });`,
  },
  {
    id: "KR-V08",
    name: "SQL Injection via Concatenation",
    category: "injection",
    severity: "critical",
    layer: "Logic",
    cwe: "CWE-89",
    owasp: "A03:2021",
    description: "User input directly interpolated or concatenated into raw SQL query strings.",
    detection: "Taint tracking from request parameter variables into SQL execution sinks without parameterized placeholders.",
    vulnerableCode: `// Raw string template in SQL query
const query = \`SELECT * FROM users WHERE email = '\${req.query.email}'\`;
const result = await db.raw(query);`,
    fixedCode: `// Parameterized query using placeholders
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [req.query.email]);`,
  },
  {
    id: "KR-V09",
    name: "Command Injection via Child Process",
    category: "injection",
    severity: "critical",
    layer: "Logic",
    cwe: "CWE-78",
    owasp: "A03:2021",
    description: "Untrusted input passed directly to system shell execution utilities like `exec`.",
    detection: "Traces shell invocation functions receiving dynamic user request parameters without sanitization.",
    vulnerableCode: `// Executes system shell with unvalidated filename
exec(\`convert \${req.body.filename} output.png\`, callback);`,
    fixedCode: `// Use safe argument vector without invoking system shell
execFile('convert', [req.body.filename, 'output.png'], callback);`,
  },
  {
    id: "KR-V10",
    name: "Permissive CORS with Credentials",
    category: "config",
    severity: "medium",
    layer: "Static",
    cwe: "CWE-942",
    owasp: "A05:2021",
    description: "Cross-Origin Resource Sharing configured with wildcard `*` while credentials mode is enabled.",
    detection: "Static config inspection verifies CORS middleware options for origin reflection and credentials flag.",
    vulnerableCode: `// Reflects arbitrary origin with credentials allowed
app.use(cors({ origin: true, credentials: true }));`,
    fixedCode: `// Explicit origin allowlist
app.use(cors({ origin: ['https://app.example.com'], credentials: true }));`,
  },
  {
    id: "KR-V11",
    name: "Debug Mode and Verbose Errors in Production",
    category: "config",
    severity: "medium",
    layer: "Static",
    cwe: "CWE-209",
    owasp: "A05:2021",
    description: "Application debug settings left enabled or raw stack traces exposed to client responses.",
    detection: "Checks configuration files for hardcoded debug flags (`DEBUG=True`) and error middleware sending stack traces.",
    vulnerableCode: `// Exposing full error stack in API response
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, stack: err.stack });
});`,
    fixedCode: `// Generic error message without internal stack trace
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
});`,
  },
  {
    id: "KR-V12",
    name: "Unvalidated Redirects",
    category: "access_control",
    severity: "low",
    layer: "Logic",
    cwe: "CWE-601",
    owasp: "A01:2021",
    description: "Endpoints redirecting users to external URLs specified directly in query parameters.",
    detection: "Identifies redirect functions passing unvalidated URL parameters without host validation.",
    vulnerableCode: `// Redirects to any user-supplied URL
app.get('/login-callback', (req, res) => {
  res.redirect(req.query.returnTo);
});`,
    fixedCode: `// Validate return URL against relative path or allowlist
app.get('/login-callback', (req, res) => {
  const safePath = req.query.returnTo?.startsWith('/') ? req.query.returnTo : '/dashboard';
  res.redirect(safePath);
});`,
  },
  {
    id: "KR-V13",
    name: "Missing Rate Limiting on Auth Routes",
    category: "config",
    severity: "low",
    layer: "Static",
    cwe: "CWE-307",
    owasp: "A07:2021",
    description: "Authentication and credential-handling endpoints lacking rate limiters or brute-force protections.",
    detection: "Static route analysis identifies `/login`, `/auth`, or `/reset-password` routes with no throttling middleware.",
    vulnerableCode: `// Login endpoint with zero rate limiting
app.post('/api/login', async (req, res) => {
  const user = await verifyCredentials(req.body.email, req.body.password);
  res.json({ token: user.token });
});`,
    fixedCode: `// Rate limit applied to login endpoint
app.post('/api/login', authRateLimiter, async (req, res) => {
  const user = await verifyCredentials(req.body.email, req.body.password);
  res.json({ token: user.token });
});`,
  },
];

export default function CoveragePage() {
  const [selectedRuleId, setSelectedRuleId] = useState("KR-V01");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSeverity, setActiveSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [codeMode, setCodeMode] = useState<"vulnerable" | "fixed">("vulnerable");

  // Read URL hash on load
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && RULES.some((r) => r.id === hash)) {
        setSelectedRuleId(hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSelectRule = (id: string) => {
    setSelectedRuleId(id);
    window.location.hash = id;
    setCodeMode("vulnerable");
  };

  const filteredRules = RULES.filter((r) => {
    if (activeCategory !== "all" && r.category !== activeCategory) return false;
    if (activeSeverity !== "all" && r.severity !== activeSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.cwe.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const selectedRule = RULES.find((r) => r.id === selectedRuleId) || RULES[0];
  const currentIndex = RULES.findIndex((r) => r.id === selectedRule.id);
  const prevRule = currentIndex > 0 ? RULES[currentIndex - 1] : null;
  const nextRule = currentIndex < RULES.length - 1 ? RULES[currentIndex + 1] : null;

  return (
    <div style={{ position: "relative" }}>
      {/* 1. Header Section */}
      <section
        style={{
          paddingTop: "64px",
          paddingBottom: "48px",
          borderBottom: "1px solid var(--line)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Container>
          <div style={{ maxWidth: "760px", marginBottom: "32px" }}>
            <span className="eyebrow">Flaw catalog</span>
            <h1 className="hero-h1" style={{ fontSize: "clamp(36px, 4vw, 52px)", marginBottom: "16px" }}>
              Vulnerability Coverage in Release 1
            </h1>
            <p className="lead-p" style={{ margin: 0 }}>
              13 specific vulnerability classes evaluated across static syntax, semantic logic, and isolated sandbox execution.
            </p>
          </div>

          {/* Summary Row at Top */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              paddingTop: "24px",
              borderTop: "1px solid var(--line)",
            }}
          >
            <div>
              <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                13
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "2px" }}>
                Vulnerability Classes
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                KR-V01 to KR-V13
              </div>
            </div>

            <div>
              <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                4
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "2px" }}>
                Target Categories
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                Access control, secrets, injection, config
              </div>
            </div>

            <div>
              <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                3
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginTop: "2px" }}>
                Analysis Layers
              </div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                Static AST, logic review, dynamic sandbox
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Master-Detail Explorer Section */}
      <section className="section section-bg">
        <Container>
          <div className="grid-12" style={{ alignItems: "start" }}>
            {/* Left 4 Columns (Sticky Master Navigation) */}
            <aside
              className="col-4"
              style={{
                position: "sticky",
                top: "96px",
                maxHeight: "calc(100vh - 120px)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Search input */}
              <input
                type="text"
                placeholder="Search rules, CWE, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--text)",
                  outline: "none",
                }}
              />

              {/* Filter controls */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(["all", "access_control", "secrets", "injection", "config"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid " + (activeCategory === cat ? "var(--accent)" : "var(--line)"),
                      backgroundColor: activeCategory === cat ? "var(--accent-tint)" : "var(--surface)",
                      color: activeCategory === cat ? "var(--accent-text)" : "var(--muted)",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono)",
                      cursor: "pointer",
                      fontWeight: activeCategory === cat ? 600 : 400,
                    }}
                  >
                    {cat === "all" ? "All" : cat.replace("_", " ")}
                  </button>
                ))}
              </div>

              {/* 13 Compact Rows */}
              <div
                style={{
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  paddingRight: "4px",
                }}
              >
                {filteredRules.map((rule) => {
                  const isSelected = rule.id === selectedRule.id;
                  return (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => handleSelectRule(rule.id)}
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        backgroundColor: isSelected ? "var(--surface)" : "var(--sunken)",
                        border: "1px solid " + (isSelected ? "var(--accent)" : "var(--line)"),
                        borderRadius: "var(--radius-control)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        transition: "border-color var(--dur-fast) var(--ease)",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--accent-text)" }}>
                            {rule.id}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: isSelected ? 600 : 500,
                            color: "var(--text)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: "2px",
                          }}
                        >
                          {rule.name}
                        </div>
                      </div>

                      <SeverityLabel severity={rule.severity} />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right 8 Columns (Active Rule Inspector) */}
            <main className="col-8">
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-card)",
                  padding: "32px",
                }}
              >
                {/* Rule Title Header */}
                <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "20px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "var(--accent-text)" }}>
                      {selectedRule.id}
                    </span>
                    <span style={{ color: "var(--line-strong)" }}>•</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--muted)" }}>
                      {selectedRule.cwe}
                    </span>
                    <span style={{ color: "var(--line-strong)" }}>•</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--muted)" }}>
                      OWASP {selectedRule.owasp}
                    </span>
                    <span style={{ color: "var(--line-strong)" }}>•</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-2)" }}>
                      Layer: {selectedRule.layer}
                    </span>
                  </div>

                  <h2 className="section-h2" style={{ marginBottom: "12px" }}>
                    {selectedRule.name}
                  </h2>

                  <p className="lead-p" style={{ margin: 0, fontSize: "18px" }}>
                    {selectedRule.description}
                  </p>
                </div>

                {/* Vulnerable vs Fixed Code Toggle */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                      Code Demonstration
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => setCodeMode("vulnerable")}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "var(--radius-control)",
                          border: "1px solid " + (codeMode === "vulnerable" ? "var(--sev-critical)" : "var(--line)"),
                          backgroundColor: codeMode === "vulnerable" ? "var(--sev-critical-bg)" : "var(--sunken)",
                          color: codeMode === "vulnerable" ? "var(--sev-critical)" : "var(--text-2)",
                          fontSize: "12px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Vulnerable Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeMode("fixed")}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "var(--radius-control)",
                          border: "1px solid " + (codeMode === "fixed" ? "var(--accent)" : "var(--line)"),
                          backgroundColor: codeMode === "fixed" ? "var(--accent-tint)" : "var(--sunken)",
                          color: codeMode === "fixed" ? "var(--accent-text)" : "var(--text-2)",
                          fontSize: "12px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Remediated Fix
                      </button>
                    </div>
                  </div>

                  <pre
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      backgroundColor: "var(--sunken)",
                      padding: "20px 24px",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid var(--line)",
                      color: "var(--text)",
                      margin: 0,
                      overflowX: "auto",
                    }}
                  >
                    <code>{codeMode === "vulnerable" ? selectedRule.vulnerableCode : selectedRule.fixedCode}</code>
                  </pre>
                </div>

                {/* How KAIRO detects it */}
                <div style={{ marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid var(--line)" }}>
                  <h3 className="section-h3" style={{ fontSize: "18px", marginBottom: "10px" }}>
                    How KAIRO detects it
                  </h3>
                  <p className="body-p" style={{ margin: 0 }}>
                    {selectedRule.detection}
                  </p>
                </div>

                {/* References */}
                <div style={{ marginBottom: "32px", display: "flex", gap: "24px", fontSize: "14px" }}>
                  <div>
                    <span style={{ color: "var(--muted)" }}>CWE Reference: </span>
                    <a
                      href={`https://cwe.mitre.org/data/definitions/${selectedRule.cwe.replace("CWE-", "")}.html`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--accent-text)", textDecoration: "underline" }}
                    >
                      {selectedRule.cwe}
                    </a>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>OWASP Standard: </span>
                    <span style={{ color: "var(--text)" }}>{selectedRule.owasp}</span>
                  </div>
                </div>

                {/* Previous & Next Navigation */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "20px",
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  {prevRule ? (
                    <button
                      type="button"
                      onClick={() => handleSelectRule(prevRule.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--sunken)",
                        border: "1px solid var(--line)",
                        borderRadius: "var(--radius-control)",
                        color: "var(--text)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      ← {prevRule.id}
                    </button>
                  ) : <div />}

                  {nextRule && (
                    <button
                      type="button"
                      onClick={() => handleSelectRule(nextRule.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--sunken)",
                        border: "1px solid var(--line)",
                        borderRadius: "var(--radius-control)",
                        color: "var(--text)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {nextRule.id} →
                    </button>
                  )}
                </div>
              </div>
            </main>
          </div>
        </Container>
      </section>
    </div>
  );
}
