import { isDownloadId, renderDownload } from "@/lib/downloads";
import { hasLead } from "@/lib/lead";

// Gated resource download. Without the unlock cookie, sends the reader back to the
// resources page to enter their email.
export async function GET(request: Request, ctx: RouteContext<"/api/resources/[id]">) {
  const { id } = await ctx.params;
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "ko";
  if (!isDownloadId(id)) return new Response("Not found", { status: 404 });
  if (!(await hasLead())) return Response.redirect(new URL(`/${lang}/resources#${id}`, url), 303);

  return new Response(renderDownload(id, lang, url.origin), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
