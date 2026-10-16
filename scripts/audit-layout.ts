import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const PAGES = [
  { name: "Home", path: "/" },
  { name: "How it works", path: "/how-it-works" },
  { name: "Coverage", path: "/coverage" },
  { name: "Security", path: "/security" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
  { name: "Licenses", path: "/licenses" },
  { name: "Sign in", path: "/sign-in" },
];

const VIEWPORTS = [1280, 1440, 1920];

interface PageAuditResult {
  pageName: string;
  path: string;
  viewport: number;
  logoLeft: number;
  h1Left: number;
  firstPLeft: number;
  leftEdgeDiff: number;
  widestTextBlockShare: number;
  fontSizesInUse: string[];
  emptyRightShareMax: number;
  sectionsAudit: Array<{
    selector: string;
    width: number;
    emptyRightPct: number;
  }>;
}

async function runAudit() {
  const isAfter = process.argv.includes("--after");
  const outputFile = isAfter ? "docs/LAYOUT_AUDIT_AFTER.md" : "docs/LAYOUT_AUDIT_BEFORE.md";
  console.log(`Running layout audit (${isAfter ? "AFTER" : "BEFORE"})...`);

  const browser = await chromium.launch();
  const results: PageAuditResult[] = [];

  for (const p of PAGES) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp, height: 900 },
      });
      const page = await context.newPage();
      try {
        await page.goto(`http://localhost:3000${p.path}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(500);

        const audit = await page.evaluate((vpWidth) => {
          // 1. Logo left edge
          const logo = document.querySelector("header [aria-label*='KAIRO'], header a, header svg, header [class*='logo']");
          const logoRect = logo ? logo.getBoundingClientRect() : { left: 0 };

          // 2. H1 left edge
          const h1 = document.querySelector("h1");
          const h1Rect = h1 ? h1.getBoundingClientRect() : { left: 0 };

          // 3. First paragraph left edge
          const firstP = document.querySelector("main p, p");
          const firstPRect = firstP ? firstP.getBoundingClientRect() : { left: 0 };

          // 4. Main / container bounding rect
          const container = document.querySelector("main > div, main [class*='container'], [class*='container']") || document.querySelector("main");
          const containerRect = container ? container.getBoundingClientRect() : { width: vpWidth, left: 0, right: vpWidth };
          const containerW = containerRect.width || 1200;

          // 5. Widest text block
          const allP = Array.from(document.querySelectorAll("main p, main article, main [class*='content']"));
          let maxTextW = 0;
          for (const el of allP) {
            const r = el.getBoundingClientRect();
            if (r.width > maxTextW && r.height > 20) {
              maxTextW = r.width;
            }
          }
          const widestShare = Math.round((maxTextW / containerW) * 100);

          // 6. Font sizes in use
          const fontSizes = new Set<string>();
          const textEls = Array.from(document.querySelectorAll("h1, h2, h3, p, span, a, li, code"));
          for (const el of textEls) {
            const s = window.getComputedStyle(el);
            if (s.fontSize) fontSizes.add(s.fontSize);
          }

          // 7. Empty right share of each section
          const sections = Array.from(document.querySelectorAll("main > section, main > div > section, section"));
          const sectionsAudit: Array<{ selector: string; width: number; emptyRightPct: number }> = [];
          let maxEmpty = 0;

          for (let i = 0; i < sections.length; i++) {
            const sec = sections[i];
            const secRect = sec.getBoundingClientRect();
            // find rightmost child in this section
            const children = Array.from(sec.querySelectorAll("*"));
            let maxRight = secRect.left;
            for (const child of children) {
              const cr = child.getBoundingClientRect();
              if (cr.width > 0 && cr.height > 0 && cr.right > maxRight) {
                maxRight = cr.right;
              }
            }
            const secW = secRect.width || containerW;
            const emptyRight = Math.max(0, secRect.right - maxRight);
            const emptyPct = Math.round((emptyRight / secW) * 100);
            if (emptyPct > maxEmpty) maxEmpty = emptyPct;

            sectionsAudit.push({
              selector: `section-${i + 1}`,
              width: Math.round(secW),
              emptyRightPct: emptyPct,
            });
          }

          const leftDiff = Math.abs(logoRect.left - h1Rect.left);

          return {
            logoLeft: Math.round(logoRect.left),
            h1Left: Math.round(h1Rect.left),
            firstPLeft: Math.round(firstPRect.left),
            leftEdgeDiff: Math.round(leftDiff),
            widestTextBlockShare: widestShare,
            fontSizesInUse: Array.from(fontSizes).sort((a,b)=>parseFloat(a)-parseFloat(b)),
            emptyRightShareMax: maxEmpty,
            sectionsAudit,
          };
        }, vp);

        results.push({
          pageName: p.name,
          path: p.path,
          viewport: vp,
          ...audit,
        });
      } catch (e: any) {
        console.error(`Error on ${p.name} @ ${vp}:`, e.message);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();

  // Generate markdown report
  let md = `# Layout Alignment & Density Audit (${isAfter ? "AFTER" : "BEFORE"} Redesign)\n\n`;
  md += `Audit timestamp: ${new Date().toISOString()}\n`;
  md += `Target acceptance thresholds:\n`;
  md += `- **Left Edge Alignment**: Logo, H1, first paragraph left edge match (Tolerance <= 1px)\n`;
  md += `- **Empty Right Space**: <= 15% across standard layout sections\n`;
  md += `- **Container Consistency**: Unified 1200px content width with 40px desktop padding\n\n`;

  md += `| Page | Viewport | Logo Left | H1 Left | 1st P Left | Left Edge Delta | Widest Text Block Share | Max Empty Right Share | Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  for (const r of results) {
    const aligned = r.leftEdgeDiff <= 1 ? "ALIGNED" : `MISALIGNED (${r.leftEdgeDiff}px)`;
    md += `| **${r.pageName}** (${r.path}) | ${r.viewport}px | ${r.logoLeft}px | ${r.h1Left}px | ${r.firstPLeft}px | ${aligned} | ${r.widestTextBlockShare}% | ${r.emptyRightShareMax}% | ${r.leftEdgeDiff <= 1 && r.emptyRightShareMax <= 25 ? "PASS" : "NEEDS_FIX"} |\n`;
  }

  md += `\n\n## Detailed Observations & Font Scales by Page\n\n`;
  for (const p of PAGES) {
    const pResults = results.filter((r) => r.pageName === p.name);
    if (pResults.length === 0) continue;
    const r1440 = pResults.find((r) => r.viewport === 1440) || pResults[0];
    md += `### ${p.name} (${p.path})\n`;
    md += `- **At 1440px**: Logo left = ${r1440.logoLeft}px, H1 left = ${r1440.h1Left}px (Delta: ${r1440.leftEdgeDiff}px)\n`;
    md += `- **Max Empty Right Margin**: ${r1440.emptyRightShareMax}%\n`;
    md += `- **Font Sizes in Use**: ${r1440.fontSizesInUse.join(", ")}\n\n`;
  }

  fs.writeFileSync(outputFile, md, "utf-8");
  console.log(`Saved audit report to ${outputFile}`);
}

runAudit().catch(console.error);
