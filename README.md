individual# Best Hydraulics

Best Hydraulics is a mobile-responsive industrial supply website for hydraulics, pneumatics, and industrial rubber components. It is designed for procurement teams, maintenance buyers, OEM users, and workshop operators who need a structured way to browse parts, review technical options, and send quote requests directly to the shop owner.

## What this website is

This website is a premium B2B catalog and RFQ platform for industrial spare parts. It presents products in a clean, trustworthy, and procurement-oriented layout instead of a typical ecommerce style. The interface is built to feel technical, organized, and reliable across home, catalog, product detail, contact, and cart experiences.

## Core goals

- Present industrial products in a professional catalog format
- Make it easy to search, filter, and compare items
- Let customers add products to cart and send RFQ requests
- Route quote requests directly to the shop owner with customer details
- Keep the experience mobile responsive across all pages
- Use updated product and background imagery throughout the site

## Main features

### 1. Industrial homepage

- Large industrial hero section with strong branding
- Trust-focused messaging
- Featured product highlights
- Procurement-style visual hierarchy
- Direct links to products, contact, and quote actions

### 2. Premium product catalog

- Two-column catalog layout
- Sticky technical filter rail
- Search bar for fast product discovery
- Compact product cards with image, title, category, price, and CTA
- Results overview shown after searching

### 3. Product detail pages

- Dedicated product pages for each item
- Clear product visuals
- Variant and quantity selection
- Procurement-focused product presentation
- Easy add-to-cart flow

### 4. Cart and RFQ system

- Cart review page for selected products
- Customer details form for name, business name, phone number, email ID, and message
- RFQ request flow that sends enquiry details to the shop owner
- Cart item summary included in quote requests
- Supports blank enquiry submissions for callback requests

### 5. Contact page

- Industrial-style contact layout
- Clickable phone numbers
- Clickable email address
- Clickable map/address link
- Operating hours and support information

### 6. Footer and header

- Professional industrial navigation
- Contact shortcuts
- Brand-consistent footer with store details
- Clear access to products, cart, and contact pages

## Planned product scale

The catalog is designed to grow well beyond the current product set. The site will be updated with 100+ products over time, covering items such as:

- Hydraulic hoses
- Hydraulic fittings
- Hydraulic valves
- Pneumatic valves
- Pneumatic cylinders
- Air tubes and fittings
- Seals and seal kits
- Rubber sheets
- Rubber gaskets
- Industrial machine components

## RFQ workflow

The RFQ flow is built to help customers request pricing without needing a full checkout-first ecommerce flow.

### Expected flow

1. Browse products
2. Add required items to cart
3. Open cart and review items
4. Enter customer details and extra message
5. Send the RFQ — the site emails the shop inbox and sends the owner a WhatsApp alert
6. Receive follow-up on pricing, availability, and service support

The cart is saved in the browser, so a customer can close the tab mid-list and
come back to it later.

### Information captured in RFQ

- Customer name
- Business name (optional)
- Phone number
- Email ID
- Extra message
- Cart items and quantities

## Mobile responsiveness

The site is built to work smoothly on phones, tablets, and desktops. Layouts reflow for smaller screens, cards stay readable, and the catalog and RFQ experience remain usable on mobile devices.

## Image updates

All key pages are intended to use properly updated industrial images, including:

- Hydraulic equipment
- Pneumatic components
- Industrial hardware
- Warehouse and factory visuals
- Technical close-up product shots

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Setup: RFQ notifications

Quote requests are delivered two ways: an email to the store inbox and a WhatsApp
alert to the owner's phone. Both are free tiers. Copy `.env.example` to
`.env.local` and fill in the values below — until you do, the form tells the
customer to phone the shop instead of failing silently.

### Email (Resend — 3,000/month free, no card)

1. Sign up at [resend.com](https://resend.com).
2. **API Keys → Create API Key**, sending access. Copy it into `RESEND_API_KEY`.
3. Set `RFQ_TO_EMAIL` to the inbox that should receive quote requests.
4. Leave `RFQ_FROM_EMAIL` as the default to start.

> **Important:** with the default `onboarding@resend.dev` sender, Resend only
> delivers to the email address that owns the Resend account. To deliver to
> `alfaruberss@gmail.com`, either sign up for Resend using that address, or add a
> domain under **Domains**, verify its DNS records, and set `RFQ_FROM_EMAIL` to
> something like `quotes@yourdomain.in`.

### WhatsApp (CallMeBot — free, no account)

1. On the owner's phone, save **+34 684 783 347** as a contact (any name, e.g. "CallMeBot").
2. From the owner's WhatsApp, message that contact exactly:
   `I allow callmebot to send me messages`
3. Within ~2 minutes the bot replies `API Activated for your phone number.
   Your APIKEY is 1234567`. Put that number in `CALLMEBOT_APIKEY`.
   If nothing arrives, wait 24 hours before retrying.
4. Set `CALLMEBOT_PHONE` to the owner's number with country code, digits only
   (e.g. `919994703528`).

The API key is tied to the number that requested it — changing
`CALLMEBOT_PHONE` means repeating steps 1–3 from that phone. CallMeBot allows
roughly one message per minute, which is ample for RFQ volume.

### Deploying

Set the same variables in your host's environment settings (on Vercel:
**Settings → Environment Variables**). Also set `NEXT_PUBLIC_SITE_URL` to the
live domain so `sitemap.xml`, `robots.txt`, and social preview tags emit correct
absolute URLs.

## Summary

Best Hydraulics is a serious industrial supply website built to support procurement, technical buying, and RFQ-driven sales. It focuses on reliability, clarity, and structured product presentation, with room to expand into a large industrial catalog of 100+ products.
