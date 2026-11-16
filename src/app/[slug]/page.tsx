import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocArticle } from "@/components/doc-article"
import { DOC_PAGES, renderDoc } from "@/lib/docs"

export const dynamicParams = false

export function generateStaticParams() {
  return DOC_PAGES.filter((p) => p.slug).map((p) => ({ slug: p.slug }))
}

const find = (slug: string) => DOC_PAGES.find((p) => p.slug && p.slug === slug)

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const page = find((await params).slug)
  if (!page) return {}
  const doc = await renderDoc(page)
  return { title: page.title, description: doc.description }
}

export default async function DocPage({ params }: PageProps<"/[slug]">) {
  const page = find((await params).slug)
  if (!page) notFound()
  return <DocArticle doc={await renderDoc(page)} />
}
