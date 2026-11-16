"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/cn"

export interface NavGroup {
  title: string
  pages: { href: string; title: string }[]
}

/** The docs sidebar: groups of pages, with the current one highlighted. */
export function DocsNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname().replace(/\/$/, "") || "/"
  return (
    <nav aria-label="Documentation" className="space-y-6 text-sm">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">{g.title}</p>
          <ul className="mt-2 space-y-0.5">
            {g.pages.map((p) => {
              const active = pathname === p.href
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 transition-colors",
                      active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {p.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
