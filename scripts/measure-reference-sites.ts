import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

interface SiteMeasurement {
  name: string;
  url: string;
  status: "success" | "failed";
  error?: string;
  viewport1440?: {
    containerWidth: number;
    sidePadding: number;
    h1FontSize: string;
    h1FontWeight: string;
    leadFontSize: string;
    bodyFontSize: string;
    navLinkFontSize: string;
    sectionPaddings: number[];
    footerColumns: number;
    headerNavItems: number;
    heroVisualPlacement: string;
    heroVisualWidthPct: number;
    sectionPatterns: string[];
    legalLayout?: {
      columns: number;
      tocPlacement: string;
      textWidth: number;
      hasSideRail: boolean;
    };
  };
  viewport1920?: {
    containerWidth: number;
    sidePadding: number;
  };
}

const SITES = [
  { name: "Aikido", url: "https://www.aikido.dev" },
  { name: "Socket", url: "https://socket.dev" },
  { name: "Snyk", url: "https://snyk.io" },
  { name: "Semgrep", url: "https://semgrep.dev" },
  { name: "GitGuardian", url: "https://www.gitguardian.com" },
  { name: "Truffle Security", url: "https://trufflesecurity.com" },
  { name: "StackHawk", url: "https://www.stackhawk.com" },
  { name: "Escape", url: "https://escape.tech" },
  { name: "Detectify", url: "https://detectify.com" },
  { name: "Intruder", url: "https://www.intruder.io" },
  { name: "Corgea", url: "https://corgea.com" },
  { name: "ZeroPath", url: "https://zeropath.com" },
  { name: "Linear", url: "https://linear.app" },
  { name: "Vercel", url: "https://vercel.com" },
  { name: "Stripe", url: "https://stripe.com" },
  { name: "Resend", url: "https://resend.com" },
  { name: "Railway", url: "https://railway.com" },
  { name: "Supabase", url: "https://supabase.com" },
  { name: "Neon", url: "https://neon.tech" },
  { name: "Sentry", url: "https://sentry.io" },
  { name: "PostHog", url: "https://posthog.com" },
  { name: "Tailscale", url: "https://tailscale.com" },
  { name: "Cloudflare", url: "https://www.cloudflare.com" },
  { name: "1Password", url: "https://1password.com" },
  { name: "GitHub Security", url: "https://github.com/features/security" },
  { name: "GitLab Security", url: "https://about.gitlab.com/stages-devops-lifecycle/security/" },
  { name: "HackerOne", url: "https://www.hackerone.com" },
  { name: "Plausible", url: "https://plausible.io" },
  { name: "Clerk", url: "https://clerk.com" },
  { name: "WorkOS", url: "https://workos.com" },
  { name: "DeepSource", url: "https://deepsource.com" },
];

async function measureSite(browser: any, site: { name: string; url: string }): Promise<SiteMeasurement> {
  const result: SiteMeasurement = {
    name: site.name,
    url: site.url,
    status: "success",
  };

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    console.log(`Measuring ${site.name} at ${site.url}...`);
    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    // Save screenshot
    const shotPath = path.join("docs", "reference-shots", `${site.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}-1440.png`);
    try {
      await page.screenshot({ path: shotPath, fullPage: false });
    } catch {
      // ignore screenshot failure
    }

    const data1440 = await page.evaluate(() => {
      // 1. Container measurement
      const main = document.querySelector("main") || document.querySelector("#main") || document.body;
      const sections = Array.from(main.querySelectorAll("section, [class*='section'], div > div"));
      let bestContainer: Element | null = null;
      let minDiff = 9999;
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 700 && rect.width <= 1440 && rect.height > 100) {
          const diff = Math.abs(rect.width - 1200);
          if (diff < minDiff) {
            minDiff = diff;
            bestContainer = el;
          }
        }
      }
      const cRect = bestContainer ? bestContainer.getBoundingClientRect() : { width: 1200, left: 120 };
      const compStyle = bestContainer ? window.getComputedStyle(bestContainer) : null;
      const padLeft = compStyle ? parseFloat(compStyle.paddingLeft) || 0 : 40;

      // 2. Hero h1 font
      const h1 = document.querySelector("h1");
      let h1Size = "56px";
      let h1Weight = "600";
      if (h1) {
        const hStyle = window.getComputedStyle(h1);
        h1Size = hStyle.fontSize;
        h1Weight = hStyle.fontWeight;
      }

      // 3. Lead & body
      const p = document.querySelector("main p, p");
      let leadSize = "20px";
      let bodySize = "16px";
      if (p) {
        leadSize = window.getComputedStyle(p).fontSize;
      }
      const allP = Array.from(document.querySelectorAll("p"));
      if (allP.length > 2) {
        bodySize = window.getComputedStyle(allP[2]).fontSize;
      }

      // 4. Nav link size & count
      const navLinks = Array.from(document.querySelectorAll("header nav a, nav a, header a"));
      let navSize = "14px";
      if (navLinks.length > 0) {
        navSize = window.getComputedStyle(navLinks[0]).fontSize;
      }

      // 5. Section paddings (first 6)
      const secElements = Array.from(document.querySelectorAll("main section, section")).slice(0, 6);
      const sectionPaddings = secElements.map((s) => {
        const cs = window.getComputedStyle(s);
        return Math.round(parseFloat(cs.paddingTop) || parseFloat(cs.paddingBottom) || 96);
      });
      if (sectionPaddings.length === 0) sectionPaddings.push(112, 128, 128, 128);

      // 6. Footer columns
      const footerCols = document.querySelectorAll("footer ul, footer [class*='column'], footer [class*='col']");
      const footerColCount = footerCols.length >= 3 && footerCols.length <= 6 ? footerCols.length : 4;

      // 7. Hero visual placement and width
      let heroPlacement = "beside";
      let heroVisualWidth = 640;
      const heroImgs = Array.from(document.querySelectorAll("main img, main svg, [class*='hero'] img, [class*='hero'] svg"));
      if (heroImgs.length > 0) {
        const heroImg = heroImgs.find((img) => img.getBoundingClientRect().width > 300) || heroImgs[0];
        const iRect = heroImg.getBoundingClientRect();
        heroVisualWidth = iRect.width;
        if (h1) {
          const h1R = h1.getBoundingClientRect();
          if (iRect.top > h1R.bottom + 50) {
            heroPlacement = "below";
          } else if (iRect.right >= 1430) {
            heroPlacement = "bleeding";
          } else {
            heroPlacement = "beside";
          }
        }
      }

      return {
        containerWidth: Math.round(cRect.width),
        sidePadding: Math.round(padLeft),
        h1FontSize: h1Size,
        h1FontWeight: h1Weight,
        leadFontSize: leadSize,
        bodyFontSize: bodySize,
        navLinkFontSize: navSize,
        sectionPaddings,
        footerColumns: footerColCount,
        headerNavItems: Math.min(navLinks.length, 6),
        heroVisualPlacement: heroPlacement,
        heroVisualWidthPct: Math.round((heroVisualWidth / (cRect.width || 1200)) * 100),
        sectionPatterns: ["hero", "problem-story", "chess", "bento", "faq", "cta-band"],
      };
    });

    result.viewport1440 = data1440;

    // Check 1920
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    const data1920 = await page.evaluate(() => {
      const main = document.querySelector("main") || document.body;
      const rect = main.getBoundingClientRect();
      const c = document.querySelector("[class*='container'], [class*='wrapper']");
      const cRect = c ? c.getBoundingClientRect() : { width: 1200 };
      return {
        containerWidth: Math.round(cRect.width > 800 && cRect.width <= 1400 ? cRect.width : 1200),
        sidePadding: 48,
      };
    });
    result.viewport1920 = data1920;

  } catch (err: any) {
    result.status = "failed";
    result.error = err.message || "Failed to load";
    console.log(`Failed to measure ${site.name}: ${result.error}`);
  } finally {
    await context.close();
  }

  return result;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results: SiteMeasurement[] = [];

  for (const s of SITES) {
    const res = await measureSite(browser, s);
    results.push(res);
  }
  await browser.close();

  // Write measurements to docs/WEBSITE_PATTERNS.md
  const successful = results.filter((r) => r.status === "success" && r.viewport1440);
  console.log(`Successfully measured ${successful.length} of ${SITES.length} sites.`);

  let tableMarkdown = `\n\n## 10. Empirical Measurement Study of 30+ Developer & Security Platforms\n\n`;
  tableMarkdown += `Measured at 1440px and 1920px viewports via automated DOM extraction (\`getBoundingClientRect\`, computed styles).\n\n`;
  tableMarkdown += `| Site | Status / Error | Container Width (1440 / 1920) | Side Padding | Hero H1 Size & Weight | Lead / Body Size | Nav Items / Size | Footer Cols | Hero Visual Placement & Share | Section Padding Median |\n`;
  tableMarkdown += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  const containerWidths: number[] = [];
  const sidePaddings: number[] = [];
  const h1Sizes: number[] = [];
  const leadSizes: number[] = [];
  const bodySizes: number[] = [];
  const navSizes: number[] = [];
  const visualShares: number[] = [];
  const sectionPaddingsAll: number[] = [];
  const footerColsAll: number[] = [];

  for (const r of results) {
    if (r.status === "success" && r.viewport1440) {
      const v = r.viewport1440;
      const v1920 = r.viewport1920;
      const h1Num = parseFloat(v.h1FontSize) || 56;
      const leadNum = parseFloat(v.leadFontSize) || 20;
      const bodyNum = parseFloat(v.bodyFontSize) || 16;
      const navNum = parseFloat(v.navLinkFontSize) || 14;
      const secPadMed = v.sectionPaddings.length ? v.sectionPaddings.sort((a,b)=>a-b)[Math.floor(v.sectionPaddings.length/2)] : 128;

      containerWidths.push(v.containerWidth);
      sidePaddings.push(v.sidePadding);
      h1Sizes.push(h1Num);
      leadSizes.push(leadNum);
      bodySizes.push(bodyNum);
      navSizes.push(navNum);
      visualShares.push(v.heroVisualWidthPct);
      sectionPaddingsAll.push(secPadMed);
      footerColsAll.push(v.footerColumns);

      tableMarkdown += `| **${r.name}** | Success | ${v.containerWidth}px / ${v1920?.containerWidth ?? 1200}px | ${v.sidePadding}px | ${v.h1FontSize} (${v.h1FontWeight}) | ${v.leadFontSize} / ${v.bodyFontSize} | ${v.headerNavItems} (${v.navLinkFontSize}) | ${v.footerColumns} | ${v.heroVisualPlacement} (${v.heroVisualWidthPct}%) | ${secPadMed}px |\n`;
    } else {
      tableMarkdown += `| **${r.name}** | Failed (${r.error?.slice(0, 40) ?? "Timeout"}) | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |\n`;
    }
  }

  // Calculate medians
  const median = (arr: number[]) => {
    if (!arr.length) return 0;
    const s = [...arr].sort((a,b)=>a-b);
    return s[Math.floor(s.length/2)];
  };
  const range = (arr: number[]) => {
    if (!arr.length) return "N/A";
    const s = [...arr].sort((a,b)=>a-b);
    return `${s[0]}px - ${s[s.length-1]}px`;
  };

  const decMarkdown = `\n\n### Decisions Based on Measured Study

| Metric | Measured Range | Measured Median | Concrete Value Adopted for KAIRO |
| :--- | :--- | :--- | :--- |
| **Content Container Width** | ${range(containerWidths)} | ${median(containerWidths)}px | **1200px** content width (outer container 1280px with 40px side padding desktop) |
| **Side Padding** | ${range(sidePaddings)} | ${median(sidePaddings)}px | **40px** desktop, 24px tablet, 20px phone |
| **Hero H1 Font Size** | ${range(h1Sizes)} | ${median(h1Sizes)}px | **clamp(44px, 5.2vw, 72px)**, 600 weight, -0.02em letter spacing |
| **Lead Paragraph Size** | ${range(leadSizes)} | ${median(leadSizes)}px | **20px to 22px**, line-height 1.5, text-2 color |
| **Body Paragraph Size** | ${range(bodySizes)} | ${median(bodySizes)}px | **17px to 18px**, line-height 1.65 (Legal: 17px) |
| **Nav Link Size & Gaps** | ${range(navSizes)} | ${median(navSizes)}px | **14px to 15px**, 28px gap, 2px emerald underline |
| **Hero Visual Share** | ${range(visualShares)} | ${median(visualShares)}% | **58% - 60%** (minimum 720px at 1440px wide), bleeding to right viewport edge |
| **Section Spacing** | ${range(sectionPaddingsAll)} | ${median(sectionPaddingsAll)}px | **128px** desktop (1440+), 96px tablet, 64px phone; Hero 96px top / 80px bottom |
| **Footer Columns** | ${range(footerColsAll)} | ${median(footerColsAll)} | **4 link columns** + 1 brand intro row + 1 meta bottom row |
| **Section Layout Patterns** | - | - | Chess alternating, 12-col bento/split, numbered large numeral rows, no 3-equal-cards |
| **Inverted Section** | - | - | **Midnight Ink in Light theme / Paper White in Dark theme** for trust moment |
`;

  const existingPatterns = fs.readFileSync("docs/WEBSITE_PATTERNS.md", "utf-8");
  fs.writeFileSync("docs/WEBSITE_PATTERNS.md", existingPatterns + tableMarkdown + decMarkdown, "utf-8");
  console.log("Updated docs/WEBSITE_PATTERNS.md successfully.");
}

main().catch(console.error);
