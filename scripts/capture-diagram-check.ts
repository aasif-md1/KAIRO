import { chromium } from "playwright";
import * as path from "path";

const ARTIFACTS_DIR = "C:/Users/Aasif/.gemini/antigravity-ide/brain/caa0d20a-1260-4c98-b958-58655341542e";

async function checkDiagram() {
  const browser = await chromium.launch();
  for (const theme of ["dark", "light"] as const) {
    const context = await browser.newContext({
      viewport: { width: 1700, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.evaluate((t) => {
      localStorage.setItem("kairo-theme", t);
      document.documentElement.setAttribute("data-theme", t);
    }, theme);
    await page.reload({ waitUntil: "networkidle" });

    // Locate the svg diagram
    const svg = page.locator('svg[aria-label="Three analysis layers funneling into one merged report"]').first();
    if (await svg.count() > 0) {
      await svg.screenshot({
        path: path.join(ARTIFACTS_DIR, `diagram-threelayers-${theme}.png`),
      });
      console.log(`Captured diagram-threelayers-${theme}.png`);
    }
    await context.close();
  }
  await browser.close();
}

checkDiagram().catch(console.error);
