---
name: schedule-posts
description: Using the owner's own computer and browser, schedule the content the owner approved in content-out/<date>/schedule.md on Stibee, Instagram (Meta Business Suite), YouTube Studio and LinkedIn. Use only when the owner says "예약해줘", "올려줘" or "/schedule-posts". Never post anything immediately.
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

1. **Newsletter → Stibee** (stibee.com)
   - Create an email in each of the KO and EN address books.
   - Paste the HTML in, then enter the subject line and preview text from `newsletter/meta.txt`.
   - Send a test email to the owner's own address, ask the owner to check it, and only then set a **scheduled send** for Tuesday 08:00 KST.
2. **Instagram card news and Reels → Meta Business Suite** (business.facebook.com > Planner/Content)
   - Card news: create a post, upload the PNGs in the order 01, 02, …, enter the caption, then schedule.
   - Reels: create a reel, upload the mp4 and the cover image, enter the caption, then schedule.
3. **YouTube Shorts → YouTube Studio** (studio.youtube.com)
   - Upload the video and enter the title and description. Select **Not made for kids**, then in Visibility choose **Schedule** and set the date and time.
4. **LinkedIn card news → LinkedIn** (the owner's profile or the BIO:ON page; ask the owner which the first time)
   - Upload the card images (or a PDF made from them) with `caption-linkedin.txt`, then use the clock icon to schedule.

## Recording and reporting

- For each item in `schedule.md`, change its status to **예약됨 (<platform>, <KST time>)**. If you can see a scheduled-post link or ID, record it too.
- Report in Korean:
  - The list of scheduled items (platform, language, date and time)
  - Items that failed or were skipped, and why
  - What the owner needs to check (e.g. the Stibee test email)
