import { chromium } from "playwright";
import * as path from "path";

async function testLayout(cssRule: string, label: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1873, height: 985 },
  });
  const page = await context.newPage();

  const routes = [
    { name: "home", path: "/" },
    { name: "coverage", path: "/coverage" },
    { name: "about", path: "/about" },
    { name: "how-it-works", path: "/how-it-works" },
  ];

  for (const r of routes) {
    await page.goto(`http://localhost:3000${r.path}`, { waitUntil: "networkidle" });
    await page.evaluate((css) => {
      const style = document.createElement("style");
      style.innerHTML = `
        .container, .container-site {
          ${css} !important;
        }
      `;
      document.head.appendChild(style);
    }, cssRule);
    await page.waitForTimeout(300);

    const shotPath = path.resolve(__dirname, `../docs/screens-after/layout-${label}-${r.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
  }

  await browser.close();
  console.log(`Finished testing ${label}`);
}

async function run() {
  await testLayout("width: 100%; max-width: 100%; padding-left: 64px; padding-right: 64px;", "fluid-64");
  await testLayout("width: 100%; max-width: 100%; padding-left: 48px; padding-right: 48px;", "fluid-48");
  await testLayout("width: 100%; max-width: 1680px; padding-left: 48px; padding-right: 48px; margin-left: auto; margin-right: auto;", "max-1680");
}

run().catch(console.error);
