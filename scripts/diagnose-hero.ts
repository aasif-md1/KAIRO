import { chromium } from "playwright";
import * as path from "path";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1703, height: 895 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const rect = await page.evaluate(() => {
    const stage = document.querySelector(".hero-stage-container");
    const overlay = document.querySelector(".stage-inset-overlay");
    const win = document.querySelector(".hero-stage-bleed");
    const body = document.body;
    return {
      windowWidth: window.innerWidth,
      bodyScrollWidth: body.scrollWidth,
      stage: stage?.getBoundingClientRect(),
      overlay: overlay?.getBoundingClientRect(),
      win: win?.getBoundingClientRect(),
    };
  });

  console.log("DIAGNOSTIC_DATA:", JSON.stringify(rect, null, 2));
  await page.screenshot({ path: path.resolve(__dirname, "../docs/screens-after/hero-cut-check.png") });
  await browser.close();
}

run().catch(console.error);
