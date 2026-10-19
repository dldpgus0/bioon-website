// Renders one Instagram card news episode to images and adds it to the card news page.
//   node scripts/import-cardnews.mjs <folder-or-html...> [--slug 2610-topic] [--date YYYY-MM-DD]
//        [--title "..."] [--summary "..."] [--tags "a,b"] [--issue 2026-10-13] [--instagram URL]
// Input is the card HTML as made for Instagram: one file per card (cover.html, body1.html … cta.html),
// or one file holding several `.card` elements. Linked CSS and images must sit next to the HTML at the
// paths it uses. Each card is screenshotted at 1080×1350 to public/cardnews/<slug>/NN.jpg, and its text
// becomes the image's alt text. Re-running with the same slug replaces that episode.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1080;
const H = 1350;

const args = process.argv.slice(2);
const opts = {};
const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) opts[args[i].slice(2)] = args[++i];
  else inputs.push(args[i]);
}
if (!inputs.length) {
  console.error("usage: node scripts/import-cardnews.mjs <folder-or-html...> [--slug …] [--date …]");
  process.exit(1);
}

// Card order: cover, then body/numbered cards in number order, then cta; anything else alphabetically.
function rank(file) {
  const n = path.basename(file, ".html").toLowerCase();
  if (/cover/.test(n)) return [0, 0];
  if (/cta|outro|end/.test(n)) return [2, 0];
  const m = n.match(/(\d+)(?!.*\d)/);
  return [1, m ? Number(m[1]) : 0, n];
}
function listHtml(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return [p];
  const dir = fs.existsSync(path.join(p, "cards")) ? path.join(p, "cards") : p;
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join(dir, f));
}
const files = inputs
  .flatMap(listHtml)
  .sort((a, b) => {
    const [x, y] = [rank(a), rank(b)];
    return x[0] - y[0] || x[1] - y[1] || String(x[2] ?? "").localeCompare(String(y[2] ?? ""));
  });

// Slug and date default from an episode folder named like 261020_주제.
const base = path.basename(path.resolve(inputs[0]).replace(/\/cards\/?$/, "")).replace(/\.html$/, "");
const m = base.match(/^(\d{2})(\d{2})(\d{2})/);
const date = opts.date ?? (m ? `20${m[1]}-${m[2]}-${m[3]}` : new Date().toISOString().slice(0, 10));
const slug = opts.slug ?? (m ? `${date}` : base.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`slug must be lowercase letters, numbers and dashes: ${slug} (pass --slug)`);
  process.exit(1);
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const g = execSync("npm root -g").toString().trim();
    return await import(pathToFileURL(path.join(g, "playwright", "index.mjs")).href);
  }
}
const { chromium } = await loadPlaywright();
const exe = ["/opt/pw-browsers/chromium/chrome-linux/chrome", "/opt/pw-browsers/chromium"].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const missing = new Set();
page.on("requestfailed", (r) => missing.add(r.url()));
page.on("response", (r) => r.status() >= 400 && missing.add(r.url()));

const outDir = path.join(ROOT, "public", "cardnews", slug);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const cards = [];
for (const file of files) {
  await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const els = await page.$$(".card");
  const shots = els.length ? els : [null];
  for (const el of shots) {
    const n = String(cards.length + 1).padStart(2, "0");
    const out = path.join(outDir, `${n}.jpg`);
    if (el) await el.screenshot({ path: out, type: "jpeg", quality: 85 });
    else await page.screenshot({ path: out, type: "jpeg", quality: 85, clip: { x: 0, y: 0, width: W, height: H } });
    const text = el ? await el.innerText() : await page.innerText("body");
    // Drop page numbers like "01 / 09" and collapse whitespace for alt text.
    const alt = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !/^\d{1,2}\s*\/\s*\d{1,2}$/.test(l))
      .join("\n");
    cards.push({ src: `/cardnews/${slug}/${n}.jpg`, alt });
  }
}
await browser.close();

const jsonPath = path.join(ROOT, "src", "content", "cardnews.json");
const list = JSON.parse(fs.readFileSync(jsonPath, "utf8")).filter((c) => c.slug !== slug);
const old = JSON.parse(fs.readFileSync(jsonPath, "utf8")).find((c) => c.slug === slug) ?? {};
const entry = {
  slug,
  date,
  title: opts.title ?? old.title ?? cards[0]?.alt.split("\n").slice(0, 3).join(" ") ?? slug,
  summary: opts.summary ?? old.summary ?? "",
  tags: opts.tags ? opts.tags.split(",").map((t) => t.trim()) : (old.tags ?? []),
  cards,
  ...((opts.issue ?? old.issue) && { issue: opts.issue ?? old.issue }),
  ...((opts.instagram ?? old.instagram) && { instagram: opts.instagram ?? old.instagram }),
};
list.push(entry);
list.sort((a, b) => b.date.localeCompare(a.date));
fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2) + "\n");

console.log(`${slug}: ${cards.length} cards → public/cardnews/${slug}/`);
if (missing.size) {
  console.warn("missing files (upload them too, or the cards will look wrong):");
  for (const u of missing) console.warn("  " + u);
}
