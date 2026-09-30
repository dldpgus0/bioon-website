import { hasLead } from "@/lib/lead";

// Lets client components restore the unlocked state on page load. The cookie itself is
// HttpOnly, so this is the only way the browser learns whether it's set.
export async function GET() {
  return Response.json({ unlocked: await hasLead() }, { headers: { "Cache-Control": "private, no-store" } });
}
