import { chromium } from "playwright";
import * as path from "path";

const ARTIFACTS_DIR = "C:/Users/Aasif/.gemini/antigravity-ide/brain/caa0d20a-1260-4c98-b958-58655341542e";

const PAGES = [
  { name: "home", path: "/" },
  { name: "how-it-works", path: "/how-it-works" },
  { name: "coverage", path: "/coverage" },
  { name: "about", path: "/about" },
  { name: "security", path: "/security" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
  { name: "contact", path: "/contact" },
  { name: "licenses", path: "/licenses" },
  { name: "sign-in", path: "/sign-in" },
];

async function captureAllFullscreen() {
  const browser = await chromium.launch();

  for (const pageInfo of PAGES) {
    for (const theme of ["dark", "light"] as const) {
      const context = await browser.newContext({
        viewport: { width: 1700, height: 900 },
        deviceScaleFactor: 1,
      });

      const page = await context.newPage();

      await page.addInitScript((th) => {
        localStorage.setItem("kairo-theme", th);
        document.documentElement.setAttribute("data-theme", th);
      }, theme);

      await page.goto(`http://localhost:3000${pageInfo.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const outPath = path.join(ARTIFACTS_DIR, `fullscreen-${pageInfo.name}-${theme}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Captured: fullscreen-${pageInfo.name}-${theme}.png`);

      await context.close();
    }
  }

  await browser.close();
  console.log("All fullscreen screenshots captured successfully!");
}

captureAllFullscreen().catch(console.error);
