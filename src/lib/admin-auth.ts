import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bh_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

/** The login email. Falls back to the business address on the contact page. */
export function adminEmail() {
  return (process.env.ADMIN_EMAIL || "alfaruberss@gmail.com").trim().toLowerCase();
}

function secret() {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("ADMIN_PASSWORD is not set");
  return value;
}

/** Signs an expiry timestamp so the cookie cannot be forged or extended. */
function sign(expiresAt: number) {
  return createHmac("sha256", secret()).update(String(expiresAt)).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual throws on length mismatch, which itself leaks length.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(email: string, password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  // Compare both, without short-circuiting, so a wrong email and a wrong
  // password take the same time and neither can be probed independently.
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail());
  const passwordOk = safeEqual(password, expected);
  return emailOk && passwordOk;
}

export function createSessionValue() {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isValidSession(value: string | undefined) {
  if (!value) return false;

  const [expiresRaw, signature] = value.split(".");
  const expiresAt = Number(expiresRaw);

  if (!expiresRaw || !signature || !Number.isFinite(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;

  try {
    return safeEqual(signature, sign(expiresAt));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  return isValidSession(store.get(COOKIE_NAME)?.value);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  },
};
