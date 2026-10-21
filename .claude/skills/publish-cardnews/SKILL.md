---
name: publish-cardnews
description: Add a BIO:ON Instagram card news episode to the website's card news page (/ko/cardnews). Use whenever the owner shares card news HTML files (cover.html, body1.html … cta.html, a zipped episode folder, or one HTML with several cards) or asks to upload/add card news to the site.
---

# Publish a card news episode

The owner makes Instagram card news (4:5, 1080×1350 cards, one HTML file per card) and sends the HTML here after posting. The site shows each episode as a swipeable carousel of images at `/ko|en/cardnews/<slug>`. Reply in Korean.

## 1. Get the files into one folder

- Unzip each upload into its own new scratch folder. The owner's zips so far look like this:
  - `ko/cards/*.html` + `ko/verify/*.png`: the Korean episode
  - `en/cards/*.html` + `en/verify/*.png`: the English version of the same episode
  - `terms/cards/*.html` + `terms/verify/*.png` (no cover): a bilingual "용어 · TERM No. NN" mini-series, published as its own episode
- `verify/<card>.png` are the owner's own renders. The script uses them as-is, so the shared CSS and background images (`../../../../assets/…`) don't need to be uploaded.
- Only if there are no `verify/` PNGs does the script screenshot the HTML. Then every `<link>`, `<img>` and `url()` path must resolve; if files are missing, ask the owner for them (or the whole folder) instead of recreating their CSS.

## 2. Import

```
# Korean (main entry)
node scripts/import-cardnews.mjs <folder>/ko --slug <YYYY-MM-DD-short-english-topic> --date <YYYY-MM-DD> \
  --title "<Korean title>" --summary "<one Korean sentence>" --tags "태그1,태그2" [--issue <insight slug>] [--instagram <post URL>]
# English cards, if there are any (adds to the same entry)
node scripts/import-cardnews.mjs <folder>/en --slug <same slug> --lang en --title "…" --summary "…" --tags "…"
# Bilingual terms episode
node scripts/import-cardnews.mjs <folder>/terms --slug <YYYY-MM-DD-term-…> --date … --bilingual true --title "용어 No.NN …" …
```

- What the script does:
  - Orders the cards cover → body1…N → cta.
  - Saves each card as WebP (~55 KB instead of ~600 KB PNG) to `public/cardnews/<slug>/NN.webp` (`en-NN.webp` for English), plus `og.jpg` / `en-og.jpg` of the first card for link previews.
  - Uses each card's text as alt text, and writes the entry to `src/content/cardnews.json`. Re-running with the same slug and language replaces those cards.
- For a bilingual terms episode, add an English title/summary/tags by hand as `"en": { "title", "summary", "tags" }` (no `cards`): the English page then reuses the bilingual cards.
- Take titles and summaries from the cards themselves (cover headline, main point). Don't add facts that aren't on the cards.
- `--issue`: the newsletter issue the episode is based on (its date slug), so the page links to it.

## 3. Check, then ship

- Open 2–3 of the generated JPGs and confirm fonts, background images and text all look right, with nothing cut off.
- `npm run lint` and `npm run build` pass. Under `next start`, `/ko/cardnews`, `/en/cardnews` and `/ko|en/cardnews/<slug>` return 200, and the English page shows English cards when they exist.
- Commit, push, open a PR to `main` and merge it (the owner has approved merging these), then sync the branch.

## 4. Report (short, in Korean)

- Title, number of cards, and the live URL `https://bioon-website.vercel.app/ko/cardnews/<slug>`
- Anything that looked off in the renders, or files that were missing
