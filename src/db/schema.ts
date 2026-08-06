import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Products. Prices live on variants, not here, because the same part is sold in
 * several sizes at different prices.
 */
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull(),
    name: varchar("name", { length: 250 }).notNull(),
    category: varchar("category", { length: 80 }).notNull(),
    family: varchar("family", { length: 120 }).notNull().default(""),
    description: text("description").notNull().default(""),

    // Technical attributes the catalog filters on.
    brand: varchar("brand", { length: 120 }),
    material: varchar("material", { length: 120 }),
    pressureRating: varchar("pressure_rating", { length: 60 }),
    application: varchar("application", { length: 120 }),

    // Real industrial catalogs are searched by part number more than by name.
    partNumber: varchar("part_number", { length: 120 }),
    hsnCode: varchar("hsn_code", { length: 20 }),

    // Blob URLs. `image` is the card thumbnail; `gallery` holds the rest.
    image: text("image"),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),

    // Hidden products stay in the DB but drop out of the storefront.
    published: integer("published").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_category_idx").on(table.category),
  ],
);

/**
 * Size/colour variants. Deleting a product removes its variants.
 * Prices are integer paise-free rupees to avoid floating point drift.
 */
export const variants = pgTable(
  "variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 120 }),
    price: integer("price").notNull(),
    stock: integer("stock").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),

    // Open-ended attributes that vary by product type (Range, Model No., Color,
    // Differential, ...) instead of forcing every product into fixed columns.
    specs: jsonb("specs").$type<{ name: string; value: string }[]>().notNull().default([]),
  },
  (table) => [index("variants_product_idx").on(table.productId)],
);

/**
 * Every quote request, stored before the email goes out. This is the archive
 * that makes a lost or spam-filtered email recoverable.
 */
export const quoteRequests = pgTable(
  "quote_requests",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    businessName: varchar("business_name", { length: 200 }),
    phoneNumber: varchar("phone_number", { length: 40 }).notNull(),
    emailId: varchar("email_id", { length: 200 }).notNull(),
    message: text("message"),

    // Snapshot of the cart at submission time, including the prices quoted.
    // Kept as JSON so a later catalog edit cannot rewrite history.
    lines: jsonb("lines")
      .$type<
        {
          productName: string;
          category: string;
          /** Only present on quotes archived before variants moved to freeform specs. */
          dimension?: string;
          specs: string;
          quantity: number;
          unitPrice: number;
          lineTotal: number;
        }[]
      >()
      .notNull()
      .default([]),
    subtotal: integer("subtotal").notNull().default(0),

    // Delivery outcome per channel, so a silent failure is visible later.
    emailDelivered: integer("email_delivered").notNull().default(0),
    whatsappDelivered: integer("whatsapp_delivered").notNull().default(0),

    // Lets the owner track which enquiries have been dealt with.
    status: varchar("status", { length: 30 }).notNull().default("new"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("quote_requests_created_idx").on(table.createdAt)],
);

export type ProductRow = typeof products.$inferSelect;
export type VariantRow = typeof variants.$inferSelect;
export type QuoteRequestRow = typeof quoteRequests.$inferSelect;
