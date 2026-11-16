# YaroPay Cloud: plans and billing

YaroPay Cloud is YaroPay run for you at [app.yaropay.com](https://app.yaropay.com): hosted, updated and
backed up, with HTTPS and email already set up. It works exactly like a self-hosted install. This page
covers what's different: signing up, the trial, and how billing works.

## Signing up

Create your company at [app.yaropay.com/signup](https://app.yaropay.com/signup) with your name, work
email, a password and your company name, and choose whether YaroPay bills you in naira or US dollars.
We email you a link to confirm your address; it works for 24 hours. Until you open it you can't sign
in. If it expired, sign in and ask for a new one.

Sign-ups open in stages. If the page says they aren't open yet, email
[hello@yaropay.com](mailto:hello@yaropay.com) for early access.

## Test mode is free, then a trial

Everything in test mode is free, for as long as you like: connect a gateway's test keys, create
products and run test payments.

Your free trial starts with your company's **first live payment**, and lasts the number of days your
plan gives (14 on the Standard plan). Live payments during the trial aren't billed.
**Settings → Billing** shows when your trial ends.

## What you pay for

Cloud is priced per **live product** each month. A product counts as live in a month when it starts at
least one live payment that month, whether or not the customer finishes paying. Products that only use
test mode, and the sample products, never count.

A plan can also include a **percentage of live volume**: a percentage of your successful live payments
above a monthly allowance, with an optional monthly cap. Payments in another currency are converted at
YaroPay's published rate before the allowance and cap apply. If your plan has no volume fee, none is
charged.

The prices for your plan are on **Settings → Billing**, and the current public prices are on
[yaropay.com](https://yaropay.com/#pricing). A price change always starts at the beginning of a month and
is shown on your Billing page beforehand, so a month you've already used is never repriced.

YaroPay never holds your money and never takes anything out of your payments: they settle from the
gateway straight to your account. Your bill is a separate invoice.

## Invoices

At the start of each month you get an invoice for the month before, by email and on
**Settings → Billing**: one line per live product, plus the volume fee if your plan has one. Months with
nothing to pay (test mode only, during the trial) have no invoice. Invoices are due seven days after
they're issued.

## Paying by card

An owner or admin can add a card on **Settings → Billing**. Paystack checks it with a small charge
(₦50, or $1 if you're billed in dollars) that is refunded straight away. After that:

- Each invoice is charged to the card the day it's issued, and you get a receipt by email.
- If a charge fails, we email the owners and try again every two days, up to four times.
- You can pay any open invoice by card from the Billing page, which also saves the card if none is
  saved. **Use another card** replaces it; **Remove** stops automatic charges.

If the Billing page says card payments aren't available yet, reply to the invoice email and we'll send
payment details instead.

## If something goes wrong with billing

Payments to your products never depend on your bill. A late invoice doesn't stop your gateway webhooks,
callbacks or deliveries to your products.

If an invoice is still unpaid after its due date, paid features pause and products that have never taken
a live payment can't start taking them. Products already taking live payments keep working, and test
mode is unaffected. Paying the invoice puts everything back straight away.

In rare cases (repeated unpaid invoices, or abuse) a company can be suspended. A suspended company's
team can't sign in and new payments are refused, but payments already started still complete and reach
your products. The owners get an email saying why.

## Who can see what

The YaroPay team can see your company's name, plan, team members, product names and status, how many
gateway accounts you have, and monthly usage totals, so we can bill you and help you. We never see your
gateway keys, your products' API keys or signing secrets.

When you ask for help, a member of the team can open a **support view** of your dashboard: read-only,
for at most an hour, with a reason. It shows what a viewer would see, including payments, and nothing
can be changed or exported while it's open. Each one is recorded in your audit log with the reason, and
your owners get an email when it starts. Team members who can open one must use two-step sign-in.
