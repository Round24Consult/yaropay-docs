# Security model

YaroPay moves no money itself: payments settle from the gateway straight to the company's account. What
it protects is the truth about payments (who paid, how much, for which product) and the secrets that
let someone act on the company's gateway account.

## Is this event really from the gateway?

- **Signature.** Paystack signs every webhook with `x-paystack-signature`: an HMAC-SHA512 of the exact
  body, using the company's Paystack secret key. Flutterwave sends the account's secret hash in
  `verif-hash`. YaroPay checks it before anything else; without the secret, nobody can produce it.
- **Confirmation.** A "success" is never taken from a webhook or a callback alone: YaroPay asks the
  gateway's API about the reference with the company's secret key.
- **Amount check.** The confirmed amount and currency must match what the payment was started with.
  Paying ₦1 against a ₦15,000 order is recorded as failed.
- **Duplicates.** Identical webhook bodies are stored once, and a payment's status only moves forward
  (pending → paid, paid → reversed), so a replayed event changes nothing.

## Webhook and callback URLs are not secrets

A URL like `/v1/webhooks/paystack/con_7k3m9q2xwd` is an address, like a PO box. Knowing it lets
someone send something to it, not make it believable.

| Someone tries to | What happens |
|---|---|
| Post a fake "payment succeeded" | No valid signature → `401`, recorded as "signature invalid", the gateway managers are notified, nothing is forwarded |
| Flood the URL with junk | Badly signed posts are capped: 20 per sending address per minute (then `429`) and at most 20 stored per gateway account every 10 minutes; large bodies are recorded by size only. Correctly signed events are never limited |
| Re-send a real event they captured | Stored once; status only moves forward; successes are re-confirmed with the gateway |
| Change the URL (other IDs, odd characters, SQL) | Only the exact route pattern matches; IDs are looked up with parameterised queries; a wrong combination answers `404` |
| Open a callback with `status=success` | Ignored: YaroPay asks the gateway. The customer is sent to the product's saved success, failure or cancel URL, never to an address taken from the request |
| Open a callback with `outcome=cancelled` | Only counts with YaroPay's signed cancel link (which only the customer's checkout receives) or when the gateway itself reports the checkout cancelled. Otherwise the payment stays open and no event is sent |
| Route events to another company's product | Routing never leaves the company that owns the gateway account; a test in the app repository (`apps/api/test/isolation.e2e.test.ts`) checks every route |

## Other risks, and whose job they are

| Risk | Protection | Responsibility |
|---|---|---|
| Fake events posted to a **product's** webhook, pretending to be YaroPay | The product verifies `x-yaropay-signature`, rejects old timestamps and repeated delivery IDs | The product (sample code on the product's Integration tab) |
| Product success page opened by hand with `status=success` | The product fulfils orders only from signed events or an API check | The product |
| Product API key leaked | It can start payments and read payment status for that product only; money still goes to the company's account and YaroPay has no payout API. Rotate the key | The product team; rotate in YaroPay |
| Signing secret leaked | Someone could forge events to the product. Rotate it; confirm high-value orders through the API | The product team |
| Gateway secret key leaked | Stored encrypted (AES-256-GCM), shown only masked, never sent to products. Product teams no longer need it at all | The install owner |
| Product webhook URL pointed at internal services | Production refuses private and internal addresses, doesn't follow redirects, and live mode needs https | YaroPay |
| Dashboard account taken over | Rate-limited sign-in, two-step sign-in with an authenticator app, optional 30-day trusted browsers (password still required, removed when the password changes), httpOnly session cookies, new-device alerts, roles and product scopes that limit each person | Members: turn on two-step sign-in |
| Server taken over | Firewall (SSH, HTTP, HTTPS only), fail2ban, automatic security updates, secrets encrypted with a key that never leaves the server | The install owner: SSH keys only, no password logins |

## Operator checklist

- Sign in to the server with SSH keys only, and turn off SSH password logins.
- Keep `YAROPAY_ENCRYPTION_KEY` in a password manager: database backups can't decrypt saved gateway keys
  without it.
- Rotate a product's API keys and signing secret whenever they have been shown somewhere public
  (screenshots, chat, tickets).
- Copy database backups off the server.
- Give people the smallest role that works, and limit them to the products they need.
- Turn on two-step sign-in for every owner and admin account.
