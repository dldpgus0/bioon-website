import { getInterviewQuestions } from "@/lib/content";
import { hasLead } from "@/lib/lead";

// Answer points for the gated questions in the interview bank. The page only ships the
// free questions' points; the rest come from here once the reader has unlocked.
export async function GET(request: Request) {
  if (!(await hasLead())) return Response.json({ error: "locked" }, { status: 401 });
  const lang = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "ko";
  const points = Object.fromEntries(getInterviewQuestions(lang).map((q) => [q.id, { why: q.why, points: q.points }]));
  return Response.json({ points }, { headers: { "Cache-Control": "private, no-store" } });
}
