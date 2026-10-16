import { chromium } from "playwright";
import * as path from "path";

async function testWidth(maxWidth: string, label: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1873, height: 985 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

  await page.evaluate((mw) => {
    const style = document.createElement("style");
    style.innerHTML = `
      .container, .container-site {
        max-width: ${mw} !important;
      }
    `;
    document.head.appendChild(style);
  }, maxWidth);

  await page.waitForTimeout(300);

  const shotPath = path.resolve(__dirname, `../docs/screens-after/test-${label}.png`);
  await page.screenshot({ path: shotPath, fullPage: false });

  const metrics = await page.evaluate(() => {
    const logo = document.querySelector("header a, header svg, [class*='logo']");
    const h1 = document.querySelector("h1");
    const container = document.querySelector(".container");
    const lRect = logo?.getBoundingClientRect();
    const hRect = h1?.getBoundingClientRect();
    const cRect = container?.getBoundingClientRect();
    return {
      containerWidth: cRect?.width,
      containerLeft: cRect?.left,
      logoLeft: lRect?.left,
      h1Left: hRect?.left,
    };
  });

  console.log(`Test ${label} (${maxWidth}):`, metrics);

  // Also test coverage page
  await page.goto("http://localhost:3000/coverage", { waitUntil: "networkidle" });
  await page.evaluate((mw) => {
    const style = document.createElement("style");
    style.innerHTML = `
      .container, .container-site {
        max-width: ${mw} !important;
      }
    `;
    document.head.appendChild(style);
  }, maxWidth);
  await page.waitForTimeout(300);
  const covShotPath = path.resolve(__dirname, `../docs/screens-after/test-coverage-${label}.png`);
  await page.screenshot({ path: covShotPath, fullPage: false });

  await browser.close();
}

async function run() {
  await testWidth("1400px", "1400");
  await testWidth("1480px", "1480");
  await testWidth("1536px", "1536");
  await testWidth("1600px", "1600");
}

run().catch(console.error);
