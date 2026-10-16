import { chromium } from "playwright";
import * as path from "path";
import * as fs from "fs";

const ARTIFACTS_DIR = "C:/Users/Aasif/.gemini/antigravity-ide/brain/caa0d20a-1260-4c98-b958-58655341542e";

async function captureReview() {
  const browser = await chromium.launch();

  const configs = [
    { name: "home-desktop-dark", route: "/", width: 1280, height: 900, theme: "dark" },
    { name: "home-desktop-light", route: "/", width: 1280, height: 900, theme: "light" },
    { name: "home-mobile-dark", route: "/", width: 375, height: 812, theme: "dark" },
    { name: "home-mobile-light", route: "/", width: 375, height: 812, theme: "light" },
    { name: "privacy-desktop-dark", route: "/privacy", width: 1280, height: 900, theme: "dark" },
    { name: "privacy-desktop-light", route: "/privacy", width: 1280, height: 900, theme: "light" },
    { name: "privacy-mobile-dark", route: "/privacy", width: 375, height: 812, theme: "dark" },
    { name: "privacy-mobile-light", route: "/privacy", width: 375, height: 812, theme: "light" },
  ];

  for (const cfg of configs) {
    const context = await browser.newContext({
      viewport: { width: cfg.width, height: cfg.height },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    await page.addInitScript((th) => {
      localStorage.setItem("kairo-theme", th);
      document.documentElement.setAttribute("data-theme", th);
    }, cfg.theme);

    await page.goto(`http://localhost:3000${cfg.route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const outPath = path.join(ARTIFACTS_DIR, `${cfg.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved: ${outPath}`);

    await context.close();
  }

  await browser.close();
}

captureReview().catch(console.error);
