import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Schema changes go over the direct connection: pgbouncer does not pass
    // through the session-level features DDL relies on.
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!,
  },
} satisfies Config;
