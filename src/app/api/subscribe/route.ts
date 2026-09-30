// Adds a subscriber to the Stibee address book (API v2, https://developers.stibee.com),
// then puts them in the group for the language they signed up in, so the Korean and
// English editions can be sent to separate groups.
// Env: STIBEE_API_KEY, STIBEE_LIST_ID, and optionally STIBEE_GROUP_KO / STIBEE_GROUP_EN
// (group IDs from Stibee → 주소록 → 그룹). Without a group ID the group step is skipped.
// A successful sign-up also sets the lead-magnet unlock cookie (see src/lib/lead.ts), so
// subscribing from a gated download or tool opens it straight away.
import { cookies } from "next/headers";
import { LEAD_COOKIE, leadCookieOptions, leadCookieValue } from "@/lib/lead";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STIBEE = "https://api.stibee.com/v2";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 50) : "";
  const lang = body?.lang === "en" ? "en" : "ko";
  // Where the sign-up came from (e.g. "resource:glossary"), for the logs.
  const source = typeof body?.source === "string" && /^[a-z0-9:_-]{1,40}$/.test(body.source) ? body.source : "subscribe";
  if (!EMAIL_RE.test(email) || email.length > 64) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!name) {
    return Response.json({ error: "name_required" }, { status: 400 });
  }

  const apiKey = process.env.STIBEE_API_KEY;
  const listId = process.env.STIBEE_LIST_ID;
  if (!apiKey || !listId) {
    // Lets the form be exercised locally before Stibee is wired up.
    if (process.env.NODE_ENV !== "production") {
      console.log(`[subscribe] (mock, Stibee not configured) ${lang} ${source} ${email}`);
      await unlock();
      return Response.json({ ok: true, mock: true });
    }
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const headers = { "Content-Type": "application/json", AccessToken: apiKey };

  // updateEnabled: someone already on the list (e.g. subscribing again from the
  // other language's site) gets their name updated instead of a 400.
  const added = await fetch(`${STIBEE}/lists/${listId}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      subscriber: { email, status: "subscribed", fields: { name } },
      updateEnabled: true,
    }),
  });
  if (!added.ok) {
    console.error("[subscribe] Stibee add failed", added.status, await added.text());
    return Response.json({ error: "upstream" }, { status: 502 });
  }

  const groupId = lang === "en" ? process.env.STIBEE_GROUP_EN : process.env.STIBEE_GROUP_KO;
  if (groupId) {
    const assigned = await fetch(`${STIBEE}/lists/${listId}/groups/${groupId}/assign`, {
      method: "POST",
      headers,
      body: JSON.stringify({ subscriber: email }),
    });
    // The subscriber is already saved, so don't fail the sign-up; just log it for follow-up.
    if (!assigned.ok) {
      console.error(`[subscribe] Stibee group assign failed (${lang})`, assigned.status, await assigned.text());
    }
  }

  console.log(`[subscribe] ok ${lang} ${source}`);
  await unlock();
  return Response.json({ ok: true });
}

async function unlock() {
  (await cookies()).set(LEAD_COOKIE, leadCookieValue(), leadCookieOptions());
}
