---
name: weekly-content
description: Make next week's BIO:ON content in one run. It writes the BIO:ON Insight newsletter (KO/EN), builds 2 card news episodes and 3 short videos (Reels/Shorts) in KO and EN, and puts everything in a review page for the owner. Use when the owner says "/weekly-content", "이번 주 콘텐츠 만들어줘", "다음 주 거 준비해줘" or similar.
---

# Weekly content: newsletter + card news + short videos

Reply in Korean. This skill only **makes** content. It never posts or schedules anything; that's the `schedule-posts` skill, which runs only after the owner has reviewed everything.

## Settings (the owner can change these)

- **Newsletter:** BIO:ON Insight, one KO and one EN issue a week, sent Tuesday 08:00 KST via Stibee.
- **Card news:** 2 episodes a week, each in KO and EN.
  - Posted Monday and Thursday at 08:30 KST.
  - Platforms: Instagram and LinkedIn.
- **Short video:** 3 a week, each in KO and EN.
  - Posted Tuesday, Friday and Sunday at 19:00 KST.
  - Platforms: Instagram Reels and YouTube Shorts.
- **Which language goes where:** `<TO CONFIRM>`. Until the owner confirms, assume:
  - Instagram: KO and EN as separate posts, with EN 4 hours after KO.
  - YouTube: KO and EN as separate Shorts.
  - LinkedIn: EN only.
- **Card news design folder (on the owner's PC):** `C:\Users\yaehy\OneDrive\Desktop\BIO.ON`
- **Output folder:** `content-out/<next Monday YYYY-MM-DD>/` inside this repository. Don't commit it, because it holds large media files.

## 1. Pick the news

1. Run `git pull` on `main`. From `src/content/insight.json` and `src/content/wiki.json`, list the stories already covered, so you don't repeat them.
2. Use web search to find this week's (Monday to Sunday) biotech and pharma news, and choose **3 stories**. Mix the kinds of news, such as a deal, a regulatory decision, a clinical result or the market.
3. Check every company name, number, date and regulatory decision against the original source (company press release, FDA/EMA/MFDS, a major trade outlet). Keep the URL.
   - Leave out anything you can't confirm, and list it in the report.

## 2. Newsletter (KO + EN)

- Use the most recent issue in `public/newsletters/ko/` and `public/newsletters/en/` as the template. Keep the same HTML structure, styles and sections.
- Take the issue number from the last issue + 1.
- Tone: a master's student sharing what they've studied and organised. Korean uses "~요" endings; English uses "I".
  - No investment advice and no exaggeration.
  - Every story gets a source link.
- Save the files as:
  - `content-out/<date>/newsletter/BIO.ON Insight KO #<n>.html`
  - `content-out/<date>/newsletter/BIO.ON Insight EN #<n>.html`
- Also write the Stibee subject line and preview text for each language in `newsletter/meta.txt`.

## 3. Card news (2 episodes × KO/EN)

- Pick the 2 most visual of the 3 newsletter stories.
- Copy the **existing design** in the card news design folder as it is (`assets/style.css`, background images, cover → body1…N → cta structure). Don't create a new design.
  - Size 1080×1350 (4:5), one HTML file per card, 5–7 cards.
- Render a PNG of every card with headless Chrome. Then open each PNG and check:
  - nothing is cut off
  - the fonts and backgrounds load
  - the page numbers are in order
- Output for each episode:
  - `content-out/<date>/cardnews/<slug>/ko/cards/*.html` and `ko/verify/*.png`, with the same layout under `en/`
  - `caption-ko.txt` and `caption-en.txt`: caption text, 5–8 hashtags and source lines
  - `caption-linkedin.txt`: English, 3–5 lines plus a source link

## 4. Short videos (3 × KO/EN)

- 9:16, 1080×1920, 30–45 seconds, mp4 (H.264 + AAC).
- Script: a 3-second hook → 3 key points → a closing line (subscribe to the newsletter / follow).
  - Every number must match the newsletter.
- Making the video:
  1. Build each scene as HTML in the same colours and fonts as the card news.
  2. Capture the scenes with headless Chrome.
  3. Join them with `ffmpeg` and burn the captions in.
  - Add narration only if a TTS tool is connected; otherwise make a captions-only video.
  - Don't make AI images that explain scientific mechanisms.
- Use `ffprobe` to check length, resolution and that there is an audio track.
- Output: `content-out/<date>/shorts/<nn>-<slug>/`
  - `ko.mp4`, `en.mp4`, `cover-ko.png`, `cover-en.png`
  - `title-ko.txt`, `title-en.txt`: a YouTube title (60 characters max)
  - `caption-ko.txt`, `caption-en.txt`: description, hashtags and sources

## 5. Review page and schedule

- Make `content-out/<date>/review.html` and open it in the browser. On one page it shows:
  - the newsletter as a preview
  - every card news card
  - every video (a `<video>` player) and every caption
  - a number on each item, such as N1, C1-ko or S2-en, so the owner can say "C1-ko 3번 카드 숫자 틀림"
- Make `content-out/<date>/schedule.md`: for each item, the platform, date, time (KST), language, file path and caption file. Every item starts with **status: 검토 대기**.

## 6. Applying review feedback

- When the owner points out a mistake, fix the source file (HTML or script), render it again, and update the review page.
- When the owner says "OK" or "통과" for an item, change its status in `schedule.md` to **승인**.
- Only **approved** items can be scheduled. Tell the owner which items are still waiting for review.

## 7. Report (Korean, short)

- The 3 newsletter stories, with their sources
- Which story each card news episode and video covers
- Facts left out because they couldn't be confirmed
- The location of the review page, plus: "검토 후 고칠 부분을 말해 주시고, 다 되면 '예약해줘'라고 해 주세요"
