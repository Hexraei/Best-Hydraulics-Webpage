/**
 * Best Hydraulics — live product catalog sync for Google Sheets.
 *
 * Setup:
 *   1. Create a blank Google Sheet.
 *   2. Extensions -> Apps Script. Delete the default code, paste this file in.
 *   3. Project Settings (gear icon) -> Script Properties -> add a property
 *      named DATABASE_URL with your Neon connection string as the value
 *      (the same one in .env.local). Do not paste the connection string
 *      directly into this file — script properties keep it out of the
 *      visible source when the sheet is shared as view-only.
 *   4. Run the `syncNow` function once from the Apps Script editor (Run menu)
 *      and approve the permission prompts (it needs to call an external URL
 *      and edit the spreadsheet).
 *   5. Back in the sheet: Extensions -> Apps Script -> Triggers (clock icon)
 *      -> Add Trigger -> choose `syncNow`, event source "From spreadsheet",
 *      event type "On open". This is what makes it refresh every time
 *      someone opens the sheet.
 *   6. Share the sheet as Viewer (view-only) with link sharing on. Viewers
 *      can still File -> Download a copy (.xlsx / .csv) — view-only sharing
 *      only blocks editing the live sheet, not downloading it.
 *
 * Each sync clears and rewrites all three tabs from scratch, so it's always
 * a full, accurate snapshot of the database — never a partial/stale merge.
 */

const CATEGORIES = ["Hydraulics", "Pneumatics", "Industrial Rubber"];

// Mirrors the canonical spec ordering in src/lib/specs.ts (specRank) so the
// "Specs" column reads the same way here as it does on the website: Model,
// then any code, then Description, then other attributes, then dimensions.
// Apps Script can't import from the Next.js codebase, so this is a copy —
// keep it in sync if specRank() in src/lib/specs.ts ever changes.
function specRank(name) {
  const key = name.trim().toLowerCase();
  if (/^model\b/.test(key)) return 0;
  if (/\b(hsn|code|sku)\b/.test(key) || /^(part|item)\b/.test(key)) return 1;
  if (/^(description|name)\b/.test(key)) return 2;
  if (/\b(size|length|bore|stroke|height|width|diameter|dimension|od|id)\b/.test(key)) return 4;
  return 3;
}

function orderedSpecs(specs) {
  return specs
    .map((spec, index) => ({ spec, index, rank: specRank(spec.name) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.spec);
}

function onOpen() {
  syncNow();
}

function syncNow() {
  const dbUrl = PropertiesService.getScriptProperties().getProperty("DATABASE_URL");
  if (!dbUrl) {
    throw new Error("DATABASE_URL script property is not set. See setup instructions at the top of this file.");
  }

  const products = runQuery(
    dbUrl,
    "SELECT id, slug, name, category, family, brand, material, pressure_rating, hsn_code, part_number FROM products ORDER BY category, sort_order",
  );
  const variants = runQuery(
    dbUrl,
    "SELECT product_id, specs, price, stock FROM variants ORDER BY product_id, sort_order",
  );

  // Group variants by their product so each product's rows sit together.
  const variantsByProduct = {};
  for (const v of variants) {
    if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
    variantsByProduct[v.product_id].push(v);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  for (const category of CATEGORIES) {
    const sheet = ss.getSheetByName(category) ?? ss.insertSheet(category);
    sheet.clear();

    const headers = [
      "Product",
      "Brand",
      "Family",
      "Material",
      "HSN Code",
      "Part Number",
      "Specs",
      "Price (INR)",
      "Stock",
    ];
    const rows = [headers];

    const categoryProducts = products.filter((p) => p.category === category);
    for (const product of categoryProducts) {
      const productVariants = variantsByProduct[product.id] ?? [];
      if (productVariants.length === 0) {
        rows.push([product.name, product.brand ?? "", product.family ?? "", product.material ?? "", product.hsn_code ?? "", product.part_number ?? "", "", "", ""]);
        continue;
      }
      for (const v of productVariants) {
        const specsText = orderedSpecs(v.specs ?? [])
          .map((s) => `${s.name}: ${s.value}`)
          .join(" | ");
        rows.push([
          product.name,
          product.brand ?? "",
          product.family ?? "",
          product.material ?? "",
          product.hsn_code ?? "",
          product.part_number ?? "",
          specsText,
          v.price,
          v.stock,
        ]);
      }
    }

    sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);

    // A visible timestamp so viewers can see how fresh the data is, placed
    // one column past the last data column so it never overlaps real data.
    sheet.getRange(1, headers.length + 2).setValue(`Last synced: ${new Date().toLocaleString()}`);
    sheet.autoResizeColumns(1, headers.length + 2);
  }
}

/**
 * Runs one SQL statement against Neon's HTTP SQL endpoint and returns the
 * rows as plain objects. This is the same protocol the `neon()` driver from
 * @neondatabase/serverless uses — Apps Script has no Postgres driver, but it
 * can call this HTTP endpoint directly with UrlFetchApp.
 *
 * The endpoint host is NOT the same host as the connection string: Neon
 * serves the SQL-over-HTTP API on a sibling hostname with the first DNS
 * label replaced by "api." (e.g. ep-xyz-pooler.c-10.us-east-1.aws.neon.tech
 * -> api.c-10.us-east-1.aws.neon.tech). This is the same rewrite the real
 * driver applies internally.
 */
function runQuery(dbUrl, sql) {
  const match = dbUrl.match(/^postgres(?:ql)?:\/\/[^@]+@([^/]+)\//);
  if (!match) throw new Error("Could not parse DATABASE_URL.");
  const hostWithPort = match[1].split(":")[0];
  const apiHost = hostWithPort.replace(/^[^.]+\./, "api.");

  const response = UrlFetchApp.fetch(`https://${apiHost}/sql`, {
    method: "post",
    contentType: "application/json",
    headers: {
      "Neon-Connection-String": dbUrl,
    },
    payload: JSON.stringify({ query: sql, params: [] }),
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() !== 200) {
    throw new Error(`Neon query failed (${response.getResponseCode()}): ${response.getContentText()}`);
  }

  // No array-mode header is sent, so Neon returns each row as a plain
  // object keyed by column name — no manual field/value zipping needed.
  const body = JSON.parse(response.getContentText());
  return body.rows;
}
