// Imports Stibee email HTML issues into the site.
//   node scripts/import-newsletters.mjs [sourceDir ...]
// Default sources: the local newsletter template folder, plus newsletter-src/ in this repo
// (web-only editions such as the English translations of issues #1–#10, and the welcome letter).
// - copies each issue's HTML to public/newsletters/<lang>/<slug>.html (web version)
// - writes src/content/insight.json with metadata parsed from the issue header
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCES = process.argv.length > 2
  ? process.argv.slice(2)
  : ["C:/Users/yaehy/OneDrive/Desktop/BIO.ON/newsletter/template", path.join(ROOT, "newsletter-src")];
// The output folder is wiped below, so a missing source would silently drop its issues.
for (const dir of SOURCES) {
  if (!fs.existsSync(dir)) {
    console.error(`source folder not found: ${dir}`);
    process.exit(1);
  }
}
const OUT_HTML = path.join(ROOT, "public", "newsletters");
const OUT_JSON = path.join(ROOT, "src", "content", "insight.json");

const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

function toLines(html) {
  return html
    .replace(/base64,[A-Za-z0-9+/=]*/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?(span|strong|b|em|i|a)(\s[^>]*)?>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&#847;|&zwnj;|&#8203;|[\u034f\u200b\u200c]/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function parseDate(raw) {
  let m = raw.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = raw.match(/([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/);
  if (m) return `${m[3]}-${String(MONTHS[m[1]]).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  return null;
}

const issues = [];
const sourcePath = {};
for (const [dir, file] of SOURCES.flatMap((d) => fs.readdirSync(d).map((f) => [d, f]))) {
  if (!/^BIO\.ON Insight .*\.html$/.test(file)) continue;
  sourcePath[file] = path.join(dir, file);
  const html = fs.readFileSync(sourcePath[file], "utf8");
  const lines = toLines(html);
  const h = lines.findIndex((l) => /Insight\s*(EN\s*)?#\d+\s*·/.test(l));
  if (h < 0) {
    console.warn(`skip (no header): ${file}`);
    continue;
  }
  const [label, dateRaw, ...rest] = lines[h].split("·").map((s) => s.trim());
  const lang = /EN\s*#/.test(label) ? "en" : "ko";
  const date = parseDate(dateRaw);
  // The welcome letter shares its date with the first issue, so it gets its own slug.
  const welcome = /Welcome\.html$/.test(file);
  const tags = rest
    .join("·")
    .split(/[·,]/)
    .map((t) => t.trim())
    .filter((t) => t && !/^\d+\/\d+~/.test(t));
  const issues_ = {
    lang,
    originalNumber: Number(label.match(/#(\d+)/)[1]),
    number: 0,
    date,
    slug: welcome ? "welcome" : date,
    title: lines[h + 1],
    summary: lines[h - 1] || "",
    tags,
    sourceFile: file,
  };
  issues.push(issues_);
}

// Slug by date so ko/en editions of the same week pair up. The welcome letter is always #1.
const isWelcome = (i) => i.slug === "welcome";
issues.sort((a, b) => isWelcome(b) - isWelcome(a) || a.date.localeCompare(b.date) || a.lang.localeCompare(b.lang));

// The source files have duplicate/missing numbers, so each language is renumbered by
// publish date (#1, #2, …). Old numbers used by more than one issue are ambiguous and
// left out of the old→new map used for cross-references.
const renumber = {};
for (const lang of ["ko", "en"]) {
  const list = issues.filter((i) => i.lang === lang);
  const counts = {};
  for (const it of list) counts[it.originalNumber] = (counts[it.originalNumber] ?? 0) + 1;
  renumber[lang] = {};
  list.forEach((it, idx) => {
    it.number = idx + 1;
    if (counts[it.originalNumber] === 1) renumber[lang][it.originalNumber] = it.number;
  });
}

// Rewrites the header ("Insight #N") and in-body references ("#14에서 다룬", "#14·#15")
// in the web copy. Source files are never modified.
function rewriteNumbers(html, it) {
  return html
    .replace(/(Insight\s*(?:EN\s*)?#)\d+/g, `$1${it.number}`)
    .replace(/(?<![&\w])#(\d{1,2})(?=·|에)/g, (match, n) => {
      const mapped = renumber[it.lang][n];
      if (mapped === undefined) console.warn(`unmapped reference ${match} in ${it.sourceFile}`);
      return mapped === undefined ? match : `#${mapped}`;
    });
}

fs.rmSync(OUT_HTML, { recursive: true, force: true });
for (const lang of ["ko", "en"]) fs.mkdirSync(path.join(OUT_HTML, lang), { recursive: true });
for (const it of issues) {
  const html = fs.readFileSync(sourcePath[it.sourceFile], "utf8");
  fs.writeFileSync(path.join(OUT_HTML, it.lang, `${it.slug}.html`), rewriteNumbers(html, it));
  if (it.number !== it.originalNumber) console.log(`${it.lang} ${it.date}: #${it.originalNumber} → #${it.number}`);
}

fs.writeFileSync(OUT_JSON, JSON.stringify(issues, null, 2) + "\n");
console.log(`imported ${issues.length} issues → ${path.relative(ROOT, OUT_JSON)}`);
