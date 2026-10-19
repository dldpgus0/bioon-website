---
name: publish-cardnews
description: Add a BIO:ON Instagram card news episode to the website's card news page (/ko/cardnews). Use whenever the owner shares card news HTML files (cover.html, body1.html … cta.html, a zipped episode folder, or one HTML with several cards) or asks to upload/add card news to the site.
---

# Publish a card news episode

The owner makes Instagram card news (4:5, 1080×1350 cards, one HTML file per card) and sends the HTML here after posting. The site shows each episode as a swipeable carousel of images at `/ko|en/cardnews/<slug>`. Reply in Korean.

## 1. Get the files into one folder

- Put the upload in a new scratch folder, e.g. `<scratchpad>/cardnews/<YYMMDD_주제>/`, keeping the folder layout the cards expect.
- Cards usually link shared files by relative path (e.g. `../../../assets/style.css`, `bg-*.jpg`, the logo). Check every `<link>`, `<img>` and `url()` path first. If a file wasn't uploaded, the cards render without styling: ask the owner to send it (or the whole episode folder as a zip) before importing. Don't recreate their CSS.

## 2. Import

```
node scripts/import-cardnews.mjs <episode-folder> --slug <YYYY-MM-DD-short-english-topic> --date <YYYY-MM-DD> \
  --title "<Korean title>" --summary "<one Korean sentence>" --tags "태그1,태그2" [--issue <insight slug>] [--instagram <post URL>]
```

- What the script does:
  - Reads `cards/` (or the folder itself) and orders the files cover → body1…N → cta.
  - Screenshots each card at 1080×1350 to `public/cardnews/<slug>/NN.jpg` and uses each card's text as alt text.
  - Writes the entry to `src/content/cardnews.json`. Re-running with the same slug replaces the episode.
- At the end it lists any files it couldn't load. If it does, stop and get those files; don't ship broken cards.
- Take the title and summary from the cards themselves (the cover headline and the main point). Don't add facts that aren't on the cards.
- `--issue`: if the episode is based on a newsletter issue, pass that issue's slug (its date) so the page links to it.
- `--instagram`: the post URL, if the owner gives it.

## 3. Check, then ship

- Open 2–3 of the generated JPGs and confirm fonts, background images and text all look right, with nothing cut off.
- `npm run lint` and `npm run build` pass. Under `next start`, `/ko/cardnews`, `/en/cardnews` and `/ko|en/cardnews/<slug>` return 200.
- Commit, push, open a PR to `main` and merge it (the owner has approved merging these), then sync the branch.

## 4. Report (short, in Korean)

- Title, number of cards, and the live URL `https://bioon-website.vercel.app/ko/cardnews/<slug>`
- Anything that looked off in the renders, or files that were missing
