# KAIRO Marketing and Public Website: Design Specification

This design document establishes the architecture, layout system, typography scale, component library, asset pipeline, and specification changes for the redesign of the KAIRO public-facing website.

---

## 1. Page Inventory

| Route | Page ID | Type | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `/` | P-01 | Marketing Home | Introduce product, explain core access-control problem, showcase 3-layer engine, tabbed coverage, annotated report, trust commitments, FAQ, and primary CTA. |
| `/how-it-works` | P-11 (New) | Long-form Guide | Deep-dive walkthrough of the scan lifecycle, 3 analysis layers, deterministic confidence scoring, evidence generation, limits, and glossary. |
| `/coverage` | P-12 (New) | Rule Catalog | Complete taxonomy of all 13 Release 1 vulnerability classes (KR-V01 to KR-V13), categorized with vulnerable vs fixed code tabs, layer origins, CWE/OWASP mappings, and filters. |
| `/about` | P-13 (New) | Company & Project | Project origins, core engineering principles, team disclosures, roadmap, and architecture design overview. |
| `/security` | P-07 | Trust & Security | Threat model, sandbox isolation architecture, data lifecycle, encryption specifications, archive security, model boundaries, and vulnerability disclosure terms. |
| `/privacy` | P-08 | Legal Document | Plain-language summary, personal data handling, zero-cookie policy, local device preferences, retention rules, data erasure, and DRAFT banner outside production. |
| `/terms` | P-09 | Legal Document | Plain-language summary, terms of service, intake responsibilities, authorization attestation, liability limits, and DRAFT banner outside production. |
| `/contact` | P-10 | Support & Inquiries | Categorized contact cards (Support, Security, Privacy, Abuse) with 1-click address copy, response targets, and submission guidelines. No non-functional form. |
| `/licenses` | P-06 | Compliance | Software bill of materials (SBOM) listing runtime and build dependencies, license names, copyright holders, and source links with real-time search. |
| `/sign-in` | P-02 | Authentication | Split layout with product value pillars, GitHub OAuth trigger ("Continue with GitHub"), scope disclosures, and error alert banners (E-04 to E-06). |
| `/404` | P-14 | System Error | Custom not found page with exact App Flow recovery navigation and brand styling. |
| `/500` | P-15 | System Error | Custom internal server error page with reference identifier and status recovery options. |
| `/_assets` | Internal | Asset Fixture Lab | Seeded deterministic views for Playwright screenshot capture (report, finding detail, scan progress, repo picker, settings, route table, PDF). Excluded from production builds and search index. |

---

## 2. Layout, Grid, and Rhythm

- **Container**: Max width 1200 px, centered, with 40 px side margins on desktop (>= 1024 px), 32 px on tablets (640-1023 px), and 24 px on mobile (< 640 px).
- **Grid**: 12 columns with 24 px gutters on desktop; 8 columns on tablets; 4 columns on mobile with 16 px gutters.
- **Section Rhythm**: Generous vertical spacing of 96 px to 128 px between major landing sections on desktop; 56 px to 72 px on mobile.
- **Surface Alternation**: Consecutive sections alternate between `bg` token (`#F2F0EA` light / `#0B0D12` dark) and `surface` token (`#FAF9F5` light / `#12151C` dark) to create clear visual chapters without heavy borders.
- **Card Styling**: Consistent single card specification across all views: 1 px border in `line` token, 4 px border radius, flat surface fill, zero drop shadows.
- **Brand Geometry**: Subtle background visual interest created using pure SVG geometric components featuring 45-degree angled lines and chamfered accents derived from the KAIRO mark. CSS gradient functions remain strictly forbidden.

---

## 3. Typography Scale for Marketing

Marketing pages require stronger hierarchy than dense application screens. The typography scale is extended for public marketing while preserving IBM Plex Sans and IBM Plex Mono fonts and font weights (400, 500, 600 only; no 700 bold).

| Role | Font Family | Desktop Size / Line Height | Mobile Size / Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Hero Display | IBM Plex Sans | 60 px / 68 px | 36 px / 44 px | 600 | -0.02 em | Home page hero title |
| Section Heading (H2) | IBM Plex Sans | 38 px / 46 px | 28 px / 36 px | 600 | -0.01 em | Major section titles |
| Subsection (H3) | IBM Plex Sans | 24 px / 32 px | 20 px / 28 px | 600 | normal | Feature card titles, steps |
| Lead Paragraph | IBM Plex Sans | 20 px / 30 px | 18 px / 26 px | 400 | normal | Intro text under section titles |
| Body Text | IBM Plex Sans | 16 px / 26 px | 16 px / 24 px | 400 | normal | Explanatory paragraphs, legal text |
| Small / Meta | IBM Plex Sans | 14 px / 20 px | 14 px / 20 px | 400 | normal | Footers, captions, tables (never < 14 px) |
| Monospace Code | IBM Plex Mono | 14 px / 22 px | 13 px / 20 px | 400 | normal | Code blocks, terminal, paths |
| Monospace Label | IBM Plex Mono | 12 px / 16 px | 12 px / 16 px | 600 | 0.06 em | Section eyebrow badges, status tags |

Text is strictly left-aligned across all sections. Only the eyebrow badge on short cards and the final call-to-action band use centered alignment. Running legal text is constrained to a readable column width of 68 characters.

---

## 4. Theme System

- **Three-way Appearance Control**: Segmented control with explicit text labels ("System", "Light", "Dark"). Fully accessible with keyboard navigation (`ArrowLeft`, `ArrowRight`, `Space`, `Enter`) and WAI-ARIA `role="radiogroup"` semantics.
- **Storage**: Key `kairo-theme` stored in browser `localStorage`.
- **Anti-Flash Implementation**: Inline script injected immediately in the document `<head>` prior to first paint. Checks `localStorage` value or falls back to `window.matchMedia('(prefers-color-scheme: dark)')`, immediately applying `data-theme="dark|light"` and `style.colorScheme` on `<html>`.
- **Theme Palette Tokens**:
  - Light Theme: Paper White (`#F2F0EA`) background, Midnight Ink (`#0B0D12`) primary text, `#FAF9F5` surface, `#D9D5CA` border, `#0E6B57` deep emerald accent.
  - Dark Theme: Midnight Ink (`#0B0D12`) background, Paper White (`#F2F0EA`) primary text, `#12151C` surface, `#262B36` border, `#0E6B57` deep emerald accent.
- **Privacy Policy Inclusion**: Preference documented as a purely functional, non-tracking client-side storage item, keeping the zero-cookie policy intact.

---

## 5. Component Library Inventory

1. `SiteHeader`: 64 px sticky header with logo lockup, nav links with 2 px emerald active indicator, appearance control, "Sign in" button, and "Continue with GitHub" primary button.
2. `MobileMenu`: Full-screen slide panel for viewports under 1024 px with focus trap, body scroll lock, and Escape key dismissal.
3. `AppearanceControl`: 3-way accessible segmented control for System, Light, and Dark mode.
4. `SiteFooter`: 4-column link structure (Product, Company, Legal, Trust) with top brand band, bottom copyright bar, and theme switch.
5. `Hero`: Split hero layout with eyebrow badge, H1, lead paragraph, dual actions, trust line, and window-framed product visual with callouts.
6. `WindowFrame`: Minimalist browser chrome component featuring a 1 px border and monospace URL header bar (strictly avoiding generic 3-dot window controls).
7. `Callout`: Directional annotation badge pointing to key screenshot areas (e.g. "Confidence: Confirmed", "Framework Fix").
8. `SectionHeader`: Eyebrow, H2, and lead paragraph block with consistent spacing.
9. `FeatureRow`: Alternating split layout (text left/image right or reverse) with structured bullet points and documentation links.
10. `StepList`: Numbered 3-step workflow with authentic screenshots and clear explanatory copy.
11. `TabbedCoverage`: 4-tab filterable vulnerability class directory with severity badges and rule definitions.
12. `SeverityLabel`: Accessible severity indicator pairing calibrated color with geometric shape and explicit text label.
13. `ConfidenceMeter`: Three-valued confidence meter (Confirmed, Likely, Possible) with level indicators.
14. `CodePanel`: Syntax-highlighted code block using brand tokens, line numbers, highlighted lines, and copy button.
15. `RequestResponsePanel`: Tamper/exploit proof panel showing HTTP request headers, body, and status response.
16. `ProblemExplainer`: Interactive state-driven comparison toggle ("Without ownership check" vs "With ownership check") with live text and response swap.
17. `DiagramArchitecture`: Pure vector SVG rendering the three-zone architecture (Client, API & DB, Ephemeral Worker Sandbox).
18. `DiagramDataLifecycle`: Pure vector SVG rendering the complete code ingestion, analysis, and guaranteed 24-hour deletion lifecycle.
19. `DiagramThreeLayers`: Pure vector SVG showing Static Analysis, Logic Review, and Dynamic Sandbox converging into Merged Findings.
20. `FAQAccordion`: Keyboard accessible `<details>` / `<summary>` accordion with smooth state disclosure.
21. `LegalLayout`: Template for legal and security pages with version bar, summary box, sticky table of contents, and 68ch column width.
22. `ContactCard`: Card component for communication channels with email, 1-click copy action, response target, and submission checklist.
23. `LicenseTable`: Filterable SBOM table with dependency search, license type grouping, version, and external repository links.
24. `CTASection`: Clean, high-impact centered conversion band at page footer.
25. `DraftBanner`: Notice banner rendered on legal pages in non-production builds.

---

## 6. Asset Production Pipeline

- **Fixtures Route (`/_assets`)**: Seeded internal pages rendering realistic mock data for `acme-storefront-api`:
  - `/_assets/screens/report`: Scan report showing 4 findings, route table summary, and export buttons.
  - `/_assets/screens/finding-detail`: Expanded finding view for KR-V01 with route path, evidence excerpt, suggested patch, and confirmed curl replay.
  - `/_assets/screens/scan-progress`: Live scan execution showing completed Static and Logic Review stages with active Dynamic Sandbox stage.
  - `/_assets/screens/repo-picker`: GitHub repository selection modal with branch dropdown and intake authorization prompt.
  - `/_assets/screens/project-settings`: Project settings Run tab showing isolated command configuration and port mapping.
  - `/_assets/screens/route-inventory`: Table of discovered routes with method, path, parameters, and authentication detection status.
- **Capture Tool**: `scripts/capture-marketing-assets.ts` utilizing Playwright to capture both light and dark variants at 2x and 3x DPR. Outputs optimized WebP, AVIF, and fallback PNG images into `apps/web/public/marketing/` with an accompanying JSON manifest.
- **SVG Diagrams**: Handcrafted, theme-reactive SVG components that dynamically consume CSS custom properties for `bg`, `surface`, `line`, `text`, and `accent`.

---

## 7. Deviations and Refinements from Specification

1. **Marketing Typography Scale**: Extended the Design Brief type scale to include 60 px Hero Display and 38 px Section Headings for marketing impact.
2. **Container Width**: Adjusted public page container from 1120 px to 1200 px to comfortably accommodate modern split-hero and multi-column comparison layouts on desktop displays.
3. **Public Navigation Architecture**: Formally added routes P-11 (`/how-it-works`), P-12 (`/coverage`), and P-13 (`/about`) to establish developer trust and transparency.
4. **Header Appearance Switch**: Placed the 3-way theme control directly in the public header and footer rather than restricting it solely to the internal account settings view.
5. **Contact Page Form Removal**: Replaced non-functional contact form with explicit, categorized contact cards featuring copy buttons, response targets, and submission requirements to uphold Release 1 scope truthfulness.
