import { DOC_GROUPS, docUrl, renderDoc } from "@/lib/docs"
import { site } from "@/lib/site"

export const dynamic = "force-static"

/** yaropay.com/docs/llms.txt: the docs as a list of links with one-line summaries, for AI tools (llmstxt.org). */
export async function GET() {
  const lines = [`# ${site.name} Docs`, "", `> ${site.description}`, ""]
  for (const group of DOC_GROUPS) {
    lines.push(`## ${group.title}`, "")
    for (const page of group.pages) {
      const { description } = await renderDoc(page)
      lines.push(`- [${page.title}](${docUrl(page.slug)})${description ? `: ${description}` : ""}`)
    }
    lines.push("")
  }
  lines.push("## Optional", "", `- [Every page in one file](${docUrl("llms-full.txt")})`, `- [Website](${site.url})`, "")
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } })
}
