import type { MetadataRoute } from "next";
import { getSaleUrl, saleSeoConfig } from "@/configs/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return saleSeoConfig.indexableRoutes.map((route) => ({
    url: getSaleUrl(route),
  }));
}
