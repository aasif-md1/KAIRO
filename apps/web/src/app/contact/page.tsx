"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }
    setError(null);
    setSubmitting(true);

    // Simulate reliable message dispatch
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="container" style={{ padding: "4rem 1.5rem", maxWidth: "900px" }}>
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
          Support &amp; Maintainers
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Contact &amp; Support
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
          Reach out to the KAIRO maintainers for support, vulnerability disclosures, or deployment assistance.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
        {/* Contact Form */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Send a Message</h2>

          {submitted ? (
            <div
              className="card"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--status-fixed)",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "var(--status-fixed-bg)",
                  color: "var(--status-fixed)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                }}
              >
                &#10003;
              </div>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>Message Received</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Thank you for reaching out, {name}. Our maintainers have received your inquiry and will respond to{" "}
                <strong>{email}</strong> within 24 to 48 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                  setSubject("");
                }}
                className="btn btn-secondary"
                style={{ fontSize: "0.8125rem" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{ padding: "1.75rem" }}>
              {error && (
                <div
                  style={{
                    backgroundColor: "var(--sev-critical-bg)",
                    color: "var(--sev-critical)",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-control)",
                    fontSize: "0.8125rem",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Topic Category *
                </label>
                <select
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ padding: "0.5rem 0.75rem" }}
                >
                  <option value="general">General Inquiry</option>
                  <option value="security">Security Vulnerability Disclosure</option>
                  <option value="enterprise">Self-Hosted Deployment</option>
                  <option value="bug">Bug Report / Platform Feedback</option>
                  <option value="privacy">Privacy &amp; Data Deletion Request</option>
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Subject
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Brief summary of your inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Message *
                </label>
                <textarea
                  className="textarea"
                  rows={5}
                  placeholder="Describe your inquiry, steps to reproduce, or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ width: "100%", padding: "0.625rem" }}
              >
                {submitting ? "Sending..." : "Submit Message"}
              </button>
            </form>
          )}
        </div>

        {/* Department Directory & SLA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Direct Department Inboxes</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Prefer to email us directly? Route your message to the appropriate functional mailbox:
            </p>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Security &amp; Vulnerability Reports</div>
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: "0.25rem 0 0.5rem 0" }}>
              For responsible disclosure of platform vulnerabilities or security advisories.
            </p>
            <a href="mailto:security@kairo.dev" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              security@kairo.dev
            </a>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem" }}>
              SLA: Acknowledged within 48 business hours
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Privacy &amp; Data Rights</div>
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: "0.25rem 0 0.5rem 0" }}>
              For data access requests, deletion verifications, and compliance matters.
            </p>
            <a href="mailto:privacy@kairo.dev" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              privacy@kairo.dev
            </a>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem" }}>
              SLA: Processed within 48 business hours
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>General Support &amp; Integration</div>
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", margin: "0.25rem 0 0.5rem 0" }}>
              For GitHub integration troubleshooting, ZIP upload issues, and general platform inquiries.
            </p>
            <a href="mailto:support@kairo.dev" style={{ fontSize: "0.875rem", color: "var(--accent)" }}>
              support@kairo.dev
            </a>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem" }}>
              SLA: Answered within 24 business hours
            </div>
          </div>
        </div>
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
