import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
