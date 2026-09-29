// Imports a flashcard deck exported from the study tool into the site.
//   node scripts/import-flashcards.mjs <deck.json>
// Writes src/content/flashcards.json. Personal study notes that only make sense to the author
// ("confirm against the slides", "narration", "the quiz was broken", "covered later in Part 1")
// are stripped, so the public page shows definitions and examples only.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/import-flashcards.mjs <deck.json>");
  process.exit(1);
}
const deck = JSON.parse(fs.readFileSync(src, "utf8"));

const NOTE = /(narration|quiz|confirm against|module intro|covered later|covered in detail in week)/i;

function clean(text = "") {
  let s = text
    // Parentheticals that are notes to self, e.g. "(narration)".
    .replace(/\s*\([^()]*\)/g, (m) => (NOTE.test(m) ? "" : m))
    // Sentences or clauses that are notes to self.
    .split(/(?<=[.;])\s+/)
    .filter((part) => !NOTE.test(part))
    .join(" ")
    .replace(/^Lecture:\s*/i, "")
    .replace(/[;\s]+$/, "")
    .trim();
  if (s && !/[.!?)%]$/.test(s)) s += ".";
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}

const cards = deck.cards.map((c) => ({
  id: c.id,
  term: c.term,
  definition: clean(c.definition),
  example: clean(c.example),
  module: c.module,
  source: c.source,
  tags: c.tags,
}));

const out = { updated: deck.updated, cards };
fs.writeFileSync(path.join(ROOT, "src", "content", "flashcards.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`imported ${cards.length} cards → src/content/flashcards.json`);
for (const c of deck.cards) {
  const a = [c.definition, c.example].join(" | ");
  const b = [clean(c.definition), clean(c.example)].join(" | ");
  if (a.trim() !== b.trim() && NOTE.test(a)) console.log(`  cleaned: ${c.id}`);
}
