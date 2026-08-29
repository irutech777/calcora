// Generates public/sitemap.xml from the calculator registry so every
// calculator, category and static page has a discoverable, canonical URL.
// Run with: npm run generate-sitemap (also runs automatically after build).
import { writeFileSync } from "node:fs";
import { CALCULATORS } from "../src/data/calculatorConfig.js";
import { CATEGORY_LIST } from "../src/data/categories.js";

const SITE_URL = "https://calcora.com";

const staticPaths = ["/", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"];
const categoryPaths = CATEGORY_LIST.map((c) => `/${c.slug}`);
const calculatorPaths = CALCULATORS.map((c) => `/calculators/${c.slug}`);

const urls = [...staticPaths, ...categoryPaths, ...calculatorPaths];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
