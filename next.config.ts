import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.carlogos.org",
      },
    ],
  },
};

export default nextConfig;
