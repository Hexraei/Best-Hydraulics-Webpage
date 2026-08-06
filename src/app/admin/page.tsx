import Link from "next/link";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { getDb, hasDatabase } from "@/db";
import { products, variants } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listQuoteRequests } from "@/lib/rfq-store";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { AdminProduct } from "@/components/admin/types";

export const dynamic = "force-dynamic";

async function loadProducts(): Promise<AdminProduct[]> {
  if (!hasDatabase()) return [];

  try {
    const db = getDb();
    const rows = await db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id));
    const variantRows = await db.select().from(variants).orderBy(asc(variants.sortOrder), asc(variants.id));

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      family: row.family,
      description: row.description,
      brand: row.brand,
      material: row.material,
      pressureRating: row.pressureRating,
      application: row.application,
      partNumber: row.partNumber,
      hsnCode: row.hsnCode,
      image: row.image,
      gallery: row.gallery ?? [],
      published: row.published === 1,
      variants: variantRows
        .filter((variant) => variant.productId === row.id)
        .map((variant) => ({
          id: variant.id,
          dimension: variant.dimension,
          specs: variant.specs,
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
        })),
    }));
  } catch (error) {
    console.error("[admin] could not load products:", error);
    return [];
  }
}

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [adminProducts, quotes] = await Promise.all([loadProducts(), listQuoteRequests(50)]);

  if (!hasDatabase()) {
    return (
      <div className="bg-slate-50/70 py-16">
        <div className="container max-w-2xl">
          <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Database not connected
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              The admin area needs a Neon database. Add <code>DATABASE_URL</code> to your environment,
              then run <code>npm run db:push</code> to create the tables.
            </p>
            <Link href="/" className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">
              Back to site →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      initialProducts={adminProducts}
      quotes={quotes.map((quote) => ({
        id: quote.id,
        name: quote.name,
        businessName: quote.businessName,
        phoneNumber: quote.phoneNumber,
        emailId: quote.emailId,
        message: quote.message,
        lines: quote.lines ?? [],
        subtotal: quote.subtotal,
        emailDelivered: quote.emailDelivered === 1,
        whatsappDelivered: quote.whatsappDelivered === 1,
        createdAt: quote.createdAt.toISOString(),
      }))}
    />
  );
}
