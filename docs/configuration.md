# Configuration

YaroPay is configured with environment variables. In Docker, set them on the `api` service.

## API

| Variable | Default | What it does |
|---|---|---|
| `DATABASE_URL` | empty | Postgres connection string. Empty uses the embedded database (PGlite) in `PGLITE_DIR`, for development. |
| `YAROPAY_ENCRYPTION_KEY` | development key | 32 random bytes, base64 (`openssl rand -base64 32`). Encrypts gateway keys, signing secrets and the alerts URL. **Required in production.** |
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
| `RATE_LIMIT` | on | Per-address limits on sign-in, password reset and invite endpoints. |
| `SESSION_DAYS` | `30` | How long a sign-in lasts without activity. |
| `PAYSTACK_API_URL`, `FLUTTERWAVE_API_URL` | the official APIs | Override for a proxy or sandbox. |
| `GATEWAY_TIMEOUT_MS` | `15000` | How long YaroPay waits for Paystack or Flutterwave. |
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
