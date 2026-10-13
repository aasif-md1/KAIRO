import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Open Source Licenses - KAIRO",
  description:
    "Open source licenses, third-party software attributions, and legal acknowledgments for KAIRO.",
};

const OPEN_SOURCE_PACKAGES = [
  {
    name: "Tree-sitter & Official Grammars",
    description: "Incremental parsing library and concrete syntax tree grammars for Python, JavaScript, and TypeScript.",
    license: "MIT License",
    author: "Max Brunsfeld and Tree-sitter contributors",
    url: "https://tree-sitter.github.io",
  },
  {
    name: "IBM Plex Sans & IBM Plex Mono",
    description: "Corporate open source typography family used for interface text and code snippet rendering.",
    license: "SIL Open Font License 1.1",
    author: "IBM Corporation",
    url: "https://www.ibm.com/plex",
  },
  {
    name: "FastAPI",
    description: "Modern, high-performance web framework for building the KAIRO backend REST API.",
    license: "MIT License",
    author: "Sebastián Ramírez (tiangolo)",
    url: "https://fastapi.tiangolo.com",
  },
  {
    name: "Next.js",
    description: "The React framework for the web, powering the KAIRO frontend dashboard and report renderer.",
    license: "MIT License",
    author: "Vercel, Inc.",
    url: "https://nextjs.org",
  },
  {
    name: "React",
    description: "JavaScript library for building declarative user interfaces.",
    license: "MIT License",
    author: "Meta Platforms, Inc.",
    url: "https://react.dev",
  },
  {
    name: "SQLAlchemy",
    description: "Python SQL toolkit and Object Relational Mapper for multi-tenant database persistence.",
    license: "MIT License",
    author: "Mike Bayer and SQLAlchemy authors",
    url: "https://www.sqlalchemy.org",
  },
  {
    name: "Pydantic",
    description: "Data validation and settings management using Python type hints.",
    license: "MIT License",
    author: "Samuel Colvin and Pydantic contributors",
    url: "https://pydantic.dev",
  },
  {
    name: "PyCA Cryptography",
    description: "Cryptographic recipes and primitives powering envelope encryption (AES-256-GCM).",
    license: "Apache License 2.0 / BSD 3-Clause",
    author: "The Python Cryptographic Authority",
    url: "https://cryptography.io",
  },
  {
    name: "Uvicorn & Starlette",
    description: "Lightning-fast ASGI web server and lightweight toolkit.",
    license: "BSD 3-Clause License",
    author: "Encode OSS Ltd.",
    url: "https://www.encode.io",
  },
  {
    name: "PyYAML",
    description: "YAML parser and emitter for Release 1 static security rule specifications.",
    license: "MIT License",
    author: "Kirill Simonov and PyYAML contributors",
    url: "https://pyyaml.org",
  },
];

export default function LicensesPage() {
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
          Credits &amp; Open Source
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Open Source Licenses
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
          KAIRO is proudly built on open source foundations. We gratefully acknowledge these foundational projects.
        </p>
      </div>

      {/* Intro note */}
      <div
        className="card"
        style={{
          marginBottom: "2rem",
          backgroundColor: "var(--surface)",
          padding: "1.25rem",
        }}
      >
        <p style={{ fontSize: "0.875rem", lineHeight: 1.6, margin: 0, color: "var(--text-2)" }}>
          The following third-party software libraries, font packages, and tools are utilized in the construction
          and operation of KAIRO. Each package is licensed by its respective authors under open source software
          licenses compatible with commercial and private deployment.
        </p>
      </div>

      {/* Dependencies List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {OPEN_SOURCE_PACKAGES.map((pkg) => (
          <div key={pkg.name} className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "0.35rem",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.125rem", margin: 0, fontWeight: 600 }}>{pkg.name}</h2>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                  Copyright © {pkg.author}
                </div>
              </div>

              <span
                style={{
                  padding: "0.15rem 0.5rem",
                  borderRadius: "var(--radius-control)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  backgroundColor: "var(--sunken)",
                  color: "var(--text)",
                  border: "1px solid var(--line)",
                }}
              >
                {pkg.license}
              </span>
            </div>

            <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.5, margin: "0.5rem 0 0.75rem 0" }}>
              {pkg.description}
            </p>

            <div>
              <a
                href={pkg.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.8125rem", color: "var(--accent)" }}
              >
                Visit Project Repository &rarr;
              </a>
            </div>
          </div>
        ))}
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
