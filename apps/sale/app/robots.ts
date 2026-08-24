import type { MetadataRoute } from "next";
import { getSaleUrl, saleSeoConfig } from "@/configs/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...saleSeoConfig.privateRoutes],
    },
    sitemap: getSaleUrl("/sitemap.xml"),
    host: saleSeoConfig.siteUrl,
  };
}
