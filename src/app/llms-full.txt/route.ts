import { DOC_PAGES, docMarkdown, docUrl } from "@/lib/docs"
import { site } from "@/lib/site"

export const dynamic = "force-static"

/** yaropay.com/docs/llms-full.txt: every docs page's Markdown in one file, for AI tools. */
export async function GET() {
  const parts = [`# ${site.name} Docs (all pages)`, "", `> ${site.description}`, ""]
  for (const page of DOC_PAGES) {
    parts.push("---", "", `Source: ${docUrl(page.slug)}`, "", (await docMarkdown(page)).trim(), "")
  }
  return new Response(parts.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } })
}
