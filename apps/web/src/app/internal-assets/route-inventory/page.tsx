import React from "react";

export default function AssetRouteInventoryScreen() {
  const routes = [
    { method: "GET", path: "/api/health", authStatus: "Absent", authDetail: "Public healthcheck endpoint", file: "server.js:18" },
    { method: "POST", path: "/api/auth/login", authStatus: "Absent", authDetail: "Public authentication gateway", file: "routes/auth.js:22" },
    { method: "GET", path: "/api/user/profile", authStatus: "Detected", authDetail: "Bearer token verified in middleware", file: "routes/user.js:14" },
    { method: "POST", path: "/api/orders", authStatus: "Absent", authDetail: "State mutation route without middleware check", file: "routes/orders.js:42" },
    { method: "GET", path: "/api/orders/:id", authStatus: "Detected", authDetail: "Token verified, ownership check omitted", file: "routes/orders.js:88" },
    { method: "POST", path: "/webhook/stripe", authStatus: "Unknown", authDetail: "Custom HMAC signature verification", file: "routes/webhooks.js:11" },
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
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--line)",
            marginBottom: "24px",
          }}
        >
          <div>
            <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontWeight: 600, marginBottom: "4px" }}>
              LAYER 1: STATIC INVENTORY
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 600, margin: 0 }}>Route Authentication Signals</h1>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--muted)" }}>
              Static AST traversal of route declarations and middleware attachment chains.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
            <span style={{ padding: "4px 8px", backgroundColor: "var(--status-fixed-bg)", color: "var(--status-fixed)", borderRadius: "var(--radius-label)" }}>
              2 Detected
            </span>
            <span style={{ padding: "4px 8px", backgroundColor: "var(--sev-high-bg)", color: "var(--sev-high)", borderRadius: "var(--radius-label)" }}>
              3 Absent
            </span>
            <span style={{ padding: "4px 8px", backgroundColor: "var(--sunken)", color: "var(--muted)", borderRadius: "var(--radius-label)" }}>
              1 Unknown
            </span>
          </div>
        </div>

        {/* Table */}
        <div style={{ border: "1px solid var(--line)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--sunken)", borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>HTTP</th>
                <th style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>ROUTE PATH</th>
                <th style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>AUTH SIGNAL</th>
                <th style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>DETAIL</th>
                <th style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>SOURCE FILE</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, i) => (
                <tr
                  key={r.path}
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--bg)",
                    borderBottom: i < routes.length - 1 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "12px" }}>
                    {r.method}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                    {r.path}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        padding: "2px 6px",
                        borderRadius: "var(--radius-label)",
                        fontWeight: 600,
                        backgroundColor:
                          r.authStatus === "Detected"
                            ? "var(--status-fixed-bg)"
                            : r.authStatus === "Absent"
                            ? "var(--sev-high-bg)"
                            : "var(--sunken)",
                        color:
                          r.authStatus === "Detected"
                            ? "var(--status-fixed)"
                            : r.authStatus === "Absent"
                            ? "var(--sev-high)"
                            : "var(--muted)",
                      }}
                    >
                      {r.authStatus}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-2)" }}>{r.authDetail}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--muted)" }}>
                    {r.file}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
