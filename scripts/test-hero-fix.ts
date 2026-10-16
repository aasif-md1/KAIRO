import { chromium } from "playwright";
import * as path from "path";

const VIEWPORTS = [
  { name: "user-1703", width: 1703, height: 895 },
  { name: "user-1873", width: 1873, height: 985 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const CONTAINER_CONFIGS = [
  { name: "1360px", maxWidth: "1360px" },
  { name: "1400px", maxWidth: "1400px" },
  { name: "1440px", maxWidth: "1440px" },
];

async function run() {
  const browser = await chromium.launch();

  for (const cfg of CONTAINER_CONFIGS) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

      // Apply fix styles:
      // 1. Container centered with equal standard gaps on both sides
      // 2. Remove negative right margin on .hero-stage-bleed
      // 3. Fix .stage-inset-overlay so it stays within bounds (right: 0)
      // 4. WindowFrame minWidth: 0
      await page.evaluate((maxWidth) => {
        const style = document.createElement("style");
        style.innerHTML = `
          .container, .container-site {
            width: 100% !important;
            max-width: ${maxWidth} !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
            box-sizing: border-box !important;
          }
          .hero-stage-bleed {
            margin-right: 0 !important;
            padding-right: 0 !important;
            width: 100% !important;
          }
          .hero-stage-bleed > div {
            min-width: 0 !important;
            width: 100% !important;
          }
          .stage-inset-overlay {
            right: 0 !important;
            bottom: -24px !important;
            width: 58% !important;
            max-width: 440px !important;
          }
        `;
        document.head.appendChild(style);
      }, cfg.maxWidth);

      await page.waitForTimeout(300);

      const shotName = `fix-${cfg.name}-${vp.name}.png`;
      await page.screenshot({ path: path.resolve(__dirname, `../docs/screens-after/${shotName}`) });

      const check = await page.evaluate(() => {
        const win = document.querySelector(".hero-stage-bleed");
        const overlay = document.querySelector(".stage-inset-overlay");
        const container = document.querySelector(".container");
        const exportBtn = Array.from(document.querySelectorAll("span")).find(s => s.textContent?.includes("Export:"));
        const confirmedBadge = Array.from(document.querySelectorAll("span")).find(s => s.textContent?.includes("Confirmed by test"));
        const wRect = win?.getBoundingClientRect();
        const oRect = overlay?.getBoundingClientRect();
        const cRect = container?.getBoundingClientRect();
        return {
          windowWidth: window.innerWidth,
          containerLeft: cRect?.left,
          containerRight: cRect?.right,
          containerWidth: cRect?.width,
          winRight: wRect?.right,
          overlayRight: oRect?.right,
          isWinCut: (wRect?.right || 0) > window.innerWidth,
          isOverlayCut: (oRect?.right || 0) > window.innerWidth,
          exportBtnText: exportBtn?.textContent?.trim(),
          confirmedBadgeText: confirmedBadge?.textContent?.trim(),
        };
      });

      console.log(`[${cfg.name} @ ${vp.name}]:`, JSON.stringify(check));
      await page.close();
    }
  }

  await browser.close();
}

run().catch(console.error);
