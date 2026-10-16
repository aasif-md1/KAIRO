import React from "react";

export default function AssetRepoPickerScreen() {
  const repositories = [
    { name: "acme-corp/acme-storefront-api", defaultBranch: "main", language: "JavaScript (Express)", active: true },
    { name: "acme-corp/identity-gateway", defaultBranch: "main", language: "TypeScript (Next.js)", active: false },
    { name: "acme-corp/payment-worker", defaultBranch: "master", language: "Python (FastAPI)", active: false },
    { name: "acme-corp/legacy-inventory", defaultBranch: "v2-stable", language: "Python (Flask)", active: false },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        padding: "32px",
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            paddingBottom: "20px",
            borderBottom: "1px solid var(--line)",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontWeight: 600, marginBottom: "4px" }}>
            STEP 1: REPOSITORY CONNECTION
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>Select a repository to audit</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--muted)" }}>
            KAIRO requests read-only archive access to analyze route code and configuration.
          </p>
        </div>

        {/* Search bar & filter */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--sunken)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-control)",
              padding: "8px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--text)",
            }}
          >
            <span style={{ color: "var(--muted)", marginRight: "8px" }}>search:</span>
            <span>acme-</span>
          </div>

          <div
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-control)",
              padding: "8px 14px",
              fontSize: "13px",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Org: acme-corp</span>
          </div>
        </div>

        {/* Repositories List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {repositories.map((repo) => (
            <div
              key={repo.name}
              className="card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                borderColor: repo.active ? "var(--accent)" : "var(--line)",
                backgroundColor: repo.active ? "var(--surface)" : "var(--card)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                    {repo.name}
                  </span>
                  {repo.active && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        padding: "2px 6px",
                        backgroundColor: "var(--accent-subtle)",
                        color: "var(--accent-text)",
                        borderRadius: "2px",
                      }}
                    >
                      Selected
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                  <span>branch: {repo.defaultBranch}</span>
                  <span>{repo.language}</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  style={{
                    backgroundColor: repo.active ? "var(--accent)" : "var(--sunken)",
                    color: repo.active ? "var(--accent-contrast)" : "var(--text)",
                    border: "1px solid " + (repo.active ? "var(--accent)" : "var(--line)"),
                    padding: "6px 14px",
                    borderRadius: "var(--radius-control)",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {repo.active ? "Start Audit" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Sample data
          </span>
        </div>
      </div>
    </div>
  );
}
