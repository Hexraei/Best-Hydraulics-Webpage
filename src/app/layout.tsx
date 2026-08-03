import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { CartProvider } from "@/components/cart-provider";
import { StorefrontChrome } from "@/components/storefront-chrome";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
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
  alternates: { canonical: "/" },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
              telephone: ["+919994703528", "+919443410833", "+919842575335"],
              email: "alfaruberss@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kasthuri Complex, No 6 Chann bazzar, Madurai Rd, Tharanallur",
                addressLocality: "Tiruchirappalli",
                addressRegion: "Tamil Nadu",
                postalCode: "620008",
                addressCountry: "IN",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
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
