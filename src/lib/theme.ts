export const THEME_STORAGE_KEY = "yaropay-theme"

/** Runs in <head> before first paint, so dark mode never flashes light. Same key as the dashboard. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`
