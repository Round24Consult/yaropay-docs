"use client"

import { Moon, Sun } from "lucide-react"
import { THEME_STORAGE_KEY } from "@/lib/theme"

/** Flips between light and dark and remembers the choice (shared with the dashboard on the same browser). */
export function ThemeToggle() {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.style.colorScheme = dark ? "dark" : "light"
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light")
    } catch {
      // Private mode or blocked storage: the change still applies for this page.
    }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark"
      className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </button>
  )
}
