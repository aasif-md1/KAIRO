import { chromium } from "playwright";
import * as path from "path";

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

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1873, height: 985 },
  });
  const page = await context.newPage();

  const proposedCSS = `
    .container, .container-site {
      width: 100% !important;
      max-width: 100% !important;
      padding-left: 56px !important;
      padding-right: 56px !important;
      box-sizing: border-box !important;
    }
    @media (min-width: 1921px) {
      .container, .container-site {
        max-width: 1800px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
    }
  `;

  for (const p of PAGES) {
    await page.goto(`http://localhost:3000${p.path}`, { waitUntil: "networkidle" });
    await page.evaluate((css) => {
      const style = document.createElement("style");
      style.id = "proposed-container";
      style.innerHTML = css;
      document.head.appendChild(style);
    }, proposedCSS);
    await page.waitForTimeout(300);

    const shotPath = path.resolve(__dirname, `../docs/screens-after/proposed-${p.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });

    const layout = await page.evaluate(() => {
      const logo = document.querySelector("header a, header svg, [class*='logo']");
      const h1 = document.querySelector("h1");
      const footerLogo = document.querySelector("footer a, footer svg, footer [class*='logo']");
      const lRect = logo?.getBoundingClientRect();
      const hRect = h1?.getBoundingClientRect();
      const fRect = footerLogo?.getBoundingClientRect();
      return {
        logoLeft: lRect?.left,
        h1Left: hRect?.left,
        footerLogoLeft: fRect?.left,
        delta: Math.abs((lRect?.left || 0) - (hRect?.left || 0)),
      };
    });

    console.log(`${p.name}:`, layout);
  }

  await browser.close();
}

run().catch(console.error);
