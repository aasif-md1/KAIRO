# KAIRO Specification Changes and Refinements

This document records all approved deviations, extensions, and refinements relative to the initial PRD, TRD, App Flow, and UI/UX Design Brief v0.1.

| Change ID | Area | Specification Reference | Change Description | One-line Rationale |
| :--- | :--- | :--- | :--- | :--- |
| SC-01 | Navigation | App Flow Section 3, Design Brief Section 9 | Addition of public page P-11 (`/how-it-works`) | Provide an honest, long-form technical walkthrough of the scan and confidence lifecycle before sign-in. |
| SC-02 | Navigation | App Flow Section 3, PRD Section 10 | Addition of public page P-12 (`/coverage`) | Present all 13 Release 1 vulnerability classes with deep documentation, code examples, and detection layer origins. |
| SC-03 | Navigation | App Flow Section 3 | Addition of public page P-13 (`/about`) | Disclose project origins, student authorship, core principles, and roadmap with complete transparency. |
| SC-04 | Theme System | Design Brief Section 4 & 16 | Header and footer 3-way appearance control (System, Light, Dark) | Enable immediate visitor theme control without requiring user authentication or navigation to Account settings. |
| SC-05 | Theme System | Design Brief Section 4 | Browser `localStorage` key `kairo-theme` with pre-paint script | Prevent flash of incorrect theme on initial page load while remaining cookie-free and GDPR/DPDP compliant. |
| SC-06 | Contact | App Flow Section 9, TRD Section 18 | Removal of interactive contact form on P-10 (`/contact`) | Release 1 backend does not send outbound email; direct cards with copy buttons prevent false user expectations. |
| SC-07 | Typography | Design Brief Section 5 | Extended marketing type scale (60 px Display, 38 px H2, 20 px Lead) | Create industry-standard visual hierarchy on wide desktop viewports while preserving IBM Plex font families. |
| SC-08 | Layout | Design Brief Section 6 | Content container expanded from 1120 px to 1200 px for public marketing | Accommodate modern side-by-side split hero and technical comparison panels comfortably on desktop displays. |
| SC-09 | Asset Pipeline | Design Brief Section 17, PRD BR-8 | Automated Playwright screenshot pipeline and internal `/_assets` route | Eliminate artificial mockups and generate authentic, deterministic product imagery across both light and dark themes. |
| SC-10 | Claims Guardrails | PRD Section 14, TRD Section 15 | Strict assertion forbidding draft markers, example emails, and em dashes | Ensure legal, ethical, and brand accuracy across all production builds. |
| SC-11 | Next.js Configuration | TRD Section 15 | Disable Next.js dev indicator icon in all environments | Prevent third-party overlay icons from cluttering UI reviews and screenshot generation. |
