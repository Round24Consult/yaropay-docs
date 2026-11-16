# How YaroPay works

YaroPay sits between your products and your payment gateway account. A company with several products
(websites, SaaS apps, mobile apps) usually has one Paystack or Flutterwave account. Without YaroPay,
every product needs that account's secret key, and every payment event lands in one webhook that has
to work out which product it belongs to. YaroPay holds the gateway keys once, starts payments for each
product, and sends each product only its own payments.

## Who sets up what

| Who | Where | What they do | How often |
|---|---|---|---|
| Install owner or admin | YaroPay → Apps | Adds the gateway account: public key and secret key (Paystack), or keys and secret hash (Flutterwave) | Once per gateway account |
| Install owner or admin | Gateway dashboard (Paystack: Settings → API Keys & Webhooks) | Pastes YaroPay's **webhook URL** for that account. The callback URL there is only a fallback: YaroPay sets the real one on every payment | Once per gateway account |
| Install owner or admin | YaroPay → Products → New product | Creates the product: name, website, reference prefix, which gateway accounts it uses, and its own webhook, success, failure and cancel URLs | Once per product |
| Product developer | Their own server | Stores the product's YaroPay API keys and signing secret, starts payments through YaroPay, receives YaroPay's signed events | Once per product |

The product developer never needs the gateway's secret key.

## What happens during a payment

1. **The product asks for a payment.** Its server calls `POST /v1/products/{productId}/payments` with
   the product's YaroPay API key. A live key (`ypk_live_…`) uses the live gateway accounts; a test key
   (`ypk_test_…`) uses the test ones.
2. **YaroPay starts it on the gateway** with the company's secret key. It stamps a reference with the
   product's prefix (for example `SHW_9F2K1C7Q4M`), adds the product ID to the payment's metadata, and
   sets the callback URL to the product's YaroPay callback. It returns the checkout link.
3. **The customer pays** on the gateway's checkout page.
4. **The gateway reports back twice.** It sends the customer's browser to YaroPay's callback URL, and
   posts a signed webhook to the gateway account's YaroPay webhook URL. Whichever arrives first settles
   the payment; YaroPay confirms it with the gateway's API either way.
5. **YaroPay hands the result to the right product.** The customer is sent to the product's success,
   failure or cancel page, and the product's server receives one signed event
   (`payment.succeeded`, `payment.failed`, `payment.abandoned` or `payment.reversed`), retried until it
   answers with a 2xx status.

## How YaroPay knows which product a payment belongs to

Only inside the company that owns the gateway account, in this order:

1. **The reference already exists**, because the payment was started through YaroPay, which recorded the product.
2. **The metadata names the product**: `yaropay_product: prd_…`.
3. **The reference starts with the product's prefix**, for example `SHW_`.

If none of these match, the event is **Unrouted**: kept under Webhooks for review and sent to no product.
Payments made outside YaroPay (a Paystack payment page, an old integration) usually land here.

## The URLs YaroPay generates

| URL | What it's for | Where it goes |
|---|---|---|
| `{base}/v1/webhooks/{gateway}/{connectionId}` | The gateway posts payment events here | Gateway dashboard, once per gateway account |
| `{base}/v1/callback/{productId}/{gateway}` | The gateway sends the customer back here | Set by YaroPay on each payment (`callback_url` / `redirect_url`) |
| `{base}/v1/callback/{gateway}/{connectionId}` | Fallback callback | Gateway dashboard "Callback URL" (optional) |
| `{base}/v1/products/{productId}/payments` | Starts a payment | The product's server |

`{base}` is the install's public URL (Settings → General), for example `https://app.yaropay.com`.
