// Adds one Instagram card news episode (one language) to the card news page.
//   node scripts/import-cardnews.mjs <folder-or-html...> --slug <slug> [--lang ko|en] [--date YYYY-MM-DD]
//        [--title "..."] [--summary "..."] [--tags "a,b"] [--issue 2026-10-13] [--instagram URL]
//        [--bilingual true]   (cards carry both languages, e.g. the terms series)
// Input is the card HTML as made for Instagram: one file per card (cover.html, body1.html … cta.html),
// or one file holding several `.card` elements. If the folder has the owner's own renders in
// `verify/<card>.png`, those are used as-is; otherwise each card is screenshotted at 1080×1350
// (its linked CSS and images must then sit next to the HTML at the paths it uses).
// Images are saved as WebP to public/cardnews/<slug>/[en-]NN.webp, and each card's text becomes its
// alt text. --lang ko (default) writes the main entry; --lang en adds the English version to an
// existing entry. Re-running with the same slug and language replaces those cards.
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 1080;
const H = 1350;
const WEBP = { quality: 82 };

const args = process.argv.slice(2);
const opts = {};
const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) opts[args[i].slice(2)] = args[++i];
  else inputs.push(args[i]);
}
const lang = opts.lang ?? "ko";
if (!inputs.length || !opts.slug || !["ko", "en"].includes(lang)) {
  console.error("usage: node scripts/import-cardnews.mjs <folder-or-html...> --slug <slug> [--lang ko|en] [--date …]");
  process.exit(1);
}
const slug = opts.slug;
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`slug must be lowercase letters, numbers and dashes: ${slug}`);
  process.exit(1);
}

// Card order: cover, then body/numbered cards in number order, then cta; anything else alphabetically.
function rank(file) {
  const n = path.basename(file, ".html").toLowerCase();
  if (/cover/.test(n)) return [0, 0, n];
  if (/cta|outro|end/.test(n)) return [2, 0, n];
  const m = n.match(/(\d+)(?!.*\d)/);
  return [1, m ? Number(m[1]) : 0, n];
}
function listHtml(p) {
  if (fs.statSync(p).isFile()) return [p];
  const dir = fs.existsSync(path.join(p, "cards")) ? path.join(p, "cards") : p;
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join(dir, f));
}
const files = inputs.flatMap(listHtml).sort((a, b) => {
  const [x, y] = [rank(a), rank(b)];
  return x[0] - y[0] || x[1] - y[1] || x[2].localeCompare(y[2]);
});

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const g = execSync("npm root -g").toString().trim();
    return await import(pathToFileURL(path.join(g, "playwright", "index.mjs")).href);
  }
}
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const missing = new Set();
page.on("requestfailed", (r) => missing.add(r.url()));
page.on("response", (r) => r.status() >= 400 && missing.add(r.url()));

const outDir = path.join(ROOT, "public", "cardnews", slug);
const prefix = lang === "en" ? "en-" : "";
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (lang === "en" ? f.startsWith("en-") : !f.startsWith("en-")) fs.rmSync(path.join(outDir, f));

// Card text for alt text, minus page numbers, the brand line and dot strips.
const cleanText = (text) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^[\d/\s]+$/.test(l) && !/^(BIO:ON|INSIGHT|BIO:ON INSIGHT)$/i.test(l))
    .join("\n");

const cards = [];
let usedRenders = 0;
// The first card also goes out as a JPEG for link previews (LinkedIn and others don't read WebP).
const og = path.join(outDir, `${prefix}og.jpg`);
for (const file of files) {
  const render = path.join(path.dirname(path.dirname(file)), "verify", path.basename(file, ".html") + ".png");
  await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: "networkidle" });
  const els = await page.$$(".card");
  const shots = els.length ? els : [null];
  for (const el of shots) {
    const n = String(cards.length + 1).padStart(2, "0");
    const out = path.join(outDir, `${prefix}${n}.webp`);
    if (shots.length === 1 && fs.existsSync(render)) {
      await sharp(render).resize(W, H, { fit: "cover" }).webp(WEBP).toFile(out);
      usedRenders++;
    } else {
      const png = el ? await el.screenshot({ type: "png" }) : await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: W, height: H } });
      await sharp(png).webp(WEBP).toFile(out);
    }
    const text = el ? await el.innerText() : await page.innerText("body");
    if (!cards.length) await sharp(out).jpeg({ quality: 80, mozjpeg: true }).toFile(og);
    cards.push({ src: `/cardnews/${slug}/${prefix}${n}.webp`, alt: cleanText(text) });
  }
}
await browser.close();

const jsonPath = path.join(ROOT, "src", "content", "cardnews.json");
const list = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const i = list.findIndex((c) => c.slug === slug);
const old = i >= 0 ? list[i] : undefined;
const tags = opts.tags ? opts.tags.split(",").map((t) => t.trim()) : undefined;

let entry;
if (lang === "ko") {
  entry = {
    slug,
    date: opts.date ?? old?.date ?? new Date().toISOString().slice(0, 10),
    title: opts.title ?? old?.title ?? cards[0]?.alt.split("\n").slice(0, 3).join(" ") ?? slug,
    summary: opts.summary ?? old?.summary ?? "",
    tags: tags ?? old?.tags ?? [],
    cards,
    ...((opts.issue ?? old?.issue) && { issue: opts.issue ?? old.issue }),
    ...((opts.instagram ?? old?.instagram) && { instagram: opts.instagram ?? old.instagram }),
    ...(old?.en && { en: old.en }),
    ...(opts.bilingual === "true" && { bilingual: true }),
  };
} else {
  if (!old) {
    console.error(`import the Korean version of ${slug} first`);
    process.exit(1);
  }
  entry = {
    ...old,
    en: {
      title: opts.title ?? old.en?.title ?? cards[0]?.alt.split("\n").slice(0, 3).join(" "),
      summary: opts.summary ?? old.en?.summary ?? "",
      tags: tags ?? old.en?.tags ?? [],
      cards,
    },
  };
}
if (i >= 0) list[i] = entry;
else list.push(entry);
// Newest first; episodes with the same date keep the order they were added in.
list.sort((a, b) => b.date.localeCompare(a.date));
fs.writeFileSync(jsonPath, JSON.stringify(list, null, 2) + "\n");

const kb = fs
  .readdirSync(outDir)
  .filter((f) => (lang === "en") === f.startsWith("en-") && f.endsWith(".webp"))
  .reduce((s, f) => s + fs.statSync(path.join(outDir, f)).size, 0);
console.log(`${slug} (${lang}): ${cards.length} cards, ${usedRenders} from verify/ renders, ${Math.round(kb / 1024)} KB → public/cardnews/${slug}/`);
if (missing.size && usedRenders < cards.length) {
  console.warn("missing files (upload them too, or the screenshotted cards will look wrong):");
  for (const u of missing) console.warn("  " + u);
}
