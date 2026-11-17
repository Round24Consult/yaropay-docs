# API reference

Product servers use two things: the **payments API** (to start and look up payments) and **events**
(YaroPay posts them to the product's webhook endpoint). `{base}` is the install's public URL, for
example `https://app.yaropay.com`.

## Authentication

Send the product's API key as a bearer token:

```http
Authorization: Bearer ypk_live_…
```

The key decides both the product and the mode: `ypk_live_…` uses the product's live gateway accounts,
`ypk_test_…` its test accounts. A key only works for its own product's URLs.

## Start a payment

`POST {base}/v1/products/{productId}/payments`

| Field | Type | Required | Notes |
|---|---|:-:|---|
| `amount` | integer | ✓ | Minor units (kobo, cents, pesewas). `1500000` = ₦15,000 |
| `currency` | string | ✓ | `NGN`, `USD`, `GHS`, `KES` or `ZAR` |
| `email` | string | ✓ | The customer's email |
| `name` | string | | The customer's name |
| `gateway` | string | | `default` (the product's default account for the key's mode) or a gateway id: `paystack`, `flutterwave`, `stripe`, `paypal`, `monnify` or `korapay` (see [Gateways](gateways.md)) |
| `reference` | string | | Must start with the product's prefix, e.g. `SHW_ORDER1042`. YaroPay makes one if you don't send it |
| `channels` | string[] | | Limit payment methods: `card`, `bank_transfer`, `ussd`, `mobile_money`, `bank`, `qr` |
| `metadata` | object | | Your own data (up to 4 KB). Sent back in every event |

Headers: `Idempotency-Key` (optional). Repeating a request with the same key returns the same payment
(`200`) instead of creating another.

**Response** `201 Created`:

```json
{
  "id": "txn_…",
  "reference": "SHW_9F2K1C7Q4M",
  "productId": "prd_…",
  "gateway": "paystack",
  "connectionId": "con_…",
  "mode": "live",
  "amount": 1500000,
  "currency": "NGN",
  "status": "pending",
  "channel": null,
  "authorizationUrl": "https://checkout.paystack.com/…",
  "metadata": { "orderId": "1042" },
  "createdAt": "2026-11-16T10:00:00.000Z",
  "paidAt": null
}
```

Send the customer to `authorizationUrl`.

## Look up a payment

`GET {base}/v1/products/{productId}/payments/{reference}`

Returns the same shape. Add `?refresh=1` to ask the gateway for the latest status first.

## Errors

Every error has the same shape:

```json
{ "error": { "message": "Some fields need attention", "code": "validation_failed", "fields": { "amount": "Amount must be in minor units (an integer)" } } }
```

| Status | When |
|---|---|
| `401` | Missing or wrong API key, or a key for another product (`invalid_api_key`) |
| `404` | No such payment |
| `409` | The product is paused, or has no gateway account for the key's mode |
| `422` | A field is invalid (`validation_failed`, with `fields`) |
| `429` | Too many requests |
| `502` | The gateway refused or couldn't be reached. The payment is recorded as failed |

## Events

YaroPay posts one event per status change to the product's webhook endpoint.

| Event | When |
|---|---|
| `payment.succeeded` | The gateway confirmed the payment and the amount matched |
| `payment.failed` | The payment failed, or the confirmed amount didn't match |
| `payment.abandoned` | The customer cancelled the checkout (proven by YaroPay's signed cancel link or the gateway) |
| `payment.reversed` | A successful payment was reversed |
| `test.ping` | Sent from the dashboard with "Send test event" |

**Headers**

| Header | Value |
|---|---|
| `x-yaropay-signature` | `t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with the signing secret>` |
| `x-yaropay-event` | The event type |
| `x-yaropay-delivery` | The delivery ID. Use it to ignore repeats |

**Body**

```json
{
  "id": "pev_…",
  "type": "payment.succeeded",
  "mode": "live",
  "createdAt": "2026-11-16T10:01:12.000Z",
  "data": {
    "id": "txn_…",
    "reference": "SHW_9F2K1C7Q4M",
    "productId": "prd_…",
    "gateway": "paystack",
    "amount": 1500000,
    "fee": 0,
    "currency": "NGN",
    "status": "success",
    "channel": "card",
    "customer": { "email": "customer@example.com", "name": "" },
    "metadata": { "orderId": "1042" },
    "paidAt": "2026-11-16T10:01:10.000Z"
  }
}
```

**Verifying.** Split `x-yaropay-signature` into `t` and `v1`. Compute HMAC-SHA256 over `t + "." + raw
body` with the product's signing secret, compare it with `v1` in constant time, and reject `t` more
than 5 minutes from now. Use the raw request body, before any JSON parsing.

**Delivery.** Any 2xx answer within 10 seconds counts as delivered. Anything else is retried after
1 minute, 5 minutes, 30 minutes, 2, 6, 12 and 24 hours: 8 attempts over about 45 hours. YaroPay
doesn't follow redirects. Failed deliveries can be replayed from the dashboard.

## Customer redirects

After checkout the customer lands on the product's success, failure or cancel page with:

| Parameter | Value |
|---|---|
| `reference` | The payment reference |
| `status` | `success`, `failed`, `cancelled` or `pending` |
| `payment_id` | YaroPay's payment ID |

These parameters are for showing the right message only. Fulfil orders from verified events or a
payment lookup.
