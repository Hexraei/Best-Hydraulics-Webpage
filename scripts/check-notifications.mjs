/**
 * Verifies that the RFQ notification channels are configured correctly by
 * sending one real test message through each.
 *
 *   node scripts/check-notifications.mjs
 *
 * Reads .env.local. Safe to re-run, but each run sends a real email and a real
 * WhatsApp message, and CallMeBot allows roughly one message per minute.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    console.error("Could not read .env.local. Copy .env.example to .env.local first.");
    process.exit(1);
  }
  return env;
}

const env = loadEnv();
const results = [];

// ── Email ───────────────────────────────────────────────────────────────────
const apiKey = env.RESEND_API_KEY;
const to = env.RFQ_TO_EMAIL;

if (!apiKey || !to) {
  results.push(["Email", false, "RESEND_API_KEY or RFQ_TO_EMAIL is empty in .env.local"]);
} else {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.RFQ_FROM_EMAIL || "Best Hydraulics <onboarding@resend.dev>",
        to: to.split(",").map((a) => a.trim()).filter(Boolean),
        subject: "Best Hydraulics — notification test",
        text:
          "This is a test from scripts/check-notifications.mjs.\n\n" +
          "If you are reading this, quote requests will reach this inbox.",
      }),
    });

    const detail = await response.text();
    if (response.ok) {
      results.push(["Email", true, `sent to ${to}`]);
    } else if (detail.includes("testing emails") || detail.includes("own email address")) {
      results.push([
        "Email",
        false,
        "Resend only delivers to the address that OWNS the Resend account while you use " +
          "onboarding@resend.dev.\n         Fix: sign up for Resend with " + to +
          ", or verify a domain and set RFQ_FROM_EMAIL to an address on it.",
      ]);
    } else {
      results.push(["Email", false, `Resend ${response.status}: ${detail.slice(0, 300)}`]);
    }
  } catch (error) {
    results.push(["Email", false, error.message]);
  }
}

// ── WhatsApp ────────────────────────────────────────────────────────────────
const phone = env.CALLMEBOT_PHONE?.replace(/[^0-9]/g, "");
const botKey = env.CALLMEBOT_APIKEY;

if (!phone || !botKey) {
  results.push(["WhatsApp", false, "CALLMEBOT_PHONE or CALLMEBOT_APIKEY is empty in .env.local"]);
} else {
  try {
    const text = "Best Hydraulics — notification test. Quote request alerts will arrive here.";
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
      `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(botKey)}`;

    const response = await fetch(url);
    const detail = await response.text();

    if (response.ok && !/error|invalid|not registered/i.test(detail)) {
      results.push(["WhatsApp", true, `sent to +${phone}`]);
    } else {
      results.push([
        "WhatsApp",
        false,
        `CallMeBot ${response.status}: ${detail.replace(/<[^>]+>/g, " ").trim().slice(0, 300)}`,
      ]);
    }
  } catch (error) {
    results.push(["WhatsApp", false, error.message]);
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log("\nNotification setup check\n" + "─".repeat(60));
for (const [channel, ok, detail] of results) {
  console.log(`${ok ? "  OK  " : " FAIL "} ${channel.padEnd(9)} ${detail}`);
}

const failed = results.filter(([, ok]) => !ok);
console.log("─".repeat(60));
console.log(
  failed.length === 0
    ? "Both channels are live. Check the inbox and the phone to confirm delivery.\n"
    : `${failed.length} channel(s) need attention. See the messages above.\n`,
);
process.exit(failed.length ? 1 : 0);
