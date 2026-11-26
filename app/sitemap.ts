import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/builder", "/guides", ...guides.map((g) => `/guides/${g.slug}`), "/about", "/privacy"].map((p) => ({ url: base + p, lastModified: new Date() }));
}
