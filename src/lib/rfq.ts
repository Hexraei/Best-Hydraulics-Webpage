import { getCatalog } from "@/lib/catalog";
import { formatINR } from "@/lib/currency";
import type { CartLineInput } from "@/lib/types";

export type RfqCustomer = {
  name: string;
  businessName: string;
  phoneNumber: string;
  emailId: string;
  message: string;
};

export type RfqPayload = RfqCustomer & {
  lines: CartLineInput[];
};

export type ResolvedRfqLine = {
  productName: string;
  category: string;
  dimension: string;
  color: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type ResolvedRfq = {
  customer: RfqCustomer;
  lines: ResolvedRfqLine[];
  subtotal: number;
};

const MAX_LINES = 100;
const MAX_QUANTITY = 100_000;
const MAX_FIELD_LENGTH = 2000;

export type RfqValidationError = { field: string; message: string };

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates an untrusted request body and resolves each cart line against the
 * catalog. Prices and product names always come from the catalog, never from the
 * client, so a tampered payload cannot quote a price the shop does not offer.
 */
export async function resolveRfq(
  body: unknown,
): Promise<{ ok: true; rfq: ResolvedRfq } | { ok: false; errors: RfqValidationError[] }> {
  const errors: RfqValidationError[] = [];

  if (!body || typeof body !== "object") {
    return { ok: false, errors: [{ field: "body", message: "Invalid request body" }] };
  }

  const catalog = await getCatalog();

  const raw = body as Record<string, unknown>;

  const customer: RfqCustomer = {
    name: asString(raw.name).slice(0, MAX_FIELD_LENGTH),
    businessName: asString(raw.businessName).slice(0, MAX_FIELD_LENGTH),
    phoneNumber: asString(raw.phoneNumber).slice(0, MAX_FIELD_LENGTH),
    emailId: asString(raw.emailId).slice(0, MAX_FIELD_LENGTH),
    message: asString(raw.message).slice(0, MAX_FIELD_LENGTH),
  };

  if (!customer.name) {
    errors.push({ field: "name", message: "Name is required" });
  }

  // Indian mobile numbers, tolerant of spaces, dashes and a +91 prefix.
  const digits = customer.phoneNumber.replace(/[^0-9]/g, "");
  if (!customer.phoneNumber) {
    errors.push({ field: "phoneNumber", message: "Phone number is required" });
  } else if (digits.length < 10 || digits.length > 13) {
    errors.push({ field: "phoneNumber", message: "Enter a valid phone number" });
  }

  if (!customer.emailId) {
    errors.push({ field: "emailId", message: "Email ID is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.emailId)) {
    errors.push({ field: "emailId", message: "Enter a valid email address" });
  }

  const rawLines = Array.isArray(raw.lines) ? raw.lines : [];
  if (rawLines.length > MAX_LINES) {
    errors.push({ field: "lines", message: `A quote request can hold at most ${MAX_LINES} items` });
  }

  const lines: ResolvedRfqLine[] = [];

  for (const entry of rawLines.slice(0, MAX_LINES)) {
    if (!entry || typeof entry !== "object") {
      errors.push({ field: "lines", message: "Invalid cart line" });
      continue;
    }

    const line = entry as Record<string, unknown>;
    const quantity = Number(line.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      errors.push({ field: "lines", message: "Quantity must be a whole number of at least 1" });
      continue;
    }

    const productId = asString(line.productId);
    const product = catalog.find((item) => item.id === productId);
    const variant = product?.variants.find((item) => item.id === asString(line.variantId));

    if (!product || !variant) {
      errors.push({ field: "lines", message: "A product in your cart is no longer available" });
      continue;
    }

    lines.push({
      productName: product.name,
      category: product.category,
      dimension: variant.dimension,
      color: variant.color,
      quantity,
      unitPrice: variant.price,
      lineTotal: variant.price * quantity,
    });
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    rfq: {
      customer,
      lines,
      subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
    },
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderRfqText(rfq: ResolvedRfq) {
  const { customer, lines, subtotal } = rfq;

  const itemLines =
    lines.length > 0
      ? lines
          .map(
            (line, index) =>
              `${index + 1}. ${line.productName}\n` +
              `   ${line.category} | ${line.dimension} | ${line.color}\n` +
              `   Qty: ${line.quantity} x ${formatINR(line.unitPrice)} = ${formatINR(line.lineTotal)}`,
          )
          .join("\n")
      : "No cart items included — this is a callback request.";

  return [
    "NEW QUOTE REQUEST - BEST HYDRAULICS",
    "",
    `Name: ${customer.name}`,
    `Business Name: ${customer.businessName || "-"}`,
    `Phone Number: ${customer.phoneNumber}`,
    `Email ID: ${customer.emailId}`,
    `Extra Message: ${customer.message || "-"}`,
    "",
    "CART ITEMS",
    itemLines,
    "",
    `Subtotal: ${formatINR(subtotal)}`,
    "",
    `Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
  ].join("\n");
}

export function renderRfqHtml(rfq: ResolvedRfq) {
  const { customer, lines, subtotal } = rfq;

  const rows =
    lines.length > 0
      ? lines
          .map(
            (line) => `
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;">
                  <strong style="color:#0f172a;">${escapeHtml(line.productName)}</strong><br>
                  <span style="color:#64748b;font-size:13px;">${escapeHtml(line.category)} / ${escapeHtml(line.dimension)} / ${escapeHtml(line.color)}</span>
                </td>
                <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:center;color:#0f172a;">${line.quantity}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;color:#0f172a;">${escapeHtml(formatINR(line.unitPrice))}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;color:#0f172a;">${escapeHtml(formatINR(line.lineTotal))}</td>
              </tr>`,
          )
          .join("")
      : `<tr><td colspan="4" style="padding:16px 12px;color:#64748b;">No cart items included — this is a callback request.</td></tr>`;

  const field = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:#64748b;font-size:13px;width:150px;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:500;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
      <div style="background:#020617;padding:20px 24px;">
        <p style="margin:0;color:#94a3b8;font-size:11px;letter-spacing:.18em;text-transform:uppercase;">Best Hydraulics</p>
        <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;">New Quote Request</h1>
      </div>

      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${field("Name", escapeHtml(customer.name))}
          ${field("Business Name", escapeHtml(customer.businessName || "-"))}
          ${field("Phone Number", `<a href="tel:${escapeHtml(customer.phoneNumber)}" style="color:#1d4ed8;">${escapeHtml(customer.phoneNumber)}</a>`)}
          ${field("Email ID", `<a href="mailto:${escapeHtml(customer.emailId)}" style="color:#1d4ed8;">${escapeHtml(customer.emailId)}</a>`)}
          ${field("Extra Message", escapeHtml(customer.message || "-"))}
        </table>

        <h2 style="margin:24px 0 10px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#64748b;">Cart Items</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#64748b;">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#64748b;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#64748b;">Unit</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#64748b;">Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="background:#f8fafc;">
              <td colspan="3" style="padding:12px;text-align:right;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#64748b;">Subtotal</td>
              <td style="padding:12px;text-align:right;font-size:18px;font-weight:600;color:#0f172a;">${escapeHtml(formatINR(subtotal))}</td>
            </tr>
          </tfoot>
        </table>

        <p style="margin:20px 0 0;color:#64748b;font-size:12px;">
          Received ${escapeHtml(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))} IST.
          Reply directly to this email to reach the customer.
        </p>
      </div>
    </div>
  </body>
</html>`;
}

/** Compact single-message summary for WhatsApp. */
export function renderRfqWhatsApp(rfq: ResolvedRfq) {
  const { customer, lines, subtotal } = rfq;

  const items =
    lines.length > 0
      ? lines
          .map((line) => `• ${line.productName} (${line.dimension}) x${line.quantity} = ${formatINR(line.lineTotal)}`)
          .join("\n")
      : "• No cart items (callback request)";

  return [
    "*New Quote Request — Best Hydraulics*",
    "",
    `*Name:* ${customer.name}`,
    customer.businessName ? `*Business:* ${customer.businessName}` : null,
    `*Phone:* ${customer.phoneNumber}`,
    `*Email:* ${customer.emailId}`,
    customer.message ? `*Message:* ${customer.message}` : null,
    "",
    "*Items*",
    items,
    "",
    `*Subtotal:* ${formatINR(subtotal)}`,
  ]
    .filter((part): part is string => part !== null)
    .join("\n");
}
