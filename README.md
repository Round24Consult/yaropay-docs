# YaroPay docs

The documentation for [YaroPay](https://yaropay.com), published at **https://yaropay.com/docs**.

The pages are the Markdown files in [`docs/`](docs). Each page on the site ends with an "Edit this page
on GitHub" link to its file here.

## Fixing or adding a page

- **Fix a page:** edit its file in `docs/` (on GitHub or locally) and open a pull request.
- **Add a page:** add the `.md` file to `docs/` and list it in [`src/lib/docs.ts`](src/lib/docs.ts). That
  list sets the order, the sidebar groups and the URL.
- **Link to another page** by its file name, for example `[Security model](security.md)` or
  `[Events](api-reference.md#events)`. The site turns that into `/docs/security`, and the link still works
  when reading the files on GitHub.
- Describe what the product does today. If a feature is only in a paid edition, say so where it comes up.

## Preview locally

Node.js 22.12 or newer:

```bash
npm ci
npm run dev      # http://localhost:3101/docs, updates as you edit
npm run build    # the static site, in out/
npm start        # serves out/ the way production does
```

## How it is published

`npm run build` exports plain HTML, CSS and JavaScript to `out/` (a Next.js static export with the
`/docs` base path). Pull requests are built and checked by GitHub Actions. Merging to `main` uploads
`out/` to the YaroPay server, where Caddy serves it at yaropay.com/docs. The rest of yaropay.com is a
separate site.
