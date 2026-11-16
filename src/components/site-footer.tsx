// Shared by yaropay-site (yaropay.com) and yaropay-docs (yaropay.com/docs): keep both copies the same.
// They are separate apps on one domain, so links between them are plain <a> tags, not next/link.
import { BrandMark } from "@/components/brand-mark"
import { site } from "@/lib/site"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#security", label: "Security" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Getting started" },
      { href: "/docs/integrating-a-product", label: "Integrating a product" },
      { href: "/docs/api-reference", label: "API reference" },
      { href: "/docs/self-hosting", label: "Self-hosting with Docker" },
    ],
  },
  {
    title: "Company",
    links: [
      ...(site.contactEmail ? [{ href: `mailto:${site.contactEmail}`, label: "Contact us" }] : []),
      { href: `${site.appUrl}/login`, label: "Sign in" },
      { href: "/docs/security", label: "Security model" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <BrandMark className="size-7" />
            {site.name}
          </a>
          <p className="max-w-xs text-sm text-muted-foreground">{site.tagline} Open source and self-hostable, with a hosted Cloud edition.</p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-medium">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.company}. {site.name} Community is open source under the AGPL-3.0.
          </p>
          <p>Payments settle straight from your gateway to your account. {site.name} never holds funds.</p>
        </div>
      </div>
    </footer>
  )
}
