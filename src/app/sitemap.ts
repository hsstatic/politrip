import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.politrip.com.tr";
const LANGS = ["en", "tr", "ar"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/destination", "/hotels"];

  const entries: MetadataRoute.Sitemap = [];

  for (const lang of LANGS) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
