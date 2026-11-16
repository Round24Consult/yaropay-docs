# Team, roles and notifications

## Roles

| What they can do | Owner | Admin | Developer | Finance | Viewer |
|---|:-:|:-:|:-:|:-:|:-:|
| See the dashboard, payments, products, gateways, webhooks, settings and team | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export payments (CSV) | ✓ | ✓ | ✓ | ✓ | |
| See the audit log | ✓ | ✓ | ✓ | ✓ | |
| Edit products, rotate product keys, send test events, replay deliveries | ✓ | ✓ | ✓ | | |
| Delete products | ✓ | ✓ | | | |
| Install, rotate and remove gateway accounts | ✓ | ✓ | | | |
| Change settings and manage the team | ✓ | ✓ | | | |

- Owners can manage everyone; admins can manage developers, finance and viewers.
- Nobody can change their own role, and the last owner can't be removed.

## Limiting someone to some products

Developers, finance and viewers can be limited to chosen products. They then see only those products'
payments, deliveries and analytics, don't see unrouted gateway events, and can't create products.
Owners and admins always see every product.

## Inviting people

Settings → Team → **Invite member**. The invite link works once and for seven days. If email is set up,
YaroPay sends it; otherwise copy the link from the dialog and share it yourself.

- Someone new creates their account from the link.
- Someone who already has an account on this install (for example in another workspace, or removed
  earlier and invited back) joins with their existing password.

Removing a member signs them out of this workspace straight away. Their account and any other workspaces
they belong to stay.

## Workspaces

Everything (gateway accounts, products, payments, webhooks, team, settings and the audit log) belongs to
a workspace: one company. A Community install has one workspace. Cloud and Enterprise can have several;
people who belong to more than one switch between them from the company menu at the top of the sidebar.

## Notifications

| Event | Who gets it | Default |
|---|---|---|
| Webhook delivery failed (a warning after 3 failures, critical after the last) | People who can see webhooks, limited by product | In-app, email, alert |
| Unrouted gateway event | People who can see webhooks and every product | In-app |
| Invalid webhook signature | People who manage gateways | In-app, email, alert |
| Gateway rejected a request (for example bad keys) | People who can see gateways | In-app, email, alert |
| Keys rotated | People who can rotate product keys | In-app |
| New team member | People who can see the team | In-app |
| New sign-in to your account | You | In-app, email |

Each person chooses their channels under Settings → Notifications. To post alerts to Slack, Discord,
Teams or Mattermost, add an incoming-webhook URL under Settings → General.

## Audit log

Settings → Audit log records who did what and when: sign-ins aside, every change to settings, the team,
gateway accounts, products and keys, plus replays and sample data.
