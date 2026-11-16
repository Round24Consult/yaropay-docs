import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { DocsNav } from "@/components/docs-nav"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { DOC_GROUPS, docHref } from "@/lib/docs"
import { site } from "@/lib/site"
import { themeScript } from "@/lib/theme"
import "./globals.css"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} Docs`, template: `%s · ${site.name} Docs` },
  description: site.description,
  robots: { index: true, follow: true },
  openGraph: { siteName: site.name, type: "website", images: [{ url: `${site.url}/og-image.png`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: [`${site.url}/og-image.png`] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const groups = DOC_GROUPS.map((g) => ({ title: g.title, pages: g.pages.map((p) => ({ href: docHref(p.slug), title: p.title })) }))
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background">
        <SiteHeader />
        <main className="mx-auto flex max-w-7xl gap-10 px-4 py-10 sm:px-6" data-docs>
          <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 self-start overflow-y-auto md:block">
            <DocsNav groups={groups} />
          </aside>
          <div className="min-w-0 flex-1">
            <details className="mb-8 rounded-xl border bg-card md:hidden">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium">Documentation menu</summary>
              <div className="border-t p-3">
                <DocsNav groups={groups} />
              </div>
            </details>
            {children}
          </div>
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
