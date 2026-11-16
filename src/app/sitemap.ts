import type { MetadataRoute } from "next"
import { DOC_PAGES, docUrl } from "@/lib/docs"

export const dynamic = "force-static"

/** yaropay.com/docs/sitemap.xml: every docs page. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return DOC_PAGES.map((p) => ({ url: docUrl(p.slug), lastModified: now, changeFrequency: "weekly", priority: p.slug ? 0.7 : 0.9 }))
}
