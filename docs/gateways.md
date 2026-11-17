# Gateways

YaroPay works with the payment gateways below. Every gateway is free in every edition, Community
included. Customers always pay on the gateway's own checkout page, so card details never pass through
YaroPay, and money goes straight from the gateway to your account.

| Gateway | Status | Customers can pay with | Currencies |
|---|---|---|---|
| Paystack | Available | Cards, bank transfer, USSD, mobile money and QR | NGN, GHS, KES, ZAR, USD |
| Flutterwave | Available | Cards, mobile money and bank transfer | NGN, GHS, KES, ZAR, USD |
| Stripe | Beta | Cards, wallets and local payment methods | 130+, including USD, EUR, GBP, NGN and JPY |
| PayPal | Beta | PayPal balance, cards and Pay Later | 24, including USD, EUR, GBP, JPY and AUD |
| Monnify | Beta | Bank transfer, cards and USSD | NGN |
| Korapay | Beta | Cards, bank transfer and mobile money | NGN, KES, GHS, USD, XAF, XOF, TZS and EGP |

More are on the way, including crypto gateways. To ask for one, [open an issue](https://github.com/Round24Consult/yaropay/issues);
to build one, see [Adding a gateway](https://github.com/Round24Consult/yaropay/blob/main/docs/adding-a-gateway.md).

## What "beta" means

A **beta** gateway is fully usable. It was built from the gateway's official documentation and tested
against the responses that documentation describes, but it hasn't yet been confirmed with a real sandbox
payment. The dashboard marks it with a Beta badge. Run a few test-mode payments before going live, and
please [report](https://github.com/Round24Consult/yaropay/issues) anything that doesn't match what the
gateway shows. A gateway becomes **available** once real sandbox payments confirm it.

## Connecting a gateway

1. Open **Apps** and choose the gateway.
2. Paste its keys for test mode, live mode or both. YaroPay checks them with the gateway and stores them
   encrypted.
3. Copy the webhook URL YaroPay shows and follow the steps on screen to add it in the gateway's dashboard.
4. Pick the account as a product's default for that mode, or name the gateway when you start a payment
   (`"gateway": "stripe"`).

You never set a return or redirect URL in the gateway's dashboard: YaroPay sends each product's return and
cancel URLs with every payment.

## Gateway notes

### Stripe

Paste your secret key (`sk_test_…` or `sk_live_…`). After installing, add a webhook endpoint in the Stripe
Dashboard (Developers → Webhooks) with YaroPay's URL, choose the events YaroPay lists, and paste the
endpoint's signing secret (`whsec_…`) into the account's **Webhook signing secret**. Until then YaroPay
can't check Stripe's events and confirms payments only when the customer returns.

### PayPal

Paste your app's Client ID and Secret from the PayPal Developer Dashboard (Sandbox for test mode, Live for
live mode). After installing, add a webhook in the same app with YaroPay's URL and the events it lists, and
paste the webhook's ID into the account's **Webhook ID**: PayPal checks its own events through that ID.
PayPal payments need a final capture step, which YaroPay does for you when the customer returns or when
PayPal reports the approval, whichever comes first.

### Monnify

Paste your API key, secret key and contract code. In the Monnify dashboard (Developer → Webhook URLs),
paste YaroPay's URL as the Transaction Completion URL. If your firewall only lets known addresses reach
YaroPay, allow Monnify's webhook address, `35.242.133.146`.

### Korapay

Paste your secret key. In the Korapay dashboard (Settings → API Configuration), paste YaroPay's URL as the
Notification URL. Korapay accepts at most five metadata fields per payment, so keep the metadata you send
with each payment short.
