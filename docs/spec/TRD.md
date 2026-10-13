
**TECHNICAL REQUIREMENTS DOCUMENT**


**KAIRO**

*Technical design for Release 1*


| Document Technical Requirements Document | Version 0.1 |
| --- | --- |
| Status Draft for review | Date 10 October 2026 |
| Implements Product Requirements Document v0.1 | Course Project-Based Learning |


**Contents**

1. Document control

2. Technical summary

3. System architecture

4. Technology stack and rationale

5. Application services

6. Job orchestration

7. Static analysis engine

8. AI-assisted logic review

9. Sandbox and dynamic testing

10. Data architecture

11. API design

12. Security architecture

13. Infrastructure, environments and delivery

14. Observability and operations

15. Frontend technical requirements

16. Testing strategy and quality gates

17. Performance, capacity and cost envelope

18. Third-party services and licensing

19. Traceability

20. Decision log, risks, open questions and sources


# 1. Document control

This TRD turns the PRD into an implementable design: it fixes the stack, the component boundaries, the interfaces and the security controls for KAIRO Release 1.


| Field | Value |
| --- | --- |
| Product | KAIRO |
| Document | Technical Requirements Document |
| Version | 0.1 |
| Status | Draft for review |
| Implements | Product Requirements Document v0.1 |
| Audience | Engineering team, faculty guide, evaluators |
| Sibling documents | App Flow, UI/UX Design Brief, Backend Schema, Implementation Plan |


## Conventions

- Requirement IDs (FR, NFR, LR, BR) refer to the PRD. Section 19 maps every group to the TRD section that satisfies it.
- Each significant choice is recorded as a decision, ADR-01 onward, in section 20. A decision is either Decided or Proposed.
- Version numbers were checked on 10 October 2026 and must be re-checked when the repository is created. The project pins exact versions in lockfiles.
- Scope is Release 1 unless a section says otherwise. Release 2 hooks are named so that nothing in Release 1 blocks them.
- Field-level database design is deliberately left to the Backend Schema document. This TRD defines the stores, the rules that apply to them and the boundaries between them.

# 2. Technical summary

KAIRO is a Python and PostgreSQL system behind a Next.js interface, in which every piece of untrusted code runs inside a gVisor sandbox on a separate runner node that holds no credentials.

Five decisions shape everything else.

- **One language for analysis and API.** Python 3.13 with FastAPI. The scanner, the API and the workers share models and tests, and the parsing ecosystem is strongest in Python.
- **One stateful dependency.** PostgreSQL 18 holds data and the job queue. There is no Redis and no separate broker in Release 1, so there are fewer things to secure, back up and explain.
- **An in-house static engine.** Detection is built on tree-sitter and rules written by the team. Semgrep's own rules cannot be used in a competing hosted service (section 18), and the route-inventory logic needs custom code regardless.
- **Isolation by design, not by policy.** Scanned code is built, analyzed and run only inside gVisor containers. A separate runner node pulls work over an encrypted link and cannot reach the database or object store.
- **A replaceable model provider.** All model calls go through one interface. The production provider is not chosen yet because it depends on the LR-14 review (section 8 and ADR-08).

## Stack at a glance


| Layer | Choice | Version policy |
| --- | --- | --- |
| Web application | Next.js 16 (App Router), TypeScript, React | Next.js 16 line, which is the Active LTS release |
| Styling and components | Tailwind CSS with a project token layer, Radix UI primitives | Latest stable at project start, pinned |
| API | FastAPI, Pydantic v2, Uvicorn | Current release. FastAPI now requires Pydantic v2 |
| Language runtime | Python 3.13 for services, Node.js Active LTS for the web build | Python 3.14 is evaluated after dependency checks |
| Database | PostgreSQL 18 with SQLAlchemy 2 and Alembic | 18.x, latest minor release |
| Job queue | Postgres-backed queue (Procrastinate) | Proposed, confirmed by a one-week spike |
| Object storage | S3-compatible API, encrypted objects | Provider chosen in ADR-05 |
| Static analysis | tree-sitter grammars, in-house rules, gitleaks for secrets | Pinned by lockfile |
| Sandbox | Docker Engine with the gVisor runsc runtime | Pinned runsc release |
| Test driver | httpx for requests, Playwright only where a login needs a browser | Latest stable, pinned |
| Reverse proxy | Caddy with automatic HTTPS | Latest stable |
| Observability | OpenTelemetry, structured JSON logs, Grafana stack | Free tier or self-hosted |
| CI and delivery | GitHub Actions, GitHub Container Registry, Docker Compose | Not versioned |
| Dependency tooling | uv for Python, pnpm workspaces for JavaScript | Latest stable, pinned |


# 3. System architecture

KAIRO has three zones: an application zone that holds all data, a runner zone that executes work and holds none, and a sandbox inside the runner zone where hostile code lives.


## Request and data flow

- The browser reaches Caddy over TLS. Caddy sends / to the web application and /api to the API, so both share one origin.
- The API authenticates the session, checks ownership, and writes the scan and its first job in a single transaction (section 6).
- A worker prepares the snapshot from GitHub or from the uploaded archive, encrypts it and stores it.
- Static analysis runs inside a gVisor container with no network and writes the route inventory and raw findings (section 7).
- Logic review sends redacted route context to the approved model provider, if one is enabled for the data class (section 8).
- The runner agent leases the dynamic-testing job over WireGuard, builds and tests the application in the sandbox, and returns redacted evidence (section 9).
- The merge stage normalizes and rates findings. The report worker renders the PDF, JSON and SARIF files.
- The browser reads results from the API and follows progress through server-sent events (section 11).

Section 12 explains the trust level of each zone and the controls on each boundary.


# 4. Technology stack and rationale

Each choice below favors the option with the fewest moving parts that still meets the PRD's security and quality requirements.


| Area | Choice | Why | Alternatives rejected |
| --- | --- | --- | --- |
| API and workers | Python 3.13, FastAPI, Pydantic v2 | The scanner and the API share code and types. Pydantic validates every model output (FR-L2). OpenAPI is generated from the code (NFR-D1). | Node with NestJS: one language end to end, but weaker analysis tooling. Go: fast, but slower to build the analyzers in one term. |
| Web | Next.js 16, TypeScript | Server-rendered public pages (Privacy, Terms, Security) load fast and are indexable. The signed-in app shares one codebase. | Vite single-page app plus a static site: two deployments for one product. |
| Styling | Tailwind CSS over design tokens, Radix UI primitives | Tokens make the brand guardrails enforceable in code (section 15). Radix supplies accessible dialogs, menus and tabs, which supports NFR-A1. | A prebuilt component kit: its default look conflicts with BR-1 and BR-2 and is costly to override. |
| Database | PostgreSQL 18, SQLAlchemy 2, Alembic | Relational data with strong constraints. Row-level security is available as defense in depth (section 10). Postgres 18 is the current major release. | MongoDB: weak fit for relational findings data. SQLite: no concurrent workers. |
| Job queue | Procrastinate on Postgres | Enqueuing a job in the same transaction as the scan record removes a class of lost-job bugs. No second datastore. | Celery with Redis: a second stateful service. Temporal: heavy for this scale. |
| Static engine | tree-sitter, in-house analyzers, gitleaks | Full control of route extraction and clean licensing. tree-sitter parses JavaScript, TypeScript and Python with one API. | Semgrep rules: license bars use in a competing hosted service. CodeQL: requires builds and a different license model. |
| Sandbox | Docker Engine with gVisor runsc | An application kernel limits what a hostile app can reach on the host. It runs on x86-64 and ARM64 and does not need hardware virtualization. | Plain containers: not a sandbox for hostile code. Firecracker microVMs: strongest isolation, but needs KVM that free-tier hosts rarely expose. |
| Model access | One provider interface, schema-validated JSON | Providers can change without touching analysis code (R6, R11). | Hardwiring one vendor's SDK throughout the code. |
| Report PDF | Headless Chromium printing the real report page | The PDF and the web view cannot drift apart (FR-R1, FR-R2). | A separate PDF template: two renderings to keep in sync. |
| Reverse proxy | Caddy | Automatic certificates and sane TLS defaults, which keeps NFR-S2 simple. | Nginx with manual certificate renewal. |


## Hosting

Release 1 targets two Linux virtual machines: an application node and a runner node. The runner node must not hold database or storage credentials. Candidate hosts are an Always Free ARM instance from Oracle Cloud and Azure credits from the GitHub Student Developer Pack. Both were listed as available in current student-resource guides, but offers change, and one source reports that DigitalOcean ended its student credit after 31 July 2026. The host is confirmed in ADR-13, and nothing in this design depends on a specific vendor beyond a Linux VM with Docker.


# 5. Application services

KAIRO is one repository with four deployable applications and a set of libraries whose import rules are enforced by tooling, so the sandbox-facing code can never reach the database.


## Repository layout

kairo/

apps/

web/            Next.js application (public pages and signed-in app)

api/            FastAPI application

worker/         Orchestrator and stage workers

runner/         Runner agent that executes sandboxes

packages/

analysis/       tree-sitter adapters, route inventory, analyzers

rules/          Detection rules with vulnerable and safe fixtures

findings/       Finding model, severity rubric, merge logic

model_client/   Provider interface and adapters

reports/        Report data model, JSON and SARIF serializers

tester/         Dynamic test driver (runs inside the sandbox)

contracts/      Types generated from the OpenAPI document

benchmark/        Benchmark applications and their labels

infra/            Compose files, Caddy config, bootstrap scripts

docs/             PRD, TRD and decision records


## Component responsibilities and limits


| Component | Responsibility | May talk to | Must never |
| --- | --- | --- | --- |
| apps/web | Rendering, forms, report views | The API over the same origin | Hold secrets or call GitHub or a model directly |
| apps/api | Authentication, authorization, CRUD, job creation, report delivery | PostgreSQL, object storage, GitHub | Execute scanned code or call a model |
| apps/worker | Fetch snapshots, static analysis, logic review, merge, reports | PostgreSQL, object storage, GitHub, the model provider | Run scanned code outside a sandbox |
| apps/runner | Build and run sandboxes, drive tests | The API over the private link only | Hold database or storage credentials |
| packages/analysis | Parse code, build the route inventory, run analyzers | The file system | Open sockets or import database code |
| packages/tester | Send test requests to the sandboxed application | The sandbox network only | Reach any other network |


Import boundaries are checked in CI with import-linter for Python and ESLint boundary rules for TypeScript. A violation fails the build.


## Web application

- Public pages (home, Privacy Policy, Terms, Security, Contact, Licenses) are server-rendered and need no JavaScript to read.
- The signed-in application uses client components for the scan form, progress view and report. Data comes from a typed client generated from the API's OpenAPI document, so the two cannot drift.
- Only variables with an explicit public prefix reach the browser bundle. A build step fails if a variable name contains secret, key or token and is marked public.
- Every response carries a strict Content Security Policy without inline scripts, plus the headers listed in section 12.

## API

- Layers are routers, then services, then repositories. Routers hold no business logic and repositories hold no authorization logic.
- Every route that touches a project, scan or finding declares an ownership dependency that loads the object and compares its owner to the session user. A test walks the application's route table and fails if any project-scoped route lacks that dependency (NFR-S3).
- Each request uses one database transaction. Creating a scan and enqueuing its first job happen in that same transaction.
- KAIRO's own API is scanned by KAIRO in CI before each release (NFR-S1).

## Workers

- One worker image runs named queues: prepare, static, logic, merge, report and maintenance. Concurrency is set per queue.
- Workers are stateless. All state is in PostgreSQL and object storage, so a crashed worker loses at most the stage in flight.
- Parsing and rule execution run in a gVisor container with no network and a read-only snapshot, because parsers written in C process hostile input.

## Runner agent

- The agent polls the API for dynamic-testing jobs over a WireGuard link. The API never connects to the runner.
- Each job arrives with a bundle encrypted under a one-time key that exists only for that job. The agent decrypts into a temporary file system, runs the sandbox, returns results and deletes everything.

# 6. Job orchestration

A scan is a sequence of idempotent stages recorded in PostgreSQL, so a crash resumes at the last finished stage and no stage can produce two different results.


## Queue semantics

- Jobs live in PostgreSQL and are claimed with FOR UPDATE SKIP LOCKED, so many workers can pull from one queue without double-claiming.
- Creating a scan and enqueuing its first job happen in one transaction. A scan cannot exist without its job, and a job cannot exist without its scan.
- Delivery is at least once. Every handler is idempotent. Results are written by upsert keyed on the scan and stage, and stored objects are named by content hash, so a repeated run overwrites itself with identical data.
- Each job has a lease that its worker renews with a heartbeat. A worker that stops renewing loses the job, which returns to the queue. Worker leases last 15 minutes and runner leases last 2 minutes.
- Retries use exponential backoff with jitter and a per-stage maximum, shown below.

## Stages


| Stage | Queue | Input | Output | Retries | If it fails |
| --- | --- | --- | --- | --- | --- |
| Prepare | prepare | Project configuration, commit | Encrypted snapshot, file list | 3 | The scan fails, because there is nothing to analyze |
| Static | static | Snapshot | Route inventory, raw findings | 1 | The stage is marked failed. Logic review and dynamic testing are skipped with the reason "no route inventory" |
| Logic review | logic | Inventory, snapshot | Model findings | 1 per route | The stage is marked failed or partial. Other stages continue |
| Dynamic | Runner lease | Encrypted job bundle | Evidence and confirmed findings | 2 attempts | The stage is marked failed with the end of the startup log (FR-D3). Other stages continue |
| Merge | merge | All stage outputs | Normalized findings and statuses | 3 | The scan fails and an alert fires, because merge is deterministic and a failure is a bug |
| Report | report | Findings | Report data, PDF, JSON, SARIF | 3 | The web report is still available, and the missing format is flagged |


Static analysis runs first because it produces the route inventory. Logic review and dynamic testing then run in parallel. A user who disables a layer, or has no start command, gets that layer marked skipped and the report says so (US-12).


## States


| Object | States |
| --- | --- |
| Scan | queued, preparing, running, merging, reporting, completed, completed_with_warnings, failed, cancelled |
| Stage | queued, running, complete, failed, skipped, cancelled |


A scan ends as completed_with_warnings when any stage failed or was skipped for a reason other than the user's choice. The user always sees which stage and why (US-06).


## Cancellation and cleanup

- Stopping a scan sets a flag. Workers check it between units of work. The runner's next heartbeat response carries cancel: true, and the agent destroys the sandbox.
- Cleanup always runs, in a finally path: sandbox removal, scratch-space wipe and snapshot deletion. The 24-hour sweeper in section 10 is the backstop for anything a crash leaves behind.

## Merge and rating

The merge stage turns raw layer output into findings. It is deterministic, so the same inputs always give the same report.

- Normalize every raw result to the finding record (FR-F1).
- Group results that describe the same flaw, using the class and the route key, or the file and excerpt hash when there is no route. Each group becomes one finding that lists every method that found it (FR-F2).
- Compute the stable fingerprint (section 7).
- Assign confidence and severity as below.
- Compare with earlier scans of the project by fingerprint. A finding previously dismissed stays dismissed unless its evidence changed. A finding previously fixed that reappears is reopened (FR-F3, FR-F4).

**Confidence**


| Evidence | Confidence |
| --- | --- |
| The flaw was reproduced against the running application | Confirmed |
| A logic finding with validated citations to a specific code path | Likely, never higher without dynamic evidence (FR-L6) |
| Two independent layers agree | Likely |
| One static signal, uncorroborated | Possible |


A rule may declare in its file that a structural proof justifies Likely on its own, for example a committed key in a known provider format. No rule can declare Confirmed, because only dynamic reproduction can.

**Severity** is computed from the class's default in PRD section 10 and these modifiers. The values live in a versioned severity_rubric.yaml, and its version is stored on the scan. The model never supplies a severity.


| Modifier | Effect |
| --- | --- |
| The route is unauthenticated and returns data | Raise one level |
| The affected model or table has fields named like credentials, payment, health or personal data | Raise one level |
| The finding needs a valid account that anyone can create | No change |
| The result would be Critical already | Stays Critical |


## Report generation

- The merge stage writes one report data document that follows a versioned JSON schema (report.v1). The web view, the JSON export and the other formats are all derived from it, so they cannot disagree (FR-R1, FR-R3).
- **PDF:** The report worker renders a print route in headless Chromium and uses its tagged-PDF option. The route accepts only a signed, one-time token. The browser runs in a sandbox that can reach the API and nothing else, and the section order matches the web view (FR-R2).
- **SARIF 2.1.0:** Each finding becomes a result. The rule ID is the rule's ID. Critical and High map to error, Medium to warning, and Low and Informational to note. The location is the relative file path and line range. The KAIRO fingerprint goes in partialFingerprints. Severity, confidence and class go in properties. A test validates the output against the published schema (FR-R4).
- **Shared views** are rendered from the same data with evidence removed unless the owner included it (FR-R8).

# 7. Static analysis engine

The static engine turns source code into a route inventory first, and every detector then reads that inventory instead of rescanning text, which is what lets it reason about authorization rather than only spot patterns.


## Pipeline

- **Discover files.** Walk the snapshot, apply default and user ignore patterns (FR-I4), skip minified and generated files, and enforce the file-size and file-count limits in the table below.
- **Detect stack.** Read manifests such as package.json, requirements.txt and pyproject.toml to name the framework. The user can correct it (FR-I3).
- **Parse.** Build a concrete syntax tree per file with tree-sitter grammars for Python, JavaScript, TypeScript and TSX. The parser tolerates syntax errors, so one broken file does not stop a scan.
- **Extract routes.** A framework extractor lists every endpoint with its middleware chain and handler.
- **Resolve signals.** For each route, look for authentication, ownership and role checks, following imports and calls inside the project.
- **Run analyzers.** Rule analyzers read the inventory and the trees and emit raw findings.
- **Normalize.** Convert raw findings to the common finding record with a stable fingerprint (FR-F1, FR-F3).

## Route inventory record


| Field | Content |
| --- | --- |
| id | Stable key built from framework, method and normalized path |
| method and path | HTTP method and the path with parameters normalized, for example /invoices/:id |
| framework | express, nextjs, fastapi or flask |
| handler | File, start line and end line of the handler |
| middleware | Ordered list of middleware or dependencies that apply, including router-level and app-level ones |
| authentication | One of detected, absent or unknown, with the evidence that led to it |
| ownership check | One of detected, absent or unknown, with evidence |
| role check | One of detected, absent or unknown, with evidence |
| identifier parameters | Path, query or body fields that look like record identifiers |
| data access | Reads and writes to models or tables found in the handler and one call level below |
| uploads | Whether the handler accepts files |


The three-valued signals matter. A route marked unknown is not reported as a flaw. It is sent to logic review (section 8), which is where ambiguous cases belong.


## Framework extractors


| Framework | Routes are found in | Authentication signals | Ownership and role signals |
| --- | --- | --- | --- |
| Express | app.get, router.post and similar calls, app.use and router.use chains | Middleware that verifies a token, reads a session, or calls an authentication library and rejects on failure | Comparing the record owner to the user ID, queries filtered by user ID, role comparisons |
| Next.js | app/**/route.ts exported method handlers, pages/api/**, server actions | Calls to a session helper followed by an early return or throw | The same as Express, plus checks inside server actions |
| FastAPI | Decorators such as @router.get, plus Depends(...) parameters | A dependency that returns the current user and raises 401 or 403 | Dependencies that check roles, queries filtered by the current user |
| Flask | @app.route, blueprints, before_request hooks | Login decorators, hooks that abort when no session exists | Decorators that check roles, filtered queries |


A signal counts as detected only when the function body shows the behavior, meaning it reads credentials and fails closed. A function named auth that does nothing is not trusted. Names alone only raise a route from absent to unknown.


## Rule format

Rules are YAML files validated by a JSON Schema. Each rule must carry a vulnerable and a safe fixture, and the build fails without both (FR-S10, NFR-M1).

id: KR-V01-open-write-route

class: V01

title: State-changing route without authentication

severity: high

languages: [javascript, typescript]

frameworks: [express, nextjs]

analyzer: route_without_auth

applies_to:

methods: [POST, PUT, PATCH, DELETE]

message: "{method} {path} changes data and no authentication check was found."

remediation: auth-middleware

cwe: [CWE-306]

tests:

vulnerable: [fixtures/express-open-post.js]

safe: [fixtures/express-authed-post.js]

Simple structural rules use a tree-sitter query. Rules that need the inventory name a Python analyzer in packages/analysis. Both kinds share the same file format and the same tests.


## Secrets detection

- gitleaks runs over the snapshot with a pinned version and a project configuration, covering pattern and entropy checks (FR-S3).
- Extra rules flag committed .env files that are not ignored, public-prefixed environment variables whose names or values look secret, service-role keys inside client directories, and credentials inside folders served to the browser.
- Raw secret values are never stored. A finding keeps the first two and last two characters and a salted hash, so the same secret is recognized across scans without being retained.

## Determinism and fingerprints

The same input must always give the same output. File order, route order and finding order are sorted. A finding's fingerprint is a hash of the rule, the route key, the relative file path and a whitespace-normalized excerpt, so it survives line shifts and is recognized in the next scan (FR-F3).


## Limits and defaults


| Limit | Default | Reason |
| --- | --- | --- |
| Maximum size of one file | 1 MB | Skips bundles and data dumps |
| Maximum files per project | 20,000 | Bounds parse time |
| Parse time per file | 10 seconds | Stops pathological input |
| Analysis time per project | 4 minutes | Supports NFR-P1 |
| Call-resolution depth | 2 levels inside the project | Keeps analysis predictable |


These values are starting points. The benchmark and load tests in section 16 confirm or change them.


# 8. AI-assisted logic review

Logic review sends a small, redacted slice of code to a model through one interface, accepts only schema-valid answers that cite lines the model was shown, and never lets the model set a severity or run anything.


## Flow

- **Select candidates.** A route qualifies when the inventory shows no detected ownership or role check and the route either takes an identifier parameter or writes data (FR-L1).
- **Assemble context.** Collect the handler, the middleware that applies, the model or table definitions it touches, and helper functions it calls, up to two levels deep.
- **Redact.** Remove secrets and likely personal data (FR-L4).
- **Build the request.** A fixed, versioned system prompt plus the context as line-numbered blocks.
- **Call the provider** through the interface below with temperature 0.
- **Validate** the answer against the schema and the cited lines (FR-L2, FR-L3).
- **Convert** valid answers to findings. Severity comes from the rubric, never from the model.

## Defaults


| Setting | Default | Notes |
| --- | --- | --- |
| Context per route | 12,000 tokens | Trimmed by priority: handler, then middleware, then models, then helpers |
| Token ceiling per scan | 400,000 | When reached, finished routes are kept and the report lists the rest as skipped (FR-L9) |
| Concurrent model calls per scan | 4 | Limits provider rate-limit errors |
| Request timeout | 90 seconds | One retry with backoff, then the route is marked failed |
| Output limit | 1,500 tokens | Findings are short by design |


## Redaction


| What | How it is found | Replacement |
| --- | --- | --- |
| Secrets and keys | gitleaks matches from the static stage, plus entropy checks | A placeholder such as <SECRET_1>, stable within one request |
| Email addresses, phone numbers and similar identifiers | Pattern matching | A typed placeholder such as <EMAIL_1> |
| Connection strings with credentials | Pattern matching | The host is kept, the credentials are removed |
| Large literal data blocks | Size and entropy limit | Replaced by a short marker |


Placeholders are mapped back only inside KAIRO. The provider never receives the real value.


## Prompt and answer format

- The system prompt lives in the repository as a versioned file. Its version is recorded on every scan (FR-R9).
- Code is placed inside blocks delimited by a random boundary token generated per request. The prompt states that everything between boundaries is data to analyze and never instructions.
- The model must answer with JSON that matches this schema:

{

"route_id": "GET /invoices/:id",

"verdict": "missing_ownership_check",

"affected_resource": "invoice",

"missing_control": "The handler loads the invoice by ID and never compares its owner to the signed-in user.",

"explanation": "Any signed-in user can read any invoice by changing the ID in the URL.",

"citations": [{ "file": "src/routes/invoices.ts", "start_line": 14, "end_line": 22 }]

}

Allowed verdicts are missing_authentication, missing_ownership_check, missing_role_check, client_side_only, mass_assignment, safe and uncertain.


## Validation rules

- The answer must parse as JSON and match the schema exactly. Anything else is retried once with a generic error message that does not echo the code, then discarded.
- Every citation must name a file and a line range that were present in the submitted context. A finding that cites anything else is discarded (FR-L3).
- The route_id must match a route in the inventory, and affected_resource must correspond to a model or identifier the inventory found.
- A safe or uncertain verdict produces no finding. uncertain routes are counted in the report's limits section.
- A logic finding with validated citations is rated Likely at most. It becomes Confirmed only through dynamic evidence (FR-L6, section 6).

## Defenses against prompt injection

- Scanned code is untrusted input (FR-L7). The model receives no tools, no function calling and no network.
- The model's output is parsed as data. Nothing in it is executed, fetched or used to build a command.
- Output is limited to the schema, so an instruction hidden in a comment can at worst produce a wrong verdict, which validation and corroboration then contain.
- Comments and strings that look like instructions to an AI system are detected and reported as an informational finding, because they are worth a developer's attention.
- A fixed adversarial corpus, covering instructions in comments, strings, filenames and markdown, runs in CI. Release is blocked if any sample changes a verdict.

## Provider interface

class ModelClient(Protocol):

provider: str


async def generate(self, request: ReviewRequest) -> ReviewResponse: ...


@dataclass(frozen=True)

class ReviewRequest:

model_id: str             # explicit identifier, never an alias

prompt_version: str       # for example logic_review/v3

messages: list[Message]

json_schema: dict

temperature: float = 0.0

max_output_tokens: int = 1500

timeout_s: float = 90.0

Adapters implement the interface for each provider. They map errors to a small shared set (timeout, rate limited, refused, malformed) and report token counts. The provider, the model identifier and the prompt version are stored on every scan (FR-L5, FR-R9).


## Which provider may see which code

The provider choice is gated by data class, and the gate fails closed.


| Data class | Allowed providers |
| --- | --- |
| Benchmark and development code written or generated by the team | Any configured provider, including DeepSeek's hosted API |
| Code submitted by users in production | Only providers that have passed the LR-14 review and are switched on in configuration. Until one is approved, logic review for user code stays disabled |


This gate exists because a third-party summary of DeepSeek's published privacy policy says prompts are processed and stored in the People's Republic of China and that training use applies unless a user opts out (). That summary is secondary, so the primary policy must be read during the LR-14 review. DeepSeek's V4 models are open-weight, which keeps a self-hosted option open for Release 2. Model names also changed in 2026: deepseek-v4-flash and deepseek-v4-pro replaced the retired deepseek-chat and deepseek-reasoner aliases (), which is why requests carry explicit model identifiers.


## Caching and evaluation

- Responses are cached by a hash of the redacted context, prompt version and model identifier. A cached answer is stored with the project and deleted with it.
- A benchmark harness replays a fixed set of routes whenever the prompt, the model identifier or the validation code changes, and reports recall and precision per vulnerability class. A drop below the thresholds in PRD section 15 blocks the release (FR-L10).

# 9. Sandbox and dynamic testing

Dynamic testing builds the user's application inside a gVisor sandbox with no route to the internet or to KAIRO's data, then lets a separate test driver exercise it with accounts the user supplied.


## Project configuration

The user fills this in on the project page (US-04). It can also be committed as an optional kairo.yaml file. Credentials are never part of the file. They are entered in the form and stored encrypted.

stack: node

install: npm ci

start: npm run start

port: 3000

health_path: /api/health

services:

- type: postgres

env: DATABASE_URL

seed: npm run seed

accounts:

- id: user_a

role: user

login:

type: json

path: /api/auth/login

fields: { email: "{email}", password: "{password}" }

- id: user_b

role: user

- id: admin

role: admin

public_routes: ["/", "/api/health", "/api/auth/login", "/api/auth/register"]

Most real applications need a database, so Release 1 supports sidecar services from a short allowlist: PostgreSQL, MySQL, Redis and MongoDB. Each runs from a pinned official image, receives generated credentials, and exposes them to the application through the environment variable the user names. Applications that need anything else are reported as untestable by this layer.


## Sandbox lifecycle

- **Lease.** The runner agent leases a job and decrypts its bundle into a temporary file system (section 5).
- **Network.** It creates a per-scan Docker network marked internal, which has no gateway to the outside.
- **Build.** A container from a base image pinned by digest receives the snapshot and runs the install command. This container may reach only the package registries for the detected stack, through an allowlisting proxy: npm for Node, and PyPI and its file host for Python. Install scripts run arbitrary code, so this container runs under gVisor, holds no credentials, and cannot reach anything the proxy does not allow (FR-D2).
- **Run.** A new container mounts the built workspace and joins only the internal network. Sidecars start, environment values are injected, the seed command runs, and the agent waits up to 120 seconds for the health check (FR-D3).
- **Test.** The test driver starts in its own gVisor container on the same internal network. It receives the test plan and the account credentials through its environment and writes results as JSON lines to its output, which the agent collects.
- **Teardown.** The agent stops and removes the containers, networks and volumes, wipes the temporary file system and returns the results (FR-D1).

## Sandbox network

The run stage has no external connectivity at all. The only components that can talk to each other are the application, its sidecars and the test driver. The build stage is the only time the sandbox network touches the proxy, and the proxy is the only thing that touches the internet. The diagram below shows the arrangement.


## Test procedure

Every test follows the same order, so results are comparable between scans.

**Phase 0: sessions.** Sign in each supplied account through the configured recipe, which can be a JSON login, a form login or a bearer token. The driver parses a form's hidden CSRF field when there is one (FR-D4). It then checks each session against a known endpoint. If an account cannot sign in, the report says so and the authenticated tests for that account are skipped, while the unauthenticated tests still run.

**Phase 1: discovery.** Combine the route inventory, any OpenAPI document found at common paths, and a bounded crawl of the running application (same origin only, at most 200 pages, depth 3). Build a request template for each route, filling path parameters with discovered identifiers (FR-D5).

**Phase 2: baseline.** Account A creates records through the application's own create routes, using payloads that carry a unique marker string for the scan, and lists its resources. This produces known identifiers and known content to look for.

**Phase 3: tests.**


| Test | Method | Finding when |
| --- | --- | --- |
| Open routes (FR-D6) | Call each route that returns data or changes state with no credentials. Routes the user lists as public, and by default sign-in, registration, health and static assets, are excluded | A 2xx response whose body carries data, or a successful write |
| Cross-account access (FR-D7) | Request each of A's resources as B. For reads, check whether A's marker appears in B's response. For writes on records the test created, send a marked change as B and read the record back as A. For existing records, check whether B can read a record that A's list contains and B's list does not | The marker or the foreign record is reachable by B |
| Role tampering (FR-D8) | As a standard user, add fields such as role, isAdmin, admin and permissions to create and update requests on the test's own records and the user's own profile, then read the profile back. Also call routes that the inventory or path suggests are administrator-only | A privileged field persists, or a standard session receives a 2xx from an administrator route |
| Missing rate limit (FR-D9) | Send 20 failed sign-in attempts for a test account within 5 seconds, then confirm the correct password still works | No 429 response, no delay and no lockout appears |


**Phase 4: evidence.** Every confirmed finding stores the request and response that proved it. Header values for authorization, cookies, set-cookie and API keys are removed. Body fields named like passwords, tokens, secrets or keys are masked. Responses are cut to 2 KB. The marker values stay visible because they are what proves the result (FR-D12).

**Phase 5: cleanup.** Where the application offers it, the driver deletes the records it created. Either way, the ephemeral databases disappear with the sandbox.


## Safety bounds

- The driver never sends DELETE, PUT or PATCH to a record it did not create (FR-D10).
- A scan has a budget of 2,000 requests at no more than 20 per second, enforced by a token bucket in the driver. A request has a 10-second timeout and a 2 MB response cap (FR-D11).
- The user can stop a scan at any time, and the next heartbeat tears the sandbox down.
- The driver treats every response as untrusted bytes. It parses JSON and HTML with limits and never executes anything it receives (T3 in section 12).
- If the application crashes three times, the stage ends as failed with the log excerpt, so a fragile application cannot hold a runner indefinitely.

## What this layer cannot do

The report states these limits so that a missing finding is not read as a pass (FR-R7).

- Applications that depend on external sign-in, email or SMS verification, payment providers or other outside services cannot be fully exercised.
- Routes that the code, the OpenAPI document and the crawl all fail to reveal are not tested.
- GraphQL and WebSocket interfaces are Release 2 work.
- gVisor does not implement every Linux system call. An application that needs an unsupported one fails to start, and the report names the sandbox runtime as the cause.

# 10. Data architecture

KAIRO keeps durable data in PostgreSQL and object storage only, encrypts every sensitive value under a per-project key, and treats deleting that key as the way to erase a project, including its copies in backups.


## Stores


| Store | Holds | Notes |
| --- | --- | --- |
| PostgreSQL 18 | Accounts, sessions, projects, configuration, scans, stages, route inventory, findings, status history, share links, audit events, job queue, token accounting | Single source of truth. Row-level security applies to tenant tables |
| Object storage (S3-compatible) | Source snapshots (temporary), generated reports (PDF, JSON, SARIF), evidence bundles | Objects are encrypted before upload. Snapshots also carry a one-day lifecycle rule as a backstop |
| Runner scratch space | The decrypted job bundle during a dynamic test | A temporary file system on the runner node, wiped when the job ends |


## Logical entities

Field-level design belongs to the Backend Schema document. These entities and rules are fixed here so both documents agree.


| Entity | Purpose | Rule that matters |
| --- | --- | --- |
| User | GitHub identity: ID, login, email, avatar | Minimal fields. Deleted on account deletion |
| Installation | A user's GitHub App installation and selected repositories | Tokens are encrypted. Revoking deletes them |
| Project | A repository or archive plus its configuration | Owned by exactly one user in Release 1 |
| Attestation | The user's authorization confirmation | Stores the wording version, timestamp and user. Immutable |
| Scan | One run: commit, layers requested, provider, model, prompt and rule versions | Records everything needed to explain a result later (FR-R9) |
| Stage | The state of one layer inside a scan | Stage failures never delete other stages (US-06) |
| Route | One entry of the route inventory for a scan | Kept so a report can show its appendix |
| Finding | A normalized problem with a stable fingerprint | Unique per project and fingerprint. Status survives re-scans |
| Evidence | Request and response excerpts and code excerpts | Redacted before storage. Encrypted with the project key |
| StatusEvent | Each change of a finding's status, with reason and actor | Append-only |
| Report | A rendered report artifact and its format | References objects in storage |
| ShareLink | An unlisted, expiring, revocable link | Stores only a hash of the token |
| AuditEvent | Security-relevant account events (FR-A6) | Append-only. Contains no source code |
| Job | A queue entry | Idempotency key per stage (section 6) |
| ModelCall | Provider, model, token counts, latency | Never stores prompts or answers |


## Encryption and keys

- **In transit:** TLS between the browser and Caddy. Traffic between the application node and the runner node travels over WireGuard.
- **At rest, disk:** The virtual machine volumes use full-disk encryption.
- **At rest, application level:** Sensitive values use AES-256-GCM through the cryptography library. This covers test-account credentials, environment variables, installation tokens, evidence and snapshots (NFR-S2, NFR-S4).
- **Key hierarchy:** A master key lives in the secret store. Each project has its own data key. Data keys are stored in PostgreSQL wrapped by the master key. Master key rotation re-wraps data keys without touching the data.
- **Erasure:** Deleting a project deletes its wrapped data key. Anything still sitting in a backup becomes unreadable, which satisfies the backup clause of LR-6 without rewriting backups.

## Access control inside the database

- Four database roles exist: api_role, worker_role, migrator_role and ops_readonly_role. None can alter another's grants.
- The operations role can read queue and error tables but has no privilege on tables that hold content (FR-O1, FR-O3).
- Tenant tables have row-level security policies that compare the row's owner to a setting the API sets for each transaction. Application checks remain the primary control. The policies are the second line that stops a missed check from leaking data (NFR-S3).
- The runner node has no database role at all.

## Data classes


| Class | Examples | Handling |
| --- | --- | --- |
| Secret | Test credentials, environment variables, installation tokens | Encrypted, never logged, shown masked, injected only into the sandbox that needs them |
| Customer code | Snapshots and code excerpts | Snapshots deleted when a scan ends and in any case within 24 hours (LR-6). Excerpts are redacted |
| Finding data | Findings, evidence, reports | Kept until the user deletes them. Evidence is encrypted |
| Personal | GitHub identity, IP address, user agent | Minimal collection, listed in the Privacy Policy |
| Operational | Metrics, queue depth, error rates | No content. Retained by the logging policy in section 14 |


## Retention jobs

The maintenance queue runs these on a schedule, each logged as an audit event.


| Job | Rule |
| --- | --- |
| Snapshot cleanup | Delete at scan end. A sweeper deletes any snapshot older than 24 hours |
| Share link expiry | Disable links past their expiry. Default expiry is 14 days |
| Session cleanup | Idle sessions end after 8 hours. Absolute lifetime is 14 days |
| Account deletion | Remove primary data at once, delete data keys, and let backups age out |
| Orphan sweep | Delete objects with no database reference |


## Backups and migrations

- Nightly base backups and continuous log archiving go to object storage, encrypted. Retention is 14 days, which is the figure the Privacy Policy states. A full restore is rehearsed before launch (NFR-R3).
- Alembic manages schema changes. Production migrations are forward-only and use the expand then contract pattern, so a rollback of the application never needs a rollback of the schema. The deploy pipeline runs migrations with the migrator role and tests them on a copy of the previous release's schema.

# 11. API design

The public API is a same-origin JSON API under /api/v1, authenticated by a first-party session cookie, with an internal runner API that is reachable only over the private link.


## Conventions

- **Style:** REST over HTTPS with JSON bodies. FastAPI generates an OpenAPI 3.1 document, which the web client and the contract tests consume (NFR-D1).
- **Versioning:** The version is in the path. A breaking change creates /api/v2. Fields are only added within a version.
- **Same origin:** Caddy serves the web application and /api/* from one origin, so cookies are first-party and no cross-origin sharing is configured. Cross-origin requests are denied by default.
- **Errors:** RFC 9457 problem details (application/problem+json) with a stable type, a human title and a detail that says what to do next (BR-14).
- **Pagination:** Cursor-based, with a default page size of 50 and a maximum of 200.
- **Idempotency:** POST /scans accepts an Idempotency-Key header, so a retried request cannot start two scans.
- **Caching:** Authenticated responses send Cache-Control: no-store.
- **Object access:** A request for another user's object returns 404, not 403, so object IDs cannot be probed.

## Authentication and sessions

- Sign-in uses the GitHub App's user authorization flow with a state value and PKCE. Identity scopes only are requested at sign-in. Repository access is a separate installation step the user performs on GitHub (US-01, US-02).
- The session cookie is named __Host-kairo_session and is Secure, HttpOnly, SameSite=Lax, scoped to the root path and carries no Domain attribute. Its value is an opaque random identifier. The session itself is stored in PostgreSQL, so signing out or suspending an account takes effect at once (FR-A2).
- State-changing requests need a CSRF token sent in a custom header and are rejected if the Origin header is missing or foreign.
- Installation tokens are minted on demand with the least permissions needed (read-only contents and metadata) and are never sent to the browser.
- Personal API tokens are a Release 2 feature. Nothing in Release 1 assumes they do not exist.

## Resources


| Method and path | Purpose | Requirement |
| --- | --- | --- |
| GET /auth/github/start, GET /auth/github/callback | Begin and complete sign-in | FR-A1 |
| POST /auth/logout | End the session | FR-A2 |
| GET /me, DELETE /me | Read the account, delete it with all data | FR-A3, US-11 |
| GET /me/export | Download all projects, findings and reports | FR-A5 |
| GET /installations, GET /installations/{id}/repositories | List the user's GitHub App installations and selected repositories | FR-I1 |
| POST /projects, GET /projects, GET /projects/{id}, PATCH /projects/{id}, DELETE /projects/{id} | Manage projects | FR-I1 to FR-I6 |
| POST /projects/{id}/archive | Upload a ZIP (multipart, size limited) | FR-I2 |
| PUT /projects/{id}/config | Start command, port, environment variables, sidecar services, test accounts, ignore patterns | US-04 |
| POST /projects/{id}/attestation | Record the authorization confirmation | FR-I7, LR-1 |
| POST /projects/{id}/scans, GET /projects/{id}/scans | Start and list scans | US-06 |
| GET /scans/{id}, POST /scans/{id}/cancel | Read status, stop a scan | FR-D11 |
| GET /scans/{id}/events | Server-sent events for progress | US-06 |
| GET /scans/{id}/routes | The route inventory | FR-S2 |
| GET /scans/{id}/findings, GET /findings/{id} | List and read findings | US-07 |
| PATCH /findings/{id} | Dismiss or reopen with a reason | US-09, FR-F4 |
| POST /findings/{id}/recheck | Re-run the check for one finding | US-08, FR-F5 |
| GET /scans/{a}/compare/{b} | New, fixed and unchanged findings | FR-F6 |
| POST /scans/{id}/reports, GET /reports/{id}, GET /reports/{id}/download | Generate and download PDF, JSON or SARIF | US-10 |
| POST /reports/{id}/share, DELETE /shares/{id}, GET /s/{token} | Create, revoke and view a share link | FR-R8 |
| GET /audit | The user's own security events | FR-A6 |
| GET /health, GET /ready | Liveness and readiness, no data | NFR-O1 |
| POST /webhooks/github | GitHub App events, verified by HMAC signature | FR-I1 |


## Example resource

{

"id": "scn_01k8x3",

"project_id": "prj_01k8w9",

"status": "running",

"commit": "4f9c2ab",

"layers": { "static": "complete", "logic": "running", "dynamic": "queued" },

"provider": { "name": "configured-provider", "model_id": "explicit-model-id" },

"rule_set_version": "2026.10.0",

"created_at": "2026-10-12T09:30:00Z"

}


## Progress streaming

The events endpoint uses server-sent events and is fed by PostgreSQL LISTEN and NOTIFY. Each event carries the stage, its state and a short message. The client falls back to polling GET /scans/{id} every three seconds if the stream drops.


## Rate limits

Limits are enforced twice, loosely at Caddy and exactly in the application using counters in PostgreSQL (FR-A4). A limited request gets 429 with a Retry-After header.


| Group | Default limit | Keyed by |
| --- | --- | --- |
| Sign-in and callback | 10 per minute | IP address |
| Scan creation | 10 per hour and 3 running at once | User |
| ZIP upload | 5 per hour | User |
| Reads | 120 per minute | User |
| Share-link views | 60 per minute | IP address |
| Webhook endpoint | 300 per minute | Source network |


## Problem types


| Status | Type | When |
| --- | --- | --- |
| 401 | unauthenticated | No valid session |
| 404 | not_found | Missing object, or an object owned by someone else |
| 409 | scan_in_progress | A conflicting action while a scan runs |
| 413 | limit_exceeded | Project or archive exceeds a documented limit. The detail names the limit and how to reduce the project (FR-I6) |
| 422 | validation_failed | Body or parameters invalid, with a list of fields |
| 428 | attestation_required | A scan was requested without a current attestation (LR-1) |
| 429 | rate_limited | A limit above was reached |
| 503 | dependency_unavailable | GitHub or a provider is down. The detail says which layers will still run |


## Internal runner API

These endpoints listen only on the WireGuard interface and need a per-runner bearer token that can be revoked.


| Path | Purpose |
| --- | --- |
| POST /internal/runner/v1/lease | Ask for the next dynamic-testing job. Returns a job with an encrypted bundle and its one-time key |
| POST /internal/runner/v1/jobs/{id}/heartbeat | Extend the lease. A missed heartbeat returns the job to the queue |
| POST /internal/runner/v1/jobs/{id}/log | Append a bounded, redacted log excerpt |
| POST /internal/runner/v1/jobs/{id}/result | Submit test results and redacted evidence |


# 12. Security architecture

The threat model starts from two assumptions: every scanned repository is hostile, and every stored report is a high-value target.


## Trust boundaries


| Zone | Trust level | Contains | Main controls |
| --- | --- | --- | --- |
| Internet | None | Browsers, GitHub webhooks, share-link viewers | TLS, rate limits, input validation |
| Edge | Low | Caddy | Certificates, security headers, coarse rate limits, request size caps |
| Application zone | High | Web, API, workers, PostgreSQL, object storage | Network isolation, least-privilege roles, encryption, audit events |
| Runner zone | Medium | Runner agent and Docker with gVisor | No database or storage credentials, WireGuard-only control channel |
| Sandbox | Hostile | The scanned application and its sidecars, the test driver | gVisor, unprivileged, no external network, resource limits |
| External providers | Third party | GitHub, the model provider | Allowlisted egress, scoped tokens, redaction |


## Assets

Customer source code, test credentials and environment variables, findings and evidence, GitHub installation tokens, KAIRO's own secrets (master key, GitHub App key, provider key), and user sessions.


## Threats and controls


| ID | Threat | Controls | PRD risk |
| --- | --- | --- | --- |
| T1 | A hostile repository attacks the analyzers with a parser exploit, a zip bomb, path traversal or symlinks | Analysis runs in gVisor with no network and a read-only snapshot. Extraction rejects absolute paths, parent references, links that leave the root and extreme expansion ratios. Size, file-count and time limits apply | R3 |
| T2 | A hostile application escapes the sandbox | gVisor runsc, unprivileged user, dropped capabilities, no host mounts, internal-only network, a runner node with no credentials, and a regular patch schedule for runsc and the kernel | R3 |
| T3 | A hostile application attacks the test driver through its responses | The driver runs inside its own sandbox, treats responses as bytes with size and time caps, executes nothing from them, and holds only the test accounts | R3 |
| T4 | Server-side request forgery through repository URLs, redirects or webhooks | Release 1 fetches only through the GitHub API. Every outbound fetch uses a client that blocks private, loopback, link-local and metadata addresses and re-checks after each redirect (NFR-S6) | R3 |
| T5 | Prompt injection through scanned code | No tools for the model, schema-validated output, cited-line checks, adversarial tests in CI (section 8) | R5 |
| T6 | One user reads another user's data in KAIRO | Ownership dependency on every project-scoped route, row-level security, unguessable IDs, 404 for foreign objects, automated cross-user tests that fail the build | R2 |
| T7 | Misuse of dynamic testing against systems the user does not own | Sandbox-only testing, mandatory attestation, no external network at run time, rate and request caps, abuse contact, account suspension | R1 |
| T8 | Theft of GitHub tokens, environment variables or test credentials | Per-project envelope encryption, short-lived least-privilege installation tokens, no logging of secrets, masked display | R2 |
| T9 | Session theft or account takeover | No passwords to steal, Secure and HttpOnly cookies, revocable server-side sessions, CSRF protection, and fresh authentication before account deletion | R2 |
| T10 | A compromised dependency or build step | Lockfiles with integrity hashes, a cooling period before adopting new releases, GitHub Actions pinned to commit hashes, images pinned by digest, a software bill of materials per release (NFR-S7) | R10 |
| T11 | An operator reads customer content | The operations role has no content privilege, access needs a logged and time-limited elevation, no standing administrator accounts, hardware-backed multi-factor sign-in (FR-O3) | R2 |
| T12 | Denial of service through huge repositories or floods | Size and file limits, per-user concurrency of three scans, queue quotas, timeouts, rate limits at two layers | R9 |
| T13 | Secrets leaking into logs | Logs use an allowlist of fields, and a scrubbing test fails the build if a canary secret appears (NFR-S8) | R2 |
| T14 | Leakage through share links | Only a hash of the token is stored, pages are excluded from indexing, links expire and can be revoked, evidence is omitted by default (FR-R8) | R2 |


## Web security headers


| Header | Value |
| --- | --- |
| Content-Security-Policy | default-src 'self', script sources by per-request nonce, object-src 'none', base-uri 'none', frame-ancestors 'none' |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | Camera, microphone, geolocation and similar features disabled |
| Cross-Origin-Opener-Policy | same-origin |
| Cross-Origin-Resource-Policy | same-origin |


## Sandbox hardening checklist

This is the checklist NFR-S5 refers to. Every item is tested on the runner node before launch.

- Container runtime is gVisor runsc, with the release pinned and patched on a schedule.
- The process runs as a non-root user with a read-only root file system and a temporary file system for writable paths.
- All Linux capabilities are dropped and no-new-privileges is set.
- CPU, memory, process-count, open-file and wall-clock limits apply. A log size cap applies.
- No host paths, device nodes or Docker socket are mounted. The runner agent is the only process that talks to Docker.
- The run-stage network is an internal bridge with no gateway. The cloud metadata address is unreachable.
- The build stage reaches the internet only through an allowlisting proxy that permits the package registries for the detected stack.
- Environment variables are injected only into the container that needs them and never written to disk.

## Secrets management

- Secrets are kept in the host's secret store or in files encrypted with SOPS and age. They are never in the repository, images or logs.
- Secrets reach processes as environment variables or mounted files at deploy time. The runner node receives only its WireGuard key and its bearer token.
- The master key, the GitHub App private key and the provider key are rotated on a documented schedule, after staff changes and after any incident.

## Vulnerability management and the self-scan gate

- Dependency updates are proposed automatically and merged after review and a cooling period. Fix targets are 7 days for Critical, 14 days for High and 30 days for Medium findings.
- Before every release the pipeline scans KAIRO with KAIRO itself and with independent tools: OWASP ZAP baseline against the staging environment, Trivy for dependencies and images, and gitleaks for secrets. A High or Critical result blocks the release (NFR-S1). Semgrep's engine and rules may also be run on KAIRO's own source, because internal use is within their licenses.

## Incident response hook

Security logs are kept for 90 days to support investigation. The runbook in docs/runbooks/incident.md covers detection, containment, evidence preservation and the notification steps required by LR-12.


# 13. Infrastructure, environments and delivery

Release 1 runs on two Linux virtual machines managed by Docker Compose, and every change reaches them through a pipeline that cannot skip the security gates.


## Topology


| Node | Runs | Starting size | Inbound |
| --- | --- | --- | --- |
| Application node | Caddy, web, API, workers, PostgreSQL 18, observability agent | 2 vCPU and 8 to 12 GB of memory | Ports 80 and 443 from the internet. SSH only over WireGuard |
| Runner node | Runner agent, Docker with gVisor, the allowlisting build proxy | 2 vCPU and 8 to 12 GB of memory | WireGuard only. No public ports |


- PostgreSQL listens on the private interface only. Object storage is reached over HTTPS from the application node and never from the runner node.
- Runner nodes are stateless, so capacity grows by adding nodes that lease work from the same queue.
- Container images are built for both amd64 and arm64, because free-tier ARM machines are a candidate host (ADR-13). Native dependencies in scanned applications may lack arm64 builds, so an amd64 runner is preferred if one is available. This is recorded as an open question.
- The firewall allows only the ports above. Unattended security updates are enabled and SSH is key-only.

## Environments


| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Development with Docker Compose and a local object store | Synthetic only |
| CI | Ephemeral runners for tests and the self-scan | Synthetic only |
| Staging | A copy of production for end-to-end tests, the OWASP ZAP baseline and benchmark runs | Benchmark applications only. No customer data |
| Production | The live service | Customer data |


Each environment has its own GitHub App, secrets, database, bucket and domain. No secret is shared between environments.


## Pipeline gates


| Stage | Trigger | Checks |
| --- | --- | --- |
| Verify | Every pull request | Formatting and linting (ruff, ESLint), type checks (pyright, tsc), unit tests, import-boundary checks, rule tests with vulnerable and safe fixtures (NFR-M1), migration test on the previous schema, route-ownership test and cross-user tests (NFR-S3), log-scrubbing test (NFR-S8), brand lint (section 15), dependency and secret scans |
| Build | Merge to main | Multi-architecture images pushed to GitHub Container Registry, signed, with a software bill of materials (NFR-S7) |
| Staging | Merge to main | Deploy to staging, run end-to-end tests with Playwright, a benchmark subset, the ZAP baseline and the KAIRO self-scan |
| Release | A version tag, after manual approval | Deploy by image digest, run expand migrations, run smoke tests, keep the previous digest ready for rollback |


A failed gate stops the pipeline. There is no override flag. A gate is changed only through a reviewed pull request.


## Deployment mechanics

- Each node runs Docker Compose with images pinned by digest. The pipeline connects over WireGuard with a deploy key restricted to a single forced command that pulls and restarts the stack.
- Services have health checks. Caddy routes only to healthy upstreams. A deploy to a single node causes a short interruption, which the 99 percent monthly target in NFR-R2 allows.
- Rollback means redeploying the previous digest. Expand then contract migrations make this safe (section 10).
- Node hardening is a script in infra/, so a lost node can be rebuilt from the repository and the secret store.

## Versioning and flags

- The product follows semantic versioning. The rule set uses calendar versions such as 2026.10.0. Prompts carry their own version numbers. All three are recorded on each scan.
- A small set of feature flags lives in configuration. The most important one enables logic review for user code and stays off until the LR-14 review passes (section 8).

# 14. Observability and operations

KAIRO is observable through logs, metrics and traces that carry identifiers and timings but never source code, credentials or request bodies.


## Logging

- Logs are structured JSON written with structlog. Each entry uses an allowlist of fields: timestamp, level, service, request ID, scan ID, stage, opaque user ID, route template, status and duration.
- A field outside the allowlist is dropped. A test writes canary secrets and canary code through every logger and fails the build if any appears in the output (NFR-S8).
- Application logs are kept for 30 days. Security events are kept for 90 days (section 12).
- No third-party error-tracking service receives request bodies, source excerpts or environment values (ADR-12). Exceptions are logged with scrubbed context into the same pipeline.

## Metrics and traces

OpenTelemetry instruments the API, the workers and the runner agent. Traces follow a request from the API through the queue to the worker, using a trace ID stored on the job. The collector forwards to a Grafana stack, either on the free tier or self-hosted.


| Metric | Why it matters | Initial alert |
| --- | --- | --- |
| Queue wait time per queue | Users wait for scans | Over 10 minutes for 10 minutes |
| Stage duration per layer | Supports NFR-P1 and NFR-P2 | Over twice the weekly median |
| Stage failure rate | Signals broken rules, a provider outage or a runner fault | Over 20 percent for 30 minutes |
| Scan completion rate | A success metric in the PRD | Under 95 percent over a day |
| Sandbox startup success rate | Tracks risk R8 | Under 70 percent over a day, for review not paging |
| Runner heartbeat age | A silent runner strands jobs | Over 2 minutes |
| Model call error rate and latency | Provider health | Over 25 percent errors for 10 minutes |
| Tokens per scan | Cost and the ceiling in FR-L9 | A day over three times the daily mean |
| API latency and 5xx rate | User-visible health | 5xx over 2 percent for 5 minutes |
| Database connections and disk | Capacity | Disk over 80 percent |
| Certificate expiry and backup job status | Silent failures | Expiry under 14 days, any failed backup |


Alerts go to email and a chat webhook. Every alert links to its runbook.


## Runbooks

The repository holds a short runbook for each of these, and each is exercised at least once before launch.

- Deploy and roll back.
- Restore from backup, including a restore into staging (NFR-R3).
- Rotate the master key, the GitHub App key and the provider key.
- Rebuild a runner node.
- Model provider outage, including switching providers or disabling logic review.
- Suspected sandbox escape.
- Handle an abuse report (FR-O4).
- Handle an erasure request (LR-9).

## Operator console

The console implements FR-O1 to FR-O3 and lives under /ops.

- It is reachable only over WireGuard and requires a hardware security key sign-in.
- It shows queue depth, failed jobs and error rates. It has no page that displays source code, findings or evidence.
- Operators can suspend an account and cancel running scans (FR-O2).
- Viewing a user's content needs an elevation. The operator states a reason, the elevation expires after 30 minutes, every maintainer is notified, and the grant and each access are written to the audit log (FR-O3).

# 15. Frontend technical requirements

The web application turns the PRD's brand guardrails into checks that fail the build, so the product cannot drift into the patterns it was told to avoid.


## Foundations

- Next.js 16 with the App Router and TypeScript in strict mode. The any type is banned by lint rules.
- Public pages are server components. Interactive screens (scan form, progress, report) are client components that use the generated API client and TanStack Query.
- Forms validate with schemas generated from the OpenAPI document, so client and server rules match.
- Finding text, code excerpts and evidence are always rendered as text. dangerouslySetInnerHTML is banned except for the trusted legal documents, which pass through a sanitizer.
- All user-facing strings live in a message catalog (messages/en.json) and none are hardcoded in components (NFR-I1).
- The X-Powered-By header is disabled.
- Supported browsers are the latest two major versions of Chrome, Edge, Firefox and Safari, tested as separate Playwright projects, and the layout works at 360 px width (NFR-C1).

## Design tokens

One file, tokens.css, defines every color, radius, spacing step, type size and motion duration as CSS variables. Tailwind's theme reads those variables. Color literals are allowed in that file and nowhere else. The design itself is specified in the UI/UX Design Brief. This TRD only fixes the mechanism.


## How each brand guardrail is enforced


| Guardrail | Enforcement | Runs |
| --- | --- | --- |
| BR-1 No purple or violet gradients | A style lint rejects linear-gradient, radial-gradient, conic-gradient and Tailwind bg-gradient-* classes. A token script converts every color in tokens.css to HSL and fails if any hue falls between 250 and 300 degrees | Pull request |
| BR-2 No pill-shaped controls | The radius scale tops out at 8 px. A rule rejects rounded-full and radii of 9999 px on buttons and controls. Only an allowlisted avatar component may use a full radius | Pull request |
| BR-3 No em dashes | A repository search for the em dash character covers source, message catalogs, email templates, Markdown content and metadata | Pull request |
| BR-4 No scroll or cursor effects | ESLint restricts imports of scroll-animation and cursor-effect libraries and the use of in-view reveal props. A style rule rejects animation-timeline. A global reduced-motion rule disables transitions. Durations are capped at 200 ms | Pull request |
| BR-5 One icon family, no emoji, no sparkle symbols | A single icon package is allowed. Lint rejects importing its sparkle, star and wand glyphs. A Unicode check rejects emoji in strings and templates | Pull request |
| BR-6 No fabricated proof | The content/ folder has code owners. A lint pass flags phrases such as "trusted by" and testimonial components. Any number in marketing copy needs a source comment | Pull request, review |
| BR-7 Copy rules | The banned word list (unlock, supercharge, seamless, revolutionize, elevate, game-changing, cutting-edge, leverage) and exclamation marks are checked in the message catalog and content files | Pull request |
| BR-8 No generated or stock imagery | Images may only come from public/screenshots and public/diagrams. The review checklist requires a note on how each file was made | Review |
| BR-9 No AI badges or watermarks | A search rejects strings such as "Made with AI", "Powered by AI" and "Generated by" in the app, repository metadata and exported files | Pull request |
| BR-10 Favicon set | A build step fails unless all icon files exist with the right dimensions (below) | Build |
| BR-11 Metadata | Each route must export metadata with a unique title and description. The root layout sets the language. Report and share routes set noindex. A test checks all of this | Pull request |
| BR-12 Footer links | One footer component with the five required links is used by the root layout. A Playwright crawl asserts it on every route | Staging |
| BR-13 No placeholders | A search rejects "lorem ipsum" and the framework starter text. The build fails if default starter assets are present | Pull request |
| BR-14 Error and empty states | Each route segment needs an error boundary and a not-found page. A test lists segments without one | Pull request |
| BR-15 Accessible severity and contrast | Severity and status render as text plus a distinct shape. A script computes contrast ratios for every token pair, and axe-core runs in Playwright | Pull request, staging |


## Favicon and metadata files

Next.js file conventions generate the tags from these files, so no hand-written head markup is needed.


| File | Size | Use |
| --- | --- | --- |
| app/icon.svg | Vector | Primary favicon |
| app/favicon.ico | 32 by 32 | Fallback for older browsers |
| app/apple-icon.png | 180 by 180 | iOS home screen |
| public/icon-192.png, public/icon-512.png | 192 and 512 | Web manifest icons |
| app/manifest.webmanifest | Not applicable | Name, theme color, icons |
| app/opengraph-image.png | 1200 by 630 | Social preview, made from a real product screen or a typographic card |


The mark itself is designed in the UI/UX Design Brief and is not a stock or generated image.


## Legal and trust pages

- /privacy, /terms, /security, /contact and /licenses are static server-rendered pages (BR-12, LR-3, LR-4, LR-8).
- The Privacy Policy and Terms are Markdown files with front matter holding a version and an effective date. The page shows both at the top. The text of each earlier version is kept in the repository, which provides the visible change history.
- Accepting the Terms stores the document's version and a content hash with a timestamp (LR-4).
- /licenses is generated at build time from the software bill of materials, so third-party attributions are complete (BR-9).
- /.well-known/security.txt follows RFC 9116 with Contact and Expires, plus Policy and Preferred-Languages. The build fails if the Expires date is less than 30 days away (LR-8).
- robots.txt and the sitemap list public pages only.

## Accessibility requirements

- Semantic landmarks, a skip link, labeled controls and visible focus on every interactive element, to WCAG 2.2 level AA (NFR-A1).
- Dialogs, menus, tabs and tooltips use Radix primitives, which handle focus trapping and keyboard operation.
- Targets are at least 24 by 24 CSS pixels. Text can be resized to 200 percent without loss of content.
- Progress changes are announced to assistive technology through a live region.
- Keyboard-only and screen-reader walkthroughs of sign-in, starting a scan and reading a finding are part of the release checklist.

## Performance budget


| Item | Budget |
| --- | --- |
| Public pages | Under 100 KB of JavaScript, compressed, and no layout shift from late-loading fonts |
| Signed-in routes | Under 200 KB of JavaScript, compressed, per route |
| Report page | Largest contentful paint under 2.5 seconds at the 75th percentile for 100 findings (NFR-P3). Lists past 200 findings are virtualized |
| Fonts | At most two families, self-hosted, with a fallback stack |


# 16. Testing strategy and quality gates

Because KAIRO sells trust in its own findings, its test suite measures detection quality and platform security as carefully as it measures ordinary correctness.


## Test levels


| Level | Scope | Tools | What it proves |
| --- | --- | --- | --- |
| Unit | Functions and components | pytest, Vitest | Logic is correct in isolation |
| Rule | Every detection rule against its vulnerable and safe fixtures | A rule test runner in packages/rules | The rule fires on the flaw and stays quiet on the fix (FR-S10, NFR-M1) |
| Property and fuzz | Parsers, route extractors, archive extraction | Hypothesis and a crafted-archive corpus (zip bombs, links, traversal) | Hostile input cannot crash analysis or escape extraction (T1) |
| Contract | The API against its OpenAPI document | Schemathesis | Responses and errors match the contract (NFR-D1) |
| Integration | PostgreSQL, the queue, object storage | pytest with throwaway containers | Idempotency, retries and transactional enqueue behave as designed |
| Failure | Kill a worker mid-stage, drop the runner, time out the provider, restart the database | Scripted fault injection | No completed stage result is lost (NFR-R1) |
| Security | Cross-user access matrix, CSRF, session handling, SSRF blocking, log scrubbing | pytest and Playwright | The controls in section 12 hold (NFR-S3, NFR-S6, NFR-S8) |
| Sandbox conformance | Attempts from inside a sandbox to reach the metadata address, the host, the database and the internet | A fixed suite run on each runner node | The hardening checklist in section 12 is real (NFR-S5) |
| Model | Schema conformance, citation checks, the injection corpus | Recorded responses in CI, live runs on a schedule | Section 8's validation rules work (FR-L2, FR-L3, FR-L7) |
| End to end | Sign in, connect a repository, scan a benchmark app, read a finding, export, delete | Playwright against staging | The user journeys in the PRD work |
| Accessibility | Every route | axe-core in Playwright plus manual walkthroughs | WCAG 2.2 level AA (NFR-A1) |
| Load | API and queue under concurrent scans | k6 | The capacity model in section 17 |


## The cross-user access matrix

A test builds two users and one project each. It then lists every route in the API's route table that takes a project, scan, finding, report or share identifier. For each such route it calls the route as the other user, with and without a valid session. Any response other than 404 or 401 fails the build. A route added later is covered automatically because the list is generated, not written by hand.


## The benchmark

The benchmark is the evidence behind the PRD's claims, so it is built like a dataset.

- benchmark/ holds applications grouped by stack. Each has a labels.yaml listing every seeded or observed flaw with its class, file and route, and a fixed counterpart with the flaws removed.
- Generated applications record the assistant, model, date and prompt that produced them. Only applications the team generated or that carry an open license are included.
- Two reviewers label each application independently. Disagreements are resolved and logged, and the agreement rate is reported.
- A scoring script computes recall and precision per vulnerability class, and compares KAIRO with the baseline tools named in PRD section 15.
- The benchmark runs on a subset for every merge to main and in full before each release. Results are stored with the release.

## Quality gates by milestone

These tie the PRD's roadmap gates to evidence.


| Gate | Evidence required |
| --- | --- |
| Gate 0 | End-to-end test of sign-in and intake passes on a sample repository, with the pipeline green |
| Gate 1 | Rule tests pass for every Release 1 static rule, and the fuzz suite finds no crash |
| Gate 2 | The injection corpus and schema tests pass, and the first benchmark baseline is stored |
| Gate 3 | The sandbox conformance suite passes, and V02 and V03 are confirmed on seeded applications with nothing observed outside the sandbox |
| Gate 4 | Accessibility and brand lint pass, and all Must requirements for reports, legal pages and the favicon set are complete |
| Gate 5 | Self-scan and independent scans show no open High or Critical findings, usability targets are assessed, and the legal review is recorded |


## Coverage and data

- Line coverage is reported but is not a gate. Branch coverage of at least 90 percent is required for the findings package, the authorization dependencies and the encryption module.
- Tests use synthetic data only. No customer code or credential is ever copied into a test or a fixture.

# 17. Performance, capacity and cost envelope

One runner node can finish about 180 typical scans a day at half utilization, and every cost driver has a hard ceiling so that usage cannot run away. All durations below are planning assumptions that the load tests in section 16 must confirm or replace.


## Platform limits

These are the limits that the PRD defers to this document (FR-I2, FR-I6).


| Limit | Value |
| --- | --- |
| ZIP upload, compressed | 50 MB |
| Extracted size | 200 MB |
| Repository snapshot size | 200 MB |
| Files per project | 20,000 |
| Size of one analyzed file | 1 MB |
| Concurrent scans per user | 3 |
| Scan creations per user | 10 per hour |
| Dynamic testing wall-clock cap | 15 minutes |
| Dynamic testing request budget | 2,000 requests at no more than 20 per second |
| Stored reports and evidence per user | 500 MB |


## Time budget for one scan

Static analysis comes first because it produces the route inventory. Logic review and dynamic testing then run in parallel.


| Stage | Typical, 15,000 lines | Ceiling at 25,000 lines |
| --- | --- | --- |
| Prepare (fetch, extract, store) | 1 minute | 1 minute |
| Static analysis | 3 minutes | 5 minutes |
| Logic review, in parallel with dynamic testing | 3 minutes | 5 minutes |
| Dynamic testing, in parallel with logic review | 8 minutes | 12 minutes |
| Merge and report | 1 minute | 1 minute |
| Wall clock | 13 minutes | 19 minutes |


The ceiling column fits inside the 20-minute target in NFR-P2. Static analysis alone, the quantity NFR-P1 measures, stays inside its 5-minute target.


## Resource profile


| Stage | CPU and memory | Where it runs |
| --- | --- | --- |
| Static analysis | 1 vCPU and 512 MB per worker | Application node, inside gVisor |
| Logic review | Network bound. Four concurrent model calls | Application node |
| Dynamic testing | 1 vCPU and about 2 GB for the application, test driver and sidecars together | Runner node |
| Report rendering | 1 vCPU and 1 GB for headless Chromium | Application node |


## Capacity of one runner node

A runner node with 2 vCPU and 8 to 12 GB of memory can host two sandboxes at once, limited by CPU and then by memory. At a typical 8 minutes each, that is about 15 scans an hour, or 360 a day at full use. Planning at half utilization gives about 180 scans a day. A single user at the per-user limit generates at most 10 scans an hour, so the node absorbs about a dozen users at the limit before queueing.


## Scaling levers


| Bottleneck | First response | If that is not enough |
| --- | --- | --- |
| Dynamic testing queue grows | Add a runner node. Runners are stateless and lease from the same queue | Raise sandbox limits only after measuring |
| Static analysis slow | Raise worker concurrency, then add a worker process | Split the static queue onto its own node |
| Model latency or rate limits | Lower concurrency, enable caching, add a second approved provider | Disable logic review for large projects with a clear report note |
| PostgreSQL load | Tune indexes, add a pooler | Move to a managed instance. No code change is needed |
| Queue contention in PostgreSQL | Confirm with the load test | Replace the queue behind the same interface (ADR-04) |


## Cost envelope

The PRD requires operation within free tiers or student credits during the term, so the design controls what can spend money rather than predicting a bill.


| Cost driver | Bound |
| --- | --- |
| Virtual machines | Two nodes, sized in the table above, on free-tier or credit-funded hosting (ADR-13) |
| Model tokens | A ceiling of 400,000 tokens per scan (section 8). The cost of one scan is input tokens times the input price plus output tokens times the output price, read from the provider's current pricing page at project start, never from memory |
| Sandbox time | 15 minutes per scan and three concurrent scans per user |
| Storage | 500 MB of reports and evidence per user. Snapshots live under 24 hours |
| Bandwidth | Reports are small. Snapshots never leave the application node except as an encrypted bundle to the runner |
| Observability | Free tier or self-hosted, with log volume capped by the field allowlist (section 14) |


The maintenance queue records tokens and sandbox minutes per scan, and an alert fires when a day's use exceeds three times the daily mean (section 14).


# 18. Third-party services and licensing

KAIRO uses permissively licensed components, writes its own detection rules, and treats Semgrep's rules as off limits because their license bars use in a competing hosted service.


## The Semgrep decision

Semgrep documents two licenses. The Community Edition engine is under LGPL 2.1. The rules that Semgrep maintains are under the Semgrep Rules License v1.0, which makes them available only for internal business use and says vendors cannot use them in competing products or SaaS offerings (). KAIRO is a hosted code-scanning service, so it must not ship or run those rules for customers. Third-party rule sets inside the Semgrep registry keep their own licenses, and the one example the documentation gives is Trail of Bits rules under AGPL-3.0, which is also unsuitable here. This is why detection rules are written by the team (ADR-06, LR-10).

Two uses stay open. Semgrep's engine and rules may scan KAIRO's own source during the self-scan, because that is internal use. The LGPL engine, or its fork Opengrep, may be evaluated later for Release 2 pattern matching with in-house rules, which needs a separate legal check on how it is packaged.


## Components

Licenses other than Semgrep's and Next.js's are stated from general knowledge. The license scan in the pipeline is the authority, and any difference found there overrides this table (LR-10).


| Component | Role | License | Note |
| --- | --- | --- | --- |
| Next.js and React | Web application | MIT | Next.js license confirmed from the project's lifecycle record |
| Tailwind CSS, Radix UI | Styling and primitives | MIT |  |
| Icon package | Interface icons | ISC | One family only (BR-5) |
| FastAPI, Pydantic, SQLAlchemy, Alembic | API and data access | MIT | Pydantic v2 is required by current FastAPI |
| Procrastinate | Job queue | MIT | Confirmed in the ADR-04 spike |
| tree-sitter and grammars | Parsing | MIT | Grammar licenses checked one by one |
| gitleaks | Secrets detection | MIT | Pinned binary |
| PostgreSQL | Database | PostgreSQL License |  |
| Docker Engine | Container runtime | Apache 2.0 |  |
| gVisor | Sandbox runtime | Apache 2.0 | Pinned release |
| Caddy | Reverse proxy | Apache 2.0 |  |
| Playwright and Chromium | Tests and report PDF | Apache 2.0 and BSD-style |  |
| OpenTelemetry | Instrumentation | Apache 2.0 |  |
| Grafana and Loki | Dashboards and logs | AGPL-3.0 | Use the hosted free tier, or run unmodified as separate services. Never link or modify |
| WireGuard | Private link | GPL-2.0 in the kernel | A system service, not distributed with KAIRO |
| Trivy, OWASP ZAP | Release scans | Apache 2.0 | Used only in the pipeline |
| Semgrep engine | Self-scan only in Release 1 | LGPL 2.1 | Rules are not used for customers |


## License policy


| Category | Licenses | Rule |
| --- | --- | --- |
| Allowed | MIT, BSD, Apache 2.0, ISC, PostgreSQL License | Allowed without review |
| Review required | LGPL, MPL | Allowed after a recorded decision on how it is linked and packaged |
| Not allowed in shipped code | AGPL, SSPL, commercial-only terms | The scan fails the build unless a written exception names the component, the reason and the owner |


The pipeline generates a software bill of materials in CycloneDX format for every release. It feeds the /licenses page and the license scan.


## External services


| Service | Purpose | Data it sees | Control |
| --- | --- | --- | --- |
| GitHub | Sign-in, repository access, webhooks | Identity, repository contents the user selected | Least-privilege GitHub App, read-only |
| Model provider | Logic review | Redacted route context | Gated by the LR-14 review and the data-class rule in section 8 |
| Object storage provider | Snapshots, reports, evidence | Encrypted objects only | Envelope encryption before upload |
| Hosting provider | Virtual machines | Everything on the nodes | Disk encryption, firewall, no shared secrets |
| DNS and certificate authority | Domain and HTTPS | Domain names | CAA records, automatic renewal |


Release 1 sends no email, so no email service is listed in the Privacy Policy. Adding one requires a policy update first.


# 19. Traceability

Every requirement group in the PRD is answered by at least one section of this TRD, and the table shows where.


| PRD group | TRD sections | How it is satisfied |
| --- | --- | --- |
| FR-A accounts and settings | 10, 11, 12 | GitHub App sign-in, server-side sessions, rate limits, export and deletion endpoints, audit events |
| FR-I project intake | 5, 6, 7, 10, 11, 17 | GitHub App with read-only access, ZIP handling, platform limits, encrypted snapshots, authorization attestation |
| FR-S static analysis | 7 | Route inventory, framework extractors, rule format with fixtures, secrets detection |
| FR-L logic review | 8, 12 | Provider interface, context assembly, redaction, schema and citation validation, injection defenses |
| FR-D dynamic testing | 9, 12, 17 | gVisor sandbox lifecycle, network isolation, test procedure, safety bounds, limits |
| FR-F findings and triage | 6, 10, 11 | Merge, fingerprints, status history, re-check and compare endpoints |
| FR-O operations and abuse | 11, 12, 14 | Runner API, operator console, elevation and audit, abuse process |
| FR-R reports | 6, 11, 15 | One report data document, PDF through Chromium, JSON and SARIF exports, share links |
| NFR-S platform security | 12, 13, 16 | Threat model, hardening checklist, secrets management, self-scan gate, security tests |
| NFR-P and NFR-R performance and reliability | 6, 10, 13, 16, 17 | Time budget, idempotent stages, backups and restore drills, failure tests, capacity model |
| NFR-A, C, I, M, D, O quality and operations | 11, 14, 15, 16 | WCAG checks, browser matrix, message catalog, rule tests, OpenAPI, metrics and alerts |
| LR legal and privacy | 8, 10, 12, 15, 18 | Provider gate, retention jobs, key deletion, legal pages and security.txt, license policy |
| BR brand and interface | 15 | Design tokens and a lint or test for each guardrail |
| Success metrics and baseline study | 14, 16 | Benchmark harness, scoring script, product metrics |
| Roadmap gates | 16 | Evidence required at each gate |


## Decisions this TRD makes that the PRD should absorb

These came up while designing and are not yet in the PRD. They should be added in its next version.

- **Sidecar services.** Dynamic testing supports PostgreSQL, MySQL, Redis and MongoDB sidecars, because most applications cannot start without a database (section 9). The PRD's dynamic-testing scope should say so.
- **Fail-closed provider gate.** Logic review for user code stays disabled until a provider passes the LR-14 review (section 8). The PRD should state this as a requirement tied to LR-5.
- **Three-valued signals.** The route inventory records detected, absent or unknown for each check, and unknown routes go to logic review (section 7). This refines FR-S2.
- **Numeric limits.** Platform limits, rate limits, session lifetimes and retention periods are fixed in sections 10, 11 and 17, so the PRD can refer to them instead of leaving them open.
- **Confidence alignment.** The PRD's confidence table and FR-L6 should be worded to match section 6, where a logic finding with validated citations is Likely and only dynamic evidence makes it Confirmed.

# 20. Decision log, risks, open questions and sources

Fifteen decisions are recorded here, and three of them are still proposals that a named piece of work will settle.


## Decision log


| ID | Decision | Status | Reason in one line |
| --- | --- | --- | --- |
| ADR-01 | Python 3.13 and FastAPI for the API and workers | Decided | One language for analysis and services, typed models, generated OpenAPI |
| ADR-02 | Next.js 16 with TypeScript for the web application | Decided | Server-rendered public pages and one codebase for the app |
| ADR-03 | PostgreSQL 18 as the only database | Decided | Relational integrity, row-level security, one datastore to run |
| ADR-04 | Postgres-backed queue (Procrastinate) | Proposed | Transactional enqueue and no second datastore. A one-week spike confirms it |
| ADR-05 | S3-compatible object storage with client-side envelope encryption | Proposed | Provider chosen after cost and region review |
| ADR-06 | In-house static engine on tree-sitter with team-written rules | Decided | Semgrep's rules cannot be used in a competing service |
| ADR-07 | gVisor sandboxes on a separate runner node without credentials | Decided | Strongest isolation available on free-tier hosts without KVM |
| ADR-08 | One model-provider interface, with a fail-closed gate by data class | Decided | Provider and data-handling terms are still open (LR-14) |
| ADR-09 | GitHub App sign-in with server-side sessions and no passwords | Decided | Nothing to steal, and sessions can be revoked at once |
| ADR-10 | Same-origin routing behind Caddy | Decided | First-party cookies and no cross-origin sharing |
| ADR-11 | Per-project envelope encryption, with key deletion as erasure | Decided | Satisfies erasure in backups without rewriting them |
| ADR-12 | OpenTelemetry and structured logs, with no third-party error tracker receiving content | Decided | Keeps code and credentials out of other companies' systems |
| ADR-13 | Two Linux VMs on a free-tier or credit-funded host | Proposed | Host and CPU architecture depend on availability |
| ADR-14 | One repository, uv for Python and pnpm for JavaScript | Decided | Shared types, one pipeline, reproducible installs |
| ADR-15 | Report PDF from headless Chromium printing the real report page | Decided | The PDF cannot drift from the web view |


## Technical risks

These are risks to the design itself. Product and legal risks are in PRD section 17.


| ID | Risk | Mitigation |
| --- | --- | --- |
| TR1 | gVisor does not implement every system call, so some applications fail to start | Run the sandbox conformance suite and sample applications for each supported framework early. Report the runtime as the cause. Never weaken isolation to make an application start |
| TR2 | Scanned applications use native dependencies that lack arm64 builds | Prefer an amd64 runner. Build images for both architectures. Record the cause in the report |
| TR3 | Procrastinate does not meet the load or reliability need | The week-one spike decides. Fallback is Celery with Redis behind the same job interface |
| TR4 | Routes registered dynamically are missed by static extraction | Mark them unknown, use the OpenAPI document and the crawl, and state the limit in the report |
| TR5 | No model provider passes the LR-14 review in time | Logic review for user code stays disabled. Static and dynamic layers still ship. Self-hosted open-weight models are a Release 2 option |
| TR6 | Free-tier virtual machines are unavailable or their terms change | The node bootstrap script and the portable two-VM design allow a move to credit-funded hosting |
| TR7 | A single application node is a single point of failure | Accepted for Release 1 under the 99 percent target. Backups and restore drills limit the damage |
| TR8 | Sign-in flows that need JavaScript, CAPTCHA, multi-factor codes or external identity providers cannot be automated | Support JSON, form and bearer recipes. A Playwright fallback is a Release 2 option. Report the limitation |
| TR9 | The scope does not fit one academic term | Cut Should requirements first, then reduce dynamic tests to FR-D6 to FR-D8, as in the PRD |
| TR10 | Isolating headless Chromium for PDF rendering costs more time than planned | Fall back to HTML-to-PDF rendering with print styles, after checking that it still satisfies FR-R2 |


## Open questions

☐   Does the Procrastinate spike pass? It decides ADR-04.

☐   Which object storage provider is used, and in which region? It decides ADR-05.

☐   Can an amd64 runner be had within the free-tier constraint? It decides ADR-13.

☐   Which model provider is approved for user code after the LR-14 review, or is a self-hosted model needed?

☐   Is Python 3.14 ready for every dependency, so the services can move up from 3.13?

☐   Which Node and Python versions are offered as sandbox base images, and how are they updated?

☐   How are GitHub App flows tested in the pipeline: recorded fixtures or a local mock server?

☐   Which domain and DNS provider are used?

☐   Can a project choose the sidecar database version, or is one version pinned per engine?


## Sources

- , for the engine and rules licenses
- , for the July 2026 runsc release and its Docker and Kubernetes integration
- , for x86-64 and ARM64 support
- , for PostgreSQL 18 minor releases through August 2026
- , for Next.js 16 as the Active LTS release
- , for the Pydantic v2 requirement
- , a secondary summary of DeepSeek's data handling
- , for the V4 model names and retired aliases
- and , for hosting credit and free-tier availability

Several sources are secondary summaries. Version numbers, licenses and offers must be re-checked against primary sources when the repository is created.
