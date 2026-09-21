import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/core"],
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
      {
        protocol: "https",
        hostname: "demo.invalid",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "api.vietqr.io",
      },
      {
        protocol: "https",
        hostname: "cdn.vietqr.io",
      },
    ],
  },
  async rewrites() {
    if (!apiBaseUrl) {
      return [];
    }

    const formattedBaseUrl = apiBaseUrl.replace(/\/$/, "");

    return [
      {
        source: "/api/ai/:path*",
        destination: `${formattedBaseUrl}/api/ai/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${formattedBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
