import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const ARTIFACTS_DIR = "C:/Users/Aasif/.gemini/antigravity-ide/brain/caa0d20a-1260-4c98-b958-58655341542e";
const DOCS_SCREENS_DIR = path.resolve(__dirname, "../docs/screens-after");

const PAGES = [
  { name: "home", path: "/" },
  { name: "how-it-works", path: "/how-it-works" },
  { name: "coverage", path: "/coverage" },
  { name: "security", path: "/security" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
  { name: "licenses", path: "/licenses" },
  { name: "sign-in", path: "/sign-in" },
];

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
  { name: "820", width: 820, height: 1180 },
  { name: "390", width: 390, height: 844 },
];

const THEMES = ["dark", "light"] as const;

async function run() {
  if (!fs.existsSync(DOCS_SCREENS_DIR)) {
    fs.mkdirSync(DOCS_SCREENS_DIR, { recursive: true });
  }

  console.log("Launching browser to capture after-redesign screens...");
  const browser = await chromium.launch();

  for (const pageInfo of PAGES) {
    for (const vp of VIEWPORTS) {
      for (const theme of THEMES) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
        });
        const page = await context.newPage();

        await page.addInitScript((th) => {
          localStorage.setItem("kairo-theme", th);
          document.documentElement.setAttribute("data-theme", th);
        }, theme);

        try {
          await page.goto(`http://localhost:3000${pageInfo.path}`, { waitUntil: "networkidle" });
          await page.waitForTimeout(400);

          const fileName = `${pageInfo.name}-${vp.name}-${theme}.png`;
          const filePath = path.join(DOCS_SCREENS_DIR, fileName);

          await page.screenshot({ path: filePath, fullPage: true });

          // Also copy 1440px screenshots to artifacts directory for direct embedding
          if (vp.name === "1440") {
            const artifactPath = path.join(ARTIFACTS_DIR, `screen-${pageInfo.name}-${theme}-1440.png`);
            fs.copyFileSync(filePath, artifactPath);
          }

          console.log(`Saved: ${fileName}`);
        } catch (e: any) {
          console.error(`Error capturing ${pageInfo.name} @ ${vp.name} (${theme}):`, e.message);
        } finally {
          await context.close();
        }
      }
    }
  }

  await browser.close();
  console.log("Screenshot capture completed!");
}

run().catch(console.error);
