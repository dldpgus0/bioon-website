// Imports Stibee email HTML issues into the site.
//   node scripts/import-newsletters.mjs [newsletterDir]
// Reads "<newsletterDir>/Newsletter - KOR" and "<newsletterDir>/Newsletter - ENG", plus
// newsletter-src/ in this repo (web-only editions: the KO/EN welcome letter).
// - copies each issue's HTML to public/newsletters/<lang>/<slug>.html (web version)
// - writes src/content/insight.json with metadata parsed from the issue header
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const NEWSLETTER_DIR = process.argv[2] || "C:/Users/yaehy/OneDrive/Desktop/BIO.ON/newsletter";
const SOURCES = [
  path.join(NEWSLETTER_DIR, "Newsletter - KOR"),
  path.join(NEWSLETTER_DIR, "Newsletter - ENG"),
  path.join(ROOT, "newsletter-src"),
];
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
const files = SOURCES.flatMap((dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => /^BIO\.ON Insight .*\.html$/.test(f))
    .map((f) => path.join(dir, f)),
);
for (const sourcePath of files) {
  const file = path.basename(sourcePath);
  const html = fs.readFileSync(sourcePath, "utf8");
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
  issues.push({
    lang,
    originalNumber: Number(label.match(/#(\d+)/)[1]),
    number: 0,
    date,
    slug: welcome ? "welcome" : date,
    title: lines[h + 1],
    summary: lines[h - 1] || "",
    tags,
    sourceFile: file,
    sourcePath,
  });
}

// Slug by date so ko/en editions of the same week pair up. The welcome letter always comes first.
const isWelcome = (i) => i.slug === "welcome";
issues.sort((a, b) => isWelcome(b) - isWelcome(a) || a.date.localeCompare(b.date) || a.lang.localeCompare(b.lang));

// Weekly issues are numbered by publish date (#1, #2, …) per language, matching the source
// files. The welcome letter is unnumbered (number 0). Old numbers used by more than one
// issue are ambiguous and left out of the old→new map used for cross-references.
const renumber = {};
for (const lang of ["ko", "en"]) {
  const list = issues.filter((i) => i.lang === lang && !isWelcome(i));
  const counts = {};
  for (const it of list) counts[it.originalNumber] = (counts[it.originalNumber] ?? 0) + 1;
  renumber[lang] = {};
  list.forEach((it, idx) => {
    it.number = idx + 1;
    if (counts[it.originalNumber] === 1) renumber[lang][it.originalNumber] = it.number;
  });
}

// Rewrites the header ("Insight #N") and in-body references ("#14에서 다룬", "covered in #14")
// in the web copy. Only text between tags is touched, so colours like "#197f83" are safe.
// Source files are never modified.
const HEADER = /(Insight\s*(?:EN\s*)?#)\d+/g;
const REFERENCE = /(?<![&\w#])#(\d{1,2})(?![\w])/g;
function rewriteNumbers(html, it) {
  if (isWelcome(it)) return html;
  return html
    .split(/(<[^>]*>)/)
    .map((part) => {
      if (part.startsWith("<")) return part;
      // Mark headers first so the reference pass leaves them alone.
      const marked = part.replace(HEADER, (m, prefix) => `${prefix}\u0000`);
      return marked
        .replace(REFERENCE, (match, n) => {
          const mapped = renumber[it.lang][n];
          if (mapped === undefined) console.warn(`unmapped reference ${match} in ${it.sourceFile}`);
          return mapped === undefined ? match : `#${mapped}`;
        })
        .replace(/\u0000/g, String(it.number));
    })
    .join("");
}

// Every web copy ends with a link back to the site's archive, just above the © line. Issues
// whose source already has it (from #19 on) are left as they are.
const WEB_LINK = {
  ko: "🌐 웹에서 보기 · 지난 호 아카이브 →",
  en: "🌐 Read on the web · past issues archive →",
};
const FONT = "font-family: 'Pretendard', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif";
function addWebLink(html, lang) {
  if (html.includes("bioon-website.vercel.app\"") || html.includes(WEB_LINK[lang])) return html;
  const line =
    `<p style="font-size: 11px; color: #7FD2D5 !important; line-height: 1.65; margin: 0 0 10px 0;; ${FONT}">${WEB_LINK[lang]} ` +
    `<a href="https://bioon-website.vercel.app/${lang}" style="color: #BFE3E4 !important; font-weight: 700; text-decoration: underline;; ${FONT}">bioon-website.vercel.app</a></p>`;
  const copyright = /<p\b[^>]*>\s*©\s*\d{4} BIO:ON Insight/;
  if (!copyright.test(html)) {
    console.warn(`no © line to place the web link above (${lang})`);
    return html;
  }
  return html.replace(copyright, (m) => line + m);
}

fs.rmSync(OUT_HTML, { recursive: true, force: true });
for (const lang of ["ko", "en"]) fs.mkdirSync(path.join(OUT_HTML, lang), { recursive: true });
for (const it of issues) {
  const html = fs.readFileSync(it.sourcePath, "utf8");
  fs.writeFileSync(path.join(OUT_HTML, it.lang, `${it.slug}.html`), addWebLink(rewriteNumbers(html, it), it.lang));
  if (it.number !== it.originalNumber && !isWelcome(it)) console.log(`${it.lang} ${it.date}: #${it.originalNumber} → #${it.number}`);
}

// sourcePath is a local machine path; keep it out of the committed JSON.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicIssues = issues.map(({ sourcePath, ...it }) => it);
fs.writeFileSync(OUT_JSON, JSON.stringify(publicIssues, null, 2) + "\n");
console.log(`imported ${issues.length} issues → ${path.relative(ROOT, OUT_JSON)}`);
