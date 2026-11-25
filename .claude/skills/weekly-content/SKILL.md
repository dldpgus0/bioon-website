---
name: weekly-content
description: Make next week's BIO:ON content in one run. It writes the BIO:ON Insight newsletter (KO/EN), builds 2 card news episodes and 3 short videos (Reels/Shorts) in KO and EN, and puts everything in a review page for the owner. Use when the owner says "/weekly-content", "이번 주 콘텐츠 만들어줘", "다음 주 거 준비해줘" or similar.
---

# Weekly content: newsletter + card news + short videos

Reply in Korean. This skill only **makes** content. It never posts or schedules anything; that's the `schedule-posts` skill, which runs only after the owner has reviewed everything.

## Settings (the owner can change these)

- **Newsletter:** BIO:ON Insight, one KO and one EN issue a week, sent via Stibee on Tuesday: KO at 08:00 KST, EN at 08:00 UK time.
- **Card news:** 2 a week (C1 news, C2 series), each in KO and EN.
  - Posted Monday and Thursday at 08:30 KST.
  - Platforms: Instagram and the LinkedIn BIO:ON page.
- **Short video:** 3 a week (S1 1분 뉴스, S2 설명·VS, S3 한국·커리어), each in KO and EN, cartoon 3D format.
  - Posted Tuesday, Friday and Sunday at 19:00 KST.
  - Platforms: Instagram Reels and YouTube Shorts.
- **Which language goes where (confirmed by the owner on 2026-11-23):**
  - Instagram: KO and EN as separate posts, with EN 4 hours after KO.
  - YouTube: KO and EN as separate Shorts, with EN 4 hours after KO.
  - LinkedIn: the BIO:ON page only, with KO and EN as separate posts and EN 4 hours after KO.
- **Card news design folder (on the owner's PC):** `C:\Users\yaehy\OneDrive\Desktop\BIO.ON`
- **Output folder:** `content-out/<next Monday YYYY-MM-DD>/` inside this repository. Don't commit it, because it holds large media files.

## 0. Weekly slots and topics (owner's plan: `content-out/PLAN_2026-12_2027-02.md`)

Read the plan first. Each week fills the same five slots; the plan's row for the week says what goes in each.

| Slot | Time (KST) | Topic |
|---|---|---|
| C1 card news | Mon 08:30 | **News**: the most visual newsletter story of the week |
| C2 card news | Thu 08:30 | **Series**: 모달리티 사전 / VS / 숫자로 보는 / 일정·결산 (from the plan) |
| S1 short | Tue 19:00 | **1분 뉴스**: one deal, approval or trial result of the week |
| S2 short | Fri 19:00 | **설명 / VS**: the same topic as C2, as a video |
| S3 short | Sun 19:00 | **한국 바이오 or 커리어**: a Korean company story, or "the job behind this news" |

- Pick series topics that are not yet used (see the plan's series list) and connect them to this week's news where possible.
- The cartoon history shorts (Mon/Wed/Sat, `dev/bioon-shorts/IDEAS_*.md`) run separately. Don't put the same topic in both in the same week.
- Keep a `content-out/<date>/PROGRESS.md` checklist and update it after every step, so the work can resume after a usage limit (a session cron re-reads it).

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

- C1 = the most visual newsletter story. C2 = this week's series card from the plan (VS cards use b2 as the A-vs-B compare and b5 as "when to choose which").
- Copy the **existing design** in the card news design folder as it is (`assets/style.css`, background images, cover → body1…N → cta structure). Don't create a new design.
  - Size 1080×1350 (4:5), one HTML file per card, 5–7 cards.
- Render a PNG of every card with headless Chrome. Then open each PNG and check:
  - nothing is cut off
  - the fonts and backgrounds load
  - the page numbers are in order
- Output for each episode:
  - `content-out/<date>/cardnews/<slug>/ko/cards/*.html` and `ko/verify/*.png`, with the same layout under `en/`
  - `caption-ko.txt` and `caption-en.txt`: caption text, 5–8 hashtags and source lines
  - `caption-linkedin-ko.txt` and `caption-linkedin-en.txt`: 3–5 lines plus a source link

## 4. Short videos (3 × KO/EN)

- **Format: the BIO:ON cartoon 3D short.** Follow `C:/Users/yaehy/dev/bioon-shorts/PLAYBOOK.md` (quality bar Elixir v11, newest short folder as the template). Don't make HTML-slide videos (the owner rejected them on 2026-11-23).
- **Length: 60–70 seconds including the CTA, never shorter or longer.** Hit it by editing the script, not by speeding up the voice. The narration must stay easy to follow (KO M1 1.25, EN M1 1.1; `voice_from_script.py` may add at most 7%).
- 9:16, 1080×1920, mp4 (H.264 + AAC).
- Order of work (run straight through; the owner reviews the finished week, not each script):
  1. Write `BIO.ON/reels/cartoon/<topic>/SCRIPT.md` per short: facts table with sources, ~15 KO lines, the same lines in EN, visual notes, career line last. Every number must match the newsletter.
  2. **Pronunciation dictionary** `dev/bioon-shorts/<topic>/voice/say.json` (`{"ko": {...}, "en": {...}}`) for every company, drug, code and acronym (e.g. `"AriBio": "Ahri Bio"`, `"AR1001": "에이알 일공공일"`, `"ORION-4": "오리온 포"`). `ko_num.py` already reads 개월 as 삼 개월, 1만 6천 as 만 육천, and RA/IR/J&J in Hangul.
  3. Generate the voice (`python scripts/voice_from_script.py <topic> penicillin`), check both languages land in 60–70 s, then run `python scripts/pron_check.py <topic> <ko|en>` and read every HEARD line against the caption. Fix say.json and re-voice anything misread.
  4. **New places every short.** Use the set library (`scripts/extra_sets.ts` via `add_extra.py`: exam room, home, kitchen, conference hall, boardroom, plus stage, diner, desert) and `"cam": "custom"` in story.json. Never use one set twice in a short, the chalkboard at most once, and don't repeat the previous shorts' line-up (office3/office2/clinic/board were overused up to Nov 2026). Give each short its own characters (new Outfit colours, ages, hair).
  5. Render stills of every shot (KO), and fix framing: nobody cut at the frame edge, cards inside the frame and not hidden by the caption band, **nothing important under the top-left name tag, the callout or the 2-second hook title**.
  6. Render KO and EN (`scripts/render_short.sh`), make a contact sheet of each, and check the same points again in EN (longer words).
  - Don't make AI images that explain scientific mechanisms.
- Use `ffprobe` to check length (60–70 s), resolution and that there is an audio track.
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
