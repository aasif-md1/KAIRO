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
  // Test at user's exact screen dimensions (1703 and 1873)
  for (const vp of [1703, 1873, 1440]) {
    const page = await browser.newPage({ viewport: { width: vp, height: 900 } });

    for (const p of PAGES) {
      await page.goto(`http://localhost:3000${p.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const check = await page.evaluate(() => {
        const logo = document.querySelector("header a, header svg, [class*='logo']");
        const h1 = document.querySelector("h1");
        const footerLogo = document.querySelector("footer a, footer svg, footer [class*='logo']");
        const body = document.body;
        const lRect = logo?.getBoundingClientRect();
        const hRect = h1?.getBoundingClientRect();
        const fRect = footerLogo?.getBoundingClientRect();

        return {
          viewport: window.innerWidth,
          logoLeft: Math.round(lRect?.left || 0),
          h1Left: Math.round(hRect?.left || 0),
          footerLogoLeft: Math.round(fRect?.left || 0),
          leftDelta: Math.abs(Math.round(lRect?.left || 0) - Math.round(hRect?.left || 0)),
          hasHorizontalScroll: body.scrollWidth > window.innerWidth,
        };
      });

      console.log(`[${vp}px] ${p.name}:`, JSON.stringify(check));
    }

    if (vp === 1703) {
      await page.screenshot({ path: path.resolve(__dirname, "../docs/screens-after/final-live-home-1703.png") });
    } else if (vp === 1873) {
      await page.screenshot({ path: path.resolve(__dirname, "../docs/screens-after/final-live-home-1873.png") });
    }
    await page.close();
  }

  await browser.close();
}

run().catch(console.error);
