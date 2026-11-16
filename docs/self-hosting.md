# Self-hosting with Docker

The Community edition runs on any server with Docker. It is three containers: the **API**, the
**dashboard** and **Postgres**. Put a reverse proxy in front for HTTPS.

## Requirements

- Docker Engine 24 or newer, with Docker Compose v2 (`docker compose`).
- 1 vCPU and 2 GB of RAM to start; 2 vCPU and 4 GB or more for real traffic.
- A domain name pointing at the server, so gateways can reach your webhook URLs over HTTPS.

## Images

| Image | What it is |
|---|---|
| `yaropay/api` | The API: payments, gateway webhooks, deliveries to your products, the dashboard's data |
| `yaropay/web` | The dashboard. It forwards `/api` and `/v1` to a service named `api` on port 4000 |

Both are published on Docker Hub for `linux/amd64` and `linux/arm64` with each release. Tags: `latest`,
and each release version (for example `0.1.0`). Pin a version in production and upgrade on purpose.

> The first release is coming soon. Until the images are on Docker Hub, build them from source (see
> [Building from source](#building-from-source)); everything else on this page is the same.

## 1. Create the folder and secrets

```bash
mkdir yaropay && cd yaropay
cat > .env <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 24)
YAROPAY_ENCRYPTION_KEY=$(openssl rand -base64 32)
SETUP_TOKEN=$(openssl rand -hex 24)
APP_DOMAIN=pay.example.com
SMTP_URL=
MAIL_FROM=YaroPay <no-reply@example.com>
EOF
chmod 600 .env
```

- `YAROPAY_ENCRYPTION_KEY` encrypts saved gateway keys and signing secrets. Copy it to your password
  manager: a database backup can't decrypt saved keys without it.
- `SETUP_TOKEN` protects first-run setup. Without it, whoever opens `/setup` first becomes the owner.
- `SMTP_URL` sends invites and password resets, for example
  `smtp://user:password@in-v3.mailjet.com:587`. Left empty, emails are written to the API log.

## 2. Write `docker-compose.yml`

```yaml
services:
  caddy:
    image: caddy:2.11-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443", "443:443/udp"]
    environment:
      APP_DOMAIN: ${APP_DOMAIN}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
    depends_on: [web]

  web:
    image: yaropay/web:latest
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy

  api:
    image: yaropay/api:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://yaropay:${POSTGRES_PASSWORD}@postgres:5432/yaropay
      YAROPAY_ENCRYPTION_KEY: ${YAROPAY_ENCRYPTION_KEY}
      SETUP_TOKEN: ${SETUP_TOKEN}
      DASHBOARD_URL: https://${APP_DOMAIN}
      YAROPAY_BASE_URL: https://${APP_DOMAIN}
      COOKIE_SECURE: "true"
      TRUST_PROXY: loopback, uniquelocal
      SMTP_URL: ${SMTP_URL}
      MAIL_FROM: ${MAIL_FROM}
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: yaropay
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: yaropay
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yaropay -d yaropay"]
      interval: 5s
      retries: 20

volumes:
  pgdata:
  caddy_data:
```

The dashboard image expects the API service to be called `api`. Only Caddy publishes ports; the API,
dashboard and database stay on Docker's private network.

## 3. Write the `Caddyfile`

```text
{$APP_DOMAIN} {
	reverse_proxy web:3000
}
```

Caddy gets and renews a Let's Encrypt certificate automatically once the domain points at the server
and ports 80 and 443 are open.

## 4. Start it

```bash
docker compose up -d
docker compose logs -f api   # "API listening" means it's ready
```

Open `https://pay.example.com/setup?token=<SETUP_TOKEN from .env>` and create the owner account. The
API applies database migrations itself on start.

## 5. Connect your gateway

In the dashboard, open **Settings → General** and check the public URL is your https domain. Then add
Paystack or Flutterwave under **Apps** and paste the webhook URL it shows into the gateway's dashboard.
The setup guide on the dashboard walks you through the rest.

## Backups

```bash
# Back up (compressed custom format)
docker compose exec -T postgres pg_dump -U yaropay -Fc yaropay > yaropay-$(date +%F).dump

# Restore into an empty database
docker compose exec -T postgres pg_restore -U yaropay -d yaropay --clean --if-exists < yaropay-2026-11-16.dump
```

Copy backups off the server, and keep `YAROPAY_ENCRYPTION_KEY` with them (separately).

## Upgrading

```bash
docker compose exec -T postgres pg_dump -U yaropay -Fc yaropay > before-upgrade.dump
docker compose pull
docker compose up -d
```

Read the release notes first. Migrations run when the new API starts; the backup lets you go back.

## Building from source

The app repository's `docker-compose.yml` builds both images from source and adds Mailpit
(http://localhost:8025) to catch emails:

```bash
git clone https://github.com/Round24Consult/yaropay.git && cd yaropay
cp .env.example .env    # set YAROPAY_ENCRYPTION_KEY
docker compose up -d --build
```

The dashboard's API address is compiled in at build time: build the `web` image with
`--build-arg YAROPAY_API_URL=http://api:4000` (the default) or your own address.

## Without Docker

You need Node.js 22.12 or newer and Postgres 17. In a clone of the app repository:

```bash
npm install
npm run build
DATABASE_URL=postgres://… YAROPAY_ENCRYPTION_KEY=… node apps/api/dist/main.js
YAROPAY_API_URL=http://localhost:4000 npm run start -w @yaropay/web
```

See [Configuration](configuration.md) for every setting.
