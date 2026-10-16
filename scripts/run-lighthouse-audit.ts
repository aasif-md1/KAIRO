import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const PAGES = [
  { name: "home", url: "http://localhost:3001" },
  { name: "security", url: "http://localhost:3001/security" },
];

async function run() {
  const results: Record<string, any> = {};

  for (const p of PAGES) {
    const tmpOut = path.resolve(__dirname, `../docs/lighthouse-${p.name}.json`);
    console.log(`Auditing ${p.name} with Lighthouse...`);
    try {
      execSync(
        `npx -y lighthouse ${p.url} --output=json --output-path=${tmpOut} --chrome-flags="--headless=new" --form-factor=mobile --quiet`,
        { stdio: "inherit" }
      );
      if (fs.existsSync(tmpOut)) {
        const data = JSON.parse(fs.readFileSync(tmpOut, "utf-8"));
        const cats = data.categories;
        results[p.name] = {
          performance: Math.round((cats.performance?.score || 0) * 100),
          accessibility: Math.round((cats.accessibility?.score || 0) * 100),
          bestPractices: Math.round((cats["best-practices"]?.score || 0) * 100),
          seo: Math.round((cats.seo?.score || 0) * 100),
        };
        console.log(`Scores for ${p.name}:`, results[p.name]);
      }
    } catch (e: any) {
      console.error(`Error auditing ${p.name}:`, e.message);
    }
  }

  console.log("\n--- LIGHTHOUSE RESULTS SUMMARY ---");
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);
