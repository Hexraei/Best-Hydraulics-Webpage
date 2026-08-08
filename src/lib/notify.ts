import {
  renderRfqHtml,
  renderRfqText,
  renderRfqWhatsApp,
  type ResolvedRfq,
} from "@/lib/rfq";

export type NotifyResult = {
  channel: "email" | "whatsapp";
  ok: boolean;
  /** Set when the channel is not configured, so a missing key is not treated as a failure. */
  skipped?: boolean;
  error?: string;
};

const REQUEST_TIMEOUT_MS = 10_000;

async function postWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Sends the RFQ to the store inbox via Resend.
 * Requires RESEND_API_KEY and RFQ_TO_EMAIL.
 */
export async function sendRfqEmail(rfq: ResolvedRfq): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RFQ_TO_EMAIL;
  // Resend's shared sender works with no domain setup; override once a domain is verified.
  const from = process.env.RFQ_FROM_EMAIL || "Best Hydraulics <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return { channel: "email", ok: false, skipped: true, error: "Email not configured" };
  }

  try {
    // Overridable so the delivery path can be exercised against a mock in tests.
    const endpoint = process.env.RESEND_API_URL || "https://api.resend.com/emails";

    const response = await postWithTimeout(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((address) => address.trim()).filter(Boolean),
        // Lets the owner hit Reply and land in the customer's inbox.
        reply_to: rfq.customer.emailId,
        subject: `Quote Request — ${rfq.customer.name}${rfq.customer.businessName ? ` (${rfq.customer.businessName})` : ""}`,
        html: renderRfqHtml(rfq),
        text: renderRfqText(rfq),
        attachments: rfq.images.map((image) => ({
          filename: image.filename,
          content: image.content,
        })),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return { channel: "email", ok: false, error: `Resend ${response.status}: ${detail.slice(0, 300)}` };
    }

    return { channel: "email", ok: true };
  } catch (error) {
    return {
      channel: "email",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

/**
 * Sends a WhatsApp alert to the store owner via CallMeBot.
 * Requires CALLMEBOT_PHONE (digits with country code, e.g. 919363129869) and CALLMEBOT_APIKEY.
 */
export async function sendRfqWhatsApp(rfq: ResolvedRfq): Promise<NotifyResult> {
  const phone = process.env.CALLMEBOT_PHONE?.replace(/[^0-9]/g, "");
  const apiKey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apiKey) {
    return { channel: "whatsapp", ok: false, skipped: true, error: "WhatsApp not configured" };
  }

  try {
    const base = process.env.CALLMEBOT_API_URL || "https://api.callmebot.com/whatsapp.php";

    const url =
      `${base}?phone=${encodeURIComponent(phone)}` +
      `&text=${encodeURIComponent(renderRfqWhatsApp(rfq))}` +
      `&apikey=${encodeURIComponent(apiKey)}`;

    const response = await postWithTimeout(url, { method: "GET" });

    if (!response.ok) {
      const detail = await response.text();
      return { channel: "whatsapp", ok: false, error: `CallMeBot ${response.status}: ${detail.slice(0, 300)}` };
    }

    return { channel: "whatsapp", ok: true };
  } catch (error) {
    return {
      channel: "whatsapp",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown WhatsApp error",
    };
  }
}
