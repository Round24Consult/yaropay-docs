import { cn } from "@/lib/cn"

/** YaroPay's mark: a Y whose left branch runs down the stem, turns at the tail and climbs back up as a P. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm", className)} aria-hidden>
      <svg viewBox="0 0 64 64" className="size-full" fill="none" stroke="currentColor" strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 11C20 18 25.5 19.12 25.5 25V47A6 6 0 0 0 37.5 47V29.5H42.5A7 7 0 0 1 42.5 43.5H37.5" />
        <path d="M36.5 11C31 18 25.5 19.12 25.5 25" />
        <circle cx="14.5" cy="11" r="3.6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  )
}
