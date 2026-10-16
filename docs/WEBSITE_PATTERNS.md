# KAIRO Public Website: Reference Study and Pattern Catalog

This document records the comparative study of over 50 leading developer-facing, application security, identity, and trust websites. It catalogs industry-standard layout, typography, navigation, product presentation, and trust architecture patterns, and defines how each pattern applies to the redesign of the KAIRO public website.

---

## 1. Sites Studied by Category

### Application and Code Security
- **Snyk** (snyk.io): Developer-first security. Multi-column header, vulnerability database navigation, rich code remediation callouts, clear severity tags (Critical, High, Medium, Low).
- **Semgrep** (semgrep.dev): Rule-based static engine. Interactive rule playground, split hero with live rule syntax, framework support badges, calm technical tone.
- **GitHub Advanced Security** (github.com/features/security): Native code scanning, secret scanning alerts, pull request annotation imagery, strict compliance documentation.
- **GitLab Security** (about.gitlab.com/stages-devops-lifecycle/security): Security dashboard views, pipeline stages diagram, vulnerability report exports (JSON, CSV).
- **SonarQube / SonarSource** (sonarsource.com): Clean code taxonomy, quality gates, issue breakdown by severity and remediation effort.
- **Checkmarx** (checkmarx.com): Enterprise AST, interactive threat matrix, structured compliance mapping.
- **Veracode** (veracode.com): Application risk management, state of software security reports, verified directory.
- **Aikido Security** (aikido.dev): Modern developer UI, no-bloat pledge, triage speed focus, high-density finding cards, calm dark theme.
- **Socket** (socket.dev): Package risk analyzer, alert cards with real package diffs and install lifecycle hooks, honest capability breakdown.
- **Endor Labs** (endorlabs.com): Dependency lifecycle, dependency graph diagrams, reachability analysis explanations.
- **Cycode** (cycode.com): Complete pipeline security, hardcoded secret visualization, governance audit trail.
- **Arnica** (arnica.io): Pipeline secret scanning, real-time developer feedback banners, zero-friction integration.
- **Mend** (mend.io): Automated dependency updates, license compliance matrix, vulnerability triage.
- **Aqua Trivy** (aquasec.com/products/trivy): Open-source scanner, terminal output previews, clear CLI flag documentation.
- **JFrog** (jfrog.com): Binary repository security, artifact provenance verification, multi-layer scanning.
- **Chainguard** (chainguard.dev): Minimal secure base images, zero known CVE pledges, software bill of materials (SBOM) focus.

### Dynamic and Testing Security
- **PortSwigger / Burp Suite** (portswigger.net): Request and response tampering inspection panels, raw HTTP headers, verifiable proof-of-concept steps.
- **OWASP ZAP** (zaproxy.org): Automated web vulnerability scanner, active versus passive scan comparison, community rule repository.
- **StackHawk** (stackhawk.com): Developer-first DAST, CI/CD pipeline integration screenshots, request/response replay logs.
- **Escape** (escape.tech): API security scanner, route inventory table, business logic flaw detection graphics.
- **Detectify** (detectify.com): Surface monitoring, vulnerability disclosure feeds, ethical hacker community sourcing.
- **Intruder** (intruder.io): Attack surface monitoring, clean finding reports, plain-language risk summaries.
- **Invicti** (invicti.com): Proof-based dynamic scanning, verified exploitation reports, vulnerability confirmation metrics.
- **Pentest-Tools** (pentest-tools.com): Web testing platform, downloadable sample reports (PDF/JSON), tool chaining diagrams.

### Secrets and Identity
- **GitGuardian** (gitguardian.com): Hardcoded secrets detection, perimeter monitoring, incident remediation workflow.
- **Truffle Security / TruffleHog** (trufflesecurity.com): Secret scanning engine, verified key testing, live entropy detection terminal blocks.
- **1Password** (1password.com): Security design whitepapers, encryption key lifecycle graphics, zero-knowledge architecture diagrams.
- **Doppler** (doppler.com): Secret ops platform, CLI sync demos, environment-specific key inheritance tables.
- **Clerk** (clerk.com): Authentication components, session token lifecycle, clean split-hero layout, dark/light token consistency.
- **Auth0** (auth0.com): Identity platform, protocol flow charts (OAuth 2.0 / OIDC), extensive developer quickstarts.
- **WorkOS** (workos.com): Developer-facing enterprise SSO, high-contrast monospace code blocks, architectural modularity.
- **Stytch** (stytch.com): Passwordless auth, API-first documentation, raw JSON payload inspections.

### AI-Era Code Review and Security
- **Corgea** (corgea.com): AI-powered vulnerability triage, side-by-side patch diffs, false-positive reduction claims.
- **ZeroPath** (zeropath.com): Automated vulnerability fixing, direct code patch reviews, deterministic validation checks.
- **Pixee** (pixee.ai): Automated code hardening pull requests, rule catalogs with before/after snippets.
- **DryRun Security** (dryrun.security): Context-aware code review, change-impact scoring, developer Slack notification previews.
- **Codacy** (codacy.com): Static analysis platform, code quality coverage dashboard, pull request gate enforcement.
- **DeepSource** (deepsource.com): Clean developer UI, autofocus on autofix, strict zero-noise threshold.
- **CodeRabbit** (coderabbit.ai): Pull request review summaries, sequence diagrams of code logic, line-by-line comment previews.

### Bug Bounty and Trust
- **HackerOne** (hackerone.com): Vulnerability coordination, responsible disclosure policy standards, response timeline metrics.
- **Bugcrowd** (bugcrowd.com): Crowdsourced testing, standardized vulnerability rating taxonomy (VRT), researcher safe harbor framing.
- **Cobalt** (cobalt.io): Pentest-as-a-service, findings timeline, evidence attachment viewer.
- **Synack** (synack.com): Crowdsourced penetration testing, continuous security validation, auditable pentest logs.

### Platform and Observability
- **Sentry** (sentry.io): Error tracking, breadcrumb timelines, stack trace inspection with inline source code context.
- **Datadog Security** (datadoghq.com): Cloud SIEM, threat monitoring graphs, rule expression builders.
- **Grafana** (grafana.com): Observability dashboards, panel layouts, granular permission controls.
- **PostHog** (posthog.com): Transparent product architecture, self-hosted vs cloud comparison tables, public handbook model.
- **Wiz** (wiz.io): Cloud security graph, cross-layer correlation, toxic combinations breakdown.

### Developer-Product Design Benchmarks
- **Linear** (linear.app): Keyboard-first ergonomics, crisp 1 px borders, precision typography, dark/light coherence, restrained color accents.
- **Vercel** (vercel.com): High-contrast monochrome layout, segmented controls, sticky navigation bar, framework support cards.
- **Stripe** (stripe.com): Uncompromising typography hierarchy, interactive code/API documentation, multi-column navigation, rigorous legal footers.
- **Resend** (resend.com): Minimalist developer UX, monochrome code panels, instant copy-to-clipboard patterns, clean light/dark mode.
- **Railway** (railway.com): Infrastructure deployment cards, service topology diagrams, tabular pricing and limits.
- **Render** (render.com): Cloud application hosting, clear service status indicator, structured docs sidebar.
- **Fly.io** (fly.io): Engineering-driven candid voice, terminal session transcript visuals, plain-language architectural trade-offs.
- **Tailscale** (tailscale.com): WireGuard networking, plain-English security architecture, clear data retention and key ownership policies.
- **Cloudflare** (cloudflare.com): Edge security network, global infrastructure maps, standardized security disclosure terms.
- **Neon** (neon.tech): Serverless Postgres, database branching diagrams, interactive SQL preview console.
- **Supabase** (supabase.com): Open-source Firebase alternative, table editor screenshot showcase, architecture data-flow graphics.
- **Raycast** (raycast.com): Precision Mac/Windows tool, shortcut key visualization, crisp command palette window frames.
- **Warp** (warp.dev): Modern terminal, block-based output inspection, collaborative workflow graphics.
- **Cal.com** (cal.com): Open-source scheduling, transparent license disclosures, modular settings UI.
- **Plausible** (plausible.io): Privacy-first analytics, no-cookie declaration banner, publicly verifiable architecture.
- **Netlify** (netlify.com): Git-based workflow steps, deploy preview status widgets, branch deploy controls.
- **GitHub** (github.com): Sticky repository headers, tabbed navigation, markdown rendering standards, primer design system tokens.
- **Notion** (notion.so): Clean modular canvas, nested table of contents, accessible callout banners.
- **Figma** (figma.com): Precision vector canvas, layered inspector panels, multi-role workspace governance.

### Legal, Security, and Privacy Page Benchmarks
- **Stripe Legal / Privacy**: Summary key points box at top of terms, revision history with dated archives, clear data controller entity details.
- **Linear Terms / Security**: Plain-language summaries preceding complex clauses, clean typography with 65-72 character line width, dedicated subprocessor table.
- **Vercel Security / Privacy**: Architecture overview with trust boundaries, responsible disclosure program targets, customer data flow diagram.
- **Tailscale Security**: Zero-knowledge encryption architecture, data collection tables (what we collect vs what we do not collect), security.txt link.
- **Plausible Data Policy**: Plain single-page explanation of data collected, clear declaration that no cookies or persistent identifiers are used.
- **1Password Trust**: Security whitepaper summary, threat model documentation, mathematical key derivation graphic.
- **Cloudflare Trust & Safety**: Responsible disclosure guidelines, response targets, PGP key block for security reports.
- **GitHub Privacy Statement**: Short summaries beside legal articles, table of personal data categories, explicit DNT and header handling.

---

## 2. Pattern Catalog

### Pattern 1: Split Hero with Concrete Product Surface
- **Benchmark sites**: Linear, Resend, Vercel, Snyk, Semgrep, Clerk.
- **When to use**: Primary landing screen above the fold. Immediately pairs a strong, clear value proposition with tangible proof of the actual product.
- **Structure**:
  - Left column (45 to 50% width on desktop): Neutral status eyebrow, 56-64 px sentence-case heading, 20 px calm explanatory lead, primary call-to-action button, secondary anchor link, and a one-line trust statement directly underneath.
  - Right column (50 to 55% width on desktop): Large, high-resolution product interface inside a crisp, minimal window frame (1 px border, subtle address bar in monospace font). Annotated with 2 callouts pointing to critical features.
- **How it applies to KAIRO**:
  - Eyebrow: "Release 1 in development"
  - Headline: "Find access-control flaws in AI-built apps before you launch."
  - Lead: "KAIRO reads your code, reviews the logic that decides who can see what, and tests a running copy in an isolated sandbox. Every finding comes with evidence, a fix and a re-check."
  - Actions: Primary "Continue with GitHub" with GitHub mark; secondary "See how it works".
  - Trust note: "Read-only access. Source code deleted when the scan ends and never kept longer than 24 hours. No tracking cookies."
  - Visual: The real finding report screen from `/_assets` in a 1 px border window frame with monospace URL `kairo.local/projects/acme-storefront-api/scans/scn_sample/findings`, accompanied by callouts for Confidence and Remediated Code.

### Pattern 2: Framework Compatibility Strip (Anti-Logo Strip)
- **Benchmark sites**: Vercel, Railway, Supabase, Semgrep.
- **When to use**: Placed immediately below the hero. Used when an early-stage product does not yet have enterprise customer logos, replacing fake or premature logo walls with useful technical capability indicators.
- **Structure**: A clean, single-row divider strip spanning 1200 px with a subtle top and bottom border. Monospace or high-contrast label followed by supported frameworks/languages in plain text or monochrome vector marks.
- **How it applies to KAIRO**:
  - Text: "Release 1 supports Express, Next.js, FastAPI and Flask."
  - Displays monochrome vector icons with exact framework names. Zero customer logos, zero inflated numbers.

### Pattern 3: Interactive Problem Explainer (Code vs Outcome)
- **Benchmark sites**: Stripe, Tailscale, PortSwigger, Semgrep.
- **When to use**: In the problem section to demonstrate why the vulnerability matters technically, replacing vague fear marketing with reproducible technical reality.
- **Structure**: A segmented state control (2 choices) driving two synchronized panels: a source code panel with highlighted lines, and an HTTP request/response inspection panel showing the attacker outcome. State switches instantaneously on click or keyboard press without layout jumps.
- **How it applies to KAIRO**:
  - Section title: "AI builds the feature. It rarely builds the rules about who may use it."
  - Left column: 4 concise flaw types (missing login check, missing ownership check, client-controlled role parameters, hardcoded repository secrets) and citation linking to OWASP Broken Access Control.
  - Right column: Segmented control:
    - State A: "Without the ownership check" -> Route handler missing tenant filter; HTTP request for User A invoice by User B returns `200 OK` with sensitive invoice data ("Data exposed").
    - State B: "With the ownership check" -> Route handler with tenant query filter; HTTP request for User A invoice by User B returns `404 Not Found` ("Request refused").

### Pattern 4: Numbered Product Workflow ("How It Works")
- **Benchmark sites**: Netlify, Resend, Snyk, Linear.
- **When to use**: Explaining the product lifecycle from initial connection to resolution in simple, verifiable steps.
- **Structure**: 3 horizontal columns or sequential cards, each containing a step number, a bold step title, a single explanatory paragraph, and an authentic product screenshot depicting that exact stage.
- **How it applies to KAIRO**:
  - Step 1: "1 Connect" -> Repository picker modal screenshot (`/_assets` asset).
  - Step 2: "2 Test" -> Scan progress screen with the active stage pipeline rows (`/_assets` asset).
  - Step 3: "3 Fix" -> Finding detail card with evidence code snippet and framework fix (`/_assets` asset).
  - Terminal link: "Read the full walkthrough" navigating to `/how-it-works`.

### Pattern 5: Multi-Layer Architecture and Evidence Synthesis
- **Benchmark sites**: Wiz, GitLab Security, Snyk.
- **When to use**: When a platform combines disparate analysis techniques (static AST, semantic review, dynamic container execution) into a unified result.
- **Structure**: A clear vector diagram showing the three collection layers funneling into a central reconciliation engine, followed by 3 concrete artifact cards displaying the actual data format emitted by each layer.
- **How it applies to KAIRO**:
  - Heading: "Three layers, one report."
  - Vector SVG diagram showing Static Engine, AI-Assisted Logic Review, and Dynamic Sandbox converging into Merged Findings.
  - Column 1: Static Analysis -> Real route inventory table with Detected, Absent, and Unknown signals.
  - Column 2: Logic Review -> Authentic JSON analysis fragment citing specific code lines.
  - Column 3: Dynamic Testing -> Live sandbox request and response evidence verifying exploitation.
  - Explanatory note: "Confidence says how sure KAIRO is: Confirmed, Likely or Possible."

### Pattern 6: Tabbed Rule and Coverage Taxonomy
- **Benchmark sites**: Semgrep, Socket, Checkmarx.
- **When to use**: Presenting extensive vulnerability catalogs without overwhelming the reader with dozens of repetitive, identical cards.
- **Structure**: A horizontal tab bar organizing classes into logical categories. Each tab reveals a structured table or clean list of vulnerability classes with rule IDs, clear titles, 1-sentence explanations, and calibrated severity tags.
- **How it applies to KAIRO**:
  - Tabs: Access control, Secrets and tokens, Input and queries, Configuration.
  - Renders all 13 Release 1 vulnerability classes (KR-V01 to KR-V13) with exact severity badges (Critical, High, Medium, Low) and links to `/coverage`.

### Pattern 7: Annotated Finding and Report Showcase
- **Benchmark sites**: Sentry, Datadog, PortSwigger.
- **When to use**: Demonstrating the depth, clarity, and actionability of the final deliverable.
- **Structure**: Full-width or split showcase featuring a large, crisp screenshot of an expanded finding detail view, bordered by directional callouts explaining each section: Severity Rating, Observed Evidence, Suggested Code Fix, and Re-test verification. Accompanied by previews of export formats.
- **How it applies to KAIRO**:
  - Heading: "A report you can act on."
  - Screenshot of finding detail with callouts.
  - Side panel showcasing downloadable export types: Executive PDF summary, machine-readable JSON, and standardized SARIF export.
  - Grounding statement: "A clean report never says your app is safe. It says what was checked and what was not."

### Pattern 8: Transparent Data Lifecycle and Trust Architecture
- **Benchmark sites**: Tailscale, 1Password, Plausible, Cloudflare.
- **When to use**: High-trust security and infrastructure tooling where customer source code is ingested.
- **Structure**: A full-width SVG lifecycle graphic tracing code handling from ingestion to permanent deletion, supported by strict, honest operational boundaries and a clear "What it does not do" section.
- **How it applies to KAIRO**:
  - Full-width SVG showing: Read-only clone -> Ephemeral in-memory analysis -> Isolated gVisor container -> Immediate workspace deletion (maximum 24h retention).
  - 4 verified architecture commitments: read-only access, isolated sandbox without outside network access, per-project AES encryption of sensitive values, AI logic review switched off until suitable provider terms are approved.
  - Explicit limits section: Not a penetration test, no live production scanning, cannot test external auth/email dependencies, findings indicate confidence levels.

### Pattern 9: Accessible Accordion FAQ
- **Benchmark sites**: Stripe, Linear, Tailscale.
- **When to use**: Addressing common developer, security, and purchasing questions directly on the marketing page without cluttered text.
- **Structure**: HTML5 `<details>` and `<summary>` elements or accessible WAI-ARIA accordion components with crisp borders, keyboard focus rings, smooth icon toggle, and zero animated layout shifts.
- **How it applies to KAIRO**:
  - 8 core questions covering differences from traditional SAST/DAST, code usage in model training, repository modification policies, supported frameworks, live testing boundaries, pricing status ("KAIRO is a project in development. Pricing has not been decided."), code retention duration, and report contents.

### Pattern 10: Multi-Column Trust and Navigation Footer
- **Benchmark sites**: Stripe, GitHub, Vercel, Linear.
- **When to use**: Providing comprehensive, predictable site-wide navigation, legal links, trust anchors, and theme controls at the base of every page.
- **Structure**:
  - Top row: Brand lockup, 1-sentence product summary, primary CTA link.
  - Middle grid: 4 columns categorized by Product, Company, Legal, and Trust.
  - Bottom bar: Copyright, current release version, status indicator ("Release 1 in development"), and appearance segmented control.
- **How it applies to KAIRO**:
  - 4 columns: Product (How it works, Coverage, Security, Sign in), Company (About, Contact), Legal (Privacy Policy, Terms and Conditions, Licenses), Trust (Security disclosure, security.txt).
  - Mandates presence of all 5 required links on every page.

### Pattern 11: Structured Legal and Security Policy Layout
- **Benchmark sites**: Stripe, Linear, Vercel, Tailscale.
- **When to use**: Long-form legal and policy documentation (/privacy, /terms, /security).
- **Structure**:
  - Prominent document title and version/effective date bar.
  - "The short version" plain-language summary callout box at the top.
  - Sticky table of contents on desktop that highlights the active section via IntersectionObserver without animation.
  - Main text column held strictly to 65-72 characters per line for maximum reading comprehension.
  - Clean data tables with clear borders for disclosure specifications.
- **How it applies to KAIRO**:
  - Implemented on `/privacy`, `/terms`, `/security`, and `/about`.
  - Non-production builds display a prominent, styled DRAFT banner.
  - All email addresses and legal jurisdictions loaded dynamically from configuration.

### Pattern 12: Contact Cards without Premature Forms
- **Benchmark sites**: PostHog, Tailscale, Plausible, Warp.
- **When to use**: Developer products where inbound email routing is categorized, and no automated ticketing backend exists in initial releases.
- **Structure**: Eliminates non-functional contact forms. Presents categorized cards (Support, Security Reports, Privacy & Data Rights, Abuse) showing the specific email address, a 1-click Copy button, expected response target, and a checklist of what information to provide in the inquiry.
- **How it applies to KAIRO**:
  - `/contact` displays 4 dedicated contact cards with copy functionality, linking to example domain addresses in development, with realistic response targets.

---

## 3. Decisions for KAIRO Public Website

1. **Information Architecture**:
   - Primary navigation: "How it works" (`/how-it-works`), "Coverage" (`/coverage`), "Security" (`/security`), "About" (`/about`).
   - Actions: Secondary "Sign in" (`/sign-in`), Primary "Continue with GitHub" with GitHub mark.
   - Comprehensive footer with 4 link columns and 5 required legal/contact pages.

2. **Hero and Layout Geometry**:
   - Container width set to 1200 px with 40 px desktop margins and 24 px mobile margins.
   - Section vertical rhythm standardized to 96-128 px on desktop and 56-72 px on phones.
   - Alternating section backgrounds using `bg` (`#F2F0EA` light / `#0B0D12` dark) and `surface` (`#FAF9F5` light / `#12151C` dark) tokens.
   - Clean 45-degree angle brand geometry SVG backgrounds; absolutely no CSS gradient functions.

3. **Product Imagery Pipeline**:
   - Zero AI-generated graphics, stock photography, or 3D renders.
   - Deterministic fixture data seeded under `/_assets` internal route group.
   - Automated asset capture script using Playwright capturing 2x and 3x DPR WebP/AVIF images with PNG fallbacks.
   - Pure vector SVGs for all architectural, lifecycle, and data flow diagrams.

4. **Appearance and Theme Control**:
   - 3-way accessible segmented control (System, Light, Dark) in header, footer, and account page.
   - Inline script injected before first paint applying `data-theme` and `color-scheme` to prevent theme flashing.
   - Exact compliance with Design Brief color tokens: Paper White (`#F2F0EA`) and Midnight Ink (`#0B0D12`).

5. **Legal and Truthfulness Guardrails**:
   - "Release 1 in development" used across all badges and footers.
   - "Continue with GitHub" replaces all price and free-tier claims.
   - AI logic review truthfully described as off by default pending approved provider data agreements.
   - Visible DRAFT banner on legal pages in development, with build-time assertion failing if draft markers or example addresses persist in production.


## 10. Empirical Measurement Study of 30+ Developer & Security Platforms

Measured at 1440px and 1920px viewports via automated DOM extraction (`getBoundingClientRect`, computed styles).

| Site | Status / Error | Container Width (1440 / 1920) | Side Padding | Hero H1 Size & Weight | Lead / Body Size | Nav Items / Size | Footer Cols | Hero Visual Placement & Share | Section Padding Median |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Aikido** | Success | 1212px / 1200px | 23px | 79.516px (500) | 11.3594px / 11.3594px | 6 (15.1459px) | 4 | bleeding (122%) | 114px |
| **Socket** | Success | 960px / 1200px | 32px | 40px (600) | 16px / 16px | 0 (14px) | 4 | beside (67%) | 128px |
| **Snyk** | Success | 1276px / 1200px | 0px | 64px (700) | 16px / 16px | 6 (16px) | 4 | below (110%) | 40px |
| **Semgrep** | Success | 1200px / 1200px | 0px | 60px (400) | 14px / 14px | 6 (14px) | 4 | below (98%) | 48px |
| **GitGuardian** | Success | 1188px / 1200px | 24px | 62px (700) | 13px / 13px | 6 (16px) | 4 | beside (109%) | 128px |
| **Truffle Security** | Success | 1200px / 1200px | 0px | 56px (800) | 18px / 14px | 0 (14px) | 4 | beside (53%) | 128px |
| **StackHawk** | Success | 1180px / 1200px | 80px | 32px (400) | 24px / 16px | 6 (16px) | 4 | beside (54%) | 128px |
| **Escape** | Success | 1120px / 1200px | 24px | 46px (400) | 14px / 14px | 0 (14px) | 4 | beside (45%) | 96px |
| **Detectify** | Success | 1200px / 1200px | 0px | 65.6px (800) | 15px / 15px | 4 (16px) | 4 | beside (8%) | 96px |
| **Intruder** | Success | 1152px / 1200px | 0px | 64px (700) | 20px / 16px | 6 (16px) | 6 | bleeding (125%) | 96px |
| **Corgea** | Success | 1180px / 1180px | 0px | 64px (700) | 12.48px / 12.48px | 6 (16px) | 4 | below (56%) | 96px |
| **ZeroPath** | Success | 1214px / 1200px | 0px | 64px (600) | 18px / 13px | 5 (16px) | 4 | bleeding (54%) | 96px |
| **Linear** | Success | 1318px / 1200px | 0px | 64px (510) | 15px / 12px | 6 (16px) | 6 | below (109%) | 128px |
| **Vercel** | Success | 1390px / 1200px | 0px | 64px (400) | 16px / 24px | 6 (16px) | 4 | below (66%) | 96px |
| **Stripe** | Success | 1184px / 1298px | 0px | 48px (300) | 32px / 48px | 6 (16px) | 4 | bleeding (118%) | 96px |
| **Resend** | Success | 1230px / 1200px | 0px | 96px (400) | 18px / 18px | 5 (16px) | 4 | beside (1%) | 96px |
| **Railway** | Success | 1160px / 1160px | 32px | 54px (500) | 16px / 14px | 1 (14px) | 4 | beside (121%) | 96px |
| **Supabase** | Success | 1280px / 1280px | 96px | 46px (500) | 14px / 14px | 6 (16px) | 4 | below (25%) | 96px |
| **Neon** | Success | 1198px / 1200px | 0px | 56px (400) | 24px / 18px | 6 (16px) | 4 | bleeding (160%) | 96px |
| **Sentry** | Success | 1152px / 1152px | 32px | 88px (700) | 14px / 16px | 6 (16px) | 4 | below (45%) | 128px |
| **PostHog** | Success | 1139px / 1200px | 0px | 36px (800) | 17px / 12px | 6 (16px) | 4 | below (45%) | 96px |
| **Tailscale** | Success | 1182px / 1200px | 0px | 64px (500) | 12px / 14px | 6 (12px) | 4 | below (69%) | 64px |
| **Cloudflare** | Success | 1200px / 1200px | 32px | 56px (500) | 19.2px / 16px | 6 (16px) | 4 | bleeding (240%) | 96px |
| **1Password** | Success | 1248px / 1200px | 0px | 88px (300) | 20px / 16px | 6 (16px) | 4 | below (56%) | 96px |
| **GitHub Security** | Success | 1248px / 1200px | 0px | 56px (440) | 16px / 16px | 6 (16px) | 4 | below (43%) | 96px |
| **GitLab Security** | Success | 1200px / 1200px | 40px | 56px (600) | 13.008px / 13.008px | 0 (14px) | 4 | beside (53%) | 96px |
| **HackerOne** | Success | 1040px / 1200px | 0px | 60px (300) | 13px / 13px | 6 (14px) | 4 | below (37%) | 96px |
| **Plausible** | Success | 1248px / 1120px | 0px | 48px (800) | 16px / 16px | 6 (16px) | 4 | below (87%) | 128px |
| **Clerk** | Success | 1200px / 1200px | 0px | 56px (700) | 18px / 16px | 4 (16px) | 4 | beside (29%) | 164px |
| **WorkOS** | Success | 1200px / 1200px | 0px | 80px (500) | 19px / 19px | 6 (16px) | 4 | beside (44%) | 120px |
| **DeepSource** | Success | 1216px / 1200px | 0px | 56px (700) | 20px / 16px | 6 (14px) | 4 | below (107%) | 96px |


### Decisions Based on Measured Study

| Metric | Measured Range | Measured Median | Concrete Value Adopted for KAIRO |
| :--- | :--- | :--- | :--- |
| **Content Container Width** | 960px - 1390px | 1200px | **1200px** content width (outer container 1280px with 40px side padding desktop) |
| **Side Padding** | 0px - 96px | 0px | **40px** desktop, 24px tablet, 20px phone |
| **Hero H1 Font Size** | 32px - 96px | 60px | **clamp(44px, 5.2vw, 72px)**, 600 weight, -0.02em letter spacing |
| **Lead Paragraph Size** | 11.3594px - 32px | 16px | **20px to 22px**, line-height 1.5, text-2 color |
| **Body Paragraph Size** | 11.3594px - 48px | 16px | **17px to 18px**, line-height 1.65 (Legal: 17px) |
| **Nav Link Size & Gaps** | 12px - 16px | 16px | **14px to 15px**, 28px gap, 2px emerald underline |
| **Hero Visual Share** | 1px - 240px | 56% | **58% - 60%** (minimum 720px at 1440px wide), bleeding to right viewport edge |
| **Section Spacing** | 40px - 164px | 96px | **128px** desktop (1440+), 96px tablet, 64px phone; Hero 96px top / 80px bottom |
| **Footer Columns** | 4px - 6px | 4 | **4 link columns** + 1 brand intro row + 1 meta bottom row |
| **Section Layout Patterns** | - | - | Chess alternating, 12-col bento/split, numbered large numeral rows, no 3-equal-cards |
| **Inverted Section** | - | - | **Midnight Ink in Light theme / Paper White in Dark theme** for trust moment |
