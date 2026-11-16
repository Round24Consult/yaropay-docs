// Serves the exported docs (out/) the way production does: under /docs, with /docs/x -> x.html.
import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize, resolve } from "node:path"

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain", ".json": "application/json" }

/** /x -> x, x.html or x/index.html inside root, like Caddy's try_files. */
function find(root, path) {
  const rel = normalize(path || "/").replace(/^(\.\.[/\\])+/, "")
  return [rel, `${rel}.html`, join(rel, "index.html")].map((c) => join(root, c)).find((f) => f.startsWith(root) && existsSync(f) && statSync(f).isFile())
}

function send(res, status, file) {
  res.writeHead(status, { "content-type": types[extname(file)] ?? "application/octet-stream" })
  createReadStream(file).pipe(res)
}

const root = resolve(import.meta.dirname, "..", "out")
const port = Number(process.env.PORT ?? 3101)

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://x")
  if (pathname !== "/docs" && !pathname.startsWith("/docs/")) {
    res.writeHead(302, { location: "/docs" }).end()
    return
  }
  const file = find(root, decodeURIComponent(pathname.slice("/docs".length)))
  if (file) send(res, 200, file)
  else send(res, 404, join(root, "404.html"))
}).listen(port, () => console.log(`Docs preview on http://localhost:${port}/docs`))
