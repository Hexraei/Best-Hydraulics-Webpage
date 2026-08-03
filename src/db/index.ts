import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lazy client. Next.js evaluates top-level module code during `next build`, and
 * neon() throws when DATABASE_URL is missing, so creating the client eagerly
 * would break builds before the database is provisioned.
 *
 * Deliberately a plain function rather than a Proxy wrapper — Proxies around a
 * Drizzle client break libraries that introspect the adapter object.
 */
let client: ReturnType<typeof create> | null = null;

function create() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add the Neon connection string to .env.local (see .env.example).",
    );
  }
  return drizzle(neon(url), { schema });
}

export function getDb() {
  if (!client) client = create();
  return client;
}

/** True when a database is configured, so callers can fall back to static data. */
export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export { schema };
