import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocArticle } from "@/components/doc-article"
import { JsonLd } from "@/components/json-ld"
import { DOC_PAGES, docSeo, renderDoc } from "@/lib/docs"

export const dynamicParams = false

export function generateStaticParams() {
  return DOC_PAGES.filter((p) => p.slug).map((p) => ({ slug: p.slug }))
}

const find = (slug: string) => DOC_PAGES.find((p) => p.slug && p.slug === slug)

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const page = find((await params).slug)
  if (!page) return {}
  const doc = await renderDoc(page)
  return { title: page.title, description: doc.description, ...docSeo(page, doc.description).metadata }
}

export default async function DocPage({ params }: PageProps<"/[slug]">) {
  const page = find((await params).slug)
  if (!page) notFound()
  const doc = await renderDoc(page)
  return (
    <>
      <JsonLd data={docSeo(page, doc.description).jsonLd} />
      <DocArticle doc={doc} />
    </>
  )
}
