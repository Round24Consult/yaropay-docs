import Link from "next/link"

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-muted-foreground">It may have moved. Pick a page from the menu, or start from the beginning.</p>
      <div className="mt-8 flex justify-center gap-3">
        <a href="/" className="inline-flex h-10 items-center rounded-xl border bg-card px-4 text-sm font-medium hover:bg-muted">
          YaroPay home
        </a>
        <Link href="/" className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Getting started
        </Link>
      </div>
    </div>
  )
}
