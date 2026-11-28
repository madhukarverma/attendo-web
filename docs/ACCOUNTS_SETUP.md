# Account setup checklist

Everything here is free and needs no card. Do it before Stage 0 (spec section 19.2). You create each
account and enter every secret yourself, in the service's own dashboard. Claude only ever needs the
variable **names** (spec 20.1), never the values.

Tick each box as you go.

## 1. GitHub

- [x] GitHub account, signed in on this computer (`gh` is logged in).
- [x] Repository `attendo-web`, created during setup.
- [x] **Make the repository public** (repository Settings › General › Danger Zone › Change visibility, or ask Claude to do it). On a public repository GitHub's free plan gives branch protection and unlimited Actions minutes, so the GitHub Student Developer Pack isn't needed. Secrets never go in the repository: they live only in the dashboards.
- [ ] Stage 0 (TG16), with Claude: a private repository `attendo-backups` that runs the weekly backup, so the encrypted dumps aren't downloadable from the public repository (Stage 0 plan, decision D3).
- Optional, any time later: the Student Developer Pack (education.github.com/pack) includes a free domain for a year, which Stage 10 can use instead of the `vercel.app` address.

## 2. Supabase (database, sign-in, storage)

- [x] Sign up at supabase.com with GitHub.
- [x] Create two projects, both in region **South Asia (Mumbai)**, in the organisation `Attendo` (Free plan):
  - `attendo-staging`;
  - `attendo-prod`.
  - Settings for both: no GitHub repository connected, Data API on, "Grant API access to new tables automatically" off (migrations grant access explicitly), "Enable RLS on new tables automatically" on, Postgres type default.
- [x] Save each project's database password in your password manager. Don't paste it anywhere else.
- [x] Note where these live (Project Settings › API); Claude will tell you when to copy them into Vercel:
  - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
  - anon / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - service_role / secret key → `SUPABASE_SERVICE_ROLE_KEY` (secret: Vercel only, never in code)

## 3. Vercel (hosting)

- [x] Sign up at vercel.com with GitHub (Hobby plan).
- [ ] Don't import the repository yet. In Stage 0 (TG14) you import it in the Vercel dashboard, and Claude tells you which settings to choose: root directory `apps/web`, Node 26.x, production branch `production`, preview protection on. The function region, Mumbai (`bom1`), is set in the code (`apps/web/vercel.json`), so there's no Vercel CLI.

## 4. Google sign-in (Google Cloud)

- [x] Signed in as the Attendo Gmail account (section 5), go to console.cloud.google.com and create a project named `Attendo`. Students see the support email on Google's sign-in screen, so it shows the Attendo address, not your personal one. Don't start the $300 free trial: it needs a card and isn't used.
- [x] Set up the OAuth consent screen (Google Auth Platform): app name "Attendo", audience External, the Attendo Gmail as support and contact email. It stays in "Testing" until the privacy and terms pages exist; your personal Google account is a test user.
- [x] Create an OAuth client of type Web application named `Attendo Supabase`: JavaScript origin `http://localhost:3000`; redirect URIs are the Supabase callback URL of both projects (`https://<project-ref>.supabase.co/auth/v1/callback`).
- [x] The client ID and secret go into Supabase (Authentication › Sign In / Providers › Google, in both projects), not into the code. Google shows a secret only once; keep it in your password manager.
- [ ] Stage 0, with Claude: add the Vercel address to the client's Authorized JavaScript origins.

## 5. Gmail for sending Attendo's emails

- [x] Create a new Gmail account just for Attendo (for example attendo.app.noreply@gmail.com, if it's free).
- [x] Turn on 2-Step Verification for that account.
- [x] Create an App password named `Supabase SMTP` (myaccount.google.com/apppasswords) and save it in your password manager. A second one, `Vercel nodemailer`, is created later for the app's own emails, so each can be revoked on its own.
- [ ] Stage 1, with Claude: enter it in Supabase (Authentication › SMTP settings) and later in Vercel as `SMTP_PASS`. Host `smtp.gmail.com`, port `587`.

## 6. Sentry (error tracking)

- [x] Sign up at sentry.io (Developer plan, free) and create a Next.js project named `attendo-web` (organisation `attendo-j2`).
- [x] In the project's Security & Privacy settings, turn on "Prevent Storing of IP Addresses" and keep the data scrubbers on (SEC-S-024).
- [ ] Keep the DSN handy (`NEXT_PUBLIC_SENTRY_DSN`). Claude tells you when you need an auth token.

## 7. Upstash (rate limiting)

- [x] Sign up at upstash.com and create a Redis database in region **ap-south-1 (Mumbai)**, free plan. One database named `attendo`, shared by staging and production with separate key prefixes.
- [ ] The REST URL and token become `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

## 8. Cloudflare Turnstile (bot checks)

- [x] Sign up at cloudflare.com (free) and open Turnstile. No domain is needed: skip "Add a domain" and the plan picker.
- [ ] Stage 0, with Claude: add a widget. Use your Vercel address once you have it (`<project>.vercel.app`), plus `localhost`.
- [ ] Stage 0, with Claude: the site key becomes `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the secret key becomes `TURNSTILE_SECRET_KEY`.

## 9. UptimeRobot (uptime)

- [ ] Stage 0, with Claude: sign up at uptimerobot.com (free). Its sign-up asks for the website to monitor, so it waits until the `vercel.app` address exists. The full monitors follow once the site is live (Stage 1).

## 10. Backup encryption key (spec 16.4)

- [ ] In Stage 0, Claude gives you a one-line command to make an `age` key pair.
- [ ] Keep the private key offline, for example on a USB drive and in your password manager.
- [ ] Give Claude only the public key (it starts with `age1`).

## 11. Two-factor sign-in on the dashboards

These dashboards hold the keys to the app, so each gets two-factor sign-in with an authenticator
app. GitHub matters most: a hijacked GitHub account could change the code itself.

- [x] GitHub
- [x] Cloudflare
- [x] Supabase
- [x] Vercel
- [x] Upstash
- [x] Sentry
- [x] The Attendo Gmail account (2-Step Verification, section 5)

## 12. This computer (local tools)

Run these in a PowerShell window opened from the Start menu, not inside the Claude app: the app is
a packaged Windows app, so tools installed from inside it land in a private folder other programs
can't see. Lines marked (admin) need "Run as administrator".

- [x] Long file paths on (admin): `New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force`
- [x] WSL 2 (admin): `wsl --install --no-distribution`, then restart the computer.
- [x] Docker Desktop (free for personal and education use): `winget install -e --id Docker.DockerDesktop`. Skip the Docker sign-in. Needed for `supabase start` and `supabase test db`.
- [x] Docker's disk on `D:`: Docker Desktop › Settings › Resources › Advanced › Disk image location, pick a folder such as `D:\Docker`, then Apply & restart. Drive `C:` has under 8 GB free and the local Supabase images need several GB.
- [x] Node.js 26 LTS (Vercel's default, spec 3.1). First remove Node 23.11, which is past end of life and sits at `E:\`, earlier on PATH than a new install: `winget uninstall -e --id OpenJS.NodeJS.23`. Then `winget install -e --id OpenJS.NodeJS.LTS`. Check with `node --version` in a new window: it should say v26.
- [x] pnpm 10: `npm install -g pnpm@10.34.9` in a new window. Node 26 no longer ships Corepack, so pnpm is installed with npm; the repository pins the exact version in `packageManager`.
- [x] age, for the backup key (section 10): `winget install -e --id FiloSottile.age`.
- [x] Stage 0 (TG2): gitleaks, which checks every commit for secrets before it's made: `winget install -e --id Gitleaks.Gitleaks`.
- [ ] Stage 0 (TG19): the TypeScript language server, for Claude's code intelligence: `npm install -g typescript-language-server typescript`.

The Supabase CLI comes with the project in Stage 0, so it needs no global install. There's no
Vercel CLI: the project is set up in the Vercel dashboard. Semgrep and OSV-Scanner run in CI only;
gitleaks runs both in CI and before each commit.

## Where each secret goes (summary)

| Variable | Set in |
|---|---|
| `NEXT_PUBLIC_*` (Supabase URL and anon key, Turnstile site key, Sentry DSN, VAPID public key, site URL) | Vercel environment variables |
| `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `VAPID_PRIVATE_KEY`, `UPSTASH_*`, `TURNSTILE_SECRET_KEY`, `ICAL_TOKEN_PEPPER`, `SMTP_*`, `OWNER_ALERT_EMAIL` | Vercel environment variables (never in code) |
| Google client ID and secret, Gmail SMTP | Supabase Auth settings |
| `SUPABASE_DB_URL`, `SUPABASE_ACCESS_TOKEN` | GitHub › repository Settings › Environments: `staging` and `production` each get their own values |
| `SENTRY_AUTH_TOKEN`, `BACKUP_AGE_PUBLIC_KEY`, `VERCEL_AUTOMATION_BYPASS_SECRET` | GitHub › repository Settings › Secrets and variables › Actions |
| Production `SUPABASE_DB_URL` (backups), `BACKUP_AGE_PUBLIC_KEY` | Also in the private `attendo-backups` repository's Actions settings |

When every box is ticked except the ones marked "Stage 0" or "Stage 1" (including sections 11 and
12), tell Claude "accounts ready" and start Stage 0.
