import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

interface ScreenTarget {
  name: string;
  route: string;
  width: number;
  height: number;
}

const SCREENS: ScreenTarget[] = [
  { name: "report", route: "/internal-assets/report", width: 1040, height: 680 },
  { name: "finding-detail", route: "/internal-assets/finding-detail", width: 1040, height: 720 },
  { name: "scan-progress", route: "/internal-assets/scan-progress", width: 1040, height: 600 },
  { name: "repo-picker", route: "/internal-assets/repo-picker", width: 800, height: 520 },
  { name: "project-settings", route: "/internal-assets/project-settings", width: 800, height: 620 },
  { name: "route-inventory", route: "/internal-assets/route-inventory", width: 1040, height: 500 },
  { name: "pdf-preview", route: "/internal-assets/pdf-preview", width: 700, height: 950 },
];

const THEMES = ["dark", "light"] as const;
const SCALES = [2] as const;

async function capture() {
  const outputDir = path.resolve(__dirname, "../apps/web/public/marketing");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const manifest: Record<string, any> = {};

  const browser = await chromium.launch();

  for (const screen of SCREENS) {
    manifest[screen.name] = {
      route: screen.route,
      width: screen.width,
      height: screen.height,
      variants: {},
    };

    for (const theme of THEMES) {
      for (const scale of SCALES) {
        const context = await browser.newContext({
          viewport: { width: screen.width, height: screen.height },
          deviceScaleFactor: scale,
          colorScheme: theme === "dark" ? "dark" : "light",
        });

        const page = await context.newPage();

        // Inject theme into localStorage prior to navigation
        await page.addInitScript((th) => {
          localStorage.setItem("kairo-theme", th);
          document.documentElement.setAttribute("data-theme", th);
        }, theme);

        const url = `http://localhost:3000${screen.route}`;
        await page.goto(url, { waitUntil: "networkidle" });

        // Ensure animations are disabled and font rendering is settled
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0s !important;
              transition-duration: 0s !important;
              caret-color: transparent !important;
            }
          `,
        });

        await page.waitForTimeout(300);

        const baseFileName = `${screen.name}-${theme}@${scale}x`;
        const pngPath = path.join(outputDir, `${baseFileName}.png`);

        await page.screenshot({
          path: pngPath,
          clip: { x: 0, y: 0, width: screen.width, height: screen.height },
        });

        manifest[screen.name].variants[`${theme}_${scale}x`] = {
          png: `/marketing/${baseFileName}.png`,
          width: screen.width * scale,
          height: screen.height * scale,
        };

        console.log(`Captured: ${baseFileName}.png`);
        await context.close();
      }
    }
  }

  await browser.close();

  const manifestPath = path.join(outputDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Manifest saved to ${manifestPath}`);
}

capture().catch((err) => {
  console.error("Asset capture error:", err);
  process.exit(1);
});
