---
name: publish-issue
description: Publish a new BIO:ON Insight newsletter issue to the website and write its LinkedIn post. Use whenever the owner shares new KO/EN newsletter HTML files (e.g. "BIO.ON_Insight_KO_20.html") or asks to upload/add a new issue, update the site with this week's newsletter, or write the LinkedIn post for an issue.
---

# Publish a BIO:ON Insight issue

The owner sends the Korean and English Stibee HTML for one issue. Do all of part A, then give everything in part B. Reply in Korean.

## A. Add the issue to the website

Work on the session's designated branch, restarted from the latest `origin/main`.

1. **Import with the existing script.** `scripts/import-newsletters.mjs` rebuilds every issue from a folder, so build a temporary folder from what's already published plus the new files:
   - For each entry in `src/content/insight.json` except `welcome`, copy `public/newsletters/<lang>/<slug>.html` to `<tmp>/Newsletter - KOR/` (ko) or `<tmp>/Newsletter - ENG/` (en), named by its `sourceFile`.
   - Copy the new files in as `BIO.ON Insight KO #<n>.html` and `BIO.ON Insight EN #<n>.html`.
   - Numbering: the welcome letter is unnumbered ("웰컴 레터"); weekly issues are #1, #2, … by date (2026-10-06 is #19). The script numbers issues by date and rewrites the header and in-text references ("#15에서 다룬", "covered in #15") to match. It also adds the "🌐 웹에서 보기 · 지난 호 아카이브" / "Read on the web" archive link above the © line when an issue doesn't already have it. If the new file's own header number doesn't match its position, tell the owner so their Stibee numbering stays in step.
   - Run `node scripts/import-newsletters.mjs <tmp>`.
   - Diff `insight.json` against the old copy: earlier entries must be unchanged and the only new files must be the two new issue HTMLs. If anything else changed, stop and find out why.
2. **`src/content/insight-ai.json`**, keyed by the issue slug (its date), in the same shape as earlier entries:
   - `topics` and `roles`: ids from `src/content/taxonomy.json`.
   - `summary.ko` / `summary.en`: one line per story (3), with the key number.
   - `questions.ko` / `questions.en`: 3 questions a reader might ask.
   - `keywords`: KO and EN company, drug and concept names.
3. **`src/content/wiki.json`**:
   - Add `stories[<slug>]`: the issue's three stories, each with `cat` (`fda` / `clinical` / `market` / `pipeline`), a short `ko` and `en` headline, and `entities`.
   - Add any new companies, drugs or regulators to `entities` (`type`, `ko`, `en`). Reuse existing ids. Only tag entities a story is actually about.
4. **Facts come only from the issue itself.** Don't add numbers or claims that aren't in the newsletter.
5. **Check, then ship.**
   - `npm run lint` and `npm run build` pass.
   - Under `next start`, these return 200: `/ko|en/insight/<slug>`, `/newsletters/ko/<slug>.html`, every new `/ko|en/wiki/<entity>`, and the home page shows the new issue.
   - Commit, push, open a PR to `main` and merge it (the owner has approved merging these), then sync the branch.

## B. Give the owner, in this order

### 1. LinkedIn post for the BIO:ON Insight company page (KO and EN)

Use the brand voice: no "I", no "제 생각". Korean uses formal 습니다. Keep this exact structure and length:

```
<the issue's one-line theme>

BIO:ON Insight <n>호
1️⃣ <story 1: who, what, the key number>
2️⃣ <story 2>
3️⃣ <story 3>

이번 주 포인트: <one sentence on what the three stories mean together>

👉 <n>호 전체 읽기 (한/영)
뉴스별 핵심 사실과 쉬운 해설, 한국 시장에 주는 의미, 관련 직무까지 출처와 함께 정리했습니다. <one sentence naming this issue's Word of the Week and deep dive>
https://bioon-website.vercel.app/ko/insight/<slug>

#바이오 #제약 <2–3 hashtags for this issue>
```

```
<one-line theme in English>

BIO:ON Insight #<n>
1️⃣ <story 1>
2️⃣ <story 2>
3️⃣ <story 3>

This week's takeaway: <one sentence>

👉 Read the full issue (KO/EN)
Key facts, plain-English breakdowns, what each story means for Korea and which roles it matters for, all with sources. <one sentence naming this issue's Word of the Week and deep dive>
https://bioon-website.vercel.app/en/insight/<slug>

#Biotech #Pharma <2–3 hashtags for this issue>
```

Rules for the post:
- Each story line fits on one line.
- Write "전체 읽기", not "전문".
- Only mention the Word of the Week and the deep dive if the issue has them.

### 2. Personal repost comment (KO and EN, one line each)

The owner reposts from their own profile with "Repost with your thoughts". Write one first-person line that introduces the issue as "the newsletter I write" (제가 매주 쓰는 뉴스레터) and names the issue's angle, ending with 👇.

### 3. Email subject lines for Stibee

```
[주간 바이오·제약 브리핑 #<n>] <topic> · <topic> · <topic>
[Weekly Biotech & Pharma Brief #<n>] <topic> · <topic> · <topic>
```

Each topic is 2–3 words. Put the most eye-catching one first. The sender name stays "BIO:ON Insight".

### 4. Short report

- What changed on the site, with the PR link.
- The live URL `https://bioon-website.vercel.app/ko/insight/<slug>`.
- Anything from the issue you couldn't place, such as an unclear entity.
