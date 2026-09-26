import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { CartProvider } from "@/components/cart-provider";
import { StorefrontChrome } from "@/components/storefront-chrome";
import { contact, siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandSans = IBM_Plex_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Hydraulics, Pneumatics & Industrial Rubber Supply`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "hydraulic hoses",
    "hydraulic fittings",
    "pneumatic cylinders",
    "pneumatic valves",
    "industrial rubber sheets",
    "industrial spare parts",
    "Tiruchirappalli",
    "industrial supplier India",
  ],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} | Hydraulics, Pneumatics & Industrial Rubber Supply`,
    description: siteDescription,
    url: siteUrl,
    locale: "en_IN",
    images: [{ url: "/images/hero-catalog.jpg", width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Industrial Component Supply`,
    description: siteDescription,
    images: ["/images/hero-catalog.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Google is verified by DNS TXT; these are a fallback and Bing's primary route.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? [],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} ${brandSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Helps Google surface the shop's phone, address, and hours directly in results. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HardwareStore",
              name: siteName,
              description: siteDescription,
              url: siteUrl,
              image: `${siteUrl}/images/hero-catalog.jpg`,
              telephone: contact.phones.map((phone) => `+91${phone.tel}`),
              email: contact.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: contact.streetAddress,
                addressLocality: contact.locality,
                addressRegion: contact.region,
                postalCode: contact.postalCode,
                addressCountry: "IN",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
                  opens: "09:30",
                  closes: "21:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Friday"],
                  opens: "09:30",
                  closes: "12:30",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Friday"],
                  opens: "14:30",
                  closes: "21:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Sunday"],
                  opens: "10:30",
                  closes: "13:00",
                },
              ],
              foundingDate: "2017",
              areaServed: "IN",
            }),
          }}
        />
        <AppShell>
          <CartProvider>
            <StorefrontChrome>{children}</StorefrontChrome>
          </CartProvider>
        </AppShell>
      </body>
    </html>
  );
}
