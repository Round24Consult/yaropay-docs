# Integrating a product

A product can work with YaroPay in two ways. Use the **YaroPay API** for anything new; use **direct
mode** only for an app that already calls the gateway itself and can't change yet.

## What the product team receives

From the product's page in YaroPay (Integration tab, and once when the product is created):

| Item | Example | Keep it |
|---|---|---|
| Product ID | `prd_ztwwnwbrzv` | Anywhere; it isn't secret |
| Live API key | `ypk_live_…` | On the server only. Starts real payments |
| Test API key | `ypk_test_…` | On the server only. Starts test payments |
| Webhook signing secret | `whsec_…` | On the server only. Proves events came from YaroPay |

The keys and the secret are shown once. If one leaks, rotate it under the product's Settings; the old one
stops working immediately.

## Option 1: the YaroPay API (recommended)

### Start a payment

```http
POST {base}/v1/products/{productId}/payments
Authorization: Bearer ypk_live_…
Content-Type: application/json
Idempotency-Key: order-1042

{
  "amount": 1500000,
  "currency": "NGN",
  "email": "customer@example.com",
  "gateway": "default",
  "metadata": { "orderId": "1042" }
}
```

- `amount` is in minor units (kobo, cents, pesewas): `1500000` is ₦15,000.
- `gateway` is `default` (the product's default account for the key's mode), `paystack` or `flutterwave`.
- `reference` is optional. If you send one it must start with the product's prefix, for example
  `SHW_ORDER1042`; otherwise YaroPay makes one.
- `Idempotency-Key`: send the same key again (for example after a timeout) and you get the same payment
  back instead of a second one.

The answer includes `id`, `reference`, `status` and `authorizationUrl`. Send the customer to
`authorizationUrl`.

### The customer comes back

After checkout YaroPay sends the customer to the product's success, failure or cancel page with
`?reference=…&status=success|failed|cancelled|pending&payment_id=…`.

**Never give value because of these parameters.** Anyone can type that URL. Show a friendly page, then
wait for the signed event, or check the payment yourself:

```http
GET {base}/v1/products/{productId}/payments/{reference}?refresh=1
Authorization: Bearer ypk_live_…
```

`refresh=1` asks the gateway for the latest status before answering.

### Receive events

YaroPay posts each status change once to the product's webhook endpoint:

- Headers: `x-yaropay-signature: t=<unix seconds>,v1=<hex>`, `x-yaropay-event`, `x-yaropay-delivery`.
- `v1` is the HMAC-SHA256 of `"<t>.<raw body>"` with the product's signing secret.
- Body: `{ "id", "type", "mode", "createdAt", "data": { "id", "reference", "productId", "gateway",
  "amount", "fee", "currency", "status", "channel", "customer", "metadata", "paidAt" } }`.

Your endpoint should:

1. Compute the HMAC over the **raw** body and compare it with `v1` in constant time.
2. Reject timestamps more than 5 minutes old (stops replays).
3. Ignore a `x-yaropay-delivery` ID it has already processed (deliveries can repeat).
4. Answer any 2xx status quickly, then do the work.

Anything other than 2xx is retried: after 1 minute, 5 minutes, 30 minutes, 2, 6, 12 and 24 hours
(8 attempts over about 45 hours). Failed deliveries can be replayed from YaroPay → Webhooks.

### Moving an existing Paystack integration

If the product already has a Paystack webhook handler (for example `/api/paystack/webhook`):

- Events now come from **YaroPay**, in YaroPay's format, signed with `x-yaropay-signature` and the
  product's `whsec_` secret, not `x-paystack-signature`. Update the handler, or give YaroPay a new
  endpoint and retire the old one.
- Event types are `payment.succeeded`, `payment.failed`, `payment.abandoned` and `payment.reversed`
  instead of Paystack's `charge.success` and friends.
- The product no longer needs the Paystack secret key: remove it from the product's server once every
  payment goes through YaroPay.

## Option 2: direct mode

The product keeps calling the gateway itself, with the company's gateway keys. For YaroPay to recognise
its payments, every payment the product starts must:

- set `callback_url` (Paystack) or `redirect_url` (Flutterwave) to the product's YaroPay callback URL,
  `{base}/v1/callback/{productId}/{gateway}`, and
- either use a reference that starts with the product's prefix, or put `yaropay_product: {productId}`
  in the metadata.

The gateway's webhook still goes to YaroPay (set once per gateway account), and the product receives
YaroPay's signed events exactly as in option 1.

One difference: in direct mode YaroPay doesn't create the cancel link, so a customer who closes a
Paystack checkout isn't reported as abandoned (Flutterwave confirms cancellations itself, so those are).

## Test mode

Use the test API key with gateway test accounts (Paystack test keys). Test-mode payments, events and
deliveries are kept apart from live ones; switch the dashboard between Live and Test at the top of the
sidebar. "Send test event" on the product's page posts a signed `test.ping` to the product's endpoint.
