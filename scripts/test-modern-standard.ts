import { chromium } from "playwright";
import * as path from "path";

const VIEWPORTS = [
  { name: "user-1703", width: 1703, height: 895 },
  { name: "user-1873", width: 1873, height: 985 },
  { name: "laptop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-820", width: 820, height: 1180 },
  { name: "mobile-390", width: 390, height: 844 },
];

async function run() {
  const browser = await chromium.launch();

  // Test with responsive standard padding (48px desktop, 24px tablet, 20px mobile)
  const testCSS = `
    .container, .container-site {
      width: 100% !important;
      max-width: 100% !important;
      padding-left: 48px !important;
      padding-right: 48px !important;
      box-sizing: border-box !important;
    }
    @media (min-width: 1921px) {
      .container, .container-site {
        max-width: 1800px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    }
    @media (max-width: 1024px) {
      .container, .container-site {
        padding-left: 24px !important;
        padding-right: 24px !important;
      }
    }
    @media (max-width: 640px) {
      .container, .container-site {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
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

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.evaluate((css) => {
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
    }, testCSS);
    await page.waitForTimeout(300);

    const shot = path.resolve(__dirname, `../docs/screens-after/modern-${vp.name}.png`);
    await page.screenshot({ path: shot, fullPage: false });

    const data = await page.evaluate(() => {
      const stage = document.querySelector(".hero-stage-container");
      const overlay = document.querySelector(".stage-inset-overlay");
      const win = document.querySelector(".hero-stage-bleed");
      const header = document.querySelector("header [class*='container']");
      const logo = document.querySelector("header a, header svg, [class*='logo']");
      const h1 = document.querySelector("h1");
      const body = document.body;
      const sRect = stage?.getBoundingClientRect();
      const oRect = overlay?.getBoundingClientRect();
      const wRect = win?.getBoundingClientRect();
      const hRect = header?.getBoundingClientRect();
      const lRect = logo?.getBoundingClientRect();
      const h1Rect = h1?.getBoundingClientRect();

      return {
        windowWidth: window.innerWidth,
        leftGap: Math.round(lRect?.left || 0),
        rightGap: Math.round(window.innerWidth - (hRect?.right || 0)),
        h1Left: Math.round(h1Rect?.left || 0),
        winRight: Math.round(wRect?.right || 0),
        overlayRight: Math.round(oRect?.right || 0),
        isWinCut: (wRect?.right || 0) > window.innerWidth,
        isOverlayCut: (oRect?.right || 0) > window.innerWidth,
        hasHorizontalScroll: body.scrollWidth > window.innerWidth,
      };
    });

    console.log(`[${vp.name}]:`, JSON.stringify(data));
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
