import type { MetadataRoute } from "next";
import { getLmsUrl } from "@/configs/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getLmsUrl("/") }];
}
