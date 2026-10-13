
**APP FLOW**


**KAIRO**

*Screens, flows and states for Release 1*


| Document App Flow | Version 0.1 |
| --- | --- |
| Status Draft for review | Date 11 October 2026 |
| Implements PRD v0.1 and TRD v0.1 | Course Project-Based Learning |


**Contents**

1. Document control

2. Actors, conventions and notation

3. Information architecture

4. Screen inventory

5. The end-to-end journey

6. F-01 First visit, sign-in and terms acceptance

7. F-02 Add a project

8. F-03 Configure a project and start a scan

9. F-04 Watch a scan, stop it, and read partial results

10. F-05 Read a report and a finding

11. F-06 Fix a finding, re-check it, and compare scans

12. F-07 Triage: dismiss or reopen a finding

13. F-08 Export a report and share it

14. F-09 Manage the account, connections and data

15. F-10 Public flows: reports, legal pages and consent

16. F-11 Operator flows

17. System states and error handling

18. Notifications, progress and live updates

19. Navigation, accessibility and responsive behavior

20. Traceability, open questions and hand-off


# 1. Document control

This document defines how people and systems move through KAIRO: which screens exist, what each step does, what happens when a step fails, and what each user sees at every state.


| Field | Value |
| --- | --- |
| Product | KAIRO |
| Document | App Flow |
| Version | 0.1 |
| Status | Draft for review |
| Implements | Product Requirements Document v0.1 and Technical Requirements Document v0.1 |
| Audience | Design, engineering, faculty guide, evaluators |
| Hand-off | UI/UX Design Brief, which gives each screen its visual design |


## What this document does and does not do

- It fixes behavior: screens, routes, access rules, steps, states, errors and copy for system messages.
- It does not fix visuals. Layout, color, type and components belong to the UI/UX Design Brief, which takes this document's screen IDs as its list of pages to design.
- It does not fix data fields. The Backend Schema does that. This document names only the data a screen shows or asks for.

## Identifier scheme


| Prefix | Meaning | Example |
| --- | --- | --- |
| P | Public screen | P-03 Privacy Policy |
| A | Signed-in application screen | A-08 Scan progress |
| O | Operator screen | O-02 Operations dashboard |
| D | Dialog | D-03 Dismiss a finding |
| F | Flow | F-03 Configure and start a scan |
| E | Error, empty or limit state | E-07 Project too large |
| N | Notification or live update | N-02 Stage failed |


Routes match the TRD's API and the web application's page tree. Wording in quotation marks is the exact text a screen shows, and it follows the PRD's copy rules (BR-3, BR-6, BR-7, BR-14): sentence case, no exclamation marks, no em dashes and no hype words.


# 2. Actors, conventions and notation

Eight actors take part in the flows, and five of them are people.


| Actor | Who | Access |
| --- | --- | --- |
| Visitor | Anyone without a session | Public pages P-01 to P-10 |
| User | A person signed in with GitHub | Public pages and the application, limited to their own data |
| Viewer | Anyone holding an unexpired share link | One shared report, read only |
| Operator | A maintainer using the operations console | Operator screens over the private link, with no access to customer content unless elevated |
| Reporter | Someone reporting abuse or a vulnerability | The Security and Contact pages and the published addresses |
| System | The API, workers and runner agent | Acts on behalf of a user's request |
| GitHub | Sign-in provider and repository host | Called by the system. Never called by the browser except for sign-in and installation redirects |
| Model provider | Receives redacted context for logic review | Called by workers only, and only when permitted (TRD section 8) |


## How each flow is written

Every flow in sections 6 to 16 has the same parts, so a reader can compare them.

- **Goal and entry points:** What the person wants and where they can start.
- **Preconditions:** What must already be true.
- **Steps:** A table of what the person does, what the system does in response, and which screen is shown.
- **Branches and errors:** Every way a step can go differently, each with a defined outcome.
- **Outcome:** The state the person and the system are left in.
- **Covers:** The PRD requirements and user stories the flow satisfies.

## Rules that apply to every flow


| Rule | Behavior |
| --- | --- |
| One primary action per screen | The next step in the flow is always the single visually primary action. Everything else is secondary |
| No dead ends | Every error and empty state names what happened and offers a next step (BR-14) |
| Destructive actions | Reversible actions ask for a plain confirmation. Irreversible ones, such as deleting a project or the account, require typing a named confirmation |
| Settings are saved explicitly | Project settings use a Save button, not autosave, because they include credentials. Leaving with unsaved changes shows dialog D-12 |
| Nothing happens twice | Buttons that start work are disabled while the request is in flight, and the API's idempotency key covers a retry (TRD section 11) |
| Secrets are write-only | Passwords, tokens and environment values can be replaced or removed after saving but are never shown again. Masked values show only the last two characters |
| Live state is announced | Every change of scan or stage state appears on screen and is announced to assistive technology (section 18) |
| Session end is safe | When a session expires, the person is sent to sign-in and returned to the same route afterwards, with no unsaved secret retained in the browser |


# 3. Information architecture

KAIRO has three areas: public pages that anyone can read, a signed-in application that shows a person only their own data, and an operator console that exists only on the private link.


## Rules for addresses

- Public pages and the application share one origin. The operator console does not exist on the public site at all. A request for it from outside the private link gets the same not-found page as any unknown address.
- Addresses are lower case and name things, for example /app/projects/{id}. Identifiers are opaque. Project names, repository names and people's names never appear in an address.
- The state of a view that a person may want to return to lives in the address: filters on the report, the active settings tab and the two scans being compared.
- Someone else's object and a missing object look the same: the not-found page. Identifiers cannot be probed (TRD section 11).
- Every earlier version of the Privacy Policy and the Terms keeps its own address under /privacy/archive/{version} and /terms/archive/{version}.

# 4. Screen inventory

KAIRO has 10 public screens, 16 application screens, 6 operator screens and 13 dialogs, and each one has an owner flow in sections 6 to 16.


## Public screens


| ID | Screen | Route | Access | Purpose |
| --- | --- | --- | --- | --- |
| P-01 | Home | / | Anyone | States what KAIRO does and who it is for in plain terms, and offers sign-in. Shows no usage numbers, testimonials or logos (BR-6) |
| P-02 | Sign in | /sign-in | Anyone | One action: continue with GitHub. States that only identity is requested and links to the Privacy Policy and Terms |
| P-03 | Privacy Policy | /privacy | Anyone | Version, effective date and change history (LR-3) |
| P-04 | Terms and Conditions | /terms | Anyone | Version, effective date and change history (LR-4) |
| P-05 | Security | /security | Anyone | How to report a vulnerability, and plain facts about isolation and retention (LR-8) |
| P-06 | Contact | /contact | Anyone | Addresses for support, privacy and grievances, and abuse reports |
| P-07 | Licenses | /licenses | Anyone | Third-party attributions generated from the software bill of materials |
| P-08 | Shared report | /s/{token} | Link holder | A read-only report with evidence removed unless the owner included it. Excluded from search indexing |
| P-09 | Not found | Any unknown route | Anyone | State E-01. Also shown for another user's objects, so identifiers cannot be probed |
| P-10 | Server error | Any failed render | Anyone | State E-02 |


## Application screens


| ID | Screen | Route | Access | Purpose |
| --- | --- | --- | --- | --- |
| A-01 | Welcome | /welcome | Signed in, terms not accepted | Shows the current Terms and Privacy Policy versions and one action to accept. Required on first sign-in and whenever either version changes (LR-4) |
| A-02 | Projects | /app/projects | Signed in | The user's projects with the latest scan status. Empty state E-03 |
| A-03 | Add project | /app/projects/new | Signed in | Choose a source: GitHub repository or ZIP archive |
| A-04 | Choose repository | /app/projects/new/repository | Signed in | Lists repositories from the user's GitHub App installations, with search and a link to manage access on GitHub |
| A-05 | Upload archive | /app/projects/new/upload | Signed in | File picker with the limits stated beside it: 50 MB compressed, 200 MB extracted |
| A-06 | Project overview | /app/projects/{id} | Owner | Source, latest scan, scan history and the actions Start scan and Settings |
| A-07 | Project settings | /app/projects/{id}/settings | Owner | Tabs: Source, Run, Accounts, Review, Ignore, and Danger zone |
| A-08 | Scan progress | /app/projects/{id}/scans/{scanId} while running | Owner | Stage-by-stage progress with a Stop action |
| A-09 | Report | The same route once the scan ends | Owner | Result overview, filters, finding list, and the scope and limits statement |
| A-10 | Finding | .../scans/{scanId}/findings/{findingId} | Owner | The complete finding with fix, evidence and re-check |
| A-11 | Route inventory | .../scans/{scanId}/routes | Owner | The report appendix: routes and the checks found on each |
| A-12 | Compare scans | /app/projects/{id}/compare | Owner | New, fixed and unchanged findings between two scans |
| A-13 | Account | /app/account | Signed in | Identity, GitHub connections and sign-out |
| A-14 | Activity | /app/account/activity | Signed in | The user's own security events (FR-A6) |
| A-15 | Data | /app/account/data | Signed in | Export all data, and delete the account |
| A-16 | Shared links | /app/projects/{id}/shares | Owner | Active share links with expiry, and revoke |


## Operator screens

All operator routes are reachable only over the private link.


| ID | Screen | Route | Access | Purpose |
| --- | --- | --- | --- | --- |
| O-01 | Operator sign-in | /ops/sign-in | Operator | Hardware security key sign-in |
| O-02 | Operations dashboard | /ops | Operator | Queue depth, failed jobs, error rates and runner health (FR-O1) |
| O-03 | Jobs | /ops/jobs | Operator | Failed and stuck jobs, with retry and cancel (FR-O2) |
| O-04 | Accounts | /ops/accounts | Operator | Find an account by opaque ID or GitHub login, and suspend or restore it (FR-O2) |
| O-05 | Content elevation | /ops/elevations | Operator | Request a time-limited elevation, and see active and past ones (FR-O3) |
| O-06 | Abuse and security reports | /ops/reports | Operator | The log of reports received and their outcomes (FR-O4) |


## Dialogs


| ID | Dialog | Opens from | Purpose and confirmation style |
| --- | --- | --- | --- |
| D-01 | Authorization confirmation | A-06, A-07 before a first scan | The user confirms ownership or written permission to test (LR-1). Checkbox, then Confirm and continue |
| D-02 | Stop scan | A-08 | Plain confirmation |
| D-03 | Dismiss a finding | A-10 | A reason is required, and a type: False positive or Accepted risk |
| D-04 | Reopen a finding | A-10 | Optional note |
| D-05 | Share report | A-09 | Choose whether to include evidence (off by default) and an expiry (14 days by default) |
| D-06 | Revoke share link | A-16 | Plain confirmation |
| D-07 | Export report | A-09 | Choose PDF, JSON or SARIF |
| D-08 | Disconnect GitHub installation | A-13 | Explains that projects from it can no longer be scanned. Plain confirmation |
| D-09 | Delete project | A-07, Danger zone | Typed project name |
| D-10 | Delete account | A-15 | Fresh GitHub sign-in, then the typed phrase "delete my account" |
| D-11 | Logic review disclosure | First use of logic review | Names the provider, what is redacted and how to switch it off (LR-5) |
| D-12 | Unsaved changes | Any settings tab | Save, Discard or Stay |
| D-13 | Elevation request | O-05 | A stated reason. The duration is fixed at 30 minutes |


# 5. The end-to-end journey

A new user goes from first visit to a verified fix through five steps once, and three follow-up activities that they repeat for as long as there are findings.


| Step | Flow | Section | What the person has at the end |
| --- | --- | --- | --- |
| 1 Sign in | F-01 | 6 | A session and a recorded acceptance of the current Terms and Privacy Policy |
| 2 Add a project | F-02 | 7 | A project from a repository or an archive, with its stack detected |
| 3 Start a scan | F-03 | 8 | Run settings and test accounts saved, authorization confirmed, and a scan queued |
| 4 Watch the scan | F-04 | 9 | A finished scan, or a stopped or failed one with a clear explanation |
| 5 Read the report | F-05 | 10 | An understanding of what to fix first, with the fix in hand |
| Fix and re-check | F-06 | 11 | A finding marked Fixed by evidence, and a view of what changed between scans |
| Triage | F-07 | 12 | Findings set aside with a reason on record |
| Export and share | F-08 | 13 | A file, or an expiring link, that someone else can read |


Steps 1 and 2 are normally done once. Steps 3 to 5 repeat for every scan. The activities that follow the report can happen in any order, and fixing something leads back to step 3.


# 6. F-01 First visit, sign-in and terms acceptance

A visitor becomes a signed-in user in two steps, and nothing else in the product is reachable until the current Terms are accepted.

**Goal:** Sign in with GitHub and accept the current Terms and Privacy Policy.

**Entry points:** P-01 and P-02, or any protected route, which redirects to P-02 and remembers where the person was going.

**Preconditions:** The visitor has a GitHub account.


## Steps


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Opens KAIRO, or follows a link to a protected page | Shows P-01, or redirects a protected route to P-02 and keeps the requested path. Only same-origin paths are kept, so the redirect cannot be abused | P-01 or P-02 |
| 2 | Selects "Continue with GitHub" | Creates a state value and a PKCE verifier, holds them for 10 minutes, and sends the browser to GitHub asking for identity only | GitHub |
| 3 | Approves on GitHub | GitHub returns the browser to the callback with a code and the state | GitHub |
| 4 | Nothing | Checks the state and the verifier, exchanges the code, reads the GitHub ID, login and avatar (and email if shared), creates or updates the user, and creates a server-side session with the __Host-kairo_session cookie | No screen |
| 5 | Nothing | Sends a user who has not accepted the current Terms and Privacy Policy versions to A-01. Otherwise sends them to the remembered path, or to A-02 | A-01 or A-02 |
| 6 | Reads the document versions and selects "Accept and continue" | Records both versions, a content hash and a timestamp (LR-4), then continues to the remembered path or A-02 | A-01 |


## Branches and errors


| Situation | Result |
| --- | --- |
| The visitor cancels on GitHub | Back to P-02 with the message "Sign-in was cancelled. You can try again when you are ready." |
| The state is missing, wrong or older than 10 minutes | Back to P-02 with E-04: "That sign-in link has expired. Start again." No session is created |
| GitHub does not respond | Back to P-02 with E-05: "GitHub is not responding. Try again in a few minutes." |
| GitHub shares no email address | The account is created without one. KAIRO needs no email in Release 1, so nothing else changes |
| The account is suspended | Back to P-02 with E-06: "This account is suspended. The Contact page lists how to reach us." No reason is shown |
| A signed-in person opens P-02 | Redirected to A-02 |
| The person does not accept the Terms | A-01 shows only "You need to accept the Terms to use KAIRO" and a Sign out link. No other application screen opens |
| The Terms or Privacy Policy version changes later | At the next request the person is sent to A-01, then returns to where they were |
| The session ends | After 8 idle hours or 14 days in total the person is sent to P-02 and returned to the same path after signing in. Nothing typed into a secret field is kept |


**Outcome:** A session exists, acceptance of both documents is recorded, and the person is on A-02 or the page they asked for.

**Covers:** FR-A1, FR-A2, US-01, LR-3, LR-4.


# 7. F-02 Add a project

A user adds a project from a GitHub repository or a ZIP archive, and in both cases ends on the project settings with the stack already detected.

**Goal:** Create a project that KAIRO can scan.

**Entry points:** The Add project action on A-02, or the empty state E-03.

**Preconditions:** Signed in, with the Terms accepted.


## Path A: GitHub repository


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects Add project, then "GitHub repository" | Lists the user's GitHub App installations. If there are none, shows E-07: "KAIRO cannot read any of your repositories yet." with the primary action "Choose repositories on GitHub" | A-03, A-04 |
| 2 | Selects "Choose repositories on GitHub" | Sends the browser to the KAIRO app's installation page on GitHub | GitHub |
| 3 | Chooses the account and the repositories to allow, then installs | GitHub redirects the browser to KAIRO's setup address with the installation ID and an action of install or update | GitHub |
| 4 | Nothing | Asks GitHub, using the signed-in user's own authorization, whether that installation belongs to this user. Only then does it save the installation and encrypt its token. This check stops someone from linking an installation they do not own | No screen |
| 5 | Sees the repositories they allowed, searches, and selects one | Shows only repositories the installation can read, with a link "Missing a repository? Change access on GitHub" | A-04 |
| 6 | Selects "Add project" | Checks the repository's reported size against the 200 MB limit, creates the project on its default branch, reads the manifest files through the GitHub API to detect the stack, and opens the settings | A-07 |


## Path A: branches and errors


| Situation | Result |
| --- | --- |
| The person leaves GitHub without installing | Back on A-04 with E-07 still shown. Nothing is saved |
| The installation belongs to someone else, or cannot be verified | E-08: "That GitHub installation is not linked to your account." Nothing is saved |
| The repository is already a project of this user | The existing project opens with the note "This repository is already a project." |
| The repository is larger than 200 MB | E-09: "This repository is larger than the 200 MB limit. Remove build output and large files, or choose a smaller repository." |
| No supported framework is found | The project is created. A-07 shows E-10: "KAIRO did not find Express, Next.js, FastAPI or Flask. Secret checks still run. You can correct the stack." |
| The person changes repository access on GitHub later | GitHub sends the "update" action or a webhook. The repository list refreshes. A project whose repository was removed shows "Disconnected" on A-02 and A-06, and scans are blocked |
| The person removes the installation on GitHub | The webhook marks every project from it as Disconnected. Results stay until the person deletes them |
| GitHub does not respond | E-05 with a retry action |


## Path B: ZIP archive


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects Add project, then "Upload archive" | Shows the limits beside the file picker: 50 MB compressed, 200 MB extracted, 20,000 files | A-05 |
| 2 | Chooses or drops a ZIP file | The browser checks the extension and size at once. The server stays authoritative | A-05 |
| 3 | Selects "Upload" | Streams the file with a progress bar. The server reads the archive's file list and rejects unsafe paths, links that leave the root and extreme expansion before it accepts anything | A-05 |
| 4 | Waits | Stores the archive encrypted, creates the project with source "archive", detects the stack, and opens the settings. A note says "KAIRO keeps this archive for up to 24 hours. To scan it again later, upload it again or connect a repository." | A-07 |


## Path B: branches and errors


| Situation | Result |
| --- | --- |
| The file is not a ZIP | E-11: "Only .zip files are supported." |
| The archive is over 50 MB | E-12: "This archive is larger than the 50 MB limit. Remove dependency folders and build output, then try again." |
| The archive expands past 200 MB or 20,000 files | E-12 with the matching limit named |
| The archive has unsafe paths or links | E-13: "This archive contains paths that cannot be read safely, so KAIRO rejected it." |
| The archive is damaged | "KAIRO could not read this archive. Check that it is a valid ZIP and try again." |
| The upload is interrupted | "The upload did not finish. Try again." Nothing is saved |
| More than 5 uploads in an hour | E-14: "You have reached the upload limit. Try again after {time}." |
| The archive was uploaded but a scan starts more than 24 hours later | The scan does not start. E-15: "The uploaded archive was deleted after 24 hours. Upload it again." |


**Outcome:** A project exists with a detected stack and the person is on A-07, ready for F-03.

**Covers:** FR-I1 to FR-I6, US-02, US-03, LR-6.


# 8. F-03 Configure a project and start a scan

A scan can start as soon as a project exists, but dynamic testing only becomes available once the project knows how to start and sign in.

**Goal:** Describe how to run the application, confirm authorization to test it, and start a scan.

**Entry points:** A-07 after adding a project, and the Start scan action on A-06.

**Preconditions:** A project exists and is not disconnected.


## The settings screen

A-07 has six tabs. Settings are saved with an explicit Save button.


| Tab | Fields | Rules |
| --- | --- | --- |
| Source | Repository and branch (a list loaded from GitHub), or the archive details. The detected stack, which can be corrected | Branch changes apply to the next scan |
| Run | Install command, start command, port, health path, environment variables, sidecar services (PostgreSQL, MySQL, Redis, MongoDB), seed command | Install and start commands are prefilled from the stack. Port must be 1 to 65535. Commands are limited to 500 characters. Environment variable names are upper case with underscores. Values are write-only |
| Accounts | Two standard test accounts and an optional administrator, each with a login method (JSON, form or bearer token), a login path and credentials. A list of routes that are public by design | The page says: "Use accounts created for testing. Do not use real customer accounts." Credentials are write-only |
| Review | Logic review on or off | While no model provider is approved for user code, the switch is off and disabled with E-16 |
| Ignore | Extra patterns to skip, shown beside the built-in defaults | Patterns are validated before saving |
| Danger zone | Delete project (D-09) | Typed project name |


## Steps


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Checks the detected stack and branch on Source | Loads the branch list from GitHub. Shows E-10 if no supported framework was found | A-07 |
| 2 | Fills in the Run tab | Validates each field as the person leaves it. Shows masked values after saving, with Replace and Remove | A-07 |
| 3 | Adds test accounts on the Accounts tab | Requires a login path and credentials for each account. States that sign-in is checked when the scan runs | A-07 |
| 4 | Reviews the Review and Ignore tabs | If logic review is available and this is the first time it is enabled, opens D-11 with the provider, the redaction rules and how to switch it off (LR-5) | A-07, D-11 |
| 5 | Selects Save | Validates the whole form, saves it with a version check, and shows "Settings saved." | A-07 |
| 6 | Selects Start scan | Opens D-01 if no authorization confirmation exists for this project. Then checks concurrency, the hourly limit, the repository connection, the archive's age and the project size | A-06, D-01 |
| 7 | Reviews the scan options and selects Start scan | Shows the branch and commit, and one row per layer: Static analysis (always on), Logic review (on or off, or unavailable) and Dynamic testing (on when configured, otherwise off with the reason and a link to the missing setting) | A-06 |
| 8 | Waits a moment | Creates the scan with an idempotency key, queues it, and opens the progress screen | A-08 |


## The authorization dialog (D-01)

The dialog heading is "Confirm you may test this project". The body reads: "I own this project, or I have written permission from its owner to test it. I understand that KAIRO will run the application in an isolated sandbox using the accounts I provided." The Confirm and continue button stays disabled until the box is checked. The confirmation is saved with the wording version, the user and a timestamp, and it is not shown again for this project unless the wording changes (LR-1).


## Branches and errors


| Situation | Result |
| --- | --- |
| Dynamic testing is selected but the project lacks a start command, a port or two standard accounts | The row is off and the reason names what is missing, E-17: "Dynamic testing needs a start command, a port and two standard test accounts." |
| The person closes D-01 without confirming | Stays on A-06. No scan is created |
| Three scans are already running | E-18: "You already have 3 scans running. Wait for one to finish or stop one." |
| The hourly limit of 10 scans is reached | E-19: "You have reached the hourly scan limit. Try again after {time}." |
| The repository is disconnected | E-20: "KAIRO can no longer read this repository. Reconnect it on GitHub." with a Reconnect action |
| The archive is older than 24 hours | E-15 |
| The project is over a size limit at the final check | E-09 or E-12, naming the limit |
| Settings were changed in another tab | E-21: "These settings changed in another tab. Reload to see the latest." The unsaved form is kept until the person chooses |
| The person leaves with unsaved changes | D-12 |
| The Save request fails | "Settings were not saved. Try again." The form keeps its values. Secret values the person typed stay in the form but are never stored in the browser |


**Outcome:** A scan is queued and the person is on A-08.

**Covers:** FR-I7, FR-D1, FR-D4, FR-D14, US-04, US-05, US-12, LR-1, LR-5.


# 9. F-04 Watch a scan, stop it, and read partial results

The progress screen reports each layer separately, so a failure in one layer never hides what the others found.

**Goal:** Follow a running scan, stop it if needed, and understand what a partly finished scan means.

**Entry points:** A-08 immediately after starting a scan, the scan history on A-06, and A-02. The address works in any later session.

**Preconditions:** A scan exists for a project the person owns.


## What A-08 shows

The screen has a summary line (project, branch, short commit, start time, and the overall state) and one row for each stage. A row shows the stage name, its state in words, and one line of detail. The drawing below shows the screen part-way through a scan, with example values.


## Detail line for each stage


| Stage | While running, the detail line says |
| --- | --- |
| Prepare | "Fetching code", then "Storing snapshot" |
| Static analysis | "{n} of {total} files parsed", then "{n} routes found" |
| Logic review | "{n} of {total} routes reviewed" |
| Dynamic testing | The phase: "Signing in accounts", "Discovering routes", "Creating test records", "Running tests, {n} of {budget} requests", or "Cleaning up" |
| Merge and rate | "Rating findings" |
| Report | "Building report" |


When a stage is waiting for a runner or a worker, the detail line says "Queued. {n} scans are ahead of this one." when a position is known.


## Steps


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Arrives from Start scan, or opens the scan later | Loads the scan and opens the live stream. A small text label reads "Live" while it is connected | A-08 |
| 2 | Watches, or leaves and comes back | Updates each row as its state changes (N-01) and announces each change politely to assistive technology. The scan continues if the person leaves | A-08 |
| 3 | Selects "Stop scan" if needed | Opens D-02: "Stop this scan? A stopped scan does not produce a report. You can start a new one at any time." | D-02 |
| 4 | Confirms | Sets the cancel flag. Rows show "Stopping" until the runner destroys the sandbox, then the scan ends as Cancelled | A-08 |
| 5 | Nothing | When the report is built, the same address becomes the report. Focus moves to the report heading and the screen announces "Scan complete. {n} high findings, {n} medium findings." | A-09 |


## Branches and errors


| Situation | Result |
| --- | --- |
| A stage fails | Its row shows "Failed" with a one-line reason, for example "The application did not start within 120 seconds". A "Show startup log" control reveals the redacted end of the log. Other stages continue. The scan ends as Completed with warnings and A-09 opens with the banner from N-02 |
| A layer was turned off by the user | Its row says "Skipped: turned off in settings" |
| A layer could not run | Its row says "Skipped" with the reason, for example "No route inventory" or "No start command" |
| Static analysis fails | Logic review and dynamic testing are skipped. The scan ends with E-22: "Static analysis did not finish, so no findings were produced. This is not a clean result." |
| The code could not be fetched | The scan fails with E-23: "KAIRO could not fetch the code. {reason}" and a Start new scan action |
| No runner picks up dynamic testing within 15 minutes | The stage fails with E-24: "No test runner was available. Try the scan again later." Other stages continue |
| The token ceiling stops logic review early | The row says "Partial: {n} of {total} routes reviewed. The limit for this scan was reached." The report lists the routes that were not reviewed |
| The model service does not respond | The row says "Failed: the model service did not respond." Other stages continue |
| Merge or report building fails | The scan fails with E-25: "Something went wrong while building the report. KAIRO has been alerted. Start a new scan to try again." |
| Live updates drop for more than 10 seconds | A banner says "Live updates paused. Reconnecting." and the screen polls every 3 seconds until the stream returns |
| The person opens another user's scan | P-09, not found |


**Outcome:** A finished scan opens as A-09. A stopped or failed scan shows its stage summary and a clear next action, and never presents missing results as a clean result.

**Covers:** US-06, FR-D3, FR-D11, FR-L9, NFR-O1, FR-R7.


# 10. F-05 Read a report and a finding

The report puts the most serious, best-evidenced findings first and never shows a missing result as a clean one.

**Goal:** Understand what was found, how sure KAIRO is, and what to fix first.

**Entry points:** A-09 when a scan completes, and the scan history on A-06.

**Preconditions:** A finished scan of a project the person owns.


## The report screen (A-09)


| Part | Contents |
| --- | --- |
| Scan summary | Project, branch, short commit, date, and each layer with its state. If logic review ran, the line reads "Logic review (AI-assisted) using {provider} and {model}" |
| Warning banner | Shown when any stage failed, was partial, or was skipped without the user's choice (N-02). Links to the Scope and limits part |
| Result overview | A table of counts by severity (Critical, High, Medium, Low, Informational) and by confidence (Confirmed, Likely, Possible). There is no composite score |
| Filters | Severity, confidence, status, layer and a text search. Filters live in the address, so a filtered view can be bookmarked. The default status filter is Open |
| Finding list | Sorted by severity, then confidence. Each row shows the title, severity and confidence as words, the location, the layers that found it, and the status. Fifty rows load at a time with a Show more action |
| Actions | Export (D-07), Share (D-05), Compare (A-12), Route inventory (A-11), and Start new scan |
| Scope and limits | What was tested, what was not, and the statement that a clean result does not prove the application is secure (FR-R7) |


## The finding screen (A-10)


| Part | Contents |
| --- | --- |
| Heading | The title, with severity and confidence as text labels and distinct shapes |
| Location | File, line range and route, with a Copy path action. For repository projects, a link to the same lines on GitHub at the scanned commit |
| What is wrong | Two to four plain sentences |
| Why it matters | The consequence in this application's own terms |
| Evidence | A code excerpt with line numbers. For Confirmed findings, the request and response that proved it, with the note "Passwords, tokens and cookies were removed." |
| How to fix | Steps for the detected framework with a code example and a Copy action |
| How to verify | A Re-check button and the result that means the fix worked |
| Detected by | The layers that found it. Logic review is labeled "AI-assisted", with the note "This finding comes from an AI-assisted review and can be wrong. Check it against your code." |
| References | The weakness identifier and the OWASP category, linked |
| Status | Current status, the Dismiss or Reopen action, and the history of changes with reasons |
| Navigation | Previous and Next links within the filtered list, and a link back to the report |


## Steps


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Opens the report | Moves focus to the report heading and shows the overview and the Open findings | A-09 |
| 2 | Reads the overview and narrows the list with filters | Updates the list and the address without reloading the page | A-09 |
| 3 | Opens a finding | Shows the full finding and records nothing about the visit | A-10 |
| 4 | Reads the explanation and evidence, and copies the fix | Copies the text and confirms with "Copied" | A-10 |
| 5 | Moves to the next finding, or returns to the report | Keeps the filters and the position in the list | A-10, A-09 |
| 6 | Applies the fix in their own code, outside KAIRO | Nothing. KAIRO never changes the person's repository | Not applicable |


The next step is F-06.


## Branches and errors


| Situation | Result |
| --- | --- |
| The scan found nothing | E-26: "No findings in the checks that ran. These checks do not cover everything, so this is not proof the application is secure." with a link to Scope and limits |
| Filters match nothing | "No findings match these filters." with a Clear filters action |
| Some layers did not run | The banner names them. The overview counts only what ran |
| A finding or scan is opened through a stale or foreign address | P-09, not found |
| The scan's source snapshot has already been deleted | The report still reads in full, because excerpts and evidence are stored with each finding. Re-checking needs the connected repository or a new archive upload |
| The list is very long | The list keeps loading 50 at a time. Past 200 rows it is virtualized so the page stays responsive |
| The person prints the page | Print styles show the same sections as the PDF. The PDF export is the recommended route |


**Outcome:** The person knows what to fix first and has the fix in hand.

**Covers:** US-07, FR-R1, FR-R6, FR-R7, FR-F4, BR-15.


# 11. F-06 Fix a finding, re-check it, and compare scans

A finding becomes Fixed only when KAIRO runs the same check again and no longer finds the problem, never because the person says so.

**Goal:** Confirm that a fix worked without paying for a full scan, then see the overall change.

**Entry points:** The Re-check button on A-10, and the Compare action on A-09 or A-06.

**Preconditions:** A finding with status Open on a finished scan. For repository projects, the person has pushed a fix to the scanned branch.


## Re-check

A re-check runs only the check behind one finding. A static finding re-runs its rule on the affected file. A logic finding re-reviews its route. A finding that was confirmed dynamically re-runs its test in a sandbox. A re-check counts toward the hourly scan limit.


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Applies the fix in their own repository and pushes it | Nothing. KAIRO does not touch the repository | Not applicable |
| 2 | Opens the finding and selects "Re-check" | Compares the latest commit on the scanned branch with the scanned commit. If they match, shows "No new commits since this scan. Push your fix, then re-check." and does not start. Otherwise explains: "KAIRO will fetch the latest commit of {branch} and run only this check." | A-10 |
| 3 | Confirms | Starts the re-check. The button is disabled and a status line shows "Re-checking: fetching code", then "Running the check" | A-10 |
| 4 | Waits | Announces the result politely and updates the status, the history and the evidence | A-10 |


## Re-check results


| Result | What the person sees | Status after |
| --- | --- | --- |
| The problem is no longer found | "Fixed. This check no longer finds the problem at commit {sha}." The history records a re-check | Fixed |
| The problem is still found | "Still found at commit {sha}." The location and evidence are updated, and the history records the attempt | Open |
| The affected route or file no longer exists | "The code this finding pointed to no longer exists. If it moved, run a new scan to check the new location." | Fixed, with that note |
| The re-check could not run | E-27: "The re-check could not run: {reason}. The status did not change." | Unchanged |


## Re-check: branches and errors


| Situation | Result |
| --- | --- |
| The project came from a ZIP archive | The dialog asks for the fixed archive: "Upload the fixed archive to re-check." It follows the upload rules in F-02, path B |
| The finding was confirmed dynamically but dynamic testing is no longer configured | "Re-checking this finding needs dynamic testing. Add a start command and two test accounts in settings." with a link |
| A scan limit applies | E-18 or E-19 |
| The repository was disconnected | E-20 |
| The person leaves the page during the re-check | The re-check continues and the result appears on the finding when they return |
| Several findings are re-checked in a row | Each runs on its own. There is no bulk re-check in Release 1 |


After fixing the serious findings, the finding screen suggests a full scan: "Run a new scan to check that the fixes did not introduce other problems."


## Compare scans (A-12)


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects Compare on a report, or picks two scans in the history | Defaults the pair to the two most recent finished scans of the project. Either side can be changed from a list of finished scans | A-09 or A-06 |
| 2 | Reads the three groups | Shows New (in the later scan only), Fixed (in the earlier scan only) and Unchanged, each with a count and a list. Matching uses each finding's fingerprint, so a moved line does not count as a new finding | A-12 |
| 3 | Opens any finding | Opens it in the scan where it appears | A-10 |


| Situation | Result |
| --- | --- |
| Fewer than two finished scans exist | E-29: "Compare needs two finished scans of this project." with a Start scan action |
| The two scans ran different layers or rule set versions | A banner says "These scans ran different layers or rule versions. Some differences may come from that." and lists the differences |
| One of the scans ended with warnings | The banner names the stage that did not finish, because a missing layer can look like a fixed finding |
| A dismissed finding appears in a group | Shown with its dismissal type, so it is not mistaken for an open one |


**Outcome:** Findings that were fixed are marked Fixed with evidence, and the person sees what changed between scans.

**Covers:** US-08, FR-F3, FR-F5, FR-F6.


# 12. F-07 Triage: dismiss or reopen a finding

A person can dismiss a finding only with a stated reason, and a dismissal lasts across scans until the evidence changes.

**Goal:** Record that a finding is wrong or accepted, so it stops competing for attention, without hiding it from the report.

**Entry points:** The Dismiss and Reopen actions on A-10.

**Preconditions:** A finding the person owns.


## Statuses

There are four statuses: Open, Fixed, Dismissed as false positive, and Dismissed as accepted risk. The drawing shows how a finding moves between them and what causes each move.


## Rules

- Only the re-check, a later scan, or the person changes a status. Nothing else does.
- After a full scan, an Open finding becomes Fixed only if every layer that originally found it ran to the end in that scan and the finding is absent. If one of those layers did not run, the status stays Open, because a missing layer must not look like a fix.
- A finding that was Fixed and appears again becomes Open, with the history entry "Found again in scan {id}".
- A dismissed finding stays dismissed in later scans unless its evidence changed. If it changed, the finding becomes Open with the note "The evidence changed since you dismissed this." (FR-F3, FR-F4).
- Dismissed findings stay in the report in their own section, with the reason, so a reader can see what was set aside.

## Steps


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects Dismiss on an Open finding | Opens D-03 with two choices and a reason box. The choices are "False positive: the finding is wrong" and "Accepted risk: the finding is correct and I accept it" | D-03 |
| 2 | Chooses a type and writes a reason | Requires both. The reason must be 10 to 500 characters. The dialog says "Do not include passwords or keys. This reason appears in the report and in shared links." | D-03 |
| 3 | Selects Dismiss | Saves the status with the reason, the person and the time. Updates the list and the counts. Announces "Finding dismissed. It stays dismissed in later scans unless its evidence changes." | A-10 |
| 4 | Later selects Reopen on a dismissed finding | Opens D-04 with an optional note | D-04 |
| 5 | Selects Reopen | Sets the status to Open and records the change | A-10 |


There is no timed undo. Reopen is always available, so no action depends on a person reacting within seconds.


## Branches and errors


| Situation | Result |
| --- | --- |
| The reason is too short | Inline: "Give a reason of at least 10 characters, so you and others can understand it later." |
| No type is chosen | Inline: "Choose a type." |
| The finding is Critical and the type is accepted risk | The dialog adds "This is a Critical finding. The report will show that you accepted it." It does not block the action |
| The status changed elsewhere while the dialog was open | E-30: "This finding changed while you were viewing it. Reload to see the latest status." |
| The request fails | "The change was not saved. Try again." The dialog stays open with the text intact |


**Outcome:** The finding has a recorded status and history, the counts match, and the report still shows every dismissed item.

**Covers:** US-09, FR-F3, FR-F4.


# 13. F-08 Export a report and share it

An owner can hand a report over as a file or as an expiring link, and the link shows less than the owner sees unless they choose otherwise.

**Goal:** Give someone else the report, as a file or a link.

**Entry points:** The Export and Share actions on A-09, and the shared links list on A-16.

**Preconditions:** A finished scan the person owns.


## Export (D-07)


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects Export | Opens D-07 with three formats: PDF, JSON and SARIF. A help line under SARIF reads "SARIF files can be uploaded to GitHub code scanning." | D-07 |
| 2 | Chooses a format and selects Download | JSON and SARIF are ready at once. PDF shows "Preparing the PDF" while the report is rendered, then starts the download | D-07 |
| 3 | Receives the file | The file is named kairo-{project}-{scan}-report with the matching extension. Every export holds the same findings as the web report (FR-R1) | Browser |


| Situation | Result |
| --- | --- |
| The PDF cannot be rendered | E-31: "The PDF could not be prepared. The web report is complete. Try again." The other formats still work |
| The scan ended with warnings | Every export carries the same warning and the scope and limits statement as the web report |
| The export is requested twice | The second request returns the same file. Nothing is duplicated |


## Share (D-05)


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects Share | Opens D-05 with two choices. The first is "Include request and response evidence", off by default, with the note "Evidence can show how a flaw is reached. Include it only for people you trust." The second is the expiry: 1, 7, 14 or 30 days, with 14 selected | D-05 |
| 2 | Selects Create link | Creates an unlisted link and shows it once with a Copy action and the text "Copy this link now. KAIRO stores only a fingerprint of it, so it cannot be shown again." | D-05 |
| 3 | Later opens the shared links list | Lists each link with its creation date, expiry date and whether evidence is included. The link itself is never shown again | A-16 |
| 4 | Selects Revoke on a link | Opens D-06. After confirming, the link stops working at once | D-06 |


The options of an existing link cannot be changed. The person creates a new link and revokes the old one.


## Viewing a shared report (P-08)

The viewer needs no account.


| Step | Viewer does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Opens the link | Checks the token and the expiry, and shows a read-only report with the banner "Shared report. Read only. Expires on {date}." The page asks search engines not to index it | P-08 |
| 2 | Reads the report | Shows findings, severity, confidence, fixes and the scope and limits statement. Evidence appears only if the owner included it. Otherwise each finding says "Evidence was not included by the owner." Owner actions such as Dismiss, Re-check, Share and Export are absent | P-08 |


| Situation | Result |
| --- | --- |
| The link is expired, revoked or unknown | E-32: "This link is no longer available. Ask the owner for a new one." The message is the same for all three cases, so it reveals nothing about which one applies |
| The project or the owner's account was deleted | The same E-32 message, because the links were deleted with it |
| Too many requests from one address | E-33: "Too many requests. Try again in a minute." |
| The viewer is also signed in as the owner | They still see the shared view, so the owner can check exactly what others see |


**Outcome:** The report leaves KAIRO as a file or as a link that can be revoked, with evidence shared only on purpose.

**Covers:** US-10, FR-R1 to FR-R4, FR-R8.


# 14. F-09 Manage the account, connections and data

Every data right in the Privacy Policy has a screen where the person can use it without contacting anyone.

**Goal:** See what KAIRO holds and what it has done, cut off GitHub access, take a copy of everything, or delete everything.

**Entry points:** The account menu, which opens A-13, A-14 and A-15.

**Preconditions:** Signed in.


## What each account screen offers


| Screen | Contents and actions |
| --- | --- |
| A-13 Account | GitHub identity (login, avatar, signed in since). The list of GitHub connections with the account name, the number of repositories allowed and a Disconnect action. "Change repository access on GitHub" for each connection. Sign out, and "Sign out everywhere", which ends every session |
| A-14 Activity | The person's own security events, newest first: sign-ins, connection changes, scans started, links created and revoked, and exports and deletions. Each shows the time, the event and a short description of the browser. A filter by type and 50 events per page (FR-A6) |
| A-15 Data | "Download my data" and "Delete my account", each with a plain description of what happens |


## Steps: download my data


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects "Download my data" | Starts an export of projects, scans, findings, evidence and reports as machine-readable files in one archive, and shows "Preparing your archive" | A-15 |
| 2 | Waits or returns later | When ready, shows a Download action and "This archive is available for 24 hours." The page does not depend on email | A-15 |
| 3 | Downloads | Serves the archive once per request. After 24 hours it is deleted | Browser |


Only one export can be prepared per hour. A second request in that time shows E-34: "Your data export was prepared recently. You can download it until {time}."


## Steps: disconnect a GitHub connection (D-08)


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects Disconnect on a connection | Opens D-08: "Projects from this connection will show Disconnected and cannot be scanned. Existing reports stay. KAIRO will delete its stored access and ask GitHub to remove the app from this account." | D-08 |
| 2 | Confirms | Deletes the stored token, asks GitHub to uninstall the app from that account, marks the projects Disconnected and records the event in A-14 | A-13 |


## Steps: delete my account (D-10)


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Selects "Delete my account" | Opens D-10, which lists what will be deleted: projects, scans, findings, reports, share links and stored GitHub access. It says "KAIRO's backup copies become unreadable when your keys are deleted, and expire within 14 days." | D-10 |
| 2 | Selects Continue | Sends the person to GitHub to sign in again. A sign-in older than 5 minutes is required | GitHub |
| 3 | Returns and types "delete my account" | Enables the Delete button only when the phrase matches exactly | D-10 |
| 4 | Selects Delete | Cancels running scans, deletes the data from primary storage, deletes the account's encryption keys, ends every session, asks GitHub to uninstall the app from the person's accounts, and opens P-01 with "Your account was deleted." | P-01 |


## Branches and errors


| Situation | Result |
| --- | --- |
| The person cancels on GitHub during re-sign-in | Back on A-15 with "Your account was not deleted." |
| The re-sign-in is older than 5 minutes or fails | D-10 asks the person to sign in again |
| The typed phrase does not match | The Delete button stays disabled |
| Scans are running | They are stopped first. The dialog says so |
| An export is being prepared | It is cancelled and its file is deleted |
| The account is suspended | The person can still request deletion through the address on the Contact page, and an operator carries it out |
| A disconnect or delete request fails part-way | The page says which steps finished and which did not, and offers Try again. Nothing is reported as complete until it is |


**Outcome:** The person can see, export and remove their data, and every change is recorded in their activity list until the account is deleted.

**Covers:** FR-A3, FR-A5, FR-A6, US-11, LR-6, LR-9.


# 15. F-10 Public flows: reports, legal pages and consent

The public pages are small, but each one is a promise, so each has a defined path from the person's question to a recorded outcome.

**Goal:** Let anyone report a vulnerability or abuse, read the rules KAIRO operates under, and see which version they agreed to.

**Entry points:** The footer on every page, /.well-known/security.txt, and the sign-in screen.

**Preconditions:** None. These flows need no account.


## Footer on every page

Every page, signed in or not, ends with the same footer holding five links: Privacy Policy, Terms and Conditions, Security, Contact and Licenses (BR-12). The footer is one shared component, so no route can omit it.


## Report a vulnerability in KAIRO (P-05)

The application itself sends no email in Release 1 (TRD section 18). The addresses below are ordinary mailboxes read by maintainers.


| Step | Reporter does | KAIRO does | Screen |
| --- | --- | --- | --- |
| 1 | Opens Security, or reads /.well-known/security.txt | Shows how to report, what is in scope, and a request not to access other people's data or disrupt the service. security.txt lists the contact, an expiry date, the policy link and the preferred language (LR-8) | P-05 |
| 2 | Emails the security address with the details | A maintainer records the report in O-06 with a reference, the date and the type | O-06 |
| 3 | Waits | A maintainer acknowledges the report by email within the stated target. The status moves through Received, Acknowledged, Investigating, and then Resolved or No action with a reason | O-06 |


## Report abuse of KAIRO (P-06)


| Step | Reporter does | KAIRO does | Screen |
| --- | --- | --- | --- |
| 1 | Opens Contact | Shows the abuse address with a plain statement: "KAIRO runs tests only inside an isolated sandbox and does not send test traffic to other systems." It asks for what was seen, when, and which system was affected | P-06 |
| 2 | Emails the abuse address | A maintainer logs it in O-06, checks the claim against the scan and audit records, and decides whether to suspend the account in O-04 | O-06, O-04 |
| 3 | Waits | The maintainer replies with the outcome. The log records the decision and the reason | O-06 |


The security and abuse addresses and the acknowledgement target are open questions in section 20. The pages never show an address that is not yet monitored.


## Read the legal pages and see what changed (P-03, P-04, P-07)


| Step | Person does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Opens Privacy Policy or Terms | Shows the document with its version and effective date at the top, and a list of earlier versions below. Each earlier version stays available at its own address under /privacy/archive/{version} or /terms/archive/{version} | P-03, P-04 |
| 2 | Opens Licenses | Shows the third-party components and their licenses, generated from the software bill of materials of the running release | P-07 |
| 3 | Later, after a new version is published, uses the product | At the next signed-in request, A-01 asks the person to accept the new version before anything else (F-01) | A-01 |


## Consent records

- Accepting the Terms and Privacy Policy stores both versions, a content hash and a timestamp (LR-4).
- Each acceptance appears in the person's own activity list on A-14, for example "Accepted Terms version 1.2 and Privacy Policy version 1.1."
- Release 1 uses only strictly necessary cookies (the session and the request-forgery token), so it shows no cookie banner. The Privacy Policy lists those cookies. If a non-essential cookie is ever introduced, a banner must be added first, with an Accept button and a Reject button of equal size and prominence, and the choice must be stored and changeable from the footer (LR-7).

## Branches and errors


| Situation | Result |
| --- | --- |
| A reporter writes to an address that bounces | The footer addresses are monitored, and the bounce is treated as an operations alert (TRD section 14) |
| A report contains customer code or credentials | The maintainer asks the reporter not to send them, and deletes the message from the log's attachments |
| A legal page version is requested that does not exist | P-09, not found |
| security.txt is within 30 days of its expiry | The build fails until it is renewed (TRD section 15) |


**Outcome:** Every report is logged with an outcome, and every person can see which legal version they accepted.

**Covers:** LR-3, LR-4, LR-7, LR-8, FR-O4, BR-12.


# 16. F-11 Operator flows

Operators run the service without seeing customer content, and the only way to see it is a recorded, time-limited elevation that everyone on the team is told about.

**Goal:** Keep the service healthy, handle misuse, and look at customer content only when there is a stated reason.

**Entry points:** /ops, reachable only over the private link.

**Preconditions:** The operator is a maintainer, is connected to the private link, and has a registered hardware security key.


## Operator sign-in (O-01)


| Step | Operator does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Opens /ops | From outside the private link the request gets the same not-found page as any unknown address. From inside, it shows O-01 | O-01 |
| 2 | Selects "Sign in with security key" and touches the key | Verifies the key and creates an operator session that ends after 30 idle minutes or 8 hours in total. The sign-in is written to the audit log | O-02 |


## What the operator screens show


| Screen | Shows | Never shows |
| --- | --- | --- |
| O-02 Dashboard | Queue depth for each queue, failed jobs, error rates, runner heartbeat age, scan completion rate, sandbox startup success rate, and the alerts that are firing | Source code, findings or evidence |
| O-03 Jobs | Failed and stuck jobs with the opaque scan ID, stage, error class and number of attempts. Retry stage and Cancel scan actions | The content of any scan |
| O-04 Accounts | Search by opaque ID or GitHub login. State, creation date, counts of projects and scans, and the date of last activity. Suspend and Restore actions | Project contents |
| O-05 Content elevation | Active and past elevations with who, why, which account, and when | Anything beyond the one account in an active elevation |
| O-06 Reports | The log of security and abuse reports and their outcomes | Attachments that hold customer code or credentials |


Every action on these screens asks for a short reason and writes an audit event.


## Suspend or restore an account (O-04)


| Step | Operator does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Finds the account and selects Suspend | Asks for a reason, and a reference to the report or alert that led to it | O-04 |
| 2 | Confirms | Ends every session, cancels running scans, blocks new scans, and shows the person E-06 at their next sign-in. The audit event names the operator and the reason | O-04 |
| 3 | Later selects Restore | Re-enables sign-in. The person's activity list shows "Your account was restored by KAIRO." | O-04, A-14 |


## View customer content (O-05, D-13)


| Step | Operator does | System does | Screen |
| --- | --- | --- | --- |
| 1 | Opens an account and selects "Request content access" | Opens D-13: a reason of 20 to 500 characters, and the report or ticket reference. The duration is fixed at 30 minutes | D-13 |
| 2 | Submits | Starts a grant limited to that one account. Every maintainer is notified at once. The request, the reason and the start time are written to the audit log | O-05 |
| 3 | Reads the scan or finding that the reason covers | Shows the content read-only. Credentials and environment values stay masked, as they are for the owner. Each view is logged | O-05 |
| 4 | Finishes, or waits | The grant ends after 30 minutes. Any maintainer can end it earlier. More time needs a new request | O-05 |


There is no approval step, because a single on-call maintainer may need access in an emergency. The control is that everyone is told immediately and any of them can revoke it.

When an elevation ends, the account owner's activity list on A-14 shows an entry, for example "KAIRO staff viewed scan {id} on {date}. Reason: abuse report." It appears within 24 hours. Whether notice may be delayed during an abuse investigation is a question for counsel and is listed in section 20.


## Branches and errors


| Situation | Result |
| --- | --- |
| An operator opens a content page without an elevation | The operator console shows "Content access needs an elevation." with a Request action. It does not show the content |
| The reason is shorter than 20 characters | Inline: "Give a reason of at least 20 characters." |
| The operator session ends mid-task | The person signs in again and returns to the same screen. An active elevation stays active until its time runs out |
| A security key is lost | Another maintainer registers a replacement for the operator, following the runbook. The event is logged |
| A retry or cancel is requested for a scan that already finished | "This scan has already finished." No change is made |


**Outcome:** Operations are visible to the whole team, and customer content is never viewed without a reason on record.

**Covers:** FR-O1 to FR-O4, NFR-S5, LR-12.


# 17. System states and error handling

Every state a person can land in has a written message that says what happened and what to do next, and the 37 states below are the only ones the product may show.


## Rules for every message

- A message says what happened, why when it is known, and what to do. It does not blame the person, joke, or use exclamation marks (BR-7, BR-14).
- Technical detail stays out of the main text. Server-side failures add one line, "Reference: {request id}", that the person can quote to support.
- Field errors appear beside the field. Page-level problems appear as a banner at the top of the content. Confirmations appear in dialogs. Whole-page states, such as not found, replace the content.
- Errors are never shown only in a message that disappears after a few seconds. Anything the person must read stays until they act on it or dismiss it.
- Messages are plain text with no icons that stand in for words. Severity and state are always written (BR-15).

## Loading, retry and offline behavior


| Situation | Behavior |
| --- | --- |
| A request takes longer than 300 ms | The area shows a placeholder shaped like the content. Work that takes longer than a few seconds also states what it is doing in words, as the progress rows do |
| A read request fails | The client retries up to two times with a short delay, then shows the section error: "This part could not be loaded. Try again." with a Try again action. Other sections of the page stay usable |
| A write request fails | Never retried automatically unless it carries an idempotency key. The person sees the error and the form keeps its values |
| The browser is offline | A banner says E-37. Forms keep their values, and nothing is queued for later |
| The session ends | E-35 on the sign-in page, then a return to the same route |
| A request is rate limited | E-36 with the time to wait. The rest of the page stays usable |


## Catalogue


| ID | Shown when | Message | Next action |
| --- | --- | --- | --- |
| E-01 | An address does not exist, or belongs to someone else | "This page was not found." | Link to Home, and to Projects when signed in |
| E-02 | A page fails to render | "Something went wrong on our side. Reference: {request id}" | Try again, and Contact |
| E-03 | Projects is empty | "No projects yet. Add a repository or upload an archive to run your first scan." | Add project |
| E-04 | The sign-in state is missing or expired | "That sign-in link has expired. Start again." | Continue with GitHub |
| E-05 | GitHub does not respond | "GitHub is not responding. Try again in a few minutes." | Try again |
| E-06 | A suspended account signs in | "This account is suspended. The Contact page lists how to reach us." | Contact |
| E-07 | No GitHub installation exists | "KAIRO cannot read any of your repositories yet." | Choose repositories on GitHub |
| E-08 | An installation cannot be tied to the person | "That GitHub installation is not linked to your account." | Choose repositories on GitHub |
| E-09 | A repository exceeds 200 MB | "This repository is larger than the 200 MB limit. Remove build output and large files, or choose a smaller repository." | Choose another repository |
| E-10 | No supported framework is detected | "KAIRO did not find Express, Next.js, FastAPI or Flask. Secret checks still run. You can correct the stack." | Correct the stack |
| E-11 | The upload is not a ZIP | "Only .zip files are supported." | Choose another file |
| E-12 | An archive passes a size or file limit | "This archive is larger than the {limit} limit. Remove dependency folders and build output, then try again." | Choose another file |
| E-13 | An archive has unsafe paths or links | "This archive contains paths that cannot be read safely, so KAIRO rejected it." | Choose another file |
| E-14 | More than 5 uploads in an hour | "You have reached the upload limit. Try again after {time}." | None until then |
| E-15 | A scan starts more than 24 hours after an upload | "The uploaded archive was deleted after 24 hours. Upload it again." | Upload archive |
| E-16 | Logic review is not available | "Logic review is turned off for now. Static analysis and dynamic testing still run." | None |
| E-17 | Dynamic testing lacks its settings | "Dynamic testing needs a start command, a port and two standard test accounts." | Open Run settings |
| E-18 | Three scans are running | "You already have 3 scans running. Wait for one to finish or stop one." | Open the running scans |
| E-19 | The hourly scan limit is reached | "You have reached the hourly scan limit. Try again after {time}." | None until then |
| E-20 | A project's repository is disconnected | "KAIRO can no longer read this repository. Reconnect it on GitHub." | Reconnect |
| E-21 | Settings changed in another tab | "These settings changed in another tab. Reload to see the latest." | Reload |
| E-22 | Static analysis fails | "Static analysis did not finish, so no findings were produced. This is not a clean result." | Start new scan |
| E-23 | The code could not be fetched | "KAIRO could not fetch the code. {reason}" | Start new scan |
| E-24 | No runner took the dynamic job in 15 minutes | "No test runner was available. Try the scan again later." | Start new scan |
| E-25 | Merge or report building fails | "Something went wrong while building the report. KAIRO has been alerted. Start a new scan to try again. Reference: {request id}" | Start new scan |
| E-26 | A scan finds nothing | "No findings in the checks that ran. These checks do not cover everything, so this is not proof the application is secure." | View scope and limits |
| E-27 | A re-check cannot run | "The re-check could not run: {reason}. The status did not change." | Try again |
| E-28 | A project has no scans | "No scans yet. Start a scan to see findings here." | Start scan |
| E-29 | Fewer than two finished scans | "Compare needs two finished scans of this project." | Start scan |
| E-30 | A finding changed elsewhere | "This finding changed while you were viewing it. Reload to see the latest status." | Reload |
| E-31 | A PDF cannot be prepared | "The PDF could not be prepared. The web report is complete. Try again." | Try again |
| E-32 | A share link is expired, revoked or unknown | "This link is no longer available. Ask the owner for a new one." | None |
| E-33 | Too many share-link views | "Too many requests. Try again in a minute." | None until then |
| E-34 | An export was prepared recently | "Your data export was prepared recently. You can download it until {time}." | Download |
| E-35 | The session ended | "Your session ended. Sign in to continue." | Continue with GitHub |
| E-36 | The general rate limit is reached | "You are making requests too quickly. Try again in {n} seconds." | None until then |
| E-37 | The browser is offline | "You appear to be offline. Changes will not be saved until the connection returns." | None |


# 18. Notifications, progress and live updates

Release 1 tells people about changes only inside the page and the browser tab, because it sends no email and asks for no browser permissions.


## Channels


| Channel | Release 1 | Later |
| --- | --- | --- |
| In the page | Yes. Every change in the table below | Same |
| Browser tab title | Yes. It shows the scan state, so a person on another tab can see it | Same |
| Browser notifications | No | Optional, asking permission first |
| Email or chat | No. The application sends no email (TRD section 18) | Optional, only with the person's consent and an updated Privacy Policy |


## Events


| ID | Event | Where it appears | Announced to assistive technology as | Stays |
| --- | --- | --- | --- | --- |
| N-01 | A stage changes state | The stage row on A-08 | Politely: "{stage}: {state}" | In the row |
| N-02 | A stage failed, was partial, or was skipped without the user's choice | A banner on A-08 and A-09, and in every export | Politely, once, when it appears | For the life of the scan |
| N-03 | A scan finishes | A-08 becomes A-09. The status on A-02 and A-06 changes. The tab title changes | Politely: "Scan complete. {n} high findings, {n} medium findings." | In the status |
| N-04 | A finding's status changes | The status label and history on A-10, and the counts on A-09 | Politely: "Finding dismissed." and similar | In the history |
| N-05 | Settings are saved | A message beside the Save button | Politely: "Settings saved." | Until the next edit |
| N-06 | A copy action succeeds | The word "Copied" beside the button | Politely: "Copied" | Briefly. It carries no information the person needs later |
| N-07 | A share link is created | Inside D-05, beside the link | Politely: "Link created. Copy it now." | Until the dialog closes |
| N-08 | A re-check finishes | The status line on A-10 | Politely, with the result | In the history |
| N-09 | An export is ready | Inside D-07, or on A-15 for a data export | Politely: "Your download is ready." | The data archive for 24 hours |
| N-10 | Live updates pause or resume | A banner on A-08 | Politely: "Live updates paused." and "Live updates resumed." | Until resumed |
| N-11 | Staff viewed the person's content | An entry on A-14 within 24 hours | Not announced, because it is a record and not an alert | Permanently |


## Announcement rules

- Progress counters, such as "18 of 30 routes reviewed", update on screen but are not announced each time. Only stage changes (N-01) and the messages above are announced.
- At most one announcement is made every 5 seconds. If several changes arrive together they are joined into one sentence.
- A message uses the assertive setting only when the person cannot continue without reading it, such as a form that failed to save. Everything else is polite.
- No message depends on color, an icon or a sound alone (BR-15).

## Browser tab title


| State | Title |
| --- | --- |
| Queued | "Queued: {project} - KAIRO" |
| Running | "Scanning {project}: {stage} - KAIRO" |
| Finished without warnings | "Done: {project}, {n} high - KAIRO" |
| Finished with warnings | "Done with warnings: {project} - KAIRO" |
| Failed or stopped | "Stopped: {project} - KAIRO" |


The title changes only while the scan screen is open, and it returns to the normal page title on any other screen.


# 19. Navigation, accessibility and responsive behavior

These rules apply to every screen and dialog, and the UI/UX Design Brief may not break them.


## Navigation


| Area | Rule |
| --- | --- |
| Header, signed out | The product name as a link to Home, and Sign in |
| Header, signed in | The product name as a link to A-02, Projects, and an account menu with Account, Activity, Data and Sign out |
| Footer | The five legal and trust links on every page (BR-12) |
| Location | Inside a project the page shows a trail: Projects, the project, the scan, the finding. Each part is a link, and the current part is plain text |
| Back and forward | The browser's Back button always works. Filters, tabs on the settings screen and the compared scans live in the address, so reload and bookmarks keep them |
| Dialogs | Dialogs do not change the address. Escape closes them, and so does the Cancel action. Closing never submits |
| Active states | The current page is marked in the header and trail with text and a visible style, never color alone |


## Focus and keyboard

- Every function can be used with a keyboard alone. There are no shortcuts that exist only for the keyboard.
- A skip link at the top of every page goes to the main content.
- When the page changes, focus moves to the main heading and the document title changes. Opening A-09 from A-08 follows this rule.
- When a dialog opens, focus moves into it and stays inside until it closes. On close, focus returns to the control that opened it.
- After a form fails to save, focus moves to an error summary at the top of the form. The summary lists each problem as a link to its field.
- After an item is removed, focus moves to the heading of the list it was in.
- Focus is always visible, and nothing sticky or floating hides the focused control (WCAG 2.2, focus not obscured).

## Forms


| Rule | Detail |
| --- | --- |
| Labels | Every field has a visible label above it. Placeholder text is never the label |
| Required fields | Marked with the word "required" next to the label, not only a symbol |
| Help and errors | Help text sits under the field and is linked to it. An error replaces the help text and is linked to the field, and it says how to fix the problem |
| When to validate | When the person leaves a field, and again on Save. Typing is never interrupted |
| Keeping input | A failed save never clears a field |
| Secret fields | A "Show" and "Hide" text button reveals what the person is typing. Pasting is allowed. After saving, the value is masked and cannot be revealed |
| Test credentials | Fields ask browsers not to save them, so the browser's password manager does not store test accounts |
| Buttons | A button that starts work is disabled while the request is in flight, and its label changes to say so, for example "Saving" |


## Responsive behavior

The layout must work from 360 px wide, and the content must reflow without sideways scrolling at 320 px (NFR-C1, WCAG 2.2 reflow).


| Element | Below 640 px |
| --- | --- |
| Header | The account menu stays. Primary links collapse into a menu button that is labeled in words |
| Finding list rows | The title sits above the metadata, which wraps onto further lines |
| Result overview | Counts stack as a simple list |
| Tables | Narrow tables stack each row as a labeled block. Wide tables and code scroll inside their own container, which can be reached by keyboard |
| Settings tabs | Become a labeled list of sections |
| Dialogs | Fill the screen, with the actions fixed at the bottom |
| Progress rows | Stay one per line. The detail text wraps |


Touch targets are at least 24 by 24 CSS pixels, and 44 where space allows. Text can be enlarged to 200 percent without losing content or function.


## Content formats


| Item | Format |
| --- | --- |
| Language | English. The page language is declared. Strings come from a message catalog so other languages can be added (NFR-I1) |
| Dates | Day, month name and year, for example "12 October 2026", so no one has to guess the order |
| Times | In the person's time zone, with the zone shown, for example "14:30 IST" |
| Numbers | Thousands separated, for example "2,000 requests" |
| Durations | Written out, for example "13 minutes" |
| Commit identifiers | The first seven characters, in a monospaced style, with a Copy action |
| Severity and confidence | Written words with a distinct shape beside them. Never color alone |


## Motion and print

- Motion is limited to short functional transitions of 200 ms or less. With a reduced-motion setting, they are off (BR-4).
- Report screens have a print style that matches the section order of the PDF. The PDF is the recommended way to produce a paper copy.

# 20. Traceability, open questions and hand-off

Every user story in the PRD has a flow, every flow has screens, and the UI/UX Design Brief now has a complete list of what to design.


## Traceability


| PRD item | Flow | Screens and dialogs |
| --- | --- | --- |
| US-01 Sign in with GitHub | F-01 | P-02, A-01 |
| US-02 Connect repositories read-only | F-02 path A, F-09 | A-03, A-04, A-13, D-08 |
| US-03 Upload a ZIP | F-02 path B | A-05 |
| US-04 Start command and test accounts | F-03 | A-07 |
| US-05 Authorization before a scan | F-03 | A-06, D-01 |
| US-06 See scan progress | F-04 | A-08, D-02 |
| US-07 Understand a finding | F-05 | A-09, A-10 |
| US-08 Re-check one fix | F-06 | A-10, A-12 |
| US-09 Dismiss a finding | F-07 | A-10, D-03, D-04 |
| US-10 Export and share | F-08 | A-09, A-16, P-08, D-05, D-06, D-07 |
| US-11 Delete data | F-09 | A-15, D-10 |
| US-12 Turn off AI review | F-03 | A-07 Review tab, D-11, state E-16 |
| FR-A6 Account events | F-09 | A-14 |
| FR-O1 to FR-O4 Operations and abuse | F-10, F-11 | O-01 to O-06, D-13, P-05, P-06 |
| LR-3, LR-4, LR-8 Legal and trust pages | F-10 | P-03 to P-07, A-01 |
| BR-12 Footer links | F-10 | Footer on every screen |
| BR-14 Error and empty states | Section 17 | E-01 to E-37 |


## Components the flows require

The UI/UX Design Brief must define each of these once and reuse it.


| Component | Used on |
| --- | --- |
| Header and account menu, footer, location trail | Every screen |
| Banner for page-level messages, and the error summary | A-07, A-08, A-09, forms |
| Dialog with a typed-confirmation variant | D-01 to D-13 |
| Stage row with state word, detail line and expandable log | A-08 |
| Severity label and confidence label, each with a distinct shape | A-09, A-10, P-08 |
| Status label with history list | A-10 |
| Finding row and result overview counts | A-09, A-12 |
| Code excerpt with line numbers, and request and response block | A-10 |
| Settings tabs, and secret field with masked state and Replace and Remove | A-07 |
| Test account form with login method selector | A-07 |
| File picker with limits and upload progress | A-05 |
| Repository list with search | A-04 |
| Filter bar stored in the address | A-09 |
| Data table with stacked small-screen variant | A-02, A-11, A-14, A-16, O-02 to O-06 |
| Empty and error state blocks | Section 17 |
| Legal document layout with version and history | P-03, P-04 |
| Operator console shell, visibly different from the product | O-01 to O-06 |


## Open questions

☐   Which security, abuse, privacy and grievance addresses are published, and what acknowledgement target is promised? P-05 and P-06 cannot ship without them.

☐   When an operator views customer content, is the owner always told within 24 hours, or may counsel allow delayed notice during an abuse investigation?

☐   Should a re-check count toward the hourly scan limit, as written here, or have its own allowance?

☐   Should a stopped scan keep a partial report? This document says it does not.

☐   Should reasons for dismissed findings appear in shared views? This document says they do, and the dialog warns the person.

☐   Are the share expiry choices of 1, 7, 14 and 30 days the right set?

☐   Is "Sign out everywhere" enough, or do people need a list of their sessions?

☐   Does GitHub's reported repository size match what KAIRO measures for repositories that use large-file storage or submodules? The 200 MB pre-check depends on it.

☐   Does GitHub return a state value to the setup address in every installation case? F-02 does not depend on it, because the installation is verified with the person's own authorization, but the answer may allow a simpler flow.


## Hand-off

The next document is the UI/UX Design Brief. It takes the screen IDs in section 4 as its list of pages, the states in section 17 as its list of states, and the rules in section 19 as limits that no visual choice may break. Visual design for the legal pages, the favicon set and the operator console is part of that brief.


## Sources

- , for the setup address, the option to authorize users during installation, and the redirect after installation
- Product Requirements Document v0.1 and Technical Requirements Document v0.1, which this document implements