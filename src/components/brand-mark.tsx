import { cn } from "@/lib/cn"

/** Three product lanes converging into one route. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm", className)} aria-hidden>
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
        <path d="M4 6c5 0 6 6 10 6h6" />
        <path d="M4 12h16" opacity={0.85} />
        <path d="M4 18c5 0 6-6 10-6" />
        <circle cx="20" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  )
}
