import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    minimumCacheTTL: 2678400,
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.carlogos.org",
      },
      {
        protocol: "https",
        hostname: "uozokadcvzmhszatgqcu.supabase.co",
      },
    ],
  },
};

export default nextConfig;
