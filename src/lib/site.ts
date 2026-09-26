/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in the deployment environment
 * once the real domain is live so sitemap, robots, and OpenGraph tags emit
 * absolute URLs that point at production.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.besthydraulics.online").replace(/\/$/, "");

export const siteName = "Best Hydraulics";

export const siteDescription =
  "Industrial supply partner for hydraulics, pneumatics, and industrial rubber components. Browse the catalog and request a quote for plant maintenance, OEM sourcing, and bulk supply across India.";

/** Single source for the shop's contact details — header, footer, contact page, and structured data all read from here. */
export const contact = {
  // First number is the primary line: WhatsApp, the header call button, and error messages use it.
  phones: [
    { tel: "9994703528", display: "9994703528" },
    { tel: "9443410833", display: "94434 10833" },
    { tel: "9842575335", display: "98425 75335" },
  ],
  email: "besthydraulicss@gmail.com",
  gstin: "33ACGPN4781M1Z6",
  address: "ALFA TOWER, No.4 John Bazaar, (Opp. Raja Theatre Bus Stop), Madurai Road, Trichy - 8",
  streetAddress: "Alfa Tower, No. 4, John Bazaar, Madurai Road (Opp. Raja Theatre Bus Stop)",
  locality: "Tiruchirappalli",
  region: "Tamil Nadu",
  postalCode: "620008",
};

export const primaryPhone = contact.phones[0].tel;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
