# Enterprise licence

YaroPay Enterprise is the self-hosted edition with paid features: several companies on one install,
custom roles, single sign-on, required two-step sign-in, audit log export, more gateways, refunds,
settlement reconciliation and scheduled reports. You run the Enterprise build on your own server and add
a licence key, which decides which of those features the install can use.

To get YaroPay Enterprise, email [hello@yaropay.com](mailto:hello@yaropay.com). You receive the
Enterprise build and a licence key.

## Which edition is running

Open **Settings → Licence**. The page names the edition (Community, Enterprise or Cloud) and lists every
paid feature, ticked when this company can use it and locked when it can't. The API also logs the
edition when it starts, for example `API listening on http://localhost:4000 (enterprise edition)`.

## Adding the key

1. Sign in as an owner or admin.
2. Open **Settings → Licence**, paste the key into **Licence key** and choose **Add licence key**.

The key is checked on your server, offline: YaroPay never sends it anywhere. A key that was changed in
any way, or wasn't issued by YaroPay, is refused. Adding a key is recorded in the audit log, and a new
key replaces the old one.

## When a licence expires

| When | Paid features | Payments, webhooks and everything in Community |
|---|---|---|
| Before the expiry date | Work | Work |
| For 14 days after it | Keep working, with a reminder on the Licence page | Work |
| After those 14 days | Locked until you add a renewed key | Work |

A lapsed licence never stops payments. Products keep taking payments, gateway events keep being routed
and your products keep receiving their events.

## Removing the key

**Settings → Licence → Remove licence** locks the paid features straight away. Nothing else changes,
and you can add the key again later.
