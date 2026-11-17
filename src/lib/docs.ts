import { readFile } from "node:fs/promises"
import { join } from "node:path"
import rehypeShiki from "@shikijs/rehype"
import type { Element, Root as HastRoot } from "hast"
import { toString as hastToString } from "hast-util-to-string"
import type { Link, Root as MdRoot } from "mdast"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import { site } from "@/lib/site"

/**
 * The docs are the Markdown files in this repository's docs/ folder (the same files GitHub shows).
 * This list decides their order, groups and URLs on yaropay.com/docs.
 */
export interface DocPage {
  slug: string
  file: string
  title: string
}

export const DOC_GROUPS: { title: string; pages: DocPage[] }[] = [
  {
    title: "Start",
    pages: [
      { slug: "", file: "getting-started.md", title: "Getting started" },
      { slug: "how-it-works", file: "how-it-works.md", title: "How YaroPay works" },
    ],
  },
  {
    title: "Integrate",
    pages: [
      { slug: "integrating-a-product", file: "integrating-a-product.md", title: "Integrating a product" },
      { slug: "api-reference", file: "api-reference.md", title: "API reference" },
      { slug: "gateways", file: "gateways.md", title: "Gateways" },
    ],
  },
  {
    title: "Run",
    pages: [
      { slug: "self-hosting", file: "self-hosting.md", title: "Self-hosting with Docker" },
      { slug: "configuration", file: "configuration.md", title: "Configuration" },
      { slug: "team-and-roles", file: "team-and-roles.md", title: "Team, roles and notifications" },
      { slug: "cloud", file: "cloud.md", title: "YaroPay Cloud: plans and billing" },
      { slug: "enterprise-licence", file: "enterprise-licence.md", title: "Enterprise licence" },
      { slug: "security", file: "security.md", title: "Security model" },
    ],
  },
  {
    title: "Legal",
    pages: [
      { slug: "licences", file: "licences.md", title: "Licences" },
      { slug: "contributor-agreement", file: "contributor-agreement.md", title: "Contributor License Agreement" },
    ],
  },
]

export const DOC_PAGES = DOC_GROUPS.flatMap((g) => g.pages)

/** The site is served under yaropay.com/docs (next.config.ts `basePath`). */
export const BASE_PATH = "/docs"

/** A page's path for next/link, which adds the base path itself. */
export const docHref = (slug: string) => (slug ? `/${slug}` : "/")

/** The page's file on GitHub, opened in the editor. */
export const editUrl = (page: DocPage) => `${site.docsRepo}/edit/main/docs/${page.file}`

const DOCS_DIR = join(process.cwd(), "docs")

export interface RenderedDoc {
  page: DocPage
  html: string
  description: string
  toc: { id: string; text: string; depth: 2 | 3 }[]
}

/** Links between docs (`security.md`, `./api-reference.md#events`) become site URLs. They end up in plain
 * HTML, so they carry the base path themselves. */
function remarkDocLinks() {
  const byFile = new Map(DOC_PAGES.map((p) => [p.file, p.slug]))
  return (tree: MdRoot) => {
    visit(tree, "link", (node: Link) => {
      const m = /^(?:\.\/)?(?:docs\/)?([a-z0-9-]+\.md)(#.*)?$/.exec(node.url)
      if (m && byFile.has(m[1])) node.url = `${BASE_PATH}${docHref(byFile.get(m[1])!).replace(/^\/$/, "")}${m[2] ?? ""}`
    })
  }
}

/** Collects h2/h3 headings (after rehype-slug gave them ids) for the "On this page" list. */
function rehypeToc(out: RenderedDoc["toc"]) {
  return () => (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && typeof node.properties?.id === "string") {
        out.push({ id: node.properties.id, text: hastToString(node), depth: node.tagName === "h2" ? 2 : 3 })
      }
    })
  }
}

export async function renderDoc(page: DocPage): Promise<RenderedDoc> {
  const markdown = await readFile(join(DOCS_DIR, page.file), "utf8")
  const toc: RenderedDoc["toc"] = []
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDocLinks)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeToc(toc))
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      test: ["h2", "h3"],
      properties: { className: ["anchor"], ariaHidden: "true", tabIndex: -1 },
      content: { type: "text", value: "#" },
    })
    .use(rehypeShiki, { themes: { light: "github-light", dark: "github-dark" }, defaultColor: false, defaultLanguage: "text", fallbackLanguage: "text" })
    .use(rehypeStringify)
    .process(markdown)
  // The first paragraph after the title doubles as the page's description.
  const description = (/^#[^\n]*\n+([^\n#|`][^\n]*(?:\n[^\n#|`][^\n]*)*)/m.exec(markdown)?.[1] ?? "").replace(/\s+/g, " ").replace(/[*_`]|\[([^\]]+)\]\([^)]*\)/g, "$1").trim()
  return { page, html: String(file), description, toc }
}

/** A docs page's full public URL, e.g. https://yaropay.com/docs/self-hosting. */
export const docUrl = (slug: string) => `${site.url}${BASE_PATH}${slug ? `/${slug}` : ""}`

/** The page's Markdown source, as written (for llms-full.txt). */
export async function docMarkdown(page: DocPage): Promise<string> {
  return readFile(join(DOCS_DIR, page.file), "utf8")
}

/** The group a page belongs to (for breadcrumbs). */
export function docGroup(page: DocPage): string {
  return DOC_GROUPS.find((g) => g.pages.includes(page))?.title ?? "Docs"
}

/** SEO for one docs page: canonical URL, share card and structured data (TechArticle + breadcrumbs). */
export function docSeo(page: DocPage, description: string) {
  const url = docUrl(page.slug)
  const image = { url: `${site.url}/og-image.png`, width: 1200, height: 630 }
  return {
    metadata: {
      alternates: { canonical: url },
      openGraph: { type: "article" as const, url, title: `${page.title} · ${site.name} Docs`, description, siteName: site.name, images: [image] },
      twitter: { card: "summary_large_image" as const, title: `${page.title} · ${site.name} Docs`, description, images: [image.url] },
    },
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: page.title,
        description,
        url,
        image: image.url,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: `${site.name} Docs`, url: docUrl("") },
        publisher: { "@type": "Organization", name: site.company, url: site.url },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: site.url },
          { "@type": "ListItem", position: 2, name: "Docs", item: docUrl("") },
          ...(page.slug ? [{ "@type": "ListItem", position: 3, name: page.title, item: url }] : []),
        ],
      },
    ],
  }
}
