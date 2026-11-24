# AI assistants (MCP)

Connect Claude, Cursor, VS Code and other AI apps to YaroPay, then ask them about your payments in plain
words: "why did SHW_7MMYPYS4HW fail?", "how did LedgerPro do this month compared with last month?",
"which webhooks to our products are failing?". The apps talk to YaroPay through the
[Model Context Protocol](https://modelcontextprotocol.io) (MCP).

AI apps are part of YaroPay Enterprise (when the licence includes them) and YaroPay Cloud. Community
doesn't include them.

## What an AI app can see

An AI app connects as **one member of one company** and sees what that member may see:

- **Their role and products.** A viewer's app has no audit log; a member limited to some products sees
  only those products' payments, deliveries and analytics.
- **Test data, unless live is allowed.** A connection reads test mode only. Live data needs the
  company's OK (Settings → AI apps → Live data), two-step sign-in on the member's account, and the member
  choosing **Live data too** with their password and code. If the company turns live data off, every
  connection loses it straight away.
- **Masked customers, unless shared.** Customer emails come back as `ke***@example.com` and names as
  initials, unless an admin turns on **Customer details**. Searching by a full email still works.
- **Never keys or secrets.** Gateway keys, product API keys and signing secrets never leave YaroPay.

AI apps can read for now. Asking YaroPay to do things (re-check a payment with the gateway, retry a
webhook, create a payment link) is coming next, and each of those will wait for the member's approval in
YaroPay.

## Connecting an app

1. Open **Settings → AI apps** and choose **New token**. Give it a name ("Claude Code on my laptop") and
   how long it lasts (at most 90 days). Copy the token: YaroPay shows it once.
2. Add YaroPay to your AI app with the MCP server URL shown on that page, `https://<your domain>/mcp`:

**Claude Code**

```bash
claude mcp add --transport http yaropay https://app.yaropay.com/mcp --header "Authorization: Bearer <your token>"
```

**Cursor** (`~/.cursor/mcp.json`)

```json
{ "mcpServers": { "yaropay": { "url": "https://app.yaropay.com/mcp", "headers": { "Authorization": "Bearer <your token>" } } } }
```

**VS Code** (`.vscode/mcp.json`, VS Code asks for the token)

```json
{
  "servers": { "yaropay": { "type": "http", "url": "https://app.yaropay.com/mcp", "headers": { "Authorization": "Bearer ${input:yaropay-token}" } } },
  "inputs": [{ "type": "promptString", "id": "yaropay-token", "description": "YaroPay AI app token", "password": true }]
}
```

Any other app that takes an MCP server URL and a header works the same way. Self-hosted installs use
their own domain. One-click sign-in for apps such as Claude on the web and ChatGPT, without copying a
token, is coming soon.

## Tools

| Tool | What it answers |
|---|---|
| `get_connection_info` | Which company, member and role this is, test or live, and whether customers are masked |
| `list_products`, `get_product` | Products and their gateway accounts (with live access, live figures for the last 30 days) |
| `list_payments` | Payments by period, status, product, gateway, channel, or a search on reference, email or name |
| `get_payment` | One payment's timeline, the gateway events received for it and the webhooks sent to the product |
| `get_analytics` | Volume, successful payments, success rate and average order, with the previous period and splits |
| `list_gateway_accounts` | Gateway accounts with their mode and status |
| `list_webhook_events` | Events the gateways sent, routed or not (payloads only on request, personal details hidden) |
| `list_webhook_deliveries`, `get_webhook_delivery` | Signed events sent to the products, with state, status code and retries |
| `list_audit_log` | Recent changes: who did what, and when |

Amounts are in minor units (kobo, cents) with a formatted amount beside them. Tools an app's member
can't use don't appear in its list at all.

## Company controls

Owners and admins (anyone who can change settings) see every member's tokens on **Settings → AI apps**
and can revoke any of them. They also decide:

| Control | Default |
|---|---|
| AI apps on or off for the company | On |
| Which roles may connect | All |
| Live data | Off |
| Customer details | Masked |

A token stops working when it expires, when it's revoked, when the member is removed, and when the
member changes or resets their password or turns two-step sign-in off. If the plan or licence no longer
includes AI apps, or the company turns them off, the app can still connect but only gets an explanation.

## Activity

Every question an AI app asks is listed under **Activity** on the same page for 90 days: when, which
app, which member, which tool, test or live, and whether it was answered or refused. Members see their
own; owners and admins see everyone's. Customer details are never stored there.

## Limits

Each connection can make 120 requests a minute, and a company's apps together 600. Self-hosted installs
can change both (see [Configuration](configuration.md)).

## Prompt injection

Customer names, payment metadata and gateway messages come from outside your company, so YaroPay sends
them to the AI app inside marked data blocks with an instruction never to follow what's written there.
Keep your AI app's own confirmation prompts on, and be wary of any app that asks you to paste a token
somewhere you didn't choose.
