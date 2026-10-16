# Marketing Asset Generation Pipeline

This document defines how visual marketing assets and screenshots are deterministically generated and preserved for the KAIRO public website.

## 1. Principles of Realism

As specified in PRD Section 14 and UI/UX Design Brief Section 2:
- No AI image generators, stock photography, 3D renders, or clip art are used.
- Every screenshot is rendered from real application UI components populated with deterministic fixture data (`acme-storefront-api`).
- Diagrams are rendered as pure SVG components inheriting brand theme tokens directly.
- All product screenshots are provided in both Light and Dark themes, captured at 2x pixel density.

## 2. Route Group Structure

Internal fixture pages reside in `apps/web/src/app/internal-assets/` and are remapped via `next.config.ts`:
- `/internal-assets/report`: Full audit findings report with metrics and severity pills.
- `/internal-assets/finding-detail`: Granular vulnerability detail screen showing static code excerpt, dynamic replay HTTP exchange, and framework remediation.
- `/internal-assets/scan-progress`: Mid-scan progress view displaying the 6 analysis stages and execution status.
- `/internal-assets/repo-picker`: Step 1 repository authorization and selection view.
- `/internal-assets/project-settings`: Isolated sandbox execution configuration (Run tab).
- `/internal-assets/route-inventory`: Static AST route inventory table with Detected/Absent/Unknown signals.
- `/internal-assets/pdf-preview`: Vector layout of the Executive Summary PDF report page.

These routes are excluded from search engine indexing and production sitemaps.

## 3. Automation Script

The automated capture script uses Playwright to snapshot each screen in both Light and Dark themes:

```bash
# Ensure local dev server is active on port 3000
pnpm --filter web dev

# Run capture pipeline
pnpm exec ts-node scripts/capture-marketing-assets.ts
```

The script produces:
- High-resolution PNG and WebP assets saved to `apps/web/public/marketing/`.
- `apps/web/public/marketing/manifest.json` recording dimensions and file paths for each screen variant.

## 4. Theme and Window Framing

All screenshots are displayed within the `<WindowFrame />` component:
- Monospace URL bar indicating the relative view path.
- 1px border using theme tokens (`var(--line)`).
- Two complementary image tags or CSS rules switching between `light` and `dark` variants without layout shift or client flash.
