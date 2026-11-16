// Shared by yaropay-site (yaropay.com) and yaropay-docs (yaropay.com/docs): keep both copies the same.
// They are separate apps on one domain, so links between them are plain <a> tags, not next/link.
import { BrandMark } from "@/components/brand-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import { site } from "@/lib/site"

const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#security", label: "Security" },
  { href: "/docs", label: "Docs" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2.5 rounded-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          <BrandMark />
          {site.name}
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <a href={`${site.appUrl}/login`} className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex">
            Sign in
          </a>
          <a href="/docs" className="inline-flex h-9 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Get started
          </a>
        </div>
      </div>
      <nav aria-label="Main" className="flex gap-1 overflow-x-auto border-t px-3 py-1.5 text-sm md:hidden">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="shrink-0 rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            {n.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
