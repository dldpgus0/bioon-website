import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Lead-magnet unlock: after someone subscribes for a download or tool, the subscribe API sets
// a signed HttpOnly cookie. Gated routes check the signature server-side, so the cookie can't
// be forged or read from page scripts. It holds only the issue time — no email or name.
export const LEAD_COOKIE = "bioon_lead";
const MAX_AGE = 60 * 60 * 24 * 365; // one year

// LEAD_COOKIE_SECRET is the intended secret; STIBEE_API_KEY is always set in production and
// never leaves the server, so it's a safe fallback. The dev value only applies locally.
function secret() {
  return process.env.LEAD_COOKIE_SECRET || process.env.STIBEE_API_KEY || "bioon-dev-only-secret";
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function leadCookieValue() {
  const payload = `v1.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function leadCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };
}

export function isValidLead(value: string | undefined) {
  if (!value) return false;
  const i = value.lastIndexOf(".");
  if (i < 0) return false;
  const expected = Buffer.from(sign(value.slice(0, i)));
  const given = Buffer.from(value.slice(i + 1));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** True when the current request carries a valid unlock cookie. */
export async function hasLead() {
  return isValidLead((await cookies()).get(LEAD_COOKIE)?.value);
}
