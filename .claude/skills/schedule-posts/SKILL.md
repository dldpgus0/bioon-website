---
name: schedule-posts
description: Using the owner's own computer and browser, schedule the content the owner approved in content-out/<date>/schedule.md on Stibee, Instagram (Meta Business Suite), YouTube Studio and LinkedIn, and add it to the website ahead of time so it appears there when it goes out. Use only when the owner says "예약해줘", "올려줘" or "/schedule-posts". Never post anything immediately.
---

# Schedule posts (on the owner's computer)

Reply in Korean. This skill controls the owner's browser and posts content publicly, so follow these rules.

## Rules

- Only schedule items in `content-out/<date>/schedule.md` whose status is **승인**. Skip any that are waiting for review, and tell the owner.
- **Always schedule. Never publish now.** If a screen only has a "지금 게시" or "Publish" button and you can't find a scheduling option, stop and ask the owner.
- Use only accounts that are already logged in. Never type passwords or two-factor codes; if you're asked to log in, ask the owner to do it.
- **Before clicking the final "예약" button**, take a screenshot of the date, time, account and the first lines of the caption, and check them against `schedule.md`. If anything differs, stop.
- If an upload fails, retry once. If it fails again, record the failure and move on to the next item.

## Order and where to go

1. **Newsletter → Stibee** (stibee.com). The KO and EN address books are separate. Do each one the same way:
   1. In that address book, **copy the most recently sent email**.
   2. In the copy, change only the **issue number in the subject line** (use `newsletter/meta.txt`), then **replace the whole HTML code** with this week's file. Change nothing else.
   3. Send a test email to the owner's own address and ask the owner to check it.
   4. Only then set a **scheduled send**: KO Tuesday 08:00 **KST**, EN Tuesday 08:00 **UK time**. Check that Stibee's time zone setting matches.
2. **Instagram card news and Reels → Meta Business Suite** (business.facebook.com > Planner/Content)
   - Card news: create a post, upload the PNGs in the order 01, 02, …, enter the caption, then schedule.
   - Reels: create a reel, upload the mp4 and the cover image, enter the caption, then schedule.
3. **YouTube Shorts → YouTube Studio** (studio.youtube.com)
   - Upload the video and enter the title and description. Select **Not made for kids**, then in Visibility choose **Schedule** and set the date and time.
4. **LinkedIn card news → the BIO:ON page** (post as the page, not the personal profile)
   - Make separate KO and EN posts: upload the card images (or a PDF made from them) with `caption-linkedin-ko.txt` / `caption-linkedin-en.txt`, then use the clock icon to schedule.
5. **The website (bioon-website)**: put the week's approved newsletter and card news on the site now. The site keeps each one hidden until its time and then shows it by itself, so nothing needs doing on the day.
   - Newsletter: the `publish-issue` skill, part A, with `newsletter/BIO.ON Insight KO|EN #<n>.html`. The issue appears at 08:00 on its date (KO Korean time, EN UK time), when Stibee sends it.
   - Card news: the `publish-cardnews` skill with `cardnews/<slug>/ko` and `/en` (the `verify/` PNGs are used as they are). Use `--date` = the KO Instagram post date and `--issue` = this week's issue slug when the episode is based on it. It appears at 08:30 Korean time on that date. If the post time in `schedule.md` is different, add `--publish-at`.
   - One branch and PR for the whole week. Merge it once lint, build and the `next start` checks pass (the owner has approved merging these). Only add approved items.
   - Lists, the home page and the sitemap pick each item up within about 10 minutes of its time. Before that, its page exists at its URL but nothing links to it.

## Recording and reporting

- For each item in `schedule.md`, change its status to **예약됨 (<platform>, <KST time>)**. If you can see a scheduled-post link or ID, record it too.
- Report in Korean:
  - The list of scheduled items (platform, language, date and time), including when each one goes live on the website, with the PR link
  - Items that failed or were skipped, and why
  - What the owner needs to check (e.g. the Stibee test email)

## Tidy up (after every item is 예약됨)

- In `content-out/<date>/`, send these to the Recycle Bin (never delete them permanently):
  - `_unused/` and `_verify/`
  - the copied `cardnews/assets/`. The originals are in the card news design folder; copy it back if a card ever needs re-rendering.
  - any temporary upload or checklist files
- Keep the newsletter, the card HTML and PNG files, the captions, `schedule.md` and `PROGRESS.md`.
- Ask the owner before running `C:\Users\yaehy\dev\bioon-shorts\scripts\cleanup.ps1 -Apply`. It clears the render cache and old short versions. Run it without `-Apply` first and show the preview.
