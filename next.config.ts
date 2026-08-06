import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Product images uploaded through the admin area.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    // Some local networks' DNS resolvers return a NAT64-synthesized IPv6
    // address for Blob storage alongside the real IPv4 one; Next's image
    // optimizer refuses to fetch it as an SSRF precaution, breaking uploaded
    // product photos in dev. Production (Vercel) has correct DNS and is
    // unaffected, so optimization stays on there.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
