# KAIRO: Implementation Plan

Derived from TRD section 16 roadmap (milestones M0 to M5), PRD section 18 release plan, and the quality gates defined in both documents.

## Timeline Overview

| Phase | Weeks | Focus | Gate |
| --- | --- | --- | --- |
| M0 Foundations | 1-2 | Repository, CI, local stack, auth, intake, brand | Gate 0 |
| M1 Static Engine | 3-4 | Parsing, route inventory, detection rules | Gate 1 |
| M2 Logic Review | 5-6 | Context assembly, model interface, validation | Gate 2 |
| M3 Dynamic Testing | 7-9 | Sandbox, runner, test driver | Gate 3 |
| M4 Report and Web App | 10-11 | Report views, exports, legal pages, all screens | Gate 4 |
| M5 Hardening and Release | 12-13 | Self-scan, benchmarks, accessibility, runbooks | Gate 5 |

---

## M0: Foundations (Weeks 1-2)

### Tasks

| # | Task | Depends On | Deliverable |
| --- | --- | --- | --- |
| M0-01 | Initialize monorepo with uv (Python) and pnpm (JS) | None | pyproject.toml, pnpm-workspace.yaml, .gitignore |
| M0-02 | Set up repository structure (apps/, packages/, benchmark/, infra/, docs/) | M0-01 | Directory tree matching TRD section 5 |
| M0-03 | Configure linting and type checking (ruff, pyright, ESLint, TypeScript strict) | M0-01 | Config files, CI check |
| M0-04 | Configure import-linter for Python module boundaries | M0-03 | Import boundary rules |
| M0-05 | Set up Docker Compose for local dev (PostgreSQL, MinIO, Caddy) | M0-02 | infra/docker-compose.yml |
| M0-06 | **Procrastinate spike**: confirm transactional enqueue, SKIP LOCKED, leases, retries | M0-05 | Spike results, ADR-04 decision |
| M0-07 | Set up FastAPI application skeleton with health endpoints | M0-05 | apps/api/ with /health, /ready |
| M0-08 | Set up SQLAlchemy 2 + Alembic migrations | M0-07 | Database models, initial migration |
| M0-09 | Implement mock GitHub OAuth server for local dev | M0-07 | infra/mock-github/ |
| M0-10 | Implement GitHub OAuth sign-in flow (FR-A1, FR-A2) | M0-08, M0-09 | Auth routes, session management |
| M0-11 | Implement server-side sessions with __Host-kairo_session cookie | M0-10 | Session table, cookie config |
| M0-12 | Implement CSRF protection | M0-11 | Custom header check |
| M0-13 | Implement rate limiting with PostgreSQL counters | M0-08 | Rate limit middleware |
| M0-14 | Set up Next.js application with App Router, TypeScript strict | M0-02 | apps/web/ skeleton |
| M0-15 | Configure Tailwind CSS with design tokens from UI/UX Brief | M0-14 | tokens.css, tailwind.config.ts |
| M0-16 | Self-host IBM Plex Sans and IBM Plex Mono fonts (Latin subset) | M0-14 | Font files, preload config |
| M0-17 | Create brand assets from icon.png (favicon set, SVG reconstruction, social preview) | None | Brand pack in apps/web/ |
| M0-18 | Implement header and footer components (all five footer links) | M0-15, M0-17 | Shared layout components |
| M0-19 | Implement sign-in page (P-02), welcome/terms page (A-01) | M0-10, M0-18 | Web pages |
| M0-20 | Implement project intake: create project from GitHub repo | M0-10, M0-08 | API routes, web pages (A-03, A-04) |
| M0-21 | Implement project intake: ZIP upload with safe extraction | M0-08 | API route, web page (A-05) |
| M0-22 | Implement terms acceptance with version + content hash storage (LR-4) | M0-11 | Acceptance recording |
| M0-23 | Create initial benchmark seed applications | None | benchmark/ folder |
| M0-24 | Implement ownership dependency on all project-scoped routes | M0-08 | Authorization middleware |
| M0-25 | Write cross-user access matrix test | M0-24 | Security test |
| M0-26 | Set up CI pipeline (GitHub Actions) | M0-03 | .github/workflows/ |
| M0-27 | Create .env.example with all variables documented | M0-05 | .env.example |
| M0-28 | Implement message catalog (messages/en.json) | M0-14 | Externalized strings |
| M0-29 | Implement error pages (P-09, P-10) and error boundaries | M0-18 | Error handling |
| M0-30 | Implement home page (P-01) | M0-18 | Public landing page |

### Gate 0: Criteria

- End-to-end test of sign-in and intake passes on a sample repository
- CI pipeline is green
- Mock GitHub OAuth works for dev and tests
- A project can be created from both GitHub repo and ZIP upload
- Cross-user access test passes

---

## M1: Static Engine (Weeks 3-4)

### Tasks

| # | Task | Depends On | Deliverable |
| --- | --- | --- | --- |
| M1-01 | Set up tree-sitter with Python, JavaScript, TypeScript, TSX grammars | M0 | packages/analysis/ parser module |
| M1-02 | Implement file discovery with ignore patterns and limits | M1-01 | File walker with defaults |
| M1-03 | Implement stack detection from manifests (package.json, pyproject.toml, etc.) | M1-02 | Framework detector |
| M1-04 | Implement Express framework extractor (routes, middleware) | M1-01 | Route extraction for Express |
| M1-05 | Implement Next.js framework extractor (route handlers, server actions) | M1-01 | Route extraction for Next.js |
| M1-06 | Implement FastAPI framework extractor (decorators, Depends) | M1-01 | Route extraction for FastAPI |
| M1-07 | Implement Flask framework extractor (decorators, blueprints) | M1-01 | Route extraction for Flask |
| M1-08 | Implement route inventory with three-valued signals (detected/absent/unknown) | M1-04 to M1-07 | Route inventory model |
| M1-09 | Implement authentication signal resolver | M1-08 | Auth detection |
| M1-10 | Implement ownership and role check signal resolver | M1-08 | Ownership/role detection |
| M1-11 | Create YAML rule format and JSON Schema validator | M1-08 | Rule schema |
| M1-12 | Implement rule test runner (vulnerable + safe fixture pairs) | M1-11 | packages/rules test harness |
| M1-13 | Write rules for V01 (Missing authentication) | M1-11, M1-12 | Rule files + fixtures |
| M1-14 | Write rules for V05 (Hardcoded secrets) | M1-11, M1-12 | Rule files + fixtures |
| M1-15 | Write rules for V06 (Token misuse) | M1-11, M1-12 | Rule files + fixtures |
| M1-16 | Write rules for V07 (Weak credential handling) | M1-11, M1-12 | Rule files + fixtures |
| M1-17 | Write rules for V08 (Injection through string-built queries) | M1-11, M1-12 | Rule files + fixtures |
| M1-18 | Write rules for V10 (Permissive CORS) | M1-11, M1-12 | Rule files + fixtures |
| M1-19 | Write rules for V13 (Debug mode) | M1-11, M1-12 | Rule files + fixtures |
| M1-20 | Write rules for V03 (Role tampering, static detection) | M1-11, M1-12 | Rule files + fixtures |
| M1-21 | Write rules for V04 (Client-side-only access control) | M1-11, M1-12 | Rule files + fixtures |
| M1-22 | Write rules for V09 (Missing rate limiting, static signals) | M1-11, M1-12 | Rule files + fixtures |
| M1-23 | Write rules for V11 (Missing row-level security) | M1-11, M1-12 | Rule files + fixtures |
| M1-24 | Write rules for V12 (Mass assignment, static detection) | M1-11, M1-12 | Rule files + fixtures |
| M1-25 | Integrate gitleaks for secrets detection (FR-S3) | M1-02 | Secrets scanner |
| M1-26 | Implement finding normalization and stable fingerprints (FR-F1, FR-F3) | M1-13 | packages/findings |
| M1-27 | Implement deterministic output (sorted results, versioned rule set) | M1-26 | Sorting + versioning |
| M1-28 | Implement static analysis worker stage | M0-06, M1-08, M1-26 | apps/worker/stages/static |
| M1-29 | Write property/fuzz tests for parsers and archive extraction | M1-01, M0-21 | Hypothesis tests |
| M1-30 | Add benchmark apps with known flaws for each rule | M1-13 to M1-24 | benchmark/ labeled apps |

### Gate 1: Criteria

- Every Release 1 static rule has a passing vulnerable and safe test
- Fuzz suite finds no crash in parsers or archive extraction
- Route inventory produces correct output for all four frameworks on sample apps
- Benchmark apps are labeled and the scoring script reports per-class results

---

## M2: Logic Review (Weeks 5-6)

### Tasks

| # | Task | Depends On | Deliverable |
| --- | --- | --- | --- |
| M2-01 | Implement ModelClient Protocol interface | M1 | packages/model_client/ |
| M2-02 | Implement DeepSeek adapter (V4 model names) | M2-01 | DeepSeek provider |
| M2-03 | Implement deterministic fake adapter for tests | M2-01 | Fake provider |
| M2-04 | Implement fail-closed provider gate by data class | M2-01 | Gate logic |
| M2-05 | Implement context assembly (handler + middleware + models, 2 levels) | M1-08 | Context builder |
| M2-06 | Implement redaction (secrets, PII, connection strings) | M2-05 | Redaction module |
| M2-07 | Create versioned system prompt | M2-05 | Prompt file |
| M2-08 | Implement random boundary token per request | M2-07 | Prompt construction |
| M2-09 | Implement JSON schema validation of model output | M2-01 | Schema validator |
| M2-10 | Implement citation line checking (FR-L3) | M2-09 | Citation validator |
| M2-11 | Implement route_id and affected_resource validation | M2-10 | Cross-reference checks |
| M2-12 | Implement token ceiling tracking per scan (FR-L9) | M2-01 | Token accounting |
| M2-13 | Implement response caching by context hash | M2-01 | Cache layer |
| M2-14 | Create adversarial injection corpus (comments, strings, filenames) | M2-07 | Test corpus |
| M2-15 | Implement logic review worker stage | M2-01 to M2-11 | apps/worker/stages/logic |
| M2-16 | Write schema and injection CI tests | M2-14 | Automated tests |
| M2-17 | Record first benchmark baseline | M2-15, M1-30 | Baseline results |
| M2-18 | Implement feature flag for logic review on user code | M2-04 | Configuration flag |

### Gate 2: Criteria

- Injection corpus and schema tests pass (no sample changes a verdict)
- First benchmark baseline is recorded with recall and precision per class
- Model output validation correctly discards malformed, uncited, and out-of-context findings
- Token ceiling correctly limits and reports partial results

---

## M3: Dynamic Testing (Weeks 7-9)

### Tasks

| # | Task | Depends On | Deliverable |
| --- | --- | --- | --- |
| M3-01 | Implement SandboxRuntime interface | M2 | Interface definition |
| M3-02 | Implement gVisor sandbox implementation | M3-01 | gVisor runtime (Linux only) |
| M3-03 | Implement dev sandbox implementation (hardened Docker) | M3-01 | Dev runtime with safety gates |
| M3-04 | Implement runner agent (polls API over private link) | M3-01 | apps/runner/ |
| M3-05 | Implement internal runner API endpoints | M3-04 | /internal/runner/v1/ routes |
| M3-06 | Implement sandbox network creation (internal-only bridge) | M3-02 | Network isolation |
| M3-07 | Implement allowlisting build proxy for package registries | M3-06 | Proxy container |
| M3-08 | Implement sidecar service provisioning (PostgreSQL, MySQL, Redis, MongoDB) | M3-06 | Sidecar management |
| M3-09 | Implement sandbox lifecycle (lease, build, run, test, teardown) | M3-02, M3-06, M3-08 | Full lifecycle |
| M3-10 | Implement health check and startup timeout (FR-D3) | M3-09 | Health poller |
| M3-11 | Implement test driver: Phase 0 (sessions, login flows) | M3-09 | packages/tester/ sessions |
| M3-12 | Implement test driver: Phase 1 (endpoint discovery from inventory + crawl) | M3-11 | Discovery module |
| M3-13 | Implement test driver: Phase 2 (baseline record creation) | M3-12 | Baseline phase |
| M3-14 | Implement test driver: Phase 3 tests for FR-D6 (open routes) | M3-13 | Unauthenticated access tests |
| M3-15 | Implement test driver: Phase 3 tests for FR-D7 (cross-account access) | M3-13 | IDOR/BOLA tests |
| M3-16 | Implement test driver: Phase 3 tests for FR-D8 (role tampering) | M3-13 | Privilege escalation tests |
| M3-17 | Implement test driver: Phase 4 (evidence collection and redaction) | M3-14 to M3-16 | Evidence module |
| M3-18 | Implement test driver: Phase 5 (cleanup) | M3-17 | Cleanup phase |
| M3-19 | Implement request budget and rate cap (2000 requests, 20/s) | M3-14 | Token bucket |
| M3-20 | Implement scan cancellation (heartbeat carries cancel flag) | M3-04 | Cancel flow |
| M3-21 | Implement encrypted job bundle for runner | M3-04 | Per-job encryption |
| M3-22 | Write sandbox conformance suite | M3-02 | Conformance tests |
| M3-23 | Create seeded vulnerable apps for V02 and V03 dynamic testing | M3-14 to M3-16 | Benchmark apps |
| M3-24 | Implement dynamic testing worker stage | M3-09, M3-17 | apps/worker/stages/dynamic |
| M3-25 | Write safety bounds tests (no DELETE on unowned records, rate caps) | M3-14 | Safety tests |

### Gate 3: Criteria

- V02 (BOLA) and V03 (role tampering) are confirmed on seeded applications
- Nothing observed outside the sandbox (conformance suite passes)
- Sandbox lifecycle completes correctly with startup failure, timeout, and cancellation
- Evidence is correctly redacted (no credentials in stored evidence)

---

## M4: Report and Web App (Weeks 10-11)

### Tasks

| # | Task | Depends On | Deliverable |
| --- | --- | --- | --- |
| M4-01 | Implement merge and rating stage (FR-F1, FR-F2) | M3, M2, M1 | apps/worker/stages/merge |
| M4-02 | Implement severity rubric from YAML (deterministic) | M4-01 | severity_rubric.yaml |
| M4-03 | Implement confidence assignment logic | M4-01 | Confidence rules |
| M4-04 | Implement finding status tracking (Open, Fixed, Dismissed) | M4-01 | Status history |
| M4-05 | Implement re-check endpoint and flow (FR-F5) | M4-04 | Re-check API + worker |
| M4-06 | Implement scan comparison (FR-F6) | M4-01 | Compare endpoint |
| M4-07 | Implement report data document (report.v1 JSON schema) | M4-01 | packages/reports |
| M4-08 | Implement report web view (A-09) with filters in URL | M4-07 | Report page |
| M4-09 | Implement finding detail view (A-10) | M4-08 | Finding page |
| M4-10 | Implement route inventory view (A-11) | M1-08 | Inventory page |
| M4-11 | Implement scan comparison view (A-12) | M4-06 | Compare page |
| M4-12 | Implement JSON export | M4-07 | Export endpoint |
| M4-13 | Implement SARIF 2.1.0 export with schema validation | M4-07 | SARIF serializer |
| M4-14 | Implement PDF export via headless Chromium | M4-08 | PDF generator |
| M4-15 | Implement share links (create, revoke, view) | M4-07 | Share endpoints + P-08 |
| M4-16 | Implement project settings pages (A-07, all tabs) | M0-20 | Settings UI |
| M4-17 | Implement scan progress page (A-08) with SSE | M0 | Progress UI |
| M4-18 | Implement project overview (A-06) with scan history | M0-20 | Overview page |
| M4-19 | Implement account pages (A-13, A-14, A-15) | M0-10 | Account UI |
| M4-20 | Implement data export (FR-A5) | M4-19 | Export archive endpoint |
| M4-21 | Implement account deletion (US-11, D-10) | M4-19 | Delete flow |
| M4-22 | Implement Privacy Policy page (P-03) with versioned content | M0-18 | Legal page |
| M4-23 | Implement Terms page (P-04) with versioned content | M0-18 | Legal page |
| M4-24 | Implement Security page (P-05) with security.txt | M0-18 | Security page + .well-known |
| M4-25 | Implement Contact page (P-06) | M0-18 | Contact page |
| M4-26 | Implement Licenses page (P-07) from SBOM | M0-18 | Licenses page |
| M4-27 | Implement operator console (O-01 to O-06) | M0-10 | Operator UI |
| M4-28 | Implement all 37 error/empty states (E-01 to E-37) | M0-28, M0-29 | Error states |
| M4-29 | Implement all 11 notification events (N-01 to N-11) | M4-17 | Notifications |
| M4-30 | Implement all 13 dialogs (D-01 to D-13) | M0-14 | Dialog components |
| M4-31 | Implement audit event logging (FR-A6) | M0-08 | Audit trail |
| M4-32 | Implement shared links management page (A-16) | M4-15 | Share management |
| M4-33 | Implement web manifest and metadata for all routes | M0-17 | SEO + manifest |

### Gate 4: Criteria

- Accessibility lint (axe-core) passes on all routes
- Brand guardrail lint passes (no gradients, no purple, no pills, no em dashes, no emoji, no sparkle)
- Every Must requirement for reports, legal pages, and the favicon set is complete
- All 37 error states render with the correct message text from the catalog
- Footer with five links appears on every page (Playwright crawl)

---

## M5: Hardening and Release (Weeks 12-13)

### Tasks

| # | Task | Depends On | Deliverable |
| --- | --- | --- | --- |
| M5-01 | Run KAIRO self-scan on its own codebase (NFR-S1) | M4 | Self-scan results |
| M5-02 | Run independent scans (OWASP ZAP baseline, Trivy, gitleaks) | M4 | Scan results |
| M5-03 | Run sandbox conformance suite on production-like runner | M3-22 | Conformance results |
| M5-04 | Run full benchmark with scoring script | M1-30, M2-17, M3-23 | Benchmark results |
| M5-05 | Run accessibility audit (axe-core + manual keyboard/screen reader) | M4 | Audit results |
| M5-06 | Run load tests (k6) against API and queue | M4 | Load test results |
| M5-07 | Write runbook: deploy and rollback | M4 | docs/runbooks/deploy.md |
| M5-08 | Write runbook: restore from backup | M0-05 | docs/runbooks/backup-restore.md |
| M5-09 | Write runbook: key rotation | M0-08 | docs/runbooks/key-rotation.md |
| M5-10 | Write runbook: rebuild a runner | M3-04 | docs/runbooks/rebuild-runner.md |
| M5-11 | Write runbook: provider outage | M2-01 | docs/runbooks/provider-outage.md |
| M5-12 | Write runbook: suspected sandbox escape | M3-02 | docs/runbooks/sandbox-escape.md |
| M5-13 | Write runbook: abuse report handling | M4-27 | docs/runbooks/abuse-report.md |
| M5-14 | Write runbook: erasure request | M4-21 | docs/runbooks/erasure-request.md |
| M5-15 | Write docs/OWNER_SETUP.md | All | Owner setup guide |
| M5-16 | Write docs/FINAL_REPORT.md | All | Final report |
| M5-17 | Fix any High/Critical findings from self-scan | M5-01, M5-02 | Fixed code |
| M5-18 | Generate OpenAPI document and validate | M0-07 | openapi.json |
| M5-19 | Produce software bill of materials | M4-26 | SBOM file |
| M5-20 | Final brand guardrail check (em dash search, gradient check, etc.) | M4 | Clean results |
| M5-21 | Run contrast-check script over all token pairs | M0-15 | Contrast results |
| M5-22 | Implement log-scrubbing canary test | M0-07 | NFR-S8 test |
| M5-23 | Run end-to-end Playwright tests in all target browsers | M4 | E2E results |

### Gate 5: Criteria

- KAIRO's own scan and independent scans show no open High or Critical findings
- Sandbox conformance suite passes
- Accessibility checks pass
- All Must requirements are complete
- Benchmark results are recorded
- Legal review status is documented (owner action)
- Runbooks are written and the restore test has been done

---

## Cut Order (if scope does not fit)

Following PRD section 17 (R9) and TRD section 20 (TR9):

1. **Cut Should items first:**
   - FR-A5 (data export), FR-A6 (audit events)
   - FR-S8 (client-side-only detection), FR-S9 (RLS detection), FR-S11 (inline suppression)
   - FR-L9 (token ceiling), FR-L10 (benchmark regression gate)
   - FR-D9 (rate limit testing), FR-D14 (seed command)
   - FR-F6 (scan comparison), FR-F7 (finding notes)
   - FR-R4 (SARIF export), FR-R5 (reviewed fix templates)

2. **Then reduce dynamic tests to FR-D6, FR-D7, FR-D8 only.**

3. **Then defer dark theme.**

4. **Then defer operator console beyond basic dashboard.**
