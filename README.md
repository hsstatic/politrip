# PoliTrip

VIP tourism site for Türkiye (TR / EN / AR) with customer accounts, staff workspaces, and an owner console backed by [Convex](https://convex.dev).

## Local development

```bash
npm install
npx convex dev          # in a second terminal, or once to push schema
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the values.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Vercel | Canonical site URL for sitemap, robots, OG |
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | Convex **production** deployment URL |
| `DASHBOARD_PASSWORD` | Vercel | Owner bootstrap / recovery password |
| `ADMIN_EMAIL` | Vercel | Owner email. Used to create the first owner account. |
| `ADMIN_SECRET` | Vercel **and** Convex | Signs sessions and Convex identity tokens. Must match on both sides. |
| `RESEND_API_KEY` | Vercel (optional) | Sends password-reset emails in production |
| `EMAIL_FROM` | Vercel (optional) | Verified Resend from address, e.g. `PoliTrip <noreply@politrip.com.tr>` |

Set the Convex secret with:

```bash
npx convex env set ADMIN_SECRET "<same-value-as-vercel>"
```

If `ADMIN_SECRET` is omitted on Vercel, sessions are signed with `DASHBOARD_PASSWORD`. Convex still requires `ADMIN_SECRET` to be set to that same string or authenticated writes will fail closed.

## Accounts

- Customer sign up: `/sign-up` (always creates a customer — never owner/staff)
- Sign in: `/sign-in` (legacy `/admin/login` redirects here)
- Forgot / reset password: `/forgot-password`, `/reset-password`
- Customer account: `/account`
- Employee workspace: `/workspace`
- Owner / staff console: `/admin`
- Legacy `/dashboard/*` URLs redirect to `/admin/*`

The first owner is bootstrapped by signing in with `ADMIN_EMAIL` + `DASHBOARD_PASSWORD`. Employees are created/invited only from the owner console. Customers cannot escalate their role.

## Production checklist

1. Deploy Convex (`npx convex deploy`) so schema + permission-gated functions are live.
2. Set `ADMIN_SECRET` in the Convex dashboard to match Vercel.
3. Set `DASHBOARD_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_SECRET`, `NEXT_PUBLIC_CONVEX_URL`, and `NEXT_PUBLIC_SITE_URL` on Vercel.
4. Default employee roles seed automatically on register, sign-in, and session refresh. No extra owner login step is required.
5. Confirm `/sign-in` rejects bad credentials, customers cannot open `/admin`, and employees cannot open owner-only pages.
6. Optionally set `RESEND_API_KEY` + `EMAIL_FROM` so `/forgot-password` emails a reset link.
