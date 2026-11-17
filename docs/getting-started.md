# Getting started

YaroPay is payment orchestration for companies that run several products on one Paystack or
Flutterwave account. Every payment, gateway event and webhook stays with the product that started it,
and product teams never need the gateway's secret keys.

## Editions

| Edition | Where it runs | Price | For |
|---|---|---|---|
| **Community** | Your own server | Free, open source (AGPL-3.0) | One company, unlimited products, every gateway, signed webhooks, roles and notifications |
| **Cloud** | app.yaropay.com, run by us | Per live product per month; test mode is free | Teams that don't want to run servers |
| **Enterprise** | Your own server | Per live product per month, with a licence key | Single sign-on, enforced 2FA, custom roles, audit export, refunds and reconciliation, several companies per install |

A **live product** is one that took at least one live payment in the month. Products in test mode are
never billed.

## Choose how to start

- **Self-host for free**: run YaroPay with Docker on any server. See [Self-hosting with Docker](self-hosting.md).
- **Cloud**: YaroPay Cloud is in early access. Email [hello@yaropay.com](mailto:hello@yaropay.com) to get a
  workspace.

## Your first ten minutes

1. **Create the owner account.** A new install opens on `/setup`. Internet-facing installs need the
   setup link with its token (`/setup?token=…`), so nobody else can claim the install first.
2. **Take the tour.** It explains the idea in three short steps and lets you load sample data to look
   around. Sample data is clearly labelled and removed in one click.
3. **Follow the setup guide** on the dashboard. Each step ticks itself off as soon as YaroPay sees it
   happen:
   1. Set your public URL (an https address gateways can reach).
   2. Connect a payment gateway (Apps → Paystack or Flutterwave).
   3. Paste YaroPay's webhook URL into the gateway's dashboard. Done when the first signed event arrives.
   4. Add your first product.
   5. Take a test payment with the product's test API key.
   6. Receive events in your product: send a test event and answer it with any 2xx status.
   7. Invite your team (optional).

## Next

- [How YaroPay works](how-it-works.md): who sets up what, and how a payment travels.
- [Integrating a product](integrating-a-product.md): what a product team needs and does.
- [API reference](api-reference.md): endpoints, events and signatures.
- [Security model](security.md): what stops forged requests.
