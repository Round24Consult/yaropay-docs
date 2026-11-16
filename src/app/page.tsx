import type { Metadata } from "next"
import { DocArticle } from "@/components/doc-article"
import { DOC_PAGES, renderDoc } from "@/lib/docs"
import { site } from "@/lib/site"

const page = DOC_PAGES.find((p) => p.slug === "")!

export async function generateMetadata(): Promise<Metadata> {
  const doc = await renderDoc(page)
  // The layout's title template only applies to pages below it, not to this one beside it.
  return { title: { absolute: `${page.title} · ${site.name} Docs` }, description: doc.description }
}

export default async function DocsHome() {
  return <DocArticle doc={await renderDoc(page)} />
}
