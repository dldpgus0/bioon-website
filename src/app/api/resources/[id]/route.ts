import { downloadFile, isDownloadId, renderDownload } from "@/lib/downloads";
import { hasLead } from "@/lib/lead";

// Gated downloads: only readers with the signed lead cookie (set on sign-up) get the file.
// Office files are sent as attachments; everything else is a printable HTML page.
export async function GET(request: Request, ctx: RouteContext<"/api/resources/[id]">) {
  const { id } = await ctx.params;
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "ko";
  if (!isDownloadId(id)) return new Response("Not found", { status: 404 });
  if (!(await hasLead())) return Response.redirect(new URL(`/${lang}/resources#${id}`, url), 303);

  const file = downloadFile(id);
  if (file) {
    return new Response(new Uint8Array(file.body), {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  return new Response(renderDownload(id, lang, url.origin), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  });
}
