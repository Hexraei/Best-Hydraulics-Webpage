import { NextResponse } from "next/server";
import { sendRfqEmail, sendRfqWhatsApp } from "@/lib/notify";
import { resolveRfq } from "@/lib/rfq";
import { markDelivery, saveQuoteRequest } from "@/lib/rfq-store";

// Notifications go out over the network, so this must run on the Node runtime
// and must not be statically optimised.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

// Best-effort, per-instance throttle. It blunts casual form spam; it is not a
// substitute for a shared store if the site ever runs at real scale.
const submissions = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(key, recent);
    return true;
  }

  recent.push(now);
  submissions.set(key, recent);

  if (submissions.size > 5000) submissions.clear();
  return false;
}

export async function POST(request: Request) {
  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { message: "Too many requests. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: a real user never fills a field they cannot see.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).company) {
    return NextResponse.json({ message: "Quote request received" });
  }

  const resolved = await resolveRfq(body);

  if (!resolved.ok) {
    return NextResponse.json(
      { message: resolved.errors[0]?.message ?? "Invalid quote request", errors: resolved.errors },
      { status: 400 },
    );
  }

  // Archive first: if both notification channels fail, the lead still survives.
  const quoteId = await saveQuoteRequest(resolved.rfq);

  const [email, whatsapp] = await Promise.all([
    sendRfqEmail(resolved.rfq),
    sendRfqWhatsApp(resolved.rfq),
  ]);

  for (const result of [email, whatsapp]) {
    if (!result.ok && !result.skipped) {
      console.error(`[rfq] ${result.channel} delivery failed: ${result.error}`);
    }
  }

  await markDelivery(quoteId, { email: email.ok, whatsapp: whatsapp.ok });

  // The email is the system of record; WhatsApp is a convenience alert. Only fail
  // the request if the enquiry reached nobody AND was not archived — with a saved
  // copy the owner can still follow up, so telling the customer it failed is wrong.
  if (!email.ok && !whatsapp.ok && !quoteId) {
    return NextResponse.json(
      {
        message:
          "We could not submit your request right now. Please call or WhatsApp us on 9994703528 and we will assist you directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: "Quote request received",
    delivered: { email: email.ok, whatsapp: whatsapp.ok },
  });
}
