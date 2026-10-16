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
  const page = await browser.newPage({ viewport: { width: 1703, height: 895 } });

  const customCSS = `
    .container, .container-site {
      width: 100% !important;
      max-width: 1440px !important;
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

  for (const p of PAGES) {
    await page.goto(`http://localhost:3000${p.path}`, { waitUntil: "networkidle" });
    await page.evaluate((css) => {
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
    }, customCSS);
    await page.waitForTimeout(300);

    const shot = path.resolve(__dirname, `../docs/screens-after/all-1440-${p.name}.png`);
    await page.screenshot({ path: shot, fullPage: false });

    const layout = await page.evaluate(() => {
      const logo = document.querySelector("header a, header svg, [class*='logo']");
      const h1 = document.querySelector("h1");
      const footerLogo = document.querySelector("footer a, footer svg, footer [class*='logo']");
      const lRect = logo?.getBoundingClientRect();
      const hRect = h1?.getBoundingClientRect();
      const fRect = footerLogo?.getBoundingClientRect();
      const body = document.body;
      return {
        logoLeft: Math.round(lRect?.left || 0),
        h1Left: Math.round(hRect?.left || 0),
        footerLogoLeft: Math.round(fRect?.left || 0),
        leftDelta: Math.abs(Math.round(lRect?.left || 0) - Math.round(hRect?.left || 0)),
        hasHorizontalOverflow: body.scrollWidth > window.innerWidth,
      };
    });

    console.log(`${p.name}:`, layout);
  }

  await browser.close();
}

run().catch(console.error);
