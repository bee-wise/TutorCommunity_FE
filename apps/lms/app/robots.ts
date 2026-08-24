import type { MetadataRoute } from "next";
import { getLmsUrl, lmsSeoConfig } from "@/configs/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: "/lms/",
    },
    sitemap: getLmsUrl("/sitemap.xml"),
    host: lmsSeoConfig.siteUrl,
  };
}
