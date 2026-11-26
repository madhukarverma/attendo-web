# Status

The handoff note between sessions. Read it at the start of every session and update it at the
end of every task group: tick the box, then rewrite "Next action" and "Open issues". Never put
secret values here.

Last updated: 27 Nov 2026

## Stages

| Stage | Name | State |
|---|---|---|
| 0 | Foundations | In progress: plan approved 27 Nov 2026 |
| 1 | Identity, onboarding, college pack, public landing | Not started |
| 2 | Attendance core | Not started |
| 3 | Timetable and calendar | Not started |
| 4 | Class groups, roles, moderation | Not started |
| 5 | Notifications | Not started |
| 6 | Tasks, focus, syllabus | Not started |
| 7 | Statistics, grades, insights, reports | Not started |
| 8 | Friends, data rights, feedback | Not started |
| 9 | Full console, personalisation | Not started |
| 10 | Hardening and launch | Not started |

## Stage 0 task groups

The plan is in [stage-00-plan.md](stage-00-plan.md). There's one PR per task group.

- [ ] TG1 `docs/stage0-plan`: save the plan and status
- [ ] TG2 `chore/stage0-monorepo`: monorepo, toolchain, first CI
- [ ] TG3 `chore/stage0-claude-hooks`: hooks, permissions, quiet output, map check
- [ ] TG4 `chore/stage0-claude-agents`: rules, reviewer, skills
- [ ] TG5 `docs/stage0-adrs`: ADRs 0001 to 0023
- [ ] TG6 `feat/stage0-core`: Clock and IDs
- [ ] TG7 `feat/stage0-ui-tokens`: tokens and contrast
- [ ] TG8 `feat/stage0-ui-motion`: motion registry and Storybook
- [ ] TG9 `feat/stage0-db`: Supabase base schema
- [ ] TG10 `feat/stage0-web-skeleton`: Next.js app and placeholder routes
- [ ] TG11 `feat/stage0-web-security`: env validation, headers, proxy
- [ ] TG12 `feat/stage0-web-routes`: health, internal guards, logger, errors
- [ ] TG13 `ci/stage0-gates`: remaining required gates
- [ ] TG14 `feat/stage0-services`: Vercel, Sentry, preview checks
- [ ] TG15 `ci/stage0-nightly`: nightly runs, Dependabot, final protection
- [ ] TG16 `ops/stage0-backup`: keep-alive, backup, restore drill
- [ ] TG17 `docs/stage0-docs`: CLAUDE.md, README, CONTRIBUTING, architecture, traceability
- [ ] TG18 `docs/stage0-security`: threat model v1 and runbooks
- [ ] TG19 `docs/stage0-close`: evidence, LSP, UAT

## Next action

Merge the TG1 pull request, then start TG2 (monorepo, toolchain, first CI).

## Owner steps coming up

- TG2: install gitleaks from a Start-menu PowerShell (`winget install -e --id Gitleaks.Gitleaks`).
- TG9: put `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_URL` in the GitHub `staging` environment, then
  run `supabase login` and `supabase link` once in your own terminal.
- TG14: Vercel import and settings, environment variables, the protection bypass secret, Supabase
  Auth redirect URLs, the Turnstile widget, the Google OAuth origin, the UptimeRobot sign-up.
- TG16: the age key pair, the private `attendo-backups` repo and its secrets, the restore drill.
- TG19: install the TypeScript language server, then run the UAT.

## Open issues

- None yet.
