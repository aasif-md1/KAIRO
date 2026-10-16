"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";

interface SoftwarePackage {
  name: string;
  version: string;
  license: string;
  copyright: string;
  url: string;
  description: string;
}

const PACKAGES: SoftwarePackage[] = [
  {
    name: "React & React DOM",
    version: "19.3.0",
    license: "MIT",
    copyright: "Meta Platforms, Inc. and affiliates",
    url: "https://react.dev",
    description: "Declarative user interface rendering engine.",
  },
  {
    name: "Next.js",
    version: "16.4.0",
    license: "MIT",
    copyright: "Vercel, Inc.",
    url: "https://nextjs.org",
    description: "React application framework with server-side rendering and routing.",
  },
  {
    name: "Lucide React",
    version: "1.55.0",
    license: "ISC",
    copyright: "Lucide Project Contributors",
    url: "https://lucide.dev",
    description: "Consistent stroke icon library rendered at 1.75 stroke width.",
  },
  {
    name: "Simple Icons",
    version: "14.10.0",
    license: "CC0 1.0 Universal",
    copyright: "Simple Icons Contributors",
    url: "https://simpleicons.org",
    description: "Monochrome SVG brand and framework icons.",
  },
  {
    name: "IBM Plex Fonts (Sans & Mono)",
    version: "6.4.1",
    license: "SIL Open Font License 1.1",
    copyright: "IBM Corporation and Mike Abbink",
    url: "https://www.ibm.com/plex",
    description: "Typography family for UI body text and monospace code snippets.",
  },
  {
    name: "Tree-sitter",
    version: "0.22.6",
    license: "MIT",
    copyright: "Max Brunsfeld and Tree-sitter contributors",
    url: "https://tree-sitter.github.io",
    description: "Incremental parsing library and syntax tree generator.",
  },
  {
    name: "FastAPI",
    version: "0.115.0",
    license: "MIT",
    copyright: "Sebastián Ramírez",
    url: "https://fastapi.tiangolo.com",
    description: "Modern web framework for building backend audit microservices.",
  },
  {
    name: "Pydantic",
    version: "2.9.2",
    license: "MIT",
    copyright: "Samuel Colvin and Pydantic contributors",
    url: "https://pydantic.dev",
    description: "Data validation and settings management using Python type hints.",
  },
  {
    name: "Playwright",
    version: "1.64.0",
    license: "Apache-2.0",
    copyright: "Microsoft Corporation",
    url: "https://playwright.dev",
    description: "Automated browser runner for marketing asset generation.",
  },
  {
    name: "TypeScript",
    version: "5.9.3",
    license: "Apache-2.0",
    copyright: "Microsoft Corporation",
    url: "https://www.typescriptlang.org",
    description: "Typed JavaScript superset for compile-time verification.",
  },
];

export default function LicensesPage() {
  const [search, setSearch] = useState("");
  const [selectedLicense, setSelectedLicense] = useState("all");

  const licenseCounts: Record<string, number> = {};
  for (const pkg of PACKAGES) {
    licenseCounts[pkg.license] = (licenseCounts[pkg.license] || 0) + 1;
  }
  const licenseTypes = Object.keys(licenseCounts).sort();

  const filtered = PACKAGES.filter((pkg) => {
    if (selectedLicense !== "all" && pkg.license !== selectedLicense) return false;
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      return (
        pkg.name.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q) ||
        pkg.copyright.toLowerCase().includes(q) ||
        pkg.license.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ position: "relative" }}>
      {/* Header and Bill of Materials */}
      <section style={{ paddingTop: "64px", paddingBottom: "32px", borderBottom: "1px solid var(--line)" }}>
        <Container>
          <div style={{ maxWidth: "840px" }}>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>
              Third-party components
            </div>
            <h1 className="hero-h1" style={{ margin: "0 0 16px" }}>
              Software Bill of Materials
            </h1>
            <p className="lead-p" style={{ margin: 0 }}>
              KAIRO incorporates open-source components and font software. Every shipped runtime dependency and font family is listed below with its respective open-source license and copyright attribution.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Table View */}
      <section style={{ paddingTop: "32px", paddingBottom: "96px" }}>
        <Container>
          {/* Full-width Toolbar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-card)",
              marginBottom: "24px",
            }}
          >
            {/* Search Input */}
            <div style={{ flex: "1 1 280px", maxWidth: "380px" }}>
              <label htmlFor="license-search" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", border: 0 }}>
                Search packages
              </label>
              <input
                id="license-search"
                type="text"
                placeholder="Search package name, license, copyright..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "8px 12px",
                  backgroundColor: "var(--sunken)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-control)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text)",
                }}
              />
            </div>

            {/* License Filter Buttons and Result Count */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setSelectedLicense("all")}
                style={{
                  height: "32px",
                  padding: "0 12px",
                  borderRadius: "var(--radius-control)",
                  border: "1px solid " + (selectedLicense === "all" ? "var(--accent)" : "var(--line)"),
                  backgroundColor: selectedLicense === "all" ? "var(--accent-subtle)" : "var(--sunken)",
                  color: selectedLicense === "all" ? "var(--accent-text)" : "var(--text)",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  fontWeight: selectedLicense === "all" ? 600 : 400,
                }}
              >
                All ({PACKAGES.length})
              </button>
              {licenseTypes.map((lic) => {
                const count = licenseCounts[lic];
                const active = selectedLicense === lic;
                return (
                  <button
                    key={lic}
                    type="button"
                    onClick={() => setSelectedLicense(lic)}
                    style={{
                      height: "32px",
                      padding: "0 12px",
                      borderRadius: "var(--radius-control)",
                      border: "1px solid " + (active ? "var(--accent)" : "var(--line)"),
                      backgroundColor: active ? "var(--accent-subtle)" : "var(--sunken)",
                      color: active ? "var(--accent-text)" : "var(--text)",
                      fontSize: "12px",
                      fontFamily: "var(--font-mono)",
                      cursor: "pointer",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {lic} ({count})
                  </button>
                );
              })}
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                  marginLeft: "12px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Showing {filtered.length} of {PACKAGES.length} packages
              </div>
            </div>
          </div>

          {/* 4-Column Table with Sticky Header */}
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-card)",
              overflow: "hidden",
              backgroundColor: "var(--surface)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "var(--sunken)",
                      borderBottom: "1px solid var(--line)",
                      position: "sticky",
                      top: "72px",
                      zIndex: 10,
                    }}
                  >
                    <th style={{ padding: "16px 20px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em", color: "var(--text)", width: "32%" }}>
                      Component and version
                    </th>
                    <th style={{ padding: "16px 20px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em", color: "var(--text)", width: "18%" }}>
                      License
                    </th>
                    <th style={{ padding: "16px 20px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em", color: "var(--text)", width: "32%" }}>
                      Copyright and authors
                    </th>
                    <th style={{ padding: "16px 20px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em", color: "var(--text)", width: "18%" }}>
                      Repository
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: "48px 20px", textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>
                        No packages match your search query.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((pkg, idx) => (
                      <tr
                        key={pkg.name}
                        style={{
                          minHeight: "56px",
                          borderBottom: idx < filtered.length - 1 ? "1px solid var(--line)" : "none",
                          backgroundColor: idx % 2 === 0 ? "var(--surface)" : "var(--bg)",
                          transition: "background-color 120ms ease",
                        }}
                      >
                        <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                            <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)" }}>
                              {pkg.name}
                            </span>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                              v{pkg.version}
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: "18px" }}>
                            {pkg.description}
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                          <span
                            style={{
                              display: "inline-block",
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              padding: "4px 10px",
                              backgroundColor: "var(--sunken)",
                              border: "1px solid var(--line)",
                              borderRadius: "var(--radius-control)",
                              color: "var(--text)",
                              fontWeight: 500,
                            }}
                          >
                            {pkg.license}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", verticalAlign: "top", color: "var(--text-2)", fontSize: "14px", lineHeight: "20px" }}>
                          {pkg.copyright}
                        </td>
                        <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                          <a
                            href={pkg.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "13px",
                              color: "var(--accent-text)",
                              textDecoration: "underline",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            Source code ↗
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
