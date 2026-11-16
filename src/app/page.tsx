import type { Metadata } from "next"
import { DocArticle } from "@/components/doc-article"
import { JsonLd } from "@/components/json-ld"
import { DOC_PAGES, docSeo, renderDoc } from "@/lib/docs"
import { site } from "@/lib/site"

const page = DOC_PAGES.find((p) => p.slug === "")!

export async function generateMetadata(): Promise<Metadata> {
  const doc = await renderDoc(page)
  // The layout's title template only applies to pages below it, not to this one beside it.
  return { title: { absolute: `${page.title} · ${site.name} Docs` }, description: doc.description, ...docSeo(page, doc.description).metadata }
}

export default async function DocsHome() {
  const doc = await renderDoc(page)
  return (
    <>
      <JsonLd data={docSeo(page, doc.description).jsonLd} />
      <DocArticle doc={doc} />
    </>
  )
}
