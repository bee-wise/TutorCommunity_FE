import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui', '@workspace/core'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;



