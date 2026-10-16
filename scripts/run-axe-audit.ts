import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/how-it-works",
  "/coverage",
  "/about",
  "/security",
  "/privacy",
  "/terms",
  "/contact",
  "/licenses",
  "/sign-in",
];

const THEMES = ["dark", "light"] as const;

async function runAudit() {
  const browser = await chromium.launch();
  let totalViolations = 0;
  const results: Record<string, any> = {};

  for (const route of ROUTES) {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        colorScheme: theme,
      });

      const page = await context.newPage();

      await page.addInitScript((th) => {
        localStorage.setItem("kairo-theme", th);
        document.documentElement.setAttribute("data-theme", th);
      }, theme);

      await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const violations = accessibilityScanResults.violations;
      const key = `${route} [${theme}]`;
      results[key] = violations.length;

      if (violations.length > 0) {
        console.error(`\nAccessibility Violations found on ${key}: ${violations.length}`);
        for (const v of violations) {
          console.error(`  - [${v.impact}] ${v.id}: ${v.description}`);
          for (const node of v.nodes.slice(0, 2)) {
            console.error(`    Target: ${node.target}`);
          }
        }
        totalViolations += violations.length;
      } else {
        console.log(`PASS: ${key} (0 violations)`);
      }

      await context.close();
    }
  }

  await browser.close();

  console.log("\n=================================");
  console.log(`TOTAL AXE ACCESSIBILITY VIOLATIONS: ${totalViolations}`);
  console.log("=================================");

  if (totalViolations > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("Axe audit error:", err);
  process.exit(1);
});
