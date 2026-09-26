# Best Hydraulics — Design Brief

The storefront for an industrial supplier of hydraulic, pneumatic, and rubber parts in Tiruchirappalli. Buyers are maintenance engineers, plant managers, and OEM procurement teams. The site should feel like a serious trade counter: precise, dense with useful facts, quick to request a quote. Never playful, never "startup SaaS".

Follow this brief for any UI work. If something here conflicts with a generic aesthetic default, this brief wins.

## Brand

- **Logo**: `images/brand/best-hydraulics-mark.png` is the transparent full-resolution emblem (hose fan with red ring); `best-hydraulics-mark.webp` (400px tall) is what the site serves. The source artwork is `images/brand logos/final logo.png`.
- **Lockup**: the emblem is the only image; "BEST HYDRAULICS" and "Solution of Hydraulics" are live text (`src/components/brand-lockup.tsx`). Never place the flattened logo PNG with its white background on a page.
- **Logo type**: Saira Italic (Google Fonts, `wdth` axis) — "BEST" weight 900 at 125% width, "HYDRAULICS" weight 800 at 90% width, tagline weight 300 at 87% width with +0.06em tracking between thin red rules. Load it from `src/lib/fonts.ts` (`logoFont`). Use it only for the wordmark — the hero lockup and the header brand text (wordmark only, no emblem, in the header) — never as a UI font.

## Colour

| Token | Value | Use |
|---|---|---|
| Navy (slate-950) | `#020617` | Header, footer, hero, dark cards, primary buttons on light |
| White / slate-50 | `#ffffff` / `#f8fafc` | Page and card surfaces |
| Slate 200–600 | Tailwind slate | Borders, secondary text, labels |
| `brand-red` | `#A20201` | Logo red on light surfaces |
| `brand-red-bright` | `#E2221E` | Brand red on dark surfaces (4.3:1 on navy; `#A20201` fails there) |

- Red is a brand accent, used sparingly: the logo, thin rules, at most one emphasis per view. It is also the error colour (`red-50/200/700`) — keep the two uses visually distinct.
- Blue appears only in small functional spots (cart count badge, links in confirmation text). Do not introduce blue or purple gradients.
- WhatsApp green (`emerald-500`) is reserved for the WhatsApp button.

## Typography

- **UI and body**: Geist Sans. **Display headings on light pages**: IBM Plex Sans via `.brand-font`.
- **Kicker labels**: uppercase, `text-[0.72rem] font-semibold`, tracking `0.22em`–`0.26em`, slate-500 on light / slate-200 at ~80% on dark. This is the site's signature detail — use it for section labels, not for body text.
- Headings are `font-semibold tracking-tight`; body copy `text-sm leading-6/7` in slate-600 (light) or slate-200 (dark).

## Shape, depth, spacing

- Corners are sharp: `rounded-[3px]` for controls and buttons, `rounded-[4px]` for cards. Avoid `rounded-xl`/`2xl` and pill buttons.
- One shadow family: `shadow-[0_10px_26px_rgba(15,23,42,0.04–0.08)]` on light, `shadow-[0_20px_60px_rgba(2,6,23,0.5)]` for floating dark panels.
- Layout width: `.container` (max 1320px, 16px gutters on mobile, 32px from 1024px). Never size layout with `100vw`.
- Buttons: `h-11`/`h-12`, `px-5`/`px-6`, `text-sm font-medium`. Primary on light = navy fill + white text; on dark = white fill + navy text; secondary = bordered.

## Imagery

- Product photos are real catalogue shots on a light grey ground, shown with `object-contain`. Only show a thumbnail when it is a genuinely different photo.
- Hero/banner photography is industrial machinery under a left-to-right navy gradient so text stays readable.
- Supplier logos (Festo, Janatics, Techno, Polyhose) appear as small badges on product imagery via `BrandBadge`.

## Content

- Plain, specific trade language: sizes, pressures, materials, HSN codes, GST notes, dispatch timelines.
- Customers never see stock levels; stock never blocks cart or quote requests (owner-only data).
- Contact details live only in `src/lib/site.ts`.

## Avoid

- Emoji as icons or status marks; use the line icons in `src/components/icons.tsx` (or add one there in the same 1.8 stroke style).
- Gradient text, glassmorphism, neon glows, decorative blobs, or animated gradients.
- Centred-everything hero layouts and identical three-card feature rows with generic icons.
- Filler copy ("Unlock the power of…", "Seamless", "Revolutionize").
- New colours, fonts, radii, or shadows outside this brief without a reason written down here.

## Known debt

- Many products show "Not Available" for description, HSN code, and part number — a catalogue data gap, not a layout problem.

## Verification

Before calling UI work done: check it in a real browser at 390px and 1280px (plus 768px for layout changes), confirm there is no horizontal overflow and no console errors, and compare the screenshots against this brief.
