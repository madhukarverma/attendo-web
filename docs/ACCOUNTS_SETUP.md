# Account setup checklist

Everything here is free and needs no card. Do it before Stage 0 (spec section 19.2). You create each
account and enter every secret yourself, in the service's own dashboard. Claude only ever needs the
variable **names** (spec 20.1), never the values.

Tick each box as you go.

## 1. GitHub (done)

- [x] GitHub account, signed in on this computer (`gh` is logged in).
- [x] Private repository `attendo-web`, created during setup.
- [ ] **GitHub Student Developer Pack:** apply at education.github.com/pack with your college email or ID. It gives you GitHub Pro, which unlocks branch protection on private repositories and 3,000 Actions minutes a month. Approval can take a few days.

## 2. Supabase (database, sign-in, storage)

- [ ] Sign up at supabase.com with GitHub.
- [ ] Create two projects, both in region **South Asia (Mumbai)**:
  - `attendo-staging`;
  - `attendo-prod`.
- [ ] Save each project's database password in your password manager. Don't paste it anywhere else.
- [ ] Note where these live (Project Settings › API); Claude will tell you when to copy them into Vercel:
  - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
  - anon / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - service_role / secret key → `SUPABASE_SERVICE_ROLE_KEY` (secret: Vercel only, never in code)

## 3. Vercel (hosting)

- [ ] Sign up at vercel.com with GitHub (Hobby plan).
- [ ] Don't import the repository yet. Claude sets up the project in Stage 0 and tells you which settings to choose: production branch `production`, function region Mumbai (`bom1`), preview protection on.

## 4. Google sign-in (Google Cloud)

- [ ] Go to console.cloud.google.com and create a project named `Attendo`.
- [ ] Set up the OAuth consent screen: app name "Attendo", user type External, your support email.
- [ ] Create an OAuth client ID of type Web application. Claude gives you the exact redirect URL to paste, which comes from Supabase.
- [ ] The client ID and secret go into Supabase (Authentication › Providers › Google), not into the code.

## 5. Gmail for sending Attendo's emails

- [ ] Create a new Gmail account just for Attendo (for example attendo.app.noreply@gmail.com, if it's free).
- [ ] Turn on 2-Step Verification for that account.
- [ ] Create an App password (Google Account › Security › App passwords).
- [ ] Enter it in Supabase (Authentication › SMTP settings) and later in Vercel as `SMTP_PASS`. Host `smtp.gmail.com`, port `587`.

## 6. Sentry (error tracking)

- [ ] Sign up at sentry.io (Developer plan, free) and create a Next.js project named `attendo-web`.
- [ ] Keep the DSN handy (`NEXT_PUBLIC_SENTRY_DSN`). Claude tells you when you need an auth token.

## 7. Upstash (rate limiting)

- [ ] Sign up at upstash.com and create a Redis database in region **ap-south-1 (Mumbai)**, free plan.
- [ ] The REST URL and token become `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

## 8. Cloudflare Turnstile (bot checks)

- [ ] Sign up at cloudflare.com (free) and open Turnstile.
- [ ] Add a widget. Use your Vercel address once you have it (`<project>.vercel.app`), plus `localhost`.
- [ ] The site key becomes `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the secret key becomes `TURNSTILE_SECRET_KEY`.

## 9. UptimeRobot (uptime)

- [ ] Sign up at uptimerobot.com (free). You'll add the monitors once the site is live (Stage 1).

## 10. Backup encryption key (spec 16.4)

- [ ] In Stage 0, Claude gives you a one-line command to make an `age` key pair.
- [ ] Keep the private key offline, for example on a USB drive and in your password manager.
- [ ] Give Claude only the public key (it starts with `age1`).

## Where each secret goes (summary)

| Variable | Set in |
|---|---|
| `NEXT_PUBLIC_*` (Supabase URL and anon key, Turnstile site key, Sentry DSN, VAPID public key, site URL) | Vercel environment variables |
| `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `VAPID_PRIVATE_KEY`, `UPSTASH_*`, `TURNSTILE_SECRET_KEY`, `ICAL_TOKEN_PEPPER`, `SMTP_*`, `OWNER_ALERT_EMAIL` | Vercel environment variables (never in code) |
| Google client ID and secret, Gmail SMTP | Supabase Auth settings |
| `SUPABASE_DB_URL`, `SUPABASE_ACCESS_TOKEN`, `SENTRY_AUTH_TOKEN`, `BACKUP_AGE_PUBLIC_KEY`, `VERCEL_AUTOMATION_BYPASS_SECRET` | GitHub › repository Settings › Secrets and variables › Actions |

When you've done sections 2 to 9, tell Claude "accounts ready" and start Stage 0.
