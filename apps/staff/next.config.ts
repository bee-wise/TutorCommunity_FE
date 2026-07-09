import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui', '@workspace/core'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;



