import { chromium } from "playwright";
import * as path from "path";

const PAGES = ["/", "/how-it-works", "/coverage", "/security", "/about", "/contact", "/privacy", "/licenses", "/sign-in"];

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1873, height: 985 },
  });
  const page = await context.newPage();

  for (const route of PAGES) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    const name = route === "/" ? "home" : route.slice(1);
    const shotPath = path.resolve(__dirname, `../docs/screens-after/userview-${name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });

    const layout = await page.evaluate(() => {
      const headerLogo = document.querySelector("header a, header svg, [class*='logo']");
      const h1 = document.querySelector("h1");
      const container = document.querySelector(".container");
      const hRect = headerLogo?.getBoundingClientRect();
      const h1Rect = h1?.getBoundingClientRect();
      const cRect = container?.getBoundingClientRect();
      return {
        viewportWidth: window.innerWidth,
        containerWidth: cRect?.width,
        containerLeft: cRect?.left,
        containerRight: cRect?.right,
        logoLeft: hRect?.left,
        h1Left: h1Rect?.left,
      };
    });

    console.log(`${route}:`, layout);
  }

  await browser.close();
}

run().catch(console.error);
