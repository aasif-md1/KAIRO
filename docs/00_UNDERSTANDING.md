# KAIRO: Product Understanding

## 1. Product Summary

KAIRO is a web platform that audits web applications built with AI coding assistants ("vibe coded" apps) for access-control and secret-handling flaws. Its users are non-expert developers (students, solo founders, freelancers) who shipped code they did not fully write or review.

A user signs in with GitHub, connects a repository (or uploads a ZIP), and KAIRO runs three analysis layers and merges the results into one plain-language report:

1. **Static analysis** parses the source with tree-sitter, builds a route inventory (listing each endpoint's method, path, middleware, and whether authentication/ownership/role checks were detected, absent, or unknown), and runs in-house YAML detection rules covering 13 vulnerability classes (V01-V13). Secrets detection uses gitleaks. All rules are written by the team (Semgrep registry rules are excluded due to licensing).

2. **AI-assisted logic review** sends redacted code context to a model provider through a single `ModelClient` interface, asking whether routes enforce authorization correctly. The model returns schema-validated JSON with cited lines. Findings are capped at Likely confidence until corroborated dynamically. A fail-closed provider gate keeps logic review disabled for user code until the owner approves a provider (LR-14).

3. **Dynamic testing** builds and runs the user's application in an isolated gVisor sandbox on a separate runner node, then exercises it with test accounts the user supplies. It tests for unauthenticated access (FR-D6), cross-account data access/IDOR (FR-D7), and role tampering (FR-D8). The runner holds no database or storage credentials. The sandbox has no external network at run time.

Findings are merged, deduplicated, rated by a deterministic severity rubric, and assigned a confidence level (Confirmed, Likely, Possible). The report includes plain-language explanations, framework-specific fixes, re-check actions, and a scope-and-limits statement that never claims security. Reports export as PDF, JSON, and SARIF 2.1.0.

The platform's own security, privacy, and honesty are as important as its features. Every project-scoped route enforces ownership. Source snapshots are encrypted and deleted within 24 hours. Legal pages (Privacy Policy, Terms, Security, Contact, Licenses) are present from day one. The brand is restrained: no gradients, no purple, no pills, no emoji, no hype, no em dashes, no AI branding.

---

## 2. Requirement Inventory

### 2.1 User Stories (US-01 to US-12)

| ID | Summary | Planned Module/Files |
| --- | --- | --- |
| US-01 | Sign in with GitHub | apps/api (auth routes), apps/web (P-02, A-01) |
| US-02 | Connect repositories read-only | apps/api (installations), apps/web (A-03, A-04) |
| US-03 | Upload a ZIP | apps/api (archive endpoint), apps/web (A-05) |
| US-04 | Supply start command and test accounts | apps/api (project config), apps/web (A-07) |
| US-05 | Confirm authorization before scan | apps/api (attestation), apps/web (D-01) |
| US-06 | See scan progress | apps/api (SSE, scan status), apps/web (A-08) |
| US-07 | Understand a finding | apps/web (A-09, A-10), packages/findings |
| US-08 | Re-check one fix | apps/api (recheck endpoint), apps/worker |
| US-09 | Dismiss or reopen a finding | apps/api (PATCH findings), apps/web (D-03, D-04) |
| US-10 | Export report | apps/worker (report generation), apps/web (D-07) |
| US-11 | Delete data | apps/api (DELETE /me), apps/web (A-15, D-10) |
| US-12 | Turn off AI review | apps/api (project config), apps/web (A-07 Review tab) |

### 2.2 Functional Requirements

| Group | IDs | Planned Module |
| --- | --- | --- |
| FR-A (Accounts) | FR-A1 to FR-A6 | apps/api/routers/auth, apps/api/services/session |
| FR-I (Intake) | FR-I1 to FR-I8 | apps/api/routers/projects, apps/worker/stages/prepare |
| FR-S (Static) | FR-S1 to FR-S11 | packages/analysis, packages/rules, apps/worker/stages/static |
| FR-L (Logic review) | FR-L1 to FR-L10 | packages/model_client, apps/worker/stages/logic |
| FR-D (Dynamic) | FR-D1 to FR-D14 | packages/tester, apps/runner, apps/worker/stages/dynamic |
| FR-F (Findings) | FR-F1 to FR-F7 | packages/findings, apps/worker/stages/merge |
| FR-O (Operations) | FR-O1 to FR-O4 | apps/api/routers/ops, apps/web (O-01 to O-06) |
| FR-R (Reports) | FR-R1 to FR-R9 | packages/reports, apps/worker/stages/report, apps/web (A-09) |

### 2.3 Non-Functional Requirements

| ID | Area | Planned Enforcement |
| --- | --- | --- |
| NFR-S1 to NFR-S8 | Platform security | CI pipeline, security tests, log-scrubbing test |
| NFR-P1 to NFR-P3 | Performance | Load tests, benchmark, performance budget |
| NFR-R1 to NFR-R3 | Reliability | Idempotent jobs, backup tests |
| NFR-A1 | Accessibility | axe-core in Playwright, manual walkthroughs |
| NFR-C1 | Compatibility | Playwright browser matrix |
| NFR-O1 | Operations | OpenTelemetry, Grafana, alert rules |
| NFR-M1 | Rule testing | Rule test runner in packages/rules |
| NFR-D1 | API docs | OpenAPI 3.1 from FastAPI |
| NFR-I1 | Internationalization | messages/en.json catalog |

### 2.4 Legal/Privacy Requirements

| ID | Summary | Enforcement |
| --- | --- | --- |
| LR-1 | Authorization confirmation before first scan | D-01 dialog, attestation table |
| LR-2 | Sandbox-only testing in Release 1 | FR-D13, no external URL acceptance |
| LR-3 | Privacy Policy at /privacy | Legal page with versioned content |
| LR-4 | Terms at /terms, acceptance recorded | Content hash + timestamp storage |
| LR-5 | Disclose model provider before logic review | D-11 dialog |
| LR-6 | Source retention 24h max, findings until deleted | Retention jobs |
| LR-7 | Strictly necessary cookies only | No cookie banner in R1 |
| LR-8 | /security page and security.txt | RFC 9116 file, build check |
| LR-9 | Data access, export, erasure | A-15, export endpoint, DELETE /me |
| LR-10 | License checking | Pipeline SBOM, /licenses page |
| LR-11 | Legal review before launch | Owner action |
| LR-12 | Incident response plan | Runbook |
| LR-13 | No working exploits in reports | Minimal reproduction only |
| LR-14 | Provider review before enabling | Feature flag, fail-closed gate |

### 2.5 Brand/Interface Guardrails

| ID | Rule | Enforcement |
| --- | --- | --- |
| BR-1 | No purple/violet, no gradient backgrounds | Style lint, hue check (250-300 deg) |
| BR-2 | No pill shapes, max 8px radius | Radius scale + lint |
| BR-3 | No em dashes anywhere | Repository search script |
| BR-4 | No scroll/parallax/cursor effects | ESLint rules, 200ms max duration |
| BR-5 | One icon family (Lucide), no emoji/sparkle | Import lint, Unicode check |
| BR-6 | No fabricated proof | Content review, lint for "trusted by" |
| BR-7 | No hype words, no exclamation marks | Banned word list check |
| BR-8 | No AI/stock imagery | Review process |
| BR-9 | No "Made with AI" badges | String search in CI |
| BR-10 | Purpose-designed favicon set | Build check for icon files |
| BR-11 | Unique titles, descriptions, lang attr | Test per route |
| BR-12 | Five footer links on every page | Playwright crawl assertion |
| BR-13 | No lorem ipsum or starter assets | String search |
| BR-14 | Written error/empty states | Error boundary per route segment |
| BR-15 | Accessible severity (words + shapes) | Contrast script, axe-core |

---

## 3. Conflicts, Ambiguities and Risks Found

### 3.1 Conflicts Between Documents

| # | Conflict | Resolution | Precedence |
| --- | --- | --- | --- |
| C-01 | The brand guide shows Deep Emerald #0E6B57 for the logo tile, but the drawn tiles measure ~#0B9079. The Design Brief separates them: #0E6B57 for buttons/accents, #0B9079 for the tile. | Follow the Design Brief: use both values as specified. Log as open question for owner to confirm. | Design Brief wins for visual |
| C-02 | The brand guide navbar shows "Home, Scan, Features, Pricing" but the App Flow header shows "Projects, Account" (signed in) and "Security, Sign in" (signed out). | Follow the App Flow for screen behavior. The guide is a brand reference, not a navigation spec. | App Flow wins for routes |
| C-03 | The PRD companion docs table says TRD/App Flow/Design Brief are "Not started", but they all exist. | The PRD was written first; companion doc statuses are stale. No action needed. | N/A |
| C-04 | The Design Brief proposes an "Appearance" setting (System/Light/Dark) on the Account screen, which the App Flow does not include. | Include it as a minor addition to A-13. The Design Brief says both themes are first-class. | Design Brief wins for visual |
| C-05 | The TRD says "worker leases last 15 minutes and runner leases last 2 minutes" but also says heartbeat renewal keeps them alive. The App Flow says E-24 fires after 15 minutes with no runner. | No conflict: 15-minute worker lease is the max before heartbeat timeout, 2-minute runner lease is the heartbeat interval, and 15-minute E-24 is the queue wait timeout. All consistent. | N/A |
| C-06 | TRD section 4 says "Next.js 16 line, which is the Active LTS release". Need to verify this is current. | Will check at project start. If Next.js 16 is not yet released or not LTS, will use the latest stable Next.js and log it. | TRD wins, with version verification |
| C-07 | PRD says "PostgreSQL 18" and TRD confirms. Need to verify PostgreSQL 18 exists. | Will check. If PG 18 is not released, use latest stable (likely 17) and log deviation. | TRD wins, with version verification |
| C-08 | The Design Brief Paper White open question: guide states #F2F0EA, swatch measures #FAF6EF. | Use stated #F2F0EA as the Brief specifies. | Design Brief wins |

### 3.2 Ambiguities

| # | Ambiguity | Decision |
| --- | --- | --- |
| A-01 | How GitHub App flows are tested: recorded fixtures or a local mock server? (TRD open question) | Use a local mock GitHub server for OAuth and App flows. This is explicitly called for in the user's instructions. |
| A-02 | Can a project choose the sidecar database version, or is one pinned? (TRD open question) | Pin one version per engine (latest stable) in Release 1. Simpler and safer. |
| A-03 | Should a re-check count toward the hourly scan limit? (App Flow open question) | Yes, as written in the App Flow. Keep it simple. |
| A-04 | Should a stopped scan produce a partial report? (App Flow open question) | No, as written. A stopped scan keeps its stage summary but does not produce a report. |
| A-05 | Operator console reachable only over WireGuard with hardware security key. For local dev, we need a simpler path. | In development, the ops routes are accessible with a dev operator session. Document this clearly. |
| A-06 | The Procrastinate queue library spike. | Will run the spike first. If it fails, fall back to Celery+Redis behind the same interface. |
| A-07 | DeepSeek V4 model names: deepseek-v4-flash and deepseek-v4-pro. | Use these identifiers. If they are not valid at project start, check DeepSeek docs and use current names. |
| A-08 | Whether dark theme ships in R1. | Ship both themes as the Design Brief specifies. |

### 3.3 Technical Risks

| # | Risk | Mitigation |
| --- | --- | --- |
| R-01 | gVisor does not run on Windows/macOS (development machines). | SandboxRuntime interface with a dev implementation using hardened plain Docker, gated behind ALLOW_INSECURE_DEV_SANDBOX=true and non-production environment. |
| R-02 | Scope may not fit the term. | Follow PRD cut order: Should items first, then reduce dynamic tests to FR-D6 to FR-D8. |
| R-03 | Next.js 16 or PostgreSQL 18 may not exist as described. | Verify and pin actual latest stable versions. |
| R-04 | Procrastinate may not handle the load. | Week-one spike with fallback to Celery+Redis. |
| R-05 | No model provider approved for user code yet. | Logic review stays disabled behind feature flag. Fake adapter for tests. DeepSeek for benchmark only. |

---

## 4. Assumptions

All assumptions are also recorded in docs/ASSUMPTIONS.md.

| # | Assumption | Reason |
| --- | --- | --- |
| AS-01 | Next.js and PostgreSQL versions will be pinned to whatever the latest stable release is at project start (may differ from "16" and "18" if those versions don't exist yet). | Versions cited in TRD need verification. |
| AS-02 | The local development environment uses Docker Compose with mock GitHub OAuth, MinIO, and PostgreSQL. No external accounts needed. | Stated in the user's instructions. |
| AS-03 | The Procrastinate spike will be the first task in M0. | TRD marks it as proposed (ADR-04). |
| AS-04 | gVisor sandbox code is written but only exercised on Linux CI runners or the production runner node. Local dev uses hardened Docker. | gVisor is Linux-only. |
| AS-05 | The tile SVG is a reconstruction and will be replaced by the designer's master vector. | Stated in the Design Brief. |
| AS-06 | Legal page content is draft-marked in development. Production build fails if draft markers remain. | Stated in the user's instructions. |
| AS-07 | The operator console uses a simplified auth mechanism in development (no hardware security key). | Hardware keys are impractical in dev. |
| AS-08 | Dark theme is included in Release 1 as the Design Brief specifies. | Design Brief open question; choosing to include it. |
| AS-09 | Share expiry choices are 1, 7, 14, 30 days as written in the App Flow. | App Flow open question; using as written. |
| AS-10 | A stopped scan does not produce a report, as the App Flow states. | App Flow open question; using as written. |
| AS-11 | Re-checks count toward the hourly scan limit. | App Flow open question; using as written. |
| AS-12 | One sidecar version is pinned per engine (no user choice in R1). | TRD open question; simpler approach. |
| AS-13 | IBM Plex Sans and IBM Plex Mono are available via npm as @ibm/plex. | Standard distribution channel. |
| AS-14 | The five footer links are: Privacy Policy, Terms and Conditions, Security, Contact, Licenses. | PRD BR-12, App Flow section 15. |
| AS-15 | Lucide icons are used with square caps, mitered joins, stroke 1.75. | Design Brief section 7. |

---

## 5. Documents Read and Confirmed

| Document | Status | Location |
| --- | --- | --- |
| PRD (Product Requirements Document) | Read completely, 843 lines | docs/spec/PRD.md |
| TRD (Technical Requirements Document) | Read completely, 1512 lines | docs/spec/TRD.md |
| App Flow | Read completely, 1294 lines | docs/spec/APP_FLOW.md |
| UI/UX Design Brief | Read completely, 995 lines | docs/spec/UI_UX_DESIGN_BRIEF.md |
| icon.png (Brand Identity Guide) | Viewed and analyzed, 1536x1024, 11 panels | icon.png |

All four specification documents and the brand asset are present and readable. The two missing companion documents (Backend Schema and Implementation Plan) will be produced as part of Phase 0.
