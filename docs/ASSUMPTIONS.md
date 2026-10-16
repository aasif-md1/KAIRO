# KAIRO: Assumptions and Deviations Log

This file records every assumption made and every deviation from the specification documents, with the reason for each. It is the canonical record of choices that were not explicit in the PRD, TRD, App Flow, or UI/UX Design Brief.

## Conflicts Between Documents

| # | Conflict | Choice | Precedence Rule |
| --- | --- | --- | --- |
| C-01 | Emerald values: #0E6B57 (stated) vs #0B9079 (measured on tile). | Use #0E6B57 for buttons/accents, #0B9079 for the logo tile, as the Design Brief specifies. Open question for owner. | Design Brief wins for visual |
| C-02 | Brand guide navbar links vs App Flow header links. | Follow App Flow: Projects + Account (signed in), no Pricing/Features. | App Flow wins for routes |
| C-04 | Appearance setting proposed by Design Brief but absent from App Flow. | Include it on A-13. Minor UI addition, not a scope change. | Design Brief wins for visual |
| C-06 | Next.js version: TRD says "16". | Will verify and use actual latest stable. | TRD wins, with verification |
| C-07 | PostgreSQL version: TRD says "18". | Will verify and use actual latest stable. | TRD wins, with verification |
| C-08 | Paper White: stated #F2F0EA vs measured #FAF6EF. | Use #F2F0EA as the Design Brief specifies. | Design Brief wins |

## Assumptions

| # | Assumption | Reason |
| --- | --- | --- |
| AS-01 | Pin Next.js and PostgreSQL to actual latest stable versions at project start. | TRD versions need verification against reality. |
| AS-02 | Local dev uses Docker Compose with mock GitHub, MinIO, PostgreSQL. No external accounts. | User instructions and TRD. |
| AS-03 | Procrastinate spike runs first in M0. If it fails, fall back to Celery+Redis. | TRD ADR-04 is Proposed. |
| AS-04 | gVisor sandbox code is written but only runs on Linux. Dev uses hardened Docker. | gVisor is Linux-only. Windows dev environment. |
| AS-05 | Tile SVG is a reconstruction. Mark clearly; owner replaces with designer's master vector. | Design Brief section 17. |
| AS-06 | Legal page content is draft-marked. Production build fails on draft markers. | User instructions. |
| AS-07 | Operator console uses simplified auth in development (no hardware security key). | Impractical for dev. |
| AS-08 | Dark theme ships in Release 1. | Design Brief open question; both themes are first-class. |
| AS-09 | Share expiry choices: 1, 7, 14, 30 days. | App Flow open question; using as written. |
| AS-10 | Stopped scans do not produce a report. | App Flow open question; using as written. |
| AS-11 | Re-checks count toward the hourly scan limit. | App Flow open question; using as written. |
| AS-12 | One sidecar version pinned per engine in Release 1. | TRD open question; simpler. |
| AS-13 | IBM Plex fonts available via npm @ibm/plex packages. | Standard distribution. |
| AS-14 | Footer links: Privacy Policy, Terms and Conditions, Security, Contact, Licenses. | PRD BR-12. |
| AS-15 | Lucide icons with square caps, mitered joins, stroke 1.75. | Design Brief section 7. |

## Deviations

| # | What was specified | What was built | Reason |
| --- | --- | --- | --- |
| DEV-01 | Minimal public pages in Release 1 (home, sign-in, legal, contact, licenses) | Added /how-it-works (P-11), /coverage (P-12), /about (P-13) | Industry standard marketing requirement; documents technical engine and rules truthfully |
| DEV-02 | Contact form on /contact | Replaced form with 4 direct email cards with copy buttons | Application sends zero email in Release 1 (TRD section 18); non-functional form violates credibility |
| DEV-03 | Operating system only appearance detection | Added 3-way accessible segmented control (System, Light, Dark) | Allows visitors to switch themes explicitly with zero flash; stored in localStorage |
| DEV-04 | Fixed 11px-13px typography scale | Marketing typography scale (H1 clamp 36-56px, section headings 36px, lead 20px, body 16-18px) | Fixes readability and hierarchy on marketing site without changing application dashboard scale |


## Open Questions for Owner

These need the owner's decision and cannot be resolved by the engineering team:

1. **Emerald tile value**: Confirm whether the logo tile should use #0E6B57 or #0B9079.
2. **Model provider for user code**: Which provider passes the LR-14 review?
3. **Legal entity and governing law**: Who is the contracting party for the Terms?
4. **Contact addresses**: Security, abuse, privacy, and grievance email addresses.
5. **Product name clearance**: Has a trademark and domain search been done for "KAIRO"?
6. **Users outside India**: If so, GDPR assessment is needed before launch.
7. **Hosting**: Which provider and what credits are available?
8. **Domain name**: What domain will be used?
9. **Master vector files**: The designer needs to provide vector masters for all lockups.
10. **GitHub mark file**: Need the official file, checked against GitHub's logo guidelines.
