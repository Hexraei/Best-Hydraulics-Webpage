import { NextResponse } from "next/server";
import { adminCookie, createSessionValue, verifyCredentials } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Throttles password guessing on a per-instance basis.
const attempts = new Map<string, number[]>();
const WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 8;

export async function POST(request: Request) {
  const key =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent);
    return NextResponse.json(
      { message: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { message: "Admin access is not configured. Set ADMIN_PASSWORD." },
      { status: 503 },
    );
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  if (!verifyCredentials(email, password)) {
    recent.push(now);
    attempts.set(key, recent);
    // Deliberately vague: naming which field was wrong tells an attacker
    // whether they have found a valid email.
    return NextResponse.json({ message: "Incorrect email or password" }, { status: 401 });
  }

  attempts.delete(key);

  const response = NextResponse.json({ message: "Signed in" });
  response.cookies.set(adminCookie.name, createSessionValue(), adminCookie.options);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Signed out" });
  response.cookies.set(adminCookie.name, "", { ...adminCookie.options, maxAge: 0 });
  return response;
}
