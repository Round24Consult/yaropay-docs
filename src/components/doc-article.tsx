import { ArrowLeft, ArrowRight, Pencil } from "lucide-react"
import Link from "next/link"
import { DOC_PAGES, docHref, editUrl, type RenderedDoc } from "@/lib/docs"

/** One docs page: the rendered Markdown, an "On this page" list and previous/next links. */
export function DocArticle({ doc }: { doc: RenderedDoc }) {
  const i = DOC_PAGES.findIndex((p) => p.slug === doc.page.slug)
  const prev = DOC_PAGES[i - 1]
  const next = DOC_PAGES[i + 1]
  return (
    <div className="flex min-w-0 gap-10">
      <article className="min-w-0 flex-1">
        <div className="prose max-w-[72ch]" dangerouslySetInnerHTML={{ __html: doc.html }} />
        <a href={editUrl(doc.page)} className="mt-12 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <Pencil className="size-3.5" /> Edit this page on GitHub
        </a>
        <nav aria-label="More docs" className="mt-6 grid gap-3 border-t pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={docHref(prev.slug)} className="group rounded-xl border p-4 transition-colors hover:bg-muted/60">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="size-3" /> Previous
              </span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={docHref(next.slug)} className="group rounded-xl border p-4 text-right transition-colors hover:bg-muted/60">
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                Next <ArrowRight className="size-3" />
              </span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </article>
      {doc.toc.length > 1 && (
        <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto xl:block">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {doc.toc.map((t) => (
              <li key={t.id} className={t.depth === 3 ? "pl-3" : ""}>
                <a href={`#${t.id}`} className="text-muted-foreground transition-colors hover:text-foreground">
                  {t.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  )
}
