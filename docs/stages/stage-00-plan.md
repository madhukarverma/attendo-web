# Stage 0 plan: Foundations (release: none, internal)

- Status: Approved by the Owner on 27 Nov 2026, with every recommendation.
- Decisions taken: D1 option 1 (Supabase CLI 3.x), D2 option 1 (pnpm 10.34.9), D3 option 2
  (private `attendo-backups` repo), D4 option 1 (TypeScript 6.0.3), D5 option 1 (add the two lint
  plugins), D6 option 1 (automated header check now, manual scan at the first production deploy),
  D7 option 1 (the Agent merges green, reviewed PRs and reports each one).
- Spec clarifications a to m are approved along with the plan.
- Progress is tracked in [STATUS.md](STATUS.md), not in this file.

## Context

Pre-Stage 0 is done: accounts with two-factor, the public repo, LF line endings and the local tools
on this PC (PRs 1 and 2). Stage 0 builds the empty but fully gated foundation that every later
stage stands on. That means the monorepo, the pinned toolchain, ADRs, a placeholder Next.js app with
the proxy, headers and env checks, the Supabase base schema with RLS and pgTAP, the core and ui
packages, CI and ops workflows, docs, and the Claude tooling you approved on 27 Nov. No feature
work starts in this stage.

Sources read: spec 0, 2, 3, 4.1 to 4.8, 6.0, 6.1, 6.5, 6.7, 6.8, 7, 9.2 to 9.5, 9.8, 11, 13, 14.1,
14.3, 15, 16, 18 (Stage 0 and 1), 19.2, 20.1, 20.4; `docs/ACCOUNTS_SETUP.md`; memories
`stage0-claude-tooling`, `graphify-deferred`, `local-installs-outside-claude-app`. Versions were
looked up on npm and GitHub on 27 Nov 2026.

---

## Decisions (spec 0.5, approved as recommended)

**D1. Supabase CLI major** (spec 3.3 says 2)
1. **3.x, pinned exactly (3.4.0 or the latest 3.x at install). Recommended.** 2.x has had no release
   since 3.0.0 shipped on 2 Nov; its last release, 2.122.1, came out that same day. v3 is also safer
   for an agent: commands target the local stack by default, and every change to a hosted project
   needs `--yes`, so a stray command can't touch staging or production. There's no v2 config to
   migrate. The CLI changes fast (a 4.0 is already in pre-release), so the pin is exact and
   Dependabot proposes bumps.
2. 2.122.1 (dist-tag `v2.stable`), following the spec table. Revisit when it stops getting fixes.

**D2. pnpm version** (spec 3.1: newest 10.x)
1. **Keep 10.34.9. Recommended.** 10.x is still maintained (10.34.9 shipped on 25 Oct, after 12.0),
   it's already installed, Vercel and `pnpm/action-setup` both support it, and you don't need to
   reinstall anything.
2. pnpm 12.23.0. Means a spec change, a global reinstall from a Start-menu terminal, and checking
   that Vercel supports it.

**D3. Where the weekly backup lives** (spec 16.4: an age-encrypted artifact in this repo)
On a public repo, anyone signed in to GitHub can download the workflow's artifacts. The dumps are
encrypted, but they're still student data leaving our hands.
1. Keep it in this repo, as the spec says. Safe while the private key stays offline. Simplest.
2. **A private repo `attendo-backups` (free) runs the backup. Recommended.** It calls a reusable
   workflow kept and reviewed in this repo, so the code stays here and only about 15 lines plus the
   secrets live there. Artifacts are private to you, and GitHub's 60-day auto-disable of scheduled
   workflows applies only to public repos. Cost is about 2 Actions minutes a week of the free 2,000
   a month, and a few MB of the free 500 MB of storage. The production `SUPABASE_DB_URL` is stored
   in two places (there for backups, here for release migrations from Stage 1).
3. Upload to the Attendo Google Drive. Needs a service-account key and a tool outside 3.3. Not
   recommended.

**D4. TypeScript major** (spec 3.3 says 5)
1. **6.0.3. Recommended.** It's the newest major the lint toolchain supports
   (`typescript-eslint` 8.74 accepts `>=4.8.4 <6.1.0`). 5.x has had no release since 5.9.3 in
   Sep 2025.
2. 5.9.3, following the spec table. Works everywhere, but hasn't been patched in 14 months.
3. 7.0.2: blocked for now, because `typescript-eslint` doesn't support it. Dependabot flags it
   when that changes, and the upgrade goes through an ADR.

**D5. Two lint plugins not in 3.3** (rule 0.4.5 needs your approval and an ADR)
1. **Add `@next/eslint-plugin-next` and `eslint-plugin-react-hooks`. Recommended.** Next.js 16 no
   longer ships `next lint`. These catch real bugs: hook rules, the React Compiler rules (PERF-N-010)
   and misuse of `next/link` and `next/image`. They're dev-only and cost nothing at runtime.
   Recorded in ADR-0024.
2. Lint only with the 3.3 list.

**D6. Proving "security headers grade A" on a protected preview** (Stage 0 exit gate)
securityheaders.com can't get past Vercel's preview protection: it would grade the login page.
1. **Automated header check plus a manual scan later. Recommended.** CI fetches the preview through
   the protection bypass header and asserts every SEC-S-028 header and the CSP rules that
   securityheaders.com grades. Grade A means all six headers are present and valid. You then run
   the manual securityheaders.com scan on the first production deploy (Stage 1), which SEC-S-028
   asks for at every release anyway.
2. Turn preview protection off for one deployment, scan it, then turn it back on. Breaks SEC-S-019
   for that window.

**D7. Who merges Stage 0 pull requests**
1. **I merge each PR myself, once every check is green and the reviewer pass is clean, and tell you
   each time. Recommended.** This follows spec 15.1 and 15.2: you approve production releases, and
   Stage 0 has none. If you want to look at a PR before it merges, say so.
2. You merge each PR yourself.

### Spec clarifications (approved along with the plan)

- a. `packages/core` may import `uuid`. Spec 4.4.3 puts the ID helpers in core, but 4.5 lets core
  import only `zod` and `date-fns`.
- b. The `profiles` foreign keys to institutions, programmes and terms are added in Stage 1, when
  those tables exist (in a new migration).
- c. The `feature_flags` rule "developer may write, on staging only" needs an environment marker,
  so it lands with the console's flags page (Stage 9). Stage 0 allows writes by admin and above
  only.
- d. Production has no deployment until Stage 1. Until then, the keep-alive pings the production
  Supabase REST endpoint directly with the public anon key; staging uses `/api/health`.
- e. Lighthouse CI in Stage 0 runs on `/` and `/sign-in`. `/app` (seeded) joins in Stage 1, once
  sign-in exists.
- f. The Release workflow (15.7) is written in Stage 1, the first release.
- g. No Vercel CLI dependency (it's not in 3.3). You import the project in the dashboard, and the
  region is pinned in `apps/web/vercel.json`. `docs/ACCOUNTS_SETUP.md` is updated to match.
- h. `.env.example` lists every name in 20.1 from Stage 0. Each variable becomes required in the
  stage whose code first reads it.
- i. GitHub Environments `staging` and `production` each hold their own `SUPABASE_DB_URL` (20.1
  lists one name).
- j. `packages/sync` is created in Stage 1 with the sync engine, not as an empty folder now (knip
  would fail on it).
- k. Upstash and Turnstile get env entries only in Stage 0. Their code comes in Stage 1.
- l. The local `supabase/config.toml` turns off services Attendo doesn't use (realtime, edge
  runtime, analytics), which keeps Docker light.
- m. Tests for spec items that have no ID name the section instead, for example
  `"4.4.3 attendance mark id is stable"`. `docs/traceability.md` lists them by section.

---

## Versions (input to ADR-0021, looked up 27 Nov 2026)

The rule (3.1) is to pin exactly, using the table's major while it's still supported. Each version
is checked again with `pnpm view` at install time.

| Package | 3.3 major | Pin | Note |
|---|---|---|---|
| Node | newest LTS on Vercel | 26.x (`.nvmrc`, `engines`, Vercel setting) | Vercel default is 26.x |
| pnpm | 10.x | 10.34.9 | D2 |
| Supabase CLI (`supabase`) | 2 | 3.x | D1 |
| `typescript` | 5 | 6.0.3 | D4 |
| `eslint` | 9 | 10.15.0 (fallback 9.39.5) | 9.x maintenance ended about Aug 2026. `jsx-a11y` 6.10.2 declares support only up to 9, but `eslint-config-next` 16.4.6 ships it with ESLint 9 and later. If it breaks on 10, I fall back to 9.39.5 and note it |
| `motion` | 12 | 14.x | No 12.x release since 13.0 (Aug 2026). Installed in TG8 only after checking that `LazyMotion`, `domAnimation` and `m.*` still exist; otherwise I stop and ask |
| `uuid` | 11 | 11.1.1 | 11.x is still patched: 11.1.1 shipped after 14.0. Table major kept |
| `web-push` 3, `nodemailer` 7 | | decided when first used | 3.x and 7.x look unmaintained (latest are 4.0.0 and 10.6.1) |
| Everything else with a 3.3 major | | latest in that major | e.g. next 16.4.6, react 19.3.1, tailwindcss 4.3.5, turbo 2.11.13, prettier 3.10.1, zod 4.6.7, @serwist/next 9.6.0, next-intl 4.16.2, supabase-js 2.119.2 |
| No major in 3.3 | | latest stable | vitest 5.1.2, storybook 10.6.9, @sentry/nextjs 11.19.0, knip 6.48.0, playwright 1.65.1, husky 9.1.7, lint-staged 17.6.2, commitlint 21.2.4, changesets 3.0.3 |

- A package first used in a later stage is pinned when it's added, and ADR-0021 is updated in that
  PR.
- **Supporting packages** that approved ones need (listed in ADR-0021, approved with this plan):
  `@types/node`, `@types/react`, `@types/react-dom`, `server-only` (named in SEC-S-002),
  `babel-plugin-react-compiler` (PERF-N-010), `@tailwindcss/postcss`, `vite`,
  `@vitejs/plugin-react`, `jsdom`, `@vitest/coverage-v8`, `webpack` (needed by
  `@storybook/nextjs`), `globals`, `eslint-import-resolver-typescript` (lets the boundaries rules
  resolve workspace imports).
- **CI-only tools** (not npm packages, pinned by version or commit SHA): gitleaks, Semgrep,
  OSV-Scanner, `supabase/setup-cli`, the PGDG `postgresql-client`, age.

---

## Task groups (one PR each, about 400 changed lines excluding tests and generated files)

Every PR follows the same steps:
- run the 15.5 gates locally;
- fill in the PR template;
- get a reviewer-agent pass in a fresh context (15.1);
- merge (D7);
- update the CLAUDE.md map in the same PR whenever a folder or key file is added (0.4.12);
- tick `docs/stages/STATUS.md`.

Each busy folder gets its own short `CLAUDE.md` in the PR that creates it (memory item 2). All
scripts are Node (`.mjs`), so they run on Windows and in CI.

**TG1 `docs/stage0-plan`: save the plan and status**
- Files:
  - `docs/stages/stage-00-plan.md` (this plan);
  - `docs/stages/STATUS.md` (current stage, task groups with checkboxes, next action, open issues);
  - `docs/ACCOUNTS_SETUP.md` (no Vercel CLI; gitleaks install line);
  - CLAUDE.md map row.
- Proof: docs only, reviewed in the PR.

**TG2 `chore/stage0-monorepo`: monorepo, toolchain, first CI**
- IDs: ADR-0003, ADR-0019, ADR-0021, SEC-S-001 (gitleaks), SEC-S-029 (audit), PERF-N-014, rule 0.4.11.
- Files:
  - root `package.json` (`packageManager`, `engines`, quiet scripts), `pnpm-workspace.yaml`
    (`onlyBuiltDependencies: [supabase]`), `.npmrc` (`save-exact`, `engine-strict`), `.nvmrc`,
    `turbo.json`;
  - `packages/config/` (strict `tsconfig.base.json`; ESLint flat preset with typescript-eslint
    strict type-checked, boundaries per 4.5, jsx-a11y, `no-explicit-any`, `ban-ts-comment` needing
    a reason, and a ban on `dangerouslySetInnerHTML` (SEC-S-009); Prettier config);
  - `.husky/pre-commit` (lint-staged plus `gitleaks protect --staged`; fails closed if gitleaks is
    missing), `.husky/commit-msg` (commitlint with a scope list);
  - `.changeset/config.json`, `knip.json`;
  - `.github/workflows/ci.yml` v1 (frozen install, format check, lint with zero warnings,
    typecheck, unit tests, knip, gitleaks, `pnpm audit --audit-level=high`, commitlint on the PR
    title);
  - `.github/pull_request_template.md` (15.3 sections and the 15.6 checklist),
    `.github/CODEOWNERS`;
  - `docs/adr/0021-pinned-versions.md`.
- Proof: CI green. A bad commit message is rejected and a staged fake key is blocked (both recorded
  in the evidence file).
- With your go-ahead at that step: interim branch protection (PRs only, linear history, `ci`
  required).
- Your step: `winget install -e --id Gitleaks.Gitleaks` in a Start-menu PowerShell.

**TG3 `chore/stage0-claude-hooks`: hooks, permissions, quiet output, map check** (memory items 4, 5, 6, 9)
- IDs: rule 0.4.12, 15.9.
- Files:
  - `.claude/hooks/guard.mjs` (PreToolUse). It blocks:
    - a Read of the spec or `seed/nitt_mca_curriculum.csv` without offset and limit;
    - a Bash command that prints either file whole;
    - edits to `.env*` other than `.env.example`;
    - edits to a migration that already exists on `origin/main`.

    Each block exits 2 with what to do instead.
  - `.claude/hooks/format.mjs` (PostToolUse on `Edit|Write`): prettier and `eslint --fix` on that
    file only. Silent on success; prints only the errors that remain.
  - `.claude/settings.json`:
    - registers the hooks;
    - denies reads of `pnpm-lock.yaml`, `.next/`, `coverage/`, `playwright-report/`,
      `test-results/`, `storybook-static/` and `.turbo/`;
    - denies Supabase hosted-change commands in both the v2 and v3 forms (`db push`,
      `--linked` and `--remote` resets, `link`);
    - enables `typescript-lsp@claude-plugins-official`.
  - `scripts/check-claude-map.mjs`: every path in every CLAUDE.md map exists. It runs in CI.
  - Quiet defaults:
    - vitest `dot` (failures still print in full);
    - Playwright `line`;
    - turbo `--output-logs=errors-only`.

    CI keeps the GitHub reporters.
- Proof: `node --test` covers every block and allow case of both hooks and the map check, and runs
  in CI. Live demo: a whole-spec Read gets blocked.

**TG4 `chore/stage0-claude-agents`: rules, reviewer, skills** (memory items 1, 7, 8)
- IDs: 15.1, 15.9.
- Files:
  - `.claude/rules/{migrations,core,sync,features,internal-jobs}.md`, each with a `paths:` frontmatter;
  - `.claude/agents/reviewer.md` (read-only tools, the 15.6 checklist, blocking and non-blocking
    findings);
  - `.claude/skills/status/SKILL.md` (progress bars from STATUS.md, plus the next action);
  - `.claude/skills/handoff/SKILL.md` (updates STATUS.md: state, next action, open issues; never
    secrets);
  - `docs/adr/0024-agent-tooling.md` (hooks, LSP plugin, D5 plugins, graphify deferred to a
    Stage 4 trial).
- Proof: `/status` prints the bar. The reviewer is run on TG4's own diff.

**TG5 `docs/stage0-adrs`: ADRs 0001 to 0023**
- IDs: section 2.
- Files: `docs/adr/0001-*.md` to `0023-*.md` (except 0021) from template 20.4, and
  `docs/adr/README.md` (index).
- Proof: map check, reviewer pass.

**TG6 `feat/stage0-core`: Clock and IDs**
- IDs: 4.4.3, 14.3, clarification a.
- Files:
  - `packages/core/src/clock.ts`: `Clock`, `systemClock`, `fixedClock`, and
    `TEST_NOW = 2026-09-15T09:00:00+05:30`;
  - `packages/core/src/ids.ts`:
    - the namespace constant;
    - `newId()` (v7, using the Clock);
    - the v5 helpers for `attendance_marks`, `habit_checkins` and `syllabus_progress`;
    - `user_preferences` id equals `user_id`;
  - `index.ts`, `CLAUDE.md`, vitest with a 95% coverage gate.
- Proof: v5 test vectors are computed independently with Python's `uuid.uuid5`. v7 tests check
  the version and variant bits, ordering, and the fixed clock.

**TG7 `feat/stage0-ui-tokens`: tokens and contrast**
- IDs: A11Y-N-002, DS-U-001, ADR-0012, ADR-0014.
- Files:
  - `packages/ui/tokens.css` (9.2 light and dark, 9.3 type scale, 9.4 spacing, 9.5 radius and
    shadows);
  - `packages/config/tailwind/theme.css` (Tailwind 4 `@theme` mapped to the tokens, scales
    limited to the spec values);
  - `packages/ui/src/color/oklch.ts` (OKLCH to sRGB, written by hand, no dependency);
  - `src/shape/concentric.ts`;
  - `CLAUDE.md`.
- Proof:
  - `contrast.test.ts` (A11Y-N-002) parses the real `tokens.css` and checks every listed pair in
    both themes (4.5:1 and 3:1). The converter is checked against reference values.
  - A concentric-radius test covers DS-U-001.
  - If a pair fails, only that token's L changes, in steps of 0.01, recorded in ADR-0014.
  - 80% coverage.

**TG8 `feat/stage0-ui-motion`: motion registry and Storybook**
- IDs: 9.8, SET-F-030 (the default rule only), ADR-0013.
- Files:
  - `packages/ui/motion/modes.ts`: `MotionMode`, `MotionTokens`, the Apple and None values, and
    `resolveMotionMode(choice, prefersReduced)`;
  - Storybook 10 with `@storybook/nextjs`, and Foundations stories (colours in both themes, type,
    spacing, radius and depth, motion tokens).
- Proof:
  - Unit tests: None disables everything, and reduced motion selects None unless the user chose
    Apple.
  - `storybook build` runs in CI when `packages/ui` changes.

**TG9 `feat/stage0-db`: Supabase base schema**
- IDs: SEC-S-003, SEC-S-008, 4.4.2, 4.6, 6.0, 6.1, 6.5, 6.7, 6.8, ADR-0005; clarifications b, c, l.
- `supabase/config.toml` from `supabase init`.
- One base migration:
  - extensions: `pgcrypto`, `pg_cron`, `pg_net`;
  - the 6.0 enums and `sync_seq_global`;
  - trigger functions `set_updated_at` and `set_sync_seq`;
  - `has_platform_role(...)`: `SECURITY DEFINER`, `search_path = public`;
  - `profiles`:
    - the 6.1 columns, `friend_code` unique, the 6.8 indexes;
    - column-level `GRANT UPDATE` for `display_name`, `avatar_url` and `share_*`;
  - an `auth.users` insert trigger that never fails:
    - display name falls back from metadata to Google's `full_name` to the email prefix;
    - consent fields come from metadata;
    - friend code from A-Z and 2-9 without 0, O, 1 or I, retried on collision;
  - `platform_roles`;
  - `audit_log`, insert-only: a trigger blocks updates and deletes even by the service role;
  - `feature_flags`, `job_runs`;
  - RLS with policies per 6.7, and the `audit_log_actions` view for developers;
  - `health()`, executable by anon;
  - explicit grants, because auto-grant is off.
- `packages/db`: generated `types.gen.ts` plus a CI drift check; `supabase/CLAUDE.md`.
- `.github/workflows/db-staging.yml`: applies migrations to staging when one is merged to `main`.
- `ci.yml` gains a `db` job:
  - `supabase start` (minimal) and `db reset`;
  - `supabase test db`;
  - the RLS coverage check;
  - the types drift check.
- Proof: pgTAP, in `supabase/tests/`:
  - every policy: owner allowed, another user denied, anon denied, each role;
  - trigger cases, including odd metadata and the friend-code format;
  - column-grant denials, for example a user setting `is_teacher_verified`;
  - `audit_log` immutability;
  - every definer function sets `search_path`.

  RLS coverage check: fails if any `public` table has RLS off, no policy, or a `true` policy
  (`sync_applied_ops` is the one allowed exception, once it exists).
- Your steps:
  - put `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_URL` in the GitHub `staging` environment;
  - once, in your own terminal, run `pnpm exec supabase login` and
    `pnpm exec supabase link --project-ref <staging ref>`. You type the database password
    yourself.

**TG10 `feat/stage0-web-skeleton`: Next.js app and placeholder routes**
- IDs: 4.3, 4.7, ADR-0004, ADR-0020, A11Y-N-001, PERF-N-010.
- Files:
  - `apps/web` on Next 16: `next.config.ts` with `reactCompiler`, `poweredByHeader: false` and
    typed routes;
  - every 4.3 route as a placeholder, in route groups `(public)`, `(auth)`, the app shell,
    `console` and `not-found`;
  - root layout: Bricolage Grotesque through `next/font`, `lang="en-IN"`, tokens loaded;
  - next-intl with a single locale, and `messages/en.json` (no em dashes);
  - Tailwind 4 through `@tailwindcss/postcss`;
  - `apps/web/CLAUDE.md`.
- Proof: Playwright `@smoke` runs on `next build && next start`:
  - the home page renders, with exactly one h1;
  - 404 works;
  - no console errors;
  - axe finds no serious or critical issues on every placeholder page, in both themes.

  CI builds the app and runs the smoke set on Chromium. Browsers are stored on `D:` through
  `PLAYWRIGHT_BROWSERS_PATH`.

**TG11 `feat/stage0-web-security`: env validation, headers, proxy**
- IDs: SEC-S-002, SEC-S-028, SEC-S-005 (the console block), SEC-S-017, SEC-S-026, ADR-0023;
  clarification h.
- Files:
  - `src/lib/env.ts` (`server-only`, Zod, checked at start-up from `instrumentation.ts`) and
    `src/lib/public-env.ts`;
  - `.env.example` with every 20.1 name, empty;
  - `src/lib/security/csp.ts`: a nonce policy for dynamic pages and a static policy for
    pre-rendered pages;
  - `next.config.ts` headers;
  - `src/proxy.ts`:
    - refreshes the session (`@supabase/ssr`) and sets the nonce;
    - redirects signed-out users to `/sign-in?next=` (with a safe-`next` sanitiser);
    - sends users to `/welcome` or `/onboarding` as 4.3 describes;
    - blocks `/console` without a platform role;
  - `src/lib/supabase/{server,browser,proxy}.ts`;
  - `productionBrowserSourceMaps: false`.
- Proof:
  - Unit tests:
    - env schema;
    - the CSP builder;
    - safe-`next` against `//evil`, `/\evil`, absolute and encoded URLs;
    - the proxy redirect matrix.
  - Playwright:
    - the static and nonce headers, with a different nonce on each request;
    - `/app` redirects to `/sign-in?next=%2Fapp`;
    - no `Access-Control-Allow-Origin: *`.
  - CI: no `.map` files in `.next/static`.

**TG12 `feat/stage0-web-routes`: health, internal guards, logger, errors**
- IDs: OPS-N-003, OPS-N-002, SEC-S-005 (cron secret), SEC-S-010, SEC-S-025.
- Files:
  - `/api/health`: `status`, `version`, `db` (via `rpc('health')`) and `time`; no-store, no
    secrets;
  - `src/server/internal/guard.ts`: `x-cron-secret` with a minimum of 32 bytes, compared with
    `timingSafeEqual`; fails closed when the secret is unset;
  - `/api/internal/{tick,daily,weekly}` placeholders (POST only);
  - `/api/ical/[file]`, returning 404 until Stage 3;
  - `src/lib/logger.ts` (JSON, hashed user ID, no personal data) and `src/lib/errors.ts`
    (`SYS-900`, generic body).
- Proof: unit tests for:
  - the guard (missing, short, wrong and right secret);
  - the health shape, with no secret values in the body;
  - logger keys;
  - generic error bodies with no stack trace.

**TG13 `ci/stage0-gates`: remaining required gates (15.5)**
- IDs: SEC-S-001, SEC-S-008, SEC-S-011, SEC-S-029, PERF-N-003, 14.1.
- Files:
  - `tools/semgrep/`: no string-built SQL and no `EXECUTE` with input; the service-role key used
    only under `src/server/internal/**`;
  - OSV-Scanner;
  - `scripts/check-public-env-leak.mjs`: builds with a unique dummy value for each server-only
    variable, then searches `.next/static` for them;
  - `scripts/check-bundle-budgets.mjs`: gzipped first-load JS per route against PERF-N-003;
  - coverage gates per package;
  - `scripts/check-pr-meta.mjs`: requirement IDs in the PR body; a changeset for user-facing paths,
    or "No changeset: reason";
  - Turbo `--affected` and caching.
- Proof: each script has `node --test` cases with fixtures. A seeded violation fails each gate once
  (recorded in the evidence file).

**TG14 `feat/stage0-services`: Vercel, Sentry, preview checks**
- IDs: OPS-N-001, SEC-S-024, SEC-S-019, SEC-S-027, PERF-N-002, D6.
- Files:
  - `apps/web/vercel.json` (`regions: ["bom1"]`);
  - `@sentry/nextjs`:
    - instrumentation;
    - `src/lib/sentry/scrub.ts` (`beforeSend` drops bodies, cookies, query strings, emails and
      IP addresses; the user is a hashed ID);
    - traces at 10%;
    - replay off;
    - no source-map upload until releases;
  - the Sentry host in the CSP allow-list;
  - env entries for Upstash and Turnstile;
  - `.github/workflows/preview.yml`: on a successful Vercel preview, runs Lighthouse CI on `/`
    and `/sign-in` and `scripts/check-headers.mjs` through the bypass header.
- Proof: scrubber unit tests, a Sentry config test, and green Lighthouse and header checks on the
  preview.
- Your steps in the dashboards (I give exact settings and names only, never values):
  - **Vercel:**
    - import the repo as `attendo-web`, with root `apps/web`, Node 26.x, production branch
      `production`, and Standard Protection;
    - turn on "Protection Bypass for Automation" and put its value in the GitHub secret
      `VERCEL_AUTOMATION_BYPASS_SECRET`;
    - add environment variables: Preview gets the staging values, Production gets the prod values.
  - **Supabase Auth:** staging redirect URLs `https://*-<team>.vercel.app/**`; production allows
    `SITE_URL` only.
  - **Then the steps waiting on the Vercel address:**
    - a Turnstile widget for the production address and `localhost`;
    - the Google OAuth JavaScript origin;
    - UptimeRobot sign-up.
  - **Together:** review the first preview build log for leaked values (SEC-S-027).

**TG15 `ci/stage0-nightly`: nightly runs, Dependabot, final protection**
- Files:
  - `nightly.yml`: the full Playwright set on Chromium, WebKit, Pixel 7 and iPhone 14, plus axe,
    Lighthouse, OSV and audit;
  - `.github/dependabot.yml`: npm and Actions, weekly, minor and patch grouped; actions pinned by
    SHA.
- With your go-ahead at that step: final branch protection, with every required check name, linear
  history and no force pushes.
- Proof: a manual dispatch of `nightly.yml` is green.

**TG16 `ops/stage0-backup`: keep-alive, backup, restore drill**
- IDs: OPS-N-007, 16.4, D3, clarification d.
- Files:
  - `keep-alive.yml`, every 3 days: staging `/api/health` must report `db: "ok"`; production gets
    a REST ping until Stage 1;
  - `.github/workflows/backup-reusable.yml`:
    - finds the server's Postgres major and installs the matching `pg_dump`;
    - pipes the dump straight into `age -r $BACKUP_AGE_PUBLIC_KEY`, so no plaintext touches the
      disk;
    - uploads a 30-day artifact and logs only its size and checksum;
  - the caller, in `attendo-backups` (D3 option 2) or here (option 1);
  - `docs/runbooks/restore.md`.
- Drill:
  - You run `age-keygen` with the private key written to your USB drive, and set the Actions
    variable `BACKUP_AGE_PUBLIC_KEY`.
  - You add one test user `drill@example.com` in staging Auth.
  - You dispatch the backup for staging, download it and decrypt it locally.
  - I restore it into the local `supabase start` database and check row counts, the profile, RLS
    and pgTAP. Then the decrypted file is deleted.
  - Timings are recorded against RTO 4 h.
- Proof: green keep-alive run, the drill evidence, and the artifact visible only to you (option 2).

**TG17 `docs/stage0-docs`: CLAUDE.md, README, CONTRIBUTING, architecture, traceability**
- IDs: 15.8, 15.9, 0.3.
- Files:
  - `CLAUDE.md` rewritten to 15.9: under 100 lines, with the map, the 0.4 rules, a 0.2 summary,
    the commands, "Common tasks", and the existing "Finding things" rules;
  - `README.md`, `CONTRIBUTING.md`;
  - `docs/architecture.md` (section 4 summary and the diagram);
  - `docs/traceability.md` (Stage 0 rows);
  - `scripts/check-traceability.mjs`: each listed ID has a test name containing it, unless it's a
    manual check.
- Proof: map check and traceability check in CI.

**TG18 `docs/stage0-security`: threat model v1 and runbooks**
- IDs: SEC-S-030, 16.3.
- Files:
  - `docs/security/threat-model.md`: STRIDE in detail for the Stage 0 surface (proxy, headers,
    health and internal routes, CI/CD and secrets, base schema), and one row for each planned
    module;
  - `docs/runbooks/{incident,data-breach,rotate-secrets,free-tier,supabase-paused}.md`. The
    `supabase-paused` runbook includes GitHub's 60-day schedule auto-disable.
- Proof: reviewer pass.

**TG19 `docs/stage0-close`: evidence, LSP, UAT**
- `docs/stages/stage-00-evidence.md`:
  - CI links;
  - pgTAP and contrast output;
  - the header check;
  - a preview screenshot;
  - the drill timings;
  - the build-log review.
- Your step: `npm install -g typescript-language-server typescript` in a Start-menu PowerShell.
  I then check that the LSP plugin answers.
- UAT (you):
  - open the preview and see the placeholder home in light and dark;
  - see `main` green in Actions;
  - see branch protection in Settings;
  - see the backup artifact and its privacy;
  - run `/status`.
- On "accepted": STATUS.md shows Stage 0 done. There's no release in Stage 0.

---

## Exit gates and where they're proven

| Gate | Proven in |
|---|---|
| All CI checks green on an empty app | TG15 final run on `main`, linked in the evidence file |
| Preview renders the placeholder home with headers grade A | TG14 (D6) |
| `supabase test db` passes | TG9, then every PR |
| Contrast test passes | TG7, then every PR |
| STATUS.md shows Stage 0 done | TG19, after your UAT |

## Risks

- **Bundle budgets:** Next 16 Turbopack output may lack the old per-route manifest. I'll compute
  sizes from the client reference manifests; if that can't be done reliably, I stop and ask, with
  the analyzer report (PERF-N-003).
- **New majors:** ESLint 10 with jsx-a11y, TS 6 with Next and Storybook, and the motion 14 API are
  each checked at install. Each has a fallback, and I ask before taking it.
- **Supabase pausing:** a free project pauses after 7 days idle. If production pauses before TG16,
  you restore it in the dashboard with one click.
- **Disk:** C: has about 10 GB free. Docker, the pnpm store and the Playwright browsers all live
  on D:.

## Verification

- Every PR: the 15.5 gates pass locally, then in CI; the reviewer pass is clean.
- End of stage: on a fresh clone, `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`,
  `pnpm test`, `supabase start`, `supabase db reset`, `supabase test db`, `pnpm build`, then the
  Playwright smoke set. After that, the preview check and keep-alive runs are green, and the restore
  drill is recorded.
