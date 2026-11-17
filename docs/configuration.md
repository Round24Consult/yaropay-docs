# Configuration

YaroPay is configured with environment variables. In Docker, set them on the `api` service.

If you deploy with the repository's Deploy workflow, you can keep these as GitHub secrets or variables
named `ENV_<NAME>` (for example `ENV_SMTP_URL`) instead of editing the server's `.env`. Each deploy, or
**Actions → Deploy → Run workflow**, merges them into `.env`, keeps the previous file as
`.env.bak-<time>`, logs only the names it changed, and restarts the app. `YAROPAY_ENCRYPTION_KEY` and the
`POSTGRES_*` values can't be set this way: changing them needs the rotation procedure or a database
change. Deleting a secret on GitHub doesn't remove the key from the server; set the value you want
instead. The list of keys the workflow accepts is in the README, under "Changing server settings from
GitHub".

## API

| Variable | Default | What it does |
|---|---|---|
| `DATABASE_URL` | empty | Postgres connection string. Empty uses the embedded database (PGlite) in `PGLITE_DIR`, for development. |
| `YAROPAY_ENCRYPTION_KEY` | development key | 32 random bytes, base64 (`openssl rand -base64 32`). Encrypts gateway keys, signing secrets, the alerts URL and authenticator secrets. **Required in production.** |
| `YAROPAY_ENCRYPTION_KEY_PREVIOUS` | none | Only while rotating the key: the old key (comma-separated if several). Still read, never written. See [Self-hosting](/docs/self-hosting#rotating-the-encryption-key). |
| `SETUP_TOKEN` | none | When set, creating the first (owner) account needs it, from `/setup?token=…` or the setup form. **Set it on any install reachable from the internet.** |
| `DASHBOARD_URL` | `http://localhost:3000` | Where people open the dashboard: CORS, the origin check on form posts, links in emails. |
| `YAROPAY_BASE_URL` | `http://localhost:4000` | The public URL suggested on first run. It feeds every callback and webhook URL; change it later in Settings → General. |
| `SMTP_URL` | empty | Email for invites, password resets and notifications, e.g. `smtp://user:pass@smtp.example.com:587`. Empty writes emails to the log. |
| `MAIL_FROM` | `YaroPay <no-reply@yaropay.local>` | Sender of those emails. Use an address on a domain your mail provider has verified. |
| `COOKIE_SECURE` | `auto` | Secure session cookie. `auto` turns it on in production. |
| `TRUST_PROXY` | `loopback` | Which proxies to trust for the client's address (rate limits, audit log). Behind Docker and a reverse proxy, use `loopback, uniquelocal`. |
| `WEBHOOK_ALLOW_PRIVATE` | on in development, off in production | Allows product webhook URLs on private networks. Leave it off on internet-facing installs. |
| `WEBHOOK_TIMEOUT_MS` | `10000` | How long YaroPay waits for a product's webhook endpoint. |
| `WORKERS` | on | Runs the delivery and email workers. Several API instances can share them safely. |
| `RATE_LIMIT` | on | Per-address limits on sign-in, password reset and invite endpoints, and the per-company product API limit below. |
| `V1_RATE_LIMIT_PER_MINUTE` | `1200` | Product API requests one company can make each minute, across all its products and keys. Over it, requests get `429` with `Retry-After`. |
| `SESSION_DAYS` | `30` | How long a sign-in lasts without activity. |
| `<GATEWAY>_API_URL` | the gateway's official API | Points one gateway at a proxy or a mock, for example `PAYSTACK_API_URL` or `FLUTTERWAVE_API_URL`. The name is the gateway's id in capitals. |
| `GATEWAY_TIMEOUT_MS` | `15000` | How long YaroPay waits for a gateway's API. |
| `LOG_LEVEL` | `log` | `error`, `warn`, `log`, `debug` or `verbose`. |
| `PORT`, `HOST` | `4000`, `0.0.0.0` | Where the API listens. |
| `YAROPAY_DISABLE_EE` | off | Enterprise builds only: run as Community, ignoring the paid features. Useful when debugging. |

## Dashboard

| Variable | Default | What it does |
|---|---|---|
| `YAROPAY_API_URL` | `http://localhost:4000` | Where the dashboard forwards `/api` and `/v1`. It's compiled in when the dashboard is built, so the `yaropay/web` image uses `http://api:4000`. |

The dashboard forwards `/api` and `/v1` to the API, so the browser only ever talks to one address and
the session cookie stays first-party. The dashboard's address can also serve as the install's public
URL: gateway webhooks and callbacks reach the API through it.
