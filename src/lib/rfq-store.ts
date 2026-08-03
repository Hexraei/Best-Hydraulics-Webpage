import { desc } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { quoteRequests } from "@/db/schema";
import type { ResolvedRfq } from "@/lib/rfq";

/**
 * Persists a quote request. Called before the notifications go out so the lead
 * is recorded even if email and WhatsApp both fail.
 *
 * Never throws: losing the archive copy must not stop the enquiry reaching the
 * owner, which is the outcome the customer actually cares about.
 */
export async function saveQuoteRequest(rfq: ResolvedRfq): Promise<number | null> {
  if (!hasDatabase()) return null;

  try {
    const [row] = await getDb()
      .insert(quoteRequests)
      .values({
        name: rfq.customer.name,
        businessName: rfq.customer.businessName || null,
        phoneNumber: rfq.customer.phoneNumber,
        emailId: rfq.customer.emailId,
        message: rfq.customer.message || null,
        lines: rfq.lines,
        subtotal: rfq.subtotal,
      })
      .returning({ id: quoteRequests.id });

    return row?.id ?? null;
  } catch (error) {
    console.error("[rfq-store] could not save quote request:", error);
    return null;
  }
}

/** Records which channels actually delivered, so silent failures stay visible. */
export async function markDelivery(
  id: number | null,
  delivered: { email: boolean; whatsapp: boolean },
) {
  if (!id || !hasDatabase()) return;

  try {
    const { eq } = await import("drizzle-orm");
    await getDb()
      .update(quoteRequests)
      .set({
        emailDelivered: delivered.email ? 1 : 0,
        whatsappDelivered: delivered.whatsapp ? 1 : 0,
      })
      .where(eq(quoteRequests.id, id));
  } catch (error) {
    console.error("[rfq-store] could not record delivery status:", error);
  }
}

export async function listQuoteRequests(limit = 100) {
  if (!hasDatabase()) return [];

  try {
    return await getDb()
      .select()
      .from(quoteRequests)
      .orderBy(desc(quoteRequests.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[rfq-store] could not list quote requests:", error);
    return [];
  }
}
