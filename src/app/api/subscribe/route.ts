// Adds a subscriber to the Stibee address book.
// Env: STIBEE_API_KEY, STIBEE_LIST_ID (Stibee → 워크스페이스 설정 → API 키).
// TODO(phase 2): verify payload against the current Stibee API docs and test with a real list.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 50) : "";
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.STIBEE_API_KEY;
  const listId = process.env.STIBEE_LIST_ID;
  if (!apiKey || !listId) {
    // Lets the form be exercised locally before Stibee is wired up.
    if (process.env.NODE_ENV !== "production") {
      console.log(`[subscribe] (mock, Stibee not configured) ${email}`);
      return Response.json({ ok: true, mock: true });
    }
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const res = await fetch(`https://api.stibee.com/v1/lists/${listId}/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", AccessToken: apiKey },
    body: JSON.stringify({
      eventOccuredBy: "SUBSCRIBER",
      confirmEmailYN: "N",
      subscribers: [{ email, name }],
    }),
  });

  if (!res.ok) {
    console.error("[subscribe] Stibee error", res.status, await res.text());
    return Response.json({ error: "upstream" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
